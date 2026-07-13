import type { VisualDiagramModel } from '../model/types';
import type { DiagramDiagnostic } from './generator';
import { normalizeVisualModel } from '../model/commands';
import { generateDiagramSource } from './generator';

export type ParseDiagramSourceResult =
  | {
      status: 'visual-exact';
      model: VisualDiagramModel;
      diagnostics: DiagramDiagnostic[];
    }
  | {
      status: 'code-preview';
      previewModel?: VisualDiagramModel;
      diagnostics: DiagramDiagnostic[];
    }
  | {
      status: 'invalid';
      diagnostics: DiagramDiagnostic[];
    };

const MODEL_START = '/* @matematika-diagram-model';
const MODEL_END = '*/';

function exportedComponentName(source: string): string | null {
  return source.match(/export\s+const\s+([A-Z]\w*)\b/)?.[1]
    ?? source.match(/export\s+function\s+([A-Z]\w*)\b/)?.[1]
    ?? null;
}

export function parseDiagramSourceLocally(source?: string, metadataType = ''): VisualDiagramModel | null {
  if (!source) return null;
  const start = source.indexOf(MODEL_START);
  if (start === -1) return null;
  const jsonStart = start + MODEL_START.length;
  const end = source.indexOf(MODEL_END, jsonStart);
  if (end === -1) return null;
  try {
    const raw = JSON.parse(source.slice(jsonStart, end).trim()) as Record<string, unknown>;
    const normalized = normalizeVisualModel(raw, metadataType);
    if (!normalized) return null;
    const hasCompleteEnvelope = typeof raw.title === 'string'
      && typeof raw.componentId === 'string'
      && typeof raw.category === 'string'
      && (raw.mode === 'simulation' || raw.mode === 'diagram' || raw.mode === 'inline')
      && typeof raw.axis === 'boolean'
      && typeof raw.grid === 'boolean'
      && Array.isArray(raw.boundingBox)
      && Array.isArray(raw.points)
      && Array.isArray(raw.elements)
      && Array.isArray(raw.sliders)
      && Array.isArray(raw.steps)
      && typeof raw.note === 'string';
    return hasCompleteEnvelope ? raw as unknown as VisualDiagramModel : normalized;
  } catch {
    return null;
  }
}

export function classifyEmbeddedDiagramSource(source: string, metadataType = ''): ParseDiagramSourceResult | null {
  const model = parseDiagramSourceLocally(source, metadataType);
  if (!model) return null;
  const componentName = exportedComponentName(source);
  if (!componentName) {
    return {
      status: 'code-preview',
      previewModel: model,
      diagnostics: [{
        code: 'embedded-model-without-export',
        severity: 'warning',
        message: 'El modelo embebido no identifica un componente exportado; la fuente conserva la autoridad.',
        source: 'source',
      }],
    };
  }
  const generated = generateDiagramSource(model, componentName);
  if (generated.ok && generated.source === source) {
    return { status: 'visual-exact', model, diagnostics: [] };
  }
  return {
    status: 'code-preview',
    previewModel: model,
    diagnostics: [{
      code: 'embedded-model-not-lossless',
      severity: 'warning',
      message: 'El modelo embebido no regenera todo el TSX de forma idéntica. La edición visual y la regeneración están bloqueadas.',
      source: 'synchronization',
    }],
  };
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
