import React, { useEffect, useId, useRef } from 'react';
import JXG from 'jsxgraph';
import { useMathStore } from '@/shared/lib/MathStoreContext';

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
  onInit: (board: any, elements: Record<string, any>, theme: ThemeColors) => void;
  onUpdate?: (
    board: any,
    elements: Record<string, any>,
    theme: ThemeColors,
    isStep: (id: string) => boolean,
    isHL: (id: string) => boolean,
  ) => void;
  children?: React.ReactNode;
}

export const MathBoard: React.FC<MathBoardProps> = ({
  id,
  className = 'relative min-h-[350px] w-full overflow-hidden',
  boundingbox = [-5, 5, 5, -5],
  keepaspectratio = true,
  axis = false,
  grid = false,
  onInit,
  onUpdate,
  children,
}) => {
  const boardRef = useRef<HTMLDivElement>(null);
  const boardObj = useRef<any>(null);
  const elementsRef = useRef<Record<string, any>>({});
  const onInitRef = useRef(onInit);
  const onUpdateRef = useRef(onUpdate);
  const highlight = useMathStore(state => state.variables?.['highlight']);
  const step = useMathStore(state => state.variables?.['step']);
  const highlightRef = useRef(highlight);
  const stepRef = useRef(step);
  const generatedId = useId().replace(/:/g, '');

  useEffect(() => {
    onInitRef.current = onInit;
    onUpdateRef.current = onUpdate;
  }, [onInit, onUpdate]);

  useEffect(() => {
    highlightRef.current = highlight;
    stepRef.current = step;

    if (!boardObj.current) return;
    const currentTheme = getTheme();
    const isStep = (target: string) => stepRef.current === target;
    const isHL = (target: string) => {
      const current = highlightRef.current;
      return Array.isArray(current) ? current.some(item => item === target) : current === target;
    };
    onUpdateRef.current?.(boardObj.current, elementsRef.current, currentTheme, isStep, isHL);
    boardObj.current.update();
  }, [highlight, step]);

  useEffect(() => {
    if (!boardRef.current) return;
    boardRef.current.id ||= id || `shared-jxgbox-${generatedId}`;

    const board = JXG.JSXGraph.initBoard(boardRef.current.id, {
      boundingbox,
      axis,
      grid,
      keepaspectratio,
      showCopyright: false,
      showNavigation: false,
    });

    boardObj.current = board;
    const theme = getTheme();
    onInitRef.current(board, elementsRef.current, theme);

    const runUpdate = () => {
      const currentTheme = getTheme();
      const isStep = (target: string) => stepRef.current === target;
      const isHL = (target: string) => {
        const current = highlightRef.current;
        return Array.isArray(current) ? current.some(item => item === target) : current === target;
      };
      onUpdateRef.current?.(board, elementsRef.current, currentTheme, isStep, isHL);
    };

    board.on('update', runUpdate);
    runUpdate();

    const resizeObserver = new ResizeObserver(() => {
      if (!boardRef.current) return;
      board.resizeContainer(boardRef.current.clientWidth, boardRef.current.clientHeight);
      board.setBoundingBox(boundingbox, keepaspectratio);
      board.update();
    });
    resizeObserver.observe(boardRef.current);

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
      resizeObserver.disconnect();
      JXG.JSXGraph.freeBoard(board);
      boardObj.current = null;
      elementsRef.current = {};
    };
  }, [axis, boundingbox, generatedId, grid, id, keepaspectratio]);

  return (
    <div className={className}>
      <div ref={boardRef} className="absolute inset-0" />
      {children}
    </div>
  );
};
