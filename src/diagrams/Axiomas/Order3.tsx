import { useRef, useEffect } from 'react';
import JXG from 'jsxgraph';
import { useMathStore } from '../../store/MathStoreContext';
import { useLessonStore } from '../../store/LessonStore';

function getCSSVar(name: string): string {
  if (typeof document !== 'undefined') return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  return '#000';
}

export const Order3 = () => {
  const boardRef = useRef<HTMLDivElement>(null);
  const elementsRef = useRef<Record<string, unknown>>({});
  const mathHighlight = useMathStore(state => state.variables?.['highlight']);
  const lessonHighlight = useLessonStore(state => state.activeStep);
  const highlight = mathHighlight || lessonHighlight;

  useEffect(() => {
    if (!boardRef.current) return;
    const board = JXG.JSXGraph.initBoard(boardRef.current, {
      boundingbox: [-5, 2, 5, -2], axis: false, showCopyright: false, keepaspectratio: true,
    });

    const line = board.create('line', [[-10, 0], [10, 0]], {
      name: 'l', withLabel: true, label: { position: 'bot', offset: [-15, -15], strokeColor: getCSSVar('--theme-carbon'), fontSize: 16 },
      strokeColor: getCSSVar('--theme-carbon'), strokeWidth: 2, straightFirst: true, straightLast: true,
    });

    const p1 = board.create('glider', [-3, 0, line], {
      name: 'A', size: 5, fillColor: getCSSVar('--theme-terracota'), strokeColor: getCSSVar('--theme-terracota'), showInfobox: false,
    });
    const p2 = board.create('glider', [0, 0, line], {
      name: 'B', size: 5, fillColor: getCSSVar('--theme-terracota'), strokeColor: getCSSVar('--theme-terracota'), showInfobox: false,
    });
    const p3 = board.create('glider', [3, 0, line], {
      name: 'C', size: 5, fillColor: getCSSVar('--theme-terracota'), strokeColor: getCSSVar('--theme-terracota'), showInfobox: false,
    });
    
    elementsRef.current = { line, p1, p2, p3, board };

    return () => {
      JXG.JSXGraph.freeBoard(board);
    };
  }, []);

  useEffect(() => {
    const { line, p1, p2, p3, board } = elementsRef.current as Record<string, any>;
    if (!board) return;

    line.setAttribute({ strokeColor: highlight === 'line' ? getCSSVar('--theme-ocre') : getCSSVar('--theme-carbon'), strokeWidth: highlight === 'line' ? 4 : 2 });
    
    [p1, p2, p3].forEach((p, idx) => {
      const id = `p${idx+1}`;
      if (highlight === id) p.setAttribute({ fillColor: getCSSVar('--theme-ocre'), strokeColor: getCSSVar('--theme-ocre'), size: 8 });
      else p.setAttribute({ fillColor: getCSSVar('--theme-terracota'), strokeColor: getCSSVar('--theme-terracota'), size: 5 });
    });

    board.update();
  }, [highlight]);

  return (
    <div className="w-full h-full min-h-[250px] relative bg-lienzo/30 border border-pizarra/10 rounded-sm">
      <div className="absolute top-3 left-3 z-10 text-[10px] font-sans text-pizarra/50 uppercase tracking-wider">
        Ordena libremente los puntos en la recta
      </div>
      <div ref={boardRef} className="w-full h-full touch-none" />
    </div>
  );
};
