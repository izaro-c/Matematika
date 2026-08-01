import { migrateDiagramSpecV2ToV3, parseDiagramSpecV3 } from '../../../../shared/diagrams/spec';
import { z } from 'zod';
import { workingScene } from '../model/editorModel';
import type { VisualDiagramModel } from '../model/types';

export interface DiagramDiagnostic {
  code: string;
  severity: 'error' | 'warning' | 'info';
  message: string;
  source?: 'model' | 'source' | 'synchronization' | 'reference';
  elementId?: string;
  path?: readonly (string | number)[];
}

function diagnosticsFromZodIssues(
  issues: readonly z.core.$ZodIssue[],
  code: string,
): DiagramDiagnostic[] {
  return issues.map((issue, index) => ({
    code: issues.length === 1 ? code : `${code}-${index}`,
    severity: 'error' as const,
    message: issue.message,
    source: 'model' as const,
    path: issue.path.map(part => typeof part === 'symbol' ? String(part) : part),
  }));
}

export type GenerateDiagramSourceResult =
  | { ok: true; source: string; diagnostics: DiagramDiagnostic[] }
  | { ok: false; diagnostics: DiagramDiagnostic[] };

export const SPEC_START = '/* @matematika-diagram-spec:start */';
export const SPEC_END = '/* @matematika-diagram-spec:end */';

function validComponentName(componentName: string): boolean {
  return /^[A-Z][A-Za-z0-9]*$/.test(componentName);
}

export function serializeDiagramSpec(model: unknown): string {
  return JSON.stringify(model, null, 2);
}

export function generateDiagramSource(model: VisualDiagramModel, componentName: string): GenerateDiagramSourceResult {
  const diagnostics: DiagramDiagnostic[] = [];
  if (!validComponentName(componentName)) {
    diagnostics.push({
      code: 'invalid-component-name',
      severity: 'error',
      message: 'El componente debe usar PascalCase y contener solo letras o números.',
      source: 'model',
    });
  }
  if (diagnostics.some(diagnostic => diagnostic.severity === 'error')) return { ok: false, diagnostics };

  // Preferir objetos V3 del modelo cuando ya están canónicos; reify desde escena
  // solo aporta el contrato validable sin pasar por resolve de runtime.
  const currentSpec = migrateDiagramSpecV2ToV3(workingScene(model));
  const currentParsed = parseDiagramSpecV3(currentSpec);
  if (!currentParsed.success) {
    return {
      ok: false,
      diagnostics: diagnosticsFromZodIssues(currentParsed.error.issues, 'invalid-diagram-spec-v3'),
    };
  }
  const specName = `${componentName}Spec`;
  const source = `import { createDiagramSpec, DiagramRenderer } from '@/shared/diagrams/public';

${SPEC_START}
export const ${specName} = createDiagramSpec(
${serializeDiagramSpec(currentParsed.data)}
);
${SPEC_END}

export const ${componentName} = () => <DiagramRenderer spec={${specName}} />;
`;

  return { ok: true, source, diagnostics };
}
