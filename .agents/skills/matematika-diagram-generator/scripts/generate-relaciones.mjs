// Genera las figuras estáticas de las páginas de relaciones (reflexiva, simétrica,
// transitiva, equivalencia). Uso, desde la raíz del repositorio:
//   node .agents/skills/matematika-diagram-generator/scripts/generate-relaciones.mjs .
import { writeFileSync } from 'node:fs';
import { join } from 'node:path';

const repo = process.argv[2];
const r2 = (v) => Math.round(v * 1000) / 1000;

function builder() {
  const objects = [];
  const groups = [];
  const aria = { eu: {}, en: {} };
  const labels = { eu: {}, en: {} };
  let order = 0;
  const base = (id, label, color, layerId, extra = {}) => ({
    id, label, color, layerId, order: (order += 1), visible: true, locked: true, groupIds: [],
    selection: { selectable: false, role: 'construction' }, target: false, ...extra,
  });
  const hidden = (id, x, y) => {
    objects.push({
      ...base(id, id, 'carbon', 'construction'), visible: false,
      objectType: 'point', definition: { type: 'coordinates', x: r2(x), y: r2(y) },
      mobility: { type: 'fixed' }, appearance: { size: 0, labelVisible: false },
    });
    return id;
  };
  const pos = new Map();
  const api = {
    objects, groups,
    elem(id, label, x, y, ariaT, labelPosition = 'bot') {
      pos.set(id, [x, y]);
      objects.push({
        ...base(id, label, 'carbon', 'elements'),
        selection: { selectable: true, role: 'primary', ariaLabel: ariaT.es },
        objectType: 'point', definition: { type: 'coordinates', x: r2(x), y: r2(y) },
        mobility: { type: 'fixed' }, appearance: { size: 4, labelVisible: true, labelSize: 16, labelPosition },
      });
      aria.eu[id] = ariaT.eu; aria.en[id] = ariaT.en;
    },
    // Lazo (x, x): arco con punta que sale del elemento, da la vuelta hacia fuera y vuelve a él.
    loop(id, elemId, angleDeg, color, ariaT, { dashed = false, groupIds = [], target = false } = {}) {
      const [x, y] = pos.get(elemId);
      const r = 0.3, gap = (32 * Math.PI) / 180, t = (angleDeg * Math.PI) / 180;
      const cx = x + r * Math.cos(t), cy = y + r * Math.sin(t);
      const c = hidden(`${id}Centro`, cx, cy);
      const back = t + Math.PI;
      const s = hidden(`${id}Ini`, cx + r * Math.cos(back + gap), cy + r * Math.sin(back + gap));
      const e = hidden(`${id}Fin`, cx + r * Math.cos(back - gap), cy + r * Math.sin(back - gap));
      objects.push({
        ...base(id, id, color, 'relation'), groupIds,
        selection: { selectable: true, role: 'secondary', ariaLabel: ariaT.es }, target,
        objectType: 'path', geometry: { type: 'arc', points: [c, s, e], direction: 'counterclockwise' },
        appearance: { strokeWidth: 2, arrow: 'end', ...(dashed ? { dashed: true } : {}) },
      });
      aria.eu[id] = ariaT.eu; aria.en[id] = ariaT.en;
    },
    // Flecha (x, y): segmento recortado en los extremos y desplazado `offset` a la izquierda.
    arrow(id, fromId, toId, color, ariaT, { offset = 0, dashed = false, both = false, groupIds = [], target = false } = {}) {
      const [x1, y1] = pos.get(fromId), [x2, y2] = pos.get(toId);
      const dx = x2 - x1, dy = y2 - y1, len = Math.hypot(dx, dy);
      const ux = dx / len, uy = dy / len, nx = -uy, ny = ux, cut = 0.17;
      const s = hidden(`${id}Ini`, x1 + ux * cut + nx * offset, y1 + uy * cut + ny * offset);
      const e = hidden(`${id}Fin`, x2 - ux * cut + nx * offset, y2 - uy * cut + ny * offset);
      objects.push({
        ...base(id, id, color, 'relation'), groupIds,
        selection: { selectable: true, role: 'secondary', ariaLabel: ariaT.es }, target,
        objectType: 'path', geometry: { type: 'segment', points: [s, e] },
        appearance: { strokeWidth: 2, arrow: both ? 'both' : 'end', ...(dashed ? { dashed: true } : {}) },
      });
      aria.eu[id] = ariaT.eu; aria.en[id] = ariaT.en;
    },
    caption(id, x, y, color, text) {
      objects.push({
        ...base(id, text.es, color, 'annotations'),
        objectType: 'point', definition: { type: 'coordinates', x: r2(x), y: r2(y) },
        mobility: { type: 'fixed' },
        appearance: { size: 0, labelVisible: true, labelSize: 15, labelPosition: 'top', labelOffset: [0, -11] },
      });
      labels.eu[id] = text.eu; labels.en[id] = text.en;
    },
    region(id, cx, cy, radius, color, ariaT, { target = true, groupIds = [] } = {}) {
      const c = hidden(`${id}Centro`, cx, cy);
      const p = hidden(`${id}Borde`, cx + radius, cy);
      objects.push({
        ...base(id, id, color, 'regions'), groupIds,
        selection: { selectable: true, role: 'secondary', ariaLabel: ariaT.es }, target,
        objectType: 'path', geometry: { type: 'circle', center: c, point: p },
        appearance: { strokeWidth: 1.4, strokeOpacity: 0.55, fillOpacity: 0.1 },
      });
      aria.eu[id] = ariaT.eu; aria.en[id] = ariaT.en;
    },
    divider() {
      const a = hidden('divisorArriba', 0, 1.45), b = hidden('divisorAbajo', 0, -1.85);
      objects.push({
        ...base('divisor', 'divisor', 'canela', 'annotations'),
        objectType: 'path', geometry: { type: 'segment', points: [a, b] },
        appearance: { strokeWidth: 1, strokeOpacity: 0.6, dashed: true },
      });
    },
    group(id, label, memberIds, labelT) {
      groups.push({
        id, label, memberIds, visible: true, locked: false,
        selection: { selectable: true, role: 'secondary' }, target: true, targetId: id,
      });
      for (const m of memberIds) objects.find((o) => o.id === m).groupIds.push(id);
      labels.eu[id] = labelT.eu; labels.en[id] = labelT.en;
    },
    aria, labels,
  };
  return api;
}

