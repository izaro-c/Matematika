import { useRef, useEffect } from 'react';
import JXG from 'jsxgraph';
import { useMathStore } from '@/boundary/contexts/MathStoreContext';
import { useLessonStore } from '@/controller/store/LessonStore';

function getCSSVar(name: string): string {
  if (typeof document !== 'undefined') {
    return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  }
  return '#000';
}

export const Triangulo = () => {
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
      boundingbox: [-4, 4, 4, -4],
      axis: false,
      showCopyright: false,
      keepaspectratio: true,
      grid: false,
    });
    jxgBoard.current = board;

    const pA = board.create('point', [-2, -2], {
      name: 'A',
      size: 5,
      fillColor: getCSSVar('--theme-terracota'),
      strokeColor: getCSSVar('--theme-terracota'),
      showInfobox: false,
      fixed: false,
    });

    const pB = board.create('point', [3, -1], {
      name: 'B',
      size: 5,
      fillColor: getCSSVar('--theme-terracota'),
      strokeColor: getCSSVar('--theme-terracota'),
      showInfobox: false,
      fixed: false,
    });

    // Attractors for C
    const midAB = board.create('midpoint', [pA, pB], { visible: false });
    const bisectorAB = board.create('perpendicular', [board.create('line', [pA, pB], {visible:false}), midAB], { visible: false });
    const thalesAB = board.create('circle', [midAB, pA], { visible: false });
    const circleA = board.create('circle', [pA, pB], { visible: false });
    const circleB = board.create('circle', [pB, pA], { visible: false });

    const pC = board.create('point', [0, 3], {
      name: 'C',
      size: 5,
      fillColor: getCSSVar('--theme-terracota'),
      strokeColor: getCSSVar('--theme-terracota'),
      showInfobox: false,
      fixed: false,
      attractors: [bisectorAB, thalesAB, circleA, circleB],
      attractorDistance: 0.2,
      snatchDistance: 0.4,
    });

    const poly = board.create('polygon', [pA, pB, pC], {
      fillColor: getCSSVar('--theme-salvia'),
      fillOpacity: 0.15,
      borders: { strokeColor: getCSSVar('--theme-salvia'), strokeWidth: 2 },
      vertices: { visible: false } 
    });

    const ladoAB = (poly as any).borders[0];
    const ladoBC = (poly as any).borders[1];
    const ladoCA = (poly as any).borders[2];

    const hatchAB = board.create('hatch', [ladoAB, 2], { visible: false, strokeWidth: 2, strokeColor: getCSSVar('--theme-carbon') });
    const hatchBC = board.create('hatch', [ladoBC, 2], { visible: false, strokeWidth: 2, strokeColor: getCSSVar('--theme-carbon') });
    const hatchCA = board.create('hatch', [ladoCA, 2], { visible: false, strokeWidth: 2, strokeColor: getCSSVar('--theme-carbon') });

    const angleA = board.create('angle', [pB, pA, pC], { visible: false, radius: 0.8 });
    const angleB = board.create('angle', [pC, pB, pA], { visible: false, radius: 0.8 });
    const angleC = board.create('angle', [pA, pC, pB], { visible: false, radius: 0.8 });

    // Dynamic text that updates and also marks angles/sides
    const infoText = board.create('text', [
      -3.8, 3.5,
      function() {
        const dAB = pA.Dist(pB);
        const dBC = pB.Dist(pC);
        const dCA = pC.Dist(pA);
        
        const tol = 0.15;
        let classLados = "Escaleno";
        
        // Reset thick markers
        ladoAB.setAttribute({ strokeWidth: 2, dash: 0 });
        ladoBC.setAttribute({ strokeWidth: 2, dash: 0 });
        ladoCA.setAttribute({ strokeWidth: 2, dash: 0 });
        hatchAB.setAttribute({ visible: false });
        hatchBC.setAttribute({ visible: false });
        hatchCA.setAttribute({ visible: false });

        if (Math.abs(dAB - dBC) < tol && Math.abs(dBC - dCA) < tol) {
          classLados = "Equilátero";
          ladoAB.setAttribute({ strokeWidth: 4 });
          ladoBC.setAttribute({ strokeWidth: 4 });
          ladoCA.setAttribute({ strokeWidth: 4 });
          hatchAB.setAttribute({ visible: true });
          hatchBC.setAttribute({ visible: true });
          hatchCA.setAttribute({ visible: true });
        } else if (Math.abs(dAB - dBC) < tol) {
          classLados = "Isósceles";
          ladoAB.setAttribute({ strokeWidth: 4 });
          ladoBC.setAttribute({ strokeWidth: 4 });
          hatchAB.setAttribute({ visible: true });
          hatchBC.setAttribute({ visible: true });
        } else if (Math.abs(dBC - dCA) < tol) {
          classLados = "Isósceles";
          ladoBC.setAttribute({ strokeWidth: 4 });
          ladoCA.setAttribute({ strokeWidth: 4 });
          hatchBC.setAttribute({ visible: true });
          hatchCA.setAttribute({ visible: true });
        } else if (Math.abs(dCA - dAB) < tol) {
          classLados = "Isósceles";
          ladoCA.setAttribute({ strokeWidth: 4 });
          ladoAB.setAttribute({ strokeWidth: 4 });
          hatchCA.setAttribute({ visible: true });
          hatchAB.setAttribute({ visible: true });
        }

        const vA = angleA.Value();
        const vB = angleB.Value();
        const vC = angleC.Value();
        const maxAng = Math.max(vA, vB, vC);
        
        let classAngulos = "Acutángulo";
        const pi2 = Math.PI / 2;
        
        angleA.setAttribute({ visible: false });
        angleB.setAttribute({ visible: false });
        angleC.setAttribute({ visible: false });

        if (Math.abs(maxAng - pi2) < 0.05) {
          classAngulos = "Rectángulo";
          if (Math.abs(vA - pi2) < 0.05) angleA.setAttribute({ visible: true, type: 'sectordot', fillColor: getCSSVar('--theme-ocre'), strokeColor: getCSSVar('--theme-ocre') });
          if (Math.abs(vB - pi2) < 0.05) angleB.setAttribute({ visible: true, type: 'sectordot', fillColor: getCSSVar('--theme-ocre'), strokeColor: getCSSVar('--theme-ocre') });
          if (Math.abs(vC - pi2) < 0.05) angleC.setAttribute({ visible: true, type: 'sectordot', fillColor: getCSSVar('--theme-ocre'), strokeColor: getCSSVar('--theme-ocre') });
        } else if (maxAng > pi2) {
          classAngulos = "Obtusángulo";
          if (vA > pi2) angleA.setAttribute({ visible: true, fillColor: '#ef4444', strokeColor: '#ef4444' }); // Red
          if (vB > pi2) angleB.setAttribute({ visible: true, fillColor: '#ef4444', strokeColor: '#ef4444' });
          if (vC > pi2) angleC.setAttribute({ visible: true, fillColor: '#ef4444', strokeColor: '#ef4444' });
        }

        const maxAngDeg = Math.round(maxAng * 180 / Math.PI);
        const piFrac = (maxAng / Math.PI).toFixed(2);
        const piStr = classAngulos === "Rectángulo" ? "&pi;/2" : `${piFrac}&pi;`;

        return `<div style="font-family: var(--font-serif); color: ${getCSSVar('--theme-carbon')};">
          <strong style="font-size: 1.2rem;">Triángulo ${classLados}</strong><br/>
          <i>${classAngulos}</i><br/>
          Ángulo mayor: ${maxAngDeg}&deg; (${piStr} rad)
        </div>`;
      }
    ], { fixed: true, anchorX: 'left', anchorY: 'top' });

    elementsRef.current = { pA, pB, pC, poly, ladoAB, ladoBC, ladoCA, angleA, angleB, angleC, hatchAB, hatchBC, hatchCA, infoText, board };

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
    const { pA, pB, pC, poly, ladoAB, ladoBC, ladoCA, board } = elementsRef.current as Record<string, any>;
    if (!board) return;

    pA.setAttribute({ size: 5, fillColor: getCSSVar('--theme-terracota'), strokeColor: getCSSVar('--theme-terracota') });
    pB.setAttribute({ size: 5, fillColor: getCSSVar('--theme-terracota'), strokeColor: getCSSVar('--theme-terracota') });
    pC.setAttribute({ size: 5, fillColor: getCSSVar('--theme-terracota'), strokeColor: getCSSVar('--theme-terracota') });
    
    poly.setAttribute({ fillOpacity: 0.15 });

    if (isHighlight('vertice-a')) {
      pA.setAttribute({ size: 8, fillColor: getCSSVar('--theme-ocre'), strokeColor: getCSSVar('--theme-ocre') });
    }
    if (isHighlight('vertice-b')) {
      pB.setAttribute({ size: 8, fillColor: getCSSVar('--theme-ocre'), strokeColor: getCSSVar('--theme-ocre') });
    }
    if (isHighlight('vertice-c')) {
      pC.setAttribute({ size: 8, fillColor: getCSSVar('--theme-ocre'), strokeColor: getCSSVar('--theme-ocre') });
    }
    if (isHighlight('lado-ab')) {
      ladoAB.setAttribute({ strokeWidth: 5, strokeColor: getCSSVar('--theme-ocre') });
    }
    if (isHighlight('lado-bc')) {
      ladoBC.setAttribute({ strokeWidth: 5, strokeColor: getCSSVar('--theme-ocre') });
    }
    if (isHighlight('lado-ca')) {
      ladoCA.setAttribute({ strokeWidth: 5, strokeColor: getCSSVar('--theme-ocre') });
    }
    if (isHighlight('triangulo')) {
      poly.setAttribute({ fillOpacity: 0.4 });
    }

    board.update();
  }, [highlight]);

  return (
    <div className="w-full h-full min-h-[300px] relative bg-lienzo/40 border border-pizarra/10 rounded-sm overflow-hidden">
      <div className="absolute top-2 left-3 z-10 text-xs font-serif italic text-pizarra/50">
        Arrastra el vértice <span className="font-bold not-italic text-terracota">C</span> para encajar en triángulos notables
      </div>
      <div ref={boardRef} className="w-full h-full touch-none" />
    </div>
  );
};
