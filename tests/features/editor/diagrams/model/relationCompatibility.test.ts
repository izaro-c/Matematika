import { describe, expect, it } from 'vitest';
import { getConstraintConflictReason } from '../../../../../src/features/editor/diagrams/model/relationCompatibility';

describe('relationCompatibility', () => {
  it('blocks midpoint together with distance', () => {
    expect(getConstraintConflictReason(['midpoint'], 'distance')).toMatch(/punto medio/i);
    expect(getConstraintConflictReason(['distance'], 'midpoint')).toMatch(/distancia fija/i);
  });

  it('blocks coincident together with distance or midpoint', () => {
    expect(getConstraintConflictReason(['coincident'], 'distance')).toBeTruthy();
    expect(getConstraintConflictReason(['midpoint'], 'coincident')).toBeTruthy();
  });

  it('allows horizontal with sameSide', () => {
    expect(getConstraintConflictReason(['horizontal'], 'sameSide')).toBeUndefined();
  });

  it('blocks duplicate singleton relations', () => {
    expect(getConstraintConflictReason(['midpoint'], 'midpoint')).toMatch(/Ya hay una relación/);
  });
});
