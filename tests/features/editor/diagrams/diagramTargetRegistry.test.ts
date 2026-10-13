import { describe, expect, it } from 'vitest';
import {
  matchesScopedDiagramTarget,
  qualifiedDiagramTarget,
} from '../../../../src/lib/page-context/DiagramTargetRegistryContext';

describe('Multi-diagram target registry', () => {
  it('qualifies equal local targets without cross-highlighting other scopes', () => {
    expect(qualifiedDiagramTarget('diagrama-a', 'segAB')).toBe('diagrama-a:segAB');
    expect(matchesScopedDiagramTarget('diagrama-a:segAB', 'segAB', 'diagrama-a')).toBe(true);
    expect(matchesScopedDiagramTarget('diagrama-a:segAB', 'segAB', 'diagrama-b')).toBe(false);
    expect(matchesScopedDiagramTarget('segAB', 'segAB', 'diagrama-a')).toBe(true);
  });
});
