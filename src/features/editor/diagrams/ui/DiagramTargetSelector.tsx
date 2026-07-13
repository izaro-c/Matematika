import React from 'react';
import { cleanTargetId } from '../model/commands';
import { buildTargets, interactiveElementSnippet } from '../model/selectors';
import type { VisualDiagramModel } from '../model/types';

interface DiagramTargetSelectorProps {
  model: VisualDiagramModel;
  selectedTargetId: string;
  onSelectTarget: (objectId: string, targetId: string) => void;
  onModelEdit: (model: VisualDiagramModel, command?: { label?: string; mergeKey?: string }) => void;
}

export const DiagramTargetSelector: React.FC<DiagramTargetSelectorProps> = ({
  model,
  selectedTargetId,
  onSelectTarget,
  onModelEdit,
}) => {
  const items = [...model.points, ...model.elements, ...model.sliders];
  const targets = buildTargets(model);
  const duplicateIds = targets.map(item => item.id).filter((id, index, ids) => ids.indexOf(id) !== index);
  const stepReferences = new Set(model.steps.flatMap(item => [
    ...item.visibleTargets,
    ...Object.keys(item.objectStates ?? {}),
  ]));
  const missingReferences = [...stepReferences].filter(id => !items.some(item => item.id === id));

  const updateItem = (objectId: string, update: { target?: boolean; targetId?: string }) => {
    onModelEdit({
      ...model,
      points: model.points.map(item => item.id === objectId ? { ...item, ...update } : item),
      elements: model.elements.map(item => item.id === objectId ? { ...item, ...update } : item),
      sliders: model.sliders.map(item => item.id === objectId ? { ...item, ...update } : item),
    }, { label: `Editar target ${objectId}`, mergeKey: `target-${objectId}` });
  };

  return (
    <section className="rounded border border-carbon/15 bg-lienzo p-3" aria-labelledby="target-registry-title">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 id="target-registry-title" className="text-xs font-bold uppercase tracking-widest text-carbon/55">Registro estable de targets</h3>
          <p className="mt-1 text-[10px] text-carbon/55">El ID público permanece aunque cambie el ID interno. En páginas con varios diagramas se usa el ID cualificado.</p>
        </div>
        <span className="rounded bg-pavo/10 px-2 py-1 font-mono text-[10px] text-pavo">{model.componentId}:target</span>
      </div>

      {(duplicateIds.length > 0 || missingReferences.length > 0) && (
        <div className="mt-3 rounded border border-granada/25 bg-granada/5 p-2 text-xs text-granada" role="alert">
          {duplicateIds.length > 0 && <p>Targets públicos duplicados: {[...new Set(duplicateIds)].join(', ')}.</p>}
          {missingReferences.length > 0 && <p>Referencias de pasos inexistentes: {missingReferences.join(', ')}.</p>}
        </div>
      )}

      <div className="mt-3 grid max-h-72 gap-2 overflow-y-auto sm:grid-cols-2 lg:grid-cols-3">
        {items.map(item => {
          const targetId = item.targetId ?? item.id;
          const target = targets.find(candidate => candidate.objectId === item.id);
          return (
            <div key={item.id} className={`rounded border p-2 ${selectedTargetId === targetId ? 'border-ocre bg-ocre/5' : 'border-carbon/10'}`}>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={item.target}
                  onChange={event => updateItem(item.id, { target: event.target.checked, targetId: event.target.checked ? targetId : item.targetId })}
                  aria-label={`Publicar ${item.label} como target`}
                />
                <button type="button" className="min-w-0 flex-1 text-left" onClick={() => onSelectTarget(item.id, targetId)}>
                  <span className="block truncate text-xs font-bold text-carbon">{item.label}</span>
                  <span className="block truncate font-mono text-[9px] text-carbon/45">objeto: {item.id}</span>
                </button>
              </div>
              {item.target && (
                <>
                  <label className="mt-2 block text-[9px] font-bold uppercase tracking-wider text-carbon/45">Target público
                    <input
                      className="mt-1 w-full rounded border border-carbon/15 bg-lienzo p-1 font-mono text-[10px]"
                      value={targetId}
                      onChange={event => updateItem(item.id, { targetId: cleanTargetId(event.target.value, targetId) })}
                      onFocus={() => onSelectTarget(item.id, targetId)}
                    />
                  </label>
                  <p className="mt-1 truncate font-mono text-[9px] text-pavo" title={`${model.componentId}:${targetId}`}>{model.componentId}:{targetId}</p>
                  {target && (
                    <button
                      type="button"
                      className="mt-1 rounded border border-carbon/15 px-1.5 py-0.5 text-[9px] text-carbon"
                      onClick={() => navigator.clipboard?.writeText(interactiveElementSnippet(target))}
                      aria-label={`Copiar InteractiveElement para ${targetId}`}
                    >Copiar enlace MDX</button>
                  )}
                </>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default DiagramTargetSelector;
