import fs from 'node:fs';
import path from 'node:path';
import { generateDiagramSource } from '../../src/features/editor/diagrams/source/generator';
import {
  DIAGRAM_RENDERER_ID,
  DIAGRAM_SPEC_VERSION,
  extractMathExpressionIdentifiers,
  type DiagramColorToken,
  type DiagramConstraint,
  type DiagramElement,
  type DiagramElementKind,
  type DiagramGroup,
  type DiagramPoint,
  type DiagramSlider,
  type DiagramSpecV2,
  type DiagramStep,
} from '../../src/shared/diagrams/spec';

type Bounds = [number, number, number, number];
type ItemOptions = {
  targetId?: string | false;
  visible?: boolean;
  locked?: boolean;
  selectable?: boolean;
  dashed?: boolean;
  text?: string;
  style?: DiagramElement['style'];
  properties?: DiagramElement['properties'];
  layerId?: string;
};

let order = 0;
const nextOrder = () => (order += 10);

function point(
  id: string,
  label: string,
  x: number,
  y: number,
  color: DiagramColorToken,
  options: {
    targetId?: string | false;
    fixed?: boolean;
    constraint?: DiagramPoint['constraint'];
    constraintIds?: string[];
    showLabel?: boolean;
    snapToGrid?: boolean;
  } = {},
): DiagramPoint {
  const fixed = options.fixed ?? false;
  const target = options.targetId !== false;
  return {
    id,
    label,
    color,
    layerId: 'geometry',
    order: nextOrder(),
    visible: true,
    locked: false,
    groupIds: [],
    selection: {
      selectable: true,
      ariaLabel: fixed ? `Punto fijo ${label}` : `Mover el punto ${label}`,
      role: fixed ? 'secondary' : 'primary',
    },
    target,
    ...(target ? { targetId: options.targetId || id } : {}),
    style: {
      pointSize: 7,
      highlightPointSize: 10,
      preserveColorOnHighlight: true,
    },
    x,
    y,
    showLabel: options.showLabel ?? true,
    fixed,
    constraint: options.constraint ?? (fixed ? 'fixed' : 'free'),
    ...(options.constraintIds ? { constraintIds: options.constraintIds } : {}),
    ...(options.snapToGrid ? { snapToGrid: true, snapSize: 0.25 } : {}),
  };
}

function derivedPoint(
  id: string,
  label: string,
  x: number,
  y: number,
  xExpression: string,
  yExpression: string,
  dependencies: string[],
  color: DiagramColorToken,
  targetId: string | false = false,
): DiagramPoint {
  return {
    ...point(id, label, x, y, color, { targetId, fixed: true, constraint: 'derived' }),
    dependencies,
    xExpression,
    yExpression,
    selection: { selectable: true, ariaLabel: `Punto construido ${label}`, role: 'construction' },
  };
}

function element(
  id: string,
  label: string,
  kind: DiagramElementKind,
  refs: string[],
  color: DiagramColorToken,
  options: ItemOptions = {},
): DiagramElement {
  const target = options.targetId !== undefined && options.targetId !== false;
  const lineLike = ['segment', 'line', 'ray', 'circle', 'arc', 'parallel', 'perpendicular', 'angleBisector', 'dimensionLine'].includes(kind);
  const areaLike = ['polygon', 'areaDecomposition'].includes(kind);
  const angleLike = ['angle', 'nonReflexAngle', 'rightAngle', 'perpendicularMark'].includes(kind);
  return {
    id,
    label,
    color,
    layerId: options.layerId ?? (['infoPanel', 'formula', 'text', 'label'].includes(kind) ? 'annotations' : 'geometry'),
    order: nextOrder(),
    visible: options.visible ?? true,
    locked: options.locked ?? false,
    groupIds: [],
    selection: {
      selectable: options.selectable ?? true,
      ariaLabel: label,
      role: ['infoPanel', 'formula', 'text', 'label', 'measurement'].includes(kind) ? 'annotation' : 'secondary',
    },
    target,
    ...(target ? { targetId: options.targetId as string } : {}),
    style: {
      ...(lineLike ? { strokeWidth: 2.4, highlightStrokeWidth: 3 } : {}),
      ...(areaLike ? { strokeWidth: 2.4, fillOpacity: 0.14, highlightFillOpacity: 0.28 } : {}),
      ...(angleLike ? { angleRadius: kind === 'rightAngle' || kind === 'perpendicularMark' ? 0.45 : 0.58, fillOpacity: 0.22 } : {}),
      preserveColorOnHighlight: true,
      ...options.style,
    },
    kind,
    refs,
    ...(options.dashed ? { dashed: true } : {}),
    ...(options.text !== undefined ? { text: options.text } : {}),
    ...(options.properties ? { properties: options.properties } : {}),
  };
}

function slider(
  id: string,
  label: string,
  x: number,
  y: number,
  min: number,
  max: number,
  value: number,
  step: number,
  color: DiagramColorToken,
  targetId: string | false = id,
): DiagramSlider {
  const target = targetId !== false;
  return {
    id,
    label,
    color,
    layerId: 'annotations',
    order: nextOrder(),
    visible: true,
    locked: false,
    groupIds: [],
    selection: { selectable: true, ariaLabel: `Ajustar ${label}`, role: 'annotation' },
    target,
    ...(target ? { targetId } : {}),
    style: { preserveColorOnHighlight: true },
    x,
    y,
    min,
    max,
    value,
    step,
  };
}

function group(
  id: string,
  label: string,
  memberIds: string[],
  color: DiagramColorToken,
  targetId: string | false = id,
): DiagramGroup {
  return {
    id,
    label,
    memberIds,
    visible: true,
    locked: false,
    selection: { selectable: true, ariaLabel: label, role: 'primary' },
    target: targetId !== false,
    ...(targetId !== false ? { targetId } : {}),
    color,
  };
}

function step(
  id: string,
  label: string,
  description: string,
  visibleTargets: string[],
  primaryTargets: string[] = [],
): DiagramStep {
  return {
    id,
    label,
    description,
    visibleTargets,
    durationMs: 1800,
    objectStates: Object.fromEntries(visibleTargets.map(targetId => [targetId, {
      visible: true,
      emphasis: primaryTargets.includes(targetId) ? 'primary' : 'none',
      interactive: true,
    }])),
  };
}

function panel(id: string, title: string, text: string, color: DiagramColorToken, position: [number, number] = [0.98, 0.03], expression?: string): DiagramElement {
  return element(id, title, 'infoPanel', [], color, {
    targetId: false,
    selectable: true,
    text,
    style: { preserveColorOnHighlight: true },
    properties: {
      title,
      anchorMode: 'viewport',
      viewportPosition: position,
      ...(expression ? { expression, precision: 2 } : {}),
    },
  });
}

function makeSpec(config: {
  title: string;
  componentId: string;
  category: string;
  bounds: Bounds;
  points: DiagramPoint[];
  elements: DiagramElement[];
  groups?: DiagramGroup[];
  sliders?: DiagramSlider[];
  steps?: DiagramStep[];
  constraints?: DiagramConstraint[];
  note: string;
  axis?: boolean;
  grid?: boolean;
}): DiagramSpecV2 {
  const groups = config.groups ?? [];
  const groupMembership = new Map<string, string[]>();
  groups.forEach(item => item.memberIds.forEach(memberId => {
    groupMembership.set(memberId, [...(groupMembership.get(memberId) ?? []), item.id]);
  }));
  const points = config.points.map(item => ({ ...item, groupIds: groupMembership.get(item.id) ?? [] }));
  const elements = config.elements.map(item => ({ ...item, groupIds: groupMembership.get(item.id) ?? [] }));
  const sliders = (config.sliders ?? []).map(item => ({ ...item, groupIds: groupMembership.get(item.id) ?? [] }));
  const dependencies: DiagramSpecV2['dependencies'] = [];
  points.forEach(item => item.dependencies?.forEach(sourceId => dependencies.push({ sourceId, targetId: item.id, relation: 'expression' })));
  elements.forEach(item => {
    const expressions = [
      item.properties?.expression,
      item.properties?.xExpression,
      item.properties?.yExpression,
      item.properties?.tickDistanceExpression,
      item.properties?.visibleWhen,
      ...(item.properties?.textRules?.map(rule => rule.when) ?? []),
    ].filter((value): value is string => Boolean(value));
    new Set(expressions.flatMap(expression => extractMathExpressionIdentifiers(expression).map(identifier => identifier.split('.')[0])))
      .forEach(sourceId => dependencies.push({ sourceId, targetId: item.id, relation: 'expression' }));
  });
  sliders.forEach(item => {
    if (!item.maxExpression) return;
    extractMathExpressionIdentifiers(item.maxExpression).map(identifier => identifier.split('.')[0])
      .forEach(sourceId => dependencies.push({ sourceId, targetId: item.id, relation: 'expression' }));
  });
  const uniqueDependencies = [...new Map(dependencies.map(item => [`${item.sourceId}:${item.targetId}:${item.relation}`, item])).values()];
  return {
    version: DIAGRAM_SPEC_VERSION,
    renderer: DIAGRAM_RENDERER_ID,
    title: config.title,
    componentId: config.componentId,
    category: config.category,
    mode: 'simulation',
    axis: config.axis ?? false,
    grid: config.grid ?? false,
    viewport: { bounds: config.bounds, home: config.bounds, minZoom: 0.55, maxZoom: 5, padding: 0.16 },
    layers: [
      { id: 'geometry', label: 'Geometría', order: 0, visible: true, locked: false },
      { id: 'annotations', label: 'Lecturas y controles', order: 1, visible: true, locked: false },
    ],
    groups,
    points,
    elements,
    sliders,
    steps: config.steps ?? [],
    ...(config.constraints ? { constraints: config.constraints } : {}),
    dependencies: uniqueDependencies,
    note: config.note,
    extensions: {},
  };
}

