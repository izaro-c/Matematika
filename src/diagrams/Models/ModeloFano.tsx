import { useRef, useEffect } from 'react';
import JXG from 'jsxgraph';
import { useMathStore } from '../../store/MathStoreContext';
function getCSSVar(name: string): string {
  if (typeof document !== 'undefined') {
    return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  }
  return '#000';
}


export const ModeloFano = () => {
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

    const sqrt3 = Math.sqrt(3);
    const p1 = board.create('point', [0, 2], { name: '1', size: 5, fillColor: getCSSVar('--theme-terracota'), strokeColor: getCSSVar('--theme-terracota'), fixed: true });
    const p2 = board.create('point', [-sqrt3, -1], { name: '2', size: 5, fillColor: getCSSVar('--theme-terracota'), strokeColor: getCSSVar('--theme-terracota'), fixed: true });
    const p3 = board.create('point', [sqrt3, -1], { name: '3', size: 5, fillColor: getCSSVar('--theme-terracota'), strokeColor: getCSSVar('--theme-terracota'), fixed: true });

    const p4 = board.create('point', [0, -1], { name: '4', size: 5, fillColor: getCSSVar('--theme-terracota'), strokeColor: getCSSVar('--theme-terracota'), fixed: true });
    const p5 = board.create('point', [sqrt3/2, 0.5], { name: '5', size: 5, fillColor: getCSSVar('--theme-terracota'), strokeColor: getCSSVar('--theme-terracota'), fixed: true });
    const p6 = board.create('point', [-sqrt3/2, 0.5], { name: '6', size: 5, fillColor: getCSSVar('--theme-terracota'), strokeColor: getCSSVar('--theme-terracota'), fixed: true });

    const p7 = board.create('point', [0, 0], { name: '7', size: 5, fillColor: getCSSVar('--theme-musgo'), strokeColor: getCSSVar('--theme-musgo'), fixed: true });

    const l1 = board.create('segment', [p1, p2], { strokeColor: getCSSVar('--theme-carbon'), highlight: false, name: 'l1' });
    const l2 = board.create('segment', [p2, p3], { strokeColor: getCSSVar('--theme-carbon'), highlight: false, name: 'l2' });
    const l3 = board.create('segment', [p3, p1], { strokeColor: getCSSVar('--theme-carbon'), highlight: false, name: 'l3' });

    const l4 = board.create('segment', [p1, p4], { strokeColor: getCSSVar('--theme-carbon'), highlight: false, name: 'l4' });
    const l5 = board.create('segment', [p2, p5], { strokeColor: getCSSVar('--theme-carbon'), highlight: false, name: 'l5' });
    const l6 = board.create('segment', [p3, p6], { strokeColor: getCSSVar('--theme-carbon'), highlight: false, name: 'l6' });

    const l7 = board.create('circle', [p7, p4], { strokeColor: getCSSVar('--theme-carbon'), dash: 2, highlight: false, name: 'l7' });

    (board as any)._el_p1 = p1;
    (board as any)._el_p2 = p2;
    (board as any)._el_p3 = p3;
    (board as any)._el_p4 = p4;
    (board as any)._el_p5 = p5;
    (board as any)._el_p6 = p6;
    (board as any)._el_p7 = p7;
    (board as any)._el_l1 = l1;
    (board as any)._el_l2 = l2;
    (board as any)._el_l3 = l3;
    (board as any)._el_l4 = l4;
    (board as any)._el_l5 = l5;
    (board as any)._el_l6 = l6;
    (board as any)._el_l7 = l7;

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

    const points = [1, 2, 3, 4, 5, 6, 7].map(i => (board as any)[`_el_p${i}`]);
    const lines = [1, 2, 3, 4, 5, 6, 7].map(i => (board as any)[`_el_l${i}`]);

    // reset
    points.forEach(pt => pt?.setAttribute({ size: 5, fillOpacity: 1, strokeOpacity: 1 }));
    lines.forEach(ln => ln?.setAttribute({ strokeWidth: ln.name === 'l7' ? 1 : 2, strokeOpacity: 1 }));

    if (typeof highlight === 'string') {
      if (['1', '2', '3', '4', '5', '6', '7'].includes(highlight)) {
        points.forEach(pt => pt?.setAttribute({ fillOpacity: 0.2, strokeOpacity: 0.2 }));
        const idx = parseInt(highlight) - 1;
        if (points[idx]) points[idx]?.setAttribute({ size: 9, fillOpacity: 1, strokeOpacity: 1 });
      } else if (['l1', 'l2', 'l3', 'l4', 'l5', 'l6', 'l7'].includes(highlight)) {
        lines.forEach(ln => ln?.setAttribute({ strokeOpacity: 0.2 }));
        const idx = parseInt(highlight.replace('l', '')) - 1;
        if (lines[idx]) lines[idx]?.setAttribute({ strokeWidth: 4, strokeOpacity: 1 });
      }
    }

    board.update();
  }, [highlight]);

  return (
    <div className="w-full aspect-square md:aspect-video min-h-[350px] relative bg-lienzo/40 border border-pizarra/10 rounded-sm overflow-hidden">
      <div className="absolute top-2 left-3 z-10 text-xs font-serif italic text-pizarra/50">
        Plano de Fano
      </div>
      <div ref={boardRef} id="board-fano" className="jxgbox absolute inset-0 touch-none" style={{ width: '100%', height: '100%' }} />
    </div>
  );
};
