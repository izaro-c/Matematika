#!/usr/bin/env node
// Validates only the content nodes touched by a commit or a branch. Meant for hooks and CI,
// so agents and humans get the same gate whether or not they remembered to run validate-nodes.
// Usage: node validate-changed.mjs              (staged files: pre-commit)
//        node validate-changed.mjs --base main  (files changed since the merge-base: CI / PR)
//
// Hard (exit 1): lint-node and check-parity. Advisory (printed, never fail): check-links, check-style.
// Graph and references are not repeated here: `npm run prebuild` / `full-check` already run them.
import fs from 'fs';
import path from 'path';
import { spawnSync } from 'child_process';

const ROOT = process.cwd();
const SCRIPTS = path.relative(ROOT, path.dirname(new URL(import.meta.url).pathname));
const args = process.argv.slice(2);
const bi = args.indexOf('--base');
const diff = bi === -1
  ? ['diff', '--cached', '--name-only', '--diff-filter=ACMR']
  : ['diff', '--name-only', '--diff-filter=ACMR', `${args[bi + 1]}...HEAD`];

const git = spawnSync('git', diff, { cwd: ROOT, encoding: 'utf8' });
if (git.status !== 0) {
  console.error(git.stderr.trim());
  process.exit(2);
}
const ids = [...new Set(git.stdout.split('\n')
  .filter((f) => /^content\/mdx\/(es|en|eu)\/.+\.mdx$/.test(f))
  .map((f) => path.basename(f, '.mdx')))]
  // Un id cuyo es/ ya no existe es un borrado o renombrado: lo cubre validate-references.
  .filter((id) => fs.readdirSync(path.join(ROOT, 'content/mdx/es'), { recursive: true }).some((f) => path.basename(String(f)) === `${id}.mdx`));

if (!ids.length) {
  console.log('Sin nodos MDX modificados.');
  process.exit(0);
}

const run = (script) => spawnSync('node', [path.join(SCRIPTS, script), ...ids], { cwd: ROOT, encoding: 'utf8' });
let failed = false;
for (const [script, hard] of [['lint-node.mjs', true], ['check-parity.mjs', true], ['check-links.mjs', false], ['check-style.mjs', false]]) {
  const r = run(script);
  const out = `${r.stdout}${r.stderr}`.trim();
  const ok = r.status === 0;
  if (hard && !ok) failed = true;
  const warns = (out.match(/WARN/g) || []).length;
  console.log(`\n── ${!ok ? 'FALLO' : warns ? `AVISO (${warns})` : 'OK '} ${script.replace('.mjs', '')}`);
  // En verde solo se imprime el detalle de lo que pide atención.
  if (!ok || warns) console.log(out);
}
console.log(`\n══ ${failed ? 'FALLO' : 'OK'} · ${ids.length} nodo(s) modificado(s): ${ids.join(', ')}`);
process.exitCode = failed ? 1 : 0;
