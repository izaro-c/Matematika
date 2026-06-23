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

export const Perpendicular = () => {
  const boardRef = useRef<HTMLDivElement>(null);
  const jxgBoard = useRef<any>(null);
  const elementsRef = useRef<Record<string, unknown>>({});

  const mathHighlight = useMathStore(state => state.variables?.['highlight']);
  const lessonHighlight = useLessonStore(state => state.activeStep);
  const highlight = mathHighlight || lessonHighlight;
  
  const isHighlight = (id: string) => Array.isArray(highlight) ? (highlight as unknown as string[]).includes(id) : highlight === id;

  useEffect(() => {
    if (!boardRef.current) return;

    if (!boardRef.current.id) boardRef.current.id = "jxgbox_" + Math.random().toString(36).substring(2, 9);
    const board = JXG.JSXGraph.initBoard(boardRef.current.id, {
      boundingbox: [-4, 4, 4, -4],
      axis: false,
      showCopyright: false,
      keepaspectratio: true,
      grid: false,
    });
    jxgBoard.current = board;

    const pA = board.create('point', [-3, -1], { visible: false });
    const pB = board.create('point', [3, 1], { visible: false });
    
    const recta1 = board.create('line', [pA, pB], {
      strokeColor: getCSSVar('--theme-carbon'),
      strokeWidth: 2,
      name: 'l_1',
      withLabel: true,
      label: { position: 'rt', offset: [10, 10] }
    });

    const puntoC = board.create('glider', [0, 0, recta1], {
      name: 'P',
      size: 5,
      fillColor: getCSSVar('--theme-terracota'),
      strokeColor: getCSSVar('--theme-terracota'),
      showInfobox: false,
      fixed: false,
    });

    const recta2 = board.create('perpendicular', [recta1, puntoC], {
      strokeColor: getCSSVar('--theme-carbon'),
      strokeWidth: 2,
      name: 'l_2',
      withLabel: true,
      label: { position: 'rt', offset: [10, 10] }
    });

    // Angle representation points
    const p1 = board.create('glider', [2, 2/3, recta1], { visible: false });
    const p2 = board.create('glider', [-2, -2/3, recta1], { visible: false });
    const p3 = board.create('glider', [-1, 3, recta2], { visible: false });
    const p4 = board.create('glider', [1, -3, recta2], { visible: false });

    // Angles
    const angProps = { color: getCSSVar('--theme-salvia'), radius: 1, type: 'sectordot', fillOpacity: 0.1, strokeOpacity: 0.5 };
    const a1 = board.create('angle', [p1, puntoC, p3], angProps);
    const a2 = board.create('angle', [p3, puntoC, p2], angProps);
    const a3 = board.create('angle', [p2, puntoC, p4], angProps);
    const a4 = board.create('angle', [p4, puntoC, p1], angProps);

    elementsRef.current = { recta1, puntoC, recta2, a1, a2, a3, a4, board };

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
    const { recta1, puntoC, recta2, a1, a2, a3, a4, board } = elementsRef.current as Record<string, any>;
    if (!board) return;

    // Reset styles
    recta1.setAttribute({ strokeWidth: 2, strokeColor: getCSSVar('--theme-carbon'), strokeOpacity: 1 });
    recta2.setAttribute({ strokeWidth: 2, strokeColor: getCSSVar('--theme-carbon'), strokeOpacity: 1 });
    puntoC.setAttribute({ size: 5, fillColor: getCSSVar('--theme-terracota'), strokeColor: getCSSVar('--theme-terracota') });

    [a1, a2, a3, a4].forEach(a => {
      a.setAttribute({ fillOpacity: 0.1, strokeOpacity: 0.5, strokeColor: getCSSVar('--theme-salvia'), fillColor: getCSSVar('--theme-salvia') });
    });

    const hR1 = isHighlight('recta');
    const hR2 = isHighlight('perpendicular');
    const hAng = isHighlight('angulos-rectos');
    const showAllRectas = !hR1 && !hR2;

    recta1.setAttribute({
      strokeOpacity: hR1 || showAllRectas ? 1 : 0.3,
      strokeWidth: hR1 ? 4 : 2,
      strokeColor: hR1 ? getCSSVar('--theme-ocre') : getCSSVar('--theme-carbon')
    });
    
    recta2.setAttribute({
      strokeOpacity: hR2 || showAllRectas ? 1 : 0.3,
      strokeWidth: hR2 ? 4 : 2,
      strokeColor: hR2 ? getCSSVar('--theme-ocre') : getCSSVar('--theme-carbon')
    });

    if (hAng) {
      [a1, a2, a3, a4].forEach(a => {
        a.setAttribute({ fillOpacity: 0.4, strokeOpacity: 1, strokeColor: getCSSVar('--theme-ocre'), fillColor: getCSSVar('--theme-ocre') });
      });
    }

    board.update();
  }, [highlight]);

  return (
    <div className="w-full h-full min-h-[300px] relative bg-lienzo/40 border border-pizarra/10 rounded-sm overflow-hidden">
      <div className="absolute top-2 left-3 z-10 text-xs font-serif italic text-pizarra/50">
        Arrastra el punto de intersección <span className="font-bold not-italic text-terracota">P</span>
      </div>
      <div ref={boardRef} className="w-full h-full touch-none" />
    </div>
  );
};
