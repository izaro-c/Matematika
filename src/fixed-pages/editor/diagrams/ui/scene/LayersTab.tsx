import React, { useState } from 'react';
import { useI18n } from '@/i18n';
import type { VisualDiagramModel } from '../../model/types';
import type { DiagramLayer } from '@/diagrams';
import {
  bringSceneItemForward,
  listLayerSceneItemsFrontFirst,
  moveSceneItemToLayer,
  moveSceneItemVisual,
  sendSceneItemBackward,
} from '../../model/scene/sceneOrdering';
import { generateUniqueDiagramId, sanitizeDiagramId } from '../../model/elements/diagramElements';
import { allDiagramIds, renameDiagramId } from '../../model/tools/graphCommands';
import { ensureLayerExists, ensureSceneStack } from './sceneStack';
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

export interface SceneItem {
  id: string;
  label: string;
  kind: string;
  layerId?: string;
  order?: number;
}

interface LayersTabProps {
  /** Modelo con la pila de capas ya normalizada. */
  stacked: VisualDiagramModel;
  layers: DiagramLayer[];
  allItems: SceneItem[];
  onUpdateModel: (nextModel: VisualDiagramModel, label: string) => void;
}

/** Pestaña «Capas»: alta, orden por arrastre, visibilidad, bloqueo y contenido de cada capa. */
export const LayersTab: React.FC<LayersTabProps> = ({ stacked, layers, allItems, onUpdateModel }) => {
  const { t } = useI18n();
  const [newLayerLabel, setNewLayerLabel] = useState('');
  const [expandedLayerId, setExpandedLayerId] = useState<string | null>(null);
  const [draggingItemId, setDraggingItemId] = useState<string | null>(null);
  const [draggingLayerId, setDraggingLayerId] = useState<string | null>(null);
  const [dropTargetLayerId, setDropTargetLayerId] = useState<string | null>(null);
  const [dropTargetLayerIndex, setDropTargetLayerIndex] = useState<number | null>(null);
  const [dropInsertBeforeId, setDropInsertBeforeId] = useState<string | null>(null);

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

  return (
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
            placeholder={t('editor.diagramScene.newLayer')}
            className="flex-1 bg-lienzo border border-carbon/20 rounded-xl px-3 py-1.5 text-xs text-carbon placeholder-carbon/40 focus:border-canela focus:ring-1 focus:ring-canela outline-none transition-all shadow-2xs"
          />
          <button
            type="button"
            onClick={handleAddLayer}
            disabled={!newLayerLabel.trim()}
            className="flex items-center space-x-1 px-3 py-1.5 bg-canela text-lienzo rounded-xl font-bold hover:bg-canela/90 disabled:opacity-40 transition-all cursor-pointer text-xs shadow-2xs shrink-0"
          >
            <IconPlus className="w-3.5 h-3.5" />
            <span>{t('editor.diagramScene.layer')}</span>
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
                        title={t('editor.diagramScene.dragToReorderLayer')}
                        aria-label={t('editor.diagramScene.dragLayer', { label: layer.label })}
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
                            {t('editor.diagramScene.dropHere')}
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
                        title={t('editor.diagramScene.moveLayerUpTitle')}
                        aria-label={t('editor.diagramScene.moveLayerUp', { label: layer.label })}
                      >
                        <IconChevronUp className="w-3.5 h-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={() => handleMoveLayer(layer.id, 1)}
                        disabled={layerIndex >= layers.length - 1}
                        className="p-1 text-carbon/60 hover:text-carbon hover:bg-carbon/10 rounded cursor-pointer disabled:opacity-20 transition-colors"
                        title={t('editor.diagramScene.moveLayerDownTitle')}
                        aria-label={t('editor.diagramScene.moveLayerDown', { label: layer.label })}
                      >
                        <IconChevronDown className="w-3.5 h-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={() => handleToggleLayerVisible(layer.id)}
                        className={`p-1 rounded-lg transition-colors cursor-pointer ${
                          layer.visible !== false ? 'text-canela hover:bg-canela/10' : 'text-carbon/30 hover:bg-carbon/10'
                        }`}
                        title={layer.visible !== false ? t('editor.diagramScene.hideLayer') : t('editor.diagramScene.showLayer')}
                        aria-label={layer.visible !== false ? t('editor.diagramScene.hideLayer') : t('editor.diagramScene.showLayer')}
                      >
                        {layer.visible !== false ? <IconEye /> : <IconEyeOff />}
                      </button>

                      <button
                        type="button"
                        onClick={() => handleToggleLayerLock(layer.id)}
                        className={`p-1 rounded-lg transition-colors cursor-pointer ${
                          layer.locked ? 'text-terracota hover:bg-terracota/10' : 'text-carbon/30 hover:bg-carbon/10'
                        }`}
                        title={layer.locked ? t('editor.diagramScene.unlockLayer') : t('editor.diagramScene.lockLayer')}
                        aria-label={layer.locked ? t('editor.diagramScene.unlockLayer') : t('editor.diagramScene.lockLayer')}
                      >
                        {layer.locked ? <IconLock /> : <IconUnlock />}
                      </button>

                      {layerItems.length === 0 && (
                        <button
                          type="button"
                          onClick={() => handleDeleteLayer(layer.id)}
                          className="p-1 text-granada/70 hover:text-granada hover:bg-granada/10 rounded-lg transition-colors cursor-pointer"
                          title={t('editor.diagramScene.deleteEmptyLayer')}
                          aria-label={t('editor.diagramScene.deleteEmptyLayer')}
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
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-carbon/60 mb-1">{t('editor.diagramScene.layerId')}</label>
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
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-carbon/60 mb-1">{t('editor.diagramScene.name')}</label>
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
                          {isDropTarget ? t('editor.diagramScene.dropToAssignLayer') : t('editor.diagramScene.emptyLayer')}
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
                                    title={t('editor.diagramScene.dragItemTitle')}
                                    aria-label={t('editor.diagramScene.dragItem', { id: item.id })}
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
                                    title={t('editor.diagramScene.bringForward')}
                                    aria-label={t('editor.diagramScene.bringForwardItem', { id: item.id })}
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
                                    title={t('editor.diagramScene.sendBackward')}
                                    aria-label={t('editor.diagramScene.sendBackwardItem', { id: item.id })}
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
                                    aria-label={t('editor.diagramScene.changeLayerOf', { id: item.id })}
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
  );
};
