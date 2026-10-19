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
import { Button, Card, IconButton, RowButton, controlClassName } from '@/fixed-pages/editor/ui/primitives';

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
            className={`${controlClassName} flex-1`}
          />
          <Button size="sm" variant="primary" className="shrink-0" onClick={handleAddLayer} disabled={!newLayerLabel.trim()}>
            <IconPlus className="w-3.5 h-3.5" />
            <span>{t('editor.diagramScene.layer')}</span>
          </Button>
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
                      <RowButton className="min-w-0 flex-1" onClick={() => setExpandedLayerId(isExpanded ? null : layer.id)}>
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
                      </RowButton>
                    </div>

                    <div className="flex items-center space-x-1 shrink-0">
                      <IconButton size="sm" label={t('editor.diagramScene.moveLayerUp', { label: layer.label })} title={t('editor.diagramScene.moveLayerUpTitle')} onClick={() => handleMoveLayer(layer.id, -1)} disabled={layerIndex <= 0}>
                        <IconChevronUp className="w-3.5 h-3.5" />
                      </IconButton>

                      <IconButton size="sm" label={t('editor.diagramScene.moveLayerDown', { label: layer.label })} title={t('editor.diagramScene.moveLayerDownTitle')} onClick={() => handleMoveLayer(layer.id, 1)} disabled={layerIndex >= layers.length - 1}>
                        <IconChevronDown className="w-3.5 h-3.5" />
                      </IconButton>

                      <Button size="sm" aria-pressed={layer.visible !== false} onClick={() => handleToggleLayerVisible(layer.id)} title={layer.visible !== false ? t('editor.diagramScene.hideLayer') : t('editor.diagramScene.showLayer')} aria-label={layer.visible !== false ? t('editor.diagramScene.hideLayer') : t('editor.diagramScene.showLayer')}>
                        {layer.visible !== false ? <IconEye /> : <IconEyeOff />}
                      </Button>

                      <Button size="sm" aria-pressed={layer.locked} onClick={() => handleToggleLayerLock(layer.id)} title={layer.locked ? t('editor.diagramScene.unlockLayer') : t('editor.diagramScene.lockLayer')} aria-label={layer.locked ? t('editor.diagramScene.unlockLayer') : t('editor.diagramScene.lockLayer')}>
                        {layer.locked ? <IconLock /> : <IconUnlock />}
                      </Button>

                      {layerItems.length === 0 && (
                        <IconButton size="sm" tone="danger" label={t('editor.diagramScene.deleteEmptyLayer')} title={t('editor.diagramScene.deleteEmptyLayer')} onClick={() => handleDeleteLayer(layer.id)}>
                          <IconTrash className="w-3.5 h-3.5" />
                        </IconButton>
                      )}
                    </div>
                  </div>

                {/* Cuerpo Expandido de Capa */}
                {isExpanded && (
                  <div className="p-3 border-t border-carbon/10 bg-lienzo space-y-3">
                    {/* Edición rápida ID y Nombre */}
                    <Card className="grid grid-cols-2 gap-2">
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
                          className={`${controlClassName} font-mono`}
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-carbon/60 mb-1">{t('editor.diagramScene.name')}</label>
                        <input
                          type="text"
                          value={layer.label}
                          onChange={e => handleRenameLayerLabel(layer.id, e.target.value)}
                          className={controlClassName}
                        />
                      </div>
                    </Card>

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
                                  <IconButton size="sm" label={t('editor.diagramScene.bringForwardItem', { id: item.id })} title={t('editor.diagramScene.bringForward')} onClick={e => {
                                      e.preventDefault();
                                      e.stopPropagation();
                                      handleBringForward(item.id);
                                    }} disabled={frontIndex <= 0}>
                                    <IconChevronUp className="w-3 h-3" />
                                  </IconButton>
                                  <IconButton size="sm" label={t('editor.diagramScene.sendBackwardItem', { id: item.id })} title={t('editor.diagramScene.sendBackward')} onClick={e => {
                                      e.preventDefault();
                                      e.stopPropagation();
                                      handleSendBackward(item.id);
                                    }} disabled={frontIndex < 0 || frontIndex >= frontIds.length - 1}>
                                    <IconChevronDown className="w-3 h-3" />
                                  </IconButton>
                                  <select
                                    value={item.layerId}
                                    onChange={e => {
                                      e.stopPropagation();
                                      if (e.target.value !== item.layerId) {
                                        handleMoveItemToLayer(item.id, e.target.value);
                                      }
                                    }}
                                    onClick={e => e.stopPropagation()}
                                    className={controlClassName}
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
