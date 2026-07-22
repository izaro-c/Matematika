import { useCallback } from 'react';
import type React from 'react';
import type { CanvasTool } from '../model/types';

export interface WorkbenchKeyboardOptions {
  event: React.KeyboardEvent<HTMLDivElement>;
  canvasTool: CanvasTool;
  selectedId: string;
  handleClipboardKeyDown: (event: React.KeyboardEvent<HTMLDivElement>) => void;
  selectTool: () => void;
  deleteSelected: () => void;
  undo: () => void;
  redo: () => void;
}

export function handleWorkbenchKeyboard({
  event,
  canvasTool,
  selectedId,
  handleClipboardKeyDown,
  selectTool,
  deleteSelected,
  undo,
  redo,
}: WorkbenchKeyboardOptions): void {
  handleClipboardKeyDown(event);
  const target = event.target as HTMLElement;
  if (target.matches('input, textarea, select, [contenteditable="true"]')) return;
  if (event.key === 'Escape' && canvasTool !== 'select') {
    event.preventDefault();
    event.stopPropagation();
    selectTool();
    return;
  }
  if ((event.key === 'Delete' || event.key === 'Backspace') && selectedId) {
    event.preventDefault();
    deleteSelected();
    return;
  }
  if ((event.ctrlKey || event.metaKey) && event.key.toLocaleLowerCase() === 'z') {
    event.preventDefault();
    if (event.shiftKey) redo();
    else undo();
    return;
  }
  if ((event.ctrlKey || event.metaKey) && event.key.toLocaleLowerCase() === 'y') {
    event.preventDefault();
    redo();
  }
}

interface UseWorkbenchKeyboardOptions {
  canvasTool: CanvasTool;
  selectedId: string;
  handleClipboardKeyDown: (event: React.KeyboardEvent<HTMLDivElement>) => void;
  selectTool: () => void;
  deleteSelected: () => void;
  undo: () => void;
  redo: () => void;
}

export function useWorkbenchKeyboard({
  canvasTool,
  selectedId,
  handleClipboardKeyDown,
  selectTool,
  deleteSelected,
  undo,
  redo,
}: UseWorkbenchKeyboardOptions) {
  const onKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => handleWorkbenchKeyboard({
      event,
      canvasTool,
      selectedId,
      handleClipboardKeyDown,
      selectTool,
      deleteSelected,
      undo,
      redo,
    }),
    [canvasTool, selectedId, handleClipboardKeyDown, selectTool, deleteSelected, undo, redo],
  );
  return { onKeyDown };
}
