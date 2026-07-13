import { describe, expect, it } from 'vitest';
import {
  matchesScopedDiagramTarget,
  qualifiedDiagramTarget,
  validateDiagramTargetRegistrations,
  type RegisteredDiagramTarget,
} from '../../../../src/shared/lib/DiagramTargetRegistryContext';

const targets: RegisteredDiagramTarget[] = [
  { scopeId: 'diagrama-a', targetId: 'segAB', objectId: 'line1', label: 'AB', kind: 'object' },
  { scopeId: 'diagrama-b', targetId: 'segAB', objectId: 'line2', label: 'AB', kind: 'object' },
  { scopeId: 'diagrama-b', targetId: 'pC', objectId: 'point1', label: 'C', kind: 'object' },
];

describe('Phase 4 multi-diagram target registry', () => {
  it('qualifies equal local targets without cross-highlighting other scopes', () => {
    expect(qualifiedDiagramTarget('diagrama-a', 'segAB')).toBe('diagrama-a:segAB');
    expect(matchesScopedDiagramTarget('diagrama-a:segAB', 'segAB', 'diagrama-a')).toBe(true);
    expect(matchesScopedDiagramTarget('diagrama-a:segAB', 'segAB', 'diagrama-b')).toBe(false);
    expect(matchesScopedDiagramTarget('segAB', 'segAB', 'diagrama-a')).toBe(true);
  });

  it('reports ambiguous unscoped targets but permits unique scoped registrations', () => {
    const diagnostics = validateDiagramTargetRegistrations(targets);
    expect(diagnostics).toContainEqual(expect.objectContaining({ code: 'ambiguous-unscoped-target', targetId: 'segAB', severity: 'warning' }));
    expect(diagnostics.some(item => item.code === 'duplicate-scoped-target')).toBe(false);
  });

  it('rejects a duplicate inside one diagram scope', () => {
    const diagnostics = validateDiagramTargetRegistrations([...targets, { ...targets[0], objectId: 'line3' }]);
    expect(diagnostics).toContainEqual(expect.objectContaining({ code: 'duplicate-scoped-target', targetId: 'diagrama-a:segAB', severity: 'error' }));
  });
});
