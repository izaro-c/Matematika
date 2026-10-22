import fs from 'node:fs';
import path from 'node:path';
import { parseDiagramSourceAST } from '../../../../scripts/editor/parseDiagramSourceAST';

const file = process.argv[2];
if (!file) {
  console.error('Uso: npx tsx .agents/skills/matematika-diagram-generator/scripts/verify-diagram.ts <ruta-al-diagrama.tsx>');
  process.exit(1);
}

const fullPath = path.resolve(process.cwd(), file);
if (!fs.existsSync(fullPath)) {
  console.error(`Archivo no encontrado: ${fullPath}`);
  process.exit(1);
}

const source = fs.readFileSync(fullPath, 'utf8');
const parsed = parseDiagramSourceAST(source);

console.log(`--- Verificación de Diagrama: ${path.basename(fullPath)} ---`);
console.log(`Estado en el Editor: ${parsed.status}`);

if (parsed.status === 'invalid') {
  console.error('Diagnósticos de error:', parsed.diagnostics);
  process.exit(1);
}

if (parsed.status === 'code-preview') {
  console.warn('Aviso: El diagrama se visualiza pero no alcanza edición exacta (visual-exact).');
  console.warn(parsed.diagnostics);
} else {
  console.log('✓ Compatible al 100% con edición visual exacta (visual-exact).');
}

// Comprobaciones que el esquema Zod no cubre: identidad de destinos, pasos y traducciones.
let problems = 0;
if (parsed.status === 'visual-exact') {
  const start = source.indexOf('@matematika-diagram-spec:start');
  const chunk = source.slice(start, source.indexOf('@matematika-diagram-spec:end'));
  const json = chunk.slice(chunk.indexOf('createDiagramSpec(') + 'createDiagramSpec('.length, chunk.lastIndexOf(')'));
  type Item = { id: string; target?: boolean; targetId?: string };
  type Step = { id: string; visibleTargets?: string[]; objectStates?: Record<string, unknown> };
  const spec = JSON.parse(json) as {
    objects: Item[]; groups?: Item[]; steps?: Step[];
    translations?: Record<string, { title?: string; steps?: Record<string, unknown> }>;
  };
  const problem = (msg: string) => { problems++; console.error(`✗ ${msg}`); };

  const items = [...spec.objects, ...(spec.groups ?? [])];
  const ids = new Set(items.map(item => item.id));
  const keys = new Map<string, string[]>();
  for (const item of items.filter(i => i.target)) {
    const key = item.targetId ?? item.id;
    keys.set(key, [...(keys.get(key) ?? []), item.id]);
  }
  for (const [key, owners] of keys) {
    if (owners.length > 1) problem(`la clave de destino "${key}" la publican varios objetos (${owners.join(', ')}): <VisualBind element="${key}"> sería ambiguo`);
  }
  for (const step of spec.steps ?? []) {
    for (const id of step.visibleTargets ?? []) if (!ids.has(id)) problem(`paso "${step.id}": visibleTargets nombra "${id}", que no existe`);
    for (const id of Object.keys(step.objectStates ?? {})) if (!ids.has(id)) problem(`paso "${step.id}": objectStates nombra "${id}", que no existe`);
  }
  for (const lang of ['eu', 'en']) {
    const tr = spec.translations?.[lang];
    if (!tr?.title) problem(`falta translations.${lang}.title`);
    const missing = (spec.steps ?? []).filter(step => !tr?.steps?.[step.id]).map(step => step.id);
    if (missing.length) problem(`faltan translations.${lang}.steps para: ${missing.join(', ')}`);
  }
  if (!problems) console.log('✓ Destinos únicos, pasos coherentes y traducciones eu/en completas.');
}

process.exit(parsed.status === 'invalid' || problems ? 1 : 0);
