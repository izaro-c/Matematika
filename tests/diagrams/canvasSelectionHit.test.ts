import { describe, expect, it } from 'vitest';
import { resolveCanvasSelectionHitId } from '@/diagrams/render/interaction/diagramTopmostHit';

describe('resolveCanvasSelectionHitId', () => {
  it('sin pointLikeIds, elige el superior del apilado', () => {
    const order = new Map([['poly', 30], ['pA', 10], ['seg', 20]]);
    expect(resolveCanvasSelectionHitId({
      hitIds: ['pA', 'seg', 'poly'],
      selectableIds: new Set(['pA', 'seg', 'poly']),
      visualOrderById: order,
    })).toBe('poly');
  });

  it('con pointLikeIds, el punto gana al path superior en el apilado', () => {
    const order = new Map([['poly', 30], ['pA', 10], ['seg', 20]]);
    expect(resolveCanvasSelectionHitId({
      hitIds: ['pA', 'seg', 'poly'],
      selectableIds: new Set(['pA', 'seg', 'poly']),
      visualOrderById: order,
      pointLikeIds: new Set(['pA']),
    })).toBe('pA');
  });

  it('ignora ids no seleccionables', () => {
    const order = new Map([['poly', 30], ['pA', 40]]);
    expect(resolveCanvasSelectionHitId({
      hitIds: ['poly', 'pA'],
      selectableIds: new Set(['poly']),
      visualOrderById: order,
    })).toBe('poly');
  });

  it('respeta el target DOM solo si es seleccionable y no hay hit de apilado', () => {
    const order = new Map([['poly', 30]]);
    expect(resolveCanvasSelectionHitId({
      hitIds: [],
      selectableIds: new Set(['poly', 'label']),
      visualOrderById: order,
      targetId: 'label',
    })).toBe('label');
  });
});
