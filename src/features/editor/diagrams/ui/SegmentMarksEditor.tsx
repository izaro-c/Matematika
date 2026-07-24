import React from 'react';
import {
  congruenceMarkForSegment,
  measureTicksForSegment,
  setSegmentCongruenceMark,
  setSegmentMeasureTicks,
} from '../model/segmentMarks';
import type { VisualDiagramModel, VisualElement } from '../model/types';

interface SegmentMarksEditorProps {
  model: VisualDiagramModel;
  segment: VisualElement;
  onModelEdit: (model: VisualDiagramModel) => void;
}

export const SegmentMarksEditor: React.FC<SegmentMarksEditorProps> = ({
  model,
  segment,
  onModelEdit,
}) => {
  const ticks = measureTicksForSegment(model, segment.id);
  const congruence = congruenceMarkForSegment(model, segment.id);

  return (
    <section className="space-y-2 rounded border border-carbon/15 bg-carbon/[0.03] p-2" aria-label="Marcas del segmento">
      <p className="ac-label ac-label--sm ac-label--strong">Marcas del segmento</p>

      <div className="rounded border border-carbon/10 bg-lienzo p-2">
        <label className="flex items-center gap-1.5 text-[10px] font-bold text-carbon">
          <input
            type="checkbox"
            checked={Boolean(congruence)}
            onChange={event => onModelEdit(setSegmentCongruenceMark(model, segment.id, event.target.checked ? 1 : 0))}
          />
          Congruencia <span className="font-normal text-carbon/45">rayas centrales</span>
        </label>
        {congruence && (
          <div className="mt-2 grid grid-cols-2 gap-2">
            <label className="text-[9px] font-bold text-carbon/60">Cantidad<input type="number" min="1" max="4" aria-label="Número de marcas de congruencia" className="mt-1 w-full rounded border border-carbon/15 bg-lienzo p-1 text-xs" value={congruence.properties?.markCount ?? 1} onChange={event => onModelEdit(setSegmentCongruenceMark(model, segment.id, Number(event.target.value), congruence.style?.markHeight))} /></label>
            <label className="text-[9px] font-bold text-carbon/60">Altura<input type="number" min="0.05" max="100" step="0.05" aria-label="Altura de las marcas de congruencia" className="mt-1 w-full rounded border border-carbon/15 bg-lienzo p-1 text-xs" value={congruence.style?.markHeight ?? 0.32} onChange={event => onModelEdit(setSegmentCongruenceMark(model, segment.id, congruence.properties?.markCount ?? 1, Number(event.target.value)))} /></label>
          </div>
        )}
      </div>

      <div className="rounded border border-carbon/10 bg-lienzo p-2">
        <label className="flex items-center gap-1.5 text-[10px] font-bold text-carbon">
          <input
            type="checkbox"
            checked={Boolean(ticks)}
            onChange={event => onModelEdit(setSegmentMeasureTicks(model, segment.id, event.target.checked ? 2 : 0))}
          />
          Medida <span className="font-normal text-carbon/45">graduación de regla</span>
        </label>
        {ticks && (
          <div className="mt-2 grid grid-cols-2 gap-2">
            <label className="text-[9px] font-bold text-carbon/60">Separación<input type="number" min="0.05" max="100" step="0.05" aria-label="Separación entre marcas de medida" className="mt-1 w-full rounded border border-carbon/15 bg-lienzo p-1 text-xs" value={ticks.properties?.tickDistance ?? 2} onChange={event => onModelEdit(setSegmentMeasureTicks(model, segment.id, Number(event.target.value), ticks.style?.markHeight))} /></label>
            <label className="text-[9px] font-bold text-carbon/60">Altura<input type="number" min="0.05" max="100" step="0.5" aria-label="Altura de las marcas de medida" className="mt-1 w-full rounded border border-carbon/15 bg-lienzo p-1 text-xs" value={ticks.style?.markHeight ?? 10} onChange={event => onModelEdit(setSegmentMeasureTicks(model, segment.id, ticks.properties?.tickDistance ?? 2, Number(event.target.value)))} /></label>
          </div>
        )}
      </div>
    </section>
  );
};

export default SegmentMarksEditor;
