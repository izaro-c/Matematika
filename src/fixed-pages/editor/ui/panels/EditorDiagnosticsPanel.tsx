import React from 'react';
import { useI18n } from '@/i18n';
import { translateEditorText, type EditorText } from '@/fixed-pages/editor/types/editorMessage';
import type { EditorValidationIssue, EditorValidationResult } from '@/fixed-pages/editor/session/editorTypes';
import type { FileNode } from '@/fixed-pages/editor/types/editorContracts';
import type { EditorPersistenceStatus } from '@/fixed-pages/editor/save/editorPersistenceState';
import type { EditorWorkspaceLevel } from '@/fixed-pages/editor/session/editorNavigationModel';
import { InspectorExpandableBlock } from '../../diagrams/ui/inspector/InspectorExpandableBlock';

interface EditorDiagnosticsPanelProps {
  currentFile: string | null;
  resource?: FileNode;
  validation: EditorValidationResult;
  persistenceStatus: EditorPersistenceStatus;
  persistenceLabel: EditorText;
  level: EditorWorkspaceLevel;
  onSelectIssue: (issue: EditorValidationIssue) => void;
  close: () => void;
  /** When true, omit the standalone header/close (`DiagnosticsDock` owns it). */
  embedded?: boolean;
}

function statusDescription(status: EditorPersistenceStatus, t: ReturnType<typeof useI18n>['t']): string {
  switch (status.kind) {
    case 'idle': return t('editor.diagnostics.idle');
    case 'loading': return t('editor.diagnostics.loading');
    case 'ready-clean': return t('editor.diagnostics.readyClean');
    case 'ready-dirty': return t('editor.diagnostics.readyDirty');
    case 'validating': return t('editor.diagnostics.validating');
    case 'blocked': return translateEditorText(t, status.reason);
    case 'saving-draft': return t('editor.diagnostics.savingDraft');
    case 'draft-saved': return t('editor.diagnostics.draftSaved');
    case 'saving-file': return t('editor.diagnostics.savingFile');
    case 'saved': return t('editor.diagnostics.saved');
    case 'save-error': return t('editor.diagnostics.saveError');
    case 'conflict': return t('editor.diagnostics.conflict');
    case 'cancelled': return t('editor.diagnostics.cancelled');
    case 'unsupported': return translateEditorText(t, status.reason);
  }
}

function validationPresentation(validation: EditorValidationResult, t: ReturnType<typeof useI18n>['t']): { className: string; label: string } {
  if (validation.errorCount > 0) return { className: 'bg-granada/10 text-granada', label: t('editor.diagnostics.errorsCount', { count: validation.errorCount }) };
  if (validation.warningCount > 0) return { className: 'bg-ocre/10 text-ocre', label: t('editor.diagnostics.warningsCount', { count: validation.warningCount }) };
  return { className: 'bg-canela/10 text-canela', label: t('editor.diagnostics.noErrors') };
}

function persistenceIndicator(status: EditorPersistenceStatus): string {
  if (status.kind === 'conflict' || status.kind === 'save-error' || status.kind === 'blocked') return 'bg-granada';
  if (status.kind === 'ready-dirty' || status.kind === 'saving-file' || status.kind === 'saving-draft') return 'bg-ocre';
  return 'bg-canela';
}

