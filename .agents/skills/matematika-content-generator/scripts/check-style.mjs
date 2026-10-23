#!/usr/bin/env node
// Heuristics for simplicity and modularity of a node's prose (all three languages).
// Usage: node check-style.mjs <id> [<id>...]   (run from the repo root)
//        node check-style.mjs --all            (audit: one line per node with its count)
// Always exits 0: every line is a WARN to read and decide, never an automatic failure.
//
// Rigor: evasive steps («obviamente», «es trivial»).
// Simplicity: very long sentences and filler adjectives («riguroso», «fundamental», «ontológico»).
// Modularity: bold terms that already have their own node (an inline definition of an external
//   concept, Golden Rule 12), several <Definicion> blocks, long prose, too many properties.
import fs from 'fs';
import path from 'path';

const ROOT = process.cwd();
const CONTENT = path.join(ROOT, 'content/mdx');
const LANGS = ['es', 'en', 'eu'];
const MAX_SENTENCE = 50; // palabras
const MAX_PROSE = { matematico: 450, default: 320 }; // palabras fuera de <Definicion> y propiedades
const MAX_PROPERTIES = 6;
// Relleno: adjetivos que valoran en lugar de informar. El rigor se muestra, no se anuncia.
const FILLER = {
  es: /\b(rigurosa(mente)?|riguros[oa]s?|(?<!teorema )fundamental(es|mente)?|ontológic[oa]s?|crucial(es)?|esencial(es|mente)?|profund[oa]s?|elegante(s|mente)?|notable(s|mente)?|piedra angular|pilar(es)?|sin duda|cabe destacar|es importante (señalar|destacar))\b/giu,
  en: /\b(rigorous(ly)?|fundamental(ly)?(?! theorem)|ontological(ly)?|crucial(ly)?|essential(ly)?|profound(ly)?|elegant(ly)?|remarkabl[ey]|cornerstone|pillar|undoubtedly|it is worth noting|it is important to note)\b/giu,
  eu: /(zorrotz(ki|asun)?|funtsezko|ontologiko|ezinbesteko|sakon(ki)?|dotore(ki)?|nabarmen(ki)?|harri angeluar|zutabe)/giu,
};
// Saltos deductivos prohibidos (editorial-epistemology.md §5): cada paso se justifica, no se anuncia.
const EVASIVE = {
  es: /\b(es trivial|trivialmente|obviamente|evidentemente|claramente|es (obvio|evidente|fácil ver)|se deduce fácilmente|fácilmente se (ve|comprueba)|por inspección)\b/giu,
  en: /\b(trivial(ly)?|obvious(ly)?|evidently|clearly|it is easy to see|easily (seen|follows|verified)|by inspection)\b/giu,
  eu: /(nabaria da|begi-bistakoa|argi eta garbi|erraz ikus daiteke|tribiala)/giu,
};

const args = process.argv.slice(2);
if (!args.length) {
  console.error('Uso: node check-style.mjs <id> [<id>...] | --all');
  process.exit(2);
}

function listMdx(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const full = path.join(dir, e.name);
    return e.isDirectory() ? listMdx(full) : e.name.endsWith('.mdx') ? [full] : [];
  });
}

