import React, { useState } from 'react';
import type { VisualDiagramModel } from '../../diagrams/model/types';
import type { DiagramLayer, DiagramGroup } from '@/shared/diagrams/spec';
import {
  bringSceneItemForward,
  listLayerSceneItemsFrontFirst,
  moveSceneItemToLayer,
  moveSceneItemVisual,
  sendSceneItemBackward,
} from '../../diagrams/model/sceneOrdering';
import { IconEye, IconEyeOff, IconLock, IconUnlock, IconPlus, IconTrash, IconChevronUp, IconChevronDown } from './V2Icons';

interface V2GroupsAndLayersManagerProps {
  model: VisualDiagramModel | null;
  onUpdateModel: (nextModel: VisualDiagramModel, label: string) => void;
}

const DEFAULT_LAYERS: DiagramLayer[] = [
  { id: 'background', label: 'Fondo', order: 0, visible: true, locked: false },
  { id: 'geometry', label: 'Geometría Principal', order: 10, visible: true, locked: false },
  { id: 'annotations', label: 'Anotaciones & Texto', order: 20, visible: true, locked: false },
  { id: 'controls', label: 'Controles & Deslizadores', order: 30, visible: true, locked: false },
];

function generateShortId(prefix: string): string {
  return `${prefix}_${Date.now().toString(36).slice(-4)}`;
}

function ensureSceneStack(model: VisualDiagramModel, layersFallback: DiagramLayer[]): VisualDiagramModel {
  const existing = model.layers?.length ? model.layers : [];
  const existingIds = new Set(existing.map(layer => layer.id));
  const layers = [
    ...existing,
    ...layersFallback.filter(layer => !existingIds.has(layer.id)),
  ];
  if (layers.length === 0) {
    layers.push(...layersFallback);
  }
  const layerIds = new Set(layers.map(layer => layer.id));
  const fallbackLayer = layers.find(layer => layer.id === 'geometry')?.id
    ?? layers[0]?.id
    ?? 'geometry';

  return {
    ...model,
    layers,
    points: model.points.map(point => ({
      ...point,
      layerId: point.layerId && layerIds.has(point.layerId) ? point.layerId : fallbackLayer,
      order: Number.isFinite(point.order) ? point.order : 0,
    })),
    elements: model.elements.map(element => ({
      ...element,
      layerId: element.layerId && layerIds.has(element.layerId) ? element.layerId : fallbackLayer,
      order: Number.isFinite(element.order) ? element.order : 0,
    })),
    sliders: model.sliders.map(slider => ({
      ...slider,
      layerId: slider.layerId && layerIds.has(slider.layerId)
        ? slider.layerId
        : (layers.find(layer => layer.id === 'controls')?.id ?? fallbackLayer),
      order: Number.isFinite(slider.order) ? slider.order : 0,
    })),
  };
}

function ensureLayerExists(model: VisualDiagramModel, layerId: string, layersFallback: DiagramLayer[]): VisualDiagramModel {
  if (model.layers.some(layer => layer.id === layerId)) return model;
  const fromDefaults = layersFallback.find(layer => layer.id === layerId);
  const nextLayer: DiagramLayer = fromDefaults ?? {
    id: layerId,
    label: layerId,
    order: (Math.max(0, ...model.layers.map(layer => layer.order)) + 10),
    visible: true,
    locked: false,
  };
  return { ...model, layers: [...model.layers, nextLayer] };
}