export const EditorDiagnosticsPanel: React.FC<EditorDiagnosticsPanelProps> = ({
  currentFile,
  resource,
  validation,
  persistenceStatus,
  persistenceLabel,
  level,
  onSelectIssue,
  close,
  embedded = false,
}) => {
  const { t } = useI18n();
  const validationStatus = validationPresentation(validation, t);
  const persistenceClass = persistenceIndicator(persistenceStatus);

  return (
    <section className="flex h-full flex-col bg-lienzo" aria-label={t('editor.diagnostics.sectionLabel')}>
      {!embedded && (
        <header className="flex items-center justify-between border-b border-carbon/15 bg-lienzo px-4 py-3 shadow-2xs">
          <div className="flex items-center gap-3">
            <h2 className="font-serif text-sm font-bold text-carbon">{t('editor.diagnostics.title')}</h2>
            <span className={`rounded-full border px-2.5 py-0.5 text-[10px] font-semibold tracking-wide ${validationStatus.className}`}>
              {validationStatus.label}
            </span>
          </div>
          <button
            type="button"
            onClick={close}
            className="rounded-xl border border-carbon/15 bg-carbon/5 px-3 py-1 text-xs font-medium text-carbon hover:bg-carbon/10 hover:border-carbon/30 transition-all cursor-pointer"
          >
            {t('editor.common.close')}
          </button>
        </header>
      )}

      <div className={`flex-1 space-y-4 ${embedded ? 'pt-1' : 'p-4'} overflow-y-auto`}>
        <InspectorExpandableBlock title={t('editor.diagnostics.documentWarnings')} defaultOpen={true}>
          {!currentFile && (
            <div className="rounded-xl border border-carbon/10 bg-lienzo/50 p-4 text-center text-xs italic text-carbon/50">
              {t('editor.diagnostics.noResource')}
            </div>
          )}

          {currentFile && validation.issues.length === 0 && (
            <div className="rounded-2xl border border-canela/30 bg-canela/5 p-4 text-center text-canela shadow-2xs">
              <svg className="w-6 h-6 mx-auto mb-1.5 text-canela" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <p className="font-serif text-xs font-bold">{t('editor.diagnostics.allGood')}</p>
              <p className="text-[11px] text-carbon/65 mt-0.5">{t('editor.diagnostics.allGoodBody')}</p>
            </div>
          )}

          <div className="space-y-2.5">
            {[...validation.issues]
              .sort((a, b) => {
                const priority = { error: 0, warning: 1, info: 2 };
                return (priority[a.severity] ?? 3) - (priority[b.severity] ?? 3);
              })
              .map(issue => {
                const isError = issue.severity === 'error';
                const isWarning = issue.severity === 'warning';
                return (
                  <div
                    key={issue.id}
                    onClick={() => onSelectIssue(issue)}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer shadow-2xs ${
                      isError
                        ? 'border-granada/30 bg-granada/5 hover:border-granada/50 hover:bg-granada/10'
                        : isWarning
                          ? 'border-ocre/30 bg-ocre/5 hover:border-ocre/50 hover:bg-ocre/10'
                          : 'border-canela/30 bg-canela/5 hover:border-canela/50 hover:bg-canela/10'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span
                          className={`h-2.5 w-2.5 rounded-full shrink-0 ${
                            isError ? 'bg-granada animate-pulse' : isWarning ? 'bg-ocre' : 'bg-canela'
                          }`}
                        />
                        <span className="font-bold text-[11px] uppercase tracking-wider text-carbon">
                          {({
                            metadata: t('editor.diagnostics.areaMetadata'),
                            body: t('editor.diagnostics.areaBody'),
                            block: t('editor.diagnostics.areaBlock'),
                            diagram: t('editor.diagnostics.areaDiagram'),
                            proof: t('editor.diagnostics.areaProof'),
                            source: t('editor.diagnostics.areaSource'),
                          } as Record<string, string>)[issue.area] ?? issue.area}
                          {' • '}
                          {isError ? t('editor.diagnostics.severityError') : isWarning ? t('editor.diagnostics.severityWarning') : t('editor.diagnostics.severityInfo')}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectIssue(issue);
                        }}
                        aria-label={issue.message}
                        className="rounded-lg border border-carbon/15 bg-lienzo px-2 py-0.5 text-[10px] font-semibold text-carbon hover:bg-carbon/5 transition-all cursor-pointer flex items-center space-x-1 shadow-2xs"
                      >
                        <span>{t('editor.diagnostics.goToElement')}</span>
                        <svg className="w-3 h-3 text-carbon/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                      </button>
                    </div>
                    <p className="mt-2 font-sans text-xs text-carbon/90 leading-relaxed">{issue.message}</p>
                    {(issue.blockId || issue.sourceRange) && (
                      <span className="inline-block mt-2 font-mono text-[9px] text-carbon/70 bg-carbon/5 px-2 py-0.5 rounded-md border border-carbon/10">
                        {issue.blockId ? t('editor.diagnostics.blockRef', { id: issue.blockId }) : t('editor.diagnostics.lineRef', { value: issue.sourceRange?.start ?? t('editor.diagnostics.sourceStart') })}
                      </span>
                    )}
                  </div>
                );
              })}
          </div>
        </InspectorExpandableBlock>

        <InspectorExpandableBlock title={t('editor.diagnostics.sessionState')} defaultOpen={true}>
          <div className="flex items-start gap-3 p-1">
            <span className={`mt-1 h-3 w-3 shrink-0 rounded-full border border-white shadow-2xs ${persistenceClass}`} />
            <div className="min-w-0 space-y-1">
              <p className="font-serif text-xs font-bold text-carbon">{translateEditorText(t, persistenceLabel)}</p>
              <p className="text-xs text-carbon/70 leading-snug">{statusDescription(persistenceStatus, t)}</p>
              {resource && (
                <p className="text-[11px] text-carbon/60 pt-1 border-t border-carbon/10 mt-2">
                  {t('editor.diagnostics.capabilityLine', { label: translateEditorText(t, resource.capabilityLabel), reason: translateEditorText(t, resource.reason) })}
                </p>
              )}
              {level === 'advanced' && currentFile && (
                <p className="truncate font-mono text-[9px] text-carbon/40 pt-1">{currentFile}</p>
              )}
            </div>
          </div>
        </InspectorExpandableBlock>
      </div>
    </section>
  );
};

export default EditorDiagnosticsPanel;
