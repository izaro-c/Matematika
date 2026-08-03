import { describe, expect, it } from 'vitest';
import {
  buildVisualOrderById,
  installTopmostOnlyHitTesting,
  pickPreferredHitId,
  resolveCanvasSelectionHitId,
} from '@/diagrams/render/interaction/diagramTopmostHit';

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

  it('un punto gana a un path/polígono aunque el path tenga mayor visualOrder', () => {
    const order = new Map([['pA', 10], ['seg', 50], ['poly', 60]]);
    expect(pickPreferredHitId(['pA', 'seg'], order, undefined, new Set(['pA']))).toBe('pA');
    expect(pickPreferredHitId(['poly', 'pA', 'seg'], order, undefined, new Set(['pA']))).toBe('pA');
  });

  it('entre puntos, sigue ganando el de mayor visualOrder', () => {
    const order = new Map([['pA', 10], ['pB', 40]]);
    expect(pickPreferredHitId(['pA', 'pB'], order, undefined, new Set(['pA', 'pB']))).toBe('pB');
  });

  it('hasPoint del path queda enmascarado si un punto también hittea', () => {
    const visualOrder = buildVisualOrderById([
      { item: { id: 'pA' }, visualOrder: 10 },
      { item: { id: 'seg' }, visualOrder: 50 },
    ]);
    const elements = {
      pA: { hasPoint: () => true, visPropCalc: { visible: true } },
      seg: { hasPoint: () => true, visPropCalc: { visible: true } },
    };
    installTopmostOnlyHitTesting(
      elements,
      visualOrder,
      undefined,
      new Set(['pA', 'seg']),
      new Set(['pA']),
    );
    expect(elements.pA.hasPoint(0, 0)).toBe(true);
    expect(elements.seg.hasPoint(0, 0)).toBe(false);
  });

  it('la selección del lienzo prefiere el punto hovered si sigue bajo el puntero', () => {
    const order = new Map([['pA', 10], ['seg', 50]]);
    expect(resolveCanvasSelectionHitId({
      hitIds: ['pA', 'seg'],
      selectableIds: new Set(['pA', 'seg']),
      visualOrderById: order,
      pointLikeIds: new Set(['pA']),
      hoveredId: 'pA',
    })).toBe('pA');
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

  it('un borde de un elemento inferior no roba el hit al punto de encima', () => {
    const visualOrder = buildVisualOrderById([
      { item: { id: 'poly' }, visualOrder: 10 },
      { item: { id: 'pA' }, visualOrder: 20 },
    ]);
    const border = { hasPoint: () => true, visPropCalc: { visible: true } };
    const elements = {
      poly: {
        hasPoint: () => true,
        borders: [border],
        visPropCalc: { visible: true },
      },
      pA: { hasPoint: () => true, visPropCalc: { visible: true } },
    };
    installTopmostOnlyHitTesting(elements, visualOrder, undefined, undefined, new Set(['pA']));
    expect(elements.pA.hasPoint(0, 0)).toBe(true);
    expect(elements.poly.hasPoint(0, 0)).toBe(false);
    expect(border.hasPoint(0, 0)).toBe(false);
  });

  it('un no seleccionable cede el hit a un seleccionable debajo', () => {
    const visualOrder = buildVisualOrderById([
      { item: { id: 'poly' }, visualOrder: 40 },
      { item: { id: 'pA' }, visualOrder: 10 },
    ]);
    const elements = {
      poly: { hasPoint: () => true, visPropCalc: { visible: true } },
      pA: { hasPoint: () => true, visPropCalc: { visible: true } },
    };
    installTopmostOnlyHitTesting(elements, visualOrder, undefined, new Set(['pA']), new Set(['pA']));
    expect(elements.pA.hasPoint(0, 0)).toBe(true);
    expect(elements.poly.hasPoint(0, 0)).toBe(false);
  });
});
