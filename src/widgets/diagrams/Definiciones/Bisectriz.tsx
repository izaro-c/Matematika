import { useRef, useEffect } from 'react';
import { getCSSVar } from '@/features/graph/ui/MathUtils';
import JXG from 'jsxgraph';
import { useMathStore } from '@/app/providers/MathStoreContext';

export const Bisectriz = () => {
  const boardRef = useRef<HTMLDivElement>(null);
  const jxgBoard = useRef<any>(null);
  const elementsRef = useRef<Record<string, unknown>>({});

  const highlight = useMathStore((state) => state.variables['highlight']);
  const isHighlight = (id: string) => Array.isArray(highlight) ? (highlight as unknown as string[]).includes(id) : highlight === id;

  useEffect(() => {
    if (!boardRef.current) return;

    if (!boardRef.current.id) boardRef.current.id = "jxgbox_" + Math.random().toString(36).substring(2, 9);
    const board = JXG.JSXGraph.initBoard(boardRef.current.id, {
      boundingbox: [-4, 5, 5, -4],
      axis: false,
      showCopyright: false,
      keepaspectratio: true,
      grid: false,
    });
    jxgBoard.current = board;

    const C_ANG = getCSSVar('--theme-ocre');
    const C_BIS = getCSSVar('--theme-salvia');
    const C_VERT = getCSSVar('--theme-terracota');

    const pointCfg = { size: 4, fillColor: C_VERT, strokeColor: C_VERT, showInfobox: false };

    const B = board.create('point', [0, 0], { name: 'V', ...pointCfg });
    const A = board.create('point', [3.5, -1.5], { name: 'A', ...pointCfg });
    const C = board.create('point', [1.5, 3], { name: 'C', ...pointCfg });

    const lado1 = board.create('segment', [B, A], { strokeColor: C_ANG, strokeWidth: 2 });
    const lado2 = board.create('segment', [B, C], { strokeColor: C_ANG, strokeWidth: 2 });

    const bisecDir = board.create('point', [
      () => {
        const ux = A.X() - B.X(), uy = A.Y() - B.Y();
        const vx = C.X() - B.X(), vy = C.Y() - B.Y();
        const uLen = Math.hypot(ux, uy) || 1, vLen = Math.hypot(vx, vy) || 1;
        const dx = ux / uLen + vx / vLen, dy = uy / uLen + vy / vLen;
        const dLen = Math.hypot(dx, dy) || 1;
        return B.X() + dx / dLen;
      },
      () => {
        const ux = A.X() - B.X(), uy = A.Y() - B.Y();
        const vx = C.X() - B.X(), vy = C.Y() - B.Y();
        const uLen = Math.hypot(ux, uy) || 1, vLen = Math.hypot(vx, vy) || 1;
        const dx = ux / uLen + vx / vLen, dy = uy / uLen + vy / vLen;
        const dLen = Math.hypot(dx, dy) || 1;
        return B.Y() + dy / dLen;
      }
    ], { visible: false });

    const bisectriz = board.create('line', [B, bisecDir], {
      strokeColor: C_BIS, strokeWidth: 2.5, dash: 2,
      straightFirst: false, straightLast: true
    });

    const P = board.create('point', [
      () => {
        const ux = A.X() - B.X(), uy = A.Y() - B.Y();
        const vx = C.X() - B.X(), vy = C.Y() - B.Y();
        const uLen = Math.hypot(ux, uy) || 1, vLen = Math.hypot(vx, vy) || 1;
        const dx = ux / uLen + vx / vLen, dy = uy / uLen + vy / vLen;
        const dLen = Math.hypot(dx, dy) || 1;
        return B.X() + dx / dLen * 2.5;
      },
      () => {
        const ux = A.X() - B.X(), uy = A.Y() - B.Y();
        const vx = C.X() - B.X(), vy = C.Y() - B.Y();
        const uLen = Math.hypot(ux, uy) || 1, vLen = Math.hypot(vx, vy) || 1;
        const dx = ux / uLen + vx / vLen, dy = uy / uLen + vy / vLen;
        const dLen = Math.hypot(dx, dy) || 1;
        return B.Y() + dy / dLen * 2.5;
      }
    ], { visible: false });

    const aCfg = { name: '&alpha;', type: 'sector' as const, fillColor: C_BIS, strokeColor: C_BIS, fillOpacity: 0.2, radius: 1.2, label: { fontSize: 16, cssClass: 'font-serif font-bold italic' } };
    const a1ccw = board.create('angle', [A, B, P], aCfg);
    const a2ccw = board.create('angle', [P, B, C], aCfg);
    const a1cw = board.create('angle', [P, B, A], { ...aCfg, visible: false });
    const a2cw = board.create('angle', [C, B, P], { ...aCfg, visible: false });

    const totalAng = board.create('angle', [A, B, C], { visible: false, name: '', radius: 0.001 });
    const infoText = board.create('text', [
      -3.8, 4.5,
      () => {
        const total = (totalAng as any).Value();
        const half = total / 2;
        const totalDeg = Math.round(total * 180 / Math.PI);
        const halfDeg = Math.round(half * 180 / Math.PI);

        const aA = Math.atan2(A.Y() - B.Y(), A.X() - B.X());
        const aC = Math.atan2(C.Y() - B.Y(), C.X() - B.X());
        let ccwFromAtoC = aC - aA;
        if (ccwFromAtoC < 0) ccwFromAtoC += 2 * Math.PI;
        const useCCW = ccwFromAtoC <= Math.PI;

        (a1ccw as any).setAttribute({ visible: useCCW });
        (a2ccw as any).setAttribute({ visible: useCCW });
        (a1cw as any).setAttribute({ visible: !useCCW });
        (a2cw as any).setAttribute({ visible: !useCCW });

        return `<div style="font-family: var(--font-serif); color: ${getCSSVar('--theme-carbon')};">
          <strong style="font-size: 1.1rem;">&alpha; = ${halfDeg}&deg;</strong><br/>
          <i>&Aacute;ngulo: ${totalDeg}&deg;</i>
        </div>`;
      }
    ], { fixed: true, anchorX: 'left', anchorY: 'top' });

    elementsRef.current = { A, B, C, lado1, lado2, bisectriz, P, a1ccw, a2ccw, a1cw, a2cw, infoText, board };

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
      jxgBoard.current = null;
      elementsRef.current = {};
    };
  }, []);

  useEffect(() => {
    const { B, lado1, lado2, bisectriz, a1ccw, a2ccw, a1cw, a2cw, board } = elementsRef.current as Record<string, any>;
    if (!board) return;

    const hAngulo = isHighlight('angulo');
    const hBis = isHighlight('bisectriz');
    const hCong = isHighlight('angulos-congruentes');
    const hVert = isHighlight('vertice');
    const showAll = !hAngulo && !hBis && !hCong && !hVert;

    lado1.setAttribute({ strokeOpacity: hAngulo || showAll ? 1 : 0.3, strokeWidth: hAngulo ? 4 : 2 });
    lado2.setAttribute({ strokeOpacity: hAngulo || showAll ? 1 : 0.3, strokeWidth: hAngulo ? 4 : 2 });
    B.setAttribute({ strokeOpacity: hVert || showAll ? 1 : 0.3, fillOpacity: hVert || showAll ? 1 : 0.3, size: hVert ? 6 : 4 });
    bisectriz.setAttribute({ strokeOpacity: hBis || showAll ? 1 : 0.3, strokeWidth: hBis ? 4 : 2.5 });

    [a1ccw, a2ccw, a1cw, a2cw].forEach((a: any) => a.setAttribute({
      fillOpacity: hCong ? 0.45 : 0.2, strokeOpacity: hCong || showAll ? 1 : 0.3, radius: hCong ? 1.5 : 1.2
    }));

    board.update();
  }, [highlight, isHighlight]);

  return (
    <div className="w-full h-full min-h-[300px] relative bg-lienzo/40 border border-pizarra/10 rounded-sm overflow-hidden">
      <div className="absolute top-2 left-3 z-10 text-xs font-serif italic text-pizarra/50">
        Arrastra los puntos para ampliar o reducir el &aacute;ngulo
      </div>
      <div ref={boardRef} className="w-full h-full touch-none" />
    </div>
  );
};
