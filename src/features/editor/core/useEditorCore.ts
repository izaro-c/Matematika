import { useState, useCallback, useMemo, useRef, useEffect, type SetStateAction } from 'react';
import { parseMDX, stringifyMDX } from '@/shared/lib/mdxParser';
import { createBlockId, parseBodyToBlocks, stringifyBlocksToBody, Block, BlockType } from './parser';
import type { FileNode } from '../lib/editorContracts';
import { validateEditorDocument } from './validation';
import type { DirtyState, EditorMode } from './editorTypes';

export type VisualSavePolicy = 'disabled' | 'manual-reviewed' | 'enabled';
export const VISUAL_SAVE_POLICY: VisualSavePolicy = 'disabled';

export const useEditorCore = () => {
  const [files, setFiles] = useState<FileNode[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentFile, setCurrentFile] = useState<string | null>(null);

  // Editor Híbrido Mode: 'visual' | 'code'
  const [editorMode, setEditorMode] = useState<EditorMode>('visual');

  // Representación del contenido
  const [metadata, setMetadata] = useState<Record<string, unknown>>({});
  const [imports, setImports] = useState('');
  const [exports, setExports] = useState('');
  const [blocks, setBlocks] = useState<Block[]>([]); // Para el modo visual
  const [rawBody, setRawBody] = useState(''); // Para el modo código (Monaco)

  // Estados de carga/guardado
  const [saving, setSaving] = useState(false);
  const [dirtyState, setDirtyState] = useState<DirtyState>('clean');
  const [message, setMessage] = useState('');
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (saveTimerRef.current) {
        clearTimeout(saveTimerRef.current);
      }
    };
  }, []);

  const visualBody = useMemo(() => stringifyBlocksToBody(blocks), [blocks]);
  const activeBody = editorMode === 'visual' ? visualBody : rawBody;
  const isDiagramSource = currentFile?.endsWith('.tsx') ?? false;
  const validation = useMemo(() => validateEditorDocument({
    metadata,
    imports,
    exports,
    blocks,
    rawBody: activeBody
  }), [metadata, imports, exports, blocks, activeBody]);
  const activeValidation = isDiagramSource
    ? { issues: [], canSave: true, errorCount: 0, warningCount: 0 }
    : validation;

  // Cargar lista de archivos del backend
  const loadFileList = useCallback(async () => {
    try {
      const res = await fetch('/api/list-content');
      const data = await res.json();
      setFiles(data);
    } catch (e) {
      console.error('Error cargando lista de archivos:', e);
    }
  }, []);

  // Guardar borrador en el servidor
  const saveDraft = useCallback(async (meta: Record<string, unknown>, imp: string, exp: string, bodyText: string, file: string) => {
    if (file === 'nuevo_archivo.mdx') return;
    if (VISUAL_SAVE_POLICY === 'disabled') {
      setMessage('Autoguardado desactivado (modo experimental)');
      setDirtyState('dirty');
      return;
    }
    setSaving(true);
    setDirtyState('saving');
    try {
      const content = file.endsWith('.tsx') ? bodyText : stringifyMDX(meta, imp, bodyText, exp);
      await fetch('/api/draft', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ path: file, content })
      });
      setMessage('Guardado automáticamente');
      setDirtyState('draft');
    } catch (e) {
      console.error('Error guardando borrador:', e);
      setMessage('Error al guardar borrador');
      setDirtyState('dirty');
    } finally {
      setSaving(false);
    }
  }, []);

  // Programar autoguardado rápido
  const scheduleSave = useCallback((meta: Record<string, unknown>, imp: string, exp: string, bodyText: string, file: string) => {
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(() => {
      saveDraft(meta, imp, exp, bodyText, file);
    }, 500);
  }, [saveDraft]);

  // Abrir un archivo para edición
  const openFile = useCallback(async (path: string) => {
    if (saveTimerRef.current) {
      clearTimeout(saveTimerRef.current);
      saveTimerRef.current = null;
    }
    setLoading(true);
    setMessage('');
    try {
      const res = await fetch(`/api/content?path=${encodeURIComponent(path)}`);
      const text = await res.text();

      if (path.endsWith('.mdx')) {
        const parsed = parseMDX(text);
        setMetadata(parsed.metadata);
        setImports(parsed.imports);
        setExports(parsed.exports);
        setRawBody(parsed.body);
        
        // Parsear el body MDX en bloques JSON
        const parsedBlocks = parseBodyToBlocks(parsed.body);
        setBlocks(parsedBlocks);
      } else {
        // Archivos sin MDX (ej: diagramas .tsx)
        setMetadata({});
        setImports('');
        setExports('');
        setRawBody(text);
        setBlocks([]);
      }
      setCurrentFile(path);
      setEditorMode(path.endsWith('.tsx') ? 'code' : 'visual');
      setDirtyState('clean');
    } catch (e) {
      console.error(e);
      setMessage('Error cargando el archivo');
    } finally {
      setLoading(false);
    }
  }, []);

  const saveCurrentFile = useCallback(async (): Promise<boolean> => {
    if (!currentFile) return false;

    if (editorMode === 'visual' && VISUAL_SAVE_POLICY === 'disabled') {
      setDirtyState('dirty');
      setMessage('El guardado visual está desactivado por contención de seguridad.');
      return false;
    }

    if (currentFile.endsWith('.tsx')) {
      setSaving(true);
      setDirtyState('saving');
      try {
        const response = await fetch('/api/content', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ path: currentFile, content: rawBody })
        });
        if (!response.ok) throw new Error(await response.text());
        setMessage('Diagrama actualizado');
        setDirtyState('clean');
        return true;
      } catch (e) {
        console.error('Error guardando diagrama:', e);
        setMessage('Error al guardar diagrama');
        setDirtyState('dirty');
        return false;
      } finally {
        setSaving(false);
      }
    }

    const bodyText = editorMode === 'visual' ? stringifyBlocksToBody(blocks) : rawBody;
    const currentValidation = validateEditorDocument({ metadata, imports, exports, blocks, rawBody: bodyText });

    if (!currentValidation.canSave) {
      setDirtyState('blocked');
      setMessage(`No se puede aplicar: ${currentValidation.errorCount} errores críticos.`);
      return false;
    }

    setSaving(true);
    setDirtyState('saving');
    try {
      const content = stringifyMDX(metadata, imports, bodyText, exports);
      const response = await fetch('/api/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ path: currentFile, content })
      });
      if (!response.ok) throw new Error(await response.text());
      setMessage('Cambios aplicados al archivo real');
      setDirtyState('clean');
      return true;
    } catch (e) {
      console.error('Error aplicando cambios:', e);
      setMessage('Error al aplicar cambios');
      setDirtyState('dirty');
      return false;
    } finally {
      setSaving(false);
    }
  }, [currentFile, editorMode, blocks, rawBody, metadata, imports, exports]);

  // Cambiar entre Modo Visual y Modo Código
  const toggleEditorMode = useCallback(() => {
    if (saveTimerRef.current) {
      clearTimeout(saveTimerRef.current);
      saveTimerRef.current = null;
    }
    if (editorMode === 'visual') {
      // Sincronizar bloques actuales -> código Monaco
      const newBody = stringifyBlocksToBody(blocks);
      setRawBody(newBody);
      setEditorMode('code');
    } else {
      // Sincronizar código Monaco -> bloques visuales
      const newBlocks = parseBodyToBlocks(rawBody);
      setBlocks(newBlocks);
      setEditorMode('visual');
    }
  }, [editorMode, blocks, rawBody]);

  const updateMetadataState = useCallback((next: SetStateAction<Record<string, unknown>>) => {
    setMetadata(prev => {
      const updated = typeof next === 'function'
        ? (next as (value: Record<string, unknown>) => Record<string, unknown>)(prev)
        : next;
      setDirtyState('dirty');
      if (currentFile) {
        scheduleSave(updated, imports, exports, activeBody, currentFile);
      }
      return updated;
    });
  }, [currentFile, imports, exports, activeBody, scheduleSave]);

  const updateImports = useCallback((next: SetStateAction<string>) => {
    setImports(prev => {
      const updated = typeof next === 'function' ? (next as (value: string) => string)(prev) : next;
      setDirtyState('dirty');
      if (currentFile) scheduleSave(metadata, updated, exports, activeBody, currentFile);
      return updated;
    });
  }, [currentFile, metadata, exports, activeBody, scheduleSave]);

  const updateExports = useCallback((next: SetStateAction<string>) => {
    setExports(prev => {
      const updated = typeof next === 'function' ? (next as (value: string) => string)(prev) : next;
      setDirtyState('dirty');
      if (currentFile) scheduleSave(metadata, imports, updated, activeBody, currentFile);
      return updated;
    });
  }, [currentFile, metadata, imports, activeBody, scheduleSave]);

  const replaceBlocks = useCallback((next: SetStateAction<Block[]>) => {
    setBlocks(prev => {
      const updated = typeof next === 'function' ? (next as (value: Block[]) => Block[])(prev) : next;
      setDirtyState('dirty');
      if (currentFile) {
        scheduleSave(metadata, imports, exports, stringifyBlocksToBody(updated), currentFile);
      }
      return updated;
    });
  }, [currentFile, metadata, imports, exports, scheduleSave]);

  // Actualizar el Monaco raw body directo (Modo Código)
  const updateRawBody = useCallback((newText: string) => {
    setRawBody(newText);
    setDirtyState('dirty');
    if (currentFile) {
      scheduleSave(metadata, imports, exports, newText, currentFile);
    }
  }, [metadata, imports, exports, currentFile, scheduleSave]);

  // Actualizar un bloque específico (Modo Visual)
  const updateBlock = useCallback((id: string, content: string, blockMetadata?: Record<string, any>) => {
    setBlocks(prev => {
      const updated = prev.map(b => b.id === id ? { ...b, content, metadata: blockMetadata || b.metadata } : b);
      setDirtyState('dirty');
      // Actualizar en background
      if (currentFile) {
        const newBody = stringifyBlocksToBody(updated);
        scheduleSave(metadata, imports, exports, newBody, currentFile);
      }
      return updated;
    });
  }, [metadata, imports, exports, currentFile, scheduleSave]);

  // Eliminar un bloque (Modo Visual)
  const removeBlock = useCallback((id: string) => {
    setBlocks(prev => {
      const updated = prev.filter(b => b.id !== id);
      setDirtyState('dirty');
      if (currentFile) {
        const newBody = stringifyBlocksToBody(updated);
        scheduleSave(metadata, imports, exports, newBody, currentFile);
      }
      return updated;
    });
  }, [metadata, imports, exports, currentFile, scheduleSave]);

  // Añadir un bloque nuevo (Modo Visual)
  const addBlock = useCallback((index: number, type: BlockType) => {
    const newBlock: Block = {
      id: createBlockId(),
      type,
      content: type === 'formula'
        ? '$$ x = y $$'
        : type === 'list'
          ? 'Primer elemento\nSegundo elemento'
          : type === 'table'
            ? '| Magnitud | Valor |\n|---|---|\n| a | $1$ |'
            : '',
      metadata: type === 'demonstration'
        ? { steps: [] }
        : type === 'list'
          ? { ordered: false }
          : undefined
    };

    setBlocks(prev => {
      const updated = [...prev];
      updated.splice(index, 0, newBlock);
      setDirtyState('dirty');
      if (currentFile) {
        const newBody = stringifyBlocksToBody(updated);
        scheduleSave(metadata, imports, exports, newBody, currentFile);
      }
      return updated;
    });
  }, [currentFile, metadata, imports, exports, scheduleSave]);

  // Reordenar bloques (Modo Visual)
  const moveBlock = useCallback((fromIndex: number, toIndex: number) => {
    setBlocks(prev => {
      const updated = [...prev];
      const [moved] = updated.splice(fromIndex, 1);
      updated.splice(toIndex, 0, moved);
      setDirtyState('dirty');
      if (currentFile) {
        const newBody = stringifyBlocksToBody(updated);
        scheduleSave(metadata, imports, exports, newBody, currentFile);
      }
      return updated;
    });
  }, [currentFile, metadata, imports, exports, scheduleSave]);

  return {
    files,
    loading,
    currentFile,
    editorMode,
    metadata,
    imports,
    exports,
    blocks,
    rawBody,
    saving,
    dirtyState,
    validation: activeValidation,
    message,
    loadFileList,
    openFile,
    toggleEditorMode,
    updateRawBody,
    updateBlock,
    removeBlock,
    addBlock,
    moveBlock,
    saveCurrentFile,
    setMetadata: updateMetadataState,
    setImports: updateImports,
    setExports: updateExports,
    setBlocks: replaceBlocks
  };
};
