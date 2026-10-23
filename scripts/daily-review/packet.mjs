#!/usr/bin/env node
// Builds the per-page context packet the review agent receives as its only user message.
// Usage: node scripts/daily-review/packet.mjs <id>
// Contains: validator output, the three MDX files, one line per dependency (from the
// content index, not the full files), a compact diagram summary and, only when the page
// has a diagram, the diagram rules. Static rules live in the system prompt (cached).
import fs from 'fs';
import path from 'path';
import { spawnSync } from 'child_process';
import {
  ROOT, LANGS, listNodes, nodePath, metaString, metaFlag, linkTargets, diagramImports, extractSection,
} from './lib.mjs';

const id = process.argv[2];
const nodes = listNodes();
const node = nodes.get(id);
if (!node) {
  console.error(`No existe content/mdx/es/**/${id}.mdx`);
  process.exit(2);
}

const index = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/data/content/contentIndex.json'), 'utf8'));
const stripAnsi = (s) => s.replace(/\x1b\[[0-9;]*m/g, '');
const out = [];
const section = (title, body) => out.push(`## ${title}\n\n${body.trim()}\n`);
const fence = (lang, body) => `\`\`\`${lang}\n${body.trimEnd()}\n\`\`\``;

// ── Cabecera
const progress = fs.readFileSync(path.join(ROOT, 'docs/progreso-reescritura.md'), 'utf8');
const row = progress.split('\n').find((l) => l.startsWith(`| [\`${id}\`]`));
const status = !row ? 'sin registrar en docs/progreso-reescritura.md'
  : row.includes('✅') ? 'aprobado por la autora (revisa igual: puede haber cambiado)'
  : 'reescrito, en espera de revisión de la autora';
out.push(`# Página a revisar: \`${id}\`\n`);
out.push(`- Tipo: \`${metaString(node.source, 'type')}\` · carpeta \`${node.folder}\``);
out.push(`- Estado editorial: ${status}`);
out.push(`- Archivos: ${LANGS.map((l) => `\`${nodePath(node, l)}\``).join(', ')}\n`);

// ── Validación automática
const val = spawnSync('node', ['.agents/skills/matematika-content-generator/scripts/validate-nodes.mjs', id], {
  cwd: ROOT, encoding: 'utf8',
});
section('Salida de validate-nodes', fence('text', stripAnsi(`${val.stdout}${val.stderr}`)));

// ── Los tres idiomas
for (const lang of LANGS) {
  const file = path.join(ROOT, nodePath(node, lang));
  const body = fs.existsSync(file) ? fs.readFileSync(file, 'utf8') : '(FALTA ESTE ARCHIVO)';
  section(`MDX \`${lang}\``, fence('mdx', body));
}

