import { describe, expect, it } from 'vitest';
import {
  buildVisualOrderById,
  installTopmostOnlyHitTesting,
  pickPreferredHitId,
} from '../../../src/shared/diagrams/runtime/diagramTopmostHit';

describe('hit preferido bajo el puntero', () => {
  it('elige el id de mayor visualOrder por defecto', () => {
    const order = new Map([['pD', 34], ['pC', 35], ['pB', 36]]);
    expect(pickPreferredHitId(['pD', 'pC'], order)).toBe('pC');
    expect(pickPreferredHitId(['pD'], order)).toBe('pD');
    expect(pickPreferredHitId([], order)).toBeUndefined();
  });

  it('prefiere el glider dependiente al extremo del soporte aunque esté debajo en el apilado', () => {
    const order = new Map([['pD', 34], ['pC', 35]]);
    const parents = new Map<string, readonly string[]>([['pD', ['pB', 'pC']]]);
    expect(pickPreferredHitId(['pD', 'pC'], order, parents)).toBe('pD');
  });

  it('hasPoint del extremo queda enmascarado si el glider dependiente también hittea', () => {
    const visualOrder = buildVisualOrderById([
      { item: { id: 'pD' }, visualOrder: 34 },
      { item: { id: 'pC' }, visualOrder: 35 },
    ]);
    const parents = new Map<string, readonly string[]>([['pD', ['pB', 'pC']]]);
    const elements = {
      pD: { hasPoint: () => true, visPropCalc: { visible: true } },
      pC: { hasPoint: () => true, visPropCalc: { visible: true } },
    };
    installTopmostOnlyHitTesting(elements, visualOrder, parents);
    expect(elements.pD.hasPoint(0, 0)).toBe(true);
    expect(elements.pC.hasPoint(0, 0)).toBe(false);
  });

  it('sin dependencia de soporte, el superior del apilado sigue ganando (como A y B)', () => {
    const visualOrder = buildVisualOrderById([
      { item: { id: 'pA' }, visualOrder: 37 },
      { item: { id: 'pB' }, visualOrder: 36 },
    ]);
    const elements = {
      pA: { hasPoint: () => true, visPropCalc: { visible: true } },
      pB: { hasPoint: () => true, visPropCalc: { visible: true } },
    };
    installTopmostOnlyHitTesting(elements, visualOrder);
    expect(elements.pA.hasPoint(0, 0)).toBe(true);
    expect(elements.pB.hasPoint(0, 0)).toBe(false);
  });
});
