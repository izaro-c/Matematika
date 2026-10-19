import React from 'react';
import { IconButton, PanelHeader } from '../primitives';
import { IconClose } from '@/fixed-pages/editor/diagrams/ui/toolbar/WorkbenchIcons';
import { useI18n } from '@/i18n';

interface DiagnosticsDockProps {
  errorCount: number;
  warningCount: number;
  onClose: () => void;
  children: React.ReactNode;
}

/** Panel inferior de avisos del esquema del editor, común a MDX y diagramas. */
export const DiagnosticsDock: React.FC<DiagnosticsDockProps> = ({ errorCount, warningCount, onClose, children }) => {
  const { t } = useI18n();
  const meta = errorCount > 0 || warningCount > 0
    ? t('editor.common.errorsAndWarnings', { errors: errorCount, warnings: warningCount })
    : undefined;
  return (
    <div className="flex h-full flex-col bg-lienzo">
      <PanelHeader
        level={2}
        className="shrink-0 px-4"
        title={t('editor.nav.warnings')}
        meta={meta}
        actions={(
          <IconButton size="sm" label={t('editor.nav.hideWarnings')} onClick={onClose}>
            <IconClose className="h-3.5 w-3.5" />
          </IconButton>
        )}
      />
      <div className="min-h-0 flex-1 overflow-y-auto px-4 pb-4">{children}</div>
    </div>
  );
};

export default DiagnosticsDock;
