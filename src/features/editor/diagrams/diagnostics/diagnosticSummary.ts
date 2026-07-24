import type { EnrichedDiagramDiagnostic, DiagnosticSummary } from './types';

function diagnosticTargetId(diagnostic: EnrichedDiagramDiagnostic): string | undefined {
  return diagnostic.location.navigationObjectId ?? diagnostic.location.objectId;
}

export function summarizeDiagnostics(diagnostics: readonly EnrichedDiagramDiagnostic[]): DiagnosticSummary {
  const objectIdsWithErrors = new Set<string>();
  const objectIdsWithWarnings = new Set<string>();

  let errorCount = 0;
  let warningCount = 0;
  let infoCount = 0;

  diagnostics.forEach(diagnostic => {
    const targetId = diagnosticTargetId(diagnostic);
    if (diagnostic.severity === 'error') {
      errorCount += 1;
      if (targetId) objectIdsWithErrors.add(targetId);
    } else if (diagnostic.severity === 'warning') {
      warningCount += 1;
      if (targetId) objectIdsWithWarnings.add(targetId);
    } else {
      infoCount += 1;
    }
  });

  return {
    errorCount,
    warningCount,
    infoCount,
    objectIdsWithErrors: [...objectIdsWithErrors],
    objectIdsWithWarnings: [...objectIdsWithWarnings],
  };
}

export function formatDiagnosticTabDetail(summary: DiagnosticSummary): string {
  if (summary.errorCount > 0) return `${summary.errorCount} error${summary.errorCount === 1 ? '' : 'es'}`;
  if (summary.warningCount > 0) return `${summary.warningCount} aviso${summary.warningCount === 1 ? '' : 's'}`;
  return 'Sin problemas';
}

export function fieldErrorsForObject(
  diagnostics: readonly EnrichedDiagramDiagnostic[],
  objectId: string,
): Map<string, string> {
  const errors = new Map<string, string>();
  diagnostics.forEach(diagnostic => {
    if (diagnosticTargetId(diagnostic) !== objectId) return;
    const key = diagnostic.location.fieldKey ?? diagnostic.location.field ?? 'general';
    errors.set(key, diagnostic.message);
  });
  return errors;
}
