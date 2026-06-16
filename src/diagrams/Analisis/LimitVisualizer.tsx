import React, { useEffect, useRef } from 'react';

export const LimitVisualizer: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const boardRef = useRef<any>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const containerId = 'jxgbox-limite';
    containerRef.current.id = containerId;

    if (!window.JXG) {
      console.error("JSXGraph is not loaded.");
      return;
    }

    const JXG = window.JXG;

    // Initialize board
    boardRef.current = JXG.JSXGraph.initBoard(containerId, {
      boundingbox: [-2, 8, 8, -2],
      axis: true,
      showNavigation: false,
      showCopyright: false
    });

    const board = boardRef.current;

    // Function f(x) = (x - 3)^3 / 4 + 4
    const f = (x: number) => Math.pow(x - 3, 3) / 4 + 4;
    board.create('functiongraph', [f], { strokeColor: 'var(--color-salvia)', strokeWidth: 3 });

    // The limit point: x -> a, a = 3, L = f(3) = 4
    const a = 3;
    const L = 4;
    
    // Create point A
    board.create('point', [a, L], { name: '(a, L)', color: 'var(--color-carbon)', size: 4 });

    // Epsilon and Delta sliders
    const epsilonSlider = board.create('slider', [[-1, 7], [3, 7], [0.5, 1.5, 3]], {
      name: '&epsilon;',
      snapWidth: 0.1,
      strokeColor: 'var(--color-granada)',
      fillColor: 'var(--color-granada)'
    });

    const deltaSlider = board.create('slider', [[-1, 6], [3, 6], [0.5, 1.5, 3]], {
      name: '&delta;',
      snapWidth: 0.1,
      strokeColor: 'var(--color-terracota)',
      fillColor: 'var(--color-terracota)'
    });

    // Epsilon band (horizontal)
    const eTop = () => L + epsilonSlider.Value();
    const eBot = () => L - epsilonSlider.Value();
    
    const lineETop = board.create('line', [[0, eTop], [1, eTop]], { visible: false });
    const lineEBot = board.create('line', [[0, eBot], [1, eBot]], { visible: false });
    
    board.create('inequality', [lineETop], { fillColor: 'var(--color-granada)', fillOpacity: 0.1, inverse: true });
    board.create('inequality', [lineEBot], { fillColor: '#ffffff', fillOpacity: 1 }); // Cut out the bottom to form a band

    // Delta band (vertical)
    const dLeft = () => a - deltaSlider.Value();
    const dRight = () => a + deltaSlider.Value();

    board.create('line', [[dLeft, 0], [dLeft, 1]], { strokeColor: 'var(--color-terracota)', dash: 2 });
    board.create('line', [[dRight, 0], [dRight, 1]], { strokeColor: 'var(--color-terracota)', dash: 2 });

    // Text instructions
    board.create('text', [4, 1, () => `Si |x - ${a}| < ${deltaSlider.Value().toFixed(1)} entonces |f(x) - ${L}| < ${epsilonSlider.Value().toFixed(1)}`], {
      fontSize: 16,
      strokeColor: 'var(--color-pizarra)',
      cssClass: 'font-sans font-bold'
    });

    return () => {
      if (boardRef.current) {
        JXG.JSXGraph.freeBoard(boardRef.current);
      }
    };
  }, []);

  return (
    <div className="w-full bg-white p-6 rounded-lg shadow-sm border border-carbon/10 mb-8 mt-6">
      <div className="mb-4">
        <h3 className="text-xl font-bold text-pizarra font-serif mb-2">Simulador: Definición Épsilon-Delta</h3>
        <p className="text-sm text-carbon/70">
          Mueve los deslizadores $\epsilon$ (tolerancia vertical) y $\delta$ (ventana horizontal). 
          Para que el límite sea $L=4$ en $a=3$, siempre debes poder encontrar un $\delta$ lo suficientemente pequeño para que la parte de la curva entre las líneas verticales quede totalmente contenida dentro de la franja roja.
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
