import React from 'react';
import type { DiagramHeaderConfiguration, DiagramHeaderReading } from '@/shared/diagrams/public';
import type { VisualDiagramModel } from '../model/types';

interface DiagramHeaderReadingsEditorProps {
  model: VisualDiagramModel;
  onModelEdit: (model: VisualDiagramModel, command?: { label?: string }) => void;
}

type ReadingCandidate = VisualDiagramModel['elements'][number];

function readingCandidates(model: VisualDiagramModel): ReadingCandidate[] {
  return model.elements.filter(item => (
    item.kind === 'measurement'
    || item.kind === 'dimensionLine'
    || (item.kind === 'infoPanel' && Boolean(item.properties?.expression))
  ));
}

function automaticReadings(model: VisualDiagramModel): DiagramHeaderReading[] {
  const candidates = readingCandidates(model);
  const panels = candidates.filter(item => item.kind === 'infoPanel');
  return (panels.length > 0 ? panels : candidates.slice(0, 4)).map((item, index) => ({
    id: `header-reading-${index + 1}`,
    sourceIds: [item.id],
    presentation: 'label-value',
  }));
}

function nextReadingId(readings: readonly DiagramHeaderReading[]): string {
  let index = readings.length + 1;
  while (readings.some(reading => reading.id === `header-reading-${index}`)) index += 1;
  return `header-reading-${index}`;
}

function equalitySources(reading: DiagramHeaderReading, candidates: readonly ReadingCandidate[]): string[] {
  const sources = reading.sourceIds.filter(id => candidates.some(candidate => candidate.id === id));
  for (const candidate of candidates) {
    if (sources.length >= 2) break;
    if (!sources.includes(candidate.id)) sources.push(candidate.id);
  }
  return sources;
}

function replaceSource(sourceIds: readonly string[], index: number, sourceId: string): string[] {
  return sourceIds.map((current, currentIndex) => currentIndex === index ? sourceId : current);
}

interface EqualityTermsEditorProps {
  reading: DiagramHeaderReading;
  candidates: readonly ReadingCandidate[];
  onChange: (sourceIds: string[]) => void;
}

function EqualityTermsEditor({ reading, candidates, onChange }: EqualityTermsEditorProps) {
  const sourceIds = equalitySources(reading, candidates);
  const unusedCandidate = candidates.find(candidate => !sourceIds.includes(candidate.id));
  return (
    <div className="space-y-1.5">
      <span className="text-[10px] font-bold text-carbon/55">Términos de la igualdad</span>
      {sourceIds.map((sourceId, index) => (
        <div key={`${reading.id}-${index}`} className="grid grid-cols-[1.5rem_minmax(0,1fr)_2.5rem] items-center gap-1">
          <span className="text-center font-serif text-sm font-bold text-carbon/45">{index === 0 ? '' : '='}</span>
          <select
            aria-label={`Término ${index + 1} de la igualdad`}
            className="min-h-10 min-w-0 rounded border border-carbon/15 bg-lienzo px-2 text-xs"
            value={sourceId}
            onChange={event => onChange(replaceSource(sourceIds, index, event.target.value))}
          >
            {candidates.map(candidate => (
              <option key={candidate.id} value={candidate.id} disabled={candidate.id !== sourceId && sourceIds.includes(candidate.id)}>{candidate.label}</option>
            ))}
          </select>
          <button type="button" aria-label={`Quitar término ${index + 1}`} disabled={sourceIds.length <= 2} onClick={() => onChange(sourceIds.filter((_, sourceIndex) => sourceIndex !== index))} className="min-h-10 rounded text-sm font-bold text-granada hover:bg-granada/5 disabled:opacity-20">×</button>
        </div>
      ))}
      <button type="button" disabled={!unusedCandidate} onClick={() => unusedCandidate && onChange([...sourceIds, unusedCandidate.id])} className="min-h-10 w-full rounded border border-dashed border-carbon/20 text-[10px] font-bold text-carbon/55 hover:bg-carbon/5 disabled:opacity-35">+ Añadir término</button>
    </div>
  );
}