// Triángulo de tres elementos a, b, c centrado en cx; devuelve los ángulos de los lazos (hacia fuera).
function triangle(b, prefix, cx) {
  const pts = [['a', cx, 0.45, 'rt'], ['b', cx - 1.05, -1.0, 'bot'], ['c', cx + 1.05, -1.0, 'bot']];
  for (const [n, x, y, lp] of pts) {
    b.elem(`${prefix}${n}`, n, x, y, { es: `Elemento ${n}`, eu: `${n} elementua`, en: `Element ${n}` }, lp);
  }
  return { a: 90, b: 180, c: 0 };
}

function spec({ title, componentId, note, layers, b, translations }) {
  return {
    version: 3,
    renderer: 'matematika-diagram-renderer-v3',
    title, componentId, category: 'Definiciones', mode: 'diagram', axis: false, grid: false, showLabels: true,
    viewport: { bounds: [-4.4, 1.75, 4.4, -2.05], home: [-4.4, 1.75, 4.4, -2.05], minZoom: 0.6, maxZoom: 3, padding: 0.06 },
    layers, groups: b.groups, objects: b.objects, relations: [], steps: [], note,
    translations: {
      eu: { title: translations.eu.title, note: translations.eu.note, labels: b.labels.eu, ariaLabels: b.aria.eu },
      en: { title: translations.en.title, note: translations.en.note, labels: b.labels.en, ariaLabels: b.aria.en },
    },
  };
}

