import { formatDiagramSpecIssues, migrateDiagramSpecV2ToV3, parseDiagramSpecV2, parseDiagramSpecV3 } from '../../../../shared/diagrams/spec';
import type { VisualDiagramModel } from '../model/types';

export interface DiagramDiagnostic {
  code: string;
  severity: 'error' | 'warning' | 'info';
  message: string;
  source?: 'model' | 'source' | 'synchronization' | 'reference';
  elementId?: string;
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

  const parsed = parseDiagramSpecV2(model);
  if (!parsed.success) {
    diagnostics.push({
      code: 'invalid-diagram-spec-v2',
      severity: 'error',
      message: formatDiagramSpecIssues(parsed.error.issues),
      source: 'model',
    });
  }
  if (diagnostics.some(diagnostic => diagnostic.severity === 'error')) return { ok: false, diagnostics };

  const specName = `${componentName}Spec`;
  const currentSpec = migrateDiagramSpecV2ToV3(parsed.success ? parsed.data : model as VisualDiagramModel);
  const currentParsed = parseDiagramSpecV3(currentSpec);
  if (!currentParsed.success) return {
    ok: false,
    diagnostics: [{ code: 'invalid-diagram-spec-v3', severity: 'error', message: formatDiagramSpecIssues(currentParsed.error.issues), source: 'model' }],
  };
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
