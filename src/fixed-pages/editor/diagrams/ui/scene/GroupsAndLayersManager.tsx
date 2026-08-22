import React, { useState } from 'react';
import type { VisualDiagramModel } from '../../model/types';
import type { DiagramLayer, DiagramGroup } from '@/diagrams';
import { DEFAULT_DIAGRAM_LAYERS } from '@/diagrams';
import {
  bringSceneItemForward,
  listLayerSceneItemsFrontFirst,
  moveSceneItemToLayer,
  moveSceneItemVisual,
  sendSceneItemBackward,
} from '../../model/scene/sceneOrdering';
import {
  generateUniqueDiagramId,
  sanitizeDiagramId,
} from '../../model/elements/diagramElements';
import {
  allDiagramIds,
  renameDiagramId,
} from '../../model/tools/graphCommands';
import {
  IconEye,
  IconEyeOff,
  IconLock,
  IconUnlock,
  IconPlus,
  IconTrash,
  IconChevronUp,
  IconChevronDown,
  IconChevronRight,
} from '../toolbar/WorkbenchIcons';
import { DiagramObjectLabel } from '../workbench/WorkbenchSceneTree';

interface GroupsAndLayersManagerProps {
  model: VisualDiagramModel | null;
  selectedIds?: readonly string[];
  pickingGroupId?: string | null;
  onUpdateModel: (nextModel: VisualDiagramModel, label: string) => void;
  onSelectObjects?: (ids: string[], additive?: boolean) => void;
  onTogglePickingGroupId?: (groupId: string | null) => void;
}

function ensureSceneStack(model: VisualDiagramModel): VisualDiagramModel {
  const existing = model.layers?.length ? model.layers : DEFAULT_DIAGRAM_LAYERS.map(layer => ({ ...layer }));
  const layerIds = new Set(existing.map(layer => layer.id));
  const fallbackLayer = existing.find(layer => layer.id === 'geometry')?.id
    ?? existing[0]?.id
    ?? 'geometry';

  return {
    ...model,
    layers: existing,
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
        : (existing.find(layer => layer.id === 'controls')?.id ?? fallbackLayer),
      order: Number.isFinite(slider.order) ? slider.order : 0,
    })),
  };
}

function ensureLayerExists(model: VisualDiagramModel, layerId: string): VisualDiagramModel {
  if (model.layers.some(layer => layer.id === layerId)) return model;
  const fromDefaults = DEFAULT_DIAGRAM_LAYERS.find(layer => layer.id === layerId);
  const nextLayer: DiagramLayer = fromDefaults
    ? { ...fromDefaults, order: (Math.max(0, ...model.layers.map(layer => layer.order)) + 10) }
    : {
        id: layerId,
        label: layerId,
        order: (Math.max(0, ...model.layers.map(layer => layer.order)) + 10),
        visible: true,
        locked: false,
      };
  return { ...model, layers: [...model.layers, nextLayer] };
}

