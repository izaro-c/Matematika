#!/usr/bin/env node
// Lints one or more content nodes (all three languages) against the project's hard rules.
// Usage: node lint-node.mjs <id> [<id>...]     (run from the repo root)
//        node lint-node.mjs --all              (every node; slow output, use for audits)
// Exit code 1 if any ERROR is found. WARN lines are judgement calls: read them and decide.
//
// Checks: metadata (id = filename, lang = folder, type = folder, registered MSC branch,
// extends/builtIn shape), JSX inside KaTeX, unregistered MDX components, forbidden
// framework preambles, DAG rules (theorem → own demo, demo → parentTheorem, self-dependency,
// isDependency in biographies), SeccionPropiedades in axioms/systems, Satz numbers,
// ℓ ⊆ π, kebab-case and canonical targetIds, VisualBind colours, and VisualBind / ProofStep diagramStep ↔ diagram spec.
import fs from 'fs';
import path from 'path';

const ROOT = process.cwd();
const CONTENT = path.join(ROOT, 'content/mdx');
const LANGS = ['es', 'en', 'eu'];
const PALETTE = ['carbon', 'terracota', 'canela', 'mora', 'ocre', 'pavo', 'granada', 'musgo'];
const FOLDER_TYPES = {
  'axiomatic-systems': ['sistema-axiomatico'],
  axioms: ['axioma'],
  definitions: ['definicion'],
  demonstrations: ['demostracion'],
  examples: ['ejemplo'],
  exercises: ['ejercicio'],
  mathematicians: ['matematico'],
  methods: ['metodo'],
  models: ['modelo'],
  plans: ['plan-de-estudio'],
  theorems: ['teorema', 'lema', 'corolario'],
  usecases: ['caso-de-uso'],
};
// Paragraph openings that announce the global framework (see SKILL.md, «sin muletillas»).
const PREAMBLES = [
  /^(En|Dentro de) (la|el) (geometría sintética|fundamentación|sistema axiomático|marco)/i,
  /^In (synthetic geometry|Hilbert's (foundation|framework)|the (axiomatic system|framework))/i,
  /^(Geometria sintetikoan|Hilberten oinarri|Sistema axiomatikoaren barruan)/i,
];

if (!fs.existsSync(CONTENT)) {
  console.error('Ejecuta desde la raíz del repositorio (no existe content/mdx).');
  process.exit(2);
}

const args = process.argv.slice(2);
if (!args.length) {
  console.error('Uso: node lint-node.mjs <id> [<id>...] | --all');
  process.exit(2);
}

function listMdx(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const full = path.join(dir, e.name);
    return e.isDirectory() ? listMdx(full) : e.name.endsWith('.mdx') ? [full] : [];
  });
}

const allFiles = LANGS.flatMap((l) => listMdx(path.join(CONTENT, l)));
const ids = args[0] === '--all'
  ? [...new Set(allFiles.filter((f) => f.includes('/es/')).map((f) => path.basename(f, '.mdx')))]
  : args;

const registry = (() => {
  const src = fs.readFileSync(path.join(ROOT, 'src/components/mdx/MDXBlocks.tsx'), 'utf8');
  const block = src.match(/export const MDXComponents\s*=\s*\{([\s\S]*?)\n\};?/)?.[1] ?? '';
  return new Set([...block.matchAll(/^\s*([A-Z]\w*)\s*[,:]/gm)].map((m) => m[1]));
})();
const mscCodes = (() => {
  const src = fs.readFileSync(path.join(ROOT, 'src/data/content/msc2020.ts'), 'utf8');
  const block = src.match(/export const mscNames\s*:[^=]*=\s*\{([\s\S]*?)\n\};/)?.[1] ?? '';
  return new Set([...block.matchAll(/^\s*"([0-9]{2}[A-Z]?)"\s*:/gm)].map((m) => m[1]));
})();

