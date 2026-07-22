let activeSceneItemDragId: string | null = null;

export function setActiveSceneItemDragId(id: string | null): void {
  activeSceneItemDragId = id;
}

export function getActiveSceneItemDragId(): string | null {
  return activeSceneItemDragId;
}
