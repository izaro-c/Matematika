import React, { useState } from 'react';
import type { VisualDiagramModel } from '../model/types';
import { listLayerSceneItemsFrontFirst, moveSceneItemVisual } from '../model/sceneOrdering';
import { readSceneItemDragPayload } from './SceneItemDragHandle';
import { getActiveSceneItemDragId, setActiveSceneItemDragId } from './sceneItemDragState';

export interface SceneStackEntry {
  id: string;
  label: string;
  subtitle: string;
  layerId: string;
}

interface SceneStackEditorProps {
  model: VisualDiagramModel;
  entries: SceneStackEntry[];
  selectedId?: string;
  onSelect?: (id: string) => void;
  onModelEdit: (model: VisualDiagramModel, command?: { label?: string; mergeKey?: string }) => void;
  onLayerLabelChange?: (layerId: string, label: string) => void;
  renderLayerActions?: (layer: VisualDiagramModel['layers'][number], index: number, layerCount: number) => React.ReactNode;
  renderEntryActions?: (entry: SceneStackEntry) => React.ReactNode;
}

function allowDrop(event: React.DragEvent) {
  event.preventDefault();
  event.stopPropagation();
  event.dataTransfer.dropEffect = 'move';
}

export const SceneStackEditor: React.FC<SceneStackEditorProps> = ({
  model,
  entries,
  selectedId = '',
  onSelect,
  onModelEdit,
  onLayerLabelChange,
  renderLayerActions,
  renderEntryActions,
}) => {
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [dropTarget, setDropTarget] = useState<{ layerId: string; index: number } | null>(null);
  const entryById = new Map(entries.map(entry => [entry.id, entry]));
  const orderedLayers = model.layers.slice().sort((a, b) => b.order - a.order);

  const finishDrag = () => {
    setDraggingId(null);
    setDropTarget(null);
    setActiveSceneItemDragId(null);
  };

  const handleDrop = (event: React.DragEvent, targetLayerId: string, visualIndex: number) => {
    event.preventDefault();
    event.stopPropagation();
    const objectId = readSceneItemDragPayload(event.dataTransfer, draggingId ?? getActiveSceneItemDragId());
    finishDrag();
    if (!objectId || !entryById.has(objectId)) return;
    onModelEdit(moveSceneItemVisual(model, objectId, targetLayerId, visualIndex), { label: `Reordenar ${objectId}`, mergeKey: 'scene-stack' });
  };

  const startDrag = (event: React.DragEvent, objectId: string, label: string) => {
    setDraggingId(objectId);
    setActiveSceneItemDragId(objectId);
    event.dataTransfer.effectAllowed = 'move';
    event.dataTransfer.setData('text/plain', objectId);
    if (event.dataTransfer.setDragImage) {
      const ghost = document.createElement('div');
      ghost.textContent = label;
      ghost.className = 'rounded border border-pavo/40 bg-pavo/10 px-3 py-1.5 text-xs font-bold text-carbon shadow-sm';
      ghost.style.position = 'absolute';
      ghost.style.top = '-1000px';
      document.body.appendChild(ghost);
      event.dataTransfer.setDragImage(ghost, 12, 16);
      window.setTimeout(() => ghost.remove(), 0);
    }
  };

  const DropLine = ({ layerId, index }: { layerId: string; index: number }) => {
    if (!draggingId) return <div className="h-0.5" />;
    const active = dropTarget?.layerId === layerId && dropTarget.index === index;
    return (
      <div
        className={`relative my-0.5 transition-all ${active ? 'h-5' : 'h-2.5'}`}
        onDragOver={allowDrop}
        onDragEnter={() => setDropTarget({ layerId, index })}
        onDrop={event => handleDrop(event, layerId, index)}
      >
        <div className={`absolute inset-x-0 top-1/2 flex -translate-y-1/2 items-center gap-1 px-1 ${active ? 'opacity-100' : 'opacity-35'}`}>
          <div className={`h-0.5 flex-1 rounded-full ${active ? 'bg-pavo shadow-[0_0_0_2px_color-mix(in_srgb,var(--theme-pavo)_30%,transparent)]' : 'bg-carbon/20'}`} />
          {active && <span className="shrink-0 rounded bg-pavo/15 px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-wide text-pavo">Soltar</span>}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-3" onDragLeave={event => {
      if (!event.currentTarget.contains(event.relatedTarget as Node | null)) finishDrag();
    }}
    >
      {orderedLayers.map((layer, layerIndex) => {
        const layerEntries = listLayerSceneItemsFrontFirst(model, layer.id)
          .map(item => entryById.get(item.id))
          .filter((entry): entry is SceneStackEntry => Boolean(entry));

        return (
          <section
            key={layer.id}
            className={`overflow-hidden rounded-lg border transition-colors ${dropTarget?.layerId === layer.id ? 'border-pavo/35' : 'border-carbon/10'}`}
          >
            <header className="border-b border-carbon/10 bg-gradient-to-b from-carbon/[0.04] to-transparent px-2.5 py-2">
              <div className="flex items-center gap-2">
                <span className="rounded bg-carbon/10 px-1.5 py-0.5 font-mono text-[8px] font-bold uppercase tracking-wider text-carbon/45">Capa</span>
                {onLayerLabelChange ? (
                  <input
                    aria-label={`Nombre de la capa ${layer.id}`}
                    className="min-w-0 flex-1 rounded border border-transparent bg-transparent px-1 text-xs font-bold text-carbon hover:border-carbon/15 focus:border-pavo/30"
                    value={layer.label}
                    onChange={event => onLayerLabelChange(layer.id, event.target.value)}
                  />
                ) : (
                  <span className="text-xs font-bold text-carbon">{layer.label}</span>
                )}
                <span className="font-mono text-[9px] text-carbon/40">{layerEntries.length}</span>
              </div>
              <div className="mt-1 flex items-center justify-between gap-2">
                <span className="text-[8px] font-bold uppercase tracking-wider text-pavo/80">↑ Delante</span>
                {renderLayerActions && (
                  <div className="flex flex-wrap justify-end gap-1">
                    {renderLayerActions(layer, layerIndex, orderedLayers.length)}
                  </div>
                )}
              </div>
            </header>

            <div
              className="bg-lienzo p-1.5"
              onDragOver={allowDrop}
              onDrop={event => handleDrop(event, layer.id, layerEntries.length)}
            >
              {layerEntries.length === 0 ? (
                <div
                  className={`rounded-md border border-dashed p-4 text-center text-[10px] ${dropTarget?.layerId === layer.id ? 'border-pavo/50 bg-pavo/5 text-pavo' : 'border-carbon/15 text-carbon/45'}`}
                  onDragOver={allowDrop}
                  onDragEnter={() => setDropTarget({ layerId: layer.id, index: 0 })}
                  onDrop={event => handleDrop(event, layer.id, 0)}
                >
                  Suelte aquí para colocar al frente de esta capa
                </div>
              ) : (
                <>
                  <DropLine layerId={layer.id} index={0} />
                  {layerEntries.map((entry, index) => {
                    const isSelected = selectedId === entry.id;
                    const isDragging = draggingId === entry.id;
                    return (
                      <React.Fragment key={entry.id}>
                        <div
                          draggable
                          onDragStart={event => startDrag(event, entry.id, entry.label)}
                          onDragEnd={finishDrag}
                          onDragOver={allowDrop}
                          onDrop={event => handleDrop(event, layer.id, index + 1)}
                          className={`flex cursor-grab items-stretch overflow-hidden rounded-md border transition-[transform,opacity,box-shadow,border-color] duration-150 active:cursor-grabbing ${isDragging ? 'scale-[0.97] border-pavo/50 bg-pavo/8 opacity-50 shadow-md ring-2 ring-pavo/25' : isSelected ? 'border-carbon bg-carbon text-lienzo shadow-sm' : 'border-carbon/10 bg-lienzo hover:border-carbon/25 hover:shadow-sm'}`}
                        >
                          <div className={`flex w-8 shrink-0 items-center justify-center border-r ${isSelected ? 'border-lienzo/20 text-lienzo/60' : 'border-carbon/10 text-carbon/30'}`} aria-hidden="true">≡</div>
                          <button
                            type="button"
                            className="min-h-11 min-w-0 flex-1 px-2 py-1.5 text-left"
                            onClick={() => onSelect?.(entry.id)}
                          >
                            <span className="block truncate text-sm font-bold">{entry.label}</span>
                            <span className={`block truncate text-[10px] ${isSelected ? 'text-lienzo/70' : 'text-carbon/50'}`}>{entry.subtitle}</span>
                          </button>
                          {renderEntryActions && (
                            <div className={`flex items-center border-l px-1 ${isSelected ? 'border-lienzo/20' : 'border-carbon/10'}`}>
                              {renderEntryActions(entry)}
                            </div>
                          )}
                        </div>
                        <DropLine layerId={layer.id} index={index + 1} />
                      </React.Fragment>
                    );
                  })}
                </>
              )}
              <p className="mt-1 text-center text-[8px] text-carbon/35">↓ Detrás</p>
            </div>
          </section>
        );
      })}
    </div>
  );
};

export default SceneStackEditor;
