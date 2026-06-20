import { useRef, useEffect } from 'react';
import JXG from 'jsxgraph';


function getCSSVar(name: string): string {
  if (typeof document !== 'undefined') {
    return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  }
  return '#000';
}


export const ModeloPoincare = () => {
  const boardRef = useRef<HTMLDivElement>(null);
  const jxgBoard = useRef<any>(null);

  useEffect(() => {
    if (!boardRef.current) return;

    const board = JXG.JSXGraph.initBoard(boardRef.current.id, {
      boundingbox: [-1.5, 1.5, 1.5, -1.5],
      axis: false,
      showCopyright: false,
      keepaspectratio: true,
      grid: false,
    });
    jxgBoard.current = board;

    const origin = board.create('point', [0, 0], { visible: false });
    board.create('circle', [origin, 1], {
      strokeColor: getCSSVar('--theme-carbon'), strokeWidth: 2, fillColor: getCSSVar('--theme-musgo'), fillOpacity: 0.1, fixed: true
    });

    const A = board.create('point', [0.2, 0.3], { name: 'A', size: 4, fillColor: getCSSVar('--theme-terracota'), strokeColor: getCSSVar('--theme-terracota') });
    const B = board.create('point', [-0.5, 0.4], { name: 'B', size: 4, fillColor: getCSSVar('--theme-terracota'), strokeColor: getCSSVar('--theme-terracota') });

    // In poincare disk, draw an arc or a straight line through the origin if they align
    // JSXGraph has some Poincare macros, but we can fake it with a generic line or arc for illustration
    board.create('segment', [A, B], { strokeColor: getCSSVar('--theme-carbon'), strokeWidth: 2, dash: 1 });

    board.update();    (board.renderer as any).container.style.backgroundColor = getCSSVar('--theme-lienzo');



        const observer = new MutationObserver(() => {
      if (board) {
        (board.renderer as any).container.style.backgroundColor = getCSSVar('--theme-lienzo');
        board.update();
      }
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

    return () => {
      observer.disconnect();
      JXG.JSXGraph.freeBoard(board);
      jxgBoard.current = null;
    };
  }, []);

  return (
    <div className="w-full h-full min-h-[300px] relative bg-lienzo/40 border border-pizarra/10 rounded-sm overflow-hidden">
      <div className="absolute top-2 left-3 z-10 text-xs font-serif italic text-pizarra/50">
        Disco de Poincaré
      </div>
      <div ref={boardRef} className="w-full h-full touch-none" />
    </div>
  );
};
