#!/usr/bin/env node
// Finds mathematical concepts mentioned in a node's prose without any <ConceptLink> to them (Pilar 2).
// Usage: node check-links.mjs <id> [<id>...]   (run from the repo root)
//        node check-links.mjs --all            (audit: one line per node with its count)
// Always exits 0: every hit is a WARN, a judgement call (a common word can coincide with a term).
//
// The lexicon comes from the corpus itself, per language: every node `title`, plus every
// <ConceptLink> anchor text used at least twice for the same targetId (so terms of pages not
// yet written also count). A term is reported only if the node links its targetId nowhere.
import fs from 'fs';
import path from 'path';

const ROOT = process.cwd();
const CONTENT = path.join(ROOT, 'content/mdx');
const LANGS = ['es', 'en', 'eu'];
// Words that are anchors somewhere but too generic to demand a link on every mention.
const STOP = {
  es: ['orden', 'conjunto', 'conjuntos', 'elemento', 'elementos', 'relación', 'teoría', 'sistema', 'modelo', 'figura', 'propiedad'],
  en: ['order', 'set', 'sets', 'element', 'elements', 'relation', 'theory', 'system', 'model', 'figure', 'property'],
  eu: ['ordena', 'multzo', 'elementu', 'erlazio', 'teoria', 'sistema', 'eredu', 'irudi', 'propietate'],
};

const MIN_LINK_RATIO = 0.35;

const args = process.argv.slice(2);
if (!args.length) {
  console.error('Uso: node check-links.mjs <id> [<id>...] | --all');
  process.exit(2);
}

function listMdx(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const full = path.join(dir, e.name);
    return e.isDirectory() ? listMdx(full) : e.name.endsWith('.mdx') ? [full] : [];
  });
}

const norm = (s) => s.toLowerCase().replace(/\s+/g, ' ').trim();
const linkRe = /<ConceptLink\b([^>]*)>([\s\S]*?)<\/ConceptLink>/g;

/** Prose of a node: no metadata, imports, math or JSX tags; linked spans blanked out. */
function prose(text) {
  return text
    .replace(/export\s+const\s+metadata\s*=\s*\{[\s\S]*?\n\};?/, ' ')
    .replace(/^(import|export) .*$/gm, ' ')
    .replace(/\$\$[\s\S]*?\$\$/g, ' · ')
    .replace(/(?<!\\)\$[^$\n]+?(?<!\\)\$/g, ' · ')
    .replace(linkRe, ' · ')
    .replace(/<[^>]+>/g, ' ');
}

const corpus = Object.fromEntries(LANGS.map((lang) => [lang, listMdx(path.join(CONTENT, lang)).map((file) => {
  const text = fs.readFileSync(file, 'utf8');
  return {
    file,
    id: path.basename(file, '.mdx'),
    text,
    title: text.match(/^\s*title:\s*["'](.+?)["']\s*,?\s*$/m)?.[1],
  };
})]));

function buildLexicon(lang) {
  const votes = new Map(); // term → Map(id → count)
  const vote = (term, id, n) => {
    const t = norm(term);
    if (t.length < 4 || STOP[lang].includes(t) || /[<>{}$\\]/.test(t)) return;
    const m = votes.get(t) ?? new Map();
    m.set(id, (m.get(id) ?? 0) + n);
    votes.set(t, m);
  };
  for (const node of corpus[lang]) {
    if (node.title) vote(node.title, node.id, 2);
    for (const m of node.text.matchAll(linkRe)) {
      const id = m[1].match(/targetId=["']([^"']+)["']/)?.[1];
      if (id) vote(m[2].replace(/<[^>]+>/g, ''), id, 1);
    }
  }
  const lex = new Map();
  for (const [term, ids] of votes) {
    const [[id, n], ...rest] = [...ids].sort((a, b) => b[1] - a[1]);
    const total = n + rest.reduce((s, [, k]) => s + k, 0);
    // Un sentido dominante (≥ 2/3) y uso repetido; si no, el término es ambiguo y se ignora.
    if (n >= 2 && n / total >= 2 / 3) lex.set(term, id);
  }
  return lex;
}

// Un término que el corpus casi nunca enlaza donde aparece es una palabra corriente («divide»,
// «estructura»): se descarta. Así el léxico aprende del uso aprobado en lugar de una lista fija.
function pruneGeneric(lang, lex) {
  const seen = new Map(); // term → [nodos donde aparece, nodos donde además se enlaza su id]
  const bodies = corpus[lang].map((n) => ({
    linked: new Set([...n.text.matchAll(/targetId=["']([^"']+)["']/g)].map((m) => m[1])),
    plain: norm(n.text.replace(/<[^>]+>/g, ' ')),
  }));
  for (const [term, id] of lex) {
    const re = new RegExp(`(?<![\\p{L}-])${escape(term)}${suffix[lang]}(?![\\p{L}-])`, 'u');
    const c = [0, 0];
    for (const b of bodies) if (re.test(b.plain)) { c[0]++; if (b.linked.has(id)) c[1]++; }
    seen.set(term, c);
  }
  for (const [term, [n, k]] of seen) if (n >= 4 && k / n < MIN_LINK_RATIO) lex.delete(term);
  return lex;
}

const escape = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
// es/en: plural opcional; eu: declinación aglutinante (puntua, puntuak, puntuen…).
const suffix = { es: '(?:e?s)?', en: '(?:e?s)?', eu: '\\p{L}{0,6}' };

function check(node, lang, lex) {
  const linked = new Set([...node.text.matchAll(/targetId=["']([^"']+)["']/g)].map((m) => m[1]));
  let text = norm(prose(node.text));
  const hits = new Map(); // id → { term, count }
  // Términos largos primero, para que «recta soporte» no se cuente también como «recta».
  for (const [term, id] of [...lex].sort((a, b) => b[0].length - a[0].length)) {
    const re = new RegExp(`(?<![\\p{L}-])${escape(term)}${suffix[lang]}(?![\\p{L}-])`, 'gu');
    const found = text.match(re);
    if (!found) continue;
    text = text.replace(re, ' · ');
    if (id === node.id || linked.has(id)) continue;
    const h = hits.get(id) ?? { term, count: 0 };
    h.count += found.length;
    hits.set(id, h);
  }
  return [...hits].map(([id, h]) => ({ id, ...h }));
}

const lexicons = Object.fromEntries(LANGS.map((l) => [l, pruneGeneric(l, buildLexicon(l))]));
const all = args[0] === '--all';
const ids = all ? corpus.es.map((n) => n.id) : args;
let total = 0;

for (const id of ids) {
  const lines = [];
  for (const lang of LANGS) {
    const node = corpus[lang].find((n) => n.id === id);
    if (!node) continue;
    const hits = check(node, lang, lexicons[lang]);
    total += hits.length;
    if (hits.length && !all) {
      lines.push(`  [${lang}] ${path.relative(ROOT, node.file)}`);
      for (const h of hits) lines.push(`  WARN  «${h.term}» (${h.count}×) sin enlace → <ConceptLink targetId="${h.id}">`);
    }
    if (all && hits.length) lines.push(`${lang}:${hits.length}`);
  }
  if (all) { if (lines.length) console.log(`${id}  ${lines.join(' ')}`); }
  else console.log(lines.length ? `△ ${id}\n${lines.join('\n')}` : `✓ ${id}`);
}
console.log(`\n${total} concepto(s) mencionados sin enlace. Enlaza la primera mención; ignora el aviso si la palabra no se usa en sentido matemático.`);