const items: Array<{ file: string; component: string; spec: DiagramSpecV2 }> = [];
const add = (file: string, component: string, spec: DiagramSpecV2) => items.push({ file, component, spec });

// Definiciones: el acento editorial dominante es musgo.
{
  const O = point('O', 'O', -0.6, 0, 'carbon', { targetId: 'centro', snapToGrid: true });
  const P = point('P', 'P', 2.4, 0.6, 'musgo', { targetId: 'punto-p', snapToGrid: true });
  const Q = point('Q', 'Q', 0, 3, 'pizarra', { targetId: false, fixed: false, constraint: 'glider' });
  Q.gliderTarget = 'circ';
  const R = point('R', 'R', -2.4, 0, 'pizarra', { targetId: false, fixed: false, constraint: 'glider' });
  R.gliderTarget = 'circ';
  const D = derivedPoint('D', "P'", -3.6, -0.6, '2 * O.x - P.x', '2 * O.y - P.y', ['O', 'P'], 'salvia');
  const T = point('T', 'T', -0.6, -3, 'ocre', { targetId: false, fixed: false, constraint: 'glider' });
  T.gliderTarget = 'circ';
  const elements = [
    element('disk', 'Círculo', 'circle', ['O', 'P'], 'musgo', { targetId: 'circulo', style: { strokeWidth: 0, fillOpacity: 0.1, preserveColorOnHighlight: true } }),
    element('circ', 'Circunferencia C(O,r)', 'circle', ['O', 'P'], 'musgo', { targetId: 'circunferencia', style: { strokeWidth: 3, fillOpacity: 0, preserveColorOnHighlight: true } }),
    element('radius', 'Radio OP', 'segment', ['O', 'P'], 'musgo', { targetId: 'radio' }),
    element('diameter', "Diámetro PP'", 'segment', ['P', 'D'], 'salvia', { targetId: 'diametro' }),
    element('chord', 'Cuerda QR', 'segment', ['Q', 'R'], 'pizarra', { targetId: 'cuerda' }),
    element('arc', 'Arco QR', 'arc', ['O', 'Q', 'R'], 'pizarra', { targetId: 'arco', style: { strokeWidth: 3, preserveColorOnHighlight: true } }),
    element('tangent', 'Tangente en T', 'perpendicular', ['O', 'T', 'T'], 'ocre', { targetId: 'tangente', dashed: true }),
    panel('radiusReading', 'Lugar geométrico', 'Todo punto de la curva está a distancia r del centro.', 'musgo'),
  ];
  add('src/widgets/diagrams/Definiciones/Circunferencia.tsx', 'Circunferencia', makeSpec({
    title: 'Circunferencia: centro, radio y elementos asociados', componentId: 'circunferencia', category: 'Definiciones', bounds: [-5, 5, 5, -5],
    points: [O, P, Q, R, D, T], elements,
    note: 'Mueve O y P para trasladar o redimensionar la circunferencia; desliza Q, R y T sobre ella para explorar cuerda, arco y tangente.',
  }));
}

{
  const A = point('A', 'A', -3.2, -1.8, 'musgo', { targetId: false, constraint: 'constrained', constraintIds: ['sideAC'], snapToGrid: true });
  const B = point('B', 'B', 2.8, -2.1, 'musgo', { targetId: false, constraint: 'constrained', constraintIds: ['sideBD'], snapToGrid: true });
  const C = point('C', 'C', 3.4, 1.8, 'musgo', { targetId: false, constraint: 'constrained', constraintIds: ['sideCA'], snapToGrid: true });
  const D = point('D', 'D', -2.3, 2.5, 'musgo', { targetId: false, constraint: 'constrained', constraintIds: ['sideDB'], snapToGrid: true });
  const elements = [
    element('poly', 'Cuadrilátero ABCD', 'polygon', ['A', 'B', 'C', 'D'], 'musgo', { targetId: false, style: { strokeWidth: 3, fillOpacity: 0.14, highlightFillOpacity: 0.28, preserveColorOnHighlight: true } }),
    element('AB', 'Lado AB', 'segment', ['A', 'B'], 'musgo'), element('BC', 'Lado BC', 'segment', ['B', 'C'], 'musgo'),
    element('CD', 'Lado CD', 'segment', ['C', 'D'], 'musgo'), element('DA', 'Lado DA', 'segment', ['D', 'A'], 'musgo'),
    element('AC', 'Diagonal AC', 'segment', ['A', 'C'], 'pizarra', { dashed: true }), element('BD', 'Diagonal BD', 'segment', ['B', 'D'], 'pizarra', { dashed: true }),
    element('angA', 'Ángulo A', 'angle', ['B', 'A', 'D'], 'ocre'), element('angB', 'Ángulo B', 'angle', ['C', 'B', 'A'], 'ocre'),
    element('angC', 'Ángulo C', 'angle', ['D', 'C', 'B'], 'ocre'), element('angD', 'Ángulo D', 'angle', ['A', 'D', 'C'], 'ocre'),
    panel('quadInfo', 'Cuadrilátero simple', '4 vértices · 4 lados · 2 diagonales · suma angular 360°', 'musgo'),
  ];
  const groups = [
    group('gPoly', 'Cuadrilátero', ['poly'], 'musgo', 'poligono'), group('gSides', 'Cuatro lados', ['AB', 'BC', 'CD', 'DA'], 'musgo', 'lados'),
    group('gVertices', 'Cuatro vértices', ['A', 'B', 'C', 'D'], 'musgo', 'vertices'), group('gAngles', 'Cuatro ángulos interiores', ['angA', 'angB', 'angC', 'angD'], 'ocre', 'angulos'),
  ];
  const constraints: DiagramConstraint[] = [
    { id: 'sideAC', label: 'A conserva su lado respecto de BD', kind: 'sameSide', refs: ['A', 'B', 'D'], enabled: true },
    { id: 'sideCA', label: 'C conserva su lado respecto de BD', kind: 'sameSide', refs: ['C', 'B', 'D'], enabled: true },
    { id: 'sideBD', label: 'B conserva su lado respecto de AC', kind: 'sameSide', refs: ['B', 'A', 'C'], enabled: true },
    { id: 'sideDB', label: 'D conserva su lado respecto de AC', kind: 'sameSide', refs: ['D', 'A', 'C'], enabled: true },
  ];
  add('src/widgets/diagrams/Definiciones/Cuadrilatero.tsx', 'Cuadrilatero', makeSpec({
    title: 'Cuadrilátero simple', componentId: 'cuadrilatero', category: 'Definiciones', bounds: [-5.5, 4.5, 5.5, -4.5], points: [A, B, C, D], elements, groups, constraints,
    note: 'Mueve los cuatro vértices. Las restricciones mantienen un contorno simple y las diagonales revelan su descomposición en triángulos.',
  }));
}

{
  const A = point('A', 'A', -3, -2, 'musgo', { targetId: false, snapToGrid: true });
  const B = point('B', 'B', 3, -1.4, 'musgo', { targetId: false, snapToGrid: true });
  const C = point('C', 'C', 0.8, 3, 'musgo', { targetId: false, constraint: 'constrained', constraintIds: ['sameSideC'], snapToGrid: true });
  const elements = [
    element('triangle', 'Triángulo ABC', 'polygon', ['A', 'B', 'C'], 'musgo', { style: { strokeWidth: 2.4, fillOpacity: 0.08, preserveColorOnHighlight: true } }),
    element('Ma', 'Punto medio de BC', 'midpoint', ['B', 'C'], 'pizarra'), element('Mb', 'Punto medio de CA', 'midpoint', ['C', 'A'], 'pizarra'), element('Mc', 'Punto medio de AB', 'midpoint', ['A', 'B'], 'pizarra'),
    element('medA', 'Mediana desde A', 'segment', ['A', 'Ma'], 'musgo'), element('medB', 'Mediana desde B', 'segment', ['B', 'Mb'], 'musgo'), element('medC', 'Mediana desde C', 'segment', ['C', 'Mc'], 'musgo'),
    element('G', 'G', 'intersection', ['medA', 'medB'], 'ocre', { targetId: 'baricentro', style: { pointSize: 7, highlightPointSize: 10, preserveColorOnHighlight: true } }),
    element('AG', 'AG', 'segment', ['A', 'G'], 'musgo', { visible: false }), element('GMa', 'GMₐ', 'segment', ['G', 'Ma'], 'pizarra', { visible: false }),
    panel('ratio', 'Propiedad del baricentro', 'En cada mediana, vértice–G : G–punto medio = 2 : 1.', 'musgo'),
  ];
  const groups = [
    group('gMedian', 'Tres medianas', ['medA', 'medB', 'medC'], 'musgo', 'mediana'), group('gVertex', 'Vértices', ['A', 'B', 'C'], 'musgo', 'vertice'),
    group('gMidpoints', 'Puntos medios', ['Ma', 'Mb', 'Mc'], 'pizarra', 'punto-medio'),
  ];
  add('src/widgets/diagrams/Definiciones/Mediana.tsx', 'Mediana', makeSpec({
    title: 'Medianas y baricentro', componentId: 'mediana', category: 'Definiciones', bounds: [-5, 5, 5, -4.5], points: [A, B, C], elements, groups,
    constraints: [{ id: 'sameSideC', label: 'C no cruza la base AB', kind: 'sameSide', refs: ['C', 'A', 'B'], enabled: true }],
    note: 'Mueve A, B o C. Los puntos medios, las tres medianas y su intersección G se reconstruyen automáticamente.',
  }));
}

