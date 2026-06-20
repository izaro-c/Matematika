import { useRef, useEffect } from 'react';
import JXG from 'jsxgraph';
import { useMathStore } from '../../store/MathStoreContext';
import { useLessonStore } from '../../store/LessonStore';


function getCSSVar(name: string): string {
  if (typeof document !== 'undefined') {
    return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  }
  return '#000';
}


export const Semirrecta = () => {
  const boardRef = useRef<HTMLDivElement>(null);
  const jxgBoard = useRef<any>(null);
  const elementsRef = useRef<Record<string, unknown>>({});

  const mathHighlight = useMathStore(state => state.variables?.['highlight']);
  const lessonHighlight = useLessonStore(state => state.activeStep);
  const highlight = mathHighlight || lessonHighlight;

  useEffect(() => {
    if (!boardRef.current) return;

    const board = JXG.JSXGraph.initBoard(boardRef.current.id, {
      boundingbox: [-4, 3, 5, -3],
      axis: false,
      showCopyright: false,
      keepaspectratio: true,
      grid: false,
    });
    jxgBoard.current = board;

    const pO = board.create('point', [-1, 0], {
      name: 'O',
      size: 6,
      fillColor: getCSSVar('--theme-pizarra'),
      strokeColor: getCSSVar('--theme-pizarra'),
      showInfobox: false,
      fixed: true,
    });

    const pA = board.create('point', [2, 0.5], {
      name: 'A',
      size: 6,
      fillColor: getCSSVar('--theme-terracota'),
      strokeColor: getCSSVar('--theme-terracota'),
      showInfobox: false,
      fixed: false,
    });

    const farEnd = board.create('point', [
      function () { return pO.X() + 20 * (pA.X() - pO.X()); },
      function () { return pO.Y() + 20 * (pA.Y() - pO.Y()); },
    ], { visible: false, fixed: true });

    const ray = board.create('segment', [pO, farEnd], {
      strokeColor: getCSSVar('--theme-carbon'),
      strokeWidth: 2,
      lastArrow: { type: 2 },
    });

    elementsRef.current = { pO, pA, ray, board };

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
    const { pO, pA, ray, board } = elementsRef.current as Record<string, any>;
    if (!board) return;

    pO.setAttribute({ size: 6, fillColor: getCSSVar('--theme-pizarra'), strokeColor: getCSSVar('--theme-pizarra') });
    pA.setAttribute({ size: 6, fillColor: getCSSVar('--theme-terracota'), strokeColor: getCSSVar('--theme-terracota') });
    ray.setAttribute({ strokeColor: getCSSVar('--theme-carbon'), strokeWidth: 2 });

    if (highlight === 'pO') {
      pO.setAttribute({ size: 10, fillColor: getCSSVar('--theme-ocre'), strokeColor: getCSSVar('--theme-ocre') });
    }
    if (highlight === 'pA') {
      pA.setAttribute({ size: 10, fillColor: getCSSVar('--theme-ocre'), strokeColor: getCSSVar('--theme-ocre') });
    }
    if (highlight === 'rayOA') {
      ray.setAttribute({ strokeColor: getCSSVar('--theme-terracota'), strokeWidth: 4 });
    }

    board.update();
  }, [highlight]);

  return (
    <div className="w-full h-full min-h-[300px] relative bg-lienzo/40 border border-pizarra/10 rounded-sm overflow-hidden">
      <div className="absolute top-2 left-3 z-10 text-xs font-serif italic text-pizarra/50">
        Arrastra el punto <span className="font-bold not-italic text-terracota">A</span>
      </div>
      <div ref={boardRef} className="w-full h-full touch-none" />
    </div>
  );
};
