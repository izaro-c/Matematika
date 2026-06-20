import React, { useEffect, useRef } from 'react';
function getCSSVar(name: string): string {
  if (typeof document !== 'undefined') {
    return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  }
  return '#000';
}
import { useMathStore } from '../../store/MathStoreContext';
import { useLessonStore } from '../../store/LessonStore';

import JXG from 'jsxgraph';

export const Congruence1: React.FC = () => {
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

    // Puntos originales A y B
    const pA = board.create('point', [-3, 3], {
      name: 'A', size: 4, color: getCSSVar('--theme-terracota'),
      label: { offset: [-15, 15] }
    });
    const pB = board.create('point', [0, 4], {
      name: 'B', size: 4, color: getCSSVar('--theme-terracota'),
      label: { offset: [15, 15] }
    });
    const segAB = board.create('segment', [pA, pB], {
      strokeColor: getCSSVar('--theme-terracota'), strokeWidth: 3
    });

    // Origen de la semirrecta C
    const pC = board.create('point', [-2, -2], {
      name: 'C', size: 4, color: getCSSVar('--theme-salvia'),
      label: { offset: [-15, -15] }
    });

    // Punto director para la semirrecta r
    const pDir = board.create('point', [2, -1], {
      name: '', size: 3, color: getCSSVar('--theme-pizarra'),
      showInfobox: false
    });

    const rayR = board.create('line', [pC, pDir], {
      strokeColor: getCSSVar('--theme-pizarra'), strokeWidth: 2,
      straightFirst: false, straightLast: true,
      dash: 2
    });

    // Círculo invisible centrado en C con radio AB
    const circle = board.create('circle', [pC, () => pA.Dist(pB)], {
      strokeWidth: 1, strokeColor: getCSSVar('--theme-carbon'), opacity: 0.2, dash: 1
    });

    // Intersección del círculo y la semirrecta (punto D)
    // board.create('intersection', [circle, rayR, 0]) elige uno de los puntos
    // Como rayR empieza en C y va hacia pDir, el punto de intersección en la dirección positiva es el índice 1 (a veces el 0 dependiendo de cómo calcule JXG)
    // Para ser robustos y asegurarnos de que D está siempre en la semirrecta (y no en la opuesta):
    const pD = board.create('point', [
      () => {
        const d = pA.Dist(pB);
        const dx = pDir.X() - pC.X();
        const dy = pDir.Y() - pC.Y();
        const distDir = Math.hypot(dx, dy);
        if (distDir === 0) return [pC.X(), pC.Y()];
        const ux = dx / distDir;
        // Removed uy
        return pC.X() + ux * d;
      },
      () => {
        const d = pA.Dist(pB);
        const dx = pDir.X() - pC.X();
        const dy = pDir.Y() - pC.Y();
        const distDir = Math.hypot(dx, dy);
        if (distDir === 0) return [pC.X(), pC.Y()];
        // Removed ux
        const uy = dy / distDir;
        return pC.Y() + uy * d;
      }
    ], {
      name: 'D', size: 5, color: getCSSVar('--theme-salvia'),
      label: { offset: [15, -15] }
    });

    const segCD = board.create('segment', [pC, pD], {
      strokeColor: getCSSVar('--theme-salvia'), strokeWidth: 3
    });

    elementsRef.current = { pA, pB, pC, pDir, pD, segAB, rayR, segCD, circle, board };

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
      els.segAB.setAttribute({ strokeWidth: 3, opacity: 1 });
      els.segCD.setAttribute({ strokeWidth: 3, opacity: 1 });
      els.rayR.setAttribute({ opacity: 1, strokeWidth: 2 });
      els.pD.setAttribute({ size: 5 });
      els.pA.setAttribute({ size: 4 });
      els.pB.setAttribute({ size: 4 });
      els.pC.setAttribute({ size: 4 });
    };

    reset();

    if (highlight) {
      if (highlight === 'segmento-ab') {
        els.segAB.setAttribute({ strokeWidth: 6 });
        els.pA.setAttribute({ size: 6 });
        els.pB.setAttribute({ size: 6 });
      } else if (highlight === 'rayo-r') {
        els.rayR.setAttribute({ strokeWidth: 4 });
        els.pC.setAttribute({ size: 6 });
      } else if (highlight === 'punto-d') {
        els.pD.setAttribute({ size: 8 });
      } else if (highlight === 'segmento-cd') {
        els.segCD.setAttribute({ strokeWidth: 6 });
        els.pC.setAttribute({ size: 6 });
        els.pD.setAttribute({ size: 6 });
      } else if (highlight === 'circulo') {
        els.circle.setAttribute({ opacity: 0.8, strokeWidth: 2 });
      }
    }
    els.board.update();
  }, [highlight]);

  return (
    <div className="w-full h-full flex flex-col">
      <div 
        id="congruence1-board" 
        ref={boardRef} 
        className="w-full aspect-square md:aspect-video rounded-lg border border-carbon/20 bg-crema/50 shadow-inner"
      />
      <div className="p-4 text-sm text-center text-carbon/70 font-sans">
        Arrastra <span className="font-bold text-terracota">A</span> o <span className="font-bold text-terracota">B</span> para cambiar la longitud original.
        Arrastra <span className="font-bold text-salvia">C</span> o el punto gris para mover la semirrecta.
        El punto <span className="font-bold text-salvia">D</span> se ajusta automáticamente.
      </div>
    </div>
  );
};
