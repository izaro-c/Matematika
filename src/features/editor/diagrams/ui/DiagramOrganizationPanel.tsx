import React, { useMemo, useState } from 'react';
import type { VisualDiagramModel } from '../model/types';
import { KIND_LABELS } from '../model';
import {
  bringSceneItemForward,
  moveSceneItemToLayer,
  sendSceneItemBackward,
} from '../model/sceneOrdering';
import { SceneStackEditor } from './SceneStackEditor';

interface EditCommand {
  label?: string;
  mergeKey?: string;
}

interface DiagramOrganizationPanelProps {
  model: VisualDiagramModel;
  selectedId?: string;
  onModelEdit: (model: VisualDiagramModel, command?: EditCommand) => void;
  onSelect?: (id: string) => void;
  onCopyGroup?: (groupId: string) => void;
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

function organizationItemSubtitle(model: VisualDiagramModel, id: string): string {
  const element = model.elements.find(item => item.id === id);
  if (element) return `${KIND_LABELS[element.kind]} · ${id}`;
  if (model.sliders.some(item => item.id === id)) return `Control · ${id}`;
  return `Punto · ${id}`;
}

const layerActionClass = 'rounded border border-carbon/15 px-1.5 py-0.5 text-[9px] font-bold text-carbon/70 hover:bg-carbon/5 disabled:opacity-30';

export const DiagramOrganizationPanel: React.FC<DiagramOrganizationPanelProps> = ({ model, selectedId = '', onModelEdit, onSelect, onCopyGroup }) => {
  const [section, setSection] = useState<'groups' | 'layers'>('layers');
  const items = [...model.points, ...model.elements, ...model.sliders];
  const orderedLayers = model.layers.slice().sort((a, b) => b.order - a.order);

  const stackEntries = useMemo(() => items.map(item => ({
    id: item.id,
    label: item.label,
    subtitle: organizationItemSubtitle(model, item.id),
    layerId: item.layerId,
  })), [items, model]);

  const moveObjectToLayer = (objectId: string, layerId: string) => {
    onModelEdit(moveSceneItemToLayer(model, objectId, layerId), { label: `Mover ${objectId} a la capa ${layerId}`, mergeKey: 'scene-stack' });
  };

  const changeGroupMember = (groupId: string, objectId: string, checked: boolean) => onModelEdit({
    ...model,
    groups: model.groups.map(group => group.id === groupId
      ? { ...group, memberIds: checked ? [...new Set([...group.memberIds, objectId])] : group.memberIds.filter(id => id !== objectId) }
      : group),
    points: model.points.map(item => item.id === objectId ? { ...item, groupIds: checked ? [...new Set([...item.groupIds, groupId])] : item.groupIds.filter(id => id !== groupId) } : item),
    elements: model.elements.map(item => item.id === objectId ? { ...item, groupIds: checked ? [...new Set([...item.groupIds, groupId])] : item.groupIds.filter(id => id !== groupId) } : item),
    sliders: model.sliders.map(item => item.id === objectId ? { ...item, groupIds: checked ? [...new Set([...item.groupIds, groupId])] : item.groupIds.filter(id => id !== groupId) } : item),
  }, { label: `${checked ? 'Añadir a' : 'Quitar de'} grupo ${groupId}` });

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
    <section>
      <div className="mb-2 flex items-center justify-between border-b border-carbon/10 pb-1">
        <p className="ac-label ac-label--sm ac-label--soft">Organización</p>
      </div>
      <div className="mb-2 grid grid-cols-2 gap-1 rounded border border-carbon/10 bg-carbon/[0.02] p-0.5" role="tablist" aria-label="Gestión de organización">
        {([
          ['layers', `Capas · ${model.layers.length}`],
          ['groups', `Grupos · ${model.groups.length}`],
        ] as const).map(([id, label]) => (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={section === id}
            className={`min-h-9 rounded px-2 text-[10px] font-bold ${section === id ? 'bg-carbon text-lienzo' : 'text-carbon/55 hover:bg-carbon/5'}`}
            onClick={() => setSection(id)}
          >
            {label}
          </button>
        ))}
      </div>

      {section === 'layers' && (
        <div className="space-y-2">
          <p className="text-[9px] leading-relaxed text-carbon/45">
            Arrastre cada fila para reordenar. Arriba queda delante en el lienzo; abajo, detrás. Las capas más arriba en esta lista también quedan delante.
          </p>
          <div className="max-h-[58vh] overflow-y-auto pr-1">
            <SceneStackEditor
              model={model}
              entries={stackEntries}
              selectedId={selectedId}
              onSelect={onSelect}
              onModelEdit={onModelEdit}
              onLayerLabelChange={(layerId, label) => onModelEdit({ ...model, layers: model.layers.map(item => item.id === layerId ? { ...item, label } : item) }, { label: `Renombrar capa ${layerId}`, mergeKey: `layer-label-${layerId}` })}
              renderLayerActions={(layer, index, layerCount) => (
                <>
                  <button type="button" className={layerActionClass} onClick={() => onModelEdit({ ...model, layers: model.layers.map(item => item.id === layer.id ? { ...item, visible: !item.visible } : item) }, { label: `${layer.visible ? 'Ocultar' : 'Mostrar'} capa ${layer.label}` })}>{layer.visible ? 'Visible' : 'Oculta'}</button>
                  <button type="button" className={layerActionClass} onClick={() => onModelEdit({ ...model, layers: model.layers.map(item => item.id === layer.id ? { ...item, locked: !item.locked } : item) }, { label: `${layer.locked ? 'Desbloquear' : 'Bloquear'} capa ${layer.label}` })}>{layer.locked ? 'Fija' : 'Editable'}</button>
                  <button type="button" disabled={index === 0} className={layerActionClass} onClick={() => onModelEdit({ ...model, layers: swapLayerOrders(model, layer.id, orderedLayers[index - 1].id) }, { label: `Reordenar capa ${layer.label}`, mergeKey: 'scene-stack' })}>↑</button>
                  <button type="button" disabled={index === layerCount - 1} className={layerActionClass} onClick={() => onModelEdit({ ...model, layers: swapLayerOrders(model, layer.id, orderedLayers[index + 1].id) }, { label: `Reordenar capa ${layer.label}`, mergeKey: 'scene-stack' })}>↓</button>
                  <button type="button" disabled={model.layers.length <= 1} className={`${layerActionClass} !border-transparent text-granada hover:bg-granada/5`} onClick={() => deleteLayer(layer.id, layer.label)}>Eliminar</button>
                </>
              )}
              renderEntryActions={entry => (
                <div className="flex items-center gap-0.5">
                  <button type="button" aria-label={`Traer ${entry.label} adelante`} className="flex h-8 w-7 items-center justify-center text-carbon/50 hover:text-carbon" onClick={() => onModelEdit(bringSceneItemForward(model, entry.id), { label: `Traer ${entry.id} adelante`, mergeKey: 'scene-stack' })}>↑</button>
                  <button type="button" aria-label={`Enviar ${entry.label} atrás`} className="flex h-8 w-7 items-center justify-center text-carbon/50 hover:text-carbon" onClick={() => onModelEdit(sendSceneItemBackward(model, entry.id), { label: `Enviar ${entry.id} atrás`, mergeKey: 'scene-stack' })}>↓</button>
                  <select
                    aria-label={`Mover ${entry.label} a otra capa`}
                    className="max-w-[5.5rem] rounded border border-carbon/15 bg-lienzo px-1 py-0.5 text-[9px] text-carbon"
                    value={entry.layerId}
                    onChange={event => moveObjectToLayer(entry.id, event.target.value)}
                  >
                    {orderedLayers.slice().sort((a, b) => a.order - b.order).map(option => <option key={option.id} value={option.id}>{option.label}</option>)}
                  </select>
                </div>
              )}
            />
          </div>
          <button
            type="button"
            className="min-h-10 w-full rounded border border-carbon/15 text-[10px] font-bold text-carbon/70 hover:bg-carbon/5"
            onClick={() => {
              let index = model.layers.length + 1;
              while (model.layers.some(item => item.id === `layer${index}`)) index += 1;
              const order = Math.max(0, ...model.layers.map(item => item.order)) + 1;
              onModelEdit({ ...model, layers: [...model.layers, { id: `layer${index}`, label: `Capa ${index}`, order, visible: true, locked: false }] }, { label: 'Añadir capa' });
            }}
          >
            + Crear capa
          </button>
        </div>
      )}

      {section === 'groups' && (
        <div className="space-y-2">
          {model.groups.length === 0 && <p className="rounded border border-dashed border-carbon/15 p-3 text-center text-[10px] text-carbon/45">Sin grupos. Cree uno para coordinar visibilidad y resaltado conjunto.</p>}
          {model.groups.map(group => (
            <article key={group.id} className="rounded border border-carbon/10 p-2">
              <div className="flex items-start gap-2">
                <button type="button" className="min-w-0 flex-1 text-left" onClick={() => onSelect?.(group.memberIds[0] ?? '')}>
                  <span className="block truncate text-xs font-bold text-carbon">{group.label}</span>
                  <span className="block font-mono text-[9px] text-carbon/45">{group.memberIds.length} objeto(s)</span>
                </button>
                <button type="button" className="rounded border border-carbon/15 px-1.5 py-1 text-[9px] font-bold text-carbon/70 hover:bg-carbon/5 disabled:opacity-35" disabled={group.memberIds.length === 0} onClick={() => onCopyGroup?.(group.id)}>Copiar</button>
              </div>
              <div className="mt-2 flex flex-wrap gap-1">
                <button type="button" className={layerActionClass} onClick={() => onModelEdit({ ...model, groups: model.groups.map(item => item.id === group.id ? { ...item, visible: !item.visible } : item) }, { label: `${group.visible ? 'Ocultar' : 'Mostrar'} grupo ${group.label}` })}>{group.visible ? 'Visible' : 'Oculto'}</button>
                <button type="button" className={layerActionClass} onClick={() => onModelEdit({ ...model, groups: model.groups.map(item => item.id === group.id ? { ...item, locked: !item.locked } : item) }, { label: `${group.locked ? 'Desbloquear' : 'Bloquear'} grupo ${group.label}` })}>{group.locked ? 'Fijo' : 'Editable'}</button>
              </div>
              <div className="mt-2 max-h-40 space-y-1 overflow-y-auto rounded border border-carbon/10 bg-carbon/[0.02] p-1">
                {items.map(item => (
                  <label key={item.id} className="flex items-center gap-2 rounded px-1 py-1 text-[10px] text-carbon hover:bg-carbon/5">
                    <input type="checkbox" checked={group.memberIds.includes(item.id)} onChange={event => changeGroupMember(group.id, item.id, event.target.checked)} />
                    <span className="min-w-0 truncate">{item.label}</span>
                    <button type="button" className="ml-auto text-[9px] text-carbon/45 hover:text-carbon" onClick={() => onSelect?.(item.id)}>Editar</button>
                  </label>
                ))}
              </div>
              <div className="mt-2 space-y-1 border-t border-carbon/10 pt-2">
                <input aria-label={`Nombre del grupo ${group.id}`} value={group.label} onChange={event => onModelEdit({ ...model, groups: model.groups.map(item => item.id === group.id ? { ...item, label: event.target.value } : item) }, { label: `Renombrar grupo ${group.id}`, mergeKey: `group-label-${group.id}` })} className="w-full rounded border border-carbon/15 bg-lienzo px-2 py-1 text-xs" />
                <button type="button" className="text-[10px] font-bold text-granada hover:underline" onClick={() => deleteGroup(group.id, group.label)}>Eliminar grupo</button>
              </div>
            </article>
          ))}
          <button
            type="button"
            className="min-h-10 w-full rounded border border-carbon/15 text-[10px] font-bold text-carbon/70 hover:bg-carbon/5"
            onClick={() => {
              let index = model.groups.length + 1;
              while (model.groups.some(item => item.id === `group${index}`)) index += 1;
              onModelEdit({ ...model, groups: [...model.groups, { id: `group${index}`, label: `Grupo ${index}`, memberIds: [], visible: true, locked: false, selection: { selectable: true, role: 'secondary' } }] }, { label: 'Añadir grupo' });
            }}
          >
            + Crear grupo
          </button>
        </div>
      )}
    </section>
  );
};

export default DiagramOrganizationPanel;
