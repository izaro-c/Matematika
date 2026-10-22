#!/usr/bin/env node
// One command to validate a batch of content nodes before declaring the work done.
// Usage: node .agents/skills/matematika-content-generator/scripts/validate-nodes.mjs <id> [<id>...]
//        (run from the repo root; add --typecheck when you also touched .ts/.tsx files)
//
// Runs, in order, and stops reporting only at the end:
//   1. lint-node.mjs        hard rules per file (metadata, KaTeX/JSX, DAG, VisualBind ↔ diagram)
//   2. check-parity.mjs     es/en/eu parity (links, dependencies, components, formulas)
//   3. verify-diagram.ts    every diagram imported by these nodes is visual-exact
//   4. validate-references  only the lines about these nodes (the corpus has known WARNs)
//   5. validate-graph       whole DAG: cycles, axiomatic conflicts, `extends` inclusion
//   6. typecheck            only with --typecheck
// Exit code 0 only if every step passed. Paste the final summary in your report.
import fs from 'fs';
import path from 'path';
import { spawnSync } from 'child_process';

const ROOT = process.cwd();
const SCRIPTS = path.relative(ROOT, path.dirname(new URL(import.meta.url).pathname));
const args = process.argv.slice(2);
const typecheck = args.includes('--typecheck');
const ids = args.filter((a) => !a.startsWith('--'));
if (!ids.length) {
  console.error('Uso: node validate-nodes.mjs <id> [<id>...] [--typecheck]');
  process.exit(2);
}

function run(cmd, cmdArgs) {
  const r = spawnSync(cmd, cmdArgs, { cwd: ROOT, encoding: 'utf8', shell: false });
  return { ok: r.status === 0, out: `${r.stdout ?? ''}${r.stderr ?? ''}`.trim() };
}

function filesFor(id) {
  const found = [];
  const walk = (dir) => {
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, e.name);
      if (e.isDirectory()) walk(full);
      else if (e.name === `${id}.mdx`) found.push(full);
    }
  };
  walk(path.join(ROOT, 'content/mdx'));
  return found;
}

const results = [];
const step = (name, { ok, out }) => {
  results.push({ name, ok });
  console.log(`\n── ${ok ? 'OK ' : 'FALLO'} ${name}`);
  if (out) console.log(out);
};

step('lint-node', run('node', [path.join(SCRIPTS, 'lint-node.mjs'), ...ids]));
step('check-parity', run('node', [path.join(SCRIPTS, 'check-parity.mjs'), ...ids]));

const diagrams = new Set();
for (const id of ids) {
  for (const f of filesFor(id)) {
    const text = fs.readFileSync(f, 'utf8');
    for (const m of text.matchAll(/from\s+["']@content\/diagrams\/([^"']+)["']/g)) diagrams.add(`content/diagrams/${m[1]}.tsx`);
  }
}
for (const d of diagrams) {
  if (!fs.existsSync(path.join(ROOT, d))) { step(`verify-diagram ${d}`, { ok: false, out: 'no existe' }); continue; }
  const r = run('npx', ['tsx', '.agents/skills/matematika-diagram-generator/scripts/verify-diagram.ts', d]);
  // code-preview (diagramas 3D de código) no es un fallo; invalid sí.
  step(`verify-diagram ${d}`, { ok: !/Estado en el Editor: invalid/.test(r.out), out: r.out.split('\n').slice(1).join('\n') });
}

const refs = run('npx', ['tsx', 'scripts/core/validate-cross-references.ts']);
const mine = refs.out.split('\n').filter((l) => ids.some((id) => l.includes(`/${id}.mdx`)) || /\[ERROR\]|❌/.test(l));
// Los enlaces a páginas futuras son obligatorios (Pilar 2): se cuentan, no se listan.
const future = mine.filter((l) => /apunta a ID inexistente|que no existe \(enlace no resuelto\)/.test(l));
const other = mine.filter((l) => !future.includes(l));
const futureIds = [...new Set(future.map((l) => l.match(/(?:targetId=|id=|a ')["']?([a-z0-9-]+)/)?.[1]).filter(Boolean))];
step('validate-references (líneas de este lote)', {
  ok: refs.ok,
  out: [...other, future.length ? `${future.length} enlace(s) a páginas aún no escritas: ${futureIds.join(', ')}` : ''].filter(Boolean).join('\n') || 'sin avisos para estos nodos',
});

const graph = run('npx', ['tsx', 'scripts/core/validate-logical-graph.ts']);
const cycles = graph.out.split('\n').filter((l) => /Ciclo roto|ERROR/.test(l));
step('validate-graph', { ok: graph.ok && !cycles.length, out: cycles.length ? cycles.join('\n') : graph.out.split('\n').filter((l) => /Validación completada/.test(l)).join('\n') });

if (typecheck) {
  const tc = run('npm', ['run', '--silent', 'typecheck']);
  step('typecheck', { ok: tc.ok, out: tc.out.split('\n').slice(-20).join('\n') });
}

const failed = results.filter((r) => !r.ok);
console.log(`\n══ ${failed.length ? `FALLO en ${failed.map((r) => r.name).join(', ')}` : 'TODO OK'} · ${ids.length} nodo(s): ${ids.join(', ')}`);
console.log('Los avisos «apunta a ID inexistente» de enlaces futuros son esperables; los ERROR no.');
process.exit(failed.length ? 1 : 0);
