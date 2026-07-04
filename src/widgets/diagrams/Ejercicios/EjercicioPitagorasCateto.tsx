import { useRef, useEffect } from 'react';
import { getCSSVar } from '@/features/graph/ui/MathUtils';
import JXG from 'jsxgraph';
import { useMathStore } from '@/app/providers/MathStoreContext';
import { useLessonStore } from '@/features/lessons/LessonStore';

export const EjercicioPitagorasCateto = () => {
  const boardRef = useRef<HTMLDivElement>(null);
  const elementsRef = useRef<Record<string, any>>({});

  // Suscripción a hovers del MDX
  const mathHighlight = useMathStore((state) => state.variables['highlight']);
  // Suscripción al paso activo
  const activeStep = useLessonStore((state) => state.activeStep);

  const highlight = mathHighlight || activeStep;
  const isHighlight = (id: string) => 
    Array.isArray(highlight) ? (highlight as unknown as string[]).includes(id) : highlight === id;

  // Determinar la dirección y escala del desplazamiento del texto del lado (exterior/interior del triángulo)
  // para evitar solapamientos con los cuadrados de áreas externos.
  const getSideFactor = () => {
    const showSquares = activeStep === 'p2' || activeStep === 'p3';
    return showSquares ? -1.5 : 1.5; // -1.5 (interior cómodo) o 1.5 (exterior bien separado a la izquierda)
  };

  useEffect(() => {
    if (!boardRef.current) return;

    if (!boardRef.current.id) {
      boardRef.current.id = "jxgbox_" + Math.random().toString(36).substring(2, 9);
    }

    const board = JXG.JSXGraph.initBoard(boardRef.current.id, {
      boundingbox: [-9, 19, 21, -14],
      axis: false,
      showCopyright: false,
      keepaspectratio: true,
      grid: false,
    });

    const C_PRIM  = getCSSVar('--theme-carbon');
    const C_RIGHT = getCSSVar('--theme-pavo');
    const C_SALVIA = getCSSVar('--theme-salvia');
    const C_TERRACOTA = getCSSVar('--theme-terracota');
    const C_OCRE = getCSSVar('--theme-ocre');

    // 1. Vértices del triángulo (fijos en su terna 6, 8, 10)
    const C = board.create('point', [0, 0], { 
      name: 'C', size: 4.5, fillColor: C_PRIM, strokeColor: C_PRIM, showInfobox: false, fixed: true 
    });
    const B = board.create('point', [8, 0], { 
      name: 'B', size: 4.5, fillColor: C_PRIM, strokeColor: C_PRIM, showInfobox: false, fixed: true 
    });
    const A = board.create('point', [0, 6], {
      name: 'A', size: 4.5, fillColor: C_PRIM, strokeColor: C_PRIM, showInfobox: false, fixed: true
    });

    // Segmentos del triángulo
    const segCA = board.create('segment', [C, A], { strokeColor: C_PRIM, strokeWidth: 2 });
    const segBC = board.create('segment', [B, C], { strokeColor: C_PRIM, strokeWidth: 2 });
    const segAB = board.create('segment', [A, B], { strokeColor: C_PRIM, strokeWidth: 2 });

    const poly = board.create('polygon', [A, B, C], {
      fillColor: C_PRIM, fillOpacity: 0.04, borders: { visible: false }, vertices: { visible: false }
    });

    // Ángulo recto en C
    const rightAng = board.create('angle', [B, C, A], {
      radius: 0.6, type: 'sector', orthotype: 'square',
      fillColor: C_RIGHT, strokeColor: C_RIGHT, fillOpacity: 0.25
    });

    // 2. Proyección de cuadrados
    const mkSqPts = (p1: any, p2: any, opp: any) => {
      const len = () => p1.Dist(p2);
      const dx = () => p2.X() - p1.X();
      const dy = () => p2.Y() - p1.Y();
      const ndx = () => -dy() / Math.max(len(), 0.001);
      const ndy = () => dx() / Math.max(len(), 0.001);
      const mx = () => (p1.X() + p2.X()) / 2;
      const my = () => (p1.Y() + p2.Y()) / 2;
      const sign = () => ((opp.X() - mx()) * ndx() + (opp.Y() - my()) * ndy() > 0 ? -1 : 1);
      
      const p3 = board.create('point', [
        () => p2.X() + ndx() * len() * sign(),
        () => p2.Y() + ndy() * len() * sign()
      ], { visible: false });
      
      const p4 = board.create('point', [
        () => p1.X() + ndx() * len() * sign(),
        () => p1.Y() + ndy() * len() * sign()
      ], { visible: false });
      
      return [p1, p2, p3, p4];
    };

    const ptsCA = mkSqPts(C, A, B);
    const ptsBC = mkSqPts(B, C, A);
    const ptsAB = mkSqPts(A, B, C);

    // Polígonos de los cuadrados
    const sqCA = board.create('polygon', ptsCA, {
      fillColor: C_SALVIA, fillOpacity: 0.1, borders: { visible: false }, vertices: { visible: false }
    });
    const sqBC = board.create('polygon', ptsBC, {
      fillColor: C_TERRACOTA, fillOpacity: 0.1, borders: { visible: false }, vertices: { visible: false }
    });
    const sqAB = board.create('polygon', ptsAB, {
      fillColor: C_OCRE, fillOpacity: 0.1, borders: { visible: false }, vertices: { visible: false }
    });

    // 3. Cuadrículas unitarias de conteo
    const drawGrid = (pts: any[], N: number) => {
      const p1 = pts[0];
      const p2 = pts[1];
      const p3 = pts[2];
      const p4 = pts[3];
      const segments: any[] = [];

      for (let i = 1; i < N; i++) {
        const t = i / N;

        const ptStart1 = board.create('point', [
          () => p1.X() + t * (p2.X() - p1.X()),
          () => p1.Y() + t * (p2.Y() - p1.Y())
        ], { visible: false });
        const ptEnd1 = board.create('point', [
          () => p4.X() + t * (p3.X() - p4.X()),
          () => p4.Y() + t * (p3.Y() - p4.Y())
        ], { visible: false });
        segments.push(board.create('segment', [ptStart1, ptEnd1], {
          strokeColor: C_PRIM, strokeWidth: 0.5, strokeOpacity: 0.2, fixed: true
        }));

        const ptStart2 = board.create('point', [
          () => p1.X() + t * (p4.X() - p1.X()),
          () => p1.Y() + t * (p4.Y() - p1.Y())
        ], { visible: false });
        const ptEnd2 = board.create('point', [
          () => p2.X() + t * (p3.X() - p2.X()),
          () => p2.Y() + t * (p3.Y() - p2.Y())
        ], { visible: false });
        segments.push(board.create('segment', [ptStart2, ptEnd2], {
          strokeColor: C_PRIM, strokeWidth: 0.5, strokeOpacity: 0.2, fixed: true
        }));
      }
      return segments;
    };

    // Crear cuadrículas fijas de la terna (6, 8, 10)
    const gridCA = drawGrid(ptsCA, 6);
    const gridBC = drawGrid(ptsBC, 8);
    const gridAB = drawGrid(ptsAB, 10);

    // 4. Posicionamiento dinámico de las etiquetas de longitud de los lados
    const createLabel = (p: any, q: any, initialText: string, t: number) => {
      const mx = () => p.X() + t * (q.X() - p.X());
      const my = () => p.Y() + t * (q.Y() - p.Y());
      const dx = () => q.X() - p.X();
      const dy = () => q.Y() - p.Y();
      const nl = () => Math.hypot(dx(), dy()) || 1;
      const off = 0.7;
      return board.create('text', [
        () => mx() - dy() / nl() * off * getSideFactor(),
        () => my() + dx() / nl() * off * getSideFactor(),
        initialText
      ], { 
        fixed: true, fontSize: 16, cssClass: 'font-serif font-bold', 
        anchorX: 'middle', anchorY: 'middle', color: C_PRIM 
      });
    };

    const labA = createLabel(C, A, 'a', 0.65);
    const labB = createLabel(B, C, 'b', 0.25);
    const labC = createLabel(A, B, 'c', 0.25);

    // 5. Textos de las áreas flotando dinámicamente en sus centros geométricos
    const textAreaA = board.create('text', [-3.0, 3.0, 'a² = ?'], {
      fixed: true, fontSize: 13, cssClass: 'font-serif italic font-bold', 
      anchorX: 'middle', anchorY: 'middle', color: C_SALVIA, visible: false
    });

    const textAreaB = board.create('text', [4, -4, 'b² = 8² = 64'], {
      fixed: true, fontSize: 13, cssClass: 'font-serif italic font-bold', 
      anchorX: 'middle', anchorY: 'middle', color: C_TERRACOTA, visible: false
    });

    // Baricentro del cuadrado de la hipotenusa
    const getHypotenuseCenter = (idx: number) => {
      const sum = ptsAB[0].coords.usrCoords[idx] + 
                  ptsAB[1].coords.usrCoords[idx] + 
                  ptsAB[2].coords.usrCoords[idx] + 
                  ptsAB[3].coords.usrCoords[idx];
      return sum / 4;
    };
    const textAreaC = board.create('text', [
      () => getHypotenuseCenter(1), 
      () => getHypotenuseCenter(2), 
      'c² = 10² = 100'
    ], {
      fixed: true, fontSize: 13, cssClass: 'font-serif italic font-bold', 
      anchorX: 'middle', anchorY: 'middle', color: C_OCRE, visible: false
    });

    elementsRef.current = { 
      A, B, C, segCA, segBC, segAB, poly, rightAng, 
      sqCA, sqBC, sqAB, labA, labB, labC, 
      textAreaA, textAreaB, textAreaC, 
      gridCA, gridBC, gridAB, board 
    };

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
      elementsRef.current = {};
    };
  }, []);

  // Actualización reactiva basada en activeStep y hovers
  useEffect(() => {
    const { 
      A, B, C, segCA, segBC, segAB, poly, rightAng, 
      sqCA, sqBC, sqAB, textAreaA, textAreaB, 
      textAreaC, gridCA, gridBC, gridAB, labA, labB, labC, board 
    } = elementsRef.current;
    if (!board) return;

    const C_PRIM = getCSSVar('--theme-carbon');
    const C_SALVIA = getCSSVar('--theme-salvia');
    const C_TERRACOTA = getCSSVar('--theme-terracota');
    const C_OCRE = getCSSVar('--theme-ocre');

    // 1. Mostrar los cuadrados y áreas a partir del Paso 2
    const showSquares = activeStep === 'p2' || activeStep === 'p3';

    // 2. Actualizar dinámicamente los textos de los lados según el paso activo
    if (activeStep === 'p3') {
      labA.setText('a = 6');
      labB.setText('b = 8');
      labC.setText('c = 10');
    } else {
      // Pasos p1, p2 o estado inicial: la longitud vertical es incógnita
      labA.setText('a = ?');
      labB.setText('b = 8');
      labC.setText('c = 10');
    }

    // Colores y visibilidades permanentes de etiquetas
    labA.setAttribute({ visible: true, color: C_SALVIA });
    labB.setAttribute({ visible: true, color: C_TERRACOTA });
    labC.setAttribute({ visible: true, color: C_OCRE });

    // 3. Aplicar visibilidad y colores a los cuadrados de áreas
    sqCA.setAttribute({ 
      visible: showSquares,
      fillColor: C_SALVIA,
      fillOpacity: isHighlight('sqCA') ? 0.28 : 0.08
    });
    sqBC.setAttribute({ 
      visible: showSquares,
      fillColor: C_TERRACOTA,
      fillOpacity: isHighlight('sqBC') ? 0.28 : 0.08
    });
    sqAB.setAttribute({ 
      visible: showSquares,
      fillColor: C_OCRE,
      fillOpacity: isHighlight('sqAB') ? 0.32 : 0.08
    });

    // Bordes de los cuadrados
    const setBorderAttrs = (sq: any, visible: boolean, color: string, highlightActive: boolean) => {
      sq.borders.forEach((line: any) => {
        line.setAttribute({
          visible,
          strokeColor: color,
          strokeWidth: highlightActive ? 3 : 1.25,
          strokeOpacity: highlightActive ? 1.0 : 0.4,
          dash: 0
        });
      });
    };
    setBorderAttrs(sqCA, showSquares, C_SALVIA, isHighlight('sqCA'));
    setBorderAttrs(sqBC, showSquares, C_TERRACOTA, isHighlight('sqBC'));
    setBorderAttrs(sqAB, showSquares, C_OCRE, isHighlight('sqAB'));

    // 4. Visibilidad de cuadrículas
    gridCA.forEach((seg: any) => seg.setAttribute({ visible: showSquares, strokeColor: C_SALVIA, strokeOpacity: isHighlight('sqCA') ? 0.4 : 0.2 }));
    gridBC.forEach((seg: any) => seg.setAttribute({ visible: showSquares, strokeColor: C_TERRACOTA, strokeOpacity: isHighlight('sqBC') ? 0.4 : 0.2 }));
    gridAB.forEach((seg: any) => seg.setAttribute({ visible: showSquares, strokeColor: C_OCRE, strokeOpacity: isHighlight('sqAB') ? 0.4 : 0.2 }));

    // 5. Visibilidad y textos de áreas
    textAreaA.setAttribute({ visible: showSquares, color: C_SALVIA });
    textAreaB.setAttribute({ visible: showSquares, color: C_TERRACOTA });
    textAreaC.setAttribute({ visible: showSquares, color: C_OCRE });

    // Dinamismo de textos de área del cateto vertical:
    // En p2 (área incógnita): a² = ?
    // En p3 (resuelta): a² = 6² = 36
    if (activeStep === 'p3') {
      textAreaA.setText('a² = 6² = 36');
    } else {
      textAreaA.setText('a² = ?');
    }

    // 6. Vértices del triángulo (resaltados en hover, pero de color carbon uniforme)
    C.setAttribute({ size: isHighlight('C') ? 8.5 : 4.5, fillColor: C_PRIM, strokeColor: C_PRIM });
    B.setAttribute({ size: isHighlight('B') ? 8.5 : 4.5, fillColor: C_PRIM, strokeColor: C_PRIM });
    A.setAttribute({ size: isHighlight('A') ? 8.5 : 4.5, fillColor: C_PRIM, strokeColor: C_PRIM });

    // 7. Líneas del triángulo
    const isHighlightSegCA = isHighlight('segCA');
    const isHighlightSegBC = isHighlight('segBC');
    const isHighlightSegAB = isHighlight('segAB');
    const isHighlightPoly = isHighlight('poly');

    segCA.setAttribute({
      strokeColor: C_SALVIA,
      strokeWidth: isHighlightSegCA ? 4.5 : (activeStep ? 3.5 : 2)
    });

    segBC.setAttribute({
      strokeColor: C_TERRACOTA,
      strokeWidth: isHighlightSegBC ? 4.5 : (activeStep ? 3.5 : 2)
    });

    segAB.setAttribute({
      strokeColor: C_OCRE,
      strokeWidth: isHighlightSegAB ? 4.5 : (activeStep ? 3.5 : 2)
    });

    poly.setAttribute({
      fillColor: C_PRIM,
      fillOpacity: isHighlightPoly ? 0.15 : 0.04
    });

    const isHighlightRightAng = isHighlight('rightAng');
    rightAng.setAttribute({
      fillOpacity: isHighlightRightAng ? 0.55 : 0.25,
      strokeWidth: isHighlightRightAng ? 2.5 : 1
    });

    board.update();
  }, [highlight, activeStep]);

  return (
    <div className="w-full h-full min-h-[400px] relative bg-lienzo/40 border border-pizarra/10 rounded-sm overflow-hidden">
      <div className="absolute top-3 left-3 z-10 text-[10px] font-sans text-pizarra/50 uppercase tracking-wider">
        Triángulo y Cuadrados de Áreas (6, 8, 10)
      </div>
      <div ref={boardRef} className="w-full h-full touch-none" />
    </div>
  );
};
