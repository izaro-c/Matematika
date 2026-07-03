import { useRef, useEffect } from 'react';
import { getCSSVar } from '@/features/graph/ui/MathUtils';
import JXG from 'jsxgraph';
import { useMathStore } from '@/app/providers/MathStoreContext';
import { useLessonStore } from '@/features/lessons/LessonStore';


export const Angulo = () => {
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
      boundingbox: [-4, 4, 4, -3],
      axis: false,
      showCopyright: false,
      keepaspectratio: true,
      grid: false,
    });
    jxgBoard.current = board;

    const pO = board.create('point', [0, 0], {
      name: 'O',
      size: 6,
      fillColor: getCSSVar('--theme-pizarra'),
      strokeColor: getCSSVar('--theme-pizarra'),
      showInfobox: false,
      fixed: true,
    });

    const pA = board.create('point', [2.5, 0.8], {
      name: 'A',
      size: 6,
      fillColor: getCSSVar('--theme-terracota'),
      strokeColor: getCSSVar('--theme-terracota'),
      showInfobox: false,
      fixed: false,
    });

    const lHoriz = board.create('line', [pO, pA], { visible: false });
    const lPerp = board.create('perpendicular', [lHoriz, pO], { visible: false });

    const pB = board.create('point', [-1, 2], {
      name: 'B',
      size: 6,
      fillColor: getCSSVar('--theme-terracota'),
      strokeColor: getCSSVar('--theme-terracota'),
      showInfobox: false,
      fixed: false,
      attractors: [lHoriz, lPerp],
      attractorDistance: 0.3,
      snatchDistance: 0.5,
    });

    const farA = board.create('point', [
      function () { return pO.X() + 20 * (pA.X() - pO.X()); },
      function () { return pO.Y() + 20 * (pA.Y() - pO.Y()); },
    ], { visible: false, fixed: true });

    const farB = board.create('point', [
      function () { return pO.X() + 20 * (pB.X() - pO.X()); },
      function () { return pO.Y() + 20 * (pB.Y() - pO.Y()); },
    ], { visible: false, fixed: true });

    const rayOA = board.create('segment', [pO, farA], {
      strokeColor: getCSSVar('--theme-carbon'),
      strokeWidth: 2,
      lastArrow: { type: 2 },
    });

    const rayOB = board.create('segment', [pO, farB], {
      strokeColor: getCSSVar('--theme-carbon'),
      strokeWidth: 2,
      lastArrow: { type: 2 },
    });

    const arc = board.create('angle', [pB, pO, pA], {
      radius: 1.2,
      fillColor: getCSSVar('--theme-salvia'),
      fillOpacity: 0.25,
      strokeColor: getCSSVar('--theme-carbon'),
      strokeWidth: 1.5,
      name: '',
      withLabel: false,
    });

    const infoText = board.create('text', [
      -3.8, 3.5,
      function() {
        const val = arc.Value();
        const deg = Math.round(val * 180 / Math.PI);
        let name = "Agudo (0 &lt; &theta; &lt; &pi;/2)";
        if (deg === 90) name = "Recto (&theta; = &pi;/2)";
        else if (deg === 180) name = "Llano (&theta; = &pi;)";
        else if (deg > 90 && deg < 180) name = "Obtuso (&pi;/2 &lt; &theta; &lt; &pi;)";
        else if (deg > 180 && deg < 360) name = "Cóncavo (&pi; &lt; &theta; &lt; 2&pi;)";
        else if (deg === 0 || deg === 360) name = "Nulo / Completo (&theta; = 0 | 2&pi;)";

        const piFrac = (val / Math.PI).toFixed(2);
        const piStr = deg === 90 ? "&pi;/2" : 
                    deg === 180 ? "&pi;" : 
                    deg === 270 ? "3&pi;/2" : 
                    `${piFrac}&pi;`;
        
        return `<div style="font-family: var(--font-serif); color: ${getCSSVar('--theme-carbon')};">
          <strong style="font-size: 1.2rem;">Ángulo ${name}</strong><br/>
          Medida: ${deg}&deg; <br/>
          Radianes: ${piStr} rad
        </div>`;
      }
    ], { fixed: true, anchorX: 'left', anchorY: 'top' });

    elementsRef.current = { pO, pA, pB, rayOA, rayOB, arc, infoText, board };

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
    const { pO, pA, pB, rayOA, rayOB, arc, board } = elementsRef.current as Record<string, any>;
    if (!board) return;

    pO.setAttribute({ size: 6, fillColor: getCSSVar('--theme-pizarra'), strokeColor: getCSSVar('--theme-pizarra') });
    pA.setAttribute({ size: 6, fillColor: getCSSVar('--theme-terracota'), strokeColor: getCSSVar('--theme-terracota') });
    pB.setAttribute({ size: 6, fillColor: getCSSVar('--theme-terracota'), strokeColor: getCSSVar('--theme-terracota') });
    rayOA.setAttribute({ strokeColor: getCSSVar('--theme-carbon'), strokeWidth: 2 });
    rayOB.setAttribute({ strokeColor: getCSSVar('--theme-carbon'), strokeWidth: 2 });
    arc.setAttribute({ fillColor: getCSSVar('--theme-salvia'), fillOpacity: 0.25, strokeColor: getCSSVar('--theme-carbon'), strokeWidth: 1.5 });

    if (isHighlight('pO')) {
      pO.setAttribute({ size: 10, fillColor: getCSSVar('--theme-ocre'), strokeColor: getCSSVar('--theme-ocre') });
    }
    if (isHighlight('pA')) {
      pA.setAttribute({ size: 10, fillColor: getCSSVar('--theme-ocre'), strokeColor: getCSSVar('--theme-ocre') });
    }
    if (isHighlight('pB')) {
      pB.setAttribute({ size: 10, fillColor: getCSSVar('--theme-ocre'), strokeColor: getCSSVar('--theme-ocre') });
    }
    if (isHighlight('rayOA')) {
      rayOA.setAttribute({ strokeColor: getCSSVar('--theme-terracota'), strokeWidth: 4 });
    }
    if (isHighlight('rayOB')) {
      rayOB.setAttribute({ strokeColor: getCSSVar('--theme-terracota'), strokeWidth: 4 });
    }
    if (isHighlight('angleArc')) {
      arc.setAttribute({ fillColor: getCSSVar('--theme-terracota'), fillOpacity: 0.4, strokeColor: getCSSVar('--theme-terracota') });
    }

    board.update();
  }, [highlight]);

  return (
    <div className="w-full h-full min-h-[300px] relative bg-lienzo/40 border border-pizarra/10 rounded-sm overflow-hidden">
      <div className="absolute top-2 left-3 z-10 text-xs font-serif italic text-pizarra/50">
        Arrastra los puntos <span className="font-bold not-italic text-terracota">A</span>, <span className="font-bold not-italic text-terracota">B</span>
      </div>
      <div ref={boardRef} className="w-full h-full touch-none" />
    </div>
  );
};
