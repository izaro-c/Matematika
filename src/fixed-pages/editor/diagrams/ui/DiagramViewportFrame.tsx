import React, { useState } from 'react';
import {
  PUBLISHED_LAYOUT_LABELS,
  SCREEN_PRESETS,
  publishedDiagramArea,
  publishedLayoutForPageType,
  type PublishedDiagramLayout,
  type ScreenPreset,
} from '../model/scene/publishedDiagramLayout';
import { useI18n } from '@/i18n';
import { layoutLabel } from '@/fixed-pages/editor/diagrams/ui/diagramLabels';
import { Button, controlClassName } from '@/fixed-pages/editor/ui/primitives';

interface DiagramViewportFrameProps {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  pageType?: string;
  testId?: string;
  editing?: boolean;
}

function boundedDimension(value: number, minimum: number, maximum: number): number {
  return Math.min(maximum, Math.max(minimum, Math.round(value)));
}

export const DiagramViewportFrame: React.FC<DiagramViewportFrameProps> = ({ title, subtitle, children, pageType, testId, editing = false }) => {
  const { t } = useI18n();
  const [preset, setPreset] = useState<ScreenPreset>('desktop');
  const [screenSize, setScreenSize] = useState({ width: SCREEN_PRESETS.desktop.width, height: SCREEN_PRESETS.desktop.height });
  const [layout, setLayout] = useState<PublishedDiagramLayout>(() => publishedLayoutForPageType(pageType));
  const area = publishedDiagramArea(screenSize, layout);

  const choosePreset = (nextPreset: Exclude<ScreenPreset, 'custom'>) => {
    setPreset(nextPreset);
    setScreenSize({ width: SCREEN_PRESETS[nextPreset].width, height: SCREEN_PRESETS[nextPreset].height });
  };

  const updateScreenSize = (dimension: 'width' | 'height', value: number) => {
    setPreset('custom');
    setScreenSize(current => ({
      ...current,
      [dimension]: boundedDimension(value, dimension === 'width' ? 320 : 480, dimension === 'width' ? 2560 : 1600),
    }));
  };

  return (
    <section className="min-w-0 rounded border border-carbon/15 bg-carbon/[0.02]" aria-label={title} data-testid={testId}>
      <div className="flex flex-wrap items-center gap-2 border-b border-carbon/10 bg-lienzo px-3 py-2">
        <div className="mr-auto">
          <h3 className="ac-label ac-label--sm">{title}</h3>
          <p className="text-[9px] text-carbon/45">{subtitle}</p>
        </div>
        {!editing && <><label className="text-xs font-bold text-carbon/55">
          {t('editor.diagramEditors.context')}
          <select aria-label={t('editor.diagramEditors.publicationContext')} className={`${controlClassName} ml-1`} value={layout} onChange={event => setLayout(event.target.value as PublishedDiagramLayout)}>
            {(Object.keys(PUBLISHED_LAYOUT_LABELS) as PublishedDiagramLayout[]).map(key => <option key={key} value={key}>{layoutLabel(t, key)}</option>)}
          </select>
        </label>
        <div className="flex rounded border border-carbon/10 bg-carbon/[0.02] p-0.5" role="group" aria-label={t('editor.diagramEditors.screenSize')}>
          {(Object.keys(SCREEN_PRESETS) as Array<Exclude<ScreenPreset, 'custom'>>).map(key => {
            const definition = SCREEN_PRESETS[key];
            const presetArea = publishedDiagramArea(definition, layout);
            return <Button size="sm" variant="quiet" key={key} title={t('editor.diagramEditors.viewportPresetTitle', { screenWidth: definition.width, screenHeight: definition.height, areaWidth: presetArea.width, areaHeight: presetArea.height })} aria-pressed={preset === key} onClick={() => choosePreset(key)}>{definition.label}</Button>;
          })}
        </div>
        <label className="text-[9px] font-bold text-carbon/45">{t('editor.diagramEditors.screen')} <input type="number" min="320" max="2560" aria-label={t('editor.diagramEditors.screenWidth')} className={`${controlClassName} ml-1 w-16 font-mono`} value={screenSize.width} onChange={event => updateScreenSize('width', Number(event.target.value))} /></label>
        <label className="text-xs font-bold text-carbon/55">× <input type="number" min="480" max="1600" aria-label={t('editor.diagramEditors.screenHeight')} className={`${controlClassName} ml-1 w-16 font-mono`} value={screenSize.height} onChange={event => updateScreenSize('height', Number(event.target.value))} /></label></>}
      </div>
      {!editing && <div className="flex flex-wrap items-center justify-between gap-2 border-b border-carbon/10 bg-lienzo px-3 py-1.5 text-xs text-carbon/50">
        <span>{t('editor.diagramEditors.layoutScreenSummary', { layout: layoutLabel(t, layout), width: screenSize.width, height: screenSize.height })}</span>
        <strong className="font-mono text-pavo">{t('editor.diagramEditors.realAreaSummary', { width: area.width, height: area.height })}</strong>
      </div>}
      <div className={editing ? 'h-[min(70vh,760px)] min-h-[480px] bg-carbon/5 p-3' : 'max-h-[72vh] overflow-auto bg-carbon/5 p-3'}>
        <div className={editing ? 'relative h-full w-full overflow-hidden rounded border-2 border-pavo/30 bg-lienzo shadow-sm' : 'relative shrink-0 overflow-hidden rounded border-2 border-pavo/30 bg-lienzo shadow-sm'} style={editing ? undefined : { width: area.width, height: area.height }} aria-label={editing ? t('editor.diagramEditors.viewportAriaFlexible', { title }) : t('editor.diagramEditors.viewportAriaFixed', { title, width: area.width, height: area.height, screenWidth: screenSize.width, screenHeight: screenSize.height })}>
          {children}
        </div>
      </div>
      {!editing && <p className="border-t border-carbon/10 bg-lienzo px-3 py-2 text-xs leading-relaxed text-carbon/55">{t('editor.diagramEditors.viewportSizeNote')}</p>}
    </section>
  );
};

export default DiagramViewportFrame;
