import React, { useState } from 'react';
import type { VisualDiagramModel } from '../model/types';
import { KIND_LABELS } from '../model';
import { listLayerSceneItemsFrontFirst } from '../model/sceneOrdering';
import { legacyElementCapabilities } from '@/shared/diagrams/public';

interface DiagramObjectListProps {
  model: VisualDiagramModel;
  selectedId: string;
  selectedIds: readonly string[];
  onSelect: (id: string) => void;
  onToggleSelection: (id: string) => void;
  onSelectMany: (ids: string[]) => void;
  onCopySelection?: () => void;
  onModelEdit?: (model: VisualDiagramModel, command?: { label?: string }) => void;
}

function sceneItemUpdateLabel(id: string, update: { visible?: boolean; locked?: boolean }): string {
  if (update.visible === undefined) return `${update.locked ? 'Bloquear' : 'Desbloquear'} ${id}`;
  return `${update.visible ? 'Mostrar' : 'Ocultar'} ${id}`;
}

function elementKindLabel(kind: VisualDiagramModel['elements'][number]['kind']): string {
  const label = KIND_LABELS[kind];
  return legacyElementCapabilities(kind).has('point') ? `Punto · ${label}` : label;
}

function EyeIcon({ visible }: { visible: boolean }) {
  return visible ? <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true"><path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z" fill="none" stroke="currentColor" strokeWidth="1.8"/><circle cx="12" cy="12" r="2.6" fill="currentColor"/></svg> : <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true"><path d="M3 4.5 21 19.5M9.6 6.4A10.5 10.5 0 0 1 12 6c6 0 9.5 6 9.5 6a14 14 0 0 1-2.2 2.8M6.3 8.1A15 15 0 0 0 2.5 12s3.5 6 9.5 6c1 0 1.9-.2 2.8-.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>;
}

function LockIcon({ locked }: { locked: boolean }) {
  return <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true"><rect x="5" y="10" width="14" height="10" rx="2" fill="none" stroke="currentColor" strokeWidth="1.8"/><path d={locked ? 'M8 10V7a4 4 0 0 1 8 0v3' : 'M9 10V7a4 4 0 0 1 7.5-2'} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>;
}

