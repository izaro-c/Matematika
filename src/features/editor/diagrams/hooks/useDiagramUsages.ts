import { useMemo } from 'react';
import type { FileNode } from '../../lib/editorContracts';
import {
  GeneratedDiagramUsageRepository,
  type DiagramUsage,
  type DiagramUsageRepository,
} from '../references/usageIndex';

const defaultRepository = new GeneratedDiagramUsageRepository();

export interface DiagramUsageLookup {
  usages: DiagramUsage[];
  linkedPages: FileNode[];
  error: string | null;
}

export function useDiagramUsages(
  diagramId: string | null,
  files: FileNode[],
  repository: DiagramUsageRepository = defaultRepository,
): DiagramUsageLookup {
  const state = useMemo(() => {
    if (!diagramId) return { usages: [], error: null };
    try {
      return { usages: repository.getUsages(diagramId), error: null };
    } catch (error) {
      return {
        usages: [],
        error: error instanceof Error ? error.message : String(error),
      };
    }
  }, [diagramId, repository]);

  const linkedPages = useMemo(() => {
    const byPath = new Map(files.map(file => [file.path, file]));
    return state.usages
      .map(usage => byPath.get(usage.contentPath) ?? {
        name: usage.contentPath.split('/').pop() ?? usage.contentPath,
        path: usage.contentPath,
        type: 'file' as const,
      })
      .sort((a, b) => a.path.localeCompare(b.path));
  }, [files, state.usages]);

  return { usages: state.usages, linkedPages, error: state.error };
}
