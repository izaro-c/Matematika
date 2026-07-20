import React, { useState } from 'react';
import {
  PUBLISHED_LAYOUT_LABELS,
  SCREEN_PRESETS,
  publishedDiagramArea,
  publishedLayoutForPageType,
  type PublishedDiagramLayout,
  type ScreenPreset,
} from '../model/publishedDiagramLayout';

interface DiagramViewportFrameProps {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  pageType?: string;
  testId?: string;
}

function boundedDimension(value: number, minimum: number, maximum: number): number {
  return Math.min(maximum, Math.max(minimum, Math.round(value)));
}

export const DiagramViewportFrame: React.FC<DiagramViewportFrameProps> = ({ title, subtitle, children, pageType, testId }) => {
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
          <h3 className="text-[10px] font-bold uppercase tracking-widest text-carbon/50">{title}</h3>
          <p className="text-[9px] text-carbon/45">{subtitle}</p>
        </div>
        <label className="text-[9px] font-bold text-carbon/45">
          Contexto
          <select aria-label="Contexto de publicación" className="ml-1 rounded border border-carbon/15 bg-lienzo p-1 text-[9px] text-carbon" value={layout} onChange={event => setLayout(event.target.value as PublishedDiagramLayout)}>
            {(Object.keys(PUBLISHED_LAYOUT_LABELS) as PublishedDiagramLayout[]).map(key => <option key={key} value={key}>{PUBLISHED_LAYOUT_LABELS[key]}</option>)}
          </select>
        </label>
        <div className="flex rounded border border-carbon/10 bg-carbon/[0.02] p-0.5" role="group" aria-label="Tamaño de pantalla">
          {(Object.keys(SCREEN_PRESETS) as Array<Exclude<ScreenPreset, 'custom'>>).map(key => {
            const definition = SCREEN_PRESETS[key];
            const presetArea = publishedDiagramArea(definition, layout);
            return <button key={key} type="button" title={`Pantalla ${definition.width} × ${definition.height}; diagrama ${presetArea.width} × ${presetArea.height}`} aria-pressed={preset === key} className={`rounded px-2 py-1 text-[9px] font-bold ${preset === key ? 'bg-carbon text-lienzo' : 'text-carbon/55'}`} onClick={() => choosePreset(key)}>{definition.label}</button>;
          })}
        </div>
        <label className="text-[9px] font-bold text-carbon/45">Pantalla <input type="number" min="320" max="2560" aria-label="Ancho de pantalla" className="ml-1 w-16 rounded border border-carbon/15 bg-lienzo p-1 font-mono text-[9px] text-carbon" value={screenSize.width} onChange={event => updateScreenSize('width', Number(event.target.value))} /></label>
        <label className="text-[9px] font-bold text-carbon/45">× <input type="number" min="480" max="1600" aria-label="Alto de pantalla" className="ml-1 w-16 rounded border border-carbon/15 bg-lienzo p-1 font-mono text-[9px] text-carbon" value={screenSize.height} onChange={event => updateScreenSize('height', Number(event.target.value))} /></label>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-carbon/10 bg-lienzo px-3 py-1.5 text-[9px] text-carbon/50">
        <span>{PUBLISHED_LAYOUT_LABELS[layout]} · pantalla {screenSize.width} × {screenSize.height}</span>
        <strong className="font-mono text-pavo">Área real del diagrama: {area.width} × {area.height}</strong>
      </div>
      <div className="max-h-[72vh] overflow-auto bg-carbon/5 p-3">
        <div className="relative shrink-0 overflow-hidden rounded border-2 border-pavo/30 bg-lienzo shadow-sm" style={{ width: area.width, height: area.height }} aria-label={`${title} de ${area.width} por ${area.height} píxeles dentro de una pantalla de ${screenSize.width} por ${screenSize.height}`}>
          {children}
        </div>
      </div>
      <p className="border-t border-carbon/10 bg-lienzo px-3 py-2 text-[9px] leading-relaxed text-carbon/45">El tamaño se calcula con las mismas proporciones, breakpoints, columnas, índice lateral y barra móvil del layout publicado. Cambie la pantalla o el contexto para comprobar el área exacta que recibirá el renderer.</p>
    </section>
  );
};

export default DiagramViewportFrame;