{
  const A = point('A', 'A', -3, -1.6, 'musgo', { targetId: false, snapToGrid: true });
  const B = point('B', 'B', 2.5, -0.5, 'musgo', { targetId: false, snapToGrid: true });
  const P = point('P', 'P', -0.5, 2.2, 'pizarra', { targetId: 'punto-p', snapToGrid: true });
  const elements = [
    element('base', 'Recta l', 'line', ['A', 'B'], 'musgo', { targetId: 'recta-base' }),
    element('parallel', 'Recta m paralela a l', 'parallel', ['A', 'B', 'P'], 'musgo', { targetId: 'recta-paralela', dashed: true }),
    panel('parallelInfo', 'Invariante', 'l ∥ m: comparten dirección y no comparten puntos.', 'musgo'),
  ];
  add('src/widgets/diagrams/Definiciones/Paralelas.tsx', 'Paralelas', makeSpec({
    title: 'Rectas paralelas por un punto exterior', componentId: 'paralelas', category: 'Definiciones', bounds: [-5.5, 4.5, 5.5, -4], points: [A, B, P], elements,
    groups: [group('gParallel', 'Par de rectas paralelas', ['base', 'parallel'], 'musgo', 'paralelas')],
    note: 'Mueve A y B para cambiar la dirección común; mueve P para elegir por dónde pasa la paralela.',
  }));
}

{
  const A = point('A', 'A', -3.2, -1.8, 'musgo', { targetId: false, snapToGrid: true });
  const B = point('B', 'B', 1.4, -1.8, 'musgo', { targetId: false, snapToGrid: true });
  const D = point('D', 'D', -1.5, 2.2, 'musgo', { targetId: false, snapToGrid: true });
  const C = derivedPoint('C', 'C', 3.1, 2.2, 'B.x + D.x - A.x', 'B.y + D.y - A.y', ['A', 'B', 'D'], 'musgo');
  const elements = [
    element('poly', 'Paralelogramo ABCD', 'polygon', ['A', 'B', 'C', 'D'], 'musgo', { targetId: false, style: { strokeWidth: 3, fillOpacity: 0.15, preserveColorOnHighlight: true } }),
    element('AB', 'AB', 'segment', ['A', 'B'], 'musgo'), element('BC', 'BC', 'segment', ['B', 'C'], 'musgo'), element('CD', 'CD', 'segment', ['C', 'D'], 'musgo'), element('DA', 'DA', 'segment', ['D', 'A'], 'musgo'),
    element('AC', 'Diagonal AC', 'segment', ['A', 'C'], 'pizarra', { dashed: true }), element('BD', 'Diagonal BD', 'segment', ['B', 'D'], 'pizarra', { dashed: true }),
    element('angA', 'Ángulo A', 'angle', ['B', 'A', 'D'], 'ocre'), element('angB', 'Ángulo B', 'angle', ['C', 'B', 'A'], 'ocre'),
    element('angC', 'Ángulo C', 'angle', ['D', 'C', 'B'], 'ocre'), element('angD', 'Ángulo D', 'angle', ['A', 'D', 'C'], 'ocre'),
    element('center', 'Centro de las diagonales', 'intersection', ['AC', 'BD'], 'pizarra', { style: { pointSize: 7, preserveColorOnHighlight: true } }),
    panel('paraInfo', 'Construcción exacta', 'C = B + D − A; por ello AB ∥ CD y AD ∥ BC.', 'musgo'),
  ];
  const groups = [
    group('gPoly', 'Paralelogramo', ['poly'], 'musgo', 'poligono'), group('gOppSides', 'Lados opuestos', ['AB', 'BC', 'CD', 'DA'], 'musgo', 'lados-opuestos'),
    group('gOppAngles', 'Ángulos opuestos', ['angA', 'angB', 'angC', 'angD'], 'ocre', 'angulos-opuestos'), group('gDiagonals', 'Diagonales', ['AC', 'BD', 'center'], 'pizarra', 'diagonales'),
  ];
  add('src/widgets/diagrams/Definiciones/Paralelogramo.tsx', 'Paralelogramo', makeSpec({
    title: 'Paralelogramo construido por traslación', componentId: 'paralelogramo', category: 'Definiciones', bounds: [-5.5, 4.5, 5.5, -4], points: [A, B, C, D], elements, groups,
    note: 'Mueve A, B o D. El vértice C se calcula para conservar exactamente los dos pares de lados paralelos.',
  }));
}

{
  const P = point('P', 'P', 0, 0, 'musgo', { targetId: 'pPoint', snapToGrid: true });
  add('src/widgets/diagrams/Definiciones/Punto.tsx', 'Punto', makeSpec({
    title: 'Punto: una posición sin dimensión', componentId: 'punto', category: 'Definiciones', bounds: [-4, 4, 4, -4], points: [P], elements: [panel('pointInfo', 'Concepto primitivo', 'P determina una posición; la marca visible no representa tamaño matemático.', 'musgo')],
    note: 'Mueve P por el plano. La marca cambia de posición, pero un punto matemático sigue sin longitud, área ni volumen.',
  }));
}

{
  const A = point('A', 'A', -2.5, -1, 'musgo', { targetId: 'pA', snapToGrid: true });
  const B = point('B', 'B', 2, 1.5, 'musgo', { targetId: 'pB', snapToGrid: true });
  add('src/widgets/diagrams/Definiciones/Recta.tsx', 'Recta', makeSpec({
    title: 'Recta determinada por dos puntos', componentId: 'recta', category: 'Definiciones', bounds: [-5, 4.5, 5, -4.5], points: [A, B],
    elements: [element('line', 'Recta l = AB', 'line', ['A', 'B'], 'musgo', { targetId: 'lineAB', style: { strokeWidth: 3, preserveColorOnHighlight: true } }), panel('lineInfo', 'Incidencia', 'Dos puntos distintos determinan una única recta.', 'musgo')],
    note: 'Mueve A o B. La recta se prolonga indefinidamente en ambos sentidos y siempre pasa por los dos puntos.',
  }));
}

{
  const A = point('A', 'A', -2.8, 0, 'musgo', { targetId: 'pA', snapToGrid: true });
  const B = point('B', 'B', 2.8, 0.8, 'musgo', { targetId: 'pB', snapToGrid: true });
  const elements = [
    element('carrier', 'Recta soporte l', 'line', ['A', 'B'], 'carbon', { targetId: 'lineL', dashed: true, style: { strokeWidth: 2.4, strokeOpacity: 0.45, preserveColorOnHighlight: true } }),
    element('segment', 'Segmento AB', 'segment', ['A', 'B'], 'musgo', { targetId: 'segmentAB', style: { strokeWidth: 3, preserveColorOnHighlight: true } }),
    element('length', 'Longitud AB', 'dimensionLine', ['A', 'B'], 'pizarra', { targetId: false, text: '|AB| = {value}', properties: { precision: 2, offset: 0.45 } }),
  ];
  add('src/widgets/diagrams/Definiciones/Segmento.tsx', 'Segmento', makeSpec({
    title: 'Segmento y recta soporte', componentId: 'segmento', category: 'Definiciones', bounds: [-5, 4, 5, -4], points: [A, B], elements,
    note: 'Mueve A o B. La recta soporte es ilimitada; el segmento comprende únicamente los extremos y los puntos entre ellos.',
  }));
}

{
  const A = point('A', 'A', -3, -2, 'musgo', { targetId: 'vertice-a', constraint: 'constrained', constraintIds: ['sameA'], snapToGrid: true });
  const B = point('B', 'B', 3, -1.5, 'musgo', { targetId: 'vertice-b', constraint: 'constrained', constraintIds: ['sameB'], snapToGrid: true });
  const C = point('C', 'C', 0.5, 2.8, 'musgo', { targetId: 'vertice-c', constraint: 'constrained', constraintIds: ['sameC'], snapToGrid: true });
  const elements = [
    element('poly', 'Triángulo ABC', 'polygon', ['A', 'B', 'C'], 'musgo', { targetId: 'triangulo', style: { strokeWidth: 3, fillOpacity: 0.14, preserveColorOnHighlight: true } }),
    element('AB', 'Lado AB', 'segment', ['A', 'B'], 'musgo', { targetId: 'lado-ab' }), element('BC', 'Lado BC', 'segment', ['B', 'C'], 'musgo', { targetId: 'lado-bc' }), element('CA', 'Lado CA', 'segment', ['C', 'A'], 'musgo', { targetId: 'lado-ca' }),
    element('angA', 'Ángulo A', 'angle', ['B', 'A', 'C'], 'pizarra'), element('angB', 'Ángulo B', 'angle', ['C', 'B', 'A'], 'pizarra'), element('angC', 'Ángulo C', 'angle', ['A', 'C', 'B'], 'pizarra'),
    panel('triInfo', 'Tres elementos de cada clase', '3 vértices · 3 lados · 3 ángulos interiores', 'musgo'),
  ];
  const constraints: DiagramConstraint[] = [
    { id: 'sameA', label: 'A no cruza BC', kind: 'sameSide', refs: ['A', 'B', 'C'], enabled: true },
    { id: 'sameB', label: 'B no cruza CA', kind: 'sameSide', refs: ['B', 'C', 'A'], enabled: true },
    { id: 'sameC', label: 'C no cruza AB', kind: 'sameSide', refs: ['C', 'A', 'B'], enabled: true },
  ];
  add('src/widgets/diagrams/Definiciones/Triangulo.tsx', 'Triangulo', makeSpec({
    title: 'Triángulo no degenerado', componentId: 'triangulo', category: 'Definiciones', bounds: [-5, 5, 5, -4.5], points: [A, B, C], elements, constraints,
    note: 'Mueve los tres vértices. Las restricciones impiden que un vértice cruce el lado opuesto y conservan un triángulo no degenerado.',
  }));
}

