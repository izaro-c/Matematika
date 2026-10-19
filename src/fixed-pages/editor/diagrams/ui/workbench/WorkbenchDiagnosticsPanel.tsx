import React from 'react';
import type { EnrichedDiagramDiagnostic } from '../../checks';
import type { VisualDiagramModel } from '../../model/types';
import { InspectorExpandableBlock } from '../inspector/InspectorExpandableBlock';
import { useI18n } from '@/i18n';
import { Button, Callout, Card } from '@/fixed-pages/editor/ui/primitives';

interface WorkbenchDiagnosticsPanelProps {
  model: VisualDiagramModel | null;
  diagnostics: readonly EnrichedDiagramDiagnostic[];
  onSelectDiagnostic: (diagnostic: EnrichedDiagramDiagnostic) => void;
  onAutoFixBrokenReferences?: () => void;
}

export const WorkbenchDiagnosticsPanel: React.FC<WorkbenchDiagnosticsPanelProps> = ({
  diagnostics,
  onSelectDiagnostic,
  onAutoFixBrokenReferences,
}) => {
  const { t } = useI18n();
  const errors = diagnostics.filter(d => d.severity === 'error');

  return (
    <div className="space-y-4 pt-1 text-xs font-serif text-carbon bg-lienzo">
      <Card className="space-y-2">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-serif text-sm font-bold text-carbon">{t('editor.diagramWorkbench.diagnosticsAndHealth')}</h3>
            <p className="text-[11px] text-carbon/60 italic">{t('editor.diagramWorkbench.diagnosticsSubtitle')}</p>
          </div>
          {errors.some(d => d.message.toLowerCase().includes('refer') || d.code?.includes('ref')) && onAutoFixBrokenReferences && (
            <Button size="sm" variant="danger" onClick={onAutoFixBrokenReferences}>
              {t('editor.diagramWorkbench.autoRepairReferences')}
            </Button>
          )}
        </div>
      </Card>

      <InspectorExpandableBlock title={t('editor.diagramWorkbench.analysisResults')} defaultOpen={true}>
        {diagnostics.length === 0 ? (
          <Callout className="text-center">
            <svg className="w-6 h-6 mx-auto mb-1.5 text-canela" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <p className="font-serif font-bold text-xs">{t('editor.diagramWorkbench.healthyTitle')}</p>
            <p className="text-[11px] text-carbon/65 mt-0.5">{t('editor.diagramWorkbench.healthyDetail')}</p>
          </Callout>
        ) : (
          <div className="space-y-2.5">
            {diagnostics.map((d, idx) => {
              const targetObjectId = d.location?.objectId;
              return (
                <div
                  key={d.id || `diag-${idx}`}
                  onClick={() => targetObjectId && onSelectDiagnostic(d)}
                  className={`p-3.5 rounded-2xl border transition-all shadow-2xs ${
                    d.severity === 'error'
                      ? 'border-granada/30 bg-granada/5 hover:border-granada/50 hover:bg-granada/10'
                      : 'border-ocre/30 bg-ocre/5 hover:border-ocre/50 hover:bg-ocre/10'
                  } ${targetObjectId ? 'cursor-pointer' : ''}`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span
                        className={`h-2.5 w-2.5 rounded-full shrink-0 ${
                          d.severity === 'error' ? 'bg-granada animate-pulse' : 'bg-ocre'
                        }`}
                      />
                      <span className="font-bold text-[11px] uppercase tracking-wider text-carbon">
                        {d.title || (d.severity === 'error' ? t('editor.diagramWorkbench.validationError') : t('editor.diagramWorkbench.consistencyWarning'))}
                      </span>
                    </div>
                    {targetObjectId && (
                      <Button size="sm" onClick={e => {
                          e.stopPropagation();
                          onSelectDiagnostic(d);
                        }}>
                        <span>{t('editor.diagramWorkbench.goToElement')}</span>
                        <svg className="w-3 h-3 text-carbon/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                      </Button>
                    )}
                  </div>
                  <p className="mt-2 font-sans text-xs text-carbon/90 leading-relaxed">{d.message}</p>
                  {d.hint && (
                    <p className="mt-1.5 text-[11px] text-carbon/75 italic bg-carbon/5 p-2 rounded-xl border border-carbon/10">
                      {d.hint}
                    </p>
                  )}
                  {targetObjectId && (
                    <span className="inline-block mt-2 font-mono text-[9px] text-carbon/70 bg-carbon/5 px-2 py-0.5 rounded-md border border-carbon/10">
                      {t('editor.diagramWorkbench.objectLabel', { id: targetObjectId })}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </InspectorExpandableBlock>
    </div>
  );
};

export default WorkbenchDiagnosticsPanel;