export const V2GroupsAndLayersManager: React.FC<V2GroupsAndLayersManagerProps> = ({
  model,
  onUpdateModel,
}) => {
  const [activeTab, setActiveTab] = useState<'layers' | 'groups'>('layers');
  const [newGroupLabel, setNewGroupLabel] = useState('');
  const [newLayerLabel, setNewLayerLabel] = useState('');
  const [expandedLayerId, setExpandedLayerId] = useState<string | null>(null);
  const [expandedGroupId, setExpandedGroupId] = useState<string | null>(null);
  const [draggingItemId, setDraggingItemId] = useState<string | null>(null);
  const [dropTargetLayerId, setDropTargetLayerId] = useState<string | null>(null);
  const [dropInsertBeforeId, setDropInsertBeforeId] = useState<string | null>(null);

  if (!model) return null;

  const stacked = ensureSceneStack(model, DEFAULT_LAYERS);
  const layers = stacked.layers.slice().sort((a, b) => a.order - b.order);
  const groups: DiagramGroup[] = model.groups || [];

  const allItems = [
    ...stacked.points.map(p => ({ id: p.id, label: p.label || p.id, kind: 'point', layerId: p.layerId, order: p.order })),
    ...stacked.elements.map(e => ({ id: e.id, label: e.label || e.id, kind: e.kind, layerId: e.layerId, order: e.order })),
    ...stacked.sliders.map(s => ({ id: s.id, label: s.label || s.id, kind: 'slider', layerId: s.layerId, order: s.order })),
  ];

  const commit = (next: VisualDiagramModel, label: string) => {
    onUpdateModel(ensureSceneStack(next, DEFAULT_LAYERS), label);
  };

  // --- Capas ---
  const handleToggleLayerVisible = (layerId: string) => {
    commit({
      ...stacked,
      layers: stacked.layers.map(l => (l.id === layerId ? { ...l, visible: !l.visible } : l)),
    }, `Alternar visibilidad de capa ${layerId}`);
  };

  const handleToggleLayerLock = (layerId: string) => {
    commit({
      ...stacked,
      layers: stacked.layers.map(l => (l.id === layerId ? { ...l, locked: !l.locked } : l)),
    }, `Alternar bloqueo de capa ${layerId}`);
  };

  const handleRenameLayerId = (oldId: string, candidateNewId: string) => {
    const newId = candidateNewId.trim();
    if (!newId || newId === oldId) return;
    if (stacked.layers.some(l => l.id === newId)) return;

    const nextLayers = stacked.layers.map(l => (l.id === oldId ? { ...l, id: newId } : l));
    commit({
      ...stacked,
      layers: nextLayers,
      points: stacked.points.map(p => (p.layerId === oldId ? { ...p, layerId: newId } : p)),
      elements: stacked.elements.map(e => (e.layerId === oldId ? { ...e, layerId: newId } : e)),
      sliders: stacked.sliders.map(s => (s.layerId === oldId ? { ...s, layerId: newId } : s)),
    }, `Renombrar ID de capa ${oldId} a ${newId}`);
  };

  const handleRenameLayerLabel = (layerId: string, newLabel: string) => {
    commit({
      ...stacked,
      layers: stacked.layers.map(l => (l.id === layerId ? { ...l, label: newLabel } : l)),
    }, `Renombrar capa ${layerId}`);
  };

  const handleAddLayer = () => {
    if (!newLayerLabel.trim()) return;
    const id = generateShortId('layer');
    const newLayer: DiagramLayer = {
      id,
      label: newLayerLabel.trim(),
      order: (Math.max(0, ...stacked.layers.map(l => l.order)) + 10),
      visible: true,
      locked: false,
    };
    commit({ ...stacked, layers: [...stacked.layers, newLayer] }, `Añadir capa ${newLayerLabel}`);
    setNewLayerLabel('');
    setExpandedLayerId(id);
  };

  const handleDeleteLayer = (layerId: string) => {
    if (allItems.some(item => item.layerId === layerId)) return;
    if (stacked.layers.length <= 1) return;
    commit({
      ...stacked,
      layers: stacked.layers.filter(layer => layer.id !== layerId),
    }, `Eliminar capa vacía ${layerId}`);
  };

  const handleMoveItemToLayer = (itemId: string, newLayerId: string) => {
    const withLayer = ensureLayerExists(stacked, newLayerId, DEFAULT_LAYERS);
    commit(moveSceneItemToLayer(withLayer, itemId, newLayerId), `Mover ${itemId} a capa ${newLayerId}`);
    setExpandedLayerId(newLayerId);
  };

  const handleReorderBefore = (draggedId: string, targetId: string, layerId: string) => {
    const withLayer = ensureLayerExists(stacked, layerId, DEFAULT_LAYERS);
    const frontFirst = listLayerSceneItemsFrontFirst(withLayer, layerId).filter(item => item.id !== draggedId);
    const targetIndex = frontFirst.findIndex(item => item.id === targetId);
    const visualIndex = targetIndex < 0 ? frontFirst.length : targetIndex;
    commit(
      moveSceneItemVisual(withLayer, draggedId, layerId, visualIndex),
      `Reordenar ${draggedId} en capa ${layerId}`,
    );
  };

  const handleBringForward = (itemId: string) => {
    commit(bringSceneItemForward(stacked, itemId), `Traer adelante ${itemId}`);
  };

  const handleSendBackward = (itemId: string) => {
    commit(sendSceneItemBackward(stacked, itemId), `Enviar atrás ${itemId}`);
  };

  const clearDrag = () => {
    setDraggingItemId(null);
    setDropTargetLayerId(null);
    setDropInsertBeforeId(null);
  };

  const handleAddGroup = () => {
    if (!newGroupLabel.trim()) return;
    const id = generateShortId('grp');
    const newGroup: DiagramGroup = {
      id,
      label: newGroupLabel.trim(),
      memberIds: [],
      visible: true,
      locked: false,
      selection: { selectable: true, role: 'primary' },
    };
    onUpdateModel({ ...model, groups: [...groups, newGroup] }, `Añadir grupo ${newGroupLabel}`);
    setNewGroupLabel('');
  };

  const handleRenameGroupId = (oldId: string, candidateNewId: string) => {
    const newId = candidateNewId.trim();
    if (!newId || newId === oldId) return;
    if (groups.some(g => g.id === newId)) return;

    const nextGroups = groups.map(g => (g.id === oldId ? { ...g, id: newId } : g));
    const nextPoints = model.points.map(p => ({
      ...p,
      groupIds: (p.groupIds || []).map(gid => (gid === oldId ? newId : gid)),
    }));
    const nextElements = model.elements.map(e => ({
      ...e,
      groupIds: (e.groupIds || []).map(gid => (gid === oldId ? newId : gid)),
    }));
    const nextSliders = model.sliders.map(s => ({
      ...s,
      groupIds: (s.groupIds || []).map(gid => (gid === oldId ? newId : gid)),
    }));

    onUpdateModel(
      { ...model, groups: nextGroups, points: nextPoints, elements: nextElements, sliders: nextSliders },
      `Renombrar ID de grupo ${oldId} a ${newId}`
    );
  };

  const handleRenameGroupLabel = (groupId: string, newLabel: string) => {
    const nextGroups = groups.map(g => (g.id === groupId ? { ...g, label: newLabel } : g));
    onUpdateModel({ ...model, groups: nextGroups }, `Renombrar nombre de grupo ${groupId}`);
  };

  const handleDeleteGroup = (groupId: string) => {
    const nextGroups = groups.filter(g => g.id !== groupId);
    const nextPoints = model.points.map(p => ({
      ...p,
      groupIds: (p.groupIds || []).filter(gid => gid !== groupId),
    }));
    const nextElements = model.elements.map(e => ({
      ...e,
      groupIds: (e.groupIds || []).filter(gid => gid !== groupId),
    }));
    const nextSliders = model.sliders.map(s => ({
      ...s,
      groupIds: (s.groupIds || []).map(gid => (gid === groupId ? '' : gid)).filter(Boolean),
    }));
    onUpdateModel(
      { ...model, groups: nextGroups, points: nextPoints, elements: nextElements, sliders: nextSliders },
      `Eliminar grupo ${groupId}`
    );
  };

  const handleToggleGroupVisible = (groupId: string) => {
    onUpdateModel({
      ...model,
      groups: groups.map(group => group.id === groupId ? { ...group, visible: group.visible === false } : group),
    }, `Alternar visibilidad de grupo ${groupId}`);
  };

  const handleToggleGroupLock = (groupId: string) => {
    onUpdateModel({
      ...model,
      groups: groups.map(group => group.id === groupId ? { ...group, locked: !group.locked } : group),
    }, `Alternar bloqueo de grupo ${groupId}`);
  };

  const handleToggleGroupMember = (groupId: string, itemId: string) => {
    const grp = groups.find(g => g.id === groupId);
    if (!grp) return;
    const isMember = (grp.memberIds || []).includes(itemId);
    const nextMemberIds = isMember
      ? (grp.memberIds || []).filter(id => id !== itemId)
      : [...(grp.memberIds || []), itemId];

    const nextGroups = groups.map(g => (g.id === groupId ? { ...g, memberIds: nextMemberIds } : g));

    const nextPoints = model.points.map(p => {
      if (p.id !== itemId) return p;
      const gIds = p.groupIds || [];
      return {
        ...p,
        groupIds: isMember ? gIds.filter(id => id !== groupId) : [...new Set([...gIds, groupId])],
      };
    });

    const nextElements = model.elements.map(e => {
      if (e.id !== itemId) return e;
      const gIds = e.groupIds || [];
      return {
        ...e,
        groupIds: isMember ? gIds.filter(id => id !== groupId) : [...new Set([...gIds, groupId])],
      };
    });

    const nextSliders = model.sliders.map(s => {
      if (s.id !== itemId) return s;
      const gIds = s.groupIds || [];
      return {
        ...s,
        groupIds: isMember ? gIds.filter(id => id !== groupId) : [...new Set([...gIds, groupId])],
      };
    });

    onUpdateModel(
      { ...model, groups: nextGroups, points: nextPoints, elements: nextElements, sliders: nextSliders },
      `Modificar miembros de grupo ${groupId}`
    );
  };

  return (
    <div className="p-3 space-y-3 font-serif text-xs text-carbon">
      {/* Navegación Capas / Grupos */}
      <div className="flex border-b border-carbon/10 bg-carbon/5 p-1 rounded-lg">
        <button
          type="button"
          onClick={() => setActiveTab('layers')}
          className={`flex-1 py-1 text-xs font-bold rounded transition-all cursor-pointer ${
            activeTab === 'layers' ? 'bg-lienzo text-carbon shadow-2xs' : 'text-carbon/60 hover:text-carbon'
          }`}
        >
          Capas ({layers.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('groups')}
          className={`flex-1 py-1 text-xs font-bold rounded transition-all cursor-pointer ${
            activeTab === 'groups' ? 'bg-lienzo text-carbon shadow-2xs' : 'text-carbon/60 hover:text-carbon'
          }`}
        >
          Grupos ({groups.length})
        </button>
      </div>

      {activeTab === 'layers' ? (
        <div className="space-y-2">
          {/* Añadir Capa */}
          <div className="flex items-center space-x-1.5">
            <input
              type="text"
              value={newLayerLabel}
              onChange={e => setNewLayerLabel(e.target.value)}
              placeholder="Nueva capa..."
              className="flex-1 bg-lienzo border border-carbon/20 rounded-lg px-2 py-1 text-xs text-carbon"
            />
            <button
              type="button"
              onClick={handleAddLayer}
              className="flex items-center space-x-1 px-3 py-1 bg-salvia text-lienzo rounded-lg font-bold hover:bg-salvia/90 transition-all cursor-pointer text-xs shadow-2xs"
            >
              <IconPlus className="w-3.5 h-3.5" />
              <span>Capa</span>
            </button>
          </div>

          <div className="space-y-1.5">
            {layers.map(layer => {
              const layerItems = allItems.filter(item => item.layerId === layer.id);
              const isExpanded = expandedLayerId === layer.id;
              const isDropTarget = dropTargetLayerId === layer.id && draggingItemId !== null;
              const draggingItem = allItems.find(item => item.id === draggingItemId);
              const draggingFromOtherLayer = Boolean(draggingItem && draggingItem.layerId !== layer.id);

              return (
                <div
                  key={layer.id}
                  onDragOver={e => {
                    e.preventDefault();
                    if (!draggingItemId) return;
                    setDropTargetLayerId(layer.id);
                    if (!isExpanded) setExpandedLayerId(layer.id);
                  }}
                  onDragLeave={e => {
                    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
                      setDropTargetLayerId(prev => (prev === layer.id ? null : prev));
                      setDropInsertBeforeId(null);
                    }
                  }}
                  onDrop={e => {
                    e.preventDefault();
                    const itemId = e.dataTransfer.getData('text/plain') || draggingItemId;
                    if (itemId) {
                      handleMoveItemToLayer(itemId, layer.id);
                      clearDrag();
                    }
                  }}
                  className={`rounded-xl border shadow-2xs overflow-hidden transition-all duration-150 ${
                    isDropTarget
                      ? 'bg-salvia/10 border-salvia ring-2 ring-salvia/40 scale-[1.01]'
                      : 'bg-carbon/5 border-carbon/10'
                  }`}
                >
                  <div className={`flex items-center justify-between p-2 ${isDropTarget ? 'bg-salvia/5' : ''}`}>
                    <button
                      type="button"
                      onClick={() => setExpandedLayerId(isExpanded ? null : layer.id)}
                      className="flex items-center space-x-2 min-w-0 flex-1 text-left cursor-pointer"
                    >
                      <span className="font-mono text-[10px] text-salvia font-bold">{layer.id}</span>
                      <span className="font-bold text-xs truncate text-carbon">{layer.label}</span>
                      <span className="text-[10px] text-carbon/50 font-mono">({layerItems.length})</span>
                      {isDropTarget && draggingFromOtherLayer && (
                        <span className="text-[9px] font-bold text-salvia bg-salvia/15 px-1.5 py-0.5 rounded animate-pulse">
                          Soltar aquí
                        </span>
                      )}
                    </button>

                    <div className="flex items-center space-x-1">
                      <button
                        type="button"
                        onClick={() => handleToggleLayerVisible(layer.id)}
                        className={`p-1 rounded cursor-pointer ${
                          layer.visible !== false ? 'text-salvia' : 'text-carbon/30'
                        }`}
                        title={layer.visible !== false ? 'Ocultar capa' : 'Mostrar capa'}
                      >
                        {layer.visible !== false ? <IconEye /> : <IconEyeOff />}
                      </button>

                      <button
                        type="button"
                        onClick={() => handleToggleLayerLock(layer.id)}
                        className={`p-1 rounded cursor-pointer ${
                          layer.locked ? 'text-terracota' : 'text-carbon/30'
                        }`}
                        title={layer.locked ? 'Desbloquear capa' : 'Bloquear capa'}
                      >
                        {layer.locked ? <IconLock /> : <IconUnlock />}
                      </button>
                      {layerItems.length === 0 && (
                        <button
                          type="button"
                          onClick={() => handleDeleteLayer(layer.id)}
                          className="p-1 text-granada hover:bg-granada/10 rounded cursor-pointer"
                          title="Eliminar capa vacía"
                        >
                          <IconTrash className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="p-2 border-t border-carbon/10 bg-carbon/5 space-y-2">
                      <div className="grid grid-cols-2 gap-2 bg-lienzo p-2 rounded-lg border border-carbon/10">
                        <div>
                          <label className="block text-[10px] font-bold text-carbon/70 mb-0.5">ID de la Capa</label>
                          <input
                            type="text"
                            defaultValue={layer.id}
                            key={`layer-id-${layer.id}`}
                            onBlur={e => handleRenameLayerId(layer.id, e.target.value)}
                            onKeyDown={e => {
                              if (e.key === 'Enter') handleRenameLayerId(layer.id, e.currentTarget.value);
                            }}
                            className="w-full bg-carbon/5 border border-carbon/20 rounded px-1.5 py-0.5 text-xs font-mono font-bold text-salvia"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-carbon/70 mb-0.5">Nombre de la Capa</label>
                          <input
                            type="text"
                            value={layer.label}
                            onChange={e => handleRenameLayerLabel(layer.id, e.target.value)}
                            className="w-full bg-carbon/5 border border-carbon/20 rounded px-1.5 py-0.5 text-xs font-bold text-carbon"
                          />
                        </div>
                      </div>

                      {layerItems.length === 0 ? (
                        <div
                          className={`rounded-lg border-2 border-dashed p-3 text-center transition-colors ${
                            isDropTarget
                              ? 'border-salvia bg-salvia/10 text-salvia'
                              : 'border-carbon/20 text-carbon/40'
                          }`}
                        >
                          <p className="text-[10px] italic">
                            {isDropTarget ? 'Suelta el elemento en esta capa' : 'Arrastra objetos aquí'}
                          </p>
                        </div>
                      ) : (
                        listLayerSceneItemsFrontFirst(stacked, layer.id).map(ordered => {
                          const item = allItems.find(entry => entry.id === ordered.id);
                          if (!item) return null;
                          const frontIds = listLayerSceneItemsFrontFirst(stacked, layer.id).map(entry => entry.id);
                          const frontIndex = frontIds.indexOf(item.id);
                          return (
                            <React.Fragment key={item.id}>
                              {dropInsertBeforeId === item.id && draggingItemId && draggingItemId !== item.id && (
                                <div className="h-1 rounded-full bg-salvia mx-1" aria-hidden />
                              )}
                              <div
                                onDragOver={e => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  setDropTargetLayerId(layer.id);
                                  setDropInsertBeforeId(item.id);
                                }}
                                onDrop={e => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  const draggedId = e.dataTransfer.getData('text/plain') || draggingItemId;
                                  if (draggedId && draggedId !== item.id) {
                                    handleReorderBefore(draggedId, item.id, layer.id);
                                  } else if (draggedId) {
                                    handleMoveItemToLayer(draggedId, layer.id);
                                  }
                                  clearDrag();
                                }}
                                className={`flex items-center justify-between gap-1 p-1.5 bg-lienzo rounded border text-[10px] transition-all duration-150 ${
                                  draggingItemId === item.id
                                    ? 'opacity-30 scale-95 border-salvia border-dashed'
                                    : dropInsertBeforeId === item.id
                                    ? 'border-salvia ring-1 ring-salvia/50'
                                    : 'border-carbon/10 hover:border-carbon/30 hover:shadow-sm'
                                }`}
                              >
                                <div className="flex items-center space-x-1.5 min-w-0">
                                  <span
                                    draggable
                                    onDragStart={e => {
                                      e.dataTransfer.setData('text/plain', item.id);
                                      e.dataTransfer.effectAllowed = 'move';
                                      setDraggingItemId(item.id);
                                    }}
                                    onDragEnd={clearDrag}
                                    className="text-carbon/40 font-mono text-[11px] cursor-grab active:cursor-grabbing select-none px-0.5"
                                    title="Arrastrar para mover"
                                    aria-label={`Arrastrar ${item.id}`}
                                  >
                                    ⋮⋮
                                  </span>
                                  <span className="font-bold text-carbon truncate max-w-[110px]">
                                    {item.label} ({item.id})
                                  </span>
                                  <span className="text-[8px] uppercase text-carbon/40 font-mono">{item.kind}</span>
                                </div>
                                <div className="flex items-center space-x-1 shrink-0">
                                  <button
                                    type="button"
                                    onClick={e => {
                                      e.preventDefault();
                                      e.stopPropagation();
                                      handleBringForward(item.id);
                                    }}
                                    disabled={frontIndex <= 0}
                                    className="p-0.5 text-carbon/60 hover:text-carbon cursor-pointer disabled:opacity-30"
                                    title="Traer adelante"
                                  >
                                    <IconChevronUp className="w-3 h-3" />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={e => {
                                      e.preventDefault();
                                      e.stopPropagation();
                                      handleSendBackward(item.id);
                                    }}
                                    disabled={frontIndex < 0 || frontIndex >= frontIds.length - 1}
                                    className="p-0.5 text-carbon/60 hover:text-carbon cursor-pointer disabled:opacity-30"
                                    title="Enviar atrás"
                                  >
                                    <IconChevronDown className="w-3 h-3" />
                                  </button>
                                  <select
                                    value={item.layerId}
                                    onChange={e => {
                                      e.stopPropagation();
                                      if (e.target.value !== item.layerId) {
                                        handleMoveItemToLayer(item.id, e.target.value);
                                      }
                                    }}
                                    onClick={e => e.stopPropagation()}
                                    className="relative z-30 bg-carbon/10 border-0 rounded px-1 py-0 text-[9px] font-bold text-salvia cursor-pointer max-w-[5.5rem]"
                                  >
                                    {layers.map(l => (
                                      <option key={l.id} value={l.id}>
                                        {l.label}
                                      </option>
                                    ))}
                                  </select>
                                </div>
                              </div>
                            </React.Fragment>
                          );
                        })
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* --- GRUPOS --- */
        <div className="space-y-2">
          {/* Añadir Grupo */}
          <div className="flex items-center space-x-1.5">
            <input
              type="text"
              value={newGroupLabel}
              onChange={e => setNewGroupLabel(e.target.value)}
              placeholder="Nuevo grupo..."
              className="flex-1 bg-lienzo border border-carbon/20 rounded-lg px-2 py-1 text-xs text-carbon"
            />
            <button
              type="button"
              onClick={handleAddGroup}
              className="flex items-center space-x-1 px-3 py-1 bg-salvia text-lienzo rounded-lg font-bold hover:bg-salvia/90 transition-all cursor-pointer text-xs shadow-2xs"
            >
              <IconPlus className="w-3.5 h-3.5" />
              <span>Grupo</span>
            </button>
          </div>

          <div className="space-y-1.5">
            {groups.length === 0 ? (
              <p className="text-center p-4 italic text-carbon/40 border border-dashed border-carbon/20 rounded-xl">
                No hay grupos creados. Crea uno para agrupar varios elementos.
              </p>
            ) : (
              groups.map(grp => {
                const isExpanded = expandedGroupId === grp.id;
                const memberCount = (grp.memberIds || []).length;

                return (
                  <div
                    key={grp.id}
                    className="rounded-xl bg-carbon/5 border border-carbon/10 shadow-2xs overflow-hidden"
                  >
                    <div className="flex items-center justify-between p-2">
                      <button
                        type="button"
                        onClick={() => setExpandedGroupId(isExpanded ? null : grp.id)}
                        className="flex items-center space-x-2 min-w-0 flex-1 text-left cursor-pointer"
                      >
                        <span className="font-mono text-[10px] text-pavo font-bold">{grp.id}</span>
                        <span className="font-bold text-xs truncate text-carbon">{grp.label}</span>
                        <span className="text-[10px] text-carbon/50 font-mono">({memberCount} miembros)</span>
                      </button>

                      <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => handleToggleGroupVisible(grp.id)}
                        className={`p-1 rounded cursor-pointer ${grp.visible !== false ? 'text-salvia' : 'text-carbon/30'}`}
                        title={grp.visible !== false ? 'Ocultar grupo' : 'Mostrar grupo'}
                      >
                        {grp.visible !== false ? <IconEye /> : <IconEyeOff />}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleToggleGroupLock(grp.id)}
                        className={`p-1 rounded cursor-pointer ${grp.locked ? 'text-terracota' : 'text-carbon/30'}`}
                        title={grp.locked ? 'Desbloquear grupo' : 'Bloquear grupo'}
                      >
                        {grp.locked ? <IconLock /> : <IconUnlock />}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteGroup(grp.id)}
                        className="p-1 text-granada hover:bg-granada/10 rounded cursor-pointer transition-colors"
                        title="Eliminar grupo"
                      >
                        <IconTrash className="w-3.5 h-3.5" />
                      </button>
                      </div>
                    </div>

                    {/* Ajuste de ID y Nombre de Grupo + Miembros */}
                    {isExpanded && (
                      <div className="p-2 border-t border-carbon/10 bg-carbon/5 space-y-2">
                        <div className="grid grid-cols-2 gap-2 bg-lienzo p-2 rounded-lg border border-carbon/10">
                          <div>
                            <label className="block text-[10px] font-bold text-carbon/70 mb-0.5">ID del Grupo</label>
                            <input
                              type="text"
                              defaultValue={grp.id}
                              key={`grp-id-${grp.id}`}
                              onBlur={e => handleRenameGroupId(grp.id, e.target.value)}
                              onKeyDown={e => {
                                if (e.key === 'Enter') handleRenameGroupId(grp.id, e.currentTarget.value);
                              }}
                              className="w-full bg-carbon/5 border border-carbon/20 rounded px-1.5 py-0.5 text-xs font-mono font-bold text-pavo"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold text-carbon/70 mb-0.5">Nombre del Grupo</label>
                            <input
                              type="text"
                              value={grp.label}
                              onChange={e => handleRenameGroupLabel(grp.id, e.target.value)}
                              className="w-full bg-carbon/5 border border-carbon/20 rounded px-1.5 py-0.5 text-xs font-bold text-carbon"
                            />
                          </div>
                        </div>

                        <p className="text-[10px] font-bold text-carbon/60 uppercase tracking-wider">
                          Selecciona los miembros del grupo:
                        </p>
                        <div className="max-h-40 overflow-y-auto space-y-1 p-1 bg-lienzo rounded border border-carbon/10">
                          {allItems.map(item => {
                            const isMember = (grp.memberIds || []).includes(item.id);
                            return (
                              <label
                                key={item.id}
                                className="flex items-center justify-between p-1 rounded hover:bg-carbon/5 text-[10px] cursor-pointer"
                              >
                                <span className="font-medium text-carbon truncate">
                                  {item.label} ({item.id})
                                </span>
                                <input
                                  type="checkbox"
                                  checked={isMember}
                                  onChange={() => handleToggleGroupMember(grp.id, item.id)}
                                  className="rounded border-carbon/30 text-salvia focus:ring-salvia cursor-pointer"
                                />
                              </label>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
};
