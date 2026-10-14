import { DiagramSpecLoadError, loadDiagramSpec } from '@/diagrams';
import type { VisualDiagramModel } from '../model/types';
import type { DiagramDiagnostic } from './generator';
import { generateDiagramSource, SPEC_END, SPEC_START } from './generator';
import { contentSecurityDiagnostics } from '@/fixed-pages/editor/security/contentGuard';

export type ParseDiagramSourceResult =
  | { status: 'visual-exact'; model: VisualDiagramModel; diagnostics: DiagramDiagnostic[] }
  | { status: 'code-preview'; previewModel?: VisualDiagramModel; diagnostics: DiagramDiagnostic[] }
  | { status: 'invalid'; diagnostics: DiagramDiagnostic[] };

function exportedComponentName(source: string): string | null {
  const names = [...source.matchAll(/export\s+(?:const|function)\s+([A-Z]\w*)\b/g)].map(match => match[1]);
  return names.find(name => !name.endsWith('Spec')) ?? null;
}

function extractSpecJson(source: string): string | null {
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

function loadDiagnostic(error: unknown): DiagramDiagnostic {
  return {
    code: error instanceof DiagramSpecLoadError ? error.code : 'invalid-embedded-spec',
    severity: 'error',
    message: error instanceof Error ? error.message : 'La especificación embebida no es válida.',
    source: 'model',
  };
}

export function parseDiagramSourceLocally(source?: string, _metadataType = ''): VisualDiagramModel | null {
  if (!source) return null;
  const json = extractSpecJson(source);
  if (!json) return null;
  try {
    return loadDiagramSpec(JSON.parse(json));
  } catch {
    return null;
  }
}

export function classifyEmbeddedDiagramSource(source: string, _metadataType = ''): ParseDiagramSourceResult | null {
  const security = contentSecurityDiagnostics('diagram', source);
  if (security.length > 0) {
    return { status: 'invalid', diagnostics: security };
  }
  const json = extractSpecJson(source);
  if (!json) return null;

  let editorModel: VisualDiagramModel;
  try {
    editorModel = loadDiagramSpec(JSON.parse(json));
  } catch (error) {
    return { status: 'invalid', diagnostics: [loadDiagnostic(error)] };
  }

  const componentName = exportedComponentName(source);
  if (!componentName) {
    return {
      status: 'code-preview',
      previewModel: editorModel,
      diagnostics: [{
        code: 'embedded-spec-without-export',
        severity: 'warning',
        message: 'La especificación no identifica un componente de diagrama exportado; la fuente conserva la autoridad.',
        source: 'source',
      }],
    };
  }

  const generated = generateDiagramSource(editorModel, componentName);
  const isLossless = generated.ok && generated.source === source;

  // Flexibilidad: si la envoltura TSX externa es canónica limpia y no contiene
  // código arbitrario ni extensiones no representadas fuera del bloque spec,
  // permitimos 'visual-exact' sin exigir igualdad cosmética byte a byte en el JSON interno.
  const hasCleanEnvelope = (() => {
    if (!generated.ok) return false;
    const startIdx = source.indexOf(SPEC_START);
    const endIdx = source.indexOf(SPEC_END);
    if (startIdx === -1 || endIdx === -1) return false;

    const prefix = source.slice(0, startIdx).trim();
    const suffix = source.slice(endIdx + SPEC_END.length).trim();
    const expectedPrefix = "import { createDiagramSpec, DiagramRenderer } from '@/diagrams/public';";
    const expectedSuffix = `export const ${componentName} = () => <DiagramRenderer spec={${componentName}Spec} />;`;

    return prefix === expectedPrefix && suffix === expectedSuffix;
  })();

  if (isLossless || hasCleanEnvelope) {
    return { status: 'visual-exact', model: editorModel, diagnostics: [] };
  }

  return {
    status: 'code-preview',
    previewModel: editorModel,
    diagnostics: [{
      code: 'embedded-spec-not-lossless',
      severity: 'warning',
      message: 'La especificación embebida no regenera el TSX byte por byte. El código manual conserva la autoridad.',
      source: 'synchronization',
    }],
  };
}

export async function parseDiagramSourceOnServer(source: string, signal?: AbortSignal): Promise<ParseDiagramSourceResult> {
  const embeddedClassification = classifyEmbeddedDiagramSource(source);
  if (embeddedClassification?.status === 'visual-exact') return embeddedClassification;

  try {
    const response = await fetch('/Matematika/api/content/parse-diagram', {
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
