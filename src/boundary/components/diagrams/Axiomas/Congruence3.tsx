import React, { useEffect, useRef } from 'react';
function getCSSVar(name: string): string {
  if (typeof document !== 'undefined') {
    return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  }
  return '#000';
}
import { useMathStore } from '@/boundary/contexts/MathStoreContext';
import { useLessonStore } from '@/controller/store/LessonStore';

import JXG from 'jsxgraph';

export const Congruence3: React.FC = () => {
  const boardRef = useRef<HTMLDivElement>(null);
  const jxgBoard = useRef<any>(null);
  const elementsRef = useRef<any>({});

  useEffect(() => {
    if (!boardRef.current) return;

    if (!boardRef.current.id) boardRef.current.id = "jxgbox_" + Math.random().toString(36).substring(2, 9);
      const board = JXG.JSXGraph.initBoard(boardRef.current.id, {
      boundingbox: [-5, 4, 5, -4],
      axis: false,
      showNavigation: false,
      showCopyright: false,
      keepaspectratio: true,
      pan: { enabled: true, needShift: false, needTwoFingers: false },
      zoom: { wheel: true, needShift: false }
    });
    jxgBoard.current = board;

    // Recta 1
    const pA = board.create('point', [-3, 2], {
      name: 'A', size: 4, color: getCSSVar('--theme-terracota'),
      label: { offset: [-15, 15] }
    });
    const pC = board.create('point', [3, 2], {
      name: 'C', size: 4, color: getCSSVar('--theme-ocre'),
      label: { offset: [15, 15] }
    });
    const segAC = board.create('segment', [pA, pC], {
      strokeColor: getCSSVar('--theme-pizarra'), strokeWidth: 1, visible: false
    });

    // Punto B entre A y C
    const pB = board.create('glider', [-0.5, 2, segAC], {
      name: 'B', size: 4, color: getCSSVar('--theme-salvia'),
      label: { offset: [0, 15] }
    });

    // Segmentos resaltables
    const segAB = board.create('segment', [pA, pB], {
      strokeColor: getCSSVar('--theme-terracota'), strokeWidth: 4
    });
    const segBC = board.create('segment', [pB, pC], {
      strokeColor: getCSSVar('--theme-ocre'), strokeWidth: 4
    });

    // Recta 2
    const pA_prime = board.create('point', [-3, -2], {
      name: "A'", size: 4, color: getCSSVar('--theme-terracota'),
      label: { offset: [-15, -15] }
    });
    const pDir = board.create('point', [4, -2], { visible: false });
    
    board.create('line', [pA_prime, pDir], {
      strokeColor: getCSSVar('--theme-pizarra'), strokeWidth: 1,
      straightFirst: false, straightLast: true, visible: false
    });

    // Puntos clonados matemáticamente (se basan en la distancia de AB y BC)
    const pB_prime = board.create('point', [
      () => pA_prime.X() + pA.Dist(pB),
      () => pA_prime.Y()
    ], {
      name: "B'", size: 4, color: getCSSVar('--theme-salvia'),
      label: { offset: [0, -15] }
    });

    const pC_prime = board.create('point', [
      () => pB_prime.X() + pB.Dist(pC),
      () => pB_prime.Y()
    ], {
      name: "C'", size: 4, color: getCSSVar('--theme-ocre'),
      label: { offset: [15, -15] }
    });

    const segAB_prime = board.create('segment', [pA_prime, pB_prime], {
      strokeColor: getCSSVar('--theme-terracota'), strokeWidth: 4
    });
    const segBC_prime = board.create('segment', [pB_prime, pC_prime], {
      strokeColor: getCSSVar('--theme-ocre'), strokeWidth: 4
    });

    elementsRef.current = { pA, pB, pC, pA_prime, pB_prime, pC_prime, segAB, segBC, segAB_prime, segBC_prime, board };

    return () => JXG.JSXGraph.freeBoard(board);
      jxgBoard.current = null;
  }, []);

  const mathHighlight = useMathStore(state => state.variables?.['highlight']);
  const lessonHighlight = useLessonStore(state => state.activeStep);
  const highlight = mathHighlight || lessonHighlight;

  useEffect(() => {
    const els = elementsRef.current;
    if (!els.board) return;

    const reset = () => {
      els.segAB.setAttribute({ strokeWidth: 4, opacity: 0.5 });
      els.segBC.setAttribute({ strokeWidth: 4, opacity: 0.5 });
      els.segAB_prime.setAttribute({ strokeWidth: 4, opacity: 0.5 });
      els.segBC_prime.setAttribute({ strokeWidth: 4, opacity: 0.5 });
    };

    reset();

    if (highlight) {
      if (highlight === 'ab') {
        els.segAB.setAttribute({ strokeWidth: 7, opacity: 1 });
        els.segAB_prime.setAttribute({ strokeWidth: 7, opacity: 1 });
      } else if (highlight === 'bc') {
        els.segBC.setAttribute({ strokeWidth: 7, opacity: 1 });
        els.segBC_prime.setAttribute({ strokeWidth: 7, opacity: 1 });
      } else if (highlight === 'ac') {
        els.segAB.setAttribute({ strokeWidth: 7, opacity: 1 });
        els.segBC.setAttribute({ strokeWidth: 7, opacity: 1 });
        els.segAB_prime.setAttribute({ strokeWidth: 7, opacity: 1 });
        els.segBC_prime.setAttribute({ strokeWidth: 7, opacity: 1 });
      }
    } else {
      els.segAB.setAttribute({ opacity: 1 });
      els.segBC.setAttribute({ opacity: 1 });
      els.segAB_prime.setAttribute({ opacity: 1 });
      els.segBC_prime.setAttribute({ opacity: 1 });
    }
    els.board.update();
  }, [highlight]);

  return (
    <div className="w-full h-full flex flex-col">
      <div 
        id="congruence3-board" 
        ref={boardRef} 
        className="jxgbox w-full aspect-square md:aspect-video rounded-lg border border-carbon/20 bg-crema/50 shadow-inner"
        style={{ width: '100%', height: '100%' }}
      />
      <div className="p-4 text-sm text-center text-carbon/70 font-sans">
        Arrastra los puntos <span className="font-bold text-terracota">A</span>, <span className="font-bold text-salvia">B</span> y <span className="font-bold text-ocre">C</span> de la línea superior. La línea inferior mantiene las congruencias, probando que la suma total también es congruente.
      </div>
    </div>
  );
};
