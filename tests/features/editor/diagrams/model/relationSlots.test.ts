import { describe, expect, it } from 'vitest';
import { createTemplateModel, element, point } from '../../../../../src/features/editor/diagrams/model';
import {
  candidatesForSlot,
  editableSlotsFor,
  isIdAllowedForSlot,
  relationAvailability,
} from '../../../../../src/features/editor/diagrams/model/relationSlots';

function modelWithPointsAndLine() {
  const base = createTemplateModel('lienzo-inicial', 'Test', 'test');
  return {
    ...base,
    points: [
      point('pA', 'A', 0, 0),
      point('pB', 'B', 1, 0),
      point('pC', 'C', 0, 1),
    ],
    elements: [
      element('lineAB', 'AB', 'line', ['pA', 'pB'], 'terracota'),
      element('segBC', 'BC', 'segment', ['pB', 'pC'], 'terracota'),
    ],
  };
}

describe('relationSlots', () => {
  it('lists only editable reference slots for distance', () => {
    const slots = editableSlotsFor('distance');
    expect(slots.map(slot => slot.index)).toEqual([1]);
    expect(slots[0]?.label).toMatch(/punto|referencia/i);
  });

  it('candidatesForSlot for distance returns only other points, never lines', () => {
    const model = modelWithPointsAndLine();
    const candidates = candidatesForSlot(model, 'distance', 1, ['pA']);
    const ids = candidates.map(item => item.id);
    expect(ids).toEqual(expect.arrayContaining(['pB', 'pC']));
    expect(ids).not.toContain('pA');
    expect(ids).not.toContain('lineAB');
    expect(ids).not.toContain('segBC');
  });

  it('candidatesForSlot for on returns supports only', () => {
    const model = modelWithPointsAndLine();
    const ids = candidatesForSlot(model, 'on', 1, ['pA']).map(item => item.id);
    expect(ids).toEqual(expect.arrayContaining(['lineAB', 'segBC']));
    expect(ids).not.toContain('pB');
  });

  it('isIdAllowedForSlot rejects incompatible canvas picks', () => {
    const model = modelWithPointsAndLine();
    expect(isIdAllowedForSlot(model, 'distance', 1, ['pA'], 'pB')).toBe(true);
    expect(isIdAllowedForSlot(model, 'distance', 1, ['pA'], 'lineAB')).toBe(false);
  });

  it('relationAvailability disables distance when only one point exists', () => {
    const base = createTemplateModel('lienzo-inicial', 'Solo', 'test');
    const model = { ...base, points: [point('pA', 'A', 0, 0)], elements: [] };
    const availability = relationAvailability(model, 'distance', 'pA', []);
    expect(availability.status).toBe('disabled');
    expect(availability.reason).toMatch(/otro punto/i);
  });

  it('relationAvailability is ready when another point exists', () => {
    const model = modelWithPointsAndLine();
    expect(relationAvailability(model, 'distance', 'pA', []).status).toBe('ready');
  });

  it('relationAvailability disables conflicting kinds', () => {
    const model = modelWithPointsAndLine();
    const availability = relationAvailability(model, 'distance', 'pA', ['midpoint']);
    expect(availability.status).toBe('disabled');
    expect(availability.reason).toBeTruthy();
  });
});
