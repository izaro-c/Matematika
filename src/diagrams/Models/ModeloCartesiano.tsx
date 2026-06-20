import { useRef, useEffect } from 'react';
import JXG from 'jsxgraph';


function getCSSVar(name: string): string {
  if (typeof document !== 'undefined') {
    return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  }
  return '#000';
}


export const ModeloCartesiano = () => {
  const boardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!boardRef.current) return;

    const board = JXG.JSXGraph.initBoard(boardRef.current, {
      boundingbox: [-5, 5, 5, -5],
      axis: true,
      showCopyright: false,
      keepaspectratio: true,
      grid: true,
    });

    const A = board.create('point', [1, 2], {
      name: 'A', size: 4, fillColor: getCSSVar('--theme-terracota'), strokeColor: getCSSVar('--theme-terracota')
    });
    const B = board.create('point', [-3, -1], {
      name: 'B', size: 4, fillColor: getCSSVar('--theme-terracota'), strokeColor: getCSSVar('--theme-terracota')
    });

    board.create('line', [A, B], {
      strokeColor: getCSSVar('--theme-musgo'), strokeWidth: 2
    });

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
    };
  }, []);

  return (
    <div className="w-full h-full min-h-[300px] relative bg-lienzo/40 border border-pizarra/10 rounded-sm overflow-hidden">
      <div className="absolute top-2 left-3 z-10 text-xs font-serif italic text-pizarra/50">
        Plano Cartesiano R²
      </div>
      <div ref={boardRef} className="w-full h-full touch-none" />
    </div>
  );
};
