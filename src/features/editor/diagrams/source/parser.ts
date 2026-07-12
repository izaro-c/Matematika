import type { VisualDiagramModel } from '../model/types';
import type { DiagramDiagnostic } from './generator';
import { normalizeVisualModel } from '../model/commands';

export type ParseDiagramSourceResult =
  | {
      status: 'supported';
      model: VisualDiagramModel;
      diagnostics: DiagramDiagnostic[];
    }
  | {
      status: 'partially-supported';
      model?: VisualDiagramModel;
      diagnostics: DiagramDiagnostic[];
    }
  | {
      status: 'unsupported';
      diagnostics: DiagramDiagnostic[];
    }
  | {
      status: 'invalid';
      diagnostics: DiagramDiagnostic[];
    };

const MODEL_START = '/* @matematika-diagram-model';
const MODEL_END = '*/';

export function parseDiagramSourceLocally(source?: string, metadataType = ''): VisualDiagramModel | null {
  if (!source) return null;
  const start = source.indexOf(MODEL_START);
  if (start === -1) return null;
  const jsonStart = start + MODEL_START.length;
  const end = source.indexOf(MODEL_END, jsonStart);
  if (end === -1) return null;
  try {
    return normalizeVisualModel(JSON.parse(source.slice(jsonStart, end).trim()), metadataType);
  } catch {
    return null;
  }
}

export async function parseDiagramSourceOnServer(source: string, signal?: AbortSignal): Promise<ParseDiagramSourceResult> {
  try {
    const response = await fetch('/api/content/parse-diagram', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ source }),
      signal
    });
    if (!response.ok) {
      const errText = await response.text();
      return {
        status: 'invalid',
        diagnostics: [{
          code: 'server-error',
          severity: 'error',
          message: `Error del servidor al parsear diagrama: ${errText}`,
          source: 'source',
        }]
      };
    }
    const data = await response.json() as ParseDiagramSourceResult;
    return data;
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') {
      return {
        status: 'invalid',
        diagnostics: [{
          code: 'aborted',
          severity: 'info',
          message: 'Petición de parseo cancelada.',
          source: 'source'
        }]
      };
    }
    return {
      status: 'invalid',
      diagnostics: [{
        code: 'network-error',
        severity: 'error',
        message: error instanceof Error ? error.message : 'Error de conexión con el servidor de parseo.',
        source: 'source'
      }]
    };
  }
}
