import React, { useEffect, useId, useRef } from 'react';
import JXG from 'jsxgraph';
import { useMathStore } from '@/shared/lib/MathStoreContext';
import { matchesScopedDiagramTarget } from '@/shared/lib/DiagramTargetRegistryContext';

export interface ThemeColors {
  carbon: string;
  terracota: string;
  salvia: string;
  lienzo: string;
  pizarra: string;
  ocre: string;
  pavo: string;
  granada: string;
  musgo: string;
}

function getCSSVar(name: keyof ThemeColors): string {
  if (typeof document === 'undefined') return name === 'lienzo' ? 'white' : 'black';
  return getComputedStyle(document.documentElement)
    .getPropertyValue(`--theme-${name}`)
    .trim() || (name === 'lienzo' ? 'white' : 'black');
}

function getTheme(): ThemeColors {
  return {
    carbon: getCSSVar('carbon'),
    terracota: getCSSVar('terracota'),
    salvia: getCSSVar('salvia'),
    lienzo: getCSSVar('lienzo'),
    pizarra: getCSSVar('pizarra'),
    ocre: getCSSVar('ocre'),
    pavo: getCSSVar('pavo'),
    granada: getCSSVar('granada'),
    musgo: getCSSVar('musgo'),
  };
}

export interface MathBoardProps {
  id?: string;
  className?: string;
  boundingbox?: [number, number, number, number];
  keepaspectratio?: boolean;
  axis?: boolean;
  grid?: boolean;
  pan?: boolean;
  zoom?: boolean;
  revision?: string;
  scopeId?: string;
  onBoundingBoxChange?: (bounds: [number, number, number, number]) => void;
  onInit: (board: any, elements: Record<string, any>, theme: ThemeColors) => void;
  onUpdate?: (
    board: any,
    elements: Record<string, any>,
    theme: ThemeColors,
    isStep: (id: string) => boolean,
    isHL: (id: string) => boolean,
  ) => void;
  children?: React.ReactNode;
  borderWidth?: number | string;
  borderColor?: string;
  borderRadius?: number | string;
}

export const MathBoard: React.FC<MathBoardProps> = ({
  id,
  className = 'relative min-h-[350px] w-full overflow-hidden',
  boundingbox = [-5, 5, 5, -5],
  keepaspectratio = true,
  axis = false,
  grid = false,
  pan = false,
  zoom = false,
  revision = '',
  scopeId = '',
  onBoundingBoxChange,
  onInit,
  onUpdate,
  children,
  borderWidth = 1,
  borderColor = 'var(--page-accent, var(--theme-pizarra))',
  borderRadius = 20,
}) => {
  const boardRef = useRef<HTMLDivElement>(null);
  const boardObj = useRef<any>(null);
  const elementsRef = useRef<Record<string, any>>({});
  const onInitRef = useRef(onInit);
  const onUpdateRef = useRef(onUpdate);
  const onBoundingBoxChangeRef = useRef(onBoundingBoxChange);
  const boundingboxRef = useRef(boundingbox);
  const highlight = useMathStore(state => state.variables?.[scopeId ? `highlight:${scopeId}` : 'highlight'] ?? state.variables?.['highlight']);
  const step = useMathStore(state => state.variables?.[scopeId ? `step:${scopeId}` : 'step'] ?? state.variables?.['step']);
  const highlightRef = useRef(highlight);
  const stepRef = useRef(step);
  const generatedId = useId().replace(/:/g, '');

  useEffect(() => {
    onInitRef.current = onInit;
    onUpdateRef.current = onUpdate;
    onBoundingBoxChangeRef.current = onBoundingBoxChange;
    boundingboxRef.current = boundingbox;
    boardObj.current?.update();
  }, [boundingbox, onBoundingBoxChange, onInit, onUpdate]);

  useEffect(() => {
    highlightRef.current = highlight;
    stepRef.current = step;

    if (!boardObj.current) return;
    const currentTheme = getTheme();
    const isStep = (target: string) => matchesScopedDiagramTarget(stepRef.current, target, scopeId);
    const isHL = (target: string) => matchesScopedDiagramTarget(highlightRef.current, target, scopeId);
    onUpdateRef.current?.(boardObj.current, elementsRef.current, currentTheme, isStep, isHL);
    boardObj.current.update();
  }, [highlight, step]);

  useEffect(() => {
    if (!boardRef.current) return;
    boardRef.current.id ||= id || `shared-jxgbox-${generatedId}`;

    const board = JXG.JSXGraph.initBoard(boardRef.current.id, {
      boundingbox: boundingboxRef.current,
      axis,
      grid,
      pan: { enabled: pan },
      zoom: { wheel: zoom, pinchHorizontal: zoom, pinchVertical: zoom },
      keepaspectratio,
      showCopyright: false,
      showNavigation: false,
    });

    boardObj.current = board;
    const theme = getTheme();
    onInitRef.current(board, elementsRef.current, theme);

    const runUpdate = () => {
      const currentTheme = getTheme();
      const isStep = (target: string) => matchesScopedDiagramTarget(stepRef.current, target, scopeId);
      const isHL = (target: string) => matchesScopedDiagramTarget(highlightRef.current, target, scopeId);
      onUpdateRef.current?.(board, elementsRef.current, currentTheme, isStep, isHL);
    };

    board.on('update', runUpdate);
    runUpdate();

    const reportBoundingBox = () => {
      const current = board.getBoundingBox?.();
      if (Array.isArray(current) && current.length === 4) {
        onBoundingBoxChangeRef.current?.([...current] as [number, number, number, number]);
      }
    };
    board.on('boundingbox', reportBoundingBox);

    const resizeObserver = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(() => {
      if (!boardRef.current) return;
      board.resizeContainer(boardRef.current.clientWidth, boardRef.current.clientHeight);
      board.setBoundingBox(boundingboxRef.current, keepaspectratio);
      board.update();
    });
    resizeObserver?.observe(boardRef.current);

    const themeObserver = new MutationObserver(() => {
      const currentTheme = getTheme();
      const renderer = board.renderer as any;
      if (renderer?.container) {
        renderer.container.style.backgroundColor = currentTheme.lienzo;
      }
      board.update();
    });
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

    return () => {
      themeObserver.disconnect();
      resizeObserver?.disconnect();
      JXG.JSXGraph.freeBoard(board);
      boardObj.current = null;
      elementsRef.current = {};
    };
  }, [axis, generatedId, grid, id, keepaspectratio, pan, revision, scopeId, zoom]);

  useEffect(() => {
    const board = boardObj.current;
    if (!board) return;
    const current = board.getBoundingBox?.() as number[] | undefined;
    const changed = !current || boundingbox.some((value, index) => Math.abs(value - current[index]) > 1e-8);
    if (changed) {
      board.setBoundingBox(boundingbox, keepaspectratio);
      board.update();
    }
  }, [boundingbox, keepaspectratio]);

  return (
    <div className={`${className} h-full`}>
      <div ref={boardRef} className="jxgbox absolute inset-0 h-full w-full touch-none" 
        style={{
          borderStyle: 'solid',
          borderWidth,
          borderColor,
          borderRadius,
          boxSizing: 'border-box',
        }} 
      />
      {children}
    </div>
  );
};
