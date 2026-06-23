import { useRef, useEffect } from 'react';
import JXG from 'jsxgraph';
import { useMathStore } from '@/app/providers/MathStoreContext';
function getCSSVar(name: string): string {
  if (typeof document !== 'undefined') {
    return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  }
  return '#000';
}


export const ModeloTresPuntos = () => {
  const boardRef = useRef<HTMLDivElement>(null);
  const jxgBoard = useRef<any>(null);

  useEffect(() => {
    if (!boardRef.current) return;

    if (!boardRef.current.id) boardRef.current.id = "jxgbox_" + Math.random().toString(36).substring(2, 9);
      const board = JXG.JSXGraph.initBoard(boardRef.current.id, {
      boundingbox: [-3, 3, 3, -3],
      axis: false,
      showCopyright: false,
      keepaspectratio: true,
      grid: false,
    });
    jxgBoard.current = board;

    const A = board.create('point', [-2, -1], {
      name: 'A', size: 6, fillColor: getCSSVar('--theme-terracota'), strokeColor: getCSSVar('--theme-terracota'), showInfobox: false, fixed: true,
    });
    const B = board.create('point', [2, -1], {
      name: 'B', size: 6, fillColor: getCSSVar('--theme-terracota'), strokeColor: getCSSVar('--theme-terracota'), showInfobox: false, fixed: true,
    });
    const C = board.create('point', [0, 2], {
      name: 'C', size: 6, fillColor: getCSSVar('--theme-terracota'), strokeColor: getCSSVar('--theme-terracota'), showInfobox: false, fixed: true,
    });

    const rAB = board.create('line', [A, B], {
      strokeColor: getCSSVar('--theme-carbon'), strokeWidth: 2, highlight: false,
      name: 'r_{AB}', label: { fontSize: 14, position: "bl", offset: [-10, -10] }, withLabel: true
    });
    const rBC = board.create('line', [B, C], {
      strokeColor: getCSSVar('--theme-carbon'), strokeWidth: 2, highlight: false,
      name: 'r_{BC}', label: { fontSize: 14, position: "rt", offset: [10, 10] }, withLabel: true
    });
    const rCA = board.create('line', [C, A], {
      strokeColor: getCSSVar('--theme-carbon'), strokeWidth: 2, highlight: false,
      name: 'r_{CA}', label: { fontSize: 14, position: "lt", offset: [-10, 10] }, withLabel: true
    });

    const plano = board.create('polygon', [A, B, C], {
      fillColor: getCSSVar('--theme-musgo'), fillOpacity: 0.08, borders: { visible: false }, vertices: { visible: false },
    });

    // Guardar referencias
    (board as any)._el_A = A;
    (board as any)._el_B = B;
    (board as any)._el_C = C;
    (board as any)._el_rAB = rAB;
    (board as any)._el_rBC = rBC;
    (board as any)._el_rCA = rCA;
    (board as any)._el_plano = plano;

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

  const highlight = useMathStore(state => state.variables?.['highlight']);

  useEffect(() => {
    const board = jxgBoard.current;
    if (!board) return;

    const A = (board as any)._el_A;
    const B = (board as any)._el_B;
    const C = (board as any)._el_C;
    const rAB = (board as any)._el_rAB;
    const rBC = (board as any)._el_rBC;
    const rCA = (board as any)._el_rCA;
    const plano = (board as any)._el_plano;

    // reset
    [A, B, C].forEach(pt => pt?.setAttribute({ size: 6, fillOpacity: 1, strokeOpacity: 1 }));
    [rAB, rBC, rCA].forEach(ln => ln?.setAttribute({ strokeWidth: 2, strokeOpacity: 1 }));
    plano?.setAttribute({ fillOpacity: 0.08 });

    if (typeof highlight === 'string') {
      if (['A', 'B', 'C'].includes(highlight)) {
        [A, B, C].forEach(pt => pt?.setAttribute({ fillOpacity: 0.2, strokeOpacity: 0.2 }));
        if (highlight === 'A') A?.setAttribute({ size: 9, fillOpacity: 1, strokeOpacity: 1 });
        if (highlight === 'B') B?.setAttribute({ size: 9, fillOpacity: 1, strokeOpacity: 1 });
        if (highlight === 'C') C?.setAttribute({ size: 9, fillOpacity: 1, strokeOpacity: 1 });
      }
      if (['rAB', 'rBC', 'rCA'].includes(highlight)) {
        [rAB, rBC, rCA].forEach(ln => ln?.setAttribute({ strokeOpacity: 0.2 }));
        if (highlight === 'rAB') rAB?.setAttribute({ strokeWidth: 4, strokeOpacity: 1 });
        if (highlight === 'rBC') rBC?.setAttribute({ strokeWidth: 4, strokeOpacity: 1 });
        if (highlight === 'rCA') rCA?.setAttribute({ strokeWidth: 4, strokeOpacity: 1 });
      }
      if (highlight === 'plano') {
        plano?.setAttribute({ fillOpacity: 0.3 });
      }
    }

    board.update();
  }, [highlight]);

  return (
    <div className="w-full aspect-video min-h-[350px] relative bg-lienzo/40 border border-pizarra/10 rounded-sm overflow-hidden">
      <div className="absolute top-2 left-3 z-10 text-xs font-serif italic text-pizarra/50">
        Modelo de 3 puntos: 3 puntos, 3 rectas, 1 plano
      </div>
      <div ref={boardRef} id="board-tres-puntos" className="jxgbox absolute inset-0 touch-none" style={{ width: '100%', height: '100%' }} />
    </div>
  );
};
