import { useRef, useEffect } from 'react';
import { getCSSVar } from '@/features/graph/ui/MathUtils';
import JXG from 'jsxgraph';

export const ModeloCartesiano = () => {
  const boardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!boardRef.current) return;

    if (!boardRef.current.id) boardRef.current.id = "jxgbox_" + Math.random().toString(36).substring(2, 9);
    const board = JXG.JSXGraph.initBoard(boardRef.current.id, {
      boundingbox: [-6, 6, 6, -6],
      axis: true,
      showCopyright: false,
      keepaspectratio: true,
      grid: true,
    });

    const C_ACC  = getCSSVar('--theme-terracota');
    const C_LINE = getCSSVar('--theme-musgo');
    const C_PAR  = getCSSVar('--theme-salvia');

    const A = board.create('point', [1, 2], { name: 'A', size: 5, fillColor: C_ACC, strokeColor: C_ACC, showInfobox: false, snapToGrid: true, snapSizeX: 0.5, snapSizeY: 0.5 });
    const B = board.create('point', [-3, -1], { name: 'B', size: 5, fillColor: C_ACC, strokeColor: C_ACC, showInfobox: false, snapToGrid: true, snapSizeX: 0.5, snapSizeY: 0.5 });
    const P = board.create('point', [3, -2], { name: 'P', size: 5, fillColor: C_ACC, strokeColor: C_ACC, showInfobox: false, snapToGrid: true, snapSizeX: 0.5, snapSizeY: 0.5 });

    board.create('line', [A, B], { strokeColor: C_LINE, strokeWidth: 2.5 });

    const lineAB_inv = board.create('line', [A, B], { visible: false });
    board.create('parallel', [lineAB_inv, P], { strokeColor: C_PAR, strokeWidth: 2, dash: 2 });

    board.create('text', [4.5, 5.5, () => {
      const dx = B.X() - A.X(), dy = B.Y() - A.Y();
      const d = Math.hypot(dx, dy);
      return `<div style="font-family: var(--font-serif); color:${getCSSVar('--theme-carbon')}; text-align:right;">
        <strong style="font-size:1.1rem;">&reals;<sup>2</sup></strong><br/>
        <small style="color:${getCSSVar('--theme-musgo')};">l: ${dy.toFixed(1)}x ${-dx >= 0 ? '+' : '-'} ${Math.abs(dx).toFixed(1)}y = c</small><br/>
        <small style="color:${getCSSVar('--theme-salvia')};">l' ∥ l por P</small><br/>
        <small>d(A,B) = ${d.toFixed(2)}</small>
      </div>`;
    }], { fixed: true, anchorX: 'right', anchorY: 'top' });

    board.update();
    (board.renderer as any).container.style.backgroundColor = getCSSVar('--theme-lienzo');

    const obs = new MutationObserver(() => {
      if (board) { (board.renderer as any).container.style.backgroundColor = getCSSVar('--theme-lienzo'); board.update(); }
    });
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

    return () => { obs.disconnect(); JXG.JSXGraph.freeBoard(board); };
  }, []);

  return (
    <div className="w-full h-full min-h-[350px] relative bg-lienzo/40 border border-pizarra/10 rounded-sm overflow-hidden">
      <div className="absolute top-2 left-3 z-10 text-xs font-serif italic text-pizarra/50">
        &reals;<sup>2</sup>: puntos &rarr; pares (x,y) &middot; rectas &rarr; ax+by+c=0
      </div>
      <div ref={boardRef} className="w-full h-full touch-none" role="img" aria-label="Plano cartesiano con ejes, cuadrícula, puntos A y B, la recta l que los une, un punto P exterior y la recta paralela a l por P" />
    </div>
  );
};
