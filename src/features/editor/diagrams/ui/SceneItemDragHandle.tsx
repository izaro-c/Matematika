import React from 'react';
import { setActiveSceneItemDragId } from './sceneItemDragState';

export const SCENE_ITEM_DRAG_MIME = 'application/x-matematika-scene-item';

export function readSceneItemDragPayload(dataTransfer: DataTransfer | null, fallbackId?: string | null): string | null {
  if (fallbackId) return fallbackId;
  if (!dataTransfer) return null;
  const payload = dataTransfer.getData(SCENE_ITEM_DRAG_MIME) || dataTransfer.getData('text/plain');
  return payload.trim() || null;
}

interface SceneItemDragHandleProps {
  objectId: string;
  label: string;
  className?: string;
}

export const SceneItemDragHandle: React.FC<SceneItemDragHandleProps> = ({ objectId, label, className = '' }) => (
  <div
    role="button"
    tabIndex={0}
    draggable
    aria-label={`Reordenar ${label}`}
    title="Arrastrar para cambiar el orden o la capa"
    className={`flex h-11 w-full cursor-grab items-center justify-center text-carbon/35 hover:text-carbon/70 active:cursor-grabbing ${className}`}
    onKeyDown={event => {
      if (event.key === 'Enter' || event.key === ' ') event.preventDefault();
    }}
    onClick={event => event.stopPropagation()}
    onDragStart={event => {
      setActiveSceneItemDragId(objectId);
      event.dataTransfer.effectAllowed = 'move';
      event.dataTransfer.setData('text/plain', objectId);
      event.dataTransfer.setData(SCENE_ITEM_DRAG_MIME, objectId);
      event.stopPropagation();
    }}
    onDragEnd={() => {
      setActiveSceneItemDragId(null);
    }}
  >
    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
      <path d="M9 6.5h1.5M13.5 6.5H15M9 12h1.5M13.5 12H15M9 17.5h1.5M13.5 17.5H15" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  </div>
);
