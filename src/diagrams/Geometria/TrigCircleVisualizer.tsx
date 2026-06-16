import React, { useEffect, useRef } from 'react';

import { useLessonStore } from '../../store/LessonStore';

export const TrigCircleVisualizer: React.FC = () => {
  const { activeStep } = useLessonStore();
  const containerRef = useRef<HTMLDivElement>(null);
  const boardRef = useRef<any>(null);
  
  const pRef = useRef<any>(null);
  const cosRef = useRef<any>(null);
  const sinRef = useRef<any>(null);
  const angRef = useRef<any>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const containerId = 'jxgbox-trig';
    containerRef.current.id = containerId;

    if (!window.JXG) {
      console.error("JSXGraph is not loaded.");
      return;
    }

    const JXG = window.JXG;

    // Initialize board
    boardRef.current = JXG.JSXGraph.initBoard(containerId, {
      boundingbox: [-1.5, 1.5, 1.5, -1.5],
      axis: true,
      showNavigation: false,
      showCopyright: false,
      keepaspectratio: true
    });

    const board = boardRef.current;

    // Center and Circle
    const origin = board.create('point', [0, 0], { name: '', fixed: true, visible: false });
    const circle = board.create('circle', [origin, 1], { strokeColor: 'var(--color-pizarra)', dash: 1 });

    // Glider point on the circle
    const p = board.create('glider', [0.8, 0.6, circle], { name: 'P', color: 'var(--color-carbon)', size: 4 });
    pRef.current = p;

    // Projections (sin and cos)
    const px = board.create('point', [() => p.X(), 0], { name: '', visible: false });
    board.create('point', [0, () => p.Y()], { name: '', visible: false });

    // Triangle
    board.create('polygon', [origin, px, p], {
      fillColor: 'var(--color-salvia)',
      fillOpacity: 0.2,
      borders: { strokeWidth: 2 }
    });

    // Color the borders specifically
    const cosSeg = board.create('segment', [origin, px], { strokeColor: 'var(--color-terracota)', strokeWidth: 3, name: 'cos(θ)', withLabel: true, label: { position: 'bot', offset: [0, -15], cssClass: 'font-bold' } });
    const sinSeg = board.create('segment', [px, p], { strokeColor: 'var(--color-granada)', strokeWidth: 3, name: 'sin(θ)', withLabel: true, label: { position: 'rt', offset: [10, 0], cssClass: 'font-bold' } });
    board.create('segment', [origin, p], { strokeColor: 'var(--color-carbon)', strokeWidth: 2, name: '1', withLabel: true, label: { position: 'top', offset: [-15, 15] } });
    
    cosRef.current = cosSeg;
    sinRef.current = sinSeg;

    // Angle
    const xAxisPoint = board.create('point', [1, 0], { visible: false });
    const ang = board.create('angle', [xAxisPoint, origin, p], {
      name: 'θ',
      radius: 0.3,
      fillColor: 'var(--color-salvia)',
      strokeColor: 'var(--color-salvia)'
    });
    angRef.current = ang;

    // Display the identity
    board.create('text', [-1.4, 1.3, () => `\\cos^2(\\theta) + \\sin^2(\\theta) = (${p.X().toFixed(2)})^2 + (${p.Y().toFixed(2)})^2 = 1`], {
      fontSize: 16,
      strokeColor: 'var(--color-pizarra)',
      useMathJax: true
    });

    return () => {
      if (boardRef.current) {
        JXG.JSXGraph.freeBoard(boardRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!boardRef.current) return;
    const isP = activeStep === 'punto_P' || !activeStep;
    const isAng = activeStep === 'angulo' || !activeStep;
    const isSin = activeStep === 'seno' || !activeStep;
    const isCos = activeStep === 'coseno' || !activeStep;

    if (pRef.current) {
      pRef.current.setAttribute({ 
        size: isP ? 6 : 4, 
        color: isP ? 'var(--color-granada)' : 'var(--color-carbon)'
      });
    }
    if (angRef.current) {
      angRef.current.setAttribute({
        fillOpacity: isAng ? 0.6 : 0.2,
        strokeWidth: isAng ? 3 : 1
      });
    }
    if (sinRef.current) {
      sinRef.current.setAttribute({
        strokeWidth: isSin ? 5 : 3,
        strokeOpacity: isSin ? 1 : 0.4
      });
    }
    if (cosRef.current) {
      cosRef.current.setAttribute({
        strokeWidth: isCos ? 5 : 3,
        strokeOpacity: isCos ? 1 : 0.4
      });
    }

    boardRef.current.update();
  }, [activeStep]);

  return (
    <div className="w-full bg-white p-6 rounded-lg shadow-sm border border-carbon/10 mb-8 mt-6">
      <div className="mb-4">
        <h3 className="text-xl font-bold text-pizarra font-serif mb-2">Simulador: Circunferencia Goniométrica</h3>
        <p className="text-sm text-carbon/70">
          Arrastra el punto P por la circunferencia de radio 1. Observa cómo los catetos del triángulo rectángulo corresponden al seno y al coseno del ángulo $\theta$.
        </p>
      </div>
      <div 
        ref={containerRef} 
        style={{ width: '100%', height: '400px' }} 
        className="jxgbox rounded border border-carbon/10"
      />
    </div>
  );
};
