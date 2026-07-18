import fs from 'node:fs';
import { describe, expect, it } from 'vitest';
import { parseDiagramSourceAST } from '../../../../scripts/editor/parseDiagramSourceAST';
import { buildTargets } from '../../../../src/features/editor/diagrams/model/selectors';
import { generateDiagramSource } from '../../../../src/features/editor/diagrams/source/generator';
import {
  createScenePlan,
  evaluateMathExpression,
  expressionVariables,
  type DiagramElementKind,
  type DiagramSpecV2,
} from '../../../../src/shared/diagrams/public';

const sourcePath = 'src/widgets/diagrams/Definiciones/Cuadrilatero.tsx';
const pagePath = 'src/database/content/definitions/cuadrilatero.mdx';

function readModel(): DiagramSpecV2 {
  const parsed = parseDiagramSourceAST(fs.readFileSync(sourcePath, 'utf8'));
  expect(parsed.status).toBe('visual-exact');
  if (parsed.status !== 'visual-exact') throw new Error('Cuadrilatero debe ser editable visualmente sin pérdida.');
  return parsed.model;
}

function withCoordinates(model: DiagramSpecV2, coordinates: Record<string, [number, number]>): DiagramSpecV2 {
  return {
    ...model,
    points: model.points.map(point => {
      const next = coordinates[point.id];
      return next ? { ...point, x: next[0], y: next[1] } : point;
    }),
  };
}

function classification(model: DiagramSpecV2): string {
  const panel = model.elements.find(element => element.id === 'clasificacion');
  const variables = expressionVariables(model);
  return panel?.properties?.textRules?.find(rule => evaluateMathExpression(rule.when, variables) !== 0)?.text ?? '';
}

function visibleMarks(model: DiagramSpecV2, kind: DiagramElementKind): number {
  const scene = new Map(createScenePlan(model, {}).map(entry => [entry.item.id, entry.visible]));
  const variables = expressionVariables(model);
  return model.elements.filter(element => (
    element.kind === kind
    && scene.get(element.id)
    && (!element.properties?.visibleWhen || evaluateMathExpression(element.properties.visibleWhen, variables) !== 0)
  )).length;
}

describe('Cuadrilatero visual classifier', () => {
  it('reopens and regenerates byte for byte with every MDX target connected', () => {
    const original = fs.readFileSync(sourcePath, 'utf8');
    const model = readModel();
    const regenerated = generateDiagramSource(model, 'Cuadrilatero');
    expect(regenerated.ok).toBe(true);
    if (regenerated.ok) expect(regenerated.source).toBe(original);

    const publicTargets = new Set(buildTargets(model).map(target => target.id));
    const mdx = fs.readFileSync(pagePath, 'utf8');
    const references = [
      ...mdx.matchAll(/<InteractiveElement\b[^>]*\btarget="([^"]+)"/g),
      ...mdx.matchAll(/<ConceptLink\b[^>]*\bhighlightTarget="([^"]+)"/g),
    ].map(match => match[1]);
    expect(references.length).toBeGreaterThan(0);
    references.forEach(target => expect(publicTargets.has(target), `${pagePath}: target ${target}`).toBe(true));
  });

  it('classifies each family member and displays only its defining marks', () => {
    const model = readModel();
    const square = withCoordinates(model, { C: [2, 3], D: [-3, 3] });
    expect(classification(square)).toContain('Cuadrado');
    expect(visibleMarks(square, 'congruenceMark')).toBe(4);
    expect(visibleMarks(square, 'rightAngle')).toBe(4);
    expect(visibleMarks(square, 'parallelMark')).toBe(0);

    const rectangle = withCoordinates(model, { C: [2, 1], D: [-3, 1] });
    expect(classification(rectangle)).toContain('Rectángulo');
    expect(visibleMarks(rectangle, 'rightAngle')).toBe(4);
    expect(visibleMarks(rectangle, 'congruenceMark')).toBe(0);
    expect(visibleMarks(rectangle, 'parallelMark')).toBe(0);

    const rhombus = withCoordinates(model, { C: [5, 2], D: [0, 2] });
    expect(classification(rhombus)).toContain('Rombo');
    expect(visibleMarks(rhombus, 'congruenceMark')).toBe(4);
    expect(visibleMarks(rhombus, 'rightAngle')).toBe(0);
    expect(visibleMarks(rhombus, 'parallelMark')).toBe(0);

    const parallelogram = withCoordinates(model, { C: [3, 1], D: [-2, 1] });
    expect(classification(parallelogram)).toContain('Paralelogramo');
    expect(visibleMarks(parallelogram, 'parallelMark')).toBe(4);
    expect(visibleMarks(parallelogram, 'congruenceMark')).toBe(0);
    expect(visibleMarks(parallelogram, 'rightAngle')).toBe(0);

    const kite = withCoordinates(model, { C: [1.5, 2.5], D: [-3, 3] });
    expect(classification(kite)).toContain('Cometa');
    expect(visibleMarks(kite, 'congruenceMark')).toBe(4);
    expect(visibleMarks(kite, 'parallelMark')).toBe(0);
    expect(visibleMarks(kite, 'rightAngle')).toBe(0);

    const trapezoid = withCoordinates(model, { C: [1.5, 2], D: [-1.5, 2] });
    expect(classification(trapezoid)).toContain('Trapecio');
    expect(visibleMarks(trapezoid, 'parallelMark')).toBe(2);
    expect(visibleMarks(trapezoid, 'congruenceMark')).toBe(0);
    expect(visibleMarks(trapezoid, 'rightAngle')).toBe(0);

    expect(classification(model)).toContain('Trapezoide');
    expect(visibleMarks(model, 'parallelMark')).toBe(0);
    expect(visibleMarks(model, 'congruenceMark')).toBe(0);
    expect(visibleMarks(model, 'rightAngle')).toBe(0);
  });

  it('keeps angles and diagonals hidden until their textual targets request them', () => {
    const model = readModel();
    const details = model.elements.filter(element => ['anguloA', 'anguloB', 'anguloC', 'anguloD', 'AC', 'BD'].includes(element.id));
    expect(details).toHaveLength(6);
    details.forEach(element => {
      expect(element.visible, element.id).toBe(false);
      expect(element.style?.highlightVisible, element.id).toBe(true);
    });
    expect(model.points.find(point => point.id === 'C')?.attractorIds).toEqual(['guiaRectoB', 'guiaIgualBC']);
    expect(model.points.find(point => point.id === 'D')?.attractorIds).toEqual([
      'guiaParalelaCD',
      'guiaParalelaDA',
      'guiaRectoA',
      'guiaIgualDA',
      'guiaIgualCD',
    ]);
  });
});
