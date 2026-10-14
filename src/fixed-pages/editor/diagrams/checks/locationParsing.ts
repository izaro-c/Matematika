import type { DiagramDiagnosticCollection } from './types';

const MODEL_COLLECTIONS = new Set<DiagramDiagnosticCollection>([
  'objects', 'relations', 'steps', 'groups', 'layers',
]);

export function parsePathFromMessage(message: string): { path: (string | number)[]; rest: string } | null {
  const match = message.match(/^(objects|relations|steps|groups|layers)\.(\d+)\.([^:]+):\s*(.*)$/);
  if (!match) return null;
  return {
    path: [match[1], Number(match[2]), ...match[3].split('.')],
    rest: match[4],
  };
}

export function parseDiagnosticPath(path: readonly (string | number)[]): {
  collection?: DiagramDiagnosticCollection;
  index?: number;
  field?: string;
} {
  if (path.length === 0) return {};

  const [first, second, ...rest] = path;
  const collection = typeof first === 'string' && MODEL_COLLECTIONS.has(first as DiagramDiagnosticCollection)
    ? first as DiagramDiagnosticCollection
    : undefined;
  const index = typeof second === 'number' ? second : undefined;
  const fieldParts = (index !== undefined ? rest : path.slice(1)).map(part => String(part));
  const field = fieldParts.length > 0 ? fieldParts.join('.') : undefined;

  return { collection, index, field };
}

export function splitLegacyDiagnosticParts(message: string): string[] {
  return message.split(/(?=\b(?:objects|relations|steps|groups|layers)\.\d+)/g)
    .map(part => part.trim())
    .filter(Boolean);
}
