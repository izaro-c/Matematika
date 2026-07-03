import React, { useEffect, useId, useRef } from 'react';
import JXG from 'jsxgraph';

interface JXGBoardProps {
  logic: (board: any) => void;
  bounds?: [number, number, number, number];
  className?: string;
  axis?: boolean;
  grid?: boolean;
}

const JXGBoard: React.FC<JXGBoardProps> = ({ 
  logic, 
  bounds = [-5, 5, 5, -5], 
  className = "w-full aspect-square",
  axis = false,
  grid = false
}) => {
  const boardRef = useRef<HTMLDivElement>(null);
  const boardInstance = useRef<any>(null);
  const boardId = useId().replace(/:/g, '');

  useEffect(() => {
    if (!boardRef.current) return;

    boardRef.current.id ||= `jxg-board-${boardId}`;

    boardInstance.current = JXG.JSXGraph.initBoard(boardRef.current.id, {
      boundingbox: bounds,
      axis: axis,
      grid: grid,
      showCopyright: false,
      showNavigation: false,
      pan: { enabled: false },
      zoom: { wheel: false }
    });

    // Run custom logic
    if (logic) {
      logic(boardInstance.current);
    }

    // Setup ResizeObserver to make JSXGraph dynamically responsive
    const resizeObserver = new ResizeObserver(() => {
      if (boardInstance.current && boardRef.current) {
        const width = boardRef.current.clientWidth;
        const height = boardRef.current.clientHeight;
        boardInstance.current.resizeContainer(width, height);
        boardInstance.current.update();
      }
    });

    if (boardRef.current) {
      resizeObserver.observe(boardRef.current);
    }

    // Cleanup
    return () => {
      resizeObserver.disconnect();
      if (boardInstance.current) {
        JXG.JSXGraph.freeBoard(boardInstance.current);
        boardInstance.current = null;
      }
    };
  }, [logic, bounds, axis, grid]);

  return <div ref={boardRef} className={className} />;
};

export default JXGBoard;
