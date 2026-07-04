import { useRef, useEffect } from 'react';
import { getCSSVar } from '@/features/graph/ui/MathUtils';
import JXG from 'jsxgraph';
import { useMathStore } from '@/app/providers/MathStoreContext';
import { useLessonStore } from '@/features/lessons/LessonStore';

export const EjemploPitagorasCalculo = () => {
  const boardRef = useRef<HTMLDivElement>(null);
  const elementsRef = useRef<Record<string, any>>({});

  // Suscripción a los hovers/clicks del MDX mediante MathStore
  const mathHighlight = useMathStore((state) => state.variables['highlight']);
  // Suscripción al paso activo de la lección
  const activeStep = useLessonStore((state) => state.activeStep);

  const highlight = mathHighlight || activeStep;
  const isHighlight = (id: string) => 
    Array.isArray(highlight) ? (highlight as unknown as string[]).includes(id) : highlight === id;

  // Determinar la dirección y escala del desplazamiento del texto del lado (exterior/interior del triángulo)
  // para evitar solapamientos con los cuadrados de áreas externos.
  // El factor exterior se fija en 1.5 para dar mayor separación a la izquierda a la etiqueta "a = 5".
  const getSideFactor = () => {
    const showSquares = activeStep === 'calculo' || activeStep === 'resolucion' || activeStep === 'terna';
    return showSquares ? -1.5 : 1.5; // -1.5 (interior cómodo) o 1.5 (exterior bien separado a la izquierda)
  };

  useEffect(() => {
    if (!boardRef.current) return;

    if (!boardRef.current.id) {
      boardRef.current.id = "jxgbox_" + Math.random().toString(36).substring(2, 9);
    }

    const board = JXG.JSXGraph.initBoard(boardRef.current.id, {
      boundingbox: [-7, 19, 21, -14],
      axis: false,
      showCopyright: false,
      keepaspectratio: true,
      grid: false,
    });

    const C_PRIM  = getCSSVar('--theme-carbon');
    const C_RIGHT = getCSSVar('--theme-pavo');

    // Vértices del triángulo rectángulo (5, 12, 13)
    const C = board.create('point', [0, 0], { 
      name: 'C', size: 4.5, fillColor: C_PRIM, strokeColor: C_PRIM, showInfobox: false, fixed: true 
    });
    const A = board.create('point', [0, 5], { 
      name: 'A', size: 4.5, fillColor: C_PRIM, strokeColor: C_PRIM, showInfobox: false, fixed: true 
    });
    const B = board.create('point', [12, 0], { 
      name: 'B', size: 4.5, fillColor: C_PRIM, strokeColor: C_PRIM, showInfobox: false, fixed: true 
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

    // Función geométrica para proyectar los cuadrados hacia fuera del triángulo
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

    // Vértices de los cuadrados
    const ptsCA = mkSqPts(C, A, B);
    const ptsBC = mkSqPts(B, C, A);
    const ptsAB = mkSqPts(A, B, C);

    // Polígonos de los cuadrados
    const sqCA = board.create('polygon', ptsCA, {
      fillColor: getCSSVar('--theme-salvia'), fillOpacity: 0.1, borders: { visible: false }, vertices: { visible: false }
    });
    const sqBC = board.create('polygon', ptsBC, {
      fillColor: getCSSVar('--theme-terracota'), fillOpacity: 0.1, borders: { visible: false }, vertices: { visible: false }
    });
    const sqAB = board.create('polygon', ptsAB, {
      fillColor: getCSSVar('--theme-ocre'), fillOpacity: 0.1, borders: { visible: false }, vertices: { visible: false }
    });

    // Función para dibujar una cuadrícula interna unitaria en un cuadrado
    const drawGrid = (pts: any[], N: number) => {
      const p1 = pts[0];
      const p2 = pts[1];
      const p3 = pts[2];
      const p4 = pts[3];
      const segments: any[] = [];

      for (let i = 1; i < N; i++) {
        const t = i / N;

        // Líneas paralelas a p1-p4 y p2-p3
        const ptStart1 = board.create('point', [
          () => p1.X() + t * (p2.X() - p1.X()),
          () => p1.Y() + t * (p2.Y() - p1.Y())
        ], { visible: false });
        const ptEnd1 = board.create('point', [
          () => p4.X() + t * (p3.X() - p4.X()),
          () => p4.Y() + t * (p3.Y() - p4.Y())
        ], { visible: false });
        segments.push(board.create('segment', [ptStart1, ptEnd1], {
          strokeColor: C_PRIM, strokeWidth: 0.5, strokeOpacity: 0.25, fixed: true
        }));

        // Líneas paralelas a p1-p2 y p4-p3
        const ptStart2 = board.create('point', [
          () => p1.X() + t * (p4.X() - p1.X()),
          () => p1.Y() + t * (p4.Y() - p1.Y())
        ], { visible: false });
        const ptEnd2 = board.create('point', [
          () => p2.X() + t * (p3.X() - p2.X()),
          () => p2.Y() + t * (p3.Y() - p2.Y())
        ], { visible: false });
        segments.push(board.create('segment', [ptStart2, ptEnd2], {
          strokeColor: C_PRIM, strokeWidth: 0.5, strokeOpacity: 0.25, fixed: true
        }));
      }
      return segments;
    };

    // Crear cuadrículas para los tres cuadrados
    const gridCA = drawGrid(ptsCA, 5);
    const gridBC = drawGrid(ptsBC, 12);
    const gridAB = drawGrid(ptsAB, 13);

    // Función helper para etiquetas de los lados exteriores/interiores del triángulo
    // t define la interpolación lineal para distribuir las etiquetas espacialmente
    const createLabel = (p: any, q: any, initialText: string, t: number) => {
      const mx = () => p.X() + t * (q.X() - p.X());
      const my = () => p.Y() + t * (q.Y() - p.Y());
      const dx = () => q.X() - p.X();
      const dy = () => q.Y() - p.Y();
      const nl = () => Math.hypot(dx(), dy()) || 1;
      const off = 0.7; // Distancia perpendicular base
      return board.create('text', [
        () => mx() - dy() / nl() * off * getSideFactor(),
        () => my() + dx() / nl() * off * getSideFactor(),
        initialText
      ], { 
        fixed: true, fontSize: 16, cssClass: 'font-serif font-bold', 
        anchorX: 'middle', anchorY: 'middle', color: C_PRIM 
      });
    };

    // Creación de etiquetas distribuidas espacialmente para evitar colisiones en el interior:
    // - Cateto vertical (a): en el primer tercio superior (t=0.65)
    // - Cateto horizontal (b): en el primer tercio derecho (t=0.25)
    // - Hipotenusa (c): en el primer tercio superior izquierdo (t=0.25)
    const labA = createLabel(C, A, 'a', 0.65);
    const labB = createLabel(B, C, 'b', 0.25);
    const labC = createLabel(A, B, 'c', 0.25);

    // Textos de las áreas en el centro geométrico de cada cuadrado
    const textAreaA = board.create('text', [-2.5, 2.5, 'a² = 5² = 25'], {
      fixed: true, fontSize: 13, cssClass: 'font-serif italic font-bold', 
      anchorX: 'middle', anchorY: 'middle', color: getCSSVar('--theme-salvia'), visible: false
    });
    const textAreaB = board.create('text', [6, -6, 'b² = 12² = 144'], {
      fixed: true, fontSize: 13, cssClass: 'font-serif italic font-bold', 
      anchorX: 'middle', anchorY: 'middle', color: getCSSVar('--theme-terracota'), visible: false
    });
    const textAreaC = board.create('text', [8.5, 8.5, 'c² = 169'], {
      fixed: true, fontSize: 13, cssClass: 'font-serif italic font-bold', 
      anchorX: 'middle', anchorY: 'middle', color: getCSSVar('--theme-ocre'), visible: false
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

  // Actualización reactiva basada en activeStep y hovers (highlight)
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

    // 1. Estados de visibilidad y progresión didáctica
    const showSquares = activeStep === 'calculo' || activeStep === 'resolucion' || activeStep === 'terna';

    // 2. Actualizar dinámicamente los textos de los lados para evitar stale closures
    // Paso 1 (datos) y Paso 2 (calculo): hipotenusa es incógnita ("c = ?")
    // Paso 3 (resolucion) y Paso 4 (terna): hipotenusa resuelta ("c = 13")
    if (activeStep === 'datos' || activeStep === 'calculo') {
      labA.setText('a = 5');
      labB.setText('b = 12');
      labC.setText('c = ?');
    } else if (activeStep === 'resolucion' || activeStep === 'terna') {
      labA.setText('a = 5');
      labB.setText('b = 12');
      labC.setText('c = 13');
    } else {
      labA.setText('a');
      labB.setText('b');
      labC.setText('c');
    }

    // Las etiquetas están siempre visibles para guiar el paso geométrico
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

    // Bordes de los cuadrados (siempre sólidos e integrados en todos los pasos visibles)
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

    // 4. Aplicar visibilidad a las cuadrículas unitarias internas (visibles en todos los pasos activos)
    gridCA.forEach((seg: any) => seg.setAttribute({ visible: showSquares, strokeColor: C_SALVIA, strokeOpacity: isHighlight('sqCA') ? 0.4 : 0.2 }));
    gridBC.forEach((seg: any) => seg.setAttribute({ visible: showSquares, strokeColor: C_TERRACOTA, strokeOpacity: isHighlight('sqBC') ? 0.4 : 0.2 }));
    gridAB.forEach((seg: any) => seg.setAttribute({ visible: showSquares, strokeColor: C_OCRE, strokeOpacity: isHighlight('sqAB') ? 0.4 : 0.2 }));

    // 5. Aplicar visibilidad a los textos de las áreas
    textAreaA.setAttribute({ visible: showSquares, color: C_SALVIA });
    textAreaB.setAttribute({ visible: showSquares, color: C_TERRACOTA });
    
    // Progresión del texto del área de la hipotenusa:
    // - En paso 2 (calculo): muestra únicamente "c² = 169" (estado de la suma de áreas).
    // - En paso 3 (resolucion) y 4 (terna): muestra "c² = 13² = 169" (descomposición con el valor de c obtenido).
    if (activeStep === 'calculo') {
      textAreaC.setText('c² = 169');
    } else {
      textAreaC.setText('c² = 13² = 169');
    }
    textAreaC.setAttribute({ visible: showSquares, color: C_OCRE });

    // 6. Vértices del triángulo (cambian de tamaño en hover, pero no de color)
    C.setAttribute({ size: isHighlight('C') ? 8.5 : 4.5, fillColor: C_PRIM, strokeColor: C_PRIM });
    A.setAttribute({ size: isHighlight('A') ? 8.5 : 4.5, fillColor: C_PRIM, strokeColor: C_PRIM });
    B.setAttribute({ size: isHighlight('B') ? 8.5 : 4.5, fillColor: C_PRIM, strokeColor: C_PRIM });

    // 7. Actualizar colores y grosores de las líneas del triángulo
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

    // Relleno del polígono interior del triángulo (tenue y neutral)
    poly.setAttribute({
      fillColor: C_PRIM,
      fillOpacity: isHighlightPoly ? 0.15 : 0.04
    });

    // Resaltado del ángulo recto
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
        Triángulo y Cuadrados de Áreas (5, 12, 13)
      </div>
      <div ref={boardRef} className="w-full h-full touch-none" />
    </div>
  );
};
