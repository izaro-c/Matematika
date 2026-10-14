import fs from 'node:fs';
import { describe, expect, it } from 'vitest';
import { parseDiagramSourceAST } from '../../../../scripts/editor/parseDiagramSourceAST';
import { buildTargets } from '../../../../src/fixed-pages/editor/diagrams/model/scene/selectors';
import { generateDiagramSource } from '../../../../src/fixed-pages/editor/diagrams/source/generator';
import {
  createScenePlan,
  evaluateMathExpression,
  expressionVariables,
  objectKind,
  objectStyle,
  type AnnotationObject,
  type DiagramConstructionKind,
  type DiagramSpec,
  type PointObject,
} from '../../../../src/diagrams/public';
import { findById, movedTo } from '../../../helpers/diagramSpec';

const sourcePath = 'content/diagrams/Definiciones/Cuadrilatero.tsx';
const pagePath = 'content/mdx/es/definitions/cuadrilatero.mdx';

function readModel(): DiagramSpec {
  const parsed = parseDiagramSourceAST(fs.readFileSync(sourcePath, 'utf8'));
  expect(parsed.status).toBe('visual-exact');
  if (parsed.status !== 'visual-exact') throw new Error('Cuadrilatero debe ser editable visualmente sin pérdida.');
  return parsed.model;
}

function withCoordinates(model: DiagramSpec, coordinates: Record<string, [number, number]>): DiagramSpec {
  return Object.entries(coordinates).reduce((current, [id, [x, y]]) => movedTo(current, id, x, y), model);
}

function classification(model: DiagramSpec): string {
  const panel = findById<AnnotationObject>(model, 'clasificacion');
  const variables = expressionVariables(model);
  const rules = panel.content.blocks?.[0]?.rules ?? panel.content.rules;
  return rules?.find(rule => evaluateMathExpression(rule.when, variables) !== 0)?.text ?? '';
}

function visibleMarks(model: DiagramSpec, kind: DiagramConstructionKind): number {
  const scene = new Map(createScenePlan(model, {}).map(entry => [entry.item.id, entry.visible]));
  const variables = expressionVariables(model);
  return model.objects.filter(object => (
    objectKind(object) === kind
    && scene.get(object.id)
    && (!object.visibleWhen || evaluateMathExpression(object.visibleWhen, variables) !== 0)
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
      ...mdx.matchAll(/<VisualBind\b[^>]*\belement="([^"]+)"/g),
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
    const details = model.objects.filter(element => ['anguloA', 'anguloB', 'anguloC', 'anguloD', 'AC', 'BD'].includes(element.id));
    expect(details).toHaveLength(6);
    details.forEach(element => {
      expect(element.visible, element.id).toBe(false);
      expect(objectStyle(element)?.highlightVisible, element.id).toBe(true);
    });
    expect(findById<PointObject>(model, 'C').interaction?.attractorIds).toEqual(['guiaRectoB', 'guiaIgualBC']);
    expect(findById<PointObject>(model, 'D').interaction?.attractorIds).toEqual([
      'guiaParalelaCD',
      'guiaParalelaDA',
      'guiaRectoA',
      'guiaIgualDA',
      'guiaIgualCD',
    ]);
  });
});
