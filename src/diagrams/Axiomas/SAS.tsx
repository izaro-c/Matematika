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


export const SAS = () => {
  const boardRef = useRef<HTMLDivElement>(null);
  const elementsRef = useRef<Record<string, unknown>>({});

  const mathHighlight = useMathStore(state => state.variables?.['highlight']);
  const lessonHighlight = useLessonStore(state => state.activeStep);
  const highlight = mathHighlight || lessonHighlight;

  useEffect(() => {
    if (!boardRef.current) return;

    const board = JXG.JSXGraph.initBoard(boardRef.current, {
      boundingbox: [-5, 5, 7, -5],
      axis: false,
      showCopyright: false,
      keepaspectratio: true,
      grid: false,
    });

    const pA = board.create('point', [-3, 2], {
      name: 'A', size: 5, fillColor: getCSSVar('--theme-terracota'), strokeColor: getCSSVar('--theme-terracota'),
      showInfobox: false, fixed: false,
    });
    const pB = board.create('point', [-4, -2], {
      name: 'B', size: 5, fillColor: getCSSVar('--theme-terracota'), strokeColor: getCSSVar('--theme-terracota'),
      showInfobox: false, fixed: false,
    });
    const pC = board.create('point', [-1, -1.5], {
      name: 'C', size: 5, fillColor: getCSSVar('--theme-terracota'), strokeColor: getCSSVar('--theme-terracota'),
      showInfobox: false, fixed: false,
    });

    const t1 = board.create('polygon', [pA, pB, pC], {
      fillColor: getCSSVar('--theme-terracota'), fillOpacity: 0.08,
      borders: { strokeColor: getCSSVar('--theme-carbon'), strokeWidth: 2 },
      vertices: { visible: false },
    });

    const side1 = board.create('segment', [pA, pB], {
      strokeColor: getCSSVar('--theme-terracota'), strokeWidth: 4,
    });
    const side2 = board.create('segment', [pA, pC], {
      strokeColor: getCSSVar('--theme-terracota'), strokeWidth: 4,
    });
    board.create('segment', [pB, pC], {
      strokeColor: getCSSVar('--theme-pizarra'), strokeWidth: 2, dash: 1,
    });

    const angle1 = board.create('angle', [pB, pA, pC], {
      radius: 0.5, fillColor: getCSSVar('--theme-salvia'), fillOpacity: 0.3,
    });

    const pA2 = board.create('point', [3, 2], {
      name: "A'", size: 5, fillColor: getCSSVar('--theme-pizarra'), strokeColor: getCSSVar('--theme-pizarra'),
      showInfobox: false, fixed: false,
    });
    const cB2 = board.create('circle', [pA2, () => pA.Dist(pB)], { visible: false });
    const pB2 = board.create('glider', [2, -2, cB2], {
      name: "B'", size: 5, fillColor: getCSSVar('--theme-pizarra'), strokeColor: getCSSVar('--theme-pizarra'),
      showInfobox: false, fixed: false,
    });
    const pC2 = board.create('point', [
      () => {
        const aA = Math.atan2(pC.Y() - pA.Y(), pC.X() - pA.X()) - Math.atan2(pB.Y() - pA.Y(), pB.X() - pA.X());
        const aA2 = Math.atan2(pB2.Y() - pA2.Y(), pB2.X() - pA2.X());
        const totalAngle = aA2 + aA;
        return pA2.X() + pA.Dist(pC) * Math.cos(totalAngle);
      },
      () => {
        const aA = Math.atan2(pC.Y() - pA.Y(), pC.X() - pA.X()) - Math.atan2(pB.Y() - pA.Y(), pB.X() - pA.X());
        const aA2 = Math.atan2(pB2.Y() - pA2.Y(), pB2.X() - pA2.X());
        const totalAngle = aA2 + aA;
        return pA2.Y() + pA.Dist(pC) * Math.sin(totalAngle);
      }
    ], {
      name: "C'", size: 5, fillColor: getCSSVar('--theme-pizarra'), strokeColor: getCSSVar('--theme-pizarra'),
      showInfobox: false, fixed: true,
    });

    const t2 = board.create('polygon', [pA2, pB2, pC2], {
      fillColor: getCSSVar('--theme-pizarra'), fillOpacity: 0.08,
      borders: { strokeColor: getCSSVar('--theme-carbon'), strokeWidth: 2, dash: 2 },
      vertices: { visible: false },
    });

    const side1B = board.create('segment', [pA2, pB2], {
      strokeColor: getCSSVar('--theme-terracota'), strokeWidth: 4, dash: 3,
    });
    const side2B = board.create('segment', [pA2, pC2], {
      strokeColor: getCSSVar('--theme-terracota'), strokeWidth: 4, dash: 3,
    });
    board.create('segment', [pB2, pC2], {
      strokeColor: getCSSVar('--theme-pizarra'), strokeWidth: 2, dash: 1,
    });

    const angle2 = board.create('angle', [pB2, pA2, pC2], {
      radius: 0.5, fillColor: getCSSVar('--theme-salvia'), fillOpacity: 0.3,
    });

    board.create('text', [-2, 3, 'Triángulo Original (Modificable)'], {
      fontSize: 10, anchorX: 'middle',
    });
    board.create('text', [3.5, 3, "Triángulo Congruente (Arrastra para mover)"], {
      fontSize: 10, anchorX: 'middle',
    });

    elementsRef.current = { t1, t2, side1, side2, side1B, side2B, angle1, angle2, board };

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
      elementsRef.current = {};
    };
  }, []);

  useEffect(() => {
    const { t1, t2, side1, side2, side1B, side2B, angle1, angle2, board } = elementsRef.current as Record<string, any>;
    if (!board) return;

    side1.setAttribute({ strokeColor: getCSSVar('--theme-terracota'), strokeWidth: 4 });
    side2.setAttribute({ strokeColor: getCSSVar('--theme-terracota'), strokeWidth: 4 });
    side1B.setAttribute({ strokeColor: getCSSVar('--theme-terracota'), strokeWidth: 4 });
    side2B.setAttribute({ strokeColor: getCSSVar('--theme-terracota'), strokeWidth: 4 });
    angle1.setAttribute({ fillOpacity: 0.3 });
    angle2.setAttribute({ fillOpacity: 0.3 });
    t1.setAttribute({ fillOpacity: 0.08 });
    t2.setAttribute({ fillOpacity: 0.08 });

    if (highlight === 'side1' || highlight === 'side1B') {
      side1.setAttribute({ strokeColor: getCSSVar('--theme-ocre'), strokeWidth: 6 });
      side1B.setAttribute({ strokeColor: getCSSVar('--theme-ocre'), strokeWidth: 6 });
    }
    if (highlight === 'side2' || highlight === 'side2B') {
      side2.setAttribute({ strokeColor: getCSSVar('--theme-ocre'), strokeWidth: 6 });
      side2B.setAttribute({ strokeColor: getCSSVar('--theme-ocre'), strokeWidth: 6 });
    }
    if (highlight === 'angle1' || highlight === 'angle2') {
      angle1.setAttribute({ fillOpacity: 0.6 });
      angle2.setAttribute({ fillOpacity: 0.6 });
    }

    board.update();
  }, [highlight]);

  return (
    <div className="w-full h-full min-h-[500px] relative bg-lienzo/30">
      <div className="absolute top-3 left-3 z-10 text-[10px] font-sans text-pizarra/50 uppercase tracking-wider">
        Modifica el triángulo original, y manipula el triángulo clonado
      </div>
      <div ref={boardRef} id="sas-board" className="jxgbox w-full h-full touch-none" style={{ width: '100%', height: '100%' }} />
    </div>
  );
};
