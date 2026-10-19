import React from 'react';
import { useI18n } from '@/i18n';
import { renderRichText } from '@/fixed-pages/editor/diagrams/ui/primitives/richText';
import { Callout } from '@/fixed-pages/editor/ui/primitives';

export const PointLabelHelp: React.FC = () => {
  const { t } = useI18n();
  return (
  <Callout className="mt-2 text-[10px] space-y-1">
    <div className="flex items-center space-x-1">
      <span className="font-bold text-canela text-[11px]">{t('editor.diagramInspector.pointLabelFormat')}</span>
    </div>
    <ul className="list-disc pl-4 space-y-1 leading-tight text-carbon/75">
      <li><strong>{t('editor.diagramInspector.mathFormulasKatex')}</strong> {renderRichText(t('editor.diagramInspector.helpLabelFormula'), { code: c => <code>{c}</code> })}</li>
      <li><strong>{t('editor.diagramInspector.plainText')}</strong> {renderRichText(t('editor.diagramInspector.helpLabelPlain'), { code: c => <code>{c}</code> })}</li>
    </ul>
  </Callout>
);
};

export const TextContentHelp: React.FC = () => {
  const { t } = useI18n();
  return (
  <Callout className="mt-2 text-[10px] space-y-1.5">
    <div className="flex items-center space-x-1">
      <span className="font-bold text-canela text-[11px]">{t('editor.diagramInspector.textFormatGuide')}</span>
    </div>
    <ul className="list-disc pl-4 space-y-1 leading-tight text-carbon/75">
      <li><strong>{t('editor.diagramInspector.mathFormulasKatex')}</strong> {renderRichText(t('editor.diagramInspector.helpTextFormula'), { code: c => <code>{c}</code> })}</li>
      <li><strong>{t('editor.diagramInspector.liveReading')}</strong> {renderRichText(t('editor.diagramInspector.helpLiveReading'), { code: c => <code>{c}</code> })}</li>
      <li><strong>{t('editor.diagramInspector.measureInterpolation')}</strong> {renderRichText(t('editor.diagramInspector.helpMeasureInterpolation'), { code: c => <code>{c}</code> })}</li>
    </ul>
  </Callout>
);
};
