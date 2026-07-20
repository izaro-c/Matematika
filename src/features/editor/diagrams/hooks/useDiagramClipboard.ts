import { useState } from 'react';
import type React from 'react';
import type { VisualDiagramModel } from '../model/types';
import {
  createDiagramClipboard,
  parseDiagramClipboard,
  pasteDiagramClipboard,
  serializeDiagramClipboard,
} from '../model/diagramClipboard';

type DiagramClipboardPayload = NonNullable<ReturnType<typeof createDiagramClipboard>>;

interface UseDiagramClipboardOptions {
  model: VisualDiagramModel | null;
  selectedId: string;
  onModelEdit: (model: VisualDiagramModel, options?: { label: string }) => void;
  onSelect: (id: string) => void;
  onShowObjects: () => void;
}

function browserClipboard(): Clipboard | undefined {
  return typeof navigator === 'undefined' ? undefined : navigator.clipboard;
}

export function useDiagramClipboard({ model, selectedId, onModelEdit, onSelect, onShowObjects }: UseDiagramClipboardOptions) {
  const [payload, setPayload] = useState<DiagramClipboardPayload | null>(null);
  const [status, setStatus] = useState('');

  const store = (nextPayload: DiagramClipboardPayload, message: string) => {
    setPayload(nextPayload);
    setStatus(message);
    browserClipboard()?.writeText?.(serializeDiagramClipboard(nextPayload)).catch(() => undefined);
  };

  const copySelected = () => {
    if (!model || !selectedId) return;
    const group = model.groups.find(item => item.id === selectedId);
    const nextPayload = createDiagramClipboard(model, group ? [] : [selectedId], group ? [group.id] : []);
    if (!nextPayload) return;
    store(nextPayload, group ? `Grupo «${group.label}» copiado.` : 'Objeto copiado.');
  };

  const copyGroup = (groupId: string) => {
    if (!model) return;
    const group = model.groups.find(item => item.id === groupId);
    const nextPayload = createDiagramClipboard(model, [], [groupId]);
    if (!group || !nextPayload) return;
    store(nextPayload, `Grupo «${group.label}» copiado con ${group.memberIds.length} objeto(s).`);
  };

  const apply = (nextPayload: DiagramClipboardPayload) => {
    if (!model) return;
    const result = pasteDiagramClipboard(model, nextPayload);
    onModelEdit(result.model, { label: `Pegar ${result.pastedIds.length} objeto(s)` });
    onSelect(result.selectedId);
    onShowObjects();
    setStatus(`${result.pastedIds.length} objeto(s) pegado(s). Las referencias internas se han actualizado.`);
  };

  const paste = async () => {
    let nextPayload = payload;
    try {
      const externalText = await browserClipboard()?.readText?.();
      if (externalText) nextPayload = parseDiagramClipboard(externalText) ?? nextPayload;
    } catch {
      // El portapapeles interno sigue disponible cuando el navegador deniega la lectura.
    }
    if (nextPayload) apply(nextPayload);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const target = event.target as HTMLElement;
    if (target.matches('input, textarea, select, [contenteditable="true"]')) return;
    if (!(event.ctrlKey || event.metaKey) || event.altKey) return;
    const key = event.key.toLocaleLowerCase();
    if (key === 'c' && selectedId) {
      event.preventDefault();
      copySelected();
    }
    if (key === 'v' && (payload || browserClipboard())) {
      event.preventDefault();
      void paste();
    }
  };

  return {
    status,
    canPaste: Boolean(payload || browserClipboard()?.readText),
    copySelected,
    copyGroup,
    paste,
    handleKeyDown,
  };
}
