#!/usr/bin/env node
// Review queue kept as a human-editable Markdown checklist (docs/reports/revision-diaria/COLA.md).
// Usage (from the repo root):
//   node scripts/daily-review/queue.mjs sync          add new nodes, drop deleted ones (keeps your order)
//   node scripts/daily-review/queue.mjs next [n]      print the next n pending ids
//   node scripts/daily-review/queue.mjs done <id> <report> <verdict> <cost>
//   node scripts/daily-review/queue.mjs reopen <id>   send a page back to the end of the pending list
//   node scripts/daily-review/queue.mjs status
// Pending lines can be reordered by hand: the agent always takes the first ones.
import fs from 'fs';
import { QUEUE_FILE, REPORT_DIR, listNodes, topoOrder } from './lib.mjs';

const LINE = /^- \[( |x)\] `([^`]+)`(.*)$/;

function read() {
  if (!fs.existsSync(QUEUE_FILE)) return { pending: [], reviewed: [] };
  const pending = [];
  const reviewed = [];
  for (const line of fs.readFileSync(QUEUE_FILE, 'utf8').split('\n')) {
    const m = line.match(LINE);
    if (!m) continue;
    (m[1] === 'x' ? reviewed : pending).push({ id: m[2], rest: m[3] });
  }
  return { pending, reviewed };
}

function write({ pending, reviewed }) {
  const total = pending.length + reviewed.length;
  const out = [
    '# Cola de revisión diaria',
    '',
    '<!-- Mantenida por scripts/daily-review/queue.mjs. Puedes reordenar a mano las líneas pendientes: el agente toma siempre las primeras. -->',
    '',
    `Revisadas: ${reviewed.length} / ${total}`,
    '',
    '## Pendientes',
    '',
    ...pending.map((e) => `- [ ] \`${e.id}\`${e.rest}`),
    '',
    '## Revisadas',
    '',
    ...reviewed.map((e) => `- [x] \`${e.id}\`${e.rest}`),
    '',
  ];
  fs.mkdirSync(REPORT_DIR, { recursive: true });
  fs.writeFileSync(QUEUE_FILE, out.join('\n'));
}

const [cmd, ...args] = process.argv.slice(2);
const state = read();

if (cmd === 'sync') {
  const nodes = listNodes();
  const known = new Set([...state.pending, ...state.reviewed].map((e) => e.id));
  const drop = (e) => nodes.has(e.id);
  state.pending = state.pending.filter(drop);
  state.reviewed = state.reviewed.filter(drop);
  for (const id of topoOrder(nodes)) {
    if (!known.has(id)) state.pending.push({ id, rest: ` · ${nodes.get(id).folder}` });
  }
  write(state);
} else if (cmd === 'next') {
  const n = Number(args[0] ?? 1);
  console.log(state.pending.slice(0, n).map((e) => e.id).join('\n'));
} else if (cmd === 'done') {
  const [id, report, verdict, cost] = args;
  const entry = state.pending.find((e) => e.id === id);
  if (!entry) throw new Error(`${id} no está pendiente en la cola`);
  state.pending = state.pending.filter((e) => e !== entry);
  const date = new Date().toISOString().slice(0, 10);
  state.reviewed.push({ id, rest: ` · ${date} · ${verdict} · [informe](${report}) · $${cost}` });
  write(state);
} else if (cmd === 'reopen') {
  const [id] = args;
  state.reviewed = state.reviewed.filter((e) => e.id !== id);
  state.pending = state.pending.filter((e) => e.id !== id);
  state.pending.push({ id, rest: ' · reabierta' });
  write(state);
} else if (cmd === 'status') {
  const total = state.pending.length + state.reviewed.length;
  console.log(`Revisadas ${state.reviewed.length} / ${total}. Siguiente: ${state.pending[0]?.id ?? '—'}`);
} else {
  console.error('Uso: queue.mjs sync | next [n] | done <id> <informe> <veredicto> <coste> | reopen <id> | status');
  process.exit(2);
}
