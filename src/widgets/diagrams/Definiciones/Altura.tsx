import { useRef, useEffect } from 'react';
import { getCSSVar } from '@/features/graph/ui/MathUtils';
import JXG from 'jsxgraph';
import { useMathStore } from '@/app/providers/MathStoreContext';

export const Altura = () => {
  const boardRef = useRef<HTMLDivElement>(null);
  const jxgBoard = useRef<any>(null);
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
    jxgBoard.current = board;

    const C_PRIM = getCSSVar('--theme-pavo');
    const C_ACC = getCSSVar('--theme-terracota');
    const C_ORTHO = getCSSVar('--theme-salvia');
    const C_BASE = getCSSVar('--theme-carbon');

    const A = board.create('point', [-2, -2], { name: 'A', size: 4, fillColor: C_PRIM, strokeColor: C_PRIM });
    const B = board.create('point', [3, -1], { name: 'B', size: 4, fillColor: C_PRIM, strokeColor: C_PRIM });
    const C = board.create('point', [0, 3], { name: 'C', size: 4, fillColor: C_PRIM, strokeColor: C_PRIM });

    const poly = board.create('polygon', [A, B, C], {
      fillColor: C_PRIM, fillOpacity: 0.1, borders: { strokeWidth: 2, strokeColor: C_PRIM }
    });

    const baseAB = board.create('line', [A, B], { visible: false });
    const baseBC = board.create('line', [B, C], { visible: false });
    const baseCA = board.create('line', [C, A], { visible: false });

    const HC = board.create('intersection', [
      baseAB, board.create('perpendicular', [baseAB, C], { visible: false }), 0
    ], { name: 'H_c', size: 3, fillColor: C_ACC, strokeColor: C_ACC, visible: false });

    const alturaC = board.create('segment', [C, HC], { strokeColor: C_ACC, strokeWidth: 2, dash: 2 });

    const extEnd = board.create('point', [
      () => {
        const dx = B.X() - A.X(), dy = B.Y() - A.Y();
        const len2 = dx * dx + dy * dy;
        if (len2 < 1e-10) return A.X();
        const t = ((HC.X() - A.X()) * dx + (HC.Y() - A.Y()) * dy) / len2;
        if (t < 0) return A.X();
        if (t > 1) return B.X();
        return HC.X();
      },
      () => {
        const dx = B.X() - A.X(), dy = B.Y() - A.Y();
        const len2 = dx * dx + dy * dy;
        if (len2 < 1e-10) return A.Y();
        const t = ((HC.X() - A.X()) * dx + (HC.Y() - A.Y()) * dy) / len2;
        if (t < 0) return A.Y();
        if (t > 1) return B.Y();
        return HC.Y();
      }
    ], { visible: false });

    const baseExtension = board.create('segment', [extEnd, HC], {
      dash: 2, strokeWidth: 1.5, strokeColor: C_BASE, visible: false
    });

    const sqSize = 0.5;
    const baseDir = () => {
      const mx = (A.X() + B.X()) / 2, my = (A.Y() + B.Y()) / 2;
      const dx = mx - HC.X(), dy = my - HC.Y();
      const len = Math.hypot(dx, dy);
      if (len < 1e-6) return { x: 1, y: 0 };
      return { x: dx / len, y: dy / len };
    };
    const altDir = () => {
      const dx = C.X() - HC.X(), dy = C.Y() - HC.Y();
      const len = Math.hypot(dx, dy);
      if (len < 1e-6) return { x: 0, y: 1 };
      return { x: dx / len, y: dy / len };
    };

    const sq0 = board.create('point', [() => HC.X(), () => HC.Y()], { visible: false });
    const sq1 = board.create('point', [
      () => { const d = baseDir(); return HC.X() + d.x * sqSize; },
      () => { const d = baseDir(); return HC.Y() + d.y * sqSize; }
    ], { visible: false });
    const sq2 = board.create('point', [
      () => { const d = baseDir(); const a = altDir(); return HC.X() + d.x * sqSize + a.x * sqSize; },
      () => { const d = baseDir(); const a = altDir(); return HC.Y() + d.y * sqSize + a.y * sqSize; }
    ], { visible: false });
    const sq3 = board.create('point', [
      () => { const a = altDir(); return HC.X() + a.x * sqSize; },
      () => { const a = altDir(); return HC.Y() + a.y * sqSize; }
    ], { visible: false });

    const angRecto = board.create('polygon', [sq0, sq1, sq2, sq3], {
      fillColor: C_ORTHO, fillOpacity: 0.3,
      strokeColor: C_ORTHO, strokeWidth: 1.5,
      vertices: { visible: false },
      borders: { strokeColor: C_ORTHO, strokeWidth: 1.5 },
      visible: false
    });

    const HA = board.create('intersection', [
      baseBC, board.create('perpendicular', [baseBC, A], { visible: false }), 0
    ], { name: 'H_a', size: 3, fillColor: C_ORTHO, strokeColor: C_ORTHO, visible: false });
    const alturaA = board.create('segment', [A, HA], { strokeColor: C_ORTHO, strokeWidth: 2, dash: 2, visible: false });

    const HB = board.create('intersection', [
      baseCA, board.create('perpendicular', [baseCA, B], { visible: false }), 0
    ], { name: 'H_b', size: 3, fillColor: C_ORTHO, strokeColor: C_ORTHO, visible: false });
    const alturaB = board.create('segment', [B, HB], { strokeColor: C_ORTHO, strokeWidth: 2, dash: 2, visible: false });

    const ortocentro = board.create('intersection', [
      board.create('line', [C, HC], { visible: false }),
      board.create('line', [A, HA], { visible: false }), 0
    ], { name: 'Ortocentro', size: 4, fillColor: C_ORTHO, strokeColor: C_ORTHO, visible: false });

    const updateExtension = () => {
      const dx = B.X() - A.X(), dy = B.Y() - A.Y();
      const len2 = dx * dx + dy * dy;
      let outside = false;
      if (len2 > 1e-10) {
        const t = ((HC.X() - A.X()) * dx + (HC.Y() - A.Y()) * dy) / len2;
        outside = t < -0.001 || t > 1.001;
      }
      baseExtension.setAttribute({ visible: outside });
    };
    board.on('update', updateExtension);

    elementsRef.current = { A, B, C, poly, ladoAB: (poly as any).borders[0], alturaC, HC, baseExtension, angRecto, alturaA, alturaB, HA, HB, ortocentro, board };

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
      board.off('update', updateExtension);
      JXG.JSXGraph.freeBoard(board);
      jxgBoard.current = null;
      elementsRef.current = {};
    };
  }, []);

  useEffect(() => {
    const { C, ladoAB, alturaC, HC, angRecto, alturaA, alturaB, HA, HB, ortocentro, board } = elementsRef.current as Record<string, any>;
    if (!board) return;

    const hVert = isHighlight('vertice-opuesto');
    const hLado = isHighlight('lado-opuesto');
    const hAlt = isHighlight('altura');
    const hOrt = isHighlight('ortogonal');
    const hOrtocentro = isHighlight('ortocentro');
    const showAll = !hVert && !hLado && !hAlt && !hOrt && !hOrtocentro;

    C.setAttribute({ strokeOpacity: hVert || showAll ? 1 : 0.3, fillOpacity: hVert || showAll ? 1 : 0.3, size: hVert ? 6 : 4 });
    ladoAB.setAttribute({ strokeOpacity: hLado || showAll ? 1 : 0.3, strokeWidth: hLado ? 4 : 2 });
    alturaC.setAttribute({ strokeOpacity: hAlt || showAll || hOrtocentro ? 1 : 0.3, strokeWidth: hAlt ? 4 : 2 });

    angRecto.setAttribute({
      visible: hOrt || showAll || hAlt,
      strokeOpacity: hOrt || showAll || hAlt ? 1 : 0.2,
      fillOpacity: hOrt ? 0.45 : 0.15
    });
    HC.setAttribute({ visible: hOrt || hAlt || showAll || hOrtocentro, strokeOpacity: hOrt || hAlt || showAll ? 1 : 0.3, fillOpacity: hOrt || hAlt || showAll ? 1 : 0.3 });

    alturaA.setAttribute({ visible: hOrtocentro });
    alturaB.setAttribute({ visible: hOrtocentro });
    HA.setAttribute({ visible: hOrtocentro });
    HB.setAttribute({ visible: hOrtocentro });
    ortocentro.setAttribute({ visible: hOrtocentro });

    board.update();
  }, [highlight, isHighlight]);

  return (
    <div className="w-full h-full min-h-[300px] relative bg-lienzo/40 border border-pizarra/10 rounded-sm overflow-hidden">
      <div ref={boardRef} className="w-full h-full touch-none" />
    </div>
  );
};
