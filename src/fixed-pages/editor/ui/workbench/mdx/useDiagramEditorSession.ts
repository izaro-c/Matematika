import { useEffect, useMemo, useState, type MutableRefObject } from 'react';
import type { Block } from '@/fixed-pages/editor/session/parser';
import type { DiagramWorkbenchMode } from '@/fixed-pages/editor/diagrams/ui/workbench/useDiagramWorkbenchLoader';
import { getDiagramWorkbenchMode } from '../../page/editorPageModel';
import type { useEditorNavigationFlow } from '../../page/useEditorNavigationFlow';

type NavigationFlow = ReturnType<typeof useEditorNavigationFlow>;

interface Options {
  currentFile: string | null;
  blocks: Block[];
  route: NavigationFlow['route'];
  viewMode: NavigationFlow['viewMode'];
  urlBlockId: string | null;
  /** El guardián de cambios sin guardar llama aquí al descartar para limpiar la sesión. */
  cleanupRef: MutableRefObject<() => void>;
  setDiagramDirty: (dirty: boolean) => void;
  openDiagramSurface: NavigationFlow['openDiagramSurface'];
  closeDiagramSurface: NavigationFlow['closeDiagramSurface'];
}

/** Sesión de edición de un diagrama desde una página: bloque activo, modo del banco y apertura/cierre de la superficie. */
export function useDiagramEditorSession({
  currentFile,
  blocks,
  route,
  viewMode,
  urlBlockId,
  cleanupRef,
  setDiagramDirty,
  openDiagramSurface,
  closeDiagramSurface,
}: Options) {
  const [diagramWorkbenchOverride, setDiagramWorkbenchOverride] = useState<DiagramWorkbenchMode | null>(null);
  const [rewriteDiagramPath, setRewriteDiagramPath] = useState<string | null>(null);
  const [activeDiagramBlockId, setActiveDiagramBlockId] = useState<string | null>(null);
  const [activeDiagramIndex, setActiveDiagramIndex] = useState<number | null>(null);

  const clearDiagramSession = () => {
    setDiagramWorkbenchOverride(null);
    setRewriteDiagramPath(null);
    setActiveDiagramBlockId(null);
    setActiveDiagramIndex(null);
    setDiagramDirty(false);
  };

  useEffect(() => {
    cleanupRef.current = clearDiagramSession;
  });

  // Superficie de diagrama recargada desde la URL: recuperar el bloque activo. `bloque=`
  // también es la selección de edición, así que solo cuenta si es un bloque de diagrama.
  useEffect(() => {
    if (route.status !== 'file' || !route.diagramSurface || !urlBlockId || activeDiagramBlockId !== null) return;
    if (blocks.some(block => block.id === urlBlockId && block.type === 'diagram')) {
      setActiveDiagramBlockId(urlBlockId);
    }
  }, [activeDiagramBlockId, blocks, route, urlBlockId]);

  const openDiagramEditor = (options?: {
    blockId?: string | null;
    blockIndex?: number | null;
    modeOverride?: DiagramWorkbenchMode | null;
    asRewrite?: boolean;
  }) => {
    if (options?.blockId !== undefined) setActiveDiagramBlockId(options.blockId);
    if (options?.blockIndex !== undefined) setActiveDiagramIndex(options.blockIndex);
    if (options?.modeOverride !== undefined) setDiagramWorkbenchOverride(options.modeOverride);
    if (options?.asRewrite && currentFile?.endsWith('.tsx')) {
      setRewriteDiagramPath(currentFile);
    }
    const returnContext =
      currentFile?.endsWith('.mdx')
        ? { pagePath: currentFile, blockId: options?.blockId ?? activeDiagramBlockId, viewMode }
        : null;
    openDiagramSurface(returnContext);
  };

  const handleCloseDiagramSurface = () => {
    // La URL decide adónde se vuelve: a la página (con su vista), a `volver` o a la portada.
    clearDiagramSession();
    closeDiagramSurface();
  };

  const activeDiagramBlock = useMemo(
    () => blocks.find(b => b.id === activeDiagramBlockId) ?? (activeDiagramIndex !== null ? blocks[activeDiagramIndex] : null),
    [activeDiagramBlockId, activeDiagramIndex, blocks],
  );

  const activeDiagramWorkbenchMode = useMemo(() => {
    if (diagramWorkbenchOverride) return diagramWorkbenchOverride;
    return getDiagramWorkbenchMode(currentFile, activeDiagramBlock);
  }, [activeDiagramBlock, currentFile, diagramWorkbenchOverride]);

  return {
    rewriteDiagramPath,
    setRewriteDiagramPath,
    setActiveDiagramBlockId,
    setActiveDiagramIndex,
    clearDiagramSession,
    openDiagramEditor,
    handleCloseDiagramSurface,
    activeDiagramWorkbenchMode,
  };
}
