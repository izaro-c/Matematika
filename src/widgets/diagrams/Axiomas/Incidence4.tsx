import { useRef, useEffect } from 'react';
import { getCSSVar } from '@/features/graph/ui/MathUtils';
import JXG from 'jsxgraph';
import { useMathStore } from '@/app/providers/MathStoreContext';
import { useLessonStore } from '@/features/lessons/LessonStore';


export const Incidence4 = () => {
  const boardRef = useRef<HTMLDivElement>(null);
  const jxgBoard = useRef<any>(null);
  const elementsRef = useRef<Record<string, unknown>>({});

  const mathHighlight = useMathStore(state => state.variables?.['highlight']);
  const lessonHighlight = useLessonStore(state => state.activeStep);
  const highlight = mathHighlight || lessonHighlight;

  useEffect(() => {
    if (!boardRef.current) return;

    if (!boardRef.current.id) boardRef.current.id = "jxgbox_" + Math.random().toString(36).substring(2, 9);
      const board = JXG.JSXGraph.initBoard(boardRef.current.id, {
      boundingbox: [-4, 4, 4, -3],
      axis: false,
      showCopyright: false,
      keepaspectratio: true,
      grid: false,
    });
    jxgBoard.current = board;

    // Triángulo: tres puntos no colineales
    const A = board.create('point', [-2.5, -1], {
      name: 'A', size: 5, fillColor: getCSSVar('--theme-terracota'), strokeColor: getCSSVar('--theme-terracota'), showInfobox: false,
    });
    const B = board.create('point', [2.5, -1], {
      name: 'B', size: 5, fillColor: getCSSVar('--theme-terracota'), strokeColor: getCSSVar('--theme-terracota'), showInfobox: false,
    });
    const C = board.create('point', [0, 2.5], {
      name: 'C', size: 5, fillColor: getCSSVar('--theme-terracota'), strokeColor: getCSSVar('--theme-terracota'), showInfobox: false,
    });

    // Lados del triángulo
    const lab = board.create('line', [A, B], {
      strokeColor: getCSSVar('--theme-carbon'), strokeWidth: 1.5, highlight: false, dash: 1,
    });
    const lac = board.create('line', [A, C], {
      strokeColor: getCSSVar('--theme-carbon'), strokeWidth: 1.5, highlight: false, dash: 1,
    });
    const lbc = board.create('line', [B, C], {
      strokeColor: getCSSVar('--theme-carbon'), strokeWidth: 1.5, highlight: false, dash: 1,
    });

    // Segmentos destacados
    board.create('segment', [A, B], { strokeColor: getCSSVar('--theme-musgo'), strokeWidth: 2.5, highlight: false });
    board.create('segment', [A, C], { strokeColor: getCSSVar('--theme-musgo'), strokeWidth: 2.5, highlight: false });
    board.create('segment', [B, C], { strokeColor: getCSSVar('--theme-musgo'), strokeWidth: 2.5, highlight: false });

    // Etiqueta "plano" con relleno suave
    const polygonABC = board.create('polygon', [A, B, C], {
      fillColor: getCSSVar('--theme-pizarra'), fillOpacity: 0.08, borders: { visible: false }, vertices: { visible: false },
    });

    elementsRef.current = { board, A, B, C, lab, lac, lbc, polygonABC };

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

  useEffect(() => {
    const { board, A, B, C, polygonABC } = elementsRef.current as Record<string, any>;
    if (!board) return;

    const reset = () => {
      A.setAttribute({ size: 5, fillColor: getCSSVar('--theme-terracota'), strokeColor: getCSSVar('--theme-terracota') });
      B.setAttribute({ size: 5, fillColor: getCSSVar('--theme-terracota'), strokeColor: getCSSVar('--theme-terracota') });
      C.setAttribute({ size: 5, fillColor: getCSSVar('--theme-terracota'), strokeColor: getCSSVar('--theme-terracota') });
      if (polygonABC) polygonABC.setAttribute({ fillOpacity: 0.08, fillColor: getCSSVar('--theme-pizarra') });
    };

    reset();
    if (highlight === 'pA') A.setAttribute({ size: 10, fillColor: getCSSVar('--theme-ocre'), strokeColor: getCSSVar('--theme-ocre') });
    else if (highlight === 'pB') B.setAttribute({ size: 10, fillColor: getCSSVar('--theme-ocre'), strokeColor: getCSSVar('--theme-ocre') });
    else if (highlight === 'pC') C.setAttribute({ size: 10, fillColor: getCSSVar('--theme-ocre'), strokeColor: getCSSVar('--theme-ocre') });
    else if (highlight === 'polygonABC' && polygonABC) polygonABC.setAttribute({ fillOpacity: 0.25, fillColor: getCSSVar('--theme-musgo') });

    board.update();
  }, [highlight]);

  return (
    <div className="w-full h-full min-h-[300px] relative bg-lienzo/40 border border-pizarra/10 rounded-sm overflow-hidden">
      <div className="absolute top-2 left-3 z-10 text-xs font-serif italic text-pizarra/50">
        Tres puntos no colineales determinan un <span className="font-bold not-italic text-terracota">plano</span>
      </div>
      <div ref={boardRef} className="w-full h-full touch-none" />
    </div>
  );
};
