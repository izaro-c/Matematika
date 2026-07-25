import React, { useEffect, useRef, useState } from 'react';
import type { VisualDiagramModel } from '../model/types';
import { KIND_LABELS } from '../model';
import { listLayerSceneItemsFrontFirst } from '../model/sceneOrdering';
import { legacyElementCapabilities } from '@/shared/diagrams/public';
import { ObjectListItem } from './scene/ObjectListItem';
import { ObjectListBatchToolbar } from './scene/ObjectListBatchToolbar';

interface DiagramObjectListProps {
  model: VisualDiagramModel;
  selectedId: string;
  selectedIds: readonly string[];
  onSelect: (id: string) => void;
  onToggleSelection: (id: string) => void;
  onSelectMany: (ids: string[]) => void;
  onCopySelection?: () => void;
  onModelEdit?: (model: VisualDiagramModel, command?: { label?: string }) => void;
  errorObjectIds?: ReadonlySet<string>;
  focusObjectId?: string;
}

function sceneItemUpdateLabel(id: string, update: { visible?: boolean; locked?: boolean }): string {
  if (update.visible === undefined) return `${update.locked ? 'Bloquear' : 'Desbloquear'} ${id}`;
  return `${update.visible ? 'Mostrar' : 'Ocultar'} ${id}`;
}

function elementKindLabel(kind: VisualDiagramModel['elements'][number]['kind']): string {
  const label = KIND_LABELS[kind];
  return legacyElementCapabilities(kind).has('point') ? `Punto · ${label}` : label;
}

type CategoryFilter = 'all' | 'points' | 'lines' | 'angles' | 'areas' | 'sliders';

