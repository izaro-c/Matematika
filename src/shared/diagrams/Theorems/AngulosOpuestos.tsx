import { useRef, useEffect } from 'react';
import JXG from 'jsxgraph';
import { useMathStore } from '@/app/providers/MathStoreContext';

function getCSSVar(name: string): string {
  if (typeof document !== 'undefined') {
    return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  }
  return '#000';
}

export const AngulosOpuestos = () => {
  const boardRef = useRef<HTMLDivElement>(null);
  const elementsRef = useRef<Record<string, unknown>>({});

  const highlight = useMathStore((state) => state.variables['highlight']);
  const isHighlight = (id: string) => Array.isArray(highlight) ? (highlight as unknown as string[]).includes(id) : highlight === id;

  useEffect(() => {
    if (!boardRef.current) return;

    if (!boardRef.current.id) boardRef.current.id = "jxgbox_" + Math.random().toString(36).substring(2, 9);
    const board = JXG.JSXGraph.initBoard(boardRef.current.id, {
      boundingbox: [-5, 5, 5, -5],
      axis: false,
      showCopyright: false,
      keepaspectratio: true,
      grid: false,
    });

    const C_O   = getCSSVar('--theme-terracota');
    const C_A   = getCSSVar('--theme-salvia');
    const C_B   = getCSSVar('--theme-pavo');
    const C_LINE = getCSSVar('--theme-carbon');

    const O = board.create('point', [0, 0], { name: 'O', size: 6, fillColor: C_O, strokeColor: C_O, fixed: true, showInfobox: false });

    const A = board.create('point', [3, 2],  { name: 'A', size: 4, fillColor: C_A, strokeColor: C_A, showInfobox: false, snapToGrid: true, snapSizeX: 0.5, snapSizeY: 0.5 });
    const B = board.create('point', [-3.5, 1.5], { name: 'B', size: 4, fillColor: C_B, strokeColor: C_B, showInfobox: false, snapToGrid: true, snapSizeX: 0.5, snapSizeY: 0.5 });

    const Ap = board.create('point', [() => -A.X(), () => -A.Y()], { name: "A'", size: 4, fillColor: C_A, strokeColor: C_A, showInfobox: false });
    const Bp = board.create('point', [() => -B.X(), () => -B.Y()], { name: "B'", size: 4, fillColor: C_B, strokeColor: C_B, showInfobox: false });

    board.create('line', [A, Ap], { strokeColor: C_LINE, strokeWidth: 2, fixed: true });
    board.create('line', [B, Bp], { strokeColor: C_LINE, strokeWidth: 2, fixed: true });

    const angleA1 = board.create('angle', [B, O, Ap], { name: '&alpha;', radius: 0.7, fillColor: C_A, strokeColor: C_A, fillOpacity: 0.2, type: 'sector' }) as any;
    const angleA2 = board.create('angle', [Bp, O, A], { name: '&alpha;', radius: 0.7, fillColor: C_A, strokeColor: C_A, fillOpacity: 0.2, type: 'sector' }) as any;
    const angleB1 = board.create('angle', [A, O, B],  { name: '&beta;',  radius: 0.7, fillColor: C_B, strokeColor: C_B, fillOpacity: 0.2, type: 'sector' }) as any;
    const angleB2 = board.create('angle', [Ap, O, Bp], { name: '&beta;',  radius: 0.7, fillColor: C_B, strokeColor: C_B, fillOpacity: 0.2, type: 'sector' }) as any;

    const orientAO = () => Math.atan2(A.Y(), A.X());
    const orientBO = () => Math.atan2(B.Y(), B.X());
    A.on('drag', () => {
      const aB = orientBO(), aA = orientAO();
      let diff = aA - aB;
      if (diff < 0) diff += 2 * Math.PI;
      if (diff < 0.05 || diff > 2 * Math.PI - 0.05) A.moveTo([B.X() * 0.5, B.Y() * 0.5], 0);
    });
    B.on('drag', () => {
      const aB = orientBO(), aA = orientAO();
      let diff = aB - aA;
      if (diff < 0) diff += 2 * Math.PI;
      if (diff < 0.05 || diff > 2 * Math.PI - 0.05) B.moveTo([A.X() * 0.5, A.Y() * 0.5], 0);
    });

    elementsRef.current = { O, A, B, Ap, Bp, angleA1, angleA2, angleB1, angleB2, board };

    board.update();
    (board.renderer as any).container.style.backgroundColor = getCSSVar('--theme-lienzo');

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
      elementsRef.current = {};
    };
  }, []);

  useEffect(() => {
    const els = elementsRef.current as Record<string, any>;
    if (!els.board) return;
    const { angleA1, angleA2, angleB1, angleB2, board } = els;

    const hAlpha = isHighlight('alpha');
    const hBeta = isHighlight('beta');
    const anyH = hAlpha || hBeta;
    const showAll = !anyH;

    const C_A = getCSSVar('--theme-salvia');
    const C_B = getCSSVar('--theme-pavo');

    const sop = (active: boolean) => active || showAll ? 1 : 0.08;

    angleA1.setAttribute({ fillOpacity: hAlpha ? 0.45 : 0.2, strokeOpacity: sop(hAlpha), strokeColor: C_A, fillColor: C_A, strokeWidth: hAlpha ? 3 : 1.5 });
    angleA2.setAttribute({ fillOpacity: hAlpha ? 0.45 : 0.2, strokeOpacity: sop(hAlpha), strokeColor: C_A, fillColor: C_A, strokeWidth: hAlpha ? 3 : 1.5 });
    angleB1.setAttribute({ fillOpacity: hBeta  ? 0.45 : 0.2, strokeOpacity: sop(hBeta),  strokeColor: C_B, fillColor: C_B, strokeWidth: hBeta  ? 3 : 1.5 });
    angleB2.setAttribute({ fillOpacity: hBeta  ? 0.45 : 0.2, strokeOpacity: sop(hBeta),  strokeColor: C_B, fillColor: C_B, strokeWidth: hBeta  ? 3 : 1.5 });

    board.update();
  }, [highlight, isHighlight]);

  return (
    <div className="w-full h-full min-h-[300px] relative bg-lienzo/40 border border-pizarra/10 rounded-sm overflow-hidden">
      <div className="absolute top-2 left-3 z-10 text-xs font-serif italic text-pizarra/50">
        Arrastra <span className="font-bold not-italic" style={{color:getCSSVar('--theme-salvia')}}>A</span> o <span className="font-bold not-italic" style={{color:getCSSVar('--theme-pavo')}}>B</span>
      </div>
      <div ref={boardRef} className="w-full h-full touch-none" />
    </div>
  );
};
