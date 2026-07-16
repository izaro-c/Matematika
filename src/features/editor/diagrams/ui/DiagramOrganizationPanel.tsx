import React from 'react';
import type { VisualDiagramModel } from '../model/types';

interface EditCommand {
  label?: string;
  mergeKey?: string;
}

interface DiagramOrganizationPanelProps {
  model: VisualDiagramModel;
  onModelEdit: (model: VisualDiagramModel, command?: EditCommand) => void;
}

function swapLayerOrders(model: VisualDiagramModel, firstId: string, secondId: string): VisualDiagramModel['layers'] {
  const first = model.layers.find(item => item.id === firstId);
  const second = model.layers.find(item => item.id === secondId);
  if (!first || !second) return model.layers;
  return model.layers.map(item => {
    if (item.id === firstId) return { ...item, order: second.order };
    if (item.id === secondId) return { ...item, order: first.order };
    return item;
  });
}

export const DiagramOrganizationPanel: React.FC<DiagramOrganizationPanelProps> = ({ model, onModelEdit }) => {
  const deleteGroup = (groupId: string, label: string) => onModelEdit({
    ...model,
    groups: model.groups.filter(item => item.id !== groupId),
    points: model.points.map(item => ({ ...item, groupIds: item.groupIds.filter(id => id !== groupId) })),
    elements: model.elements.map(item => ({ ...item, groupIds: item.groupIds.filter(id => id !== groupId) })),
    sliders: model.sliders.map(item => ({ ...item, groupIds: item.groupIds.filter(id => id !== groupId) })),
  }, { label: `Eliminar grupo ${label}` });

  const deleteLayer = (layerId: string, label: string) => {
    const fallback = model.layers.slice().sort((a, b) => a.order - b.order).find(item => item.id !== layerId);
    if (!fallback) return;
    onModelEdit({
      ...model,
      layers: model.layers.filter(item => item.id !== layerId),
      points: model.points.map(item => item.layerId === layerId ? { ...item, layerId: fallback.id } : item),
      elements: model.elements.map(item => item.layerId === layerId ? { ...item, layerId: fallback.id } : item),
      sliders: model.sliders.map(item => item.layerId === layerId ? { ...item, layerId: fallback.id } : item),
    }, { label: `Eliminar capa ${label}` });
  };

  return (
    <>
      <details className="group rounded border border-carbon/10 bg-lienzo">
        <summary className="cursor-pointer list-none px-3 py-2 text-[10px] font-bold uppercase tracking-widest text-carbon/55 hover:bg-carbon/5 [&::-webkit-details-marker]:hidden">Grupos <span className="float-right font-mono text-[9px]" aria-hidden="true">{model.groups.length} ▾</span></summary>
        <div className="border-t border-carbon/10 p-3">
          <p className="mb-2 text-[10px] leading-relaxed text-carbon/50">Un grupo reúne objetos que deben seleccionarse, ocultarse o resaltarse juntos. No cambia qué objeto queda delante.</p>
          <div className="space-y-2">
            {model.groups.map(group => (
              <div key={group.id} className="rounded border border-carbon/10 p-2">
                <input aria-label={`Nombre del grupo ${group.id}`} className="w-full rounded border border-transparent bg-transparent text-xs font-bold text-carbon hover:border-carbon/10 focus:border-carbon/20" value={group.label} onChange={event => onModelEdit({ ...model, groups: model.groups.map(item => item.id === group.id ? { ...item, label: event.target.value } : item) }, { label: `Renombrar grupo ${group.id}`, mergeKey: `group-label-${group.id}` })} />
                <p className="text-[10px] font-mono text-carbon/45">{group.memberIds.length} objeto(s)</p>
                <div className="mt-1 flex flex-wrap gap-1">
                  <button type="button" className="rounded border border-carbon/15 px-1.5 py-0.5 text-[10px]" onClick={() => onModelEdit({ ...model, groups: model.groups.map(item => item.id === group.id ? { ...item, visible: !item.visible } : item) }, { label: `${group.visible ? 'Ocultar' : 'Mostrar'} grupo ${group.label}` })}>{group.visible ? 'Visible' : 'Oculto'}</button>
                  <button type="button" className="rounded border border-carbon/15 px-1.5 py-0.5 text-[10px]" onClick={() => onModelEdit({ ...model, groups: model.groups.map(item => item.id === group.id ? { ...item, locked: !item.locked } : item) }, { label: `${group.locked ? 'Desbloquear' : 'Bloquear'} grupo ${group.label}` })}>{group.locked ? 'Fijo' : 'Editable'}</button>
                  <button type="button" aria-pressed={group.selection.highlightable !== false} className="rounded border border-carbon/15 px-1.5 py-0.5 text-[10px]" onClick={() => onModelEdit({ ...model, groups: model.groups.map(item => item.id === group.id ? { ...item, selection: { ...item.selection, highlightable: item.selection.highlightable === false } } : item) }, { label: `${group.selection.highlightable === false ? 'Permitir' : 'Impedir'} resaltado del grupo ${group.label}` })}>{group.selection.highlightable === false ? 'Sin resaltado' : 'Resaltable'}</button>
                  <button
                    type="button"
                    aria-label={`Atenuar los demás al resaltar el grupo ${group.label} desde MDX`}
                    aria-pressed={group.selection.dimOthersOnHighlight !== false}
                    className="rounded border border-carbon/15 px-1.5 py-0.5 text-[10px]"
                    onClick={() => onModelEdit({
                      ...model,
                      groups: model.groups.map(item => item.id === group.id
                        ? { ...item, selection: { ...item.selection, dimOthersOnHighlight: item.selection.dimOthersOnHighlight === false } }
                        : item),
                    }, { label: `Cambiar modo de resaltado MDX del grupo ${group.label}` })}
                  >
                    {group.selection.dimOthersOnHighlight === false ? 'Resalte aditivo' : 'Atenúa resto'}
                  </button>
                  <button type="button" className="ml-auto text-[10px] font-bold text-granada hover:underline" onClick={() => deleteGroup(group.id, group.label)}>Eliminar</button>
                </div>
              </div>
            ))}
          </div>
          <button
            type="button"
            className="mt-2 w-full rounded border border-carbon/15 px-2 py-1 text-[10px] font-bold text-carbon"
            onClick={() => {
              let index = model.groups.length + 1;
              while (model.groups.some(item => item.id === `group${index}`)) index += 1;
              onModelEdit({ ...model, groups: [...model.groups, { id: `group${index}`, label: `Grupo ${index}`, memberIds: [], visible: true, locked: false, selection: { selectable: true, role: 'secondary' } }] }, { label: 'Añadir grupo' });
            }}
          >+ Grupo</button>
        </div>
      </details>

      <details className="group rounded border border-carbon/10 bg-lienzo">
        <summary className="cursor-pointer list-none px-3 py-2 text-[10px] font-bold uppercase tracking-widest text-carbon/55 hover:bg-carbon/5 [&::-webkit-details-marker]:hidden">Capas <span className="float-right font-mono text-[9px]" aria-hidden="true">{model.layers.length} ▾</span></summary>
        <div className="border-t border-carbon/10 p-3">
          <p className="mb-2 text-[10px] leading-relaxed text-carbon/50">Las capas controlan el orden visual: las superiores se dibujan por delante. También permiten inmovilizar una parte del dibujo.</p>
          <div className="space-y-2">
            {model.layers.slice().sort((a, b) => a.order - b.order).map((layer, index, orderedLayers) => (
              <div key={layer.id} className="rounded border border-carbon/10 p-2">
                <input aria-label={`Nombre de la capa ${layer.id}`} className="w-full rounded border border-transparent bg-transparent text-xs font-bold text-carbon hover:border-carbon/10 focus:border-carbon/20" value={layer.label} onChange={event => onModelEdit({ ...model, layers: model.layers.map(item => item.id === layer.id ? { ...item, label: event.target.value } : item) }, { label: `Renombrar capa ${layer.id}`, mergeKey: `layer-label-${layer.id}` })} />
                <p className="text-[10px] font-mono text-carbon/45">{layer.id}</p>
                <div className="mt-1 flex flex-wrap gap-1">
                  <button type="button" aria-label={`${layer.visible ? 'Ocultar' : 'Mostrar'} capa ${layer.label}`} className="rounded border border-carbon/15 px-1.5 py-0.5 text-[10px]" onClick={() => onModelEdit({ ...model, layers: model.layers.map(item => item.id === layer.id ? { ...item, visible: !item.visible } : item) }, { label: `${layer.visible ? 'Ocultar' : 'Mostrar'} capa ${layer.label}` })}>{layer.visible ? 'Visible' : 'Oculta'}</button>
                  <button type="button" aria-label={`${layer.locked ? 'Desbloquear' : 'Bloquear'} capa ${layer.label}`} className="rounded border border-carbon/15 px-1.5 py-0.5 text-[10px]" onClick={() => onModelEdit({ ...model, layers: model.layers.map(item => item.id === layer.id ? { ...item, locked: !item.locked } : item) }, { label: `${layer.locked ? 'Desbloquear' : 'Bloquear'} capa ${layer.label}` })}>{layer.locked ? 'Fija' : 'Editable'}</button>
                  <button type="button" aria-label={`Bajar capa ${layer.label}`} disabled={index === 0} className="rounded border border-carbon/15 px-1 disabled:opacity-30" onClick={() => {
                    const previous = orderedLayers[index - 1];
                    onModelEdit({ ...model, layers: swapLayerOrders(model, layer.id, previous.id) }, { label: `Reordenar capa ${layer.label}` });
                  }}>↓</button>
                  <button type="button" aria-label={`Subir capa ${layer.label}`} disabled={index === orderedLayers.length - 1} className="rounded border border-carbon/15 px-1 disabled:opacity-30" onClick={() => {
                    const next = orderedLayers[index + 1];
                    onModelEdit({ ...model, layers: swapLayerOrders(model, layer.id, next.id) }, { label: `Reordenar capa ${layer.label}` });
                  }}>↑</button>
                  <button type="button" aria-label={`Eliminar capa ${layer.label}`} disabled={model.layers.length <= 1} className="ml-auto rounded px-1 text-[10px] font-bold text-granada disabled:opacity-30" onClick={() => deleteLayer(layer.id, layer.label)}>Eliminar</button>
                </div>
              </div>
            ))}
          </div>
          <button type="button" className="mt-2 w-full rounded border border-carbon/15 px-2 py-1 text-[10px] font-bold text-carbon" onClick={() => {
            let index = model.layers.length + 1;
            while (model.layers.some(item => item.id === `layer${index}`)) index += 1;
            const order = Math.max(0, ...model.layers.map(item => item.order)) + 1;
            onModelEdit({ ...model, layers: [...model.layers, { id: `layer${index}`, label: `Capa ${index}`, order, visible: true, locked: false }] }, { label: 'Añadir capa' });
          }}>+ Capa</button>
        </div>
      </details>
    </>
  );
};

export default DiagramOrganizationPanel;