// Teoremas: terracota domina; el lema conserva su acento editorial granada.
function crossingLines(accent: DiagramColorToken, componentId: string, withSteps: boolean) {
  const O = point('O', 'O', 0, 0, 'carbon', { targetId: false, fixed: true });
  const A = point('A', 'A', 3.2, 1.4, accent, { targetId: false, snapToGrid: true });
  const B = point('B', 'B', -1.7, 2.8, 'pizarra', { targetId: false, snapToGrid: true });
  const Ap = derivedPoint('Ap', "A'", -3.2, -1.4, '-A.x', '-A.y', ['A'], accent);
  const Bp = derivedPoint('Bp', "B'", 1.7, -2.8, '-B.x', '-B.y', ['B'], 'pizarra');
  const elements = [
    element('lineL', 'Recta l', 'line', ['A', 'Ap'], 'carbon', { targetId: 'lineL' }),
    element('lineM', 'Recta m', 'line', ['B', 'Bp'], 'carbon', { targetId: 'lineM' }),
    element('angle1', 'α', 'nonReflexAngle', ['A', 'O', 'B'], accent, { targetId: 'angle1', style: { angleRadius: 0.75, fillOpacity: 0.28, preserveColorOnHighlight: true } }),
    element('angle2', 'β', 'nonReflexAngle', ['B', 'O', 'Ap'], 'pizarra', { targetId: 'angle2', style: { angleRadius: 0.58, fillOpacity: 0.2, preserveColorOnHighlight: true } }),
    element('angle3', "α'", 'nonReflexAngle', ['Ap', 'O', 'Bp'], accent, { targetId: 'angle3', style: { angleRadius: 0.75, fillOpacity: 0.28, preserveColorOnHighlight: true } }),
    element('angle4', "β'", 'nonReflexAngle', ['Bp', 'O', 'A'], 'pizarra', { targetId: 'angle4', style: { angleRadius: 0.58, fillOpacity: 0.2, preserveColorOnHighlight: true } }),
    panel('oppositeInfo', 'Pares opuestos', "α = α' y β = β' para cualquier inclinación de l y m.", accent),
  ];
  const groups = [
    group('gAlpha', 'Ángulos α y α′', ['angle1', 'angle3'], accent, 'alpha'),
    group('gBeta', 'Ángulos β y β′', ['angle2', 'angle4'], 'pizarra', 'beta'),
    group('gSupp12', 'Primer par suplementario', ['angle1', 'angle2'], accent, 'supp12'),
    group('gSupp23', 'Segundo par suplementario', ['angle2', 'angle3'], 'pizarra', 'supp23'),
    group('gCongruence13', 'Resta del ángulo común', ['angle1', 'angle2', 'angle3'], accent, 'congruence13'),
  ];
  const steps = withSteps ? [
    step('step1', 'Suplementarios I', 'Los ángulos 1 y 2 forman un ángulo llano.', elements.map(item => item.id), ['angle1', 'angle2', 'lineL']),
    step('step2', 'Suplementarios II', 'Los ángulos 2 y 3 forman otro ángulo llano.', elements.map(item => item.id), ['angle2', 'angle3', 'lineM']),
    step('step3', 'Transitividad', 'Las dos sumas son congruentes por ser ángulos llanos.', elements.map(item => item.id), ['angle1', 'angle2', 'angle3']),
    step('step4', 'Resta', 'Se resta el ángulo 2, común a ambas sumas.', elements.map(item => item.id), ['angle1', 'angle3']),
    step('step5', 'Segundo par', 'El mismo argumento demuestra la congruencia del otro par.', elements.map(item => item.id), ['angle2', 'angle4']),
  ] : [];
  return makeSpec({
    title: withSteps ? 'Demostración de los ángulos opuestos por el vértice' : 'Ángulos opuestos por el vértice',
    componentId, category: withSteps ? 'Demostraciones' : 'Teoremas', bounds: [-5, 5, 5, -5], points: [O, A, B, Ap, Bp], elements, groups, steps,
    note: withSteps ? 'Avanza por los cinco pasos y mueve A o B para comprobar que el argumento no depende de una figura particular.' : 'Mueve A o B para girar las rectas; cada par de sectores del mismo color conserva su medida.',
  });
}

add('src/widgets/diagrams/Teoremas/AngulosOpuestos.tsx', 'AngulosOpuestos', crossingLines('terracota', 'angulos-opuestos', false));
add('src/widgets/diagrams/Demos/DemoAngulosOpuestos.tsx', 'DemoAngulosOpuestos', crossingLines('granada', 'demo-angulos-opuestos', true));

{
  const A = point('A', 'A', -4, -1.5, 'terracota', { targetId: false, fixed: true });
  const B = point('B', 'B', -0.8, -1.5, 'terracota', { targetId: false, fixed: true });
  const C = point('C', 'C', -3, 1.7, 'terracota', { targetId: false, snapToGrid: true });
  const A2 = point('A2', "A'", 0.7, -1.5, 'terracota', { targetId: false, fixed: true });
  const B2 = derivedPoint('B2', "B'", 3.9, -1.5, 'A2.x + B.x - A.x', 'A2.y + B.y - A.y', ['A2', 'A', 'B'], 'terracota');
  const C2 = derivedPoint('C2', "C'", 1.7, 1.7, 'A2.x + C.x - A.x', 'A2.y + C.y - A.y', ['A2', 'A', 'C'], 'terracota');
  const elements = [
    element('tri1', 'Triángulo ABC', 'polygon', ['A', 'B', 'C'], 'terracota', { style: { strokeWidth: 3, fillOpacity: 0.12, preserveColorOnHighlight: true } }),
    element('tri2', "Triángulo A'B'C'", 'polygon', ['A2', 'B2', 'C2'], 'terracota', { style: { strokeWidth: 3, fillOpacity: 0.12, preserveColorOnHighlight: true } }),
    element('AB', 'AB', 'segment', ['A', 'B'], 'terracota'), element('A2B2', "A'B'", 'segment', ['A2', 'B2'], 'terracota'),
    element('markAB', 'Marca AB', 'congruenceMark', ['A', 'B'], 'terracota', { properties: { markCount: 1 } }), element('markA2B2', "Marca A'B'", 'congruenceMark', ['A2', 'B2'], 'terracota', { properties: { markCount: 1 } }),
    element('angA', 'Ángulo A', 'nonReflexAngle', ['B', 'A', 'C'], 'terracota'), element('angA2', "Ángulo A'", 'nonReflexAngle', ['B2', 'A2', 'C2'], 'terracota'),
    element('angB', 'Ángulo B', 'nonReflexAngle', ['C', 'B', 'A'], 'pizarra'), element('angB2', "Ángulo B'", 'nonReflexAngle', ['C2', 'B2', 'A2'], 'pizarra'),
    panel('alaInfo', 'ALA', 'Dos ángulos y el lado comprendido determinan un único triángulo.', 'terracota'),
  ];
  const groups = [
    group('gAll', 'Triángulos congruentes', ['tri1', 'tri2', 'AB', 'A2B2', 'angA', 'angA2', 'angB', 'angB2'], 'terracota', 'globalmente-congruentes'),
    group('gSide', 'Lados comprendidos congruentes', ['AB', 'A2B2', 'markAB', 'markA2B2'], 'terracota', 'lado-ab'),
    group('gAngleA', 'Primer par angular', ['angA', 'angA2'], 'terracota', 'angulo-a'),
    group('gAngleB', 'Segundo par angular', ['angB', 'angB2'], 'pizarra', 'angulo-b'),
  ];
  add('src/widgets/diagrams/Teoremas/CongruenciaALA.tsx', 'CongruenciaALA', makeSpec({
    title: 'Criterio de congruencia ALA', componentId: 'congruencia-ala', category: 'Teoremas', bounds: [-5.5, 3.8, 5.5, -3.5], points: [A, B, C, A2, B2, C2], elements, groups,
    note: 'Mueve C. El segundo triángulo se reconstruye como una copia exacta: el lado comprendido y los dos pares angulares permanecen congruentes.',
  }));
}

