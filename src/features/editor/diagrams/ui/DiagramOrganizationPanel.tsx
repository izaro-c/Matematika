import React, { useState } from 'react';
import type { VisualDiagramModel } from '../model/types';
import { KIND_LABELS } from '../model/commands';

interface EditCommand {
  label?: string;
  mergeKey?: string;
}

interface DiagramOrganizationPanelProps {
  model: VisualDiagramModel;
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

function organizationItemPresentation(model: VisualDiagramModel, id: string): { icon: string; type: string } {
  const element = model.elements.find(item => item.id === id);
  if (element) return { icon: '◇', type: KIND_LABELS[element.kind] };
  if (model.sliders.some(item => item.id === id)) return { icon: '↔', type: 'Control deslizante' };
  return { icon: '●', type: 'Punto' };
}

export const DiagramOrganizationPanel: React.FC<DiagramOrganizationPanelProps> = ({ model, onModelEdit, onSelect, onCopyGroup }) => {
  const [section, setSection] = useState<'groups' | 'layers'>('groups');
  const items = [...model.points, ...model.elements, ...model.sliders];

  const moveObjectToLayer = (objectId: string, layerId: string) => {
    const destinationOrder = Math.max(0, ...items.filter(item => item.layerId === layerId).map(item => item.order)) + 1000;
    onModelEdit({
      ...model,
      points: model.points.map(item => item.id === objectId ? { ...item, layerId, order: destinationOrder } : item),
      elements: model.elements.map(item => item.id === objectId ? { ...item, layerId, order: destinationOrder } : item),
      sliders: model.sliders.map(item => item.id === objectId ? { ...item, layerId, order: destinationOrder } : item),
    }, { label: `Mover ${objectId} a la capa ${layerId}` });
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
    <section className="rounded border border-carbon/10 bg-lienzo" aria-labelledby="diagram-organization-title">
      <div className="border-b border-carbon/10 p-3">
        <h3 id="diagram-organization-title" className="text-[10px] font-bold uppercase tracking-widest text-carbon/50">Organización</h3>
        <p className="mt-1 text-[10px] leading-relaxed text-carbon/50">Los grupos coordinan acciones. Las capas deciden qué queda delante.</p>
        <div className="mt-2 grid grid-cols-2 rounded border border-carbon/10 bg-carbon/[0.02] p-0.5" role="tablist" aria-label="Gestión de organización">
          <button type="button" role="tab" aria-selected={section === 'groups'} onClick={() => setSection('groups')} className={`rounded px-2 py-1 text-[10px] font-bold ${section === 'groups' ? 'bg-carbon text-lienzo' : 'text-carbon/55'}`}>Grupos · {model.groups.length}</button>
          <button type="button" role="tab" aria-selected={section === 'layers'} onClick={() => setSection('layers')} className={`rounded px-2 py-1 text-[10px] font-bold ${section === 'layers' ? 'bg-carbon text-lienzo' : 'text-carbon/55'}`}>Capas · {model.layers.length}</button>
        </div>
      </div>

      {section === 'groups' && (
        <div className="space-y-2 p-3">
          {model.groups.length === 0 && <p className="rounded border border-dashed border-carbon/20 p-3 text-center text-[10px] text-carbon/50">Todavía no hay grupos. Cree uno y marque sus miembros en la misma tarjeta.</p>}
          {model.groups.map(group => (
            <article key={group.id} className="rounded border border-carbon/10 p-2">
              <div className="flex items-start gap-2">
                <button type="button" className="min-w-0 flex-1 text-left" onClick={() => onSelect?.(group.memberIds[0] ?? '')}>
                  <span className="block truncate text-xs font-bold text-carbon">{group.label}</span>
                  <span className="block font-mono text-[9px] text-carbon/45">{group.memberIds.length} objeto(s) · {group.id}</span>
                </button>
                <button type="button" disabled={group.memberIds.length === 0} className="rounded border border-carbon/15 px-1.5 py-1 text-[9px] font-bold disabled:opacity-35" onClick={() => onCopyGroup?.(group.id)}>Copiar grupo</button>
              </div>
              <div className="mt-2 flex flex-wrap gap-1">
                <button type="button" className="rounded border border-carbon/15 px-1.5 py-0.5 text-[10px]" onClick={() => onModelEdit({ ...model, groups: model.groups.map(item => item.id === group.id ? { ...item, visible: !item.visible } : item) }, { label: `${group.visible ? 'Ocultar' : 'Mostrar'} grupo ${group.label}` })}>{group.visible ? 'Visible' : 'Oculto'}</button>
                <button type="button" className="rounded border border-carbon/15 px-1.5 py-0.5 text-[10px]" onClick={() => onModelEdit({ ...model, groups: model.groups.map(item => item.id === group.id ? { ...item, locked: !item.locked } : item) }, { label: `${group.locked ? 'Desbloquear' : 'Bloquear'} grupo ${group.label}` })}>{group.locked ? 'Fijo' : 'Editable'}</button>
                <button type="button" aria-pressed={group.selection.highlightable !== false} className="rounded border border-carbon/15 px-1.5 py-0.5 text-[10px]" onClick={() => onModelEdit({ ...model, groups: model.groups.map(item => item.id === group.id ? { ...item, selection: { ...item.selection, highlightable: item.selection.highlightable === false } } : item) }, { label: `Cambiar resaltado de ${group.label}` })}>{group.selection.highlightable === false ? 'Sin resaltado' : 'Resaltable'}</button>
              </div>
              <details className="mt-2 rounded border border-carbon/10 bg-carbon/[0.02]">
                <summary className="cursor-pointer px-2 py-1.5 text-[10px] font-bold text-carbon/60">Elegir miembros <span className="float-right" aria-hidden="true">▾</span></summary>
                <div className="max-h-44 space-y-1 overflow-y-auto border-t border-carbon/10 bg-lienzo p-2">
                  {items.map(item => <div key={item.id} className="flex items-center gap-2 text-[10px] text-carbon"><label className="flex min-w-0 flex-1 items-center gap-2"><input type="checkbox" checked={group.memberIds.includes(item.id)} onChange={event => changeGroupMember(group.id, item.id, event.target.checked)} /><span className="min-w-0 truncate">{item.label} <span className="font-mono text-carbon/40">({item.id})</span></span></label><button type="button" className="rounded border border-carbon/10 px-1 text-[9px] hover:text-terracota" onClick={() => onSelect?.(item.id)}>Editar</button></div>)}
                </div>
              </details>
              <details className="mt-2">
                <summary className="cursor-pointer text-[9px] text-carbon/45">Nombre y opciones avanzadas</summary>
                <input aria-label={`Nombre del grupo ${group.id}`} className="mt-1 w-full rounded border border-carbon/15 bg-lienzo p-1.5 text-xs" value={group.label} onChange={event => onModelEdit({ ...model, groups: model.groups.map(item => item.id === group.id ? { ...item, label: event.target.value } : item) }, { label: `Renombrar grupo ${group.id}`, mergeKey: `group-label-${group.id}` })} />
                <label className="mt-2 flex items-start gap-2 text-[10px] text-carbon"><input type="checkbox" checked={group.selection.dimOthersOnHighlight !== false} onChange={() => onModelEdit({ ...model, groups: model.groups.map(item => item.id === group.id ? { ...item, selection: { ...item.selection, dimOthersOnHighlight: item.selection.dimOthersOnHighlight === false } } : item) }, { label: `Cambiar énfasis de ${group.label}` })} />Atenuar el resto al resaltarlo desde MDX</label>
                <button type="button" className="mt-2 text-[10px] font-bold text-granada hover:underline" onClick={() => deleteGroup(group.id, group.label)}>Eliminar grupo</button>
              </details>
            </article>
          ))}
          <button type="button" className="w-full rounded border border-carbon/15 px-2 py-1.5 text-[10px] font-bold text-carbon" onClick={() => {
            let index = model.groups.length + 1;
            while (model.groups.some(item => item.id === `group${index}`)) index += 1;
            onModelEdit({ ...model, groups: [...model.groups, { id: `group${index}`, label: `Grupo ${index}`, memberIds: [], visible: true, locked: false, selection: { selectable: true, role: 'secondary' } }] }, { label: 'Añadir grupo' });
          }}>+ Crear grupo</button>
        </div>
      )}

      {section === 'layers' && (
        <div className="space-y-2 p-3">
          <p className="text-[10px] leading-relaxed text-carbon/50">La flecha ↑ acerca una capa al frente; ↓ la envía hacia el fondo. Al eliminarla, sus objetos pasan a la capa más próxima.</p>
          {model.layers.slice().sort((a, b) => a.order - b.order).map((layer, index, orderedLayers) => {
            const members = items.filter(item => item.layerId === layer.id).sort((a, b) => a.order - b.order);
            const count = members.length;
            return (
              <article key={layer.id} className="rounded border border-carbon/10 p-2">
                <input aria-label={`Nombre de la capa ${layer.id}`} className="w-full rounded border border-transparent bg-transparent text-xs font-bold text-carbon hover:border-carbon/10 focus:border-carbon/20" value={layer.label} onChange={event => onModelEdit({ ...model, layers: model.layers.map(item => item.id === layer.id ? { ...item, label: event.target.value } : item) }, { label: `Renombrar capa ${layer.id}`, mergeKey: `layer-label-${layer.id}` })} />
                <p className="text-[9px] font-mono text-carbon/45">{count} objeto(s) · nivel {index + 1} de {orderedLayers.length}</p>
                <div className="mt-2 flex gap-1">
                  <button type="button" aria-label={`${layer.visible ? 'Ocultar' : 'Mostrar'} capa ${layer.label}`} className="rounded border border-carbon/15 px-1.5 py-0.5 text-[10px]" onClick={() => onModelEdit({ ...model, layers: model.layers.map(item => item.id === layer.id ? { ...item, visible: !item.visible } : item) }, { label: `${layer.visible ? 'Ocultar' : 'Mostrar'} capa ${layer.label}` })}>{layer.visible ? 'Visible' : 'Oculta'}</button>
                  <button type="button" aria-label={`${layer.locked ? 'Desbloquear' : 'Bloquear'} capa ${layer.label}`} className="rounded border border-carbon/15 px-1.5 py-0.5 text-[10px]" onClick={() => onModelEdit({ ...model, layers: model.layers.map(item => item.id === layer.id ? { ...item, locked: !item.locked } : item) }, { label: `${layer.locked ? 'Desbloquear' : 'Bloquear'} capa ${layer.label}` })}>{layer.locked ? 'Fija' : 'Editable'}</button>
                  <button type="button" aria-label={`Bajar capa ${layer.label}`} disabled={index === 0} className="rounded border border-carbon/15 px-1.5 disabled:opacity-30" onClick={() => onModelEdit({ ...model, layers: swapLayerOrders(model, layer.id, orderedLayers[index - 1].id) }, { label: `Reordenar capa ${layer.label}` })}>↓</button>
                  <button type="button" aria-label={`Subir capa ${layer.label}`} disabled={index === orderedLayers.length - 1} className="rounded border border-carbon/15 px-1.5 disabled:opacity-30" onClick={() => onModelEdit({ ...model, layers: swapLayerOrders(model, layer.id, orderedLayers[index + 1].id) }, { label: `Reordenar capa ${layer.label}` })}>↑</button>
                  <button type="button" aria-label={`Eliminar capa ${layer.label}`} disabled={model.layers.length <= 1} className="ml-auto rounded px-1 text-[10px] font-bold text-granada disabled:opacity-30" onClick={() => deleteLayer(layer.id, layer.label)}>Eliminar</button>
                </div>
                <details className="mt-2 rounded border border-carbon/10 bg-carbon/[0.02]" open={model.layers.length <= 3 ? true : undefined}>
                  <summary className="cursor-pointer px-2 py-1.5 text-[10px] font-bold text-carbon/60">Objetos de esta capa · {count} <span className="float-right" aria-hidden="true">▾</span></summary>
                  <div className="max-h-48 space-y-1 overflow-y-auto border-t border-carbon/10 bg-lienzo p-2">
                    {members.length === 0 && <p className="rounded border border-dashed border-carbon/15 p-2 text-center text-[10px] text-carbon/45">Capa vacía. Mueva aquí un objeto desde otra capa.</p>}
                    {members.map(member => {
                      const presentation = organizationItemPresentation(model, member.id);
                      return (
                      <div key={member.id} className="group/member rounded border border-carbon/10 px-2 py-1.5 hover:border-carbon/20">
                        <button type="button" className="flex w-full min-w-0 items-center gap-2 text-left" onClick={() => onSelect?.(member.id)}>
                          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded bg-carbon/5 text-[10px] text-carbon/45" aria-hidden="true">{presentation.icon}</span>
                          <span className="min-w-0">
                            <span className="block break-words text-[10px] font-bold leading-tight text-carbon">{member.label}</span>
                            <span className="mt-0.5 block break-words text-[8px] text-carbon/45"><span className="font-semibold text-pavo">{presentation.type}</span> · <span className="font-mono">{member.id}</span></span>
                          </span>
                        </button>
                        <div className="mt-1 flex justify-end border-t border-carbon/5 pt-1">
                          <label className="sr-only" htmlFor={`layer-for-${member.id}`}>Mover {member.label} a otra capa</label>
                          <select id={`layer-for-${member.id}`} aria-label={`Mover ${member.label} a otra capa`} title="Cambiar de capa" className="max-w-full rounded border border-transparent bg-transparent px-1 py-0.5 text-[8px] text-carbon/30 opacity-60 transition-all hover:border-carbon/15 hover:bg-lienzo hover:text-carbon/60 hover:opacity-100 focus:border-pavo/30 focus:text-carbon focus:opacity-100" value={layer.id} onChange={event => moveObjectToLayer(member.id, event.target.value)}>
                            {orderedLayers.map(option => <option key={option.id} value={option.id}>{option.id === layer.id ? `En ${option.label}` : `Mover a ${option.label}`}</option>)}
                          </select>
                        </div>
                      </div>
                      );
                    })}
                  </div>
                </details>
              </article>
            );
          })}
          <button type="button" className="w-full rounded border border-carbon/15 px-2 py-1.5 text-[10px] font-bold text-carbon" onClick={() => {
            let index = model.layers.length + 1;
            while (model.layers.some(item => item.id === `layer${index}`)) index += 1;
            const order = Math.max(0, ...model.layers.map(item => item.order)) + 1;
            onModelEdit({ ...model, layers: [...model.layers, { id: `layer${index}`, label: `Capa ${index}`, order, visible: true, locked: false }] }, { label: 'Añadir capa' });
          }}>+ Crear capa</button>
        </div>
      )}
    </section>
  );
};

export default DiagramOrganizationPanel;
