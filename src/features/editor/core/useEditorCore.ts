import { useCallback, useMemo, useState, type SetStateAction } from 'react';
import type { FileNode } from '../lib/editorContracts';
import type { DirtyState, EditorMode } from './editorTypes';
import type { EditorValidationResult } from './editorTypes';
import type { Block, BlockType } from './parser';
import {
  parseEditorDocument,
  reparseEditedDocument,
  getVisualCapabilities,
  type EditorDocument,
  type ProjectedBlock,
  type SourceEdit
} from '../document';

export type VisualSavePolicy = 'disabled' | 'manual-reviewed' | 'enabled';
export const VISUAL_SAVE_POLICY: VisualSavePolicy = 'disabled';

function blockText(block: ProjectedBlock): string {
  if (block.kind === 'opaque') return block.source;
  if (block.data && typeof block.data === 'object' && 'text' in block.data) {
    return String((block.data as { text: unknown }).text);
  }
  return block.originalSource;
}

function mapProjectedBlocks(projected: ProjectedBlock[]): Block[] {
  return projected.map(block => ({
    id: block.id,
    type: block.kind === 'editable' ? block.blockType as BlockType : 'advancedMdx',
    content: blockText(block),
    metadata: block.kind === 'editable'
      ? {
          location: block.location,
          editRange: block.editRange,
          originalSource: block.originalSource,
          editable: true,
          ...(block.blockType === 'heading' && block.data && typeof block.data === 'object'
            ? { level: (block.data as { depth?: number }).depth }
            : {})
        }
      : { location: block.location, opaque: true, reason: block.reason, nodeType: block.nodeType }
  }));
}

function sliceRanges(source: string, ranges: Array<{ start: number; end: number }>): string {
  return ranges.map(range => source.slice(range.start, range.end)).join('\n');
}

const blockedMessage = 'Acción visual bloqueada: todavía no existe un parche localizado demostrablemente lossless.';

