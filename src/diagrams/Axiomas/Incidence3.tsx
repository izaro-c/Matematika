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


export const Incidence3 = () => {
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
      boundingbox: [-5, 5, 5, -5],
      axis: false,
      showCopyright: false,
      keepaspectratio: true,
      grid: false,
    });
    jxgBoard.current = board;

    const pA = board.create('point', [-1, 2.5], {
      name: 'A',
      size: 6,
      fillColor: getCSSVar('--theme-terracota'),
      strokeColor: getCSSVar('--theme-terracota'),
      showInfobox: false,
      fixed: false,
    });

    const pB = board.create('point', [-3, -2], {
      name: 'B',
      size: 6,
      fillColor: getCSSVar('--theme-terracota'),
      strokeColor: getCSSVar('--theme-terracota'),
      showInfobox: false,
      fixed: false,
    });

    const pC = board.create('point', [3, -1], {
      name: 'C',
      size: 6,
      fillColor: getCSSVar('--theme-terracota'),
      strokeColor: getCSSVar('--theme-terracota'),
      showInfobox: false,
      fixed: false,
    });

    const sideAB = board.create('segment', [pA, pB], {
      strokeColor: getCSSVar('--theme-pizarra'),
      strokeWidth: 1.5,
      dash: 2,
    });

    const sideBC = board.create('segment', [pB, pC], {
      strokeColor: getCSSVar('--theme-pizarra'),
      strokeWidth: 1.5,
      dash: 2,
    });

    const sideCA = board.create('segment', [pC, pA], {
      strokeColor: getCSSVar('--theme-pizarra'),
      strokeWidth: 1.5,
      dash: 2,
    });

    const triangle = board.create('polygon', [pA, pB, pC], {
      fillColor: getCSSVar('--theme-terracota'),
      fillOpacity: 0.06,
      borders: { visible: false },
      vertices: { visible: false },
    });

    elementsRef.current = { pA, pB, pC, sideAB, sideBC, sideCA, triangle, board };

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
    const { pA, pB, pC, sideAB, sideBC, sideCA, triangle, board } = elementsRef.current as Record<string, any>;
    if (!board) return;

    pA.setAttribute({ size: 6, fillColor: getCSSVar('--theme-terracota'), strokeColor: getCSSVar('--theme-terracota') });
    pB.setAttribute({ size: 6, fillColor: getCSSVar('--theme-terracota'), strokeColor: getCSSVar('--theme-terracota') });
    pC.setAttribute({ size: 6, fillColor: getCSSVar('--theme-terracota'), strokeColor: getCSSVar('--theme-terracota') });
    sideAB.setAttribute({ strokeColor: getCSSVar('--theme-pizarra'), strokeWidth: 1.5 });
    sideBC.setAttribute({ strokeColor: getCSSVar('--theme-pizarra'), strokeWidth: 1.5 });
    sideCA.setAttribute({ strokeColor: getCSSVar('--theme-pizarra'), strokeWidth: 1.5 });
    triangle.setAttribute({ fillOpacity: 0.06 });

    if (highlight === 'pA') pA.setAttribute({ size: 10, fillColor: getCSSVar('--theme-ocre'), strokeColor: getCSSVar('--theme-ocre') });
    if (highlight === 'pB') pB.setAttribute({ size: 10, fillColor: getCSSVar('--theme-ocre'), strokeColor: getCSSVar('--theme-ocre') });
    if (highlight === 'pC') pC.setAttribute({ size: 10, fillColor: getCSSVar('--theme-ocre'), strokeColor: getCSSVar('--theme-ocre') });
    if (highlight === 'triangle') triangle.setAttribute({ fillOpacity: 0.2 });

    board.update();
  }, [highlight]);

  return (
    <div className="w-full h-full min-h-[500px] relative bg-lienzo/30">
      <div className="absolute top-3 left-3 z-10 text-[10px] font-sans text-pizarra/50 uppercase tracking-wider">
        Arrastra los vértices
      </div>
      <div ref={boardRef} className="w-full h-full touch-none" />
    </div>
  );
};
