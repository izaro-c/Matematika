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

export const Circunferencia = () => {
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
      boundingbox: [-5, 5, 5, -5],
      axis: false,
      showCopyright: false,
      keepaspectratio: true,
      grid: false,
    });
    jxgBoard.current = board;

    const O = board.create('point', [0, 0], {
      name: 'O',
      size: 5,
      fillColor: getCSSVar('--theme-carbon'),
      strokeColor: getCSSVar('--theme-carbon'),
      showInfobox: false,
      fixed: false,
    });

    const P = board.create('point', [3, 0], {
      name: 'P',
      size: 5,
      fillColor: getCSSVar('--theme-terracota'),
      strokeColor: getCSSVar('--theme-terracota'),
      showInfobox: false,
      fixed: false,
    });

    const circ = board.create('circle', [O, P], {
      strokeColor: getCSSVar('--theme-terracota'),
      strokeWidth: 2,
      fillColor: getCSSVar('--theme-salvia'),
      fillOpacity: 0,
    });

    const radio = board.create('segment', [O, P], {
      strokeColor: getCSSVar('--theme-pizarra'),
      strokeWidth: 2,
      dash: 2,
      name: 'r',
      withLabel: true,
      label: { position: 'top' }
    });

    // Elementos Notables (invisibles por defecto)
    const diamP = board.create('point', [
      function() { return O.X() - (P.X() - O.X()); },
      function() { return O.Y() - (P.Y() - O.Y()); }
    ], { visible: false });
    
    const diametro = board.create('segment', [diamP, P], {
      strokeColor: getCSSVar('--theme-salvia'),
      strokeWidth: 3,
      visible: false
    });

    const cuerdaP1 = board.create('glider', [0, 3, circ], { visible: false });
    const cuerdaP2 = board.create('glider', [-2, 2.23, circ], { visible: false });
    const cuerda = board.create('segment', [cuerdaP1, cuerdaP2], {
      strokeColor: getCSSVar('--theme-ocre'),
      strokeWidth: 3,
      visible: false
    });

    const arcoP1 = board.create('glider', [-3, 0, circ], { visible: false });
    const arcoP2 = board.create('glider', [0, -3, circ], { visible: false });
    const arco = board.create('arc', [O, arcoP1, arcoP2], {
      strokeColor: getCSSVar('--theme-salvia'),
      strokeWidth: 4,
      visible: false
    });

    const tangenteP = board.create('glider', [0, 3, circ], { visible: false });
    const tangente = board.create('tangent', [tangenteP], {
      strokeColor: getCSSVar('--theme-carbon'),
      strokeWidth: 2,
      visible: false
    });

    elementsRef.current = { O, P, circ, radio, diametro, cuerda, arco, tangente, board };

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
    const { O, P, circ, radio, diametro, cuerda, arco, tangente, board } = elementsRef.current as Record<string, any>;
    if (!board) return;

    // Reset base styles
    O.setAttribute({ size: 5, fillColor: getCSSVar('--theme-carbon'), strokeColor: getCSSVar('--theme-carbon') });
    P.setAttribute({ size: 5, fillColor: getCSSVar('--theme-terracota'), strokeColor: getCSSVar('--theme-terracota') });
    circ.setAttribute({ fillOpacity: 0, strokeWidth: 2, strokeColor: getCSSVar('--theme-terracota') });
    radio.setAttribute({ strokeWidth: 2, strokeColor: getCSSVar('--theme-pizarra') });

    // Hide notable elements by default
    diametro.setAttribute({ visible: false });
    cuerda.setAttribute({ visible: false });
    arco.setAttribute({ visible: false });
    tangente.setAttribute({ visible: false });

    // Highlight logic
    if (isHighlight('centro')) {
      O.setAttribute({ size: 9, fillColor: getCSSVar('--theme-ocre'), strokeColor: getCSSVar('--theme-ocre') });
    }
    if (isHighlight('circunferencia')) {
      circ.setAttribute({ strokeWidth: 4 });
    }
    if (isHighlight('circulo')) {
      circ.setAttribute({ fillOpacity: 0.15 });
    }
    if (isHighlight('radio')) {
      radio.setAttribute({ strokeWidth: 4, strokeColor: getCSSVar('--theme-ocre') });
    }

    // Show notable elements if requested
    if (isHighlight('diametro')) {
      diametro.setAttribute({ visible: true });
    }
    if (isHighlight('cuerda')) {
      cuerda.setAttribute({ visible: true });
    }
    if (isHighlight('arco')) {
      arco.setAttribute({ visible: true });
    }
    if (isHighlight('tangente')) {
      tangente.setAttribute({ visible: true });
    }

    board.update();
  }, [highlight]);

  return (
    <div className="w-full h-full min-h-[300px] relative bg-lienzo/40 border border-pizarra/10 rounded-sm overflow-hidden">
      <div className="absolute top-2 left-3 z-10 text-xs font-serif italic text-pizarra/50">
        Arrastra el centro <span className="font-bold not-italic text-carbon">O</span> o el punto <span className="font-bold not-italic text-terracota">P</span>
      </div>
      <div ref={boardRef} className="w-full h-full touch-none" />
    </div>
  );
};
