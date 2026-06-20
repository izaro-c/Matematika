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


export const Angulo = () => {
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

    const pO = board.create('point', [0, 0], {
      name: 'O',
      size: 6,
      fillColor: getCSSVar('--theme-pizarra'),
      strokeColor: getCSSVar('--theme-pizarra'),
      showInfobox: false,
      fixed: true,
    });

    const pA = board.create('point', [2.5, 0.8], {
      name: 'A',
      size: 6,
      fillColor: getCSSVar('--theme-terracota'),
      strokeColor: getCSSVar('--theme-terracota'),
      showInfobox: false,
      fixed: false,
    });

    const pB = board.create('point', [-1, 2], {
      name: 'B',
      size: 6,
      fillColor: getCSSVar('--theme-terracota'),
      strokeColor: getCSSVar('--theme-terracota'),
      showInfobox: false,
      fixed: false,
    });

    const farA = board.create('point', [
      function () { return pO.X() + 20 * (pA.X() - pO.X()); },
      function () { return pO.Y() + 20 * (pA.Y() - pO.Y()); },
    ], { visible: false, fixed: true });

    const farB = board.create('point', [
      function () { return pO.X() + 20 * (pB.X() - pO.X()); },
      function () { return pO.Y() + 20 * (pB.Y() - pO.Y()); },
    ], { visible: false, fixed: true });

    const rayOA = board.create('segment', [pO, farA], {
      strokeColor: getCSSVar('--theme-carbon'),
      strokeWidth: 2,
      lastArrow: { type: 2 },
    });

    const rayOB = board.create('segment', [pO, farB], {
      strokeColor: getCSSVar('--theme-carbon'),
      strokeWidth: 2,
      lastArrow: { type: 2 },
    });

    const arc = board.create('angle', [pB, pO, pA], {
      radius: 0.8,
      fillColor: getCSSVar('--theme-salvia'),
      fillOpacity: 0.25,
      strokeColor: getCSSVar('--theme-carbon'),
      strokeWidth: 1.5,
    });

    elementsRef.current = { pO, pA, pB, rayOA, rayOB, arc, board };

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
    const { pO, pA, pB, rayOA, rayOB, arc, board } = elementsRef.current as Record<string, any>;
    if (!board) return;

    pO.setAttribute({ size: 6, fillColor: getCSSVar('--theme-pizarra'), strokeColor: getCSSVar('--theme-pizarra') });
    pA.setAttribute({ size: 6, fillColor: getCSSVar('--theme-terracota'), strokeColor: getCSSVar('--theme-terracota') });
    pB.setAttribute({ size: 6, fillColor: getCSSVar('--theme-terracota'), strokeColor: getCSSVar('--theme-terracota') });
    rayOA.setAttribute({ strokeColor: getCSSVar('--theme-carbon'), strokeWidth: 2 });
    rayOB.setAttribute({ strokeColor: getCSSVar('--theme-carbon'), strokeWidth: 2 });

    if (highlight === 'pO') {
      pO.setAttribute({ size: 10, fillColor: getCSSVar('--theme-ocre'), strokeColor: getCSSVar('--theme-ocre') });
    }
    if (highlight === 'pA') {
      pA.setAttribute({ size: 10, fillColor: getCSSVar('--theme-ocre'), strokeColor: getCSSVar('--theme-ocre') });
    }
    if (highlight === 'pB') {
      pB.setAttribute({ size: 10, fillColor: getCSSVar('--theme-ocre'), strokeColor: getCSSVar('--theme-ocre') });
    }
    if (highlight === 'rayOA') {
      rayOA.setAttribute({ strokeColor: getCSSVar('--theme-terracota'), strokeWidth: 4 });
    }
    if (highlight === 'rayOB') {
      rayOB.setAttribute({ strokeColor: getCSSVar('--theme-terracota'), strokeWidth: 4 });
    }
    if (highlight === 'angleArc') {
      arc.setAttribute({ fillColor: getCSSVar('--theme-terracota'), fillOpacity: 0.4, strokeColor: getCSSVar('--theme-terracota') });
    }

    board.update();
  }, [highlight]);

  return (
    <div className="w-full h-full min-h-[300px] relative bg-lienzo/40 border border-pizarra/10 rounded-sm overflow-hidden">
      <div className="absolute top-2 left-3 z-10 text-xs font-serif italic text-pizarra/50">
        Arrastra los puntos <span className="font-bold not-italic text-terracota">A</span>, <span className="font-bold not-italic text-terracota">B</span>
      </div>
      <div ref={boardRef} className="w-full h-full touch-none" />
    </div>
  );
};