{
  const A = point('A', 'A', -3, -2, 'terracota', { targetId: 'A', constraint: 'constrained', constraintIds: ['sameA'], snapToGrid: true });
  const B = point('B', 'B', 3, -1.7, 'terracota', { targetId: 'B', constraint: 'constrained', constraintIds: ['sameB'], snapToGrid: true });
  const C = point('C', 'C', 0.3, 2.6, 'terracota', { targetId: 'C', constraint: 'constrained', constraintIds: ['sameC'], snapToGrid: true });
  const elements = [
    element('poly', 'Triángulo ABC', 'polygon', ['A', 'B', 'C'], 'terracota', { targetId: false, style: { strokeWidth: 3, fillOpacity: 0.1, preserveColorOnHighlight: true } }),
    element('AB', 'c = AB', 'segment', ['A', 'B'], 'terracota', { targetId: false }), element('BC', 'a = BC', 'segment', ['B', 'C'], 'terracota', { targetId: false }), element('CA', 'b = CA', 'segment', ['C', 'A'], 'terracota', { targetId: false }),
    element('dAB', 'c', 'dimensionLine', ['A', 'B'], 'pizarra', { text: 'c = {value}', properties: { precision: 2, offset: 0.35 } }),
    element('dBC', 'a', 'dimensionLine', ['B', 'C'], 'pizarra', { text: 'a = {value}', properties: { precision: 2, offset: 0.35 } }),
    element('dCA', 'b', 'dimensionLine', ['C', 'A'], 'pizarra', { text: 'b = {value}', properties: { precision: 2, offset: 0.35 } }),
    panel('slack', 'Margen de la desigualdad', 'a + b − c = {value}', 'terracota', [0.98, 0.03], 'BC.length + CA.length - AB.length'),
  ];
  const groups = [
    group('gTriangle', 'Triángulo', ['poly', 'AB', 'BC', 'CA'], 'terracota', 'triangulo'), group('gSides', 'Lados', ['AB', 'BC', 'CA'], 'terracota', 'lados'),
    group('gA', 'Lado a', ['BC', 'dBC'], 'terracota', 'lado-a'), group('gB', 'Lado b', ['CA', 'dCA'], 'terracota', 'lado-b'), group('gC', 'Lado c', ['AB', 'dAB'], 'terracota', 'lado-c'),
    group('gIneq', 'Desigualdad triangular', ['poly', 'AB', 'BC', 'CA', 'slack'], 'terracota', 'desigualdad'),
  ];
  const constraints: DiagramConstraint[] = [
    { id: 'sameA', label: 'A no cruza BC', kind: 'sameSide', refs: ['A', 'B', 'C'], enabled: true }, { id: 'sameB', label: 'B no cruza CA', kind: 'sameSide', refs: ['B', 'C', 'A'], enabled: true }, { id: 'sameC', label: 'C no cruza AB', kind: 'sameSide', refs: ['C', 'A', 'B'], enabled: true },
  ];
  add('src/widgets/diagrams/Teoremas/DesigualdadTriangular.tsx', 'DesigualdadTriangular', makeSpec({
    title: 'Desigualdad triangular', componentId: 'desigualdad-triangular', category: 'Teoremas', bounds: [-5, 5, 5, -4.5], points: [A, B, C], elements, groups, constraints,
    note: 'Mueve los vértices y compara las tres longitudes. El margen a + b − c permanece positivo mientras el triángulo no sea degenerado.',
  }));
}

{
  const A = point('A', 'A', -3, -1.8, 'terracota', { targetId: false, snapToGrid: true });
  const B = point('B', 'B', 2.8, 1.6, 'terracota', { targetId: false, snapToGrid: true });
  const C = point('C', 'C', -2.8, 2, 'pizarra', { targetId: false, snapToGrid: true });
  const D = point('D', 'D', 3, -2.2, 'pizarra', { targetId: false, snapToGrid: true });
  const elements = [
    element('line1', 'Recta l', 'line', ['A', 'B'], 'terracota', { targetId: 'line1' }), element('line2', 'Recta m', 'line', ['C', 'D'], 'pizarra', { targetId: 'line2' }),
    element('P', 'P', 'intersection', ['line1', 'line2'], 'terracota', { targetId: 'P_interseccion', style: { pointSize: 7, highlightPointSize: 10, preserveColorOnHighlight: true } }),
    panel('incidenceInfo', 'Unicidad', 'Si l y m fueran distintas y compartieran dos puntos, I-1 obligaría a l = m.', 'terracota'),
  ];
  add('src/widgets/diagrams/Teoremas/DosRectasUnPunto.tsx', 'DosRectasUnPunto', makeSpec({
    title: 'Dos rectas distintas comparten a lo sumo un punto', componentId: 'dos-rectas-un-punto', category: 'Teoremas', bounds: [-5, 5, 5, -5], points: [A, B, C, D], elements,
    groups: [group('gLines', 'Dos rectas', ['line1', 'line2'], 'terracota', 'rectas'), group('gPoint', 'Punto de intersección', ['P'], 'terracota', 'punto')],
    note: 'Mueve los puntos que determinan l y m. Cuando no son paralelas, el renderer construye una única intersección P.',
  }));
}

{
  const A = point('A', 'A', -3, 0, 'granada', { targetId: 'A', snapToGrid: true });
  const B = point('B', 'B', 3, 1, 'granada', { targetId: 'B', snapToGrid: true });
  const elements = [
    element('AB', 'Segmento AB', 'segment', ['A', 'B'], 'granada', { targetId: false, style: { strokeWidth: 3, preserveColorOnHighlight: true } }),
    element('M', 'M', 'midpoint', ['A', 'B'], 'granada', { targetId: 'punto-medio', style: { pointSize: 7, highlightPointSize: 10, preserveColorOnHighlight: true } }),
    element('AM', 'AM', 'segment', ['A', 'M'], 'granada'), element('MB', 'MB', 'segment', ['M', 'B'], 'granada'),
    element('dAM', 'AM', 'dimensionLine', ['A', 'M'], 'pizarra', { text: 'AM = {value}', properties: { precision: 2, offset: 0.45 } }),
    element('dMB', 'MB', 'dimensionLine', ['M', 'B'], 'pizarra', { text: 'MB = {value}', properties: { precision: 2, offset: -0.45 } }),
  ];
  add('src/widgets/diagrams/Teoremas/LemaPuntoMedio.tsx', 'LemaPuntoMedio', makeSpec({
    title: 'Existencia y unicidad del punto medio', componentId: 'lema-punto-medio', category: 'Lemas', bounds: [-5, 3.5, 5, -3.5], points: [A, B], elements,
    groups: [group('gSegment', 'Segmento AB', ['AB'], 'granada', 'segmento'), group('gCongruence', 'Subsegmentos congruentes', ['AM', 'MB', 'dAM', 'dMB'], 'granada', 'congruencia')],
    note: 'Mueve A o B. M se recalcula como (A + B)/2 y las lecturas confirman AM = MB.',
  }));
}

{
  const A = point('A', 'A', -3, -2, 'terracota', { targetId: false, snapToGrid: true });
  const B = point('B', 'B', 3, -1.5, 'terracota', { targetId: false, snapToGrid: true });
  const C = point('C', 'C', 0.5, 2.7, 'terracota', { targetId: false, constraint: 'constrained', constraintIds: ['sameC'], snapToGrid: true });
  const elements = [
    element('poly', 'Triángulo ABC', 'polygon', ['A', 'B', 'C'], 'terracota', { style: { strokeWidth: 3, fillOpacity: 0.1, preserveColorOnHighlight: true } }),
    element('AB', 'AB', 'segment', ['A', 'B'], 'terracota'), element('BC', 'BC', 'segment', ['B', 'C'], 'terracota'), element('CA', 'CA', 'segment', ['C', 'A'], 'terracota'),
    element('angA', 'α', 'angle', ['B', 'A', 'C'], 'terracota'), element('angB', 'β', 'angle', ['C', 'B', 'A'], 'terracota'), element('angC', 'γ', 'angle', ['A', 'C', 'B'], 'terracota'),
    panel('sumInfo', 'Invariante euclidiano', 'α + β + γ = 180°', 'terracota'),
  ];
  add('src/widgets/diagrams/Teoremas/SumaAngulos.tsx', 'SumaAngulos', makeSpec({
    title: 'Suma de los ángulos de un triángulo', componentId: 'suma-angulos', category: 'Teoremas', bounds: [-5, 5, 5, -4.5], points: [A, B, C], elements,
    groups: [group('gTriangle', 'Triángulo ABC', ['poly', 'AB', 'BC', 'CA'], 'terracota', 'triangulo'), group('gAngles', 'Ángulos interiores', ['angA', 'angB', 'angC'], 'terracota', 'angulos')],
    constraints: [{ id: 'sameC', label: 'C no cruza AB', kind: 'sameSide', refs: ['C', 'A', 'B'], enabled: true }],
    note: 'Mueve los vértices. La figura cambia, pero el panel recuerda el invariante cuya demostración usa una paralela por C.',
  }));
}