const twoSideLayers = [
  { id: 'construction', label: 'Construcción', order: 0, visible: true, locked: true },
  { id: 'relation', label: 'Pares de la relación', order: 1, visible: true, locked: false },
  { id: 'elements', label: 'Elementos', order: 2, visible: true, locked: false },
  { id: 'annotations', label: 'Rótulos', order: 3, visible: true, locked: false },
];

const T = (es, eu, en) => ({ es, eu, en });
const pair = (x, y) => T(`Par (${x}, ${y})`, `(${x}, ${y}) bikotea`, `Pair (${x}, ${y})`);
const missing = (x, y) => T(`Falta el par (${x}, ${y})`, `(${x}, ${y}) bikotea falta da`, `Missing pair (${x}, ${y})`);

function write(name, s) {
  const body = JSON.stringify(s, null, 2);
  const tsx = `import { createDiagramSpec, DiagramRenderer } from '@/diagrams/public';

/* @matematika-diagram-spec:start */
export const ${name}Spec = createDiagramSpec(
${body}
);
/* @matematika-diagram-spec:end */

export const ${name} = () => <DiagramRenderer spec={${name}Spec} />;
`;
  writeFileSync(join(repo, 'content/diagrams/Definiciones', `${name}.tsx`), tsx);
}

// ── Reflexiva ──────────────────────────────────────────────
{
  const b = builder();
  b.divider();
  const out = triangle(b, 'i', -2.2); triangle(b, 'd', 2.2);
  for (const n of ['a', 'b', 'c']) b.loop(`lazoI${n}`, `i${n}`, out[n], 'mora', pair(n, n));
  b.arrow('flechaIab', 'ia', 'ib', 'carbon', pair('a', 'b'));
  for (const n of ['a', 'b']) b.loop(`lazoD${n}`, `d${n}`, out[n], 'mora', pair(n, n));
  b.loop('lazoDc', 'dc', out.c, 'granada', missing('c', 'c'), { dashed: true });
  b.arrow('flechaDab', 'da', 'db', 'carbon', pair('a', 'b'));
  b.group('diagonal', 'Diagonal Δ_A', ['lazoIa', 'lazoIb', 'lazoIc'], T('', 'Δ_A diagonala', 'Diagonal Δ_A'));
  b.caption('rotuloSi', -2.2, 1.5, 'musgo', T('Reflexiva', 'Erreflexiboa', 'Reflexive'));
  b.caption('rotuloNo', 2.2, 1.5, 'granada', T('No reflexiva: falta (c, c)', 'Ez erreflexiboa: (c, c) falta da', 'Not reflexive: (c, c) missing'));
  write('RelacionReflexiva', spec({
    title: 'Relación reflexiva: todos los lazos', componentId: 'relacion-reflexiva', layers: twoSideLayers, b,
    note: 'Cada lazo es un par (x, x). A la derecha falta el de c, así que la relación no es reflexiva.',
    translations: {
      eu: { title: 'Erlazio erreflexiboa: begizta guztiak', note: 'Begizta bakoitza (x, x) bikote bat da. Eskuinean c-rena falta da; beraz, erlazioa ez da erreflexiboa.' },
      en: { title: 'Reflexive relation: every loop', note: 'Each loop is a pair (x, x). On the right the loop at c is missing, so the relation is not reflexive.' },
    },
  }));
}

