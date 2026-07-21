import fs from 'node:fs';
import { describe, expect, it } from 'vitest';
import { parseDiagramSourceAST } from '../../../../scripts/editor/parseDiagramSourceAST';
import { generateDiagramSource } from '../../../../src/features/editor/diagrams/source/generator';
import { buildTargets } from '../../../../src/features/editor/diagrams/model/selectors';
import {
  buildDependencyGraph,
  createScenePlan,
  evaluateMathExpression,
  expressionVariables,
  resolvePointCoordinates,
  withMovedPoint,
  type DiagramSpecV2,
} from '../../../../src/shared/diagrams/public';
import { createPoincareGeodesic } from '../../../../src/shared/diagrams/core/MathFactory';

const CASES = [
  {
    component: 'Pitagoras',
    source: 'src/widgets/diagrams/Teoremas/Pitagoras.tsx',
    page: 'src/database/content/theorems/teorema-pitagoras.mdx',
    exportKind: 'Simulation',
  },
  {
    component: 'ModeloPoincare',
    source: 'src/widgets/diagrams/Models/ModeloPoincare.tsx',
    page: 'src/database/content/models/modelo-poincare.mdx',
    exportKind: 'Diagram',
  },
  {
    component: 'CongruenciaALA',
    source: 'src/widgets/diagrams/Teoremas/CongruenciaALA.tsx',
    page: 'src/database/content/theorems/teorema-congruencia-ala.mdx',
    exportKind: 'Simulation',
  },
  {
    component: 'Paralelogramo',
    source: 'src/widgets/diagrams/Definiciones/Paralelogramo.tsx',
    page: 'src/database/content/definitions/paralelogramo.mdx',
    exportKind: 'Simulation',
  },
] as const;

function readModel(path: string): DiagramSpecV2 {
  const parsed = parseDiagramSourceAST(fs.readFileSync(path, 'utf8'));
  expect(parsed.status).toBe('visual-exact');
  if (parsed.status !== 'visual-exact') throw new Error(`${path} no es editable visualmente sin pérdida.`);
  return parsed.model;
}

function kindCounts(model: DiagramSpecV2) {
  return Object.fromEntries(
    [...new Set(model.elements.map(element => element.kind))]
      .sort()
      .map(kind => [kind, model.elements.filter(element => element.kind === kind).length]),
  );
}

function visualFingerprint(model: DiagramSpecV2) {
  return {
    componentId: model.componentId,
    viewport: model.viewport.bounds,
    layers: model.layers.map(layer => layer.id),
    points: model.points.length,
    derived: model.points.filter(point => point.constraint === 'derived').length,
    kinds: kindCounts(model),
    steps: model.steps.map(step => step.id),
    targets: buildTargets(model).filter(target => target.kind !== 'step').map(target => target.id),
  };
}

function fitCircle(points: Array<{ x: number; y: number }>) {
  const [a, b, c] = points;
  const determinant = 2 * (a.x * (b.y - c.y) + b.x * (c.y - a.y) + c.x * (a.y - b.y));
  const square = (point: { x: number; y: number }) => point.x ** 2 + point.y ** 2;
  const x = (square(a) * (b.y - c.y) + square(b) * (c.y - a.y) + square(c) * (a.y - b.y)) / determinant;
  const y = (square(a) * (c.x - b.x) + square(b) * (a.x - c.x) + square(c) * (b.x - a.x)) / determinant;
  return { x, y, radius: Math.hypot(a.x - x, a.y - y) };
}

