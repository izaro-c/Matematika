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


export const Pasch = () => {
  const boardRef = useRef<HTMLDivElement>(null);
  const jxgBoard = useRef<any>(null);
  const elementsRef = useRef<Record<string, unknown>>({});

  const mathHighlight = useMathStore(state => state.variables?.['highlight']);
  const lessonHighlight = useLessonStore(state => state.activeStep);
  const highlight = mathHighlight || lessonHighlight;

  useEffect(() => {
    if (!boardRef.current) return;

    const board = JXG.JSXGraph.initBoard(boardRef.current.id, {
      boundingbox: [-5, 5, 6, -5],
      axis: false,
      showCopyright: false,
      keepaspectratio: true,
      grid: false,
    });
    jxgBoard.current = board;

    const pA = board.create('point', [0, 2.5], {
      name: 'A', size: 5, fillColor: getCSSVar('--theme-terracota'), strokeColor: getCSSVar('--theme-terracota'),
      showInfobox: false, fixed: false,
    });
    const pB = board.create('point', [-3.5, -2], {
      name: 'B', size: 5, fillColor: getCSSVar('--theme-terracota'), strokeColor: getCSSVar('--theme-terracota'),
      showInfobox: false, fixed: false,
    });
    const pC = board.create('point', [4, -1.5], {
      name: 'C', size: 5, fillColor: getCSSVar('--theme-terracota'), strokeColor: getCSSVar('--theme-terracota'),
      showInfobox: false, fixed: false,
    });

    const sideAB = board.create('segment', [pA, pB], {
      strokeColor: getCSSVar('--theme-carbon'), strokeWidth: 2,
    });
    const sideBC = board.create('segment', [pB, pC], {
      strokeColor: getCSSVar('--theme-carbon'), strokeWidth: 2,
    });
    const sideCA = board.create('segment', [pC, pA], {
      strokeColor: getCSSVar('--theme-carbon'), strokeWidth: 2,
    });

    const triangle = board.create('polygon', [pA, pB, pC], {
      fillColor: getCSSVar('--theme-terracota'), fillOpacity: 0.04,
      borders: { visible: false }, vertices: { visible: false },
    });

    const pP = board.create('glider', [-1, 0.5, sideAB], {
      name: 'P', size: 5, fillColor: getCSSVar('--theme-terracota'), strokeColor: getCSSVar('--theme-terracota'),
      showInfobox: false,
    });
    
    // Punto libre para dirigir la línea
    const pDir = board.create('point', [2, -1], {
      name: '', size: 5, fillColor: getCSSVar('--theme-pizarra'), strokeColor: getCSSVar('--theme-pizarra'),
      showInfobox: false,
    });

    const lineL = board.create('line', [pP, pDir], {
      name: 'l', withLabel: true, label: { position: 'top', offset: [-15, 15], strokeColor: getCSSVar('--theme-pizarra'), fontSize: 16 },
      strokeColor: getCSSVar('--theme-pizarra'), strokeWidth: 2.5, straightFirst: true, straightLast: true,
    });

    // Función robusta para comprobar si un punto está dentro del segmento usando coordenadas
    const isOnSegment = (pt: any, seg: any) => {
      if (!pt || !seg || !seg.point1 || !seg.point2) return false;
      const d1 = Math.hypot(pt.X() - seg.point1.X(), pt.Y() - seg.point1.Y());
      const d2 = Math.hypot(pt.X() - seg.point2.X(), pt.Y() - seg.point2.Y());
      const d = Math.hypot(seg.point1.X() - seg.point2.X(), seg.point1.Y() - seg.point2.Y());
      return Math.abs(d1 + d2 - d) < 0.001;
    };

    // Intersecciones con los otros dos lados
    const intBC = board.create('intersection', [lineL, sideBC, 0], {
      name: 'Q', size: 5, fillColor: getCSSVar('--theme-terracota'), strokeColor: getCSSVar('--theme-terracota'),
      showInfobox: false
    });
    intBC.setAttribute({ visible: () => isOnSegment(intBC, sideBC) });

    const intCA = board.create('intersection', [lineL, sideCA, 0], {
      name: 'Q', size: 5, fillColor: getCSSVar('--theme-terracota'), strokeColor: getCSSVar('--theme-terracota'),
      showInfobox: false
    });
    intCA.setAttribute({ visible: () => isOnSegment(intCA, sideCA) });

    elementsRef.current = { pA, pB, pC, pP, pDir, intBC, intCA, sideAB, sideBC, sideCA, triangle, lineL, board };

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
    const { pA, pB, pC, pP, pDir, intBC, intCA, sideAB, sideBC, sideCA, triangle, lineL, board } = elementsRef.current as Record<string, any>;
    if (!board) return;

    [pA, pB, pC, pP, intBC, intCA].forEach(pt => pt.setAttribute({ size: 5, fillColor: getCSSVar('--theme-terracota'), strokeColor: getCSSVar('--theme-terracota') }));
    pDir.setAttribute({ size: 5, fillColor: getCSSVar('--theme-pizarra'), strokeColor: getCSSVar('--theme-pizarra') });
    [sideAB, sideBC, sideCA].forEach(s => s.setAttribute({ strokeColor: getCSSVar('--theme-carbon'), strokeWidth: 2 }));
    lineL.setAttribute({ strokeColor: getCSSVar('--theme-pizarra'), strokeWidth: 2.5 });
    triangle.setAttribute({ fillOpacity: 0.04 });

    if (highlight === 'triangle') triangle.setAttribute({ fillOpacity: 0.15 });
    if (highlight === 'lineL') lineL.setAttribute({ strokeColor: getCSSVar('--theme-terracota'), strokeWidth: 4 });
    if (highlight === 'pP') pP.setAttribute({ size: 9, fillColor: getCSSVar('--theme-ocre') });
    if (highlight === 'pQ') {
      intBC.setAttribute({ size: 9, fillColor: getCSSVar('--theme-ocre') });
      intCA.setAttribute({ size: 9, fillColor: getCSSVar('--theme-ocre') });
    }

    board.update();
  }, [highlight]);

  return (
    <div className="w-full h-full min-h-[500px] relative bg-lienzo/30">
      <div className="absolute top-3 left-3 z-10 text-[10px] font-sans text-pizarra/50 uppercase tracking-wider">
        Arrastra los vértices, el punto P y el punto de dirección
      </div>
      <div ref={boardRef} className="w-full h-full touch-none" />
    </div>
  );
};
