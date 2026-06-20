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


export const AngulosOpuestos = () => {
  const boardRef = useRef<HTMLDivElement>(null);
  const elementsRef = useRef<Record<string, unknown>>({});

  const mathHighlight = useMathStore(state => state.variables?.['highlight']);
  const lessonHighlight = useLessonStore(state => state.activeStep);
  const highlight = mathHighlight || lessonHighlight;

  useEffect(() => {
    if (!boardRef.current) return;

    const board = JXG.JSXGraph.initBoard(boardRef.current, {
      boundingbox: [-5, 4, 5, -4],
      axis: false,
      showCopyright: false,
      keepaspectratio: true,
      grid: false,
    });

    const O = board.create('point', [0, 0], {
      name: 'O', size: 5, fillColor: getCSSVar('--theme-terracota'), strokeColor: getCSSVar('--theme-terracota'), showInfobox: false, fixed: true,
    });

    const A = board.create('point', [-3.5, 2], {
      name: 'A', size: 4, fillColor: getCSSVar('--theme-terracota'), strokeColor: getCSSVar('--theme-terracota'), showInfobox: false,
    });

    const Ap = board.create('point', [3.5, -2], {
      name: "A'", size: 4, fillColor: getCSSVar('--theme-terracota'), strokeColor: getCSSVar('--theme-terracota'), showInfobox: false,
    });

    const B = board.create('point', [3.5, 2], {
      name: 'B', size: 4, fillColor: getCSSVar('--theme-pizarra'), strokeColor: getCSSVar('--theme-pizarra'), showInfobox: false,
    });

    const Bp = board.create('point', [-3.5, -2], {
      name: "B'", size: 4, fillColor: getCSSVar('--theme-pizarra'), strokeColor: getCSSVar('--theme-pizarra'), showInfobox: false,
    });

    const l = board.create('line', [A, Ap], {
      strokeColor: getCSSVar('--theme-carbon'), strokeWidth: 2, fixed: true, highlight: false,
    });

    const m = board.create('line', [B, Bp], {
      strokeColor: getCSSVar('--theme-carbon'), strokeWidth: 2, fixed: true, highlight: false,
    });

    const angle1 = board.create('angle', [B, O, Ap], {
      strokeColor: getCSSVar('--theme-terracota'), fillColor: getCSSVar('--theme-terracota'), fillOpacity: 0.15,
      radius: 0.8, name: 'α', label: { fontSize: 16 },
    });

    const angle2 = board.create('angle', [Bp, O, A], {
      strokeColor: getCSSVar('--theme-terracota'), fillColor: getCSSVar('--theme-terracota'), fillOpacity: 0.15,
      radius: 0.8, name: 'α', label: { fontSize: 16 },
    });

    const angle3 = board.create('angle', [A, O, B], {
      strokeColor: getCSSVar('--theme-pizarra'), fillColor: getCSSVar('--theme-pizarra'), fillOpacity: 0.15,
      radius: 0.8, name: 'β', label: { fontSize: 16 },
    });

    const angle4 = board.create('angle', [Ap, O, Bp], {
      strokeColor: getCSSVar('--theme-pizarra'), fillColor: getCSSVar('--theme-pizarra'), fillOpacity: 0.15,
      radius: 0.8, name: 'β', label: { fontSize: 16 },
    });

    elementsRef.current = { board, angle1, angle2, angle3, angle4, O, A, B, Ap, Bp, l, m };

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
    const { board, angle1, angle2, angle3, angle4 } = elementsRef.current as Record<string, any>;
    if (!board) return;

    if (highlight === 'alpha') {
      angle1.setAttribute({ fillOpacity: 0.4, strokeColor: getCSSVar('--theme-terracota'), strokeWidth: 3 });
      angle2.setAttribute({ fillOpacity: 0.4, strokeColor: getCSSVar('--theme-terracota'), strokeWidth: 3 });
      angle3.setAttribute({ fillOpacity: 0.05 });
      angle4.setAttribute({ fillOpacity: 0.05 });
    } else if (highlight === 'beta') {
      angle3.setAttribute({ fillOpacity: 0.4, strokeColor: getCSSVar('--theme-pizarra'), strokeWidth: 3 });
      angle4.setAttribute({ fillOpacity: 0.4, strokeColor: getCSSVar('--theme-pizarra'), strokeWidth: 3 });
      angle1.setAttribute({ fillOpacity: 0.05 });
      angle2.setAttribute({ fillOpacity: 0.05 });
    }

    board.update();
  }, [highlight]);

  return (
    <div className="w-full h-full min-h-[300px] relative bg-lienzo/40 border border-pizarra/10 rounded-sm overflow-hidden">
      <div className="absolute top-2 left-3 z-10 text-xs font-serif italic text-pizarra/50">
        Arrastra los puntos para ver los ángulos opuestos
      </div>
      <div ref={boardRef} className="w-full h-full touch-none" />
    </div>
  );
};
