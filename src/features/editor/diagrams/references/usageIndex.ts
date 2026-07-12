import indexData from '@/entities/content/diagramUsageIndex.json';

export interface DiagramUsage {
  contentId: string;
  contentPath: string;
  referenceKind: 'Simulation' | 'Diagram' | 'Component' | string;
  sourceRange?: { start: number; end: number };
  blockId?: string;
}

export interface DiagramUsageIndex {
  schemaVersion: number;
  corpusHash: string;
  generatedBy: string;
  usages: Record<string, DiagramUsage[]>;
  paths: Record<string, string>;
}

export interface DiagramUsageRepository {
  getUsages(diagramId: string): DiagramUsage[];
}

export class GeneratedDiagramUsageRepository implements DiagramUsageRepository {
  private readonly index: DiagramUsageIndex;

  constructor(index: unknown = indexData) {
    this.index = parseDiagramUsageIndex(index);
  }

  getUsages(diagramId: string): DiagramUsage[] {
    const key = resolveDiagramKey(diagramId, this.index);
    if (!key) return [];
    return [...this.index.usages[key]].sort(compareUsages);
  }

  getAllIndexedDiagrams(): { diagramId: string; diagramPath: string; usageCount: number }[] {
    return Object.keys(this.index.usages)
      .sort((a, b) => this.index.paths[a].localeCompare(this.index.paths[b]))
      .map(diagramId => ({
        diagramId,
        diagramPath: this.index.paths[diagramId],
        usageCount: this.index.usages[diagramId].length,
      }));
  }
}

export class DiagramUsageIndexError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'DiagramUsageIndexError';
  }
}

function parseDiagramUsageIndex(value: unknown): DiagramUsageIndex {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    throw new DiagramUsageIndexError('El índice generado de usos de diagramas no tiene el formato esperado.');
  }
  const candidate = value as Partial<DiagramUsageIndex>;
  if (candidate.schemaVersion !== 1 || typeof candidate.corpusHash !== 'string'
    || typeof candidate.generatedBy !== 'string' || !candidate.usages || !candidate.paths) {
    throw new DiagramUsageIndexError('El índice generado de usos de diagramas está ausente u obsoleto.');
  }
  return candidate as DiagramUsageIndex;
}

function normalizeDiagramId(value: string): string {
  const normalized = value.replace(/\\/g, '/').replace(/\.tsx$/, '');
  return normalized.split('/').pop() ?? normalized;
}

function resolveDiagramKey(diagramId: string, index: DiagramUsageIndex): string | null {
  const normalized = diagramId.replace(/\\/g, '/');
  if (index.usages[normalized]) return normalized;
  const bare = normalizeDiagramId(normalized);
  if (index.usages[bare]) return bare;
  return Object.keys(index.paths).find(key => (
    index.paths[key] === normalized ||
    index.paths[key].endsWith(normalized) ||
    normalized.endsWith(index.paths[key]) ||
    normalizeDiagramId(index.paths[key]) === bare
  )) ?? null;
}

function compareUsages(a: DiagramUsage, b: DiagramUsage): number {
  return a.contentPath.localeCompare(b.contentPath)
    || a.referenceKind.localeCompare(b.referenceKind)
    || a.contentId.localeCompare(b.contentId);
}

const defaultRepository = new GeneratedDiagramUsageRepository();

export function getDiagramUsages(diagramId: string): DiagramUsage[] {
  return defaultRepository.getUsages(diagramId);
}

export function getAllIndexedDiagrams(): { diagramId: string; diagramPath: string; usageCount: number }[] {
  return defaultRepository.getAllIndexedDiagrams();
}
