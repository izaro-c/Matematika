import React, { useEffect, useRef } from 'react';
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

  useEffect(() => {
    if (!boardRef.current) return;

    // Generate a unique ID if the element doesn't have one
    if (!boardRef.current.id) {
      boardRef.current.id = 'jxg-board-' + Math.random().toString(36).substring(2, 9);
    }

    // Initialize board
    if (!boardRef.current.id) boardRef.current.id = "jxgbox_" + Math.random().toString(36).substring(2, 9);
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

    // Cleanup
    return () => {
      if (boardInstance.current) {
        JXG.JSXGraph.freeBoard(boardInstance.current);
        boardInstance.current = null;
      }
    };
  }, [logic, bounds, axis, grid]);

  return <div ref={boardRef} className={className} />;
};

export default JXGBoard;
