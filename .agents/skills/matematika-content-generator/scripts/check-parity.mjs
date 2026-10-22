#!/usr/bin/env node
// Checks trilingual parity (es/en/eu) for one or more node ids.
// Usage: node check-parity.mjs <id> [<id>...]   (run from the repo root)
//        node check-parity.mjs --dir <folder> <id>...   (folder containing es/ en/ eu/ subtrees)
// Compares: ConceptLink targetIds + isDependency, PropiedadItem ids, JSX component sequence,
// inline/display formula counts, and key metadata fields that must not be translated.
import fs from 'fs';
import path from 'path';

const args = process.argv.slice(2);
let root = path.resolve(process.cwd(), 'content/mdx');
const di = args.indexOf('--dir');
if (di !== -1) {
  root = path.resolve(args[di + 1]);
  args.splice(di, 2);
}
if (!args.length) {
  console.error('Uso: node check-parity.mjs [--dir carpeta] <id> [<id>...]');
  process.exit(2);
}
const LANGS = ['es', 'en', 'eu'];

function find(dir, id) {
  if (!fs.existsSync(dir)) return null;
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) {
      const r = find(full, id);
      if (r) return r;
    } else if (e.name === `${id}.mdx`) return full;
  }
  return null;
}

function profile(text) {
  const meta = text.match(/export\s+const\s+metadata\s*=\s*(\{[\s\S]*?\n\});?/);
  const body = meta ? text.slice(meta.index + meta[0].length) : text;
  const field = (k) => meta?.[1].match(new RegExp(`["']?\\b${k}["']?:\\s*(["'][^"']*["']|\\[[^\\]]*\\])`))?.[1]
    // Comparación de valores, no de formato: comillas, saltos de línea y comas finales no cuentan.
    ?.replace(/'/g, '"').replace(/\s+/g, '').replace(/,\]/g, ']') ?? null;
  const links = [...body.matchAll(/<ConceptLink\b[^>]*>/g)].map((m) => {
    const id = m[0].match(/targetId=["']([^"']+)["']/)?.[1];
    return `${id}${/isDependency=\{true\}/.test(m[0]) ? ' [dep]' : ''}`;
  });
  const noDisplay = body.replace(/\$\$[\s\S]*?\$\$/g, '');
  return {
    lang: field('lang'),
    meta: { id: field('id'), type: field('type'), subtype: field('subtype'), branch: field('branch'), demos: field('demos'), parentTheorem: field('parentTheorem'),
      axiomas: field('axiomas'), models: field('models'), extends: field('extends'), satisfies: field('satisfies'), builtIn: field('builtIn'), axiomSystem: field('axiomSystem') },
    links: links.sort(),
    deps: [...new Set(links.filter((l) => l.endsWith('[dep]')))].sort(),
    propItems: [...body.matchAll(/<PropiedadItem\b[^>]*?\bid=["']([^"']+)["']/g)].map((m) => m[1]),
    components: [...body.matchAll(/<([A-Z][A-Za-z]+)\b/g)].map((m) => m[1]).filter((c) => c !== 'ConceptLink'),
    displayMath: (body.match(/\$\$/g) || []).length / 2,
    inlineMath: (noDisplay.match(/(?<!\\)\$/g) || []).length / 2,
  };
}

function diff(a, b) {
  const count = (xs) => xs.reduce((m, x) => m.set(x, (m.get(x) ?? 0) + 1), new Map());
  const ca = count(a), cb = count(b), out = [];
  for (const k of new Set([...ca.keys(), ...cb.keys()])) {
    const d = (ca.get(k) ?? 0) - (cb.get(k) ?? 0);
    if (d) out.push(`${d > 0 ? '-' : '+'}${k}${Math.abs(d) > 1 ? ` ×${Math.abs(d)}` : ''}`);
  }
  return out;
}

let failures = 0;
for (const id of args) {
  const profiles = {};
  const problems = [];
  for (const lang of LANGS) {
    const f = find(path.join(root, lang), id);
    if (!f) { problems.push(`falta ${lang}/…/${id}.mdx`); continue; }
    profiles[lang] = profile(fs.readFileSync(f, 'utf8'));
    if (profiles[lang].lang !== `"${lang}"`) problems.push(`${lang}: metadata.lang = ${profiles[lang].lang}`);
    if (profiles[lang].meta.id !== `"${id}"`) problems.push(`${lang}: metadata.id = ${profiles[lang].meta.id}`);
  }
  const base = profiles.es;
  if (base) {
    for (const lang of ['en', 'eu']) {
      const p = profiles[lang];
      if (!p) continue;
      for (const k of Object.keys(base.meta)) if (base.meta[k] !== p.meta[k]) problems.push(`${lang}: metadata.${k} ${p.meta[k]} ≠ es ${base.meta[k]}`);
      const dd = diff(base.deps, p.deps);
      if (dd.length) problems.push(`${lang}: isDependency distinto (vs es): ${dd.join(', ')}`);
      // Sets, not counts: a translation may naturally repeat or merge a link within a sentence.
      const ld = diff([...new Set(base.links.map((l) => l.replace(" [dep]", "")))], [...new Set(p.links.map((l) => l.replace(" [dep]", "")))]);
      if (ld.length) problems.push(`${lang}: ConceptLinks distintos (vs es): ${ld.join(', ')}`);
      const pd = diff(base.propItems, p.propItems);
      if (pd.length) problems.push(`${lang}: PropiedadItem distintos: ${pd.join(', ')}`);
      if (base.components.join() !== p.components.join()) problems.push(`${lang}: secuencia de componentes distinta: ${diff(base.components, p.components).join(', ') || 'mismo conjunto, otro orden'}`);
      if (base.displayMath !== p.displayMath) problems.push(`${lang}: bloques $$ ${p.displayMath} ≠ es ${base.displayMath}`);
      if (base.inlineMath !== p.inlineMath) problems.push(`${lang}: fórmulas inline ${p.inlineMath} ≠ es ${base.inlineMath}`);
    }
  }
  if (problems.length) {
    failures++;
    console.log(`✗ ${id}\n  ${problems.join('\n  ')}`);
  } else {
    console.log(`✓ ${id} (${base.links.length} enlaces, ${base.deps.length} dependencias, ${base.inlineMath}+${base.displayMath} fórmulas)`);
  }
}
process.exit(failures ? 1 : 0);
