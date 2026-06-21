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

export const Congruence2: React.FC = () => {
  const boardRef = useRef<HTMLDivElement>(null);
  const jxgBoard = useRef<any>(null);
  const elementsRef = useRef<any>({});

  useEffect(() => {
    if (!boardRef.current) return;

    if (!boardRef.current.id) boardRef.current.id = "jxgbox_" + Math.random().toString(36).substring(2, 9);
      const board = JXG.JSXGraph.initBoard(boardRef.current.id, {
      boundingbox: [-5, 5, 5, -5],
      axis: false,
      showNavigation: false,
      showCopyright: false,
      keepaspectratio: true,
      pan: { enabled: true, needShift: false, needTwoFingers: false },
      zoom: { wheel: true, needShift: false }
    });
    jxgBoard.current = board;

    // Segmento maestro AB
    const pA = board.create('point', [-2, 1.5], {
      name: 'A', size: 4, color: getCSSVar('--theme-terracota'),
      label: { offset: [-15, 15] }
    });
    const pB = board.create('point', [1, 1.5], {
      name: 'B', size: 4, color: getCSSVar('--theme-terracota'),
      label: { offset: [15, 15] }
    });
    const segAB = board.create('segment', [pA, pB], {
      strokeColor: getCSSVar('--theme-terracota'), strokeWidth: 3
    });

    // Segmento esclavo CD
    const pC = board.create('point', [-2, 0], {
      name: 'C', size: 4, color: getCSSVar('--theme-salvia'),
      label: { offset: [-15, 15] }
    });
    const cCD = board.create('circle', [pC, () => pA.Dist(pB)], { visible: false });
    const pD = board.create('glider', [1, 0, cCD], {
      name: 'D', size: 4, color: getCSSVar('--theme-salvia'),
      label: { offset: [15, 15] }
    });
    const segCD = board.create('segment', [pC, pD], {
      strokeColor: getCSSVar('--theme-salvia'), strokeWidth: 3
    });
    
    // Segmento esclavo EF
    const pE = board.create('point', [-2, -1.5], {
      name: 'E', size: 4, color: getCSSVar('--theme-ocre'),
      label: { offset: [-15, -15] }
    });
    const cEF = board.create('circle', [pE, () => pA.Dist(pB)], { visible: false });
    const pF = board.create('glider', [1, -1.5, cEF], {
      name: 'F', size: 4, color: getCSSVar('--theme-ocre'),
      label: { offset: [15, -15] }
    });
    const segEF = board.create('segment', [pE, pF], {
      strokeColor: getCSSVar('--theme-ocre'), strokeWidth: 3
    });

    // Arcos decorativos para indicar congruencia
    board.create('ticks', [segAB, 2], { strokeColor: getCSSVar('--theme-carbon') });
    board.create('ticks', [segCD, 2], { strokeColor: getCSSVar('--theme-carbon') });
    board.create('ticks', [segEF, 2], { strokeColor: getCSSVar('--theme-carbon') });

    elementsRef.current = { pA, pB, pC, pD, pE, pF, segAB, segCD, segEF, board };

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
      els.segAB.setAttribute({ strokeWidth: 3, opacity: 0.6 });
      els.segCD.setAttribute({ strokeWidth: 3, opacity: 0.6 });
      els.segEF.setAttribute({ strokeWidth: 3, opacity: 0.6 });
    };

    reset();

    if (highlight) {
      if (highlight === 'segmento-ab') {
        els.segAB.setAttribute({ strokeWidth: 6, opacity: 1 });
      } else if (highlight === 'segmento-cd') {
        els.segCD.setAttribute({ strokeWidth: 6, opacity: 1 });
      } else if (highlight === 'segmento-ef') {
        els.segEF.setAttribute({ strokeWidth: 6, opacity: 1 });
      } else if (highlight === 'ab-cd') {
        els.segAB.setAttribute({ strokeWidth: 6, opacity: 1 });
        els.segCD.setAttribute({ strokeWidth: 6, opacity: 1 });
      } else if (highlight === 'ab-ef') {
        els.segAB.setAttribute({ strokeWidth: 6, opacity: 1 });
        els.segEF.setAttribute({ strokeWidth: 6, opacity: 1 });
      } else if (highlight === 'cd-ef') {
        els.segCD.setAttribute({ strokeWidth: 6, opacity: 1 });
        els.segEF.setAttribute({ strokeWidth: 6, opacity: 1 });
      }
    } else {
      els.segAB.setAttribute({ opacity: 1 });
      els.segCD.setAttribute({ opacity: 1 });
      els.segEF.setAttribute({ opacity: 1 });
    }
    els.board.update();
  }, [highlight]);

  return (
    <div className="w-full h-full flex flex-col">
      <div 
        id="congruence2-board" 
        ref={boardRef} 
        className="jxgbox w-full aspect-square md:aspect-video rounded-lg border border-carbon/20 bg-crema/50 shadow-inner"
        style={{ width: '100%', height: '100%' }}
      />
      <div className="p-4 text-sm text-center text-carbon/70 font-sans">
        Modifica el <span className="font-bold text-terracota">segmento maestro AB</span>. Observa cómo <span className="font-bold text-salvia">CD</span> y <span className="font-bold text-ocre">EF</span> se ajustan para mantener la congruencia mutua.
      </div>
    </div>
  );
};
