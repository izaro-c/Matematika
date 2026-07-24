import React from 'react';
import type { ConstructionKind, ConstructionRefKey, VisualDiagramModel } from '../model/types';
import { CONSTRUCTION_OPTIONS } from '../model';

interface DiagramGuidedConstructionsProps {
  model: VisualDiagramModel;
  kind: ConstructionKind;
  refs: Record<ConstructionRefKey, string>;
  ready: boolean;
  onKindChange: (kind: ConstructionKind) => void;
  onRefChange: (key: ConstructionRefKey, value: string) => void;
  onCreate: () => void;
}

export const DiagramGuidedConstructions: React.FC<DiagramGuidedConstructionsProps> = ({
  model,
  kind,
  refs,
  ready,
  onKindChange,
  onRefChange,
  onCreate,
}) => {
  const selected = CONSTRUCTION_OPTIONS.find(option => option.value === kind) ?? CONSTRUCTION_OPTIONS[0];
  return (
    <section aria-labelledby="guided-construction-title">
      <h3 id="guided-construction-title" className="ac-label ac-label--sm ac-label--pavo">Construcción guiada</h3>
      <p className="mt-1 text-[10px] leading-relaxed text-carbon/50">Crea de una vez los puntos auxiliares, rectas y marcas necesarios, conservándolos como objetos editables.</p>
      <label className="mt-3 block text-[10px] font-bold text-carbon">Construcción
        <select aria-label="Tipo de construcción guiada" className="mt-1 w-full rounded border border-carbon/15 bg-lienzo p-2 text-xs" value={kind} onChange={event => onKindChange(event.target.value as ConstructionKind)}>
          {CONSTRUCTION_OPTIONS.map(option => <option key={option.value} value={option.value}>{option.label}</option>)}
        </select>
      </label>
      <p className="mt-2 rounded border border-pavo/15 bg-pavo/5 p-2 text-[10px] leading-relaxed text-carbon/60">{selected.description}</p>
      <div className="mt-3 space-y-2">
        {selected.slots.map((slot, index) => (
          <label key={slot.key} className="block text-[10px] font-bold text-carbon">
            {index + 1}. {slot.label}
            <select aria-label={slot.label} className="mt-1 w-full rounded border border-carbon/15 bg-lienzo p-1.5 text-xs" value={refs[slot.key] || ''} onChange={event => onRefChange(slot.key, event.target.value)}>
              <option value="">Seleccione un punto…</option>
              {model.points.map(point => <option key={point.id} value={point.id}>{point.label} ({point.id})</option>)}
            </select>
          </label>
        ))}
      </div>
      {model.points.length < selected.slots.length && <p className="mt-2 text-[10px] font-semibold text-granada">Faltan puntos: esta construcción necesita {selected.slots.length} puntos distintos y hay {model.points.length}.</p>}
      <button type="button" onClick={onCreate} disabled={!ready} className="mt-4 w-full rounded bg-pavo py-2 text-xs font-bold text-lienzo transition-colors hover:bg-pavo/90 disabled:opacity-40">Crear {selected.label}</button>
    </section>
  );
};

export default DiagramGuidedConstructions;
