import { describe, it, expect } from 'vitest';
import { generateDiagramUsageIndex } from '../../../../scripts/editor/generate-diagram-usages';
import { getDiagramUsages, getAllIndexedDiagrams } from '../../../../src/features/editor/diagrams/references/usageIndex';

describe('Diagram Usages Index', () => {
  it('should generate usage index entries from project mdx corpus', () => {
    const entries = generateDiagramUsageIndex();
    expect(Array.isArray(entries)).toBe(true);
    expect(entries.length).toBeGreaterThan(0);
    
    // Check structure of first entry
    const entry = entries[0];
    expect(entry.diagramId).toBeDefined();
    expect(entry.diagramPath).toBeDefined();
    expect(Array.isArray(entry.usages)).toBe(true);
  });

  it('should query usages index stably for a given file path', () => {
    const all = getAllIndexedDiagrams();
    if (all.length > 0) {
      const target = all[0];
      const usages = getDiagramUsages(target.diagramPath);
      expect(Array.isArray(usages)).toBe(true);
      expect(usages).toHaveLength(target.usageCount);
    }
  });
});
