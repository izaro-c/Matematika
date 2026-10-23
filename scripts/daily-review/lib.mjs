// Shared helpers for the daily review agent: node discovery, metadata and DAG edges.
// Everything here is deterministic and runs without the model, so the agent receives
// its context already gathered instead of spending turns exploring the repo.
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// ROOT is the checkout being reviewed (the agent's worktree when run.sh calls us);
// the queue and reports always live in the checkout that holds these scripts.
export const ROOT = process.cwd();
export const TOOL_DIR = path.dirname(fileURLToPath(import.meta.url));
export const MDX_ROOT = path.join(ROOT, 'content/mdx');
export const REPORT_DIR = path.resolve(TOOL_DIR, '../../docs/reports/revision-diaria');
export const QUEUE_FILE = path.join(REPORT_DIR, 'COLA.md');
export const LANGS = ['es', 'en', 'eu'];

// Review order inside one topological layer: foundations first.
const FOLDER_RANK = [
  'definitions', 'axioms', 'axiomatic-systems', 'models', 'theorems', 'demonstrations',
  'methods', 'examples', 'exercises', 'usecases', 'plans', 'mathematicians',
];

export function listNodes() {
  const nodes = new Map();
  const esRoot = path.join(MDX_ROOT, 'es');
  for (const folder of fs.readdirSync(esRoot)) {
    const dir = path.join(esRoot, folder);
    if (!fs.statSync(dir).isDirectory()) continue;
    for (const file of fs.readdirSync(dir)) {
      if (!file.endsWith('.mdx')) continue;
      const id = file.slice(0, -4);
      const rel = `${folder}/${file}`;
      nodes.set(id, { id, folder, rel, source: fs.readFileSync(path.join(dir, file), 'utf8') });
    }
  }
  return nodes;
}

export function nodePath(node, lang) {
  return path.join('content/mdx', lang, node.rel);
}

export function metaString(source, key) {
  const m = source.match(new RegExp(`^\\s*${key}:\\s*"((?:[^"\\\\]|\\\\.)*)"`, 'm'));
  return m ? m[1] : null;
}

export function metaFlag(source, key) {
  const m = source.match(new RegExp(`^\\s*${key}:\\s*(true|false)`, 'm'));
  return m ? m[1] === 'true' : null;
}

export function linkTargets(source) {
  const deps = new Set();
  const others = new Set();
  for (const m of source.matchAll(/<ConceptLink\b([^>]*)>/g)) {
    const id = m[1].match(/targetId="([^"]+)"/)?.[1];
    if (!id) continue;
    (/isDependency=\{true\}/.test(m[1]) ? deps : others).add(id);
  }
  for (const id of deps) others.delete(id);
  return { deps: [...deps], others: [...others] };
}

export function diagramImports(source) {
  return [...source.matchAll(/from\s+'@content\/diagrams\/([^']+)'/g)].map(
    (m) => `content/diagrams/${m[1]}.tsx`,
  );
}

// Topological order over isDependency edges plus parentTheorem → demo, so every page is
// reviewed after the pages it rests on. Ties break by folder rank, then id.
export function topoOrder(nodes) {
  const rank = (n) => {
    const i = FOLDER_RANK.indexOf(n.folder);
    return i === -1 ? FOLDER_RANK.length : i;
  };
  const preds = new Map([...nodes.keys()].map((id) => [id, new Set()]));
  for (const node of nodes.values()) {
    for (const dep of linkTargets(node.source).deps) {
      if (dep !== node.id && nodes.has(dep)) preds.get(node.id).add(dep);
    }
    const parent = metaString(node.source, 'parentTheorem');
    if (parent && nodes.has(parent)) preds.get(node.id).add(parent);
  }
  const order = [];
  const done = new Set();
  const cmp = (a, b) => rank(nodes.get(a)) - rank(nodes.get(b)) || a.localeCompare(b);
  while (done.size < nodes.size) {
    let ready = [...nodes.keys()].filter(
      (id) => !done.has(id) && [...preds.get(id)].every((p) => done.has(p)),
    );
    // validate-graph forbids cycles; if one slips in, do not stall the queue.
    if (ready.length === 0) ready = [...nodes.keys()].filter((id) => !done.has(id));
    ready.sort(cmp);
    order.push(ready[0]);
    done.add(ready[0]);
  }
  return order;
}

// Returns a heading and its body up to the next heading of the same or higher level.
// Throws if the heading was renamed, so a skill edit cannot silently empty the prompt.
export function extractSection(md, heading) {
  const lines = md.split('\n');
  const start = lines.findIndex((l) => l.startsWith(heading));
  if (start === -1) throw new Error(`Sección no encontrada: «${heading}»`);
  const level = heading.match(/^#+/)[0].length;
  let end = lines.length;
  for (let i = start + 1; i < lines.length; i++) {
    const h = lines[i].match(/^(#+)\s/);
    if (h && h[1].length <= level) { end = i; break; }
  }
  return lines.slice(start, end).join('\n').trim();
}
