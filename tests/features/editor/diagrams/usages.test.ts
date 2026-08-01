import { renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { generateDiagramUsageIndex } from '../../../../scripts/editor/generate-diagram-usages';
import {
  GeneratedDiagramUsageRepository,
  getAllIndexedDiagrams,
  getDiagramUsages,
  type DiagramUsageRepository,
} from '../../../../src/fixed-pages/editor/diagrams/references/usageIndex';
import { useDiagramUsages } from '../../../../src/fixed-pages/editor/diagrams/hooks/useDiagramUsages';

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
      paths: { Demo: 'src/diagrams/Demo.tsx' },
      usages: {
        Demo: [
          { contentId: 'b', contentPath: 'content/mdx/b.mdx', referenceKind: 'Diagram' },
          { contentId: 'a', contentPath: 'content/mdx/a.mdx', referenceKind: 'Simulation' },
        ],
      },
    });

    expect(repository.getUsages('src/diagrams/Demo.tsx').map(usage => usage.contentId)).toEqual(['a', 'b']);
    expect(repository.getUsages('unknown-diagram')).toEqual([]);
  });

  it('reports an obsolete or absent index explicitly', () => {
    expect(() => new GeneratedDiagramUsageRepository([])).toThrow(/formato esperado|obsoleto/);
  });

  it('opens diagram usages through the repository without reading MDX content', () => {
    const repository: DiagramUsageRepository = {
      getUsages: vi.fn().mockReturnValue([
        { contentId: 'demo', contentPath: 'content/mdx/demo.mdx', referenceKind: 'Simulation' },
      ]),
    };
    const contentRepository = { read: vi.fn() };
    const { result } = renderHook(() => useDiagramUsages('Demo', [
      {
        name: 'demo.mdx',
        path: 'content/mdx/demo.mdx',
        type: 'file',
        kind: 'mdx-document',
        capability: 'code-preview',
        capabilityLabel: 'Edición de código con vista previa',
        reason: 'fixture',
      },
    ], repository));

    expect(repository.getUsages).toHaveBeenCalledWith('Demo');
    expect(contentRepository.read).not.toHaveBeenCalled();
    expect(result.current.linkedPages).toHaveLength(1);
  });
});