{
  const A = point('A', 'A', -3, -1.6, 'terracota', { targetId: false, snapToGrid: true });
  const B = point('B', 'B', 3, -1.6, 'terracota', { targetId: false, snapToGrid: true });
  const h = slider('height', 'altura', -1.6, -3.1, 1, 5, 3.2, 0.1, 'terracota', 'altura');
  const C = derivedPoint('C', 'C', 0, 1.6, '(A.x + B.x) / 2 - height * (B.y - A.y) / hypot(B.x - A.x, B.y - A.y)', '(A.y + B.y) / 2 + height * (B.x - A.x) / hypot(B.x - A.x, B.y - A.y)', ['A', 'B', 'height'], 'terracota');
  const elements = [
    element('base', 'Base AB', 'segment', ['A', 'B'], 'carbon'), element('AC', 'Lado AC', 'segment', ['A', 'C'], 'terracota'), element('BC', 'Lado BC', 'segment', ['B', 'C'], 'terracota'),
    element('poly', 'Triángulo isósceles', 'polygon', ['A', 'B', 'C'], 'terracota', { style: { strokeWidth: 2.4, fillOpacity: 0.1, preserveColorOnHighlight: true } }),
    element('markAC', 'Marca AC', 'congruenceMark', ['A', 'C'], 'terracota', { properties: { markCount: 1 } }), element('markBC', 'Marca BC', 'congruenceMark', ['B', 'C'], 'terracota', { properties: { markCount: 1 } }),
    element('angA', 'Ángulo de base A', 'nonReflexAngle', ['B', 'A', 'C'], 'terracota'), element('angB', 'Ángulo de base B', 'nonReflexAngle', ['C', 'B', 'A'], 'terracota'),
    panel('isoInfo', 'Pons asinorum', 'AC = BC ⇒ ∠A = ∠B', 'terracota'),
  ];
  add('src/widgets/diagrams/Teoremas/TrianguloIsosceles.tsx', 'TrianguloIsosceles', makeSpec({
    title: 'Ángulos de la base de un triángulo isósceles', componentId: 'triangulo-isosceles', category: 'Teoremas', bounds: [-5, 5, 5, -4.5], points: [A, B, C], elements, sliders: [h],
    groups: [group('gEqualSides', 'Lados iguales AC y BC', ['AC', 'BC', 'markAC', 'markBC'], 'terracota', 'lados-iguales')],
    note: 'Mueve A o B y ajusta la altura. C permanece sobre la mediatriz de AB, de modo que AC = BC en toda configuración.',
  }));
}

// Demostraciones: granada domina y los pasos controlan visibilidad y énfasis.
{
  const A = point('A', 'A', -4, -2.2, 'granada', { targetId: false, fixed: true });
  const B = point('B', 'B', 0, -2.2, 'granada', { targetId: false, fixed: true });
  const C = point('C', 'C', -3.2, 1.8, 'granada', { targetId: false, snapToGrid: true });
  const A2 = point('A2', "A'", 0.8, -2.2, 'granada', { targetId: false, fixed: true });
  const B2 = derivedPoint('B2', "B'", 4.8, -2.2, 'A2.x + B.x - A.x', 'A2.y + B.y - A.y', ['A2', 'A', 'B'], 'granada');
  const C2 = derivedPoint('C2', "C'", 1.6, 1.8, 'A2.x + C.x - A.x', 'A2.y + C.y - A.y', ['A2', 'A', 'C'], 'granada');
  const Cstar = derivedPoint('Cstar', 'C*', 1.6, 1.8, 'C2.x', 'C2.y', ['C2'], 'pizarra', 'pointC');
  const elements = [
    element('tri1', 'Triángulo ABC', 'polygon', ['A', 'B', 'C'], 'granada', { style: { strokeWidth: 3, fillOpacity: 0.1, preserveColorOnHighlight: true } }),
    element('tri2', "Triángulo A'B'C'", 'polygon', ['A2', 'B2', 'C2'], 'granada', { style: { strokeWidth: 3, fillOpacity: 0.1, preserveColorOnHighlight: true } }),
    element('triConstructed', "Triángulo A'B'C*", 'polygon', ['A2', 'B2', 'Cstar'], 'pizarra', { style: { strokeWidth: 3, fillOpacity: 0.05, preserveColorOnHighlight: true } }),
    element('AB', 'AB', 'segment', ['A', 'B'], 'granada'), element('A2B2', "A'B'", 'segment', ['A2', 'B2'], 'granada'),
    element('AC', 'AC', 'segment', ['A', 'C'], 'granada'), element('A2Cstar', "A'C*", 'segment', ['A2', 'Cstar'], 'pizarra'),
    element('rayAC', "Semirrecta A'C*", 'ray', ['A2', 'Cstar'], 'pizarra', { targetId: 'rayAC', dashed: true }),
    element('angA', 'Ángulo A', 'nonReflexAngle', ['B', 'A', 'C'], 'granada'), element('angA2', "Ángulo A'", 'nonReflexAngle', ['B2', 'A2', 'Cstar'], 'granada'),
    element('angB', 'Ángulo B', 'nonReflexAngle', ['C', 'B', 'A'], 'granada'), element('angB2', "Ángulo B'", 'nonReflexAngle', ['Cstar', 'B2', 'A2'], 'granada'),
    panel('alaProofInfo', 'Idea de la prueba', 'Transportar AC produce C*; la unicidad angular obliga a C* = C′.', 'granada'),
  ];
  const groups = [
    group('gTri1', 'Triángulo ABC', ['tri1', 'AB', 'AC', 'angA', 'angB'], 'granada', 'triangle1'),
    group('gTri2', "Triángulo A'B'C'", ['tri2', 'A2B2', 'angA2', 'angB2'], 'granada', 'triangle2'),
    group('gSide', 'Lados AB y A′B′', ['AB', 'A2B2'], 'granada', 'sideAB'), group('gAngleA', 'Ángulos A y A′', ['angA', 'angA2'], 'granada', 'angleA'),
    group('gAngleB', 'Ángulos B y B′', ['angB', 'angB2'], 'granada', 'angleB'),
  ];
  const all = elements.map(item => item.id);
  const steps = [
    step('step1', 'Transporte', 'Se copia AC sobre la semirrecta de A′ para obtener C*.', all.filter(id => id !== 'triConstructed'), ['AB', 'A2B2', 'AC', 'A2Cstar', 'rayAC']),
    step('step2', 'Aplicación de LAL', 'Los triángulos ABC y A′B′C* satisfacen LAL.', all, ['tri1', 'triConstructed', 'angA', 'angA2']),
    step('step3', 'Unicidad', 'Los rayos desde B′ coinciden y por ello C* = C′.', all, ['Cstar', 'tri2', 'triConstructed', 'angB', 'angB2']),
  ];
  add('src/widgets/diagrams/Demos/DemoCongruenciaALA.tsx', 'DemoCongruenciaALA', makeSpec({
    title: 'Demostración del criterio ALA', componentId: 'demo-congruencia-ala', category: 'Demostraciones', bounds: [-5.5, 4.5, 5.5, -4], points: [A, B, C, A2, B2, C2, Cstar], elements, groups, steps,
    note: 'Avanza por los pasos y mueve C. La copia transportada se actualiza sin romper las correspondencias.',
  }));
}

{
  const A = point('A', "A'", -2.4, 0, 'granada', { targetId: false, fixed: true });
  const B = point('B', "B'", 2.4, 0, 'granada', { targetId: false, fixed: true });
  const C = point('C', "C'", -0.7, 2.6, 'granada', { targetId: false, snapToGrid: true });
  const Cstar = derivedPoint('Cstar', 'C*', -0.7, -2.6, 'C.x', '2 * A.y - C.y', ['A', 'C'], 'pizarra');
  const elements = [
    element('triPrime', "Triángulo A'B'C'", 'polygon', ['A', 'B', 'C'], 'granada', { style: { strokeWidth: 3, fillOpacity: 0.1, preserveColorOnHighlight: true } }),
    element('triStar', "Triángulo A'B'C*", 'polygon', ['A', 'B', 'Cstar'], 'pizarra', { style: { strokeWidth: 3, fillOpacity: 0.08, preserveColorOnHighlight: true } }),
    element('AB', "A'B'", 'segment', ['A', 'B'], 'granada'), element('AC', "A'C'", 'segment', ['A', 'C'], 'granada'), element('BC', "B'C'", 'segment', ['B', 'C'], 'granada'),
    element('ACstar', "A'C*", 'segment', ['A', 'Cstar'], 'pizarra'), element('BCstar', "B'C*", 'segment', ['B', 'Cstar'], 'pizarra'), element('CCstar', "C'C*", 'segment', ['C', 'Cstar'], 'salvia', { targetId: 'lineCC', dashed: true }),
    element('angC', "Ángulo en C'", 'nonReflexAngle', ['A', 'C', 'B'], 'granada', { targetId: 'angleC' }),
    panel('lllProofInfo', 'Construcción espejo', 'C′ y C* son las dos intersecciones de círculos con centros A′ y B′.', 'granada'),
  ];
  const groups = [
    group('gPrime', "Triángulo con C'", ['triPrime', 'AB', 'AC', 'BC'], 'granada', 'triangleCPrime'),
    group('gStar', 'Triángulo con C*', ['triStar', 'AB', 'ACstar', 'BCstar'], 'pizarra', 'triangleCStar'),
    group('gAB', 'Lado AB correspondiente', ['AB'], 'granada', 'sideAB'), group('gBC', 'Lados BC correspondientes', ['BC', 'BCstar'], 'granada', 'sideBC'), group('gAC', 'Lados AC correspondientes', ['AC', 'ACstar'], 'granada', 'sideAC'),
    group('gACstar', 'Segmento A′C*', ['ACstar'], 'pizarra', 'sideACStar'), group('gBCstar', 'Segmento B′C*', ['BCstar'], 'pizarra', 'sideBCStar'),
    group('gIsoLeft', 'Isósceles con vértice A′', ['AC', 'ACstar', 'CCstar'], 'granada', 'isoLeft'), group('gIsoRight', 'Isósceles con vértice B′', ['BC', 'BCstar', 'CCstar'], 'pizarra', 'isoRight'),
  ];
  const all = elements.map(item => item.id);
  const steps = [
    step('step1', 'Transporte', 'Se construye C* reflejando el ángulo y copiando A′C′.', all.filter(id => !['CCstar', 'angC'].includes(id)), ['triPrime', 'triStar', 'AB', 'ACstar']),
    step('step2', 'LAL', 'El triángulo transportado es congruente al original de referencia.', all.filter(id => id !== 'CCstar'), ['triStar', 'ACstar', 'BCstar']),
    step('step3', 'Isósceles auxiliares', 'El segmento C′C* forma dos triángulos isósceles.', all, ['CCstar', 'AC', 'ACstar', 'BC', 'BCstar']),
    step('step4', 'Conclusión', 'Las igualdades angulares permiten aplicar LAL a los triángulos finales.', all, ['triPrime', 'triStar', 'angC']),
  ];
  add('src/widgets/diagrams/Demos/DemoCongruenciaLLL.tsx', 'DemoCongruenciaLLL', makeSpec({
    title: 'Demostración del criterio LLL', componentId: 'demo-congruencia-lll', category: 'Demostraciones', bounds: [-5, 4.5, 5, -4.5], points: [A, B, C, Cstar], elements, groups, steps,
    note: 'Mueve C′ y recorre los pasos. C* se mantiene como su reflejo respecto de A′B′, haciendo visibles los dos triángulos isósceles auxiliares.',
  }));
}

