import { useRef, useEffect } from 'react';
import JXG from 'jsxgraph';
import { useMathStore } from '@/boundary/contexts/MathStoreContext';
import { useLessonStore } from '@/controller/store/LessonStore';

function getCSSVar(name: string): string {
  if (typeof document !== 'undefined') {
    return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  }
  return '#000';
}

export const DemoSumaAngulos = () => {
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

    const C_PRIM  = getCSSVar('--theme-carbon');
    const C_ANG   = getCSSVar('--theme-salvia');
    const C_PAR   = getCSSVar('--theme-terracota');
    const C_POL   = getCSSVar('--theme-pavo');

    const A = board.create('point', [-3, -2], { name: 'A', size: 5, fillColor: C_PRIM, strokeColor: C_PRIM, showInfobox: false, snapToGrid: true, snapSizeX: 0.5, snapSizeY: 0.5 });
    const B = board.create('point', [3, -2],  { name: 'B', size: 5, fillColor: C_PRIM, strokeColor: C_PRIM, showInfobox: false, snapToGrid: true, snapSizeX: 0.5, snapSizeY: 0.5 });
    const C = board.create('point', [0, 2.5], { name: 'C', size: 5, fillColor: C_PRIM, strokeColor: C_PRIM, showInfobox: false, snapToGrid: true, snapSizeX: 0.5, snapSizeY: 0.5 });

    board.create('segment', [A, B], { strokeColor: C_PRIM, strokeWidth: 2.5 });
    board.create('segment', [A, C], { strokeColor: C_PRIM, strokeWidth: 2 });
    board.create('segment', [B, C], { strokeColor: C_PRIM, strokeWidth: 2 });

    const poly = board.create('polygon', [A, B, C], { fillColor: C_POL, fillOpacity: 0.06, borders: { visible: false }, vertices: { visible: false } });

    const angleA = board.create('angle', [B, A, C], { name: '&alpha;', radius: 0.7, fillColor: C_ANG, strokeColor: C_ANG, fillOpacity: 0.25, type: 'sector', visible: false }) as any;
    const angleB = board.create('angle', [C, B, A], { name: '&beta;',  radius: 0.7, fillColor: C_ANG, strokeColor: C_ANG, fillOpacity: 0.25, type: 'sector', visible: false }) as any;
    const angleC = board.create('angle', [A, C, B], { name: '&gamma;', radius: 0.7, fillColor: C_ANG, strokeColor: C_ANG, fillOpacity: 0.25, type: 'sector', visible: false }) as any;

    const lineAB = board.create('line', [A, B], { visible: false });
    const paralela = board.create('parallel', [lineAB, C], { strokeColor: C_PAR, strokeWidth: 2.5, dash: 2, visible: false });

    const C_left = board.create('point', [() => C.X() - 5, () => C.Y()], { visible: false });
    const C_right = board.create('point', [() => C.X() + 5, () => C.Y()], { visible: false });

    const altA = board.create('angle', [C_left, C, A], { name: "&alpha;'", radius: 0.5, fillColor: C_PAR, strokeColor: C_PAR, fillOpacity: 0.3, type: 'sector', visible: false }) as any;
    const altB = board.create('angle', [B, C, C_right], { name: "&beta;'",  radius: 0.5, fillColor: C_PAR, strokeColor: C_PAR, fillOpacity: 0.3, type: 'sector', visible: false }) as any;

    elementsRef.current = { A, B, C, poly, angleA, angleB, angleC, paralela, C_left, C_right, altA, altB, board };

    board.update();
    (board.renderer as any).container.style.backgroundColor = getCSSVar('--theme-lienzo');
    const obs = new MutationObserver(() => { if (board) { (board.renderer as any).container.style.backgroundColor = getCSSVar('--theme-lienzo'); board.update(); } });
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => { obs.disconnect(); JXG.JSXGraph.freeBoard(board); elementsRef.current = {}; };
  }, []);

  useEffect(() => {
    const els = elementsRef.current as Record<string, any>;
    if (!els.board) return;
    const { A, B, C, poly, angleA, angleB, angleC, paralela, altA, altB, board } = els;

    const hTri = isHL('triangulo') || isHL('base-ab');
    const hPar = isHL('paralela');
    const hAngA = isHL('angulo-a');
    const hAngB = isHL('angulo-b');
    const hAngC = isHL('angulo-c');
    const hAltA = isHL('alterno-a');
    const hAltB = isHL('alterno-b');
    const hLano = isHL('angulo-llano');
    const hVertC = isHL('vertice-c');
    const anyH = hTri || hPar || hAngA || hAngB || hAngC || hAltA || hAltB || hLano || hVertC;
    const showAll = !anyH;

    const op = (t: any) => t || showAll ? 1 : 0.12;

    [A, B, C].forEach((p: any) => p.setAttribute({ strokeOpacity: op(showAll), fillOpacity: op(showAll), size: hVertC && p === C ? 7 : 5 }));
    poly.setAttribute({ fillOpacity: hTri ? 0.18 : 0.06 });

    paralela.setAttribute({ visible: showAll || hPar || hAltA || hAltB || hLano, strokeOpacity: hPar ? 1 : 0.4 });
    angleA.setAttribute({ visible: showAll || hTri || hAngA || hAltA || hLano, fillOpacity: hAngA||hAltA ? 0.45 : 0.25, strokeOpacity: op(hAngA||hAltA) });
    angleB.setAttribute({ visible: showAll || hTri || hAngB || hAltB || hLano, fillOpacity: hAngB||hAltB ? 0.45 : 0.25, strokeOpacity: op(hAngB||hAltB) });
    angleC.setAttribute({ visible: showAll || hTri || hAngC || hLano, fillOpacity: 0.25, strokeOpacity: op(hAngC) });
    altA.setAttribute({ visible: showAll || hAltA || hLano, fillOpacity: hAltA||hLano ? 0.45 : 0.2 });
    altB.setAttribute({ visible: showAll || hAltB || hLano, fillOpacity: hAltB||hLano ? 0.45 : 0.2 });

    board.update();
  }, [highlight]);

  return (
    <div className="w-full h-full min-h-[350px] relative bg-lienzo/40 border border-pizarra/10 rounded-sm overflow-hidden">
      <div ref={boardRef} className="w-full h-full touch-none" />
    </div>
  );
};
