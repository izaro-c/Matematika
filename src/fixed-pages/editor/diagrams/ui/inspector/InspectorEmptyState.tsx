import React from 'react';
import { useI18n } from '@/i18n';
import { Card } from '@/fixed-pages/editor/ui/primitives';

export const InspectorEmptyState: React.FC = () => {
  const { t } = useI18n();
  return (
  <div className="p-4 bg-lienzo h-full flex items-center justify-center">
    <Card className="flex flex-col items-center justify-center text-center space-y-2 max-w-sm">
      <svg className="w-8 h-8 text-carbon/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5" />
      </svg>
      <p className="font-bold text-xs text-carbon">{t('editor.diagramInspector.noSelection')}</p>
      <p className="text-xs text-carbon/60 leading-relaxed italic">
        {t('editor.diagramInspector.noSelectionHint')}
      </p>
    </Card>
  </div>
);
};