// ── Simétrica ──────────────────────────────────────────────
{
  const b = builder();
  b.divider();
  triangle(b, 'i', -2.2); triangle(b, 'd', 2.2);
  const o = 0.13;
  b.arrow('flechaIab', 'ia', 'ib', 'carbon', pair('a', 'b'), { offset: o });
  b.arrow('flechaIba', 'ib', 'ia', 'mora', pair('b', 'a'), { offset: o });
  b.arrow('flechaIbc', 'ib', 'ic', 'carbon', pair('b', 'c'), { offset: o });
  b.arrow('flechaIcb', 'ic', 'ib', 'mora', pair('c', 'b'), { offset: o });
  b.arrow('flechaDab', 'da', 'db', 'carbon', pair('a', 'b'), { offset: o });
  b.arrow('flechaDba', 'db', 'da', 'mora', pair('b', 'a'), { offset: o });
  b.arrow('flechaDbc', 'db', 'dc', 'carbon', pair('b', 'c'), { offset: o });
  b.arrow('flechaDcb', 'dc', 'db', 'granada', missing('c', 'b'), { offset: o, dashed: true });
  b.group('reciprocas', 'Pares recíprocos', ['flechaIba', 'flechaIcb'], T('', 'Alderantzizko bikoteak', 'Reverse pairs'));
  b.caption('rotuloSi', -2.2, 1.5, 'musgo', T('Simétrica', 'Simetrikoa', 'Symmetric'));
  b.caption('rotuloNo', 2.2, 1.5, 'granada', T('No simétrica: falta (c, b)', 'Ez simetrikoa: (c, b) falta da', 'Not symmetric: (c, b) missing'));
  write('RelacionSimetrica', spec({
    title: 'Relación simétrica: cada flecha con su recíproca', componentId: 'relacion-simetrica', layers: twoSideLayers, b,
    note: 'Cada flecha va de x a y si x R y. A la derecha, b R c no tiene su recíproca c R b.',
    translations: {
      eu: { title: 'Erlazio simetrikoa: gezi bakoitza bere alderantzizkoarekin', note: 'Gezi bat x-tik y-ra doa x R y bada. Eskuinean, b R c-k ez du bere alderantzizkoa, c R b.' },
      en: { title: 'Symmetric relation: every arrow with its reverse', note: 'An arrow goes from x to y when x R y. On the right, b R c has no reverse c R b.' },
    },
  }));
}

// ── Transitiva ─────────────────────────────────────────────
{
  const b = builder();
  b.divider();
  triangle(b, 'i', -2.2); triangle(b, 'd', 2.2);
  b.arrow('flechaIab', 'ia', 'ib', 'carbon', pair('a', 'b'));
  b.arrow('flechaIbc', 'ib', 'ic', 'carbon', pair('b', 'c'));
  b.arrow('flechaIac', 'ia', 'ic', 'mora', pair('a', 'c'));
  b.arrow('flechaDab', 'da', 'db', 'carbon', pair('a', 'b'));
  b.arrow('flechaDbc', 'db', 'dc', 'carbon', pair('b', 'c'));
  b.arrow('flechaDac', 'da', 'dc', 'granada', missing('a', 'c'), { dashed: true });
  b.group('compuesta', 'Composición R ∘ R', ['flechaIac'], T('', 'R ∘ R konposizioa', 'Composition R ∘ R'));
  b.caption('rotuloSi', -2.2, 1.5, 'musgo', T('Transitiva', 'Iragankorra', 'Transitive'));
  b.caption('rotuloNo', 2.2, 1.5, 'granada', T('No transitiva: falta (a, c)', 'Ez iragankorra: (a, c) falta da', 'Not transitive: (a, c) missing'));
  write('RelacionTransitiva', spec({
    title: 'Relación transitiva: el atajo de cada camino', componentId: 'relacion-transitiva', layers: twoSideLayers, b,
    note: 'El camino a → b → c exige el atajo a → c. A la derecha falta, así que la relación no es transitiva.',
    translations: {
      eu: { title: 'Erlazio iragankorra: bide bakoitzaren lasterbidea', note: 'a → b → c bideak a → c lasterbidea eskatzen du. Eskuinean falta da; beraz, erlazioa ez da iragankorra.' },
      en: { title: 'Transitive relation: the shortcut of every path', note: 'The path a → b → c requires the shortcut a → c. It is missing on the right, so the relation is not transitive.' },
    },
  }));
}

