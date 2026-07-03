import React, { useId, useRef, useEffect } from 'react';
import JXG from 'jsxgraph';
import { useMathStore } from '@/app/providers/MathStoreContext';

export interface ThemeColors {
  carbon: string;
  terracota: string;
  salvia: string;
  crema: string;
  lienzo: string;
  pizarra: string;
}

function getCSSVar(name: string): string {
  if (typeof document !== 'undefined') {
    return getComputedStyle(document.documentElement).getPropertyValue(`--theme-${name}`).trim() || '#000';
  }
  return '#000';
}

function getTheme(): ThemeColors {
  return {
    carbon: getCSSVar('carbon'),
    terracota: getCSSVar('terracota'),
    salvia: getCSSVar('salvia'),
    crema: getCSSVar('crema'),
    lienzo: getCSSVar('lienzo'),
    pizarra: getCSSVar('pizarra'),
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
    isHL: (id: string) => boolean
  ) => void;
  children?: React.ReactNode;
}

export const MathBoard: React.FC<MathBoardProps> = ({
  id,
  className = "w-full h-full min-h-[350px] relative overflow-hidden !p-0 !m-0",
  boundingbox = [-5, 5, 5, -5],
  keepaspectratio = true,
  axis = false,
  grid = false,
  onInit,
  onUpdate,
  children
}) => {
  const boardRef = useRef<HTMLDivElement>(null);
  const boardObj = useRef<any>(null);
  const elementsRef = useRef<Record<string, any>>({});
  const generatedId = useId().replace(/:/g, '');
  
  const highlight = useMathStore(s => s.variables?.['highlight']);
  const step = useMathStore(s => s.variables?.['step']);

  const isHL = (targetId: string) => Array.isArray(highlight) ? (highlight as unknown as string[]).includes(targetId) : highlight === targetId;
  const isStep = (targetId: string) => Array.isArray(step) ? (step as unknown as string[]).includes(targetId) : step === targetId;

  // Init Phase
  useEffect(() => {
    if (!boardRef.current) return;
    boardRef.current.id ||= id || `jxgbox_${generatedId}`;

    const board = JXG.JSXGraph.initBoard(boardRef.current.id, {
      boundingbox,
      axis,
      showCopyright: false,
      keepaspectratio,
      grid,
    });

    boardObj.current = board;
    const theme = getTheme();

    // Call onInit
    onInit(board, elementsRef.current, theme);

    // Initial background color logic
    if (board.renderer && (board.renderer as any).container) {
      (board.renderer as any).container.style.backgroundColor = theme.lienzo;
    }

    // Theme Mutation Observer
    const obs = new MutationObserver(() => {
      if (boardObj.current && boardObj.current.renderer) {
        const currentTheme = getTheme();
        (boardObj.current.renderer as any).container.style.backgroundColor = currentTheme.lienzo;
        boardObj.current.update();
      }
    });
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

    // ResizeObserver for dynamic responsiveness of the JSXGraph canvas
    const resizeObserver = new ResizeObserver(() => {
      if (boardObj.current && boardRef.current) {
        const width = boardRef.current.clientWidth;
        const height = boardRef.current.clientHeight;
        boardObj.current.resizeContainer(width, height);
        // CRITICAL FIX: Reset the bounding box to keep it centered and scaled properly!
        boardObj.current.setBoundingBox(boundingbox, keepaspectratio);
        boardObj.current.update();
      }
    });

    if (boardRef.current) {
      resizeObserver.observe(boardRef.current);
    }

    return () => {
      obs.disconnect();
      resizeObserver.disconnect();
      if (boardObj.current) {
        JXG.JSXGraph.freeBoard(boardObj.current);
        boardObj.current = null;
      }
      elementsRef.current = {};
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run once

  // Update Phase
  useEffect(() => {
    if (!boardObj.current) return;
    if (onUpdate) {
      onUpdate(boardObj.current, elementsRef.current, getTheme(), isStep, isHL);
      boardObj.current.update();
    }
  }, [highlight, step, onUpdate]);

  return (
    <div className={className}>
      <div ref={boardRef} className="w-full h-full touch-none" />
      {children}
    </div>
  );
};
export default MathBoard;
