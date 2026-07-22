import { DiagramSpecMigrationError, migrateDiagramSpec, projectDiagramSpecV3ToV2 } from '../../../../shared/diagrams/spec';
import type { VisualDiagramModel } from '../model/types';
import type { DiagramDiagnostic } from './generator';
import { generateDiagramSource, SPEC_END, SPEC_START } from './generator';

export type ParseDiagramSourceResult =
  | { status: 'visual-exact'; model: VisualDiagramModel; diagnostics: DiagramDiagnostic[] }
  | { status: 'code-preview'; previewModel?: VisualDiagramModel; diagnostics: DiagramDiagnostic[] }
  | { status: 'invalid'; diagnostics: DiagramDiagnostic[] };

const LEGACY_MODEL_START = '/* @matematika-diagram-model';
const LEGACY_MODEL_END = '*/';

function exportedComponentName(source: string): string | null {
  const names = [...source.matchAll(/export\s+(?:const|function)\s+([A-Z]\w*)\b/g)].map(match => match[1]);
  return names.find(name => !name.endsWith('Spec')) ?? null;
}

function extractV2Json(source: string): string | null {
  const start = source.indexOf(SPEC_START);
  const end = source.indexOf(SPEC_END, start + SPEC_START.length);
  if (start === -1 || end === -1) return null;
  const envelope = source.slice(start + SPEC_START.length, end);
  const callStart = envelope.indexOf('createDiagramSpec(');
  if (callStart === -1) return null;
  const jsonStart = callStart + 'createDiagramSpec('.length;
  const callEnd = envelope.lastIndexOf(');');
  return callEnd > jsonStart ? envelope.slice(jsonStart, callEnd).trim() : null;
}

function extractLegacyJson(source: string): string | null {
  const start = source.indexOf(LEGACY_MODEL_START);
  if (start === -1) return null;
  const jsonStart = start + LEGACY_MODEL_START.length;
  const end = source.indexOf(LEGACY_MODEL_END, jsonStart);
  return end === -1 ? null : source.slice(jsonStart, end).trim();
}

function migrationDiagnostic(error: unknown): DiagramDiagnostic {
  return {
    code: error instanceof DiagramSpecMigrationError ? error.code : 'invalid-embedded-spec',
    severity: 'error',
    message: error instanceof Error ? error.message : 'La especificación embebida no es válida.',
    source: 'model',
  };
}

export function parseDiagramSourceLocally(source?: string, _metadataType = ''): VisualDiagramModel | null {
  if (!source) return null;
  const json = extractV2Json(source) ?? extractLegacyJson(source);
  if (!json) return null;
  try {
    return projectDiagramSpecV3ToV2(migrateDiagramSpec(JSON.parse(json)).spec);
  } catch {
    return null;
  }
}

export function classifyEmbeddedDiagramSource(source: string, _metadataType = ''): ParseDiagramSourceResult | null {
  const json = extractV2Json(source) ?? extractLegacyJson(source);
  if (!json) return null;

  let migrated;
  try {
    migrated = migrateDiagramSpec(JSON.parse(json));
  } catch (error) {
    return { status: 'invalid', diagnostics: [migrationDiagnostic(error)] };
  }

  const componentName = exportedComponentName(source);
  if (!componentName) {
    return {
      status: 'code-preview',
      previewModel: projectDiagramSpecV3ToV2(migrated.spec),
      diagnostics: [{
        code: 'embedded-spec-without-export',
        severity: 'warning',
        message: 'La especificación no identifica un componente de diagrama exportado; la fuente conserva la autoridad.',
        source: 'source',
      }],
    };
  }

  const editorModel = projectDiagramSpecV3ToV2(migrated.spec);
  const generated = generateDiagramSource(editorModel, componentName);
  if (generated.ok && generated.source === source && migrated.migratedFrom === null) {
    return { status: 'visual-exact', model: editorModel, diagnostics: [] };
  }

  return {
    status: 'code-preview',
    previewModel: editorModel,
    diagnostics: [{
      code: migrated.migratedFrom === null ? 'embedded-spec-not-lossless' : 'embedded-spec-migrated',
      severity: 'warning',
      message: migrated.migratedFrom === null
        ? 'La especificación embebida no regenera el TSX byte por byte. El código manual conserva la autoridad.'
        : migrated.warnings.join(' '),
      source: 'synchronization',
    }],
  };
}

export async function parseDiagramSourceOnServer(source: string, signal?: AbortSignal): Promise<ParseDiagramSourceResult> {
  const embeddedClassification = classifyEmbeddedDiagramSource(source);
  if (embeddedClassification?.status === 'visual-exact') return embeddedClassification;

  try {
    const response = await fetch('/api/content/parse-diagram', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ source }),
      signal,
    });
    if (!response.ok) {
      if (embeddedClassification) return embeddedClassification;
      return {
        status: 'invalid',
        diagnostics: [{
          code: 'server-error', severity: 'error',
          message: `Error del servidor al parsear diagrama: ${await response.text()}`,
          source: 'source',
        }],
      };
    }
    return await response.json() as ParseDiagramSourceResult;
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') {
      return { status: 'invalid', diagnostics: [{ code: 'aborted', severity: 'info', message: 'Petición de parseo cancelada.', source: 'source' }] };
    }
    if (embeddedClassification) return embeddedClassification;
    return {
      status: 'invalid',
      diagnostics: [{
        code: 'network-error', severity: 'error',
        message: error instanceof Error ? error.message : 'Error de conexión con el servidor de parseo.',
        source: 'source',
      }],
    };
  }
}
