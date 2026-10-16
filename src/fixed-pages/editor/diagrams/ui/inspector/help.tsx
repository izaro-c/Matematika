import React from 'react';
import { useI18n } from '@/i18n';
import { renderRichText } from '@/fixed-pages/editor/diagrams/ui/primitives/richText';

export const PointLabelHelp: React.FC = () => {
  const { t } = useI18n();
  return (
  <div className="mt-2 p-2.5 bg-canela/5 rounded-xl border border-canela/20 text-[10px] text-carbon/80 space-y-1 font-serif">
    <div className="flex items-center space-x-1">
      <span className="font-bold text-canela text-[11px]">{t('editor.diagramInspector.pointLabelFormat')}</span>
    </div>
    <ul className="list-disc pl-4 space-y-1 leading-tight text-carbon/75">
      <li><strong>{t('editor.diagramInspector.mathFormulasKatex')}</strong> {renderRichText(t('editor.diagramInspector.helpLabelFormula'), { code: c => <code>{c}</code> })}</li>
      <li><strong>{t('editor.diagramInspector.plainText')}</strong> {renderRichText(t('editor.diagramInspector.helpLabelPlain'), { code: c => <code>{c}</code> })}</li>
    </ul>
  </div>
);
};

export const TextContentHelp: React.FC = () => {
  const { t } = useI18n();
  return (
  <div className="mt-2 p-2.5 bg-canela/5 rounded-xl border border-canela/20 text-[10px] text-carbon/80 space-y-1.5 font-serif">
    <div className="flex items-center space-x-1">
      <span className="font-bold text-canela text-[11px]">{t('editor.diagramInspector.textFormatGuide')}</span>
    </div>
    <ul className="list-disc pl-4 space-y-1 leading-tight text-carbon/75">
      <li><strong>{t('editor.diagramInspector.mathFormulasKatex')}</strong> {renderRichText(t('editor.diagramInspector.helpTextFormula'), { code: c => <code>{c}</code> })}</li>
      <li><strong>{t('editor.diagramInspector.liveReading')}</strong> {renderRichText(t('editor.diagramInspector.helpLiveReading'), { code: c => <code>{c}</code> })}</li>
      <li><strong>{t('editor.diagramInspector.measureInterpolation')}</strong> {renderRichText(t('editor.diagramInspector.helpMeasureInterpolation'), { code: c => <code>{c}</code> })}</li>
    </ul>
  </div>
);
};
