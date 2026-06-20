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

export const Congruence4: React.FC = () => {
  const boardRef = useRef<HTMLDivElement>(null);
  const elementsRef = useRef<any>({});

  useEffect(() => {
    if (!boardRef.current) return;

    const board = JXG.JSXGraph.initBoard(boardRef.current.id, {
      boundingbox: [-5, 5, 5, -5],
      axis: false,
      showNavigation: false,
      showCopyright: false,
      keepaspectratio: true,
      pan: { enabled: true, needShift: false, needTwoFingers: false },
      zoom: { enabled: true, wheel: true, needShift: false }
    });

    // Ángulo original
    const pO = board.create('point', [-2, 2], {
      name: 'O', size: 4, color: getCSSVar('--theme-terracota'),
      label: { offset: [-15, -15] }
    });
    const pH = board.create('point', [0, 2], {
      name: 'A', size: 4, color: getCSSVar('--theme-pizarra'),
      label: { offset: [15, -15] }
    });
    const pK = board.create('point', [-1, 2.5], {
      name: 'B', size: 4, color: getCSSVar('--theme-pizarra'),
      label: { offset: [-15, 15] }
    });

    const rayH = board.create('line', [pO, pH], {
      strokeColor: getCSSVar('--theme-pizarra'), strokeWidth: 2,
      straightFirst: false, straightLast: true
    });
    const rayK = board.create('line', [pO, pK], {
      strokeColor: getCSSVar('--theme-pizarra'), strokeWidth: 2,
      straightFirst: false, straightLast: true
    });

    const angleOriginal = board.create('angle', [pH, pO, pK], {
      radius: 1, color: getCSSVar('--theme-terracota'), fillColor: getCSSVar('--theme-terracota'),
      fillOpacity: 0.2, strokeWidth: 2, hasInnerAngles: true
    });

    // Ángulo clonado
    const pO_prime = board.create('point', [-1, -2], {
      name: "O'", size: 4, color: getCSSVar('--theme-salvia'),
      label: { offset: [-15, -15] }
    });
    const pH_prime = board.create('point', [1, -2], {
      name: "A'", size: 4, color: getCSSVar('--theme-pizarra'),
      label: { offset: [15, -15] }
    });
    
    const rayH_prime = board.create('line', [pO_prime, pH_prime], {
      strokeColor: getCSSVar('--theme-pizarra'), strokeWidth: 2,
      straightFirst: false, straightLast: true
    });

    // Calcular el punto K' para que el ángulo sea igual
    const pK_prime = board.create('point', [
      () => {
        // Ángulo de O
        const dxH = pH.X() - pO.X();
        const dyH = pH.Y() - pO.Y();
        const dxK = pK.X() - pO.X();
        const dyK = pK.Y() - pO.Y();
        const aH = Math.atan2(dyH, dxH);
        const aK = Math.atan2(dyK, dxK);
        let angulo = aK - aH;
        // Para asegurar que estamos en el rango [0, 2pi) o (-pi, pi] según el inner angle
        
        // Dirección de H'
        const dxH_prime = pH_prime.X() - pO_prime.X();
        const dyH_prime = pH_prime.Y() - pO_prime.Y();
        const aH_prime = Math.atan2(dyH_prime, dxH_prime);

        const aK_prime = aH_prime + angulo;
        return pO_prime.X() + 2 * Math.cos(aK_prime);
      },
      () => {
        const dxH = pH.X() - pO.X();
        const dyH = pH.Y() - pO.Y();
        const dxK = pK.X() - pO.X();
        const dyK = pK.Y() - pO.Y();
        const aH = Math.atan2(dyH, dxH);
        const aK = Math.atan2(dyK, dxK);
        let angulo = aK - aH;

        const dxH_prime = pH_prime.X() - pO_prime.X();
        const dyH_prime = pH_prime.Y() - pO_prime.Y();
        const aH_prime = Math.atan2(dyH_prime, dxH_prime);

        const aK_prime = aH_prime + angulo;
        return pO_prime.Y() + 2 * Math.sin(aK_prime);
      }
    ], {
      name: "B'", size: 4, color: getCSSVar('--theme-salvia'),
      label: { offset: [-15, 15] },
      withLabel: true,
      fixed: true // El usuario no debe poder mover este punto libremente
    });

    const rayK_prime = board.create('line', [pO_prime, pK_prime], {
      strokeColor: getCSSVar('--theme-salvia'), strokeWidth: 2,
      straightFirst: false, straightLast: true,
      dash: 2
    });

    const angleClonado = board.create('angle', [pH_prime, pO_prime, pK_prime], {
      radius: 1, color: getCSSVar('--theme-salvia'), fillColor: getCSSVar('--theme-salvia'),
      fillOpacity: 0.2, strokeWidth: 2, hasInnerAngles: true
    });

    elementsRef.current = { 
      pO, pH, pK, rayH, rayK, angleOriginal,
      pO_prime, pH_prime, pK_prime, rayH_prime, rayK_prime, angleClonado,
      board 
    };

    return () => JXG.JSXGraph.freeBoard(board);
  }, []);

  const mathHighlight = useMathStore(state => state.variables?.['highlight']);
  const lessonHighlight = useLessonStore(state => state.activeStep);
  const highlight = mathHighlight || lessonHighlight;

  useEffect(() => {
    const els = elementsRef.current;
    if (!els.board) return;

    const reset = () => {
      els.angleOriginal.setAttribute({ fillOpacity: 0.2, strokeWidth: 2 });
      els.angleClonado.setAttribute({ fillOpacity: 0.2, strokeWidth: 2 });
      els.rayK_prime.setAttribute({ strokeWidth: 2 });
      els.rayH_prime.setAttribute({ strokeWidth: 2, strokeColor: getCSSVar('--theme-pizarra') });
    };

    reset();

    if (highlight) {
      if (highlight === 'angulo-original') {
        els.angleOriginal.setAttribute({ fillOpacity: 0.5, strokeWidth: 3 });
      } else if (highlight === 'angulo-clonado') {
        els.angleClonado.setAttribute({ fillOpacity: 0.5, strokeWidth: 3 });
        els.rayK_prime.setAttribute({ strokeWidth: 4 });
      } else if (highlight === 'rayo-h_prime') {
        els.rayH_prime.setAttribute({ strokeWidth: 4, strokeColor: getCSSVar('--theme-salvia') });
      }
    }
    els.board.update();
  }, [highlight]);

  return (
    <div className="w-full h-full flex flex-col">
      <div 
        id="congruence4-board" 
        ref={boardRef} 
        className="jxgbox w-full aspect-square md:aspect-video rounded-lg border border-carbon/20 bg-crema/50 shadow-inner"
        style={{ width: '100%', height: '100%' }}
      />
      <div className="p-4 text-sm text-center text-carbon/70 font-sans">
        Modifica el <span className="font-bold text-terracota">ángulo superior</span> arrastrando sus puntos. Observa cómo existe una única <span className="font-bold text-salvia">semirrecta B'</span> (línea punteada) en el lado determinado que crea un ángulo congruente en la semirrecta inferior.
      </div>
    </div>
  );
};
