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


export const Segmento = () => {
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
      boundingbox: [-4, 3, 4, -3],
      axis: false,
      showCopyright: false,
      keepaspectratio: true,
      grid: false,
    });
    jxgBoard.current = board;

    const pA = board.create('point', [-2, 0.5], {
      name: 'A',
      size: 6,
      fillColor: getCSSVar('--theme-terracota'),
      strokeColor: getCSSVar('--theme-terracota'),
      showInfobox: false,
      fixed: false,
    });

    const pB = board.create('point', [2, -0.3], {
      name: 'B',
      size: 6,
      fillColor: getCSSVar('--theme-terracota'),
      strokeColor: getCSSVar('--theme-terracota'),
      showInfobox: false,
      fixed: false,
    });

    const lineL = board.create('line', [pA, pB], {
      strokeColor: getCSSVar('--theme-pizarra'),
      strokeWidth: 1,
      dash: 2,
      name: 'l',
      withLabel: true,
      label: { position: 'rt', offset: [10, 10] }
    });

    const seg = board.create('segment', [pA, pB], {
      strokeColor: getCSSVar('--theme-carbon'),
      strokeWidth: 3,
    });

    elementsRef.current = { pA, pB, seg, lineL, board };

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
    const { pA, pB, seg, lineL, board } = elementsRef.current as Record<string, any>;
    if (!board) return;

    pA.setAttribute({ size: 6, fillColor: getCSSVar('--theme-terracota'), strokeColor: getCSSVar('--theme-terracota') });
    pB.setAttribute({ size: 6, fillColor: getCSSVar('--theme-terracota'), strokeColor: getCSSVar('--theme-terracota') });
    seg.setAttribute({ strokeColor: getCSSVar('--theme-carbon'), strokeWidth: 3 });
    lineL.setAttribute({ strokeColor: getCSSVar('--theme-pizarra'), strokeWidth: 1, dash: 2 });

    if (highlight === 'pA') {
      pA.setAttribute({ size: 10, fillColor: getCSSVar('--theme-ocre'), strokeColor: getCSSVar('--theme-ocre') });
    }
    if (highlight === 'pB') {
      pB.setAttribute({ size: 10, fillColor: getCSSVar('--theme-ocre'), strokeColor: getCSSVar('--theme-ocre') });
    }
    if (highlight === 'segmentAB') {
      seg.setAttribute({ strokeColor: getCSSVar('--theme-terracota'), strokeWidth: 5 });
    }
    if (highlight === 'lineL') {
      lineL.setAttribute({ strokeColor: getCSSVar('--theme-terracota'), strokeWidth: 2, dash: 0 });
    }

    board.update();
  }, [highlight]);

  return (
    <div className="w-full h-full min-h-[300px] relative bg-lienzo/40 border border-pizarra/10 rounded-sm overflow-hidden">
      <div className="absolute top-2 left-3 z-10 text-xs font-serif italic text-pizarra/50">
        Arrastra los extremos <span className="font-bold not-italic text-terracota">A</span>, <span className="font-bold not-italic text-terracota">B</span>
      </div>
      <div ref={boardRef} className="w-full h-full touch-none" />
    </div>
  );
};
