import { useRef, useEffect } from 'react';
import JXG from 'jsxgraph';


function getCSSVar(name: string): string {
  if (typeof document !== 'undefined') {
    return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  }
  return '#000';
}


export const CongruenciaLLL = () => {
  const boardRef = useRef<HTMLDivElement>(null);
  const jxgBoard = useRef<any>(null);
  const elementsRef = useRef<Record<string, unknown>>({});

  useEffect(() => {
    if (!boardRef.current) return;

    if (!boardRef.current.id) boardRef.current.id = "jxgbox_" + Math.random().toString(36).substring(2, 9);
      const board = JXG.JSXGraph.initBoard(boardRef.current.id, {
      boundingbox: [-2, 5, 8, -3],
      axis: false,
      showCopyright: false,
      keepaspectratio: true,
      grid: false,
    });
    jxgBoard.current = board;

    // Primer triángulo
    const A1 = board.create('point', [0, 0], {
      name: 'A', size: 4, fillColor: getCSSVar('--theme-terracota'), strokeColor: getCSSVar('--theme-terracota'), showInfobox: false, fixed: true,
    });
    const B1 = board.create('point', [4, 0], {
      name: 'B', size: 4, fillColor: getCSSVar('--theme-terracota'), strokeColor: getCSSVar('--theme-terracota'), showInfobox: false, fixed: true,
    });
    const C1 = board.create('point', [1, 3], {
      name: 'C', size: 4, fillColor: getCSSVar('--theme-musgo'), strokeColor: getCSSVar('--theme-musgo'), showInfobox: false,
    });

    const s1 = board.create('segment', [A1, B1], { strokeColor: getCSSVar('--theme-carbon'), strokeWidth: 3, highlight: false });
    const s2 = board.create('segment', [B1, C1], { strokeColor: getCSSVar('--theme-carbon'), strokeWidth: 3, highlight: false });
    const s3 = board.create('segment', [A1, C1], { strokeColor: getCSSVar('--theme-carbon'), strokeWidth: 3, highlight: false });
    board.create('polygon', [A1, B1, C1], {
      fillColor: getCSSVar('--theme-terracota'), fillOpacity: 0.05, borders: { visible: false }, vertices: { visible: false },
    });

    // Segundo triángulo (congruente, reflejado)
    const A2 = board.create('point', [0, -1], {
      name: "A'", size: 4, fillColor: getCSSVar('--theme-terracota'), strokeColor: getCSSVar('--theme-terracota'), showInfobox: false, fixed: true,
    });
    const B2 = board.create('point', [4, -1], {
      name: "B'", size: 4, fillColor: getCSSVar('--theme-terracota'), strokeColor: getCSSVar('--theme-terracota'), showInfobox: false, fixed: true,
    });
    const C2 = board.create('point', [3, -4], {
      name: "C'", size: 4, fillColor: getCSSVar('--theme-pizarra'), strokeColor: getCSSVar('--theme-pizarra'), showInfobox: false,
    });

    board.create('segment', [A2, B2], { strokeColor: getCSSVar('--theme-carbon'), strokeWidth: 3, highlight: false });
    board.create('segment', [B2, C2], { strokeColor: getCSSVar('--theme-carbon'), strokeWidth: 3, highlight: false });
    board.create('segment', [A2, C2], { strokeColor: getCSSVar('--theme-carbon'), strokeWidth: 3, highlight: false });
    board.create('polygon', [A2, B2, C2], {
      fillColor: getCSSVar('--theme-pizarra'), fillOpacity: 0.05, borders: { visible: false }, vertices: { visible: false },
    });

    // Marcas de congruencia (tick marks) en los lados
    const midAB1 = board.create('midpoint', [A1, B1], { visible: false });
    const midAB2 = board.create('midpoint', [A2, B2], { visible: false });
    board.create('segment', [
      [() => midAB1.X() - 0.1, () => midAB1.Y() + 0.2],
      [() => midAB1.X() + 0.1, () => midAB1.Y() - 0.2],
    ], { strokeColor: getCSSVar('--theme-terracota'), strokeWidth: 2, highlight: false });
    board.create('segment', [
      [() => midAB2.X() - 0.1, () => midAB2.Y() + 0.2],
      [() => midAB2.X() + 0.1, () => midAB2.Y() - 0.2],
    ], { strokeColor: getCSSVar('--theme-terracota'), strokeWidth: 2, highlight: false });

    elementsRef.current = { board, s1, s2, s3, A1, B1, C1, A2, B2, C2 };

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
      elementsRef.current = {};
    };
  }, []);

  return (
    <div className="w-full h-full min-h-[300px] relative bg-lienzo/40 border border-pizarra/10 rounded-sm overflow-hidden">
      <div className="absolute top-2 left-3 z-10 text-xs font-serif italic text-pizarra/50">
        Triángulos congruentes por el criterio <span className="font-bold not-italic text-terracota">LLL</span>
      </div>
      <div ref={boardRef} className="w-full h-full touch-none" />
    </div>
  );
};
