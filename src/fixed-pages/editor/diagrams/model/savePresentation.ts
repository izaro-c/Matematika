import { enrichDiagramDiagnostics, summarizeDiagnostics } from '../diagnostics';
import type { DiagramState } from '../state/types';
import type { DiagramSaveBlockReason, DiagramSaveCapability } from './selectors';
import { getDiagramSaveCapability } from './selectors';

const BLOCK_SUMMARIES: Record<DiagramSaveBlockReason, (errorCount: number) => string> = {
  'invalid-source': () => 'TSX inválido',
  diverged: () => 'Modelo y código divergen',
  conflict: () => 'Conflicto de versión',
  'validation-error': count => count === 1 ? '1 error' : `${count} errores`,
  'stale-revision': () => 'Versión desactualizada',
  'missing-authority': () => 'Sin autoridad',
};

export function buildDiagramSaveCapability(state: DiagramState): DiagramSaveCapability {
  const base = getDiagramSaveCapability(state);
  if (base.allowed) return base;

  const enriched = enrichDiagramDiagnostics(state.diagnostics, state.currentModel);
  const summary = summarizeDiagnostics(enriched);
  const firstError = enriched.find(item => item.severity === 'error');
  const reason = base.reason;

  if (!reason) return base;

  return {
    ...base,
    summary: BLOCK_SUMMARIES[reason](summary.errorCount),
    primaryDiagnosticId: firstError?.id,
  };
}
