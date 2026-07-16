import React from 'react';
import type { VisualDiagramModel, VisualElement, VisualPoint, VisualSlider } from '../model/types';
import { updateElement, updatePoint, updateSlider } from '../model/commands';

interface DiagramSceneControlsProps {
  model: VisualDiagramModel;
  point?: VisualPoint;
  element?: VisualElement;
  slider?: VisualSlider;
  onModelEdit: (model: VisualDiagramModel) => void;
}

type SceneUpdate = Partial<Pick<VisualPoint, 'layerId' | 'order' | 'visible' | 'locked' | 'selection'>>;

export const DiagramSceneControls: React.FC<DiagramSceneControlsProps> = ({ model, point, element, slider, onModelEdit }) => {
  const item = point || element || slider;
  if (!item) return null;

  const changeItem = (update: SceneUpdate) => {
    if (point) onModelEdit(updatePoint(model, point.id, update));
    else if (element) onModelEdit(updateElement(model, element.id, update));
    else if (slider) onModelEdit(updateSlider(model, slider.id, update));
  };

  const sceneItems = [...model.points, ...model.elements, ...model.sliders];
  const layer = model.layers.find(candidate => candidate.id === item.layerId);
  const sameLayerItems = sceneItems.filter(candidate => candidate.layerId === item.layerId);

  const changeGroup = (groupId: string, checked: boolean) => {
    const groupIds = checked ? [...item.groupIds, groupId] : item.groupIds.filter(id => id !== groupId);
    const groups = model.groups.map(group => group.id === groupId
      ? { ...group, memberIds: checked ? [...new Set([...group.memberIds, item.id])] : group.memberIds.filter(id => id !== item.id) }
      : group);
    if (point) onModelEdit({ ...updatePoint(model, point.id, { groupIds }), groups });
    else if (element) onModelEdit({ ...updateElement(model, element.id, { groupIds }), groups });
    else if (slider) onModelEdit({ ...updateSlider(model, slider.id, { groupIds }), groups });
  };

  return (
    <div className="mt-4 space-y-3 border-t border-carbon/10 pt-3">
      <p className="text-[10px] font-bold uppercase tracking-widest text-carbon/45">Comportamiento en el lienzo</p>
      <div className="space-y-2 rounded border border-carbon/10 p-2">
        <label className="flex items-start gap-1.5 text-xs font-bold text-carbon">
          <input type="checkbox" checked={item.visible} onChange={event => changeItem({ visible: event.target.checked })} />
          <span>Mostrar el objeto<span className="mt-0.5 block text-[9px] font-normal leading-relaxed text-carbon/45">Puede ocultarse además en una capa, grupo o paso de la secuencia.</span></span>
        </label>
        <label className="flex items-start gap-1.5 text-xs font-bold text-carbon">
          <input type="checkbox" checked={item.locked} onChange={event => changeItem({ locked: event.target.checked })} />
          <span>Impedir que se mueva<span className="mt-0.5 block text-[9px] font-normal leading-relaxed text-carbon/45">Sigue pudiendo seleccionarse y editarse desde este panel.</span></span>
        </label>
        <label className="flex items-start gap-1.5 text-xs font-bold text-carbon">
          <input type="checkbox" checked={item.selection.selectable} onChange={event => changeItem({ selection: { ...item.selection, selectable: event.target.checked } })} />
          <span>Permitir selección directa<span className="mt-0.5 block text-[9px] font-normal leading-relaxed text-carbon/45">Si se desactiva, no puede seleccionarse, arrastrarse ni ajustarse con el teclado en el lienzo. Conserva el foco y el resaltado; las relaciones aún pueden moverlo y se edita desde la lista.</span></span>
        </label>
        <label className="flex items-start gap-1.5 text-xs font-bold text-carbon">
          <input type="checkbox" checked={item.selection.highlightable !== false} onChange={event => changeItem({ selection: { ...item.selection, highlightable: event.target.checked } })} />
          <span>Resaltar por hover o foco<span className="mt-0.5 block text-[9px] font-normal leading-relaxed text-carbon/45">Si se desactiva, la interacción dentro del lienzo no cambia su aspecto. Las referencias MDX y la selección explícita sí pueden resaltarlo.</span></span>
        </label>
        <label className="flex items-start gap-1.5 text-xs font-bold text-carbon">
          <input type="checkbox" checked={item.selection.dimOthersOnHighlight !== false} onChange={event => changeItem({ selection: { ...item.selection, dimOthersOnHighlight: event.target.checked } })} />
          <span>Atenuar los demás desde MDX<span className="mt-0.5 block text-[9px] font-normal leading-relaxed text-carbon/45">Las referencias del texto usan este modo por defecto. El hover y el foco dentro del diagrama solo resaltan este objeto.</span></span>
        </label>
      </div>
      <details className="rounded border border-carbon/10">
        <summary className="cursor-pointer list-none px-2 py-1.5 text-xs font-bold text-carbon/70 [&::-webkit-details-marker]:hidden">Organización visual <span className="float-right text-[9px] font-normal text-carbon/40">{layer?.label ?? item.layerId} ▾</span></summary>
        <div className="space-y-3 border-t border-carbon/10 p-2">
          <div>
            <label className="block text-xs font-bold text-carbon mb-1">Capa</label>
            <select className="w-full rounded border border-carbon/15 bg-lienzo p-1.5 text-xs" value={item.layerId} onChange={event => changeItem({ layerId: event.target.value })}>
              {model.layers.slice().sort((a, b) => a.order - b.order).map(candidate => <option key={candidate.id} value={candidate.id}>{candidate.label}</option>)}
            </select>
            <p className="mt-1 text-[9px] leading-relaxed text-carbon/45">Una capa superior siempre queda delante de una inferior. El orden interno solo compara objetos de esta misma capa.</p>
          </div>
          <div>
            <p className="text-xs font-bold text-carbon">Delante o detrás en esta capa</p>
            <div className="mt-1 grid grid-cols-2 gap-1">
              <button type="button" className="rounded border border-carbon/15 px-2 py-1 text-[10px] font-bold text-carbon" onClick={() => changeItem({ order: Math.min(...sameLayerItems.map(candidate => candidate.order), 0) - 1000 })}>Enviar al fondo</button>
              <button type="button" className="rounded border border-carbon/15 px-2 py-1 text-[10px] font-bold text-carbon" onClick={() => changeItem({ order: Math.max(...sameLayerItems.map(candidate => candidate.order), 0) + 1000 })}>Traer al frente</button>
            </div>
            <details className="mt-2">
              <summary className="cursor-pointer text-[9px] text-carbon/45">Valor numérico avanzado</summary>
              <input aria-label="Orden visual avanzado" type="number" className="mt-1 w-full rounded border border-carbon/15 bg-lienzo p-1.5 text-xs font-mono" value={item.order} onChange={event => changeItem({ order: Number(event.target.value) })} />
            </details>
          </div>
          {model.groups.length > 0 && (
            <fieldset className="space-y-1">
              <legend className="text-xs font-bold text-carbon">Acciones conjuntas</legend>
              <p className="text-[9px] leading-relaxed text-carbon/45">Un grupo sirve para mostrar, bloquear o resaltar varios objetos a la vez; no cambia su orden visual.</p>
              {model.groups.map(group => (
                <label key={group.id} className="flex items-center gap-1.5 text-xs text-carbon">
                  <input type="checkbox" checked={item.groupIds.includes(group.id)} onChange={event => changeGroup(group.id, event.target.checked)} />
                  {group.label}
                </label>
              ))}
            </fieldset>
          )}
        </div>
      </details>
    </div>
  );
};

export default DiagramSceneControls;