export const GroupsAndLayersManager: React.FC<GroupsAndLayersManagerProps> = ({
  model,
  selectedIds = [],
  pickingGroupId = null,
  onUpdateModel,
  onSelectObjects,
  onTogglePickingGroupId,
}) => {
  const [activeTab, setActiveTab] = useState<'layers' | 'groups'>('layers');
  const [newGroupLabel, setNewGroupLabel] = useState('');
  const [newLayerLabel, setNewLayerLabel] = useState('');
  const [expandedLayerId, setExpandedLayerId] = useState<string | null>(null);
  const [expandedGroupId, setExpandedGroupId] = useState<string | null>(null);
  const [draggingItemId, setDraggingItemId] = useState<string | null>(null);
  const [draggingLayerId, setDraggingLayerId] = useState<string | null>(null);
  const [dropTargetLayerId, setDropTargetLayerId] = useState<string | null>(null);
  const [dropTargetLayerIndex, setDropTargetLayerIndex] = useState<number | null>(null);
  const [dropInsertBeforeId, setDropInsertBeforeId] = useState<string | null>(null);

  if (!model) return null;

  const stacked = ensureSceneStack(model);
  const layers = stacked.layers.slice().sort((a, b) => a.order - b.order);
  const groups: DiagramGroup[] = model.groups || [];

  const allItems = [
    ...stacked.points.map(p => ({ id: p.id, label: p.label || p.id, kind: 'punto', layerId: p.layerId, order: p.order })),
    ...stacked.elements.map(e => ({ id: e.id, label: e.label || e.id, kind: e.kind, layerId: e.layerId, order: e.order })),
    ...stacked.sliders.map(s => ({ id: s.id, label: s.label || s.id, kind: 'slider', layerId: s.layerId, order: s.order })),
  ];

  const commit = (next: VisualDiagramModel, label: string) => {
    onUpdateModel(ensureSceneStack(next), label);
  };

  // --- Actions Capas ---
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

  const handleMoveLayer = (layerId: string, direction: -1 | 1) => {
    const currentIndex = layers.findIndex(l => l.id === layerId);
    const targetIndex = currentIndex + direction;
    if (currentIndex < 0 || targetIndex < 0 || targetIndex >= layers.length) return;

    const reordered = [...layers];
    const [moved] = reordered.splice(currentIndex, 1);
    reordered.splice(targetIndex, 0, moved);

    const nextLayers = reordered.map((l, index) => ({
      ...l,
      order: index * 10,
    }));

    commit({
      ...stacked,
      layers: nextLayers,
    }, `Reordenar capa ${layerId}`);
  };

  const handleReorderLayerToIndex = (draggedId: string, targetIndex: number) => {
    const currentIndex = layers.findIndex(l => l.id === draggedId);
    if (currentIndex < 0 || targetIndex < 0 || targetIndex >= layers.length || currentIndex === targetIndex) return;

    const reordered = [...layers];
    const [moved] = reordered.splice(currentIndex, 1);
    reordered.splice(targetIndex, 0, moved);

    const nextLayers = reordered.map((l, index) => ({
      ...l,
      order: index * 10,
    }));

    commit({
      ...stacked,
      layers: nextLayers,
    }, `Reordenar capa ${draggedId}`);
  };

  const handleRenameLayerId = (oldId: string, candidateNewId: string) => {
    const newId = sanitizeDiagramId(candidateNewId, oldId);
    if (!newId || newId === oldId) return;
    if (allDiagramIds(stacked).has(newId)) return;

    commit(renameDiagramId(stacked, oldId, newId), `Renombrar ID de capa ${oldId} a ${newId}`);
  };

  const handleRenameLayerLabel = (layerId: string, newLabel: string) => {
    commit({
      ...stacked,
      layers: stacked.layers.map(l => (l.id === layerId ? { ...l, label: newLabel } : l)),
    }, `Renombrar capa ${layerId}`);
  };

  const handleAddLayer = () => {
    const label = newLayerLabel.trim();
    if (!label) return;
    const id = generateUniqueDiagramId(label, allDiagramIds(stacked), 'layer');
    const newLayer: DiagramLayer = {
      id,
      label,
      order: (Math.max(0, ...stacked.layers.map(l => l.order)) + 10),
      visible: true,
      locked: false,
    };
    commit({ ...stacked, layers: [...stacked.layers, newLayer] }, `Añadir capa ${label}`);
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
    const withLayer = ensureLayerExists(stacked, newLayerId);
    commit(moveSceneItemToLayer(withLayer, itemId, newLayerId), `Mover ${itemId} a capa ${newLayerId}`);
    setExpandedLayerId(newLayerId);
  };

  const handleReorderBefore = (draggedId: string, targetId: string, layerId: string) => {
    const withLayer = ensureLayerExists(stacked, layerId);
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
    setDraggingLayerId(null);
    setDropTargetLayerId(null);
    setDropTargetLayerIndex(null);
    setDropInsertBeforeId(null);
  };

  // --- Actions Grupos ---
  const handleAddGroup = () => {
    const label = newGroupLabel.trim();
    if (!label) return;
    const id = generateUniqueDiagramId(label, allDiagramIds(model), 'grp');
    const newGroup: DiagramGroup = {
      id,
      label,
      memberIds: [],
      visible: true,
      locked: false,
      selection: { selectable: true, role: 'primary' },
      target: true,
      targetId: id,
    };
    onUpdateModel({ ...model, groups: [...groups, newGroup] }, `Añadir grupo ${label}`);
    setNewGroupLabel('');
    setExpandedGroupId(id);
  };

  const handleRenameGroupId = (oldId: string, candidateNewId: string) => {
    const newId = sanitizeDiagramId(candidateNewId, oldId);
    if (!newId || newId === oldId) return;
    if (allDiagramIds(model).has(newId)) return;

    onUpdateModel(
      renameDiagramId(model, oldId, newId),
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

  const handleToggleGroupTarget = (groupId: string, targetEnabled: boolean) => {
    onUpdateModel({
      ...model,
      groups: groups.map(group => group.id === groupId ? { ...group, target: targetEnabled, targetId: targetEnabled ? (group.targetId || group.id) : undefined } : group),
    }, `Alternar target de grupo ${groupId}`);
  };

  const handleUpdateGroupTargetId = (groupId: string, candidateTargetId: string) => {
    onUpdateModel({
      ...model,
      groups: groups.map(group => group.id === groupId ? { ...group, targetId: candidateTargetId.trim() || group.id } : group),
    }, `Actualizar targetId de grupo ${groupId}`);
  };

  const handleUpdateGroupColor = (groupId: string, color: string | undefined) => {
    onUpdateModel({
      ...model,
      groups: groups.map(group => group.id === groupId ? { ...group, color: color as any } : group),
    }, `Actualizar color de grupo ${groupId}`);
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

  const handleAddSelectedToGroup = (groupId: string) => {
    if (!selectedIds.length) return;
    const grp = groups.find(g => g.id === groupId);
    if (!grp) return;
    const nextMemberIds = [...new Set([...(grp.memberIds || []), ...selectedIds])];
    const nextGroups = groups.map(g => (g.id === groupId ? { ...g, memberIds: nextMemberIds } : g));
    const selSet = new Set(selectedIds);

    const updateGroupIds = <T extends { id: string; groupIds?: string[] }>(items: T[]): T[] => items.map(item => {
      if (!selSet.has(item.id)) return item;
      return { ...item, groupIds: [...new Set([...(item.groupIds || []), groupId])] };
    });

    onUpdateModel({
      ...model,
      groups: nextGroups,
      points: updateGroupIds(model.points),
      elements: updateGroupIds(model.elements),
      sliders: updateGroupIds(model.sliders),
    }, `Añadir seleccionados a grupo ${groupId}`);
  };

  const handleRemoveSelectedFromGroup = (groupId: string) => {
    if (!selectedIds.length) return;
    const grp = groups.find(g => g.id === groupId);
    if (!grp) return;
    const selSet = new Set(selectedIds);
    const nextMemberIds = (grp.memberIds || []).filter(id => !selSet.has(id));
    const nextGroups = groups.map(g => (g.id === groupId ? { ...g, memberIds: nextMemberIds } : g));

    const removeGroupIds = <T extends { id: string; groupIds?: string[] }>(items: T[]): T[] => items.map(item => {
      if (!selSet.has(item.id)) return item;
      return { ...item, groupIds: (item.groupIds || []).filter(gid => gid !== groupId) };
    });

    onUpdateModel({
      ...model,
      groups: nextGroups,
      points: removeGroupIds(model.points),
      elements: removeGroupIds(model.elements),
      sliders: removeGroupIds(model.sliders),
    }, `Quitar seleccionados de grupo ${groupId}`);
  };

  return (
    <div className="p-4 space-y-3 font-serif text-xs text-carbon bg-lienzo h-full overflow-y-auto select-none">
      {/* Cabecera unificada con selector Capas / Grupos */}
      <div className="flex items-center justify-between border-b border-carbon/15 pb-3">
        <div>
          <h3 className="font-serif text-base font-bold text-carbon">Capas y Grupos</h3>
          <p className="text-xs italic text-carbon/50">Organización visual y orden de renderizado</p>
        </div>
        <div className="flex bg-carbon/10 p-0.5 rounded-lg text-[10px]">
          <button
            type="button"
            onClick={() => setActiveTab('layers')}
            className={`px-2.5 py-1 rounded-md font-bold transition-all cursor-pointer ${
              activeTab === 'layers' ? 'bg-lienzo text-carbon shadow-2xs' : 'text-carbon/60 hover:text-carbon'
            }`}
          >
            Capas ({layers.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('groups')}
            className={`px-2.5 py-1 rounded-md font-bold transition-all cursor-pointer ${
              activeTab === 'groups' ? 'bg-lienzo text-carbon shadow-2xs' : 'text-carbon/60 hover:text-carbon'
            }`}
          >
            Grupos ({groups.length})
          </button>
        </div>
      </div>

      {activeTab === 'layers' ? (
        <div className="space-y-3">
          {/* Formulario Añadir Capa */}
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={newLayerLabel}
              onChange={e => setNewLayerLabel(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter') handleAddLayer();
              }}
              placeholder="Nueva capa..."
              className="flex-1 bg-lienzo border border-carbon/20 rounded-xl px-3 py-1.5 text-xs text-carbon placeholder-carbon/40 focus:border-canela focus:ring-1 focus:ring-canela outline-none transition-all shadow-2xs"
            />
            <button
              type="button"
              onClick={handleAddLayer}
              disabled={!newLayerLabel.trim()}
              className="flex items-center space-x-1 px-3 py-1.5 bg-canela text-lienzo rounded-xl font-bold hover:bg-canela/90 disabled:opacity-40 transition-all cursor-pointer text-xs shadow-2xs shrink-0"
            >
              <IconPlus className="w-3.5 h-3.5" />
              <span>Capa</span>
            </button>
          </div>

          {/* Lista de Capas */}
          <div className="space-y-2">
            {layers.map((layer, layerIndex) => {
              const layerItems = allItems.filter(item => item.layerId === layer.id);
              const isExpanded = expandedLayerId === layer.id;
              const isDropTarget = dropTargetLayerId === layer.id && draggingItemId !== null;
              const isLayerDropTarget = dropTargetLayerIndex === layerIndex && draggingLayerId !== null && draggingLayerId !== layer.id;
              const draggingItem = allItems.find(item => item.id === draggingItemId);
              const draggingFromOtherLayer = Boolean(draggingItem && draggingItem.layerId !== layer.id);

              return (
                <React.Fragment key={layer.id}>
                  {isLayerDropTarget && (
                    <div className="h-1 rounded-full bg-canela my-1 shadow-2xs animate-pulse" aria-hidden />
                  )}
                  <div
                    onDragOver={e => {
                      e.preventDefault();
                      if (draggingLayerId) {
                        e.stopPropagation();
                        setDropTargetLayerIndex(layerIndex);
                        return;
                      }
                      if (!draggingItemId) return;
                      setDropTargetLayerId(layer.id);
                      if (!isExpanded) setExpandedLayerId(layer.id);
                    }}
                    onDragLeave={e => {
                      if (!e.currentTarget.contains(e.relatedTarget as Node)) {
                        if (draggingLayerId) {
                          setDropTargetLayerIndex(prev => (prev === layerIndex ? null : prev));
                        } else {
                          setDropTargetLayerId(prev => (prev === layer.id ? null : prev));
                          setDropInsertBeforeId(null);
                        }
                      }
                    }}
                    onDrop={e => {
                      e.preventDefault();
                      if (draggingLayerId) {
                        e.stopPropagation();
                        handleReorderLayerToIndex(draggingLayerId, layerIndex);
                        clearDrag();
                        return;
                      }
                      const itemId = e.dataTransfer.getData('text/plain') || draggingItemId;
                      if (itemId) {
                        handleMoveItemToLayer(itemId, layer.id);
                        clearDrag();
                      }
                    }}
                    className={`rounded-2xl border shadow-2xs overflow-hidden transition-all duration-150 ${
                      draggingLayerId === layer.id
                        ? 'opacity-30 scale-95 border-canela border-dashed'
                        : isDropTarget || isLayerDropTarget
                        ? 'bg-canela/10 border-canela ring-2 ring-canela/40 scale-[1.01]'
                        : 'bg-lienzo border-carbon/15 hover:border-carbon/30'
                    }`}
                  >
                    {/* Fila Header de Capa */}
                    <div className={`flex items-center justify-between p-2.5 ${isDropTarget || isLayerDropTarget ? 'bg-canela/5' : 'bg-carbon/5'}`}>
                      <div className="flex items-center space-x-1 min-w-0 flex-1 text-left">
                        <span
                          draggable
                          onDragStart={e => {
                            e.dataTransfer.setData('text/plain', layer.id);
                            e.dataTransfer.effectAllowed = 'move';
                            setDraggingLayerId(layer.id);
                          }}
                          onDragEnd={clearDrag}
                          className="text-carbon/30 hover:text-carbon font-mono text-xs cursor-grab active:cursor-grabbing select-none px-1 py-0.5"
                          title="Arrastrar para reordenar capa"
                          aria-label={`Arrastrar capa ${layer.label}`}
                        >
                          ⋮⋮
                        </span>
                        <button
                          type="button"
                          onClick={() => setExpandedLayerId(isExpanded ? null : layer.id)}
                          className="flex items-center space-x-2 min-w-0 flex-1 text-left cursor-pointer"
                        >
                          <span className="text-carbon/50 hover:text-carbon transition-colors">
                            {isExpanded ? <IconChevronDown className="w-3.5 h-3.5" /> : <IconChevronRight className="w-3.5 h-3.5" />}
                          </span>
                          <span className="font-mono text-[10px] bg-canela/10 text-canela font-bold px-1.5 py-0.5 rounded border border-canela/20 shrink-0">
                            {layer.id}
                          </span>
                          <span className="font-serif font-bold text-xs truncate text-carbon">{layer.label}</span>
                          <span className="text-[10px] text-carbon/50 font-mono bg-carbon/10 px-1.5 py-0.2 rounded border border-carbon/10 shrink-0">
                            {layerItems.length}
                          </span>
                          {isDropTarget && draggingFromOtherLayer && (
                            <span className="text-[9px] font-bold text-canela bg-canela/15 px-1.5 py-0.5 rounded animate-pulse">
                              Soltar aquí
                            </span>
                          )}
                        </button>
                      </div>

                      <div className="flex items-center space-x-1 shrink-0">
                        <button
                          type="button"
                          onClick={() => handleMoveLayer(layer.id, -1)}
                          disabled={layerIndex <= 0}
                          className="p-1 text-carbon/60 hover:text-carbon hover:bg-carbon/10 rounded cursor-pointer disabled:opacity-20 transition-colors"
                          title="Mover capa arriba"
                          aria-label={`Mover capa arriba ${layer.label}`}
                        >
                          <IconChevronUp className="w-3.5 h-3.5" />
                        </button>

                        <button
                          type="button"
                          onClick={() => handleMoveLayer(layer.id, 1)}
                          disabled={layerIndex >= layers.length - 1}
                          className="p-1 text-carbon/60 hover:text-carbon hover:bg-carbon/10 rounded cursor-pointer disabled:opacity-20 transition-colors"
                          title="Mover capa abajo"
                          aria-label={`Mover capa abajo ${layer.label}`}
                        >
                          <IconChevronDown className="w-3.5 h-3.5" />
                        </button>

                        <button
                          type="button"
                          onClick={() => handleToggleLayerVisible(layer.id)}
                          className={`p-1 rounded-lg transition-colors cursor-pointer ${
                            layer.visible !== false ? 'text-canela hover:bg-canela/10' : 'text-carbon/30 hover:bg-carbon/10'
                          }`}
                          title={layer.visible !== false ? 'Ocultar capa' : 'Mostrar capa'}
                          aria-label={layer.visible !== false ? 'Ocultar capa' : 'Mostrar capa'}
                        >
                          {layer.visible !== false ? <IconEye /> : <IconEyeOff />}
                        </button>

                        <button
                          type="button"
                          onClick={() => handleToggleLayerLock(layer.id)}
                          className={`p-1 rounded-lg transition-colors cursor-pointer ${
                            layer.locked ? 'text-terracota hover:bg-terracota/10' : 'text-carbon/30 hover:bg-carbon/10'
                          }`}
                          title={layer.locked ? 'Desbloquear capa' : 'Bloquear capa'}
                          aria-label={layer.locked ? 'Desbloquear capa' : 'Bloquear capa'}
                        >
                          {layer.locked ? <IconLock /> : <IconUnlock />}
                        </button>

                        {layerItems.length === 0 && (
                          <button
                            type="button"
                            onClick={() => handleDeleteLayer(layer.id)}
                            className="p-1 text-granada/70 hover:text-granada hover:bg-granada/10 rounded-lg transition-colors cursor-pointer"
                            title="Eliminar capa vacía"
                            aria-label="Eliminar capa vacía"
                          >
                            <IconTrash className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>

                  {/* Cuerpo Expandido de Capa */}
                  {isExpanded && (
                    <div className="p-3 border-t border-carbon/10 bg-lienzo space-y-3">
                      {/* Edición rápida ID y Nombre */}
                      <div className="grid grid-cols-2 gap-2 bg-carbon/5 p-2.5 rounded-xl border border-carbon/10">
                        <div>
                          <label className="block text-[10px] font-bold uppercase tracking-wider text-carbon/60 mb-1">ID de Capa</label>
                          <input
                            type="text"
                            defaultValue={layer.id}
                            key={`layer-id-${layer.id}`}
                            onBlur={e => handleRenameLayerId(layer.id, e.target.value)}
                            onKeyDown={e => {
                              if (e.key === 'Enter') handleRenameLayerId(layer.id, e.currentTarget.value);
                            }}
                            className="w-full bg-lienzo border border-carbon/20 rounded-lg px-2 py-1 text-xs font-mono font-bold text-canela focus:border-canela outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold uppercase tracking-wider text-carbon/60 mb-1">Nombre</label>
                          <input
                            type="text"
                            value={layer.label}
                            onChange={e => handleRenameLayerLabel(layer.id, e.target.value)}
                            className="w-full bg-lienzo border border-carbon/20 rounded-lg px-2 py-1 text-xs font-bold text-carbon focus:border-canela outline-none"
                          />
                        </div>
                      </div>

                      {/* Lista de Objetos en esta Capa */}
                      {layerItems.length === 0 ? (
                        <div
                          className={`rounded-xl border-2 border-dashed p-4 text-center transition-colors ${
                            isDropTarget
                              ? 'border-canela bg-canela/10 text-canela'
                              : 'border-carbon/15 text-carbon/40 bg-carbon/5'
                          }`}
                        >
                          <p className="text-xs italic font-sans">
                            {isDropTarget ? 'Soltar elemento aquí para asignar a esta capa' : 'Esta capa está vacía. Arrastra objetos aquí.'}
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-1.5">
                          {listLayerSceneItemsFrontFirst(stacked, layer.id).map(ordered => {
                            const item = allItems.find(entry => entry.id === ordered.id);
                            if (!item) return null;
                            const frontIds = listLayerSceneItemsFrontFirst(stacked, layer.id).map(entry => entry.id);
                            const frontIndex = frontIds.indexOf(item.id);
                            return (
                              <React.Fragment key={item.id}>
                                {dropInsertBeforeId === item.id && draggingItemId && draggingItemId !== item.id && (
                                  <div className="h-0.5 rounded-full bg-canela my-1 shadow-2xs animate-pulse" aria-hidden />
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
                                  className={`flex items-center justify-between gap-1.5 p-2 bg-lienzo rounded-xl border text-xs transition-all duration-150 ${
                                    draggingItemId === item.id
                                      ? 'opacity-30 scale-95 border-canela border-dashed'
                                      : dropInsertBeforeId === item.id
                                      ? 'border-canela ring-1 ring-canela/50'
                                      : 'border-carbon/10 hover:border-carbon/25 hover:shadow-2xs'
                                  }`}
                                >
                                  <div className="flex items-center space-x-2 min-w-0">
                                    <span
                                      draggable
                                      onDragStart={e => {
                                        e.dataTransfer.setData('text/plain', item.id);
                                        e.dataTransfer.effectAllowed = 'move';
                                        setDraggingItemId(item.id);
                                      }}
                                      onDragEnd={clearDrag}
                                      className="text-carbon/30 hover:text-carbon font-mono text-xs cursor-grab active:cursor-grabbing select-none px-0.5"
                                      title="Arrastrar para reordenar o mover de capa"
                                      aria-label={`Arrastrar ${item.id}`}
                                    >
                                      ⋮⋮
                                    </span>
                                    <DiagramObjectLabel label={item.label} id={item.id} className="font-bold text-carbon text-xs" />
                                    <span className="text-[9px] uppercase font-mono text-carbon/40 bg-carbon/5 px-1 py-0.2 rounded border border-carbon/10 shrink-0">
                                      {item.kind}
                                    </span>
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
                                      className="p-1 text-carbon/60 hover:text-carbon hover:bg-carbon/10 rounded cursor-pointer disabled:opacity-20 transition-colors"
                                      title="Traer adelante"
                                      aria-label={`Traer adelante ${item.id}`}
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
                                      className="p-1 text-carbon/60 hover:text-carbon hover:bg-carbon/10 rounded cursor-pointer disabled:opacity-20 transition-colors"
                                      title="Enviar atrás"
                                      aria-label={`Enviar atrás ${item.id}`}
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
                                      className="bg-carbon/5 border border-carbon/15 rounded-md px-1.5 py-0.5 text-[10px] font-bold text-canela hover:border-canela/40 cursor-pointer focus:outline-none"
                                      aria-label={`Cambiar capa de ${item.id}`}
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
                          })}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </React.Fragment>
            );
            })}
          </div>
        </div>
      ) : (
        /* --- GRUPOS --- */
        <div className="space-y-3">
          {/* Formulario Añadir Grupo */}
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={newGroupLabel}
              onChange={e => setNewGroupLabel(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter') handleAddGroup();
              }}
              placeholder="Nuevo grupo..."
              className="flex-1 bg-lienzo border border-carbon/20 rounded-xl px-3 py-1.5 text-xs text-carbon placeholder-carbon/40 focus:border-canela focus:ring-1 focus:ring-canela outline-none transition-all shadow-2xs"
            />
            <button
              type="button"
              onClick={handleAddGroup}
              disabled={!newGroupLabel.trim()}
              className="flex items-center space-x-1 px-3 py-1.5 bg-canela text-lienzo rounded-xl font-bold hover:bg-canela/90 disabled:opacity-40 transition-all cursor-pointer text-xs shadow-2xs shrink-0"
            >
              <IconPlus className="w-3.5 h-3.5" />
              <span>Grupo</span>
            </button>
          </div>

          {/* Lista de Grupos */}
          <div className="space-y-2">
            {groups.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-carbon/20 bg-carbon/5 p-6 text-center text-carbon/60 space-y-1">
                <p className="font-serif text-xs font-bold text-carbon">Sin grupos creados</p>
                <p className="text-xs italic font-sans text-carbon/50">Crea un grupo para manipular varios objetos colectivamente.</p>
              </div>
            ) : (
              groups.map(grp => {
                const isExpanded = expandedGroupId === grp.id;
                const memberCount = (grp.memberIds || []).length;

                return (
                  <div
                    key={grp.id}
                    className="rounded-2xl border border-carbon/15 bg-lienzo shadow-2xs overflow-hidden transition-all hover:border-carbon/30"
                  >
                    {/* Header del Grupo */}
                    <div className="flex items-center justify-between p-2.5 bg-carbon/5">
                      <button
                        type="button"
                        onClick={() => setExpandedGroupId(isExpanded ? null : grp.id)}
                        className="flex items-center space-x-2 min-w-0 flex-1 text-left cursor-pointer"
                      >
                        <span className="text-carbon/50 hover:text-carbon transition-colors">
                          {isExpanded ? <IconChevronDown className="w-3.5 h-3.5" /> : <IconChevronRight className="w-3.5 h-3.5" />}
                        </span>
                        <span className="font-mono text-[10px] bg-pavo/10 text-pavo font-bold px-1.5 py-0.5 rounded border border-pavo/20 shrink-0">
                          {grp.id}
                        </span>
                        <span className="font-serif font-bold text-xs truncate text-carbon">{grp.label}</span>
                        {grp.target !== false && (
                          <span className="font-mono text-[9px] bg-canela/10 text-canela font-bold px-1.5 py-0.2 rounded border border-canela/20 shrink-0" title={`Target público: ${grp.targetId || grp.id}`}>
                            target
                          </span>
                        )}
                        <span className="text-[10px] text-carbon/50 font-mono bg-carbon/10 px-1.5 py-0.2 rounded border border-carbon/10 shrink-0">
                          {memberCount} miembros
                        </span>
                      </button>

                      <div className="flex items-center space-x-1 shrink-0">
                        <button
                          type="button"
                          onClick={() => handleToggleGroupVisible(grp.id)}
                          className={`p-1 rounded-lg transition-colors cursor-pointer ${
                            grp.visible !== false ? 'text-canela hover:bg-canela/10' : 'text-carbon/30 hover:bg-carbon/10'
                          }`}
                          title={grp.visible !== false ? 'Ocultar grupo' : 'Mostrar grupo'}
                          aria-label={grp.visible !== false ? `Ocultar grupo ${grp.label}` : `Mostrar grupo ${grp.label}`}
                        >
                          {grp.visible !== false ? <IconEye /> : <IconEyeOff />}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleToggleGroupLock(grp.id)}
                          className={`p-1 rounded-lg transition-colors cursor-pointer ${
                            grp.locked ? 'text-terracota hover:bg-terracota/10' : 'text-carbon/30 hover:bg-carbon/10'
                          }`}
                          title={grp.locked ? 'Desbloquear grupo' : 'Bloquear grupo'}
                          aria-label={grp.locked ? `Desbloquear grupo ${grp.label}` : `Bloquear grupo ${grp.label}`}
                        >
                          {grp.locked ? <IconLock /> : <IconUnlock />}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteGroup(grp.id)}
                          className="p-1 text-granada/70 hover:text-granada hover:bg-granada/10 rounded-lg transition-colors cursor-pointer"
                          title="Eliminar grupo"
                          aria-label={`Eliminar grupo ${grp.label}`}
                        >
                          <IconTrash className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Cuerpo Expandido del Grupo */}
                    {isExpanded && (
                      <div className="p-3 border-t border-carbon/10 bg-lienzo space-y-3">
                        <div className="grid grid-cols-2 gap-2 bg-carbon/5 p-2.5 rounded-xl border border-carbon/10">
                          <div>
                            <label className="block text-[10px] font-bold uppercase tracking-wider text-carbon/60 mb-1">ID del Grupo</label>
                            <input
                              type="text"
                              defaultValue={grp.id}
                              key={`grp-id-${grp.id}`}
                              onBlur={e => handleRenameGroupId(grp.id, e.target.value)}
                              onKeyDown={e => {
                                if (e.key === 'Enter') handleRenameGroupId(grp.id, e.currentTarget.value);
                              }}
                              className="w-full bg-lienzo border border-carbon/20 rounded-lg px-2 py-1 text-xs font-mono font-bold text-pavo focus:border-pavo outline-none"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold uppercase tracking-wider text-carbon/60 mb-1">Nombre</label>
                            <input
                              type="text"
                              value={grp.label}
                              onChange={e => handleRenameGroupLabel(grp.id, e.target.value)}
                              className="w-full bg-lienzo border border-carbon/20 rounded-lg px-2 py-1 text-xs font-bold text-carbon focus:border-canela outline-none"
                            />
                          </div>
                        </div>

                        {/* Enlazable desde MDX (Target) */}
                        <div className="bg-carbon/5 p-2.5 rounded-xl border border-carbon/10 space-y-2">
                          <label className="flex items-center justify-between text-xs font-bold text-carbon cursor-pointer select-none">
                            <span>Enlazable desde MDX (Target público)</span>
                            <input
                              type="checkbox"
                              checked={grp.target !== false}
                              onChange={e => handleToggleGroupTarget(grp.id, e.target.checked)}
                              className="rounded border-carbon/30 text-canela focus:ring-canela cursor-pointer"
                            />
                          </label>
                          {grp.target !== false && (
                            <div className="grid grid-cols-2 gap-2 pt-1 border-t border-carbon/10">
                              <div>
                                <label className="block text-[10px] font-bold uppercase tracking-wider text-carbon/60 mb-1">Target ID</label>
                                <input
                                  type="text"
                                  value={grp.targetId ?? grp.id}
                                  onChange={e => handleUpdateGroupTargetId(grp.id, e.target.value)}
                                  placeholder={grp.id}
                                  className="w-full bg-lienzo border border-carbon/20 rounded-lg px-2 py-1 text-xs font-mono font-bold text-carbon focus:border-canela outline-none"
                                />
                              </div>
                              <div>
                                <label className="block text-[10px] font-bold uppercase tracking-wider text-carbon/60 mb-1">Color Resaltado</label>
                                <select
                                  value={grp.color || ''}
                                  onChange={e => handleUpdateGroupColor(grp.id, e.target.value || undefined)}
                                  className="w-full bg-lienzo border border-carbon/20 rounded-lg px-2 py-1 text-xs font-bold text-carbon focus:border-canela outline-none cursor-pointer"
                                >
                                  <option value="">(Auto por miembros)</option>
                                  <option value="canela">canela</option>
                                  <option value="terracota">terracota</option>
                                  <option value="ocre">ocre</option>
                                  <option value="pavo">pavo</option>
                                  <option value="mora">mora</option>
                                  <option value="granada">granada</option>
                                  <option value="musgo">musgo</option>
                                </select>
                              </div>
                            </div>
                          )}
                        </div>

                        <div className="space-y-2">
                          <div className="flex flex-wrap items-center justify-between gap-1.5 border-b border-carbon/10 pb-2">
                            <span className="text-[10px] font-bold text-carbon/60 uppercase tracking-wider">
                              Miembros del grupo ({memberCount})
                            </span>
                            <div className="flex flex-wrap items-center gap-1">
                              {onTogglePickingGroupId && (
                                <button
                                  type="button"
                                  onClick={() => onTogglePickingGroupId(pickingGroupId === grp.id ? null : grp.id)}
                                  className={`px-2 py-1 rounded-lg text-[10px] font-bold cursor-pointer transition-all border ${
                                    pickingGroupId === grp.id
                                      ? 'bg-canela text-lienzo border-canela shadow-2xs ring-1 ring-canela/50 animate-pulse'
                                      : 'bg-lienzo text-carbon/80 border-carbon/20 hover:border-canela hover:text-canela'
                                  }`}
                                  title="Hacer clic en elementos del lienzo para añadirlos o quitarlos de este grupo"
                                >
                                  {pickingGroupId === grp.id ? 'Seleccionando en lienzo...' : 'Seleccionar en lienzo'}
                                </button>
                              )}
                              {selectedIds.length > 0 && (
                                <>
                                  <button
                                    type="button"
                                    onClick={() => handleAddSelectedToGroup(grp.id)}
                                    className="px-2 py-1 bg-canela/10 text-canela hover:bg-canela/20 rounded-lg text-[10px] font-bold cursor-pointer transition-all border border-canela/30"
                                    title="Añadir los elementos seleccionados en el lienzo a este grupo"
                                  >
                                    + Añadir sel. ({selectedIds.length})
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleRemoveSelectedFromGroup(grp.id)}
                                    className="px-2 py-1 bg-granada/10 text-granada hover:bg-granada/20 rounded-lg text-[10px] font-bold cursor-pointer transition-all border border-granada/30"
                                    title="Quitar los elementos seleccionados en el lienzo de este grupo"
                                  >
                                    - Quitar sel. ({selectedIds.length})
                                  </button>
                                </>
                              )}
                            </div>
                          </div>

                          <div className="flex flex-wrap gap-1.5 max-h-48 overflow-y-auto p-2 bg-carbon/5 rounded-xl border border-carbon/10">
                            {allItems.map(item => {
                              const isMember = (grp.memberIds || []).includes(item.id);
                              const isCanvasSelected = selectedIds.includes(item.id);
                              return (
                                <button
                                  key={item.id}
                                  type="button"
                                  onClick={() => {
                                    handleToggleGroupMember(grp.id, item.id);
                                    onSelectObjects?.([item.id]);
                                  }}
                                  className={`flex items-center space-x-1.5 px-2 py-1 rounded-lg border text-[10px] font-mono transition-all cursor-pointer select-none ${
                                    isMember
                                      ? 'bg-canela text-lienzo border-canela shadow-2xs font-bold'
                                      : 'bg-lienzo text-carbon/70 border-carbon/20 hover:border-canela/50 hover:text-carbon'
                                  } ${isCanvasSelected ? 'ring-2 ring-canela/60' : ''}`}
                                  title={`${isMember ? 'Quitar del grupo' : 'Añadir al grupo'}: ${item.label} (${item.id})`}
                                >
                                  <span className={`w-1.5 h-1.5 rounded-full ${isMember ? 'bg-lienzo' : 'bg-carbon/30'}`} />
                                  <DiagramObjectLabel label={item.label} id={item.id} className="text-[10px]" />
                                  <span className={`text-[8px] uppercase font-sans px-1 py-0.2 rounded ${
                                    isMember ? 'bg-lienzo/20 text-lienzo' : 'bg-carbon/10 text-carbon/50'
                                  }`}>
                                    {item.kind}
                                  </span>
                                </button>
                              );
                            })}
                          </div>
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