export const useEditorCore = () => {
  const [files, setFiles] = useState<FileNode[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentFile, setCurrentFile] = useState<string | null>(null);
  const [editorMode, setEditorMode] = useState<EditorMode>('code');
  const [metadata] = useState<Record<string, unknown>>({});
  const [imports, setImportsView] = useState('');
  const [exports, setExportsView] = useState('');
  const [blocks, setBlocksView] = useState<Block[]>([]);
  // For MDX this is intentionally the complete source, despite the historical name.
  const [rawBody, setRawSource] = useState('');
  const [doc, setDoc] = useState<EditorDocument | null>(null);
  const [saving, setSaving] = useState(false);
  const [dirtyState, setDirtyState] = useState<DirtyState>('clean');
  const [message, setMessage] = useState('');

  const compatibility = doc?.compatibility ?? 'unsupported';
  const compatibilityReasons = doc?.compatibilityReasons ?? [];
  const capabilities = useMemo(() => getVisualCapabilities(compatibility), [compatibility]);
  const isDiagramSource = currentFile?.endsWith('.tsx') ?? false;
  const validation = useMemo<EditorValidationResult>(() => {
    if (isDiagramSource) return { issues: [], canSave: true, errorCount: 0, warningCount: 0 };
    const critical = doc?.diagnostics.filter(item => item.severity === 'critical') ?? [];
    return {
      issues: critical.map(item => ({ id: item.code, area: 'body' as const, severity: 'error' as const, message: item.message })),
      canSave: critical.length === 0,
      errorCount: critical.length,
      warningCount: 0
    };
  }, [doc, isDiagramSource]);

  const loadFileList = useCallback(async () => {
    try {
      const response = await fetch('/api/list-content');
      if (!response.ok) throw new Error(await response.text());
      setFiles(await response.json());
    } catch (error) {
      console.error('Error cargando lista de archivos:', error);
    }
  }, []);

  const syncDocument = useCallback((nextDoc: EditorDocument) => {
    setDoc(nextDoc);
    setRawSource(nextDoc.source);
    setBlocksView(mapProjectedBlocks(nextDoc.bodyBlocks));
    setImportsView(sliceRanges(nextDoc.source, nextDoc.envelope.importRanges));
    setExportsView(sliceRanges(nextDoc.source, nextDoc.envelope.exportRanges));
  }, []);

  const openFile = useCallback(async (path: string) => {
    setLoading(true);
    setMessage('');
    try {
      const response = await fetch(`/api/content?path=${encodeURIComponent(path)}`);
      if (!response.ok) throw new Error(await response.text());
      const source = await response.text();
      if (path.endsWith('.mdx')) syncDocument(parseEditorDocument(source));
      else {
        setDoc(null);
        setRawSource(source);
        setBlocksView([]);
        setImportsView('');
        setExportsView('');
      }
      setCurrentFile(path);
      setEditorMode('code');
      setDirtyState('clean');
    } catch (error) {
      console.error(error);
      setMessage('Error cargando el archivo');
    } finally {
      setLoading(false);
    }
  }, [syncDocument]);

  const toggleEditorMode = useCallback(() => {
    if (editorMode === 'visual') {
      if (doc) setRawSource(doc.source);
      setEditorMode('code');
      return;
    }
    if (!currentFile?.endsWith('.mdx')) return;
    const nextDoc = parseEditorDocument(rawBody);
    if (nextDoc.compatibility === 'unsupported') {
      setMessage(`Modo visual bloqueado: ${nextDoc.compatibilityReasons.join(' ')}`);
      return;
    }
    syncDocument(nextDoc);
    setEditorMode('visual');
  }, [currentFile, doc, editorMode, rawBody, syncDocument]);

  const updateRawBody = useCallback((source: string) => {
    setRawSource(source);
    if (currentFile?.endsWith('.mdx')) setDoc(parseEditorDocument(source));
    setDirtyState('dirty');
  }, [currentFile]);

  const updateBlock = useCallback((id: string, content: string, _metadata?: Record<string, unknown>) => {
    if (!doc || !capabilities.canEditSafeBlocks) {
      setMessage(blockedMessage);
      return;
    }
    const block = doc.bodyBlocks.find(candidate => candidate.id === id);
    if (!block || block.kind !== 'editable') {
      setMessage('Acción visual bloqueada: los bloques opacos son inmutables.');
      return;
    }
    const edit: SourceEdit = {
      operationId: `edit-${id}-${doc.sourceHash}`,
      blockId: id,
      range: block.editRange,
      expectedSource: block.originalSource,
      replacement: content
    };
    try {
      const nextDoc = reparseEditedDocument(doc, doc.sourceHash, [edit]);
      syncDocument(nextDoc);
      setDirtyState('dirty');
      setMessage('Cambio visual aplicado localmente; el guardado visual permanece deshabilitado.');
    } catch (error) {
      setMessage(`Cambio rechazado: ${error instanceof Error ? error.message : String(error)}`);
    }
  }, [capabilities.canEditSafeBlocks, doc, syncDocument]);

  const blockUnsafeAction = useCallback((_id?: string) => setMessage(blockedMessage), []);
  const setMetadata = useCallback((_next: SetStateAction<Record<string, unknown>>) => blockUnsafeAction(), [blockUnsafeAction]);
  const setImports = useCallback((_next: SetStateAction<string>) => blockUnsafeAction(), [blockUnsafeAction]);
  const setExports = useCallback((_next: SetStateAction<string>) => blockUnsafeAction(), [blockUnsafeAction]);
  const setBlocks = useCallback((_next: SetStateAction<Block[]>) => blockUnsafeAction(), [blockUnsafeAction]);

  const saveCurrentFile = useCallback(async (): Promise<boolean> => {
    if (!currentFile) return false;
    if (editorMode === 'visual' && !isDiagramSource) {
      setDirtyState('dirty');
      setMessage('El guardado visual está desactivado por contención de seguridad.');
      return false;
    }
    const candidate = rawBody;
    if (currentFile.endsWith('.mdx') && parseEditorDocument(candidate).compatibility === 'unsupported') {
      setDirtyState('blocked');
      setMessage('No se puede guardar: el source MDX actual no se puede analizar.');
      return false;
    }
    setSaving(true);
    setDirtyState('saving');
    try {
      const response = await fetch('/api/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ path: currentFile, content: candidate })
      });
      if (!response.ok) throw new Error(await response.text());
      setDirtyState('clean');
      setMessage(isDiagramSource ? 'Diagrama actualizado' : 'Cambios aplicados al archivo real');
      return true;
    } catch (error) {
      console.error('Error aplicando cambios:', error);
      setDirtyState('dirty');
      setMessage(isDiagramSource ? 'Error al guardar diagrama' : 'Error al aplicar cambios');
      return false;
    } finally {
      setSaving(false);
    }
  }, [currentFile, editorMode, isDiagramSource, rawBody]);

  return {
    files, loading, currentFile, editorMode, metadata, imports, exports, blocks, rawBody,
    saving, dirtyState, validation, message, loadFileList, openFile, toggleEditorMode,
    updateRawBody, updateBlock, saveCurrentFile, compatibility, compatibilityReasons, capabilities,
    removeBlock: (id: string) => blockUnsafeAction(id),
    addBlock: (_index: number, _type: BlockType) => blockUnsafeAction(),
    moveBlock: (_from: number, _to: number) => blockUnsafeAction(),
    setMetadata,
    setImports,
    setExports,
    setBlocks,
    canMutateVisualStructure: false,
    canEditVisualMetadata: false
  };
};
