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


export const EuclidParallel = () => {
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
      boundingbox: [-5, 4, 5, -4],
      axis: false,
      showCopyright: false,
      keepaspectratio: true,
      grid: false,
    });
    jxgBoard.current = board;

    const lineL = board.create('line', [[-4, 2], [4, 1.5]], {
      strokeColor: getCSSVar('--theme-carbon'), strokeWidth: 2.5,
    });

    board.create('text', [4.2, 1.8, 'l'], {
      fontSize: 14, fillColor: getCSSVar('--theme-lienzo'), highlightFillColor: getCSSVar('--theme-lienzo'),
    });

    const pP = board.create('point', [0, -1.5], {
      name: 'P', size: 6, fillColor: getCSSVar('--theme-terracota'), strokeColor: getCSSVar('--theme-terracota'),
      showInfobox: false, fixed: false,
    });

    const lineM = board.create('parallel', [pP, lineL], {
      strokeColor: getCSSVar('--theme-terracota'), strokeWidth: 2.5,
    });

    board.create('text', [4.2, function() { return pP.Y() - 0.3; }, 'm'], {
      fontSize: 14, fillColor: getCSSVar('--theme-lienzo'), highlightFillColor: getCSSVar('--theme-lienzo'),
    });

    elementsRef.current = { lineL, pP, lineM, board };

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
    const { lineL, pP, lineM, board } = elementsRef.current as Record<string, any>;
    if (!board) return;

    lineL.setAttribute({ strokeColor: getCSSVar('--theme-carbon'), strokeWidth: 2.5 });
    pP.setAttribute({ size: 6, fillColor: getCSSVar('--theme-terracota'), strokeColor: getCSSVar('--theme-terracota') });
    lineM.setAttribute({ strokeColor: getCSSVar('--theme-terracota'), strokeWidth: 2.5 });

    if (highlight === 'lineL') lineL.setAttribute({ strokeColor: getCSSVar('--theme-terracota'), strokeWidth: 4 });
    if (highlight === 'pP') pP.setAttribute({ size: 10, fillColor: getCSSVar('--theme-ocre') });
    if (highlight === 'lineM') lineM.setAttribute({ strokeColor: getCSSVar('--theme-ocre'), strokeWidth: 4 });

    board.update();
  }, [highlight]);

  return (
    <div className="w-full h-full min-h-[500px] relative bg-lienzo/30">
      <div className="absolute top-3 left-3 z-10 text-[10px] font-sans text-pizarra/50 uppercase tracking-wider">
        Arrastra el punto P
      </div>
      <div ref={boardRef} className="w-full h-full touch-none" />
    </div>
  );
};
