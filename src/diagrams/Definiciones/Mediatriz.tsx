import { useRef, useEffect } from 'react';
import JXG from 'jsxgraph';
import { useMathStore } from '../../store/MathStoreContext';

function getCSSVar(name: string): string {
  if (typeof document !== 'undefined') {
    return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  }
  return '#000';
}

export const Mediatriz = () => {
  const boardRef = useRef<HTMLDivElement>(null);
  const elementsRef = useRef<Record<string, unknown>>({});

  const highlight = useMathStore((state) => state.variables['highlight']);
  const isHighlight = (id: string) => Array.isArray(highlight) ? (highlight as unknown as string[]).includes(id) : highlight === id;

  useEffect(() => {
    if (!boardRef.current) return;

    if (!boardRef.current.id) boardRef.current.id = "jxgbox_" + Math.random().toString(36).substring(2, 9);
    const board = JXG.JSXGraph.initBoard(boardRef.current.id, {
      boundingbox: [-6, 6, 6, -5],
      axis: false,
      showCopyright: false,
      keepaspectratio: true,
      grid: false,
    });

    const C_PRIM  = getCSSVar('--theme-ocre');
    const C_MED   = getCSSVar('--theme-terracota');
    const C_EQ    = getCSSVar('--theme-salvia');
    const C_ORTHO = getCSSVar('--theme-pavo');

    const SNAP = 0.5;
    const A = board.create('point', [-3.5, -1], { name: 'A', size: 5, fillColor: C_PRIM, strokeColor: C_PRIM, showInfobox: false, snapToGrid: true, snapSizeX: SNAP, snapSizeY: SNAP });
    const B = board.create('point', [3, 1.5],   { name: 'B', size: 5, fillColor: C_PRIM, strokeColor: C_PRIM, showInfobox: false, snapToGrid: true, snapSizeX: SNAP, snapSizeY: SNAP });

    const segmento = board.create('segment', [A, B], { strokeColor: C_PRIM, strokeWidth: 2.5 });

    const M = board.create('midpoint', [A, B], { name: 'M', size: 5, fillColor: C_MED, strokeColor: C_MED });

    const mediatriz = board.create('perpendicular', [segmento, M], {
      strokeColor: C_MED, strokeWidth: 2.5
    });

    const P = board.create('glider', [0, 3, mediatriz], { name: 'P', size: 4, fillColor: C_EQ, strokeColor: C_EQ });

    const distPA = board.create('segment', [P, A], { strokeColor: C_EQ, strokeWidth: 2, dash: 2 });
    const distPB = board.create('segment', [P, B], { strokeColor: C_EQ, strokeWidth: 2, dash: 2 });

    const sqSize = 0.45;
    const segDir = () => {
      const dx = B.X() - A.X(), dy = B.Y() - A.Y();
      const len = Math.hypot(dx, dy);
      if (len < 1e-6) return { x: 1, y: 0 };
      return { x: dx / len, y: dy / len };
    };
    const perpDir = () => {
      const d = segDir();
      return { x: -d.y, y: d.x };
    };

    const sq0 = board.create('point', [() => M.X(), () => M.Y()], { visible: false });
    const sq1 = board.create('point', [
      () => { const d = segDir(); return M.X() + d.x * sqSize; },
      () => { const d = segDir(); return M.Y() + d.y * sqSize; }
    ], { visible: false });
    const sq2 = board.create('point', [
      () => { const d = segDir(); const p = perpDir(); return M.X() + d.x * sqSize + p.x * sqSize; },
      () => { const d = segDir(); const p = perpDir(); return M.Y() + d.y * sqSize + p.y * sqSize; }
    ], { visible: false });
    const sq3 = board.create('point', [
      () => { const p = perpDir(); return M.X() + p.x * sqSize; },
      () => { const p = perpDir(); return M.Y() + p.y * sqSize; }
    ], { visible: false });

    const angRecto = board.create('polygon', [sq0, sq1, sq2, sq3], {
      fillColor: C_ORTHO, fillOpacity: 0.35,
      strokeColor: C_ORTHO, strokeWidth: 1.5,
      vertices: { visible: false },
      borders: { strokeColor: C_ORTHO, strokeWidth: 1.5 },
      visible: false
    });

    const mkTick = (p: any, q: any) => {
      const mA = board.create('point', [() => (p.X() + q.X()) / 2, () => (p.Y() + q.Y()) / 2], { visible: false });
      const t0 = board.create('point', [
        () => { const dx = q.X()-p.X(), dy = q.Y()-p.Y(); const len = Math.hypot(dx, dy) || 1; return mA.X() + dy/len * 0.25; },
        () => { const dx = q.X()-p.X(), dy = q.Y()-p.Y(); const len = Math.hypot(dx, dy) || 1; return mA.Y() - dx/len * 0.25; }
      ], { visible: false });
      const t1 = board.create('point', [
        () => { const dx = q.X()-p.X(), dy = q.Y()-p.Y(); const len = Math.hypot(dx, dy) || 1; return mA.X() - dy/len * 0.25; },
        () => { const dx = q.X()-p.X(), dy = q.Y()-p.Y(); const len = Math.hypot(dx, dy) || 1; return mA.Y() + dx/len * 0.25; }
      ], { visible: false });
      return board.create('segment', [t0, t1], { strokeColor: C_PRIM, strokeWidth: 2.2, visible: false }) as any;
    };

    const congAM = mkTick(A, M);
    const congMB = mkTick(M, B);

    const infoText = board.create('text', [
      -5.5, 5.5,
      () => {
        const dPA = P.Dist(A), dPB = P.Dist(B);
        return `<div style="font-family: var(--font-serif); color: ${getCSSVar('--theme-carbon')}; line-height:1.3;">
          <strong style="font-size: 1.1rem; color:${getCSSVar('--theme-terracota')};">Equidistancia</strong><br/>
          <small>PA = ${dPA.toFixed(2)}</small><br/>
          <small>PB = ${dPB.toFixed(2)}</small><br/>
          <small style="color:${dPA === dPB ? getCSSVar('--theme-musgo') : getCSSVar('--theme-granada')};">
            ${Math.abs(dPA - dPB) < 0.01 ? 'PA \u2261 PB' : 'PA \u2260 PB'}
          </small>
        </div>`;
      }
    ], { fixed: true, anchorX: 'left', anchorY: 'top' });

    elementsRef.current = { A, B, segmento, M, mediatriz, P, distPA, distPB, angRecto, congAM, congMB, infoText, board };

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
    const { A, B, segmento, M, mediatriz, P, distPA, distPB, angRecto, congAM, congMB, board } = elementsRef.current as Record<string, any>;
    if (!board) return;

    const isExtr = isHighlight('extremo');
    const isEq = isHighlight('equidistancia');
    const isPP = isHighlight('punto-p');
    const isMed = isHighlight('mediatriz');
    const isMid = isHighlight('punto-medio');
    const isSeg = isHighlight('segmento');
    const showAll = !isExtr && !isEq && !isPP && !isMed && !isMid && !isSeg;

    A.setAttribute({ strokeOpacity: isExtr || showAll ? 1 : 0.3, fillOpacity: isExtr || showAll ? 1 : 0.3, size: isExtr ? 7 : 5 });
    B.setAttribute({ strokeOpacity: isExtr || showAll ? 1 : 0.3, fillOpacity: isExtr || showAll ? 1 : 0.3, size: isExtr ? 7 : 5 });

    segmento.setAttribute({ strokeOpacity: isSeg || showAll ? 1 : 0.3, strokeWidth: isSeg ? 4 : 2.5 });

    distPA.setAttribute({ strokeOpacity: isEq || showAll ? 1 : 0.2, strokeWidth: isEq ? 3 : 2 });
    distPB.setAttribute({ strokeOpacity: isEq || showAll ? 1 : 0.2, strokeWidth: isEq ? 3 : 2 });
    P.setAttribute({ strokeOpacity: isPP || isEq || showAll ? 1 : 0.3, fillOpacity: isPP || isEq || showAll ? 1 : 0.3, size: isPP ? 6 : 4 });

    mediatriz.setAttribute({ strokeOpacity: isMed || showAll ? 1 : 0.3, strokeWidth: isMed ? 4 : 2.5 });

    angRecto.setAttribute({ visible: isMed || showAll, strokeOpacity: isMed || showAll ? 1 : 0.2, fillOpacity: isMed ? 0.5 : 0.2 });
    congAM.setAttribute({ visible: isMid || isMed || showAll });
    congMB.setAttribute({ visible: isMid || isMed || showAll });

    M.setAttribute({ strokeOpacity: isMid || isMed || showAll ? 1 : 0.3, fillOpacity: isMid || isMed || showAll ? 1 : 0.3, size: isMid ? 6 : 5 });

    board.update();
  }, [highlight, isHighlight]);

  return (
    <div className="w-full h-full min-h-[300px] relative bg-lienzo/40 border border-pizarra/10 rounded-sm overflow-hidden">
      <div className="absolute top-2 left-3 z-10 text-xs font-serif italic text-pizarra/50">
        Arrastra <span className="font-bold not-italic text-terracota">P</span> sobre la mediatriz
      </div>
      <div ref={boardRef} className="w-full h-full touch-none" />
    </div>
  );
};
