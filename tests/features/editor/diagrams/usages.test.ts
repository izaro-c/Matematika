import { renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { generateDiagramUsageIndex } from '../../../../scripts/editor/generate-diagram-usages';
import {
  GeneratedDiagramUsageRepository,
  getAllIndexedDiagrams,
  getDiagramUsages,
  type DiagramUsageRepository,
} from '../../../../src/features/editor/diagrams/references/usageIndex';
import { useDiagramUsages } from '../../../../src/features/editor/diagrams/hooks/useDiagramUsages';

describe('Diagram Usages Index', () => {
  it('should generate usage index entries from project mdx corpus', () => {
    const index = generateDiagramUsageIndex();
    expect(index.schemaVersion).toBe(1);
    expect(index.corpusHash).toMatch(/^[a-f0-9]{64}$/);
    expect(Object.keys(index.usages).length).toBeGreaterThan(0);

    const firstId = Object.keys(index.usages).sort()[0];
    expect(index.paths[firstId]).toBeDefined();
    expect(Array.isArray(index.usages[firstId])).toBe(true);
  });

  it('generates deterministically twice for the same corpus', () => {
    expect(generateDiagramUsageIndex()).toEqual(generateDiagramUsageIndex());
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

  it('uses a repository contract and returns deterministic usage order', () => {
    const repository = new GeneratedDiagramUsageRepository({
      schemaVersion: 1,
      generatedBy: 'test',
      corpusHash: 'a'.repeat(64),
      paths: { Demo: 'src/shared/diagrams/Demo.tsx' },
      usages: {
        Demo: [
          { contentId: 'b', contentPath: 'src/database/content/b.mdx', referenceKind: 'Diagram' },
          { contentId: 'a', contentPath: 'src/database/content/a.mdx', referenceKind: 'Simulation' },
        ],
      },
    });

    expect(repository.getUsages('src/shared/diagrams/Demo.tsx').map(usage => usage.contentId)).toEqual(['a', 'b']);
    expect(repository.getUsages('unknown-diagram')).toEqual([]);
  });

  it('reports an obsolete or absent index explicitly', () => {
    expect(() => new GeneratedDiagramUsageRepository([])).toThrow(/formato esperado|obsoleto/);
  });

  it('opens diagram usages through the repository without reading MDX content', () => {
    const repository: DiagramUsageRepository = {
      getUsages: vi.fn().mockReturnValue([
        { contentId: 'demo', contentPath: 'src/database/content/demo.mdx', referenceKind: 'Simulation' },
      ]),
    };
    const contentRepository = { read: vi.fn() };
    const { result } = renderHook(() => useDiagramUsages('Demo', [
      { name: 'demo.mdx', path: 'src/database/content/demo.mdx', type: 'file' },
    ], repository));

    expect(repository.getUsages).toHaveBeenCalledWith('Demo');
    expect(contentRepository.read).not.toHaveBeenCalled();
    expect(result.current.linkedPages).toHaveLength(1);
  });
});
