import { useMathStore } from '@/app/providers/MathStoreContext';
import { useStepBinding } from '@/shared/ui/StepBinding';
import { useExercise } from '@/features/exercises/ui/ExerciseContext';
import { MathBoard } from '@/shared/diagrams/core/MathBoard';
import { DiagramTitle } from '@/shared/ui/DiagramOverlay';
import {
  projectSquareVertices,
  createSquareGrid
} from '@/shared/diagrams/core/MathUtils';
import {
  createPoint,
  createSegment,
  createPolygon,
  createRightAngle
} from '@/shared/diagrams/core/MathFactory';

/**
 * EjercicioPitagorasCateto — Diagrama interactivo del ejercicio de despeje del cateto.
 *
 * Muestra el triángulo rectángulo de terna (6, 8, 10) y proyecta los cuadrados
 * de las áreas correspondientes. Revela el valor de la longitud del cateto
 * y el área respectiva solo cuando el estudiante resuelve correctamente cada paso.
 * Utiliza el componente estándar MathBoard, la factoría MathFactory, DiagramTitle y utilidades geométricas.
 */
export const EjercicioPitagorasCateto = () => {
  // Obtener estado interactivo del ejercicio
  const { state: exerciseState } = useExercise();

  // Suscripción a los pasos activados desde el MDX.
  const mathHighlight = useMathStore((state) => state.variables['highlight']);
  const { activeStep } = useStepBinding();

  const highlight = mathHighlight || activeStep;
  const isHighlight = (id: string) =>
    Array.isArray(highlight) ? (highlight as unknown as string[]).includes(id) : highlight === id;

  const getSideFactor = () => {
    const showSquares = activeStep === 'p2' || activeStep === 'p3';
    return showSquares ? -1.5 : 1.5;
  };

  return (
    <MathBoard
      boundingbox={[-9, 19, 21, -14]}
      axis={false}
      grid={false}
      onInit={(board, els, theme) => {
        // 1. Vértices del triángulo (fijos en su terna 6, 8, 10)
        els.C = createPoint(board, [0, 0], { name: 'C', size: 4.5, fixed: true, label: { visible: false } }, theme);
        els.B = createPoint(board, [8, 0], { name: 'B', size: 4.5, fixed: true, label: { visible: false } }, theme);
        els.A = createPoint(board, [0, 6], { name: 'A', size: 4.5, fixed: true, label: { visible: false } }, theme);

        // Segmentos del triángulo
        els.segCA = createSegment(board, [els.C, els.A], { strokeWidth: 2 }, theme);
        els.segBC = createSegment(board, [els.B, els.C], { strokeWidth: 2 }, theme);
        els.segAB = createSegment(board, [els.A, els.B], { strokeWidth: 2 }, theme);

        els.poly = createPolygon(board, [els.A, els.B, els.C], { fillOpacity: 0.04 }, theme);

        // Ángulo recto en C
        els.rightAng = createRightAngle(board, [els.B, els.C, els.A], { radius: 0.6, fillOpacity: 0.25 }, theme);

        // 2. Proyección de cuadrados auxiliares
        els.ptsCA = projectSquareVertices(board, els.C, els.A, els.B);
        els.ptsBC = projectSquareVertices(board, els.B, els.C, els.A);
        els.ptsAB = projectSquareVertices(board, els.A, els.B, els.C);

        // Polígonos de los cuadrados
        els.sqCA = createPolygon(board, els.ptsCA, { fillColor: theme.salvia }, theme);
        els.sqBC = createPolygon(board, els.ptsBC, { fillColor: theme.terracota }, theme);
        els.sqAB = createPolygon(board, els.ptsAB, { fillColor: theme.pizarra }, theme);

        // 3. Cuadrículas unitarias de conteo
        els.gridCA = createSquareGrid(board, els.ptsCA, 6, theme);
        els.gridBC = createSquareGrid(board, els.ptsBC, 8, theme);
        els.gridAB = createSquareGrid(board, els.ptsAB, 10, theme);

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
            anchorX: 'middle', anchorY: 'middle', color: theme.carbon
          });
        };

        els.labA = createLabel(els.C, els.A, 'a', 0.65);
        els.labB = createLabel(els.B, els.C, 'b', 0.25);
        els.labC = createLabel(els.A, els.B, 'c', 0.25);

        // 5. Textos de las áreas flotando dinámicamente en sus centros geométricos
        els.textAreaA = board.create('text', [-3.0, 3.0, 'a² = ?'], {
          fixed: true, fontSize: 13, cssClass: 'font-serif italic font-bold',
          anchorX: 'middle', anchorY: 'middle', color: theme.salvia, visible: false
        });

        els.textAreaB = board.create('text', [4, -4, 'b² = 8² = 64'], {
          fixed: true, fontSize: 13, cssClass: 'font-serif italic font-bold',
          anchorX: 'middle', anchorY: 'middle', color: theme.terracota, visible: false
        });

        const getHypotenuseCenter = (idx: number) => {
          const sum = els.ptsAB[0].coords.usrCoords[idx] +
                      els.ptsAB[1].coords.usrCoords[idx] +
                      els.ptsAB[2].coords.usrCoords[idx] +
                      els.ptsAB[3].coords.usrCoords[idx];
          return sum / 4;
        };

        els.textAreaC = board.create('text', [
          () => getHypotenuseCenter(1),
          () => getHypotenuseCenter(2),
          'c² = 10² = 100'
        ], {
          fixed: true, fontSize: 13, cssClass: 'font-serif italic font-bold',
          anchorX: 'middle', anchorY: 'middle', color: theme.pizarra, visible: false
        });
      }}
      onUpdate={(_board, els, theme, _isStep, _isHL) => {
        // 1. Mostrar los cuadrados y áreas a partir del Paso 2
        const showSquares = activeStep === 'p2' || activeStep === 'p3';

        // 2. Determinar si las preguntas específicas del ejercicio ya están resueltas correctamente
        const isAreaSolved = exerciseState.questions['p2_q1']?.isCorrect === true;
        const isCatetoSolved = exerciseState.questions['p3_q1']?.isCorrect === true;

        // 3. Actualizar dinámicamente los textos de longitud de los lados
        if (isCatetoSolved) {
          els.labA.setText('a = 6');
        } else {
          els.labA.setText('a = ?');
        }
        els.labB.setText('b = 8');
        els.labC.setText('c = 10');

        // Colores y visibilidades de etiquetas
        els.labA.setAttribute({ visible: true, color: theme.salvia });
        els.labB.setAttribute({ visible: true, color: theme.terracota });
        els.labC.setAttribute({ visible: true, color: theme.pizarra });

        // 4. Modulación de visibilidad y estilos de los cuadrados auxiliares
        const updateSquareElement = (name: string, visible: boolean, color: string, isHighlighted: boolean) => {
          els[`sq${name}`].setAttribute({ visible, fillColor: color, fillOpacity: isHighlighted ? 0.28 : 0.08 });
          els[`sq${name}`].borders.forEach((b: any) => {
            b.setAttribute({ visible, strokeColor: color, strokeWidth: isHighlighted ? 3 : 1.25, strokeOpacity: isHighlighted ? 1.0 : 0.4 });
          });
          els[`grid${name}`].forEach((seg: any) => {
            seg.setAttribute({ visible, strokeColor: color, strokeOpacity: isHighlighted ? 0.4 : 0.2 });
          });
        };

        updateSquareElement('CA', showSquares, theme.salvia, isHighlight('sqCA'));
        updateSquareElement('BC', showSquares, theme.terracota, isHighlight('sqBC'));
        updateSquareElement('AB', showSquares, theme.pizarra, isHighlight('sqAB'));

        // 5. Visibilidad y textos de áreas
        els.textAreaA.setAttribute({ visible: showSquares, color: theme.salvia });
        els.textAreaB.setAttribute({ visible: showSquares, color: theme.terracota });
        els.textAreaC.setAttribute({ visible: showSquares, color: theme.pizarra });

        if (isAreaSolved) {
          els.textAreaA.setText('a² = 36');
        } else {
          els.textAreaA.setText('a² = ?');
        }

        // 6. Vértices del triángulo (resaltados en hover, pero de color carbon uniforme)
        els.C.setAttribute({ size: isHighlight('C') ? 8.5 : 4.5, fillColor: theme.carbon, strokeColor: theme.carbon });
        els.B.setAttribute({ size: isHighlight('B') ? 8.5 : 4.5, fillColor: theme.carbon, strokeColor: theme.carbon });
        els.A.setAttribute({ size: isHighlight('A') ? 8.5 : 4.5, fillColor: theme.carbon, strokeColor: theme.carbon });

        // 7. Líneas del triángulo
        const isHighlightSegCA = isHighlight('segCA');
        const isHighlightSegBC = isHighlight('segBC');
        const isHighlightSegAB = isHighlight('segAB');
        const isHighlightPoly = isHighlight('poly');

        els.segCA.setAttribute({ strokeColor: theme.salvia, strokeWidth: isHighlightSegCA ? 4.5 : (activeStep ? 3.5 : 2) });
        els.segBC.setAttribute({ strokeColor: theme.terracota, strokeWidth: isHighlightSegBC ? 4.5 : (activeStep ? 3.5 : 2) });
        els.segAB.setAttribute({ strokeColor: theme.pizarra, strokeWidth: isHighlightSegAB ? 4.5 : (activeStep ? 3.5 : 2) });

        els.poly.setAttribute({ fillColor: theme.carbon, fillOpacity: isHighlightPoly ? 0.15 : 0.04 });

        const isHighlightRightAng = isHighlight('rightAng');
        els.rightAng.setAttribute({ fillOpacity: isHighlightRightAng ? 0.55 : 0.25, strokeWidth: isHighlightRightAng ? 2.5 : 1 });
      }}
    >
      <DiagramTitle>
        Relación geométrica de áreas
      </DiagramTitle>
    </MathBoard>
  );
};
