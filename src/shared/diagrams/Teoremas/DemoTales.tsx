import { useRef, useEffect } from 'react';
import JXG from 'jsxgraph';
import { useMathStore } from '@/app/providers/MathStoreContext';
import { useLessonStore } from '@/features/lessons/LessonStore';

function getCSSVar(name: string): string {
  if (typeof document !== 'undefined') {
    return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  }
  return '#000';
}

export const DemoTales = () => {
  const boardRef = useRef<HTMLDivElement>(null);
  const elementsRef = useRef<Record<string, unknown>>({});

  const mathHL = useMathStore(s => s.variables?.['highlight']);
  const lessonHL = useLessonStore(s => s.activeStep);
  const highlight = mathHL || lessonHL;
  const isHL = (id: string) => Array.isArray(highlight) ? (highlight as unknown as string[]).includes(id) : highlight === id;

  useEffect(() => {
    if (!boardRef.current) return;
    if (!boardRef.current.id) boardRef.current.id = "jxgbox_" + Math.random().toString(36).substring(2, 9);
    const board = JXG.JSXGraph.initBoard(boardRef.current.id, {
      boundingbox: [-5, 5, 5, -5],
      axis: false, showCopyright: false, keepaspectratio: true, grid: false,
    });

    const C_PRIM = getCSSVar('--theme-carbon');
    const C_ACC  = getCSSVar('--theme-terracota');
    const C_PAR  = getCSSVar('--theme-salvia');
    const C_H    = getCSSVar('--theme-ocre');

    const A = board.create('point', [-3, -2], { name: 'A', size: 5, fillColor: C_PRIM, strokeColor: C_PRIM, showInfobox: false, snapToGrid: true, snapSizeX: 0.5, snapSizeY: 0.5 });
    const B = board.create('point', [3, -2],  { name: 'B', size: 5, fillColor: C_PRIM, strokeColor: C_PRIM, showInfobox: false, snapToGrid: true, snapSizeX: 0.5, snapSizeY: 0.5 });
    const C = board.create('point', [4, 3],   { name: 'C', size: 5, fillColor: C_PRIM, strokeColor: C_PRIM, showInfobox: false, snapToGrid: true, snapSizeX: 0.5, snapSizeY: 0.5 });

    board.create('segment', [A, B], { strokeColor: C_PRIM, strokeWidth: 2.5 });
    board.create('segment', [B, C], { strokeColor: C_PRIM, strokeWidth: 2.5 });
    board.create('segment', [C, A], { strokeColor: C_PRIM, strokeWidth: 2.5 });
    const polyABC = board.create('polygon', [A, B, C], { fillColor: C_PRIM, fillOpacity: 0.06, borders: { visible: false }, vertices: { visible: false } });

    const segAB = board.create('segment', [A, B], { visible: false });
    const D = board.create('glider', [-1, -2, segAB], { name: 'D', size: 4, fillColor: C_ACC, strokeColor: C_ACC, showInfobox: false });

    const lineBC = board.create('line', [B, C], { visible: false });
    const lineCA = board.create('line', [C, A], { visible: false });
    const parDE = board.create('parallel', [lineBC, D], { visible: false });
    const E = board.create('intersection', [parDE, lineCA, 0], { name: 'E', size: 4, fillColor: C_ACC, strokeColor: C_ACC, showInfobox: false });

    const segDE = board.create('segment', [D, E], { strokeColor: C_PAR, strokeWidth: 2.5, dash: 2 });
    board.create('segment', [B, E], { strokeColor: C_PRIM, strokeWidth: 1, dash: 1, visible: false });
    board.create('segment', [C, D], { strokeColor: C_PRIM, strokeWidth: 1, dash: 1, visible: false });

    const polyADE = board.create('polygon', [A, D, E], { fillColor: C_H, fillOpacity: 0, borders: { visible: false }, vertices: { visible: false } });
    const polyBDE = board.create('polygon', [B, D, E], { fillColor: C_H, fillOpacity: 0, borders: { visible: false }, vertices: { visible: false } });
    const polyCDE = board.create('polygon', [C, D, E], { fillColor: C_H, fillOpacity: 0, borders: { visible: false }, vertices: { visible: false } });

    const lineAB = board.create('line', [A, B], { visible: false });
    const H1 = board.create('intersection', [lineAB, board.create('perpendicular', [lineAB, E], { visible: false }), 0], { visible: false });
    const segH1 = board.create('segment', [E, H1], { strokeColor: C_H, strokeWidth: 2, dash: 2, visible: false });

    const H2 = board.create('intersection', [lineCA, board.create('perpendicular', [lineCA, D], { visible: false }), 0], { visible: false });
    const segH2 = board.create('segment', [D, H2], { strokeColor: C_H, strokeWidth: 2, dash: 2, visible: false });

    elementsRef.current = { A, B, C, D, E, polyABC, polyADE, polyBDE, polyCDE, segDE, segH1, segH2, board };

    board.update();
    (board.renderer as any).container.style.backgroundColor = getCSSVar('--theme-lienzo');
    const obs = new MutationObserver(() => { if (board) { (board.renderer as any).container.style.backgroundColor = getCSSVar('--theme-lienzo'); board.update(); } });
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => { obs.disconnect(); JXG.JSXGraph.freeBoard(board); elementsRef.current = {}; };
  }, []);

  useEffect(() => {
    const els = elementsRef.current as Record<string, any>;
    if (!els.board) return;
    const { A, B, C, D, E, polyABC, polyADE, polyBDE, polyCDE, segDE, segH1, segH2, board } = els;

    const hTri = isHL('triangulo-abc');
    const hDE = isHL('recta-de');
    const hADE = isHL('triangulo-ade');
    const hBDE = isHL('triangulo-bde');
    const hCDE = isHL('triangulo-cde');
    const hH1 = isHL('altura-h1');
    const hH2 = isHL('altura-h2');
    const hProp = isHL('proporcion');
    const anyH = hTri || hDE || hADE || hBDE || hCDE || hH1 || hH2 || hProp;
    const showAll = !anyH;

    const op = (t: any) => t || showAll ? 1 : 0.12;

    polyABC.setAttribute({ fillOpacity: hTri ? 0.18 : 0.06 });
    segDE.setAttribute({ strokeOpacity: op(hDE || showAll), strokeWidth: hDE ? 3.5 : 2.5 });

    polyADE.setAttribute({ fillOpacity: hADE ? 0.15 : 0, borders: { visible: false } });
    polyBDE.setAttribute({ fillOpacity: hBDE ? 0.15 : 0, borders: { visible: false } });
    polyCDE.setAttribute({ fillOpacity: hCDE ? 0.15 : 0, borders: { visible: false } });

    segH1.setAttribute({ visible: hH1 || showAll, strokeOpacity: hH1 ? 1 : 0.4 });
    segH2.setAttribute({ visible: hH2 || showAll, strokeOpacity: hH2 ? 1 : 0.4 });

    [A, B, C].forEach((p: any) => p.setAttribute({ strokeOpacity: op(showAll), fillOpacity: op(showAll) }));
    [D, E].forEach((p: any) => p.setAttribute({ strokeOpacity: op(hDE||hADE||hBDE||hCDE||showAll), fillOpacity: op(hDE||hADE||hBDE||hCDE||showAll), size: hADE||hBDE||hCDE ? 6 : 4 }));

    board.update();
  }, [highlight]);

  return (
    <div className="w-full h-full min-h-[350px] relative bg-lienzo/40 border border-pizarra/10 rounded-sm overflow-hidden">
      <div ref={boardRef} className="w-full h-full touch-none" />
    </div>
  );
};