describe('Phase 5 real acceptance migrations', () => {
  it('keeps a stable visual fingerprint for all four production diagrams', () => {
    expect(CASES.map(item => visualFingerprint(readModel(item.source)))).toMatchInlineSnapshot(`
      [
        {
          "componentId": "Pitagoras",
          "derived": 6,
          "kinds": {
            "areaDecomposition": 3,
            "infoPanel": 1,
            "polygon": 1,
            "ray": 2,
            "rightAngle": 1,
            "segment": 3,
          },
          "layers": [
            "construccion",
            "geometria",
            "areas",
            "anotaciones",
          ],
          "points": 11,
          "steps": [],
          "targets": [
            "infoPanel14",
            "triangulo",
            "cuadrado-a",
            "cuadrado-b",
            "cuadrado-c",
          ],
          "viewport": [
            -8,
            8,
            8,
            -8,
          ],
        },
        {
          "componentId": "ModeloPoincare",
          "derived": 12,
          "kinds": {
            "circle": 1,
            "measurement": 1,
            "poincareGeodesic": 7,
          },
          "layers": [
            "construccion",
            "disco",
            "geodesicas",
            "puntos",
            "anotaciones",
          ],
          "points": 17,
          "steps": [],
          "targets": [
            "P",
            "frontera",
            "geodesica-principal",
            "limite1",
            "ultra1",
          ],
          "viewport": [
            -1.18,
            1.18,
            1.18,
            -1.18,
          ],
        },
        {
          "componentId": "CongruenciaALA",
          "derived": 0,
          "kinds": {
            "congruenceMark": 6,
            "dimensionLine": 2,
            "measurement": 2,
            "nonReflexAngle": 6,
            "polygon": 2,
            "segment": 6,
          },
          "layers": [
            "rellenos",
            "geometria",
            "angulos",
            "marcas",
            "cotas",
          ],
          "points": 6,
          "steps": [],
          "targets": [
            "A1",
            "B1",
            "C1",
            "A2",
            "B2",
            "C2",
            "anguloA1",
            "anguloB1",
            "anguloC1",
            "anguloB2",
            "anguloA2",
            "anguloC2",
            "globalmente-congruentes",
            "lado-ab",
            "angulo-a",
            "angulo-b",
          ],
          "viewport": [
            -4,
            8.5,
            9,
            -8.5,
          ],
        },
        {
          "componentId": "paralelogramo",
          "derived": 1,
          "kinds": {
            "circle": 1,
            "congruenceMark": 4,
            "infoPanel": 1,
            "intersection": 1,
            "nonReflexAngle": 4,
            "parallelMark": 4,
            "perpendicular": 1,
            "polygon": 1,
            "rightAngle": 4,
            "segment": 6,
          },
          "layers": [
            "guides",
            "geometry",
            "properties",
            "details",
            "annotations",
          ],
          "points": 4,
          "steps": [],
          "targets": [
            "vertice-movil",
            "clasificacion",
            "poligono",
            "lados-opuestos",
            "lados-iguales",
            "angulos-rectos",
            "angulos-opuestos",
            "diagonales",
          ],
          "viewport": [
            -5.2,
            4.3,
            5.2,
            -4.1,
          ],
        },
      ]
    `);
  });

  it.each(CASES)('$component reopens and regenerates byte for byte', ({ component, source }) => {
    const original = fs.readFileSync(source, 'utf8');
    const parsed = parseDiagramSourceAST(original);
    expect(parsed.status).toBe('visual-exact');
    if (parsed.status !== 'visual-exact') return;
    const regenerated = generateDiagramSource(parsed.model, component);
    expect(regenerated.ok).toBe(true);
    if (regenerated.ok) expect(regenerated.source).toBe(original);
  });

  it('keeps the real MDX consumers connected to the preserved public targets', () => {
    CASES.forEach(({ component, source, page, exportKind }) => {
      const model = readModel(source);
      const mdx = fs.readFileSync(page, 'utf8');
      const publicTargets = new Set(buildTargets(model).map(target => target.id));
      const references = [...mdx.matchAll(/<InteractiveElement\b[^>]*\btarget="([^"]+)"/g)].map(match => match[1]);
      expect(mdx).toContain(`{ ${component} }`);
      expect(mdx).toContain(`export const ${exportKind} = ${component}`);
      references.forEach(target => expect(publicTargets.has(target), `${page}: target ${target}`).toBe(true));
    });
  });

  it('keeps Circunferencia visually quiet and reveals every extra construction through a valid MDX target', () => {
    const source = 'src/widgets/diagrams/Definiciones/Circunferencia.tsx';
    const page = 'src/database/content/definitions/circunferencia.mdx';
    const model = readModel(source);
    const mdx = fs.readFileSync(page, 'utf8');
    const publicTargets = new Set(buildTargets(model).map(target => target.id));
    const references = [
      ...mdx.matchAll(/<InteractiveElement\b[^>]*\btarget="([^"]+)"/g),
      ...mdx.matchAll(/<ConceptLink\b[^>]*\bhighlightTarget="([^"]+)"/g),
    ].map(match => match[1]);

    expect(model.points.filter(point => point.visible).map(point => point.id)).toEqual(['O', 'P']);
    expect(model.elements.filter(element => element.visible).map(element => element.id)).toEqual(['circunferenciaBase', 'radioOP']);
    expect(model.groups.filter(group => group.target).map(group => group.targetId)).toEqual([
      'diametro',
      'cuerda',
      'arco',
      'tangente',
    ]);
    expect(references.length).toBeGreaterThan(0);
    references.forEach(target => expect(publicTargets.has(target), `${page}: target ${target}`).toBe(true));
    [...model.points, ...model.elements]
      .filter(item => !item.visible)
      .forEach(item => expect(item.style?.highlightVisible, item.id).toBe(true));
  });

  it('projects Pitágoras gliders onto positive rays and changes area expressions reactively', () => {
    const model = readModel(CASES[0].source);
    const clamped = withMovedPoint(model, 'A', 0, -5);
    expect(clamped.points.find(point => point.id === 'A')).toMatchObject({ x: 0, y: 0 });
    const moved = withMovedPoint(model, 'B', 6, 0);
    const variables = expressionVariables(moved);
    expect(evaluateMathExpression('segBC.length^2', variables)).toBe(36);
    expect(createScenePlan(model, {}).find(entry => entry.item.id === 'cuadradoA')?.visible).toBe(true);
  });

  it('keeps P inside the disk and constructs geodesics orthogonal to its boundary', () => {
    const model = readModel(CASES[1].source);
    const moved = withMovedPoint(model, 'P', 20, 0);
    const point = moved.points.find(item => item.id === 'P')!;
    expect(Math.hypot(point.x, point.y)).toBeLessThan(1);

    let curveArgs: unknown[] = [];
    const board = { create: (kind: string, args: unknown[]) => {
      if (kind === 'curve') curveArgs = args;
      return { setAttribute() {}, on() {}, rendNode: undefined };
    } };
    const fixedPoint = (x: number, y: number) => ({ X: () => x, Y: () => y });
    createPoincareGeodesic(board, [fixedPoint(0, 0), fixedPoint(1, 0), fixedPoint(0.866, 0.5), fixedPoint(-0.866, 0.5)], {}, {} as never);
    const [xAt, yAt] = curveArgs as [(t: number) => number, (t: number) => number];
    const samples = [0, 0.5, 1].map(t => ({ x: xAt(t), y: yAt(t) }));
    expect(Math.hypot(samples[0].x, samples[0].y)).toBeCloseTo(1, 6);
    expect(Math.hypot(samples[2].x, samples[2].y)).toBeCloseTo(1, 6);
    const geodesicCircle = fitCircle(samples);
    expect(geodesicCircle.x ** 2 + geodesicCircle.y ** 2).toBeCloseTo(geodesicCircle.radius ** 2 + 1, 5);
  });

  it('preserves ALA group targets, measurements and the orientation restriction', () => {
    const model = readModel(CASES[2].source);
    const highlighted = createScenePlan(model, { highlightedIds: ['ladoABGrupo'] });
    expect(highlighted.find(entry => entry.item.id === 'segAB1')?.highlighted).toBe(true);
    expect(highlighted.find(entry => entry.item.id === 'segAB2')?.highlighted).toBe(true);
    expect(highlighted.find(entry => entry.item.id === 'segAC1')?.highlighted).toBe(false);
    const constrained = withMovedPoint(model, 'C1', 2, -4).points.find(point => point.id === 'C1')!;
    expect(constrained.y).toBeGreaterThan(0);
    expect(model.elements.filter(element => element.kind === 'dimensionLine')).toHaveLength(2);
  });

  it('classifies the parallelogram family and exposes only the marks justified by each shape', () => {
    const model = readModel(CASES[3].source);
    const mdx = fs.readFileSync(CASES[3].page, 'utf8');
    const publicTargets = new Set(buildTargets(model).map(target => target.id));
    const references = [
      ...mdx.matchAll(/<InteractiveElement\b[^>]*\btarget="([^"]+)"/g),
      ...mdx.matchAll(/<ConceptLink\b[^>]*\bhighlightTarget="([^"]+)"/g),
    ].map(match => match[1]);
    references.forEach(target => expect(publicTargets.has(target), `${CASES[3].page}: target ${target}`).toBe(true));
    const square = withMovedPoint(model, 'D', -3, 3);
    expect(resolvePointCoordinates(square, 'C')).toEqual({ x: 1.5, y: 3 });
    expect(resolvePointCoordinates(square, 'M')).toEqual({ x: -0.75, y: 0.75 });
    const graph = buildDependencyGraph(model);
    expect(graph.edges).toContainEqual({ sourceId: 'D', targetId: 'C', relation: 'expression' });
    expect(graph.edges).toContainEqual({ sourceId: 'guiaRectangulo', targetId: 'D', relation: 'constraint' });
    expect(model.points.find(point => point.id === 'D')?.attractorIds).toEqual(['guiaRectangulo', 'guiaLadosIguales']);
    const classificationPanel = model.elements.find(element => element.id === 'clasificacion');
    expect(classificationPanel?.properties).toMatchObject({ anchorMode: 'viewport', viewportPosition: [0, 0] });
    const [squareRule, rectangleRule, rhombusRule] = classificationPanel?.properties?.textRules ?? [];
    expect(evaluateMathExpression(squareRule.when, expressionVariables(square))).toBe(1);
    const rectangle = withMovedPoint(model, 'D', -3, 2);
    expect(evaluateMathExpression(squareRule.when, expressionVariables(rectangle))).toBe(0);
    expect(evaluateMathExpression(rectangleRule.when, expressionVariables(rectangle))).toBe(1);
    const rhombus = withMovedPoint(model, 'D', -0.3, 2.1);
    expect(evaluateMathExpression(rhombusRule.when, expressionVariables(rhombus))).toBe(1);
    expect(model.elements.filter(element => element.kind === 'parallelMark').every(element => element.visible)).toBe(true);
    expect(model.elements.filter(element => element.kind === 'congruenceMark').every(element => element.properties?.visibleWhen)).toBe(true);
    expect(model.elements.filter(element => element.kind === 'rightAngle').every(element => element.properties?.visibleWhen)).toBe(true);
  });
});