export const DiagramObjectList: React.FC<DiagramObjectListProps> = ({
  model,
  selectedId,
  selectedIds,
  onSelect,
  onToggleSelection,
  onSelectMany,
  onCopySelection,
  onModelEdit,
  errorObjectIds,
  focusObjectId,
}) => {
  const [query, setQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('all');
  const [layerId, setLayerId] = useState('');
  const listRef = useRef<HTMLDivElement>(null);

  const items = [
    ...model.points.map(item => ({ item, kindName: 'Punto', category: 'points' as const })),
    ...model.elements.map(item => {
      let category: CategoryFilter = 'lines';
      if (item.kind === 'angle' || item.kind === 'nonReflexAngle' || item.kind === 'rightAngle') {
        category = 'angles';
      } else if (item.kind === 'halfPlane' || item.kind === 'polygon' || item.kind === 'circle' || item.kind === 'areaIntersection' || item.kind === 'areaDecomposition') {
        category = 'areas';
      }
      return { item, kindName: elementKindLabel(item.kind), category };
    }),
    ...model.sliders.map(item => ({ item, kindName: 'Control', category: 'sliders' as const })),
  ];

  const filteredItems = items.filter(({ item, kindName, category }) => {
    const text = `${item.label} ${item.id} ${kindName}`.toLocaleLowerCase('es');
    const matchesQuery = !query.trim() || text.includes(query.trim().toLocaleLowerCase('es'));
    const matchesLayer = !layerId || item.layerId === layerId;
    const matchesCategory = categoryFilter === 'all' || category === categoryFilter;
    return matchesQuery && matchesLayer && matchesCategory;
  });

  const filteredLayers = model.layers
    .slice()
    .sort((a, b) => a.order - b.order)
    .map(layer => {
      const orderedIds = listLayerSceneItemsFrontFirst(model, layer.id).map(entry => entry.id);
      const layerItems = orderedIds
        .map(id => filteredItems.find(({ item }) => item.id === id))
        .filter((entry): entry is typeof filteredItems[number] => Boolean(entry));
      return { layer, items: layerItems };
    })
    .filter(entry => entry.items.length > 0);

  const updateItem = (id: string, update: { visible?: boolean; locked?: boolean }) => {
    if (!onModelEdit) return;
    onModelEdit(
      {
        ...model,
        points: model.points.map(item => (item.id === id ? { ...item, ...update } : item)),
        elements: model.elements.map(item => (item.id === id ? { ...item, ...update } : item)),
        sliders: model.sliders.map(item => (item.id === id ? { ...item, ...update } : item)),
      },
      { label: sceneItemUpdateLabel(id, update) },
    );
  };

  const selectedSet = new Set(selectedIds);

  useEffect(() => {
    if (!focusObjectId || !listRef.current) return;
    const frame = window.requestAnimationFrame(() => {
      const row = listRef.current?.querySelector(`[data-object-id="${focusObjectId}"]`);
      if (row && 'scrollIntoView' in row && typeof row.scrollIntoView === 'function') {
        row.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    });
    return () => window.cancelAnimationFrame(frame);
  }, [focusObjectId]);

  return (
    <section className="space-y-2">
      <div className="flex items-center justify-between border-b border-carbon/10 pb-1">
        <p className="ac-label ac-label--sm ac-label--soft">Inventario de Objetos</p>
        <span className="font-mono text-[9px] text-carbon/40">{items.length}</span>
      </div>

      {onModelEdit && (
        <ObjectListBatchToolbar
          model={model}
          selectedIds={selectedIds}
          onModelEdit={onModelEdit}
          onClearSelection={() => onSelectMany([])}
        />
      )}

      <div className="flex min-h-10 items-center gap-2 border-b border-carbon/10 pb-2">
        <span className="min-w-0 flex-1 text-[10px] font-bold text-carbon/60">
          {selectedIds.length === 0 ? 'Sin selección' : `${selectedIds.length} seleccionado${selectedIds.length === 1 ? '' : 's'}`}
        </span>
        <button
          type="button"
          disabled={filteredItems.length === 0}
          className="rounded px-2 py-1 text-[10px] font-bold text-carbon/60 hover:bg-carbon/5 disabled:opacity-35 transition-colors"
          onClick={() => onSelectMany(filteredItems.map(entry => entry.item.id))}
        >
          Todos
        </button>
        <button
          type="button"
          disabled={selectedIds.length === 0}
          className="rounded px-2 py-1 text-[10px] font-bold text-carbon/60 hover:bg-carbon/5 disabled:opacity-35 transition-colors"
          onClick={() => onSelectMany([])}
        >
          Limpiar
        </button>
        <button
          type="button"
          aria-label="Copiar objetos seleccionados"
          disabled={selectedIds.length === 0 || !onCopySelection}
          className="rounded bg-carbon px-2.5 py-1 text-[10px] font-bold text-lienzo disabled:opacity-35 shadow-xs hover:bg-carbon/90 transition-all"
          onClick={onCopySelection}
        >
          Copiar
        </button>
      </div>

      {/* Category Chips */}
      <div className="flex flex-wrap gap-1 overflow-x-auto pb-1" aria-label="Filtrar por categoría">
        {(
          [
            ['all', 'Todos'],
            ['points', 'Puntos'],
            ['lines', 'Líneas'],
            ['angles', 'Ángulos'],
            ['areas', 'Áreas'],
            ['sliders', 'Controles'],
          ] as const
        ).map(([cat, label]) => (
          <button
            key={cat}
            type="button"
            onClick={() => setCategoryFilter(cat)}
            className={`rounded-full px-2 py-0.5 text-[9px] font-bold transition-all ${
              categoryFilter === cat
                ? 'bg-carbon text-lienzo shadow-xs'
                : 'border border-carbon/15 bg-lienzo text-carbon/60 hover:bg-carbon/5'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-[minmax(0,1fr)_7.5rem] gap-1.5">
        <input
          type="search"
          aria-label="Buscar objetos"
          placeholder="Buscar por nombre, ID o tipo…"
          className="min-w-0 rounded-md border border-carbon/15 bg-lienzo p-1.5 text-[10px]"
          value={query}
          onChange={event => setQuery(event.target.value)}
        />
        <select
          aria-label="Filtrar objetos por capa"
          className="rounded-md border border-carbon/15 bg-lienzo p-1 text-[10px]"
          value={layerId}
          onChange={event => setLayerId(event.target.value)}
        >
          <option value="">Todas las capas</option>
          {model.layers
            .slice()
            .sort((a, b) => a.order - b.order)
            .map(layer => (
              <option key={layer.id} value={layer.id}>
                {layer.label}
              </option>
            ))}
        </select>
      </div>

      <div ref={listRef} className="max-h-[55vh] space-y-2 overflow-y-auto pr-1 overscroll-contain scrollbar-gutter-stable" role="tree" aria-label="Árbol de escena por capas">
        {filteredLayers.map(({ layer, items: layerItems }) => (
          <section key={layer.id} role="group" aria-label={layer.label}>
            <div className="sticky top-0 z-10 flex min-h-7 items-center justify-between bg-lienzo px-1 text-xs font-bold text-carbon/60">
              <span>{layer.label}</span>
              <span className="font-mono text-carbon/40">{layerItems.length}</span>
            </div>
            <div className="space-y-1">
              {layerItems.map(({ item, kindName }) => (
                <ObjectListItem
                  key={item.id}
                  id={item.id}
                  label={item.label}
                  kind={kindName}
                  groupIdsCount={item.groupIds.length}
                  visible={item.visible}
                  locked={item.locked}
                  isSelected={selectedId === item.id}
                  isMultiSelected={selectedSet.has(item.id)}
                  hasError={Boolean(errorObjectIds?.has(item.id))}
                  canEdit={Boolean(onModelEdit)}
                  onSelect={onSelect}
                  onToggleSelection={onToggleSelection}
                  onToggleVisible={(id, cur) => updateItem(id, { visible: !cur })}
                  onToggleLocked={(id, cur) => updateItem(id, { locked: !cur })}
                />
              ))}
            </div>
          </section>
        ))}
        {filteredItems.length === 0 && (
          <p className="rounded-lg border border-dashed border-carbon/15 p-3 text-center text-[10px] text-carbon/45">
            No hay objetos que coincidan con estos filtros.
          </p>
        )}
      </div>
    </section>
  );
};

export default DiagramObjectList;