// ── Contexto del grafo: una línea por nodo enlazado
const describe = (target) => {
  const entry = index[target];
  if (!entry) return `\`${target}\` — (aún no existe)`;
  const m = entry.metadata ?? {};
  return `\`${target}\` — ${m.type} · «${m.title}»: ${m.statement ?? m.description ?? ''}`;
};
const { deps, others } = linkTargets(node.source);
const parent = metaString(node.source, 'parentTheorem');
const graph = [];
if (parent) graph.push(`**Teorema que demuestra (parentTheorem):**\n- ${describe(parent)}`);
graph.push(`**Dependencias declaradas (isDependency, ${deps.length}):**\n${deps.map((d) => `- ${describe(d)}`).join('\n') || '- ninguna'}`);
const dependents = [...nodes.values()].filter((n) => linkTargets(n.source).deps.includes(id)).map((n) => n.id);
graph.push(`**Nodos que dependen de este (${dependents.length}):** ${dependents.map((d) => `\`${d}\``).join(', ') || 'ninguno'}`);
graph.push(`**Otros enlaces (sin dependencia):** ${others.map((o) => `\`${o}\`${index[o] ? '' : '∅'}`).join(', ') || 'ninguno'}  (∅ = página aún no escrita)`);
section('Contexto en el grafo', graph.join('\n\n'));

// ── Diagrama
const diagrams = diagramImports(node.source);
const flags = `hasSimulation: ${metaFlag(node.source, 'hasSimulation')} · hasDiagram: ${metaFlag(node.source, 'hasDiagram')}`;
if (diagrams.length === 0) {
  section('Diagrama', `La página no importa ningún diagrama (${flags}). Decide si debería tenerlo (ver «Criterio de diagrama» en tus instrucciones).`);
} else {
  const parts = [`Metadatos: ${flags}`];
  for (const file of diagrams) parts.push(summarizeDiagram(file));
  section('Diagrama', parts.join('\n\n'));
  section('Normas de diagramas (solo para esta revisión)', diagramRules());
}

process.stdout.write(out.join('\n'));

// Compact view of a v3 spec: one JSON line per object/step, dropping editor bookkeeping
// (layer, order, lock, selection role) that never affects mathematics or pedagogy.
function summarizeDiagram(rel) {
  const abs = path.join(ROOT, rel);
  const NOISY_APPEARANCE = new Set(['size', 'highlightSize', 'preserveColorOnHighlight', 'labelVisible']);
  if (!fs.existsSync(abs)) return `### \`${rel}\`\n\nNO EXISTE el archivo importado.`;
  const src = fs.readFileSync(abs, 'utf8');
  const m = src.match(/@matematika-diagram-spec:start \*\/([\s\S]*?)\/\* @matematika-diagram-spec:end/);
  if (!m) {
    return `### \`${rel}\` (legado: sin marcadores v3)\n\nNo usa la spec v3: es un hallazgo en sí. Código completo:\n\n${fence('tsx', src.slice(0, 12000))}`;
  }
  const body = m[1];
  let spec;
  try {
    spec = JSON.parse(body.slice(body.indexOf('createDiagramSpec(') + 18, body.lastIndexOf(')')).trim().replace(/,\s*$/, ''));
  } catch (e) {
    return `### \`${rel}\`\n\nNo se pudo leer la spec como JSON (${e.message}). Léela con Read si la necesitas.`;
  }
  const drop = new Set(['layerId', 'order', 'locked']);
  // Steps repeat every object's state; keep only what changes something: emphasis,
  // overlays, and a hidden state on an object the step lists as visible (a contradiction).
  const compactStep = ({ objectStates = {}, visibleTargets = [], ...step }) => {
    const emphasis = {};
    const notes = {};
    for (const [oid, st] of Object.entries(objectStates)) {
      if (st.emphasis && st.emphasis !== 'none') emphasis[oid] = st.emphasis;
      if (st.visible === false && visibleTargets.includes(oid)) notes[oid] = 'oculto pese a visibleTargets';
      if (st.interactive === false) notes[oid] = [notes[oid], 'no interactivo'].filter(Boolean).join(', ');
      if (st.overlay?.visible) notes[oid] = [notes[oid], `overlay ${JSON.stringify(st.overlay)}`].filter(Boolean).join(', ');
    }
    return JSON.stringify({ ...step, visibleTargets, emphasis, ...(Object.keys(notes).length ? { notes } : {}) });
  };
  const compactObj = (o) => {
    const c = {};
    for (const [k, v] of Object.entries(o)) {
      if (drop.has(k)) continue;
      if (k === 'groupIds' && v.length === 0) continue;
      if (k === 'interaction' && Object.keys(v).length === 0) continue;
      if (k === 'selection') { if (v.ariaLabel) c.aria = v.ariaLabel; continue; }
      if (k === 'targetId' && v === o.id) continue;
      if (k === 'appearance') {
        const a = Object.fromEntries(Object.entries(v).filter(([ak]) => !NOISY_APPEARANCE.has(ak)));
        if (Object.keys(a).length) c[k] = a;
        continue;
      }
      c[k] = v;
    }
    return JSON.stringify(c);
  };
  const lines = [
    `### \`${rel}\` — ${spec.title} · mode \`${spec.mode}\` · ${spec.objects.length} objetos · ${spec.steps.length} pasos`,
    `viewport ${JSON.stringify(spec.viewport.bounds)} · axis ${spec.axis} · grid ${spec.grid}${spec.note ? `\nnota: ${JSON.stringify(spec.note)}` : ''}`,
    `**Objetos** (target = enlazable con VisualBind):\n${spec.objects.map((o) => `- ${compactObj(o)}`).join('\n')}`,
  ];
  if (spec.groups.length) lines.push(`**Grupos:**\n${spec.groups.map((g) => `- ${JSON.stringify(g)}`).join('\n')}`);
  if (spec.relations.length) lines.push(`**Relaciones:**\n${spec.relations.map((r) => `- ${JSON.stringify(r)}`).join('\n')}`);
  if (spec.steps.length) lines.push(`**Pasos:**\n${spec.steps.map((s) => `- ${compactStep(s)}`).join('\n')}`);
  lines.push(`**Traducciones:**\n${fence('json', JSON.stringify(spec.translations))}`);
  return lines.join('\n\n');
}

function diagramRules() {
  const skill = fs.readFileSync(path.join(ROOT, '.agents/skills/matematika-diagram-generator/SKILL.md'), 'utf8');
  const style = fs.readFileSync(path.join(ROOT, '.agents/skills/matematika-diagram-generator/references/paleta-y-estilos.md'), 'utf8');
  return [
    extractSection(skill, '## 1. Principios Fundamentales'),
    extractSection(skill, '## 3. Vinculación con los Artículos MDX'),
    extractSection(skill, '### E. Controles Genéricos y Modelado de Causalidad Didáctica'),
    style,
  ].join('\n\n').replace(/^#/gm, '##');
}
