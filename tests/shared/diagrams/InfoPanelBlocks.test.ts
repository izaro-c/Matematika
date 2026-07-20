import { describe, expect, it } from 'vitest';
import { parseDiagramSpecV2, resolveInfoPanelBlock } from '../../../src/shared/diagrams/public';
import { TrianguloSpec } from '../../../src/widgets/diagrams/Definiciones/Triangulo';

function triangleVariables(
  points: { A: [number, number]; B: [number, number]; C: [number, number] },
  angles: { ABC: number; BAC: number; ACB: number },
) {
  const distance = (left: [number, number], right: [number, number]) => Math.hypot(right[0] - left[0], right[1] - left[1]);
  return {
    'A.x': points.A[0], 'A.y': points.A[1],
    'B.x': points.B[0], 'B.y': points.B[1],
    'C.x': points.C[0], 'C.y': points.C[1],
    'AB.length': distance(points.A, points.B),
    'BC.length': distance(points.B, points.C),
    'CA.length': distance(points.C, points.A),
    'nonReflexAngleABC.degrees': angles.ABC,
    'nonReflexAngleBAC.degrees': angles.BAC,
    'nonReflexAngleACB.degrees': angles.ACB,
  };
}

describe('composite information panels', () => {
  const panel = TrianguloSpec.elements.find(element => element.id === 'infoPanel26')!;
  const [sides, angles] = panel.properties!.infoPanelBlocks!;

  it('classifies exact geometric cases without using display rounding', () => {
    const right = triangleVariables({ A: [0, 0], B: [3, 0], C: [0, 4] }, { ABC: 53.1301023542, BAC: 90, ACB: 36.8698976458 });
    expect(resolveInfoPanelBlock(sides, right).text).toBe('**Escaleno**');
    expect(resolveInfoPanelBlock(angles, right).text).toBe('*Rectángulo*');

    const equilateral = triangleVariables({ A: [0, 0], B: [2, 0], C: [1, Math.sqrt(3)] }, { ABC: 60, BAC: 60, ACB: 60 });
    expect(resolveInfoPanelBlock(sides, equilateral).text).toBe('**Equilátero**');
    expect(resolveInfoPanelBlock(angles, equilateral).text).toBe('*Acutángulo*');
  });

  it('does not present collinear points as a triangle', () => {
    const degenerate = triangleVariables({ A: [0, 0], B: [1, 0], C: [2, 0] }, { ABC: 180, BAC: 0, ACB: 0 });
    expect(resolveInfoPanelBlock(sides, degenerate).text).toMatch(/^No definido/);
    expect(resolveInfoPanelBlock(angles, degenerate).text).toMatch(/^No definido/);
  });

  it('lets each conditional branch calculate and format a different value', () => {
    const resolved = resolveInfoPanelBlock({
      id: 'lectura',
      text: 'Base: {value}',
      expression: 'x',
      precision: 2,
      rules: [{ when: 'gt(x,0)', text: 'Rama: {value}', expression: 'x^2', unit: 'u²', precision: 1 }],
    }, { x: 3 });
    expect(resolved).toMatchObject({ text: 'Rama: 9.0 u²', matchedRuleIndex: 0 });
  });

  it('validates every nested condition and alternative expression', () => {
    const invalid = {
      ...TrianguloSpec,
      elements: TrianguloSpec.elements.map(element => element.id === panel.id
        ? {
            ...element,
            properties: {
              ...element.properties,
              infoPanelBlocks: [{ id: 'lectura', text: '{value}', rules: [{ when: '1', text: '{value}', expression: 'window.alert(1)' }] }],
            },
          }
        : element),
    };
    const parsed = parseDiagramSpecV2(invalid);
    expect(parsed.success).toBe(false);
    if (!parsed.success) expect(parsed.error.message).toContain('infoPanelBlocks');
  });
});