export const DiagramObjectList: React.FC<DiagramObjectListProps> = ({ model, selectedId, selectedIds, onSelect, onToggleSelection, onSelectMany, onCopySelection, onModelEdit }) => {
  const [query, setQuery] = useState('');
  const [layerId, setLayerId] = useState('');
  const items = [
    ...model.points.map(item => ({ item, kind: 'Punto' })),
    ...model.elements.map(item => ({ item, kind: elementKindLabel(item.kind) })),
    ...model.sliders.map(item => ({ item, kind: 'Control' })),
  ];
  const filteredItems = items.filter(({ item, kind }) => {
    const text = `${item.label} ${item.id} ${kind}`.toLocaleLowerCase('es');
    return (!query.trim() || text.includes(query.trim().toLocaleLowerCase('es'))) && (!layerId || item.layerId === layerId);
  });
  const filteredLayers = model.layers.slice().sort((a, b) => a.order - b.order).map(layer => {
    const orderedIds = listLayerSceneItemsFrontFirst(model, layer.id).map(entry => entry.id);
    const layerItems = orderedIds
      .map(id => filteredItems.find(({ item }) => item.id === id))
      .filter((entry): entry is typeof filteredItems[number] => Boolean(entry));
    return { layer, items: layerItems };
  }).filter(entry => entry.items.length > 0);
  const updateItem = (id: string, update: { visible?: boolean; locked?: boolean }) => {
    if (!onModelEdit) return;
    onModelEdit({
      ...model,
      points: model.points.map(item => item.id === id ? { ...item, ...update } : item),
      elements: model.elements.map(item => item.id === id ? { ...item, ...update } : item),
      sliders: model.sliders.map(item => item.id === id ? { ...item, ...update } : item),
    }, { label: sceneItemUpdateLabel(id, update) });
  };
  const selectedSet = new Set(selectedIds);

  return (
    <section>
      <div className="mb-2 flex items-center justify-between border-b border-carbon/10 pb-1">
        <p className="text-[10px] font-bold uppercase tracking-widest text-carbon/45">Inventario</p>
        <span className="font-mono text-[9px] text-carbon/40">{items.length}</span>
      </div>
      <div className="mb-2 flex min-h-11 items-center gap-2 border-b border-carbon/10 pb-2">
        <span className="min-w-0 flex-1 text-[10px] font-bold text-carbon/60">{selectedIds.length === 0 ? 'Sin selección' : `${selectedIds.length} seleccionado${selectedIds.length === 1 ? '' : 's'}`}</span>
        <button type="button" disabled={filteredItems.length === 0} className="rounded px-2 py-1 text-[10px] font-bold text-carbon/60 hover:bg-carbon/5 disabled:opacity-35" onClick={() => onSelectMany(filteredItems.map(entry => entry.item.id))}>Todos</button>
        <button type="button" disabled={selectedIds.length === 0} className="rounded px-2 py-1 text-[10px] font-bold text-carbon/60 hover:bg-carbon/5 disabled:opacity-35" onClick={() => onSelectMany([])}>Limpiar</button>
        <button type="button" aria-label="Copiar objetos seleccionados" disabled={selectedIds.length === 0 || !onCopySelection} className="rounded bg-carbon px-2 py-1 text-[10px] font-bold text-lienzo disabled:opacity-35" onClick={onCopySelection}>Copiar</button>
      </div>
      <div className="mb-2 grid grid-cols-[minmax(0,1fr)_7rem] gap-1">
        <input type="search" aria-label="Buscar objetos" placeholder="Buscar por nombre, ID o tipo…" className="min-w-0 rounded border border-carbon/15 bg-lienzo p-1.5 text-[10px]" value={query} onChange={event => setQuery(event.target.value)} />
        <select aria-label="Filtrar objetos por capa" className="rounded border border-carbon/15 bg-lienzo p-1 text-[10px]" value={layerId} onChange={event => setLayerId(event.target.value)}><option value="">Todas las capas</option>{model.layers.slice().sort((a, b) => a.order - b.order).map(layer => <option key={layer.id} value={layer.id}>{layer.label}</option>)}</select>
      </div>
      <p className="mb-2 text-[9px] leading-relaxed text-carbon/40">Lista de referencia. Para cambiar el orden o las capas, use la pestaña Organizar.</p>
      <div className="max-h-[60vh] space-y-2 overflow-y-auto pr-1" role="tree" aria-label="Árbol de escena por capas">
        {filteredLayers.map(({ layer, items: layerItems }) => <section key={layer.id} role="group" aria-label={layer.label}>
          <div className="sticky top-0 z-10 flex min-h-8 items-center justify-between bg-lienzo px-1 text-xs font-bold text-carbon/60"><span>{layer.label}</span><span className="font-mono text-carbon/40">{layerItems.length}</span></div>
          <div className="space-y-1">{layerItems.map(({ item, kind }) => (
            <div key={item.id} role="treeitem" aria-selected={selectedSet.has(item.id)} className={`grid grid-cols-[2.75rem_minmax(0,1fr)_2.75rem_2.75rem] items-stretch overflow-hidden rounded border ${selectedId === item.id ? 'border-carbon bg-carbon text-lienzo' : selectedSet.has(item.id) ? 'border-pavo/45 bg-pavo/10 text-carbon' : 'border-carbon/10 text-carbon hover:bg-carbon/5'}`}>
              <label className="flex min-h-11 items-center justify-center border-r border-current/15" title={`Incluir ${item.label} en la selección múltiple`}>
                <input type="checkbox" aria-label={`Seleccionar ${item.label}`} checked={selectedSet.has(item.id)} onChange={() => onToggleSelection(item.id)} className="h-4 w-4 accent-pavo" />
              </label>
              <button type="button" onClick={() => onSelect(item.id)} className="min-h-11 min-w-0 px-2 py-1.5 text-left">
                <span className="block truncate text-sm font-bold">{item.label}</span>
                <span className={`block truncate text-xs ${selectedId === item.id ? 'text-lienzo/70' : 'text-carbon/50'}`}>{kind} · {item.id}{item.groupIds.length ? ` · ${item.groupIds.length} grupo(s)` : ''}</span>
              </button>
              <button type="button" disabled={!onModelEdit} aria-label={`${item.visible ? 'Ocultar' : 'Mostrar'} ${item.label}`} aria-pressed={item.visible} title={item.visible ? 'Visible: pulsar para ocultar' : 'Oculto: pulsar para mostrar'} onClick={() => updateItem(item.id, { visible: !item.visible })} className="flex min-h-11 items-center justify-center border-l border-current/15 disabled:opacity-40"><EyeIcon visible={item.visible} /></button>
              <button type="button" disabled={!onModelEdit} aria-label={`${item.locked ? 'Desbloquear' : 'Bloquear'} ${item.label}`} aria-pressed={item.locked} title={item.locked ? 'Bloqueado: pulsar para editar' : 'Editable: pulsar para bloquear'} onClick={() => updateItem(item.id, { locked: !item.locked })} className="flex min-h-11 items-center justify-center border-l border-current/15 disabled:opacity-40"><LockIcon locked={item.locked} /></button>
            </div>
          ))}</div>
        </section>)}
        {filteredItems.length === 0 && <p className="rounded border border-dashed border-carbon/15 p-3 text-center text-[10px] text-carbon/45">No hay objetos que coincidan con estos filtros.</p>}
      </div>
      <p className="mt-2 text-[9px] leading-relaxed text-carbon/40">Casilla: selección múltiple · ojo: mostrar u ocultar · candado: permitir o impedir cambios.</p>
    </section>
  );
};

export default DiagramObjectList;