export const DiagramHeaderReadingsEditor: React.FC<DiagramHeaderReadingsEditorProps> = ({ model, onModelEdit }) => {
  const candidates = readingCandidates(model);
  const header: DiagramHeaderConfiguration = model.header ?? { readingsMode: 'automatic', readings: [] };
  const commit = (next: DiagramHeaderConfiguration, label: string) => onModelEdit({ ...model, header: next }, { label });
  const setMode = (readingsMode: DiagramHeaderConfiguration['readingsMode']) => commit({
    readingsMode,
    readings: readingsMode === 'custom' && header.readings.length === 0 ? automaticReadings(model) : header.readings,
  }, 'Cambiar información de cabecera');
  const updateReading = (id: string, update: Partial<DiagramHeaderReading>) => commit({
    ...header,
    readings: header.readings.map(reading => reading.id === id ? { ...reading, ...update } : reading),
  }, 'Editar información de cabecera');

  return (
    <section aria-labelledby="diagram-header-readings-title">
      <div className="flex min-h-11 items-center justify-between gap-3">
        <div>
          <h3 id="diagram-header-readings-title" className="text-xs font-bold text-carbon">Información bajo el título</h3>
          <p className="mt-0.5 text-[10px] text-carbon/45">Medidas que acompañan al diagrama.</p>
        </div>
        <label className="flex items-center gap-2 text-xs font-bold text-carbon"><input type="checkbox" checked={header.readingsMode !== 'hidden'} onChange={event => setMode(event.target.checked ? 'automatic' : 'hidden')} />Mostrar</label>
      </div>

      {header.readingsMode !== 'hidden' && (
        <>
          <div className="mt-2 grid grid-cols-2 rounded border border-carbon/10 bg-carbon/[0.02] p-0.5" role="radiogroup" aria-label="Modo de información bajo el título">
            <button type="button" role="radio" aria-checked={header.readingsMode === 'automatic'} onClick={() => setMode('automatic')} className={`min-h-10 rounded px-2 text-[10px] font-bold ${header.readingsMode === 'automatic' ? 'bg-carbon text-lienzo' : 'text-carbon/55'}`}>Automática</button>
            <button type="button" role="radio" aria-checked={header.readingsMode === 'custom'} onClick={() => setMode('custom')} className={`min-h-10 rounded px-2 text-[10px] font-bold ${header.readingsMode === 'custom' ? 'bg-carbon text-lienzo' : 'text-carbon/55'}`}>Personalizada</button>
          </div>

          {header.readingsMode === 'automatic' && <p className="mt-2 text-[10px] text-carbon/45">El editor elegirá los valores dinámicos más relevantes.</p>}

          {header.readingsMode === 'custom' && (
            <div className="mt-2 space-y-2">
              {header.readings.map((reading, index) => (
                <article key={reading.id} className="rounded border border-carbon/10 bg-carbon/[0.015] p-2.5">
                  <div className="mb-2 flex items-center justify-between gap-2">
                    <strong className="text-[10px] text-carbon/55">Lectura {index + 1}</strong>
                    <button type="button" className="text-[10px] font-bold text-granada hover:underline" onClick={() => commit({ ...header, readings: header.readings.filter(item => item.id !== reading.id) }, 'Quitar información de cabecera')}>Quitar</button>
                  </div>
                  <label className="block text-[10px] font-bold text-carbon/55">Mostrar como
                    <select aria-label={`Presentación de lectura ${index + 1}`} className="mt-1 min-h-10 w-full rounded border border-carbon/15 bg-lienzo px-2 text-xs" value={reading.presentation} onChange={event => {
                      const presentation = event.target.value as DiagramHeaderReading['presentation'];
                      updateReading(reading.id, {
                        presentation,
                        sourceIds: presentation === 'equality' ? equalitySources(reading, candidates) : reading.sourceIds.slice(0, 1),
                      });
                    }}>
                      <option value="label-value">Nombre y valor</option>
                      <option value="value">Solo el valor</option>
                      <option value="equality" disabled={candidates.length < 2}>Igualdad</option>
                    </select>
                  </label>

                  <div className="mt-2">
                    {reading.presentation === 'equality' ? (
                      <EqualityTermsEditor reading={reading} candidates={candidates} onChange={sourceIds => updateReading(reading.id, { sourceIds })} />
                    ) : (
                      <label className="block text-[10px] font-bold text-carbon/55">Valor
                        <select aria-label={`Origen de lectura ${index + 1}`} className="mt-1 min-h-10 w-full rounded border border-carbon/15 bg-lienzo px-2 text-xs" value={reading.sourceIds[0] ?? ''} onChange={event => updateReading(reading.id, { sourceIds: [event.target.value] })}>
                          {candidates.map(candidate => <option key={candidate.id} value={candidate.id}>{candidate.label}</option>)}
                        </select>
                      </label>
                    )}
                  </div>

                </article>
              ))}

              {candidates.length === 0 ? (
                <p className="rounded border border-dashed border-carbon/15 p-3 text-center text-[10px] text-carbon/45">Añada una medición para mostrarla aquí.</p>
              ) : (
                <button type="button" className="min-h-11 w-full rounded border border-dashed border-carbon/20 text-xs font-bold text-carbon/60 hover:bg-carbon/5" onClick={() => commit({ ...header, readings: [...header.readings, { id: nextReadingId(header.readings), sourceIds: [candidates[0].id], presentation: 'label-value' }] }, 'Añadir información de cabecera')}>+ Añadir lectura</button>
              )}
            </div>
          )}
        </>
      )}
    </section>
  );
};

export default DiagramHeaderReadingsEditor;
