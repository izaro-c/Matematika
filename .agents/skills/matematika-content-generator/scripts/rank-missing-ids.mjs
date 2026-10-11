#!/usr/bin/env node
// Ranks targetIds referenced in content/mdx that have no node yet.
// Usage: node rank-missing-ids.mjs [--top N] [--json] [--contexts ID]
//   --top N        show only the N most referenced (default 30)
//   --json         machine-readable output
//   --contexts ID  print every sentence (es) that links to ID, to infer its intended meaning
import fs from 'fs';
import path from 'path';

const ROOT = path.resolve(process.cwd(), 'content/mdx');
const args = process.argv.slice(2);
const opt = (name, def) => {
  const i = args.indexOf(name);
  return i === -1 ? def : args[i + 1];
};
const top = Number(opt('--top', 30));
const asJson = args.includes('--json');
const contextsFor = opt('--contexts', null);

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const full = path.join(dir, e.name);
    return e.isDirectory() ? walk(full) : e.name.endsWith('.mdx') ? [full] : [];
  });
}

const files = walk(ROOT);
const existing = new Set();
for (const f of files) {
  existing.add(path.basename(f, '.mdx')); // same fallback as validate-cross-references
  const m = fs.readFileSync(f, 'utf8').match(/export\s+const\s+metadata\s*=\s*\{[\s\S]*?\bid:\s*["']([^"']+)["']/);
  if (m) existing.add(m[1]);
}

const refRe = /<(ConceptLink|PropiedadItem)\b[^>]*?\b(?:targetId|id)=["']([^"']+)["'][^>]*>/g;
const stats = new Map(); // id -> { refs, dependencyRefs, sources:Set, langs:Set }
const contexts = [];
for (const f of files) {
  const text = fs.readFileSync(f, 'utf8');
  const lang = path.relative(ROOT, f).split(path.sep)[0];
  const sourceId = path.basename(f, '.mdx');
  for (const m of text.matchAll(refRe)) {
    const id = m[2];
    if (existing.has(id)) continue;
    const s = stats.get(id) ?? { refs: 0, dependencyRefs: 0, sources: new Set(), langs: new Set() };
    s.refs++;
    if (/isDependency=\{true\}/.test(m[0])) s.dependencyRefs++;
    s.sources.add(sourceId);
    s.langs.add(lang);
    stats.set(id, s);
    if (contextsFor === id && lang === 'es') {
      const start = Math.max(0, text.lastIndexOf('\n', m.index) + 1);
      const end = text.indexOf('\n', m.index);
      contexts.push(`[${sourceId}] ${text.slice(start, end === -1 ? undefined : end).trim().slice(0, 400)}`);
    }
  }
}

if (contextsFor) {
  console.log(contexts.length ? contexts.join('\n\n') : `Sin referencias en es/ a "${contextsFor}" (o ya existe).`);
  process.exit(0);
}

// Dependency links weigh more: a missing node that others depend on breaks the DAG, not just navigation.
const ranked = [...stats.entries()]
  .map(([id, s]) => ({
    id,
    refs: s.refs,
    dependencyRefs: s.dependencyRefs,
    referencingNodes: s.sources.size,
    langs: [...s.langs].sort(),
    score: s.sources.size * 2 + s.dependencyRefs,
  }))
  .sort((a, b) => b.score - a.score || b.refs - a.refs);

if (asJson) {
  console.log(JSON.stringify({ existingIds: existing.size, missingIds: ranked.length, ranked: ranked.slice(0, top) }, null, 2));
} else {
  console.log(`Nodos existentes: ${existing.size} · IDs referenciados sin nodo: ${ranked.length}\n`);
  console.log('rank  score  nodos  deps  refs  langs     id');
  ranked.slice(0, top).forEach((r, i) =>
    console.log(
      `${String(i + 1).padStart(4)}  ${String(r.score).padStart(5)}  ${String(r.referencingNodes).padStart(5)}  ${String(r.dependencyRefs).padStart(4)}  ${String(r.refs).padStart(4)}  ${r.langs.join(',').padEnd(8)}  ${r.id}`,
    ),
  );
}