{
  const A = point('A', 'A', -3.2, -2.2, 'granada', { targetId: false, fixed: true });
  const B = point('B', 'B', 3.2, -2.2, 'granada', { targetId: false, fixed: true });
  const C = point('C', 'C', 0.7, 1.7, 'granada', { targetId: 'vertice-c', constraint: 'constrained', constraintIds: ['sameC'], snapToGrid: true });
  const L = derivedPoint('L', 'L', -5.7, 1.7, 'C.x - (B.x - A.x)', 'C.y - (B.y - A.y)', ['A', 'B', 'C'], 'pizarra');
  const R = derivedPoint('R', 'R', 7.1, 1.7, 'C.x + (B.x - A.x)', 'C.y + (B.y - A.y)', ['A', 'B', 'C'], 'pizarra');
  const elements = [
    element('poly', 'Triángulo ABC', 'polygon', ['A', 'B', 'C'], 'granada', { style: { strokeWidth: 3, fillOpacity: 0.1, preserveColorOnHighlight: true } }),
    element('AB', 'Base AB', 'segment', ['A', 'B'], 'granada', { targetId: 'base-ab' }), element('AC', 'Transversal AC', 'segment', ['A', 'C'], 'granada', { targetId: 'transversal-ac' }), element('BC', 'Transversal BC', 'segment', ['B', 'C'], 'granada', { targetId: 'transversal-bc' }),
    element('parallel', 'Paralela por C', 'line', ['L', 'R'], 'pizarra', { targetId: 'paralela', dashed: true }),
    element('angA', 'α', 'nonReflexAngle', ['B', 'A', 'C'], 'granada', { targetId: 'angulo-a' }), element('angB', 'β', 'nonReflexAngle', ['C', 'B', 'A'], 'granada', { targetId: 'angulo-b' }), element('angC', 'γ', 'nonReflexAngle', ['A', 'C', 'B'], 'granada', { targetId: 'angulo-c' }),
    element('altA', "α'", 'nonReflexAngle', ['L', 'C', 'A'], 'pizarra', { targetId: 'alterno-a' }), element('altB', "β'", 'nonReflexAngle', ['B', 'C', 'R'], 'pizarra', { targetId: 'alterno-b' }),
    panel('sumProofInfo', 'Ángulo llano en C', "α' + γ + β' = 180°", 'granada'),
  ];
  const groups = [group('gTriangle', 'Triángulo', ['poly', 'AB', 'AC', 'BC'], 'granada', 'triangulo'), group('gAngles', 'Ángulos', ['angA', 'angB', 'angC'], 'granada', 'angulos'), group('gStraight', 'Ángulo llano', ['parallel', 'altA', 'angC', 'altB'], 'granada', 'angulo-llano')];
  const all = elements.map(item => item.id);
  const steps = [
    step('step1', 'Triángulo base', 'Se fijan los tres ángulos interiores.', ['poly', 'AB', 'AC', 'BC', 'angA', 'angB', 'angC', 'sumProofInfo'], ['poly', 'angA', 'angB', 'angC']),
    step('step2', 'Paralela por C', 'Se construye la única paralela a AB que pasa por C.', all.filter(id => !['altA', 'altB'].includes(id)), ['parallel', 'AB']),
    step('step3', 'Alternos internos I', 'AC transporta α al vértice C.', all.filter(id => id !== 'altB'), ['AC', 'angA', 'altA']),
    step('step4', 'Alternos internos II', 'BC transporta β al vértice C.', all, ['BC', 'angB', 'altB']),
    step('step5', 'Ángulo llano', 'Los tres sectores consecutivos completan 180°.', all, ['altA', 'angC', 'altB', 'parallel']),
  ];
  add('src/widgets/diagrams/Teoremas/DemoSumaAngulos.tsx', 'DemoSumaAngulos', makeSpec({
    title: 'Demostración de la suma angular', componentId: 'demo-suma-angulos', category: 'Demostraciones', bounds: [-6, 4.5, 6, -4.5], points: [A, B, C, L, R], elements, groups, steps,
    constraints: [{ id: 'sameC', label: 'C no cruza AB', kind: 'sameSide', refs: ['C', 'A', 'B'], enabled: true }],
    note: 'Recorre los cinco pasos y mueve C. La paralela se reconstruye y los ángulos alternos siguen completando un ángulo llano.',
  }));
}

{
  const A = point('A', 'A', -4, -2.2, 'granada', { targetId: false, fixed: true });
  const B = point('B', 'B', 0, -2.2, 'granada', { targetId: false, fixed: true });
  const C = point('C', 'C', -3.2, 1.6, 'granada', { targetId: false, fixed: true });
  const D = point('D', 'D', 4, -2.2, 'pizarra', { targetId: false, fixed: true });
  const E = point('E', 'E', 3.1, 1.6, 'pizarra', { targetId: false, fixed: true });
  const elements = [
    element('p1', 'Polígono P₁', 'polygon', ['A', 'B', 'C'], 'granada', { style: { strokeWidth: 3, fillOpacity: 0.16, preserveColorOnHighlight: true } }),
    element('p2', 'Polígono P₂', 'polygon', ['B', 'D', 'E'], 'pizarra', { style: { strokeWidth: 3, fillOpacity: 0.13, preserveColorOnHighlight: true } }),
    element('shared', 'Frontera común', 'segment', ['B', 'E'], 'carbon', { dashed: true }),
    element('t1a', 'Triángulo A₁', 'polygon', ['A', 'B', 'C'], 'granada', { style: { strokeWidth: 1.6, fillOpacity: 0.08, preserveColorOnHighlight: true } }),
    element('t2a', 'Triángulo B₁', 'polygon', ['B', 'D', 'E'], 'pizarra', { style: { strokeWidth: 1.6, fillOpacity: 0.08, preserveColorOnHighlight: true } }),
    panel('areaInfo', 'Aditividad', 'Cont(P₁ ∪ P₂) = Cont(P₁) + Cont(P₂)', 'granada'),
  ];
  const groups = [
    group('gP1', 'Polígono P₁', ['p1'], 'granada', 'poligono-p1'), group('gP2', 'Polígono P₂', ['p2'], 'pizarra', 'poligono-p2'),
    group('gTri1', 'Triangulación de P₁', ['t1a'], 'granada', 'triangulacion-p1'), group('gTri2', 'Triangulación de P₂', ['t2a'], 'pizarra', 'triangulacion-p2'),
    group('gUnion', 'Polígono total P', ['p1', 'p2', 'shared'], 'granada', 'poligono-p'),
  ];
  const all = elements.map(item => item.id);
  const steps = [
    step('step1', 'Triangulaciones', 'Cada polígono se expresa como unión de triángulos de interiores disjuntos.', all, ['t1a', 't2a']),
    step('step2', 'Unión', 'Ambas triangulaciones encajan a lo largo de la frontera común.', all, ['p1', 'p2', 'shared']),
    step('step3', 'Contenido', 'La suma de los contenidos triangulares se separa en las dos familias.', all, ['areaInfo', 'p1', 'p2']),
  ];
  add('src/widgets/diagrams/Demos/DemoAreaAditividad.tsx', 'DemoAreaAditividad', makeSpec({
    title: 'Aditividad del contenido', componentId: 'demo-area-aditividad', category: 'Demostraciones', bounds: [-5.5, 4.2, 5.5, -4], points: [A, B, C, D, E], elements, groups, steps,
    note: 'Recorre los tres pasos. El borde común no aporta área y las dos familias de triángulos cubren exactamente P.',
  }));
}

