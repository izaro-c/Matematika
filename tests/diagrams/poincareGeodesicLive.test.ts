import { describe, expect, it } from 'vitest';
import { createPoincareArc, createPoincareGeodesic } from '@/diagrams/jsxgraph/MathFactory';

function captureCurveArgs(create: typeof createPoincareGeodesic) {
  let curveArgs: unknown[] = [];
  const parents: unknown[] = [];
  const board = {
    create: (_kind: string, args: unknown[]) => {
      curveArgs = args;
      return {
        setAttribute() {},
        on() {},
        rendNode: undefined,
        addParents(next: unknown) {
          parents.push(...(Array.isArray(next) ? next : [next]));
        },
      };
    },
  };
  const movable = { x: 0.5, y: 0.3, X: () => movable.x, Y: () => movable.y };
  const refs = [
    { X: () => 0, Y: () => 0 },
    { X: () => 1, Y: () => 0 },
    movable,
    { X: () => -0.5, Y: () => 0.3 },
  ] as const;
  create(board as never, [...refs] as never, {}, {} as never);
  return { curveArgs, parents, movable, refs };
}

function sampleMid(curveArgs: unknown[]) {
  const [xTerm, yTerm] = curveArgs;
  expect(typeof xTerm).toBe('function');
  expect(typeof yTerm).toBe('function');
  const xFn = xTerm as (t: number) => number;
  const yFn = yTerm as (t: number) => number;
  return { x: xFn(0.5), y: yFn(0.5) };
}

describe('poincaré live curves', () => {
  it('recomputes geodesic samples when reference points move', () => {
    const { curveArgs, movable, parents, refs } = captureCurveArgs(createPoincareGeodesic);
    const before = sampleMid(curveArgs);
    movable.x = 0.15;
    movable.y = 0.7;
    const after = sampleMid(curveArgs);
    expect(after.x).not.toBeCloseTo(before.x, 6);
    expect(after.y).not.toBeCloseTo(before.y, 6);
    expect(parents).toEqual(expect.arrayContaining([...refs]));
  });

  it('recomputes arc samples when reference points move', () => {
    const { curveArgs, movable } = captureCurveArgs(createPoincareArc);
    const before = sampleMid(curveArgs);
    movable.x = 0.2;
    movable.y = 0.65;
    const after = sampleMid(curveArgs);
    expect(Math.hypot(after.x - before.x, after.y - before.y)).toBeGreaterThan(0.05);
  });
});
