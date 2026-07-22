import fs from 'node:fs';
import { describe, expect, it } from 'vitest';
import { parseDiagramSourceAST } from '../../../../scripts/editor/parseDiagramSourceAST';
import { generateDiagramSource } from '../../../../src/features/editor/diagrams/source/generator';
import { buildTargets } from '../../../../src/features/editor/diagrams/model/selectors';
import { withMovedPoint, type DiagramSpecV2 } from '../../../../src/shared/diagrams/public';
import { createPoincareGeodesic } from '../../../../src/shared/diagrams/core/MathFactory';

const SOURCE = 'src/widgets/diagrams/Axiomas/HyperbolicParallel.tsx';

function readModel(): DiagramSpecV2 {
  const parsed = parseDiagramSourceAST(fs.readFileSync(SOURCE, 'utf8'));
  if (parsed.status !== 'visual-exact') throw new Error(`HyperbolicParallel debe ser visual-exact: ${JSON.stringify(parsed.diagnostics)}`);
  return parsed.model;
}

function sampleGeodesic(model: DiagramSpecV2, elementId: 'lineM' | 'lineN') {
  const element = model.elements.find(item => item.id === elementId)!;
  const coordinates = Object.fromEntries(model.points.map(point => [point.id, point]));
  let curveArgs: unknown[] = [];
  const board = {
    create: (kind: string, args: unknown[]) => {
      if (kind === 'curve') curveArgs = args;
      return { setAttribute() {}, on() {}, rendNode: undefined };
    },
  };
  const point = (id: string) => ({ X: () => coordinates[id].x, Y: () => coordinates[id].y });
  createPoincareGeodesic(
    board,
    [point(element.refs[0]), point(element.refs[1]), point(element.refs[2]), point(element.refs[3])],
    {},
    {} as never,
  );
  const [xs, ys] = curveArgs as [number[], number[]];
  return xs.map((x, index) => ({ x, y: ys[index] }));
}

describe('HyperbolicParallel', () => {
  it('se reabre y regenera byte a byte como diagrama visual-exact', () => {
    const source = fs.readFileSync(SOURCE, 'utf8');
    const model = readModel();
    const regenerated = generateDiagramSource(model, 'HyperbolicParallel');
    expect(regenerated.ok).toBe(true);
    if (regenerated.ok) expect(regenerated.source).toBe(source);
  });

  it('conserva los targets públicos usados por el MDX', () => {
    const model = readModel();
    const targets = buildTargets(model).map(target => target.id);
    expect(targets).toEqual(expect.arrayContaining(['pP', 'lineM', 'lineN']));
    expect(model.points.find(point => point.id === 'pP')?.showLabel).toBe(true);
    expect(model.points.filter(point => point.id !== 'pP').every(point => point.showLabel === false)).toBe(true);
  });

  it.each([
    [-0.65, 0.35],
    [0, 0.82],
    [0.65, 0.35],
    [20, -20],
  ])('mantiene P exterior a l y dentro del disco al moverlo a (%s, %s)', (x, y) => {
    const moved = withMovedPoint(readModel(), 'pP', x, y);
    const point = moved.points.find(item => item.id === 'pP')!;
    expect(point.y).toBeGreaterThan(0);
    expect(Math.hypot(point.x, point.y)).toBeLessThan(1);

    for (const elementId of ['lineM', 'lineN'] as const) {
      const samples = sampleGeodesic(moved, elementId);
      expect(samples.slice(1, -1).every(sample => sample.y > 0)).toBe(true);
      expect(Math.hypot(samples[0].x, samples[0].y)).toBeCloseTo(1, 6);
      expect(Math.hypot(samples.at(-1)!.x, samples.at(-1)!.y)).toBeCloseTo(1, 6);
      expect(Math.min(...samples.map(sample => Math.hypot(sample.x - point.x, sample.y - point.y)))).toBeLessThan(0.025);
    }
  });
});
