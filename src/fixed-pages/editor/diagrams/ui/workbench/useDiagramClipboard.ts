import { useState } from 'react';
import { useI18n } from '@/i18n';
import type React from 'react';
import type { VisualDiagramModel } from '../../model/types';
import {
  createDiagramClipboard,
  parseDiagramClipboard,
  pasteDiagramClipboard,
  serializeDiagramClipboard,
} from '../../model/elements/diagramClipboard';

type DiagramClipboardPayload = NonNullable<ReturnType<typeof createDiagramClipboard>>;

interface UseDiagramClipboardOptions {
  model: VisualDiagramModel | null;
  selectedIds: readonly string[];
  onModelEdit: (model: VisualDiagramModel, options?: { label: string }) => void;
  onSelectMany: (ids: string[], primaryId?: string) => void;
  onShowObjects: () => void;
}

function browserClipboard(): Clipboard | undefined {
  return typeof navigator === 'undefined' ? undefined : navigator.clipboard;
}

export function useDiagramClipboard({ model, selectedIds, onModelEdit, onSelectMany, onShowObjects }: UseDiagramClipboardOptions) {
  const { t } = useI18n();
  const [payload, setPayload] = useState<DiagramClipboardPayload | null>(null);
  const [status, setStatus] = useState('');

  const store = (nextPayload: DiagramClipboardPayload, message: string) => {
    setPayload(nextPayload);
    setStatus(message);
    browserClipboard()?.writeText?.(serializeDiagramClipboard(nextPayload)).catch(() => undefined);
  };

  const copySelected = () => {
    if (!model || selectedIds.length === 0) return;
    const nextPayload = createDiagramClipboard(model, selectedIds);
    if (!nextPayload) return;
    store(nextPayload, selectedIds.length === 1 ? t('editor.diagramWorkbench.clipboardCopiedOne') : t('editor.diagramWorkbench.clipboardCopiedOther', { count: selectedIds.length }));
  };

  const copyGroup = (groupId: string) => {
    if (!model) return;
    const group = model.groups.find(item => item.id === groupId);
    const nextPayload = createDiagramClipboard(model, [], [groupId]);
    if (!group || !nextPayload) return;
    store(nextPayload, t(group.memberIds.length === 1 ? 'editor.diagramWorkbench.groupCopiedOne' : 'editor.diagramWorkbench.groupCopiedOther', { label: group.label, count: group.memberIds.length }));
  };

  const apply = (nextPayload: DiagramClipboardPayload) => {
    if (!model) return;
    const result = pasteDiagramClipboard(model, nextPayload);
    onModelEdit(result.model, { label: `Pegar ${result.pastedIds.length} objeto(s)` });
    onSelectMany(result.pastedIds, result.selectedId);
    onShowObjects();
    setStatus(t(result.pastedIds.length === 1 ? 'editor.diagramWorkbench.clipboardPastedOne' : 'editor.diagramWorkbench.clipboardPastedOther', { count: result.pastedIds.length }));
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
    if (key === 'c' && selectedIds.length > 0) {
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
