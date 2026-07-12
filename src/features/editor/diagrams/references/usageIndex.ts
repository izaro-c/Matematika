import indexData from '@/entities/content/diagramUsageIndex.json';

export interface DiagramUsage {
  contentId: string;
  contentPath: string;
  referenceKind: 'Simulation' | 'Diagram' | 'Component' | string;
}

export interface DiagramUsageEntry {
  diagramId: string;
  diagramPath: string;
  usages: DiagramUsage[];
}

export function getDiagramUsages(diagramPath: string): DiagramUsage[] {
  const normalizedPath = diagramPath.replace(/\\/g, '/');
  const match = (indexData as DiagramUsageEntry[]).find(item => {
    return item.diagramPath === normalizedPath ||
           item.diagramPath.endsWith(normalizedPath) ||
           normalizedPath.endsWith(item.diagramPath);
  });
  return match ? match.usages : [];
}

export function getAllIndexedDiagrams(): { diagramId: string; diagramPath: string; usageCount: number }[] {
  return (indexData as DiagramUsageEntry[]).map(item => ({
    diagramId: item.diagramId,
    diagramPath: item.diagramPath,
    usageCount: item.usages.length
  }));
}