const corpus = Object.fromEntries(LANGS.map((lang) => [lang, listMdx(path.join(CONTENT, lang)).map((file) => {
  const text = fs.readFileSync(file, 'utf8');
  return {
    file,
    id: path.basename(file, '.mdx'),
    text,
    type: text.match(/^\s*type:\s*["']([^"']+)["']/m)?.[1],
    title: text.match(/^\s*title:\s*["'](.+?)["']\s*,?\s*$/m)?.[1],
  };
})]));
const norm = (s) => s.toLowerCase().replace(/\s+/g, ' ').trim();
const titles = Object.fromEntries(LANGS.map((l) => [l, new Map(corpus[l].filter((n) => n.title).map((n) => [norm(n.title), n.id]))]));

function plain(text) {
  return text
    .replace(/export\s+const\s+metadata\s*=\s*\{[\s\S]*?\n\};?/, ' ')
    .replace(/^(import|export) .*$/gm, ' ')
    .replace(/\$\$[\s\S]*?\$\$/g, '\n')
    .replace(/(?<!\\)\$[^$\n]+?(?<!\\)\$/g, ' X ')
    .replace(/<Capitular[^>]*letra=["'](\w+)["'][^>]*\/>/g, '$1')
    .replace(/<[^>]+>/g, ' ');
}

const words = (s) => s.split(/\s+/).filter((w) => /\p{L}/u.test(w)).length;

function check(node, lang) {
  const out = [];
  const body = plain(node.text);

  for (const sentence of body.split(/\s*\n\s*|(?<=[.;!?])\s+(?=\p{Lu}|X)/u)) {
    const n = words(sentence);
    if (n > MAX_SENTENCE) out.push(`frase de ${n} palabras (máx. ${MAX_SENTENCE}): «${sentence.trim().slice(0, 70)}…»`);
  }
  const filler = [...new Set([...body.matchAll(FILLER[lang])].map((m) => m[0].toLowerCase()))];
  const evasive = [...new Set([...body.matchAll(EVASIVE[lang])].map((m) => m[0].toLowerCase()))];
  if (evasive.length) out.push(`salto deductivo: ${evasive.map((f) => `«${f}»`).join(', ')}: cita el axioma, definición o teorema que lo justifica`);
  if (filler.length) out.push(`relleno valorativo: ${filler.map((f) => `«${f}»`).join(', ')}`);

  for (const m of node.text.matchAll(/\*\*([^*]+)\*\*/g)) {
    const other = titles[lang].get(norm(m[1]));
    if (other && other !== node.id) out.push(`**${m[1]}** en negrita tiene nodo propio (${other}): enlázalo, no lo definas aquí`);
  }
  const defs = (node.text.match(/<Definicion\b/g) || []).length;
  if (defs > 1 && node.type === 'definicion') out.push(`${defs} bloques <Definicion>: ¿son varios conceptos que merecen nodo propio?`);
  const props = (node.text.match(/<PropiedadItem\b/g) || []).length;
  if (props > MAX_PROPERTIES) out.push(`${props} propiedades (máx. ${MAX_PROPERTIES}): ¿alguna es un teorema con nodo propio?`);

  const prose = plain(node.text
    .replace(/<Definicion\b[\s\S]*?<\/Definicion>/g, ' ')
    .replace(/<SeccionPropiedades\b[\s\S]*?<\/SeccionPropiedades>/g, ' '));
  const limit = MAX_PROSE[node.type] ?? MAX_PROSE.default;
  const n = words(prose);
  if (n > limit) out.push(`${n} palabras de prosa fuera de la definición (máx. ${limit} para ${node.type}): ¿qué sobra o qué es otro nodo?`);
  return out;
}

const all = args[0] === '--all';
const ids = all ? corpus.es.map((n) => n.id) : args;
let total = 0;
for (const id of ids) {
  const lines = [];
  for (const lang of LANGS) {
    const node = corpus[lang].find((n) => n.id === id);
    if (!node) continue;
    const warns = check(node, lang);
    total += warns.length;
    if (all) { if (warns.length) lines.push(`${lang}:${warns.length}`); continue; }
    if (warns.length) lines.push(`  [${lang}] ${path.relative(ROOT, node.file)}`, ...warns.map((w) => `  WARN  ${w}`));
  }
  if (all) { if (lines.length) console.log(`${id}  ${lines.join(' ')}`); }
  else console.log(lines.length ? `△ ${id}\n${lines.join('\n')}` : `✓ ${id}`);
}
console.log(`\n${total} aviso(s) de estilo. Son heurísticas: corrige o justifica cada uno.`);