// ── Equivalencia ───────────────────────────────────────────
{
  const b = builder();
  const E = (n) => T(`Elemento ${n}`, `${n} elementua`, `Element ${n}`);
  const cls = (n) => T(`Clase [${n}]`, `[${n}] klasea`, `Class [${n}]`);
  b.region('clase1', -2.35, -0.45, 1.5, 'terracota', cls('a'));
  b.region('clase2', 0.75, -0.45, 1.05, 'pavo', cls('d'));
  b.region('clase3', 2.95, -0.45, 0.8, 'ocre', cls('f'));
  b.elem('a', 'a', -2.35, 0.2, E('a'), 'rt');
  b.elem('b', 'b', -2.95, -0.8, E('b'));
  b.elem('c', 'c', -1.75, -0.8, E('c'));
  b.elem('d', 'd', 0.35, -0.4, E('d'));
  b.elem('e', 'e', 1.15, -0.4, E('e'));
  b.elem('f', 'f', 2.95, -0.4, E('f'));
  const loops = { a: 90, b: 180, c: 0, d: 180, e: 0, f: 90 };
  for (const [n, ang] of Object.entries(loops)) b.loop(`lazo${n}`, n, ang, 'carbon', T(`Par (${n}, ${n})`, `(${n}, ${n}) bikotea`, `Pair (${n}, ${n})`));
  const both = (x, y) => T(`Pares (${x}, ${y}) y (${y}, ${x})`, `(${x}, ${y}) eta (${y}, ${x}) bikoteak`, `Pairs (${x}, ${y}) and (${y}, ${x})`);
  b.arrow('flechaAB', 'a', 'b', 'carbon', both('a', 'b'), { both: true });
  b.arrow('flechaAC', 'a', 'c', 'carbon', both('a', 'c'), { both: true });
  b.arrow('flechaBC', 'b', 'c', 'carbon', both('b', 'c'), { both: true });
  b.arrow('flechaDE', 'd', 'e', 'carbon', both('d', 'e'), { both: true });
  b.caption('rotulo1', -2.35, 1.3, 'terracota', T('[a] = {a, b, c}', '[a] = {a, b, c}', '[a] = {a, b, c}'));
  b.caption('rotulo2', 0.75, 0.85, 'pavo', T('[d] = {d, e}', '[d] = {d, e}', '[d] = {d, e}'));
  b.caption('rotulo3', 2.95, 0.6, 'ocre', T('[f] = {f}', '[f] = {f}', '[f] = {f}'));
  b.group('cociente', 'Conjunto cociente A/∼', ['clase1', 'clase2', 'clase3'], T('', 'A/∼ multzo zatidura', 'Quotient set A/∼'));
  write('RelacionEquivalencia', spec({
    title: 'Relación de equivalencia: clases que parten el conjunto', componentId: 'relacion-equivalencia',
    layers: [
      { id: 'construction', label: 'Construcción', order: 0, visible: true, locked: true },
      { id: 'regions', label: 'Clases', order: 1, visible: true, locked: false },
      { id: 'relation', label: 'Pares de la relación', order: 2, visible: true, locked: false },
      { id: 'elements', label: 'Elementos', order: 3, visible: true, locked: false },
      { id: 'annotations', label: 'Rótulos', order: 4, visible: true, locked: false },
    ],
    b,
    note: 'Cada elemento tiene su lazo y cada flecha va en los dos sentidos; ninguna sale de su clase.',
    translations: {
      eu: { title: 'Baliokidetasun-erlazioa: multzoa zatitzen duten klaseak', note: 'Elementu bakoitzak bere begizta du eta gezi bakoitzak bi noranzkoak; bat ere ez da bere klasetik ateratzen.' },
      en: { title: 'Equivalence relation: classes that partition the set', note: 'Every element has its loop and every arrow runs both ways; none leaves its class.' },
    },
  }));
}