{
  const A = point('A', 'A', -3, -1.5, 'granada', { targetId: false, fixed: true, showLabel: false });
  const B = point('B', 'B', 3, -1.5, 'granada', { targetId: false, fixed: true, showLabel: false });
  const C = point('C', 'C', 3, 2.5, 'granada', { targetId: false, fixed: true, showLabel: false });
  const D = point('D', 'D', -3, 2.5, 'granada', { targetId: false, fixed: true, showLabel: false });
  const U1 = point('U1', 'U₁', -3, -1.5, 'ocre', { targetId: false, fixed: true, showLabel: false });
  const U2 = point('U2', 'U₂', -2, -1.5, 'ocre', { targetId: false, fixed: true, showLabel: false });
  const U3 = point('U3', 'U₃', -2, -0.5, 'ocre', { targetId: false, fixed: true, showLabel: false });
  const U4 = point('U4', 'U₄', -3, -0.5, 'ocre', { targetId: false, fixed: true, showLabel: false });
  const elements = [
    element('rect', 'Rectángulo R', 'polygon', ['A', 'B', 'C', 'D'], 'granada', { targetId: 'rectangulo-r', style: { strokeWidth: 3, fillOpacity: 0.08, preserveColorOnHighlight: true } }),
    element('grid', 'Cuadrícula unitaria', 'grid', ['A', 'B', 'C', 'D'], 'granada', { properties: { rows: 4, columns: 6 }, style: { strokeWidth: 1.2, strokeOpacity: 0.45, preserveColorOnHighlight: true } }),
    element('unit', 'Cuadrado unidad', 'polygon', ['U1', 'U2', 'U3', 'U4'], 'ocre', { targetId: 'cuadrado-unidad', style: { strokeWidth: 3, fillOpacity: 0.3, preserveColorOnHighlight: true } }),
    panel('gridInfo', 'Conteo de unidades', '6 × 4 cuadrados unidad ⇒ Cont(R) = b · h', 'granada'),
  ];
  add('src/widgets/diagrams/Demos/DemoAreaRectangulo_Conmensurable.tsx', 'DemoAreaRectanguloConmensurable', makeSpec({
    title: 'Área del rectángulo: caso conmensurable', componentId: 'demo-area-rectangulo-conmensurable', category: 'Demostraciones', bounds: [-4.5, 4, 4.5, -3], points: [A, B, C, D, U1, U2, U3, U4], elements,
    steps: [step('step1', 'Caso conmensurable', 'La cuadrícula cuenta m · n copias del cuadrado unidad.', elements.map(item => item.id), ['grid', 'unit', 'rect'])],
    note: 'La cuadrícula interna traduce el producto b · h en un conteo de cuadrados unidad.',
  }));
}

{
  const eps = slider('epsilon', 'ε', -1.5, -3.1, 0.1, 0.8, 0.4, 0.05, 'granada', 'epsilon');
  const A = point('A', 'A', -2.7, -1.5, 'granada', { targetId: false, fixed: true, showLabel: false });
  const B = point('B', 'B', 2.7, -1.5, 'granada', { targetId: false, fixed: true, showLabel: false });
  const C = point('C', 'C', 2.7, 2, 'granada', { targetId: false, fixed: true, showLabel: false });
  const D = point('D', 'D', -2.7, 2, 'granada', { targetId: false, fixed: true, showLabel: false });
  const derived = [
    derivedPoint('Ai', 'Ai', -2.3, -1.1, 'A.x + epsilon', 'A.y + epsilon', ['A', 'epsilon'], 'musgo'), derivedPoint('Bi', 'Bi', 2.3, -1.1, 'B.x - epsilon', 'B.y + epsilon', ['B', 'epsilon'], 'musgo'),
    derivedPoint('Ci', 'Ci', 2.3, 1.6, 'C.x - epsilon', 'C.y - epsilon', ['C', 'epsilon'], 'musgo'), derivedPoint('Di', 'Di', -2.3, 1.6, 'D.x + epsilon', 'D.y - epsilon', ['D', 'epsilon'], 'musgo'),
    derivedPoint('Ao', 'Ao', -3.1, -1.9, 'A.x - epsilon', 'A.y - epsilon', ['A', 'epsilon'], 'pizarra'), derivedPoint('Bo', 'Bo', 3.1, -1.9, 'B.x + epsilon', 'B.y - epsilon', ['B', 'epsilon'], 'pizarra'),
    derivedPoint('Co', 'Co', 3.1, 2.4, 'C.x + epsilon', 'C.y + epsilon', ['C', 'epsilon'], 'pizarra'), derivedPoint('Do', 'Do', -3.1, 2.4, 'D.x - epsilon', 'D.y + epsilon', ['D', 'epsilon'], 'pizarra'),
  ];
  const elements = [
    element('outer', 'Rectángulo exterior Rₖ⁺', 'polygon', ['Ao', 'Bo', 'Co', 'Do'], 'pizarra', { targetId: 'rectangulo-k-max', style: { strokeWidth: 2.4, fillOpacity: 0.05, preserveColorOnHighlight: true } }),
    element('rect', 'Rectángulo R', 'polygon', ['A', 'B', 'C', 'D'], 'granada', { targetId: 'rectangulo-r', style: { strokeWidth: 3, fillOpacity: 0.12, preserveColorOnHighlight: true } }),
    element('inner', 'Rectángulo interior Rₖ⁻', 'polygon', ['Ai', 'Bi', 'Ci', 'Di'], 'musgo', { targetId: 'rectangulo-k-min', style: { strokeWidth: 2.4, fillOpacity: 0.14, preserveColorOnHighlight: true } }),
    panel('squeezeInfo', 'Encaje arquimediano', 'Rₖ⁻ ⊂ R ⊂ Rₖ⁺; al reducir ε, ambas áreas acotan la de R.', 'granada'),
  ];
  add('src/widgets/diagrams/Demos/DemoAreaRectangulo_Inconmensurable.tsx', 'DemoAreaRectanguloInconmensurable', makeSpec({
    title: 'Área del rectángulo: caso inconmensurable', componentId: 'demo-area-rectangulo-inconmensurable', category: 'Demostraciones', bounds: [-4.5, 4, 4.5, -3.5], points: [A, B, C, D, ...derived], elements, sliders: [eps],
    steps: [step('step2', 'Caso inconmensurable', 'Los rectángulos racionales interior y exterior encajan a R.', elements.map(item => item.id), ['outer', 'rect', 'inner'])],
    note: 'Ajusta ε. Los rectángulos racionales interior y exterior se aproximan simultáneamente a R.',
  }));
}

// Caso de uso: pizarra es el acento editorial dominante.
{
  const S1 = point('S1', 'S₁', -3.5, 2.7, 'pizarra', { targetId: 's1', fixed: true });
  const S2 = point('S2', 'S₂', 3.4, 2.4, 'ocre', { targetId: 's2', fixed: true });
  const S3 = point('S3', 'S₃', 2.8, -2.8, 'pavo', { targetId: 's3', fixed: true });
  const R = point('R', 'R', 0.2, -0.2, 'pizarra', { targetId: 'R', snapToGrid: true });
  const H1 = derivedPoint('H1', 'H₁', 0.2, 2.7, 'R.x', 'S1.y', ['R', 'S1'], 'pizarra');
  const elements = [
    element('circ1', 'Circunferencia de señal S₁', 'circle', ['S1', 'R'], 'pizarra', { targetId: 'circ1', style: { strokeWidth: 2.4, fillOpacity: 0.02, preserveColorOnHighlight: true } }),
    element('circ2', 'Circunferencia de señal S₂', 'circle', ['S2', 'R'], 'ocre', { targetId: 'circ2', dashed: true, style: { strokeWidth: 2.4, fillOpacity: 0, preserveColorOnHighlight: true } }),
    element('circ3', 'Circunferencia de señal S₃', 'circle', ['S3', 'R'], 'pavo', { targetId: 'circ3', dashed: true, style: { strokeWidth: 2.4, fillOpacity: 0, preserveColorOnHighlight: true } }),
    element('rad1', 'd₁', 'segment', ['S1', 'R'], 'pizarra', { targetId: 'rad1' }), element('rad2', 'd₂', 'segment', ['S2', 'R'], 'ocre', { targetId: 'rad2' }), element('rad3', 'd₃', 'segment', ['S3', 'R'], 'pavo', { targetId: 'rad3' }),
    element('catH1', 'Δx', 'segment', ['S1', 'H1'], 'pizarra', { targetId: 'catH1', dashed: true }), element('catV1', 'Δy', 'segment', ['H1', 'R'], 'pizarra', { targetId: 'catV1', dashed: true }),
    element('right1', 'Ángulo recto', 'rightAngle', ['S1', 'H1', 'R'], 'pizarra'),
    element('d1', 'd₁', 'dimensionLine', ['S1', 'R'], 'pizarra', { text: 'd₁ = {value}', properties: { precision: 2, offset: 0.25 } }),
    element('d2', 'd₂', 'dimensionLine', ['S2', 'R'], 'ocre', { text: 'd₂ = {value}', properties: { precision: 2, offset: 0.25 } }),
    element('d3', 'd₃', 'dimensionLine', ['S3', 'R'], 'pavo', { text: 'd₃ = {value}', properties: { precision: 2, offset: 0.25 } }),
  ];
  add('src/widgets/diagrams/CasosUso/GpsTrilateracion.tsx', 'GpsTrilateracion', makeSpec({
    title: 'Trilateración en el plano', componentId: 'gps-trilateracion', category: 'Casos de uso', bounds: [-6, 5, 6, -5], points: [S1, S2, S3, R, H1], elements, axis: true,
    note: 'Mueve R. Cada distancia define una circunferencia de posiciones posibles; las tres restricciones coinciden en el receptor.',
  }));
}

for (const item of items) {
  const generated = generateDiagramSource(item.spec, item.component);
  if (!generated.ok) {
    throw new Error(`${item.component}: ${generated.diagnostics.map(diagnostic => diagnostic.message).join('\n')}`);
  }
  fs.writeFileSync(path.resolve(item.file), generated.source, 'utf8');
}

console.log(`Regenerados ${items.length} diagramas visual-exact.`);