// Sinónimos prohibidos: tabla «IDs canónicos» de convenciones-proyecto.md (fuente única).
const deprecatedIds = (() => {
  const doc = path.join(path.dirname(new URL(import.meta.url).pathname), '../references/convenciones-proyecto.md');
  const section = fs.readFileSync(doc, 'utf8').split(/^## /m).find((s) => s.startsWith('5.')) ?? '';
  const map = new Map();
  for (const row of section.split('\n').filter((l) => l.startsWith('|'))) {
    const cells = row.split('|').map((c) => c.trim());
    const canon = cells[2]?.match(/`([a-z0-9-]+)`/)?.[1];
    // Una celda que empieza por «—» no lista sinónimos: solo aclara el sentido de otro ID.
    if (!canon || !cells[3] || cells[3].startsWith('—')) continue;
    for (const m of cells[3].matchAll(/`([a-z0-9-]+)`/g)) map.set(m[1], canon);
  }
  return map;
})();

function readMetadata(text) {
  const m = text.match(/export\s+const\s+metadata\s*=\s*(\{[\s\S]*?\n\});?/);
  if (!m) return { meta: null, body: text };
  try {
    // Contenido propio del repositorio (de confianza), igual que scripts/core/mdxSource.ts.
    return { meta: new Function(`return ${m[1]}`)(), body: text.slice(m.index + m[0].length) };
  } catch (error) {
    return { meta: null, body: text, error };
  }
}

function readSpec(file) {
  const src = fs.readFileSync(file, 'utf8');
  const a = src.indexOf('@matematika-diagram-spec:start');
  const b = src.indexOf('@matematika-diagram-spec:end');
  if (a === -1 || b === -1) return null;
  const chunk = src.slice(a, b);
  const open = chunk.indexOf('createDiagramSpec(');
  const close = chunk.lastIndexOf(')');
  if (open === -1 || close === -1) return null;
  try {
    return JSON.parse(chunk.slice(open + 'createDiagramSpec('.length, close));
  } catch {
    return null;
  }
}

/** Math segments ($$…$$ and $…$) of a body, skipping escaped dollars. */
function mathSegments(body) {
  const out = [];
  const display = /\$\$([\s\S]*?)\$\$/g;
  for (const m of body.matchAll(display)) out.push(m[1]);
  const rest = body.replace(display, ' ');
  for (const m of rest.matchAll(/(?<![\\$])\$([^$\n]+?)(?<!\\)\$/g)) out.push(m[1]);
  return out;
}

let errors = 0;
let warnings = 0;

function lintFile(file, lang, id) {
  const out = [];
  const err = (msg) => { errors++; out.push(`  ERROR ${msg}`); };
  const warn = (msg) => { warnings++; out.push(`  WARN  ${msg}`); };
  const text = fs.readFileSync(file, 'utf8');
  const { meta, body, error } = readMetadata(text);

  if (!meta) {
    err(error ? `metadata no evaluable: ${error.message}` : 'falta `export const metadata = {…}`');
    return out;
  }
  const folder = path.relative(path.join(CONTENT, lang), file).split(path.sep)[0];
  if (meta.id !== id) err(`id "${meta.id}" no coincide con el nombre de archivo "${id}"`);
  if (meta.lang !== lang) err(`lang "${meta.lang}" no coincide con la carpeta "${lang}"`);
  if (FOLDER_TYPES[folder] && !FOLDER_TYPES[folder].includes(meta.type)) {
    err(`type "${meta.type}" no corresponde a la carpeta ${folder}/ (esperado: ${FOLDER_TYPES[folder].join(' | ')})`);
  }
  for (const code of [meta.branch, ...(meta.branches ?? [])].filter(Boolean)) {
    if (!mscCodes.has(code)) err(`branch "${code}" no está registrado en src/data/content/msc2020.ts (usa 2 dígitos o 2 dígitos + letra)`);
  }
  if (!meta.description) warn('sin description (tarjetas, SEO y búsqueda la usan)');
  if (meta.extends !== undefined && meta.type !== 'sistema-axiomatico') err('`extends` solo vale en sistema-axiomatico');
  if (meta.extends !== undefined && !Array.isArray(meta.extends)) err('`extends` debe ser un array de IDs de sistemas');
  if (meta.builtIn !== undefined && meta.type !== 'modelo') err('`builtIn` solo vale en modelo');
  if (meta.builtIn !== undefined && typeof meta.builtIn !== 'string') err('`builtIn` es un único ID de sistema (string)');

  const links = [...body.matchAll(/<ConceptLink\b([^>]*)>/g)].map((m) => ({
    id: m[1].match(/targetId=["']([^"']+)["']/)?.[1],
    dep: /isDependency=\{true\}/.test(m[1]),
  }));
  for (const l of links) {
    if (!l.id) err('<ConceptLink> sin targetId');
    else if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(l.id)) err(`targetId "${l.id}" no es kebab-case ASCII (sin tildes, sin mayúsculas)`);
    else if (deprecatedIds.has(l.id)) err(`targetId "${l.id}" es un sinónimo prohibido: usa "${deprecatedIds.get(l.id)}" (convenciones-proyecto.md §5)`);
  }
  const deps = new Set(links.filter((l) => l.dep).map((l) => l.id));
  if (deps.has(id)) err('el nodo se declara dependencia de sí mismo');
  for (const demo of meta.demos ?? []) if (deps.has(demo)) err(`isDependency hacia su propia demostración "${demo}" (crea ciclo)`);
  if (meta.type === 'demostracion' && deps.has(meta.parentTheorem)) err(`isDependency hacia su parentTheorem "${meta.parentTheorem}" (crea ciclo)`);
  if (meta.type === 'matematico' && deps.size) err('las biografías no llevan isDependency={true}');
  if (meta.type === 'axioma' || meta.type === 'sistema-axiomatico') {
    if (/<SeccionPropiedades\b/.test(body)) err(`<SeccionPropiedades> prohibido en ${meta.type}`);
  }

  for (const seg of mathSegments(body)) {
    if (/<[A-Za-z]/.test(seg)) err(`JSX dentro de KaTeX: «${seg.trim().slice(0, 60)}»`);
  }
  if (/\\ell\s*\\subseteq|\\subseteq\s*\\pi\b/.test(body)) err('ℓ ⊆ π: usa incidencia (P \\mathbf{I} \\ell) o \\operatorname{tr}(\\ell)');
  if (/\bSatz\s+\d/.test(text)) err('no cites números de Satz: nombra el resultado');

  const imported = new Set([...text.matchAll(/import\s*\{([^}]*)\}/g)].flatMap((m) => m[1].split(',').map((s) => s.trim().split(/\s+as\s+/).pop())));
  const allowed = new Set([...registry, ...imported, ...(meta.type === 'plan-de-estudio' ? ['StudyTask', 'StudyPlanCheckpoint'] : [])]);
  for (const name of new Set([...body.matchAll(/<([A-Z]\w*)\b/g)].map((m) => m[1]))) {
    if (!allowed.has(name)) err(`componente <${name}> no registrado en MDXComponents ni importado en el archivo`);
  }

  for (const para of body.split(/\n\s*\n/)) {
    const plain = para.replace(/<Capitular[^>]*\/>/, '').replace(/<[^>]+>/g, '').trim();
    if (PREAMBLES.some((re) => re.test(plain))) warn(`párrafo que anuncia el marco: «${plain.slice(0, 70)}…»`);
  }
  const notes = (body.match(/<Nota\b/g) || []).length;
  if (notes > 2) warn(`${notes} <Nota>: la nota es la excepción, revisa si todas aportan`);

  const binds = [...body.matchAll(/<VisualBind\b([^>]*)>/g)].map((m) => ({
    el: m[1].match(/element=["']([^"']+)["']/)?.[1],
    color: m[1].match(/color=["']([^"']+)["']/)?.[1],
  }));
  for (const b of binds) if (b.color && !PALETTE.includes(b.color)) err(`VisualBind color "${b.color}" fuera de la paleta (${PALETTE.join(', ')})`);

  // `diagramStep` es el que sincroniza el paso del texto con `spec.steps`; `target` es una variable libre.
  const diagramSteps = [...body.matchAll(/<ProofStep\b[^>]*\bdiagramStep=["']([^"']+)["']/g)].map((m) => m[1]);
  const diagramImports = [...text.matchAll(/from\s+["']@content\/diagrams\/([^"']+)["']/g)].map((m) => m[1]);
  if (binds.length && !diagramImports.length && !meta.hasSimulation) {
    warn('usa <VisualBind> pero no importa ningún diagrama de @content/diagrams');
  }
  const specs = diagramImports
    .map((p) => path.join(ROOT, 'content/diagrams', `${p}.tsx`))
    .map((f) => {
      if (!fs.existsSync(f)) { err(`importa ${path.relative(ROOT, f)}, que no existe`); return null; }
      const spec = readSpec(f);
      if (!spec) warn(`${path.relative(ROOT, f)} es un diagrama de código sin DiagramSpec v3 (code-preview): sus VisualBind no se comprueban`);
      return spec;
    })
    .filter(Boolean);
  if (specs.length) {
    const targets = new Set();
    const nonTargets = new Set();
    const steps = new Set();
    for (const spec of specs) {
      // Mismo criterio que el registro de destinos del motor: clave = targetId ?? id.
      for (const o of [...(spec.objects ?? []), ...(spec.groups ?? [])]) {
        if (o.target) targets.add(o.targetId ?? o.id);
        else nonTargets.add(o.id);
      }
      for (const s of spec.steps ?? []) steps.add(s.id);
    }
    for (const el of new Set(binds.map((b) => b.el))) {
      if (!el) err('<VisualBind> sin element');
      else if (nonTargets.has(el) && !targets.has(el)) err(`VisualBind "${el}" existe en el diagrama pero sin "target": true`);
      else if (!targets.has(el)) err(`VisualBind "${el}" no existe en el diagrama (ids con target: ${[...targets].slice(0, 12).join(', ')}…)`);
    }
    for (const s of diagramSteps) if (!steps.has(s)) err(`<ProofStep diagramStep="${s}"> no es un paso del diagrama (${[...steps].join(', ') || 'sin steps'})`);
  }
  return out;
}

for (const id of ids) {
  const files = LANGS.map((l) => [l, allFiles.find((f) => f.startsWith(path.join(CONTENT, l) + path.sep) && path.basename(f) === `${id}.mdx`)]);
  const missing = files.filter(([, f]) => !f).map(([l]) => l);
  const report = [];
  if (missing.length) { errors++; report.push(`  ERROR falta en: ${missing.join(', ')}`); }
  for (const [lang, file] of files) {
    if (!file) continue;
    const lines = lintFile(file, lang, id);
    if (lines.length) report.push(`  [${lang}] ${path.relative(ROOT, file)}`, ...lines);
  }
  console.log(report.length ? `✗ ${id}\n${report.join('\n')}` : `✓ ${id}`);
}
console.log(`\n${errors} error(es), ${warnings} aviso(s).`);
process.exit(errors ? 1 : 0);
