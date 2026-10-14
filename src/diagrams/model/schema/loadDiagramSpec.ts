import { parseDiagramSpecV3 } from '@/diagrams/model/schema/schemaV3';
import { DIAGRAM_SPEC_VERSION } from '@/diagrams/model/schema/types';
import type { DiagramSpec } from '@/diagrams/model/schema/v3';

export type DiagramSpecLoadErrorCode =
  | 'invalid-root'
  | 'unsupported-version'
  | 'future-version'
  | 'invalid-v3';

/** Error de carga de una especificación: raíz no válida, versión no soportada o esquema V3 incumplido. */
export class DiagramSpecLoadError extends Error {
  readonly code: DiagramSpecLoadErrorCode;
  readonly details: string[];

  constructor(code: DiagramSpecLoadErrorCode, message: string, details: string[] = []) {
    super([message, ...details].join('\n'));
    this.name = 'DiagramSpecLoadError';
    this.code = code;
    this.details = details;
  }
}

function recordOf(value: unknown): Record<string, unknown> | null {
  return value && typeof value === 'object' && !Array.isArray(value) ? value as Record<string, unknown> : null;
}

/** Valida una especificación DiagramSpec v3; cualquier otra versión se rechaza con un diagnóstico explícito. */
export function loadDiagramSpec(value: unknown): DiagramSpec {
  const record = recordOf(value);
  if (!record) throw new DiagramSpecLoadError('invalid-root', 'La especificación debe ser un objeto JSON.');
  const version = record.version;
  if (version === DIAGRAM_SPEC_VERSION) {
    const parsed = parseDiagramSpecV3(record);
    if (!parsed.success) throw new DiagramSpecLoadError('invalid-v3', 'DiagramSpec v3 no es válido.', parsed.error.message.split('\n'));
    return parsed.data;
  }
  if (typeof version === 'number' && version > DIAGRAM_SPEC_VERSION) {
    throw new DiagramSpecLoadError('future-version', `DiagramSpec v${version} es más reciente que la versión soportada (v${DIAGRAM_SPEC_VERSION}). Actualice Matematika antes de editarlo.`);
  }
  throw new DiagramSpecLoadError('unsupported-version', `DiagramSpec v${String(version ?? 1)} ya no está soportado: solo se admite DiagramSpec v${DIAGRAM_SPEC_VERSION}.`);
}

export function createDiagramSpec(value: unknown): DiagramSpec {
  return loadDiagramSpec(value);
}
