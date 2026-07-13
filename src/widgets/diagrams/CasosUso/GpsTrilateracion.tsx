import { useState } from 'react';
import { useMathStore } from '@/app/providers/MathStoreContext';
import { MathBoard } from '@/shared/diagrams/core/MathBoard';
import { DiagramTitle, DiagramInfoPanel } from '@/shared/ui/DiagramOverlay';
import { createRobustRightAngle } from '@/shared/diagrams/core/MathUtils';
import {
  createPoint,
  createSegment,
  createCircle
} from '@/shared/diagrams/core/MathFactory';

/**
 * GpsTrilateracion — Simulación interactiva del caso de uso de geolocalización satelital.
 *
 * Muestra tres satélites fijos con sus señales de alcance (círculos) intersecando
 * en la posición de un receptor móvil arrastrable. Muestra los ejes cartesianos y
 * detalla dinámicamente el triángulo de Pitágoras asociado al Satélite 1.
 * Utiliza el componente estándar MathBoard, la factoría MathFactory, DiagramOverlay y utilidades geométricas.
 */
export const GpsTrilateracion = () => {
  // Coordenadas en tiempo real del receptor móvil para visualización reactiva del panel HTML
  const [pos, setPos] = useState({ x: 1.0, y: 3.0 });

  // Suscripción a hovers del MDX para resaltar elementos del diagrama
  const mathHighlight = useMathStore((state) => state.variables['highlight']);
  const isHighlight = (id: string) =>
    Array.isArray(mathHighlight) ? (mathHighlight as unknown as string[]).includes(id) : mathHighlight === id;

  return (
    <MathBoard
      boundingbox={[-8, 12, 10, -6]}
      axis={true}
      grid={false}
      onInit={(board, els, theme) => {
        // Opciones estéticas Arts & Crafts para los ejes por defecto de JSXGraph
        if (board.defaultAxes && board.defaultAxes.x && board.defaultAxes.y) {
          (board.defaultAxes.x as any).setAttribute({ strokeColor: theme.carbon, strokeOpacity: 0.25 });
          (board.defaultAxes.y as any).setAttribute({ strokeColor: theme.carbon, strokeOpacity: 0.25 });
        }

        // 1. Cuadrícula unitaria de Matematika
        els.gridLines = [];
        for (let x = -10; x <= 12; x++) {
          els.gridLines.push(board.create('line', [[x, -10], [x, 15]], {
            strokeColor: theme.carbon, strokeWidth: 0.5, strokeOpacity: 0.08, fixed: true, straightFirst: false, straightLast: false
          }));
        }
        for (let y = -10; y <= 15; y++) {
          els.gridLines.push(board.create('line', [[-10, y], [12, y]], {
            strokeColor: theme.carbon, strokeWidth: 0.5, strokeOpacity: 0.08, fixed: true, straightFirst: false, straightLast: false
          }));
        }

        // 2. Satélites (Puntos fijos con sus etiquetas correspondientes)
        els.S1 = createPoint(board, [2, 8], {
          name: 'S₁ (2, 8)', fillColor: theme.terracota, strokeColor: theme.terracota, fixed: true,
          label: { offset: [-15, 15], cssClass: 'font-sans font-bold text-[10px] uppercase tracking-wider', color: theme.terracota }
        }, theme);

        els.S2 = createPoint(board, [-4, 2], {
          name: 'S₂ (-4, 2)', fillColor: theme.ocre, strokeColor: theme.ocre, fixed: true,
          label: { offset: [-15, 15], cssClass: 'font-sans font-bold text-[10px] uppercase tracking-wider', color: theme.ocre }
        }, theme);

        els.S3 = createPoint(board, [6, -2], {
          name: 'S₃ (6, -2)', fillColor: theme.pizarra, strokeColor: theme.pizarra, fixed: true,
          label: { offset: [-15, -15], cssClass: 'font-sans font-bold text-[10px] uppercase tracking-wider', color: theme.pizarra }
        }, theme);

        // 3. Receptor móvil (Punto interactivo arrastrable)
        els.R = createPoint(board, [1, 3], {
          name: 'Receptor (R)', size: 6, fillColor: theme.carbon, strokeColor: theme.carbon,
          label: { offset: [15, 0], cssClass: 'font-serif italic font-bold text-xs', color: theme.carbon }
        }, theme);

        // 4. Distancias directas (Hipotenusas)
        els.rad1 = createSegment(board, [els.S1, els.R], { strokeColor: theme.terracota, strokeWidth: 1.5, dash: 2 }, theme);
        els.rad2 = createSegment(board, [els.S2, els.R], { strokeColor: theme.ocre, strokeWidth: 1.5, dash: 2 }, theme);
        els.rad3 = createSegment(board, [els.S3, els.R], { strokeColor: theme.pizarra, strokeWidth: 1.5, dash: 2 }, theme);

        // 5. Señales de alcance satelital (Circunferencias)
        els.circ1 = createCircle(board, [els.S1, els.R], { strokeColor: theme.terracota, strokeWidth: 1, strokeOpacity: 0.35 }, theme);
        els.circ2 = createCircle(board, [els.S2, els.R], { strokeColor: theme.ocre, strokeWidth: 1, strokeOpacity: 0.35 }, theme);
        els.circ3 = createCircle(board, [els.S3, els.R], { strokeColor: theme.pizarra, strokeWidth: 1, strokeOpacity: 0.35 }, theme);

        // 6. Proyecciones y triángulo rectángulo de Pitágoras para el Satélite 1
        els.P1 = createPoint(board, [() => els.R.X(), () => els.S1.Y()], { visible: false }, theme);
        els.catH1 = createSegment(board, [els.S1, els.P1], { strokeColor: theme.terracota, strokeWidth: 1, dash: 1, strokeOpacity: 0.15 }, theme);
        els.catV1 = createSegment(board, [els.P1, els.R], { strokeColor: theme.terracota, strokeWidth: 1, dash: 1, strokeOpacity: 0.15 }, theme);

        // Marcador de ángulo recto cuadrado robusto modular (§21 del skill de diagrama)
        els.ang1 = createRobustRightAngle(board, els.P1, els.S1, els.R, 0.35, {
          fillColor: theme.terracota, fillOpacity: 0.05,
          borders: { strokeColor: theme.terracota, strokeWidth: 1, strokeOpacity: 0.15 }
        }, theme);

        // Actualizar coordenadas en el estado de React al arrastrar el receptor R
        els.R.on('drag', () => {
          setPos({ x: els.R.X(), y: els.R.Y() });
        });
      }}
      onUpdate={(board: any, els: any, theme: any, isStep: any, isHL: any) => {
        void board; void theme; void isStep; void isHL;
        // Estados de hovers individuales estrictos
        const hoverS1 = isHighlight('s1');
        const hoverS2 = isHighlight('s2');
        const hoverS3 = isHighlight('s3');
        const hoverR = isHighlight('R');

        const hoverRad1 = isHighlight('rad1');
        const hoverRad2 = isHighlight('rad2');
        const hoverRad3 = isHighlight('rad3');

        const hoverCirc1 = isHighlight('circ1');
        const hoverCirc2 = isHighlight('circ2');
        const hoverCirc3 = isHighlight('circ3');

        const hoverTri1 = isHighlight('tri1');
        const hoverCatH1 = isHighlight('catH1');
        const hoverCatV1 = isHighlight('catV1');

        // 1. Resaltar Satélites y Receptor de forma individual
        els.S1.setAttribute({ size: hoverS1 ? 9 : 5 });
        els.S2.setAttribute({ size: hoverS2 ? 9 : 5 });
        els.S3.setAttribute({ size: hoverS3 ? 9 : 5 });
        els.R.setAttribute({ size: hoverR ? 10 : 6 });

        // 2. Resaltar Radios (Hipotenusas) de forma individual
        els.rad1.setAttribute({ strokeWidth: hoverRad1 ? 3.5 : 1.5, dash: hoverRad1 ? 0 : 2 });
        els.rad2.setAttribute({ strokeWidth: hoverRad2 ? 3.5 : 1.5, dash: hoverRad2 ? 0 : 2 });
        els.rad3.setAttribute({ strokeWidth: hoverRad3 ? 3.5 : 1.5, dash: hoverRad3 ? 0 : 2 });

        // 3. Resaltar Circunferencias de alcance de forma individual
        els.circ1.setAttribute({ strokeWidth: hoverCirc1 ? 2.5 : 1.0, strokeOpacity: hoverCirc1 ? 0.85 : 0.35 });
        els.circ2.setAttribute({ strokeWidth: hoverCirc2 ? 2.5 : 1.0, strokeOpacity: hoverCirc2 ? 0.85 : 0.35 });
        els.circ3.setAttribute({ strokeWidth: hoverCirc3 ? 2.5 : 1.0, strokeOpacity: hoverCirc3 ? 0.85 : 0.35 });

        // 4. Resaltar Triángulo y Proyecciones del Satélite 1 de forma individual
        const showTriHighlight = hoverTri1 || hoverCatH1 || hoverCatV1;
        els.catH1.setAttribute({
          strokeWidth: hoverCatH1 ? 3.0 : (showTriHighlight ? 2.0 : 1.0),
          strokeOpacity: showTriHighlight ? 0.95 : 0.15,
          dash: hoverCatH1 ? 0 : 1
        });
        els.catV1.setAttribute({
          strokeWidth: hoverCatV1 ? 3.0 : (showTriHighlight ? 2.0 : 1.0),
          strokeOpacity: showTriHighlight ? 0.95 : 0.15,
          dash: hoverCatV1 ? 0 : 1
        });
        els.ang1.setAttribute({
          fillOpacity: showTriHighlight ? 0.55 : 0.05
        });
        els.ang1.borders.forEach((b: any) => {
          b.setAttribute({
            strokeOpacity: showTriHighlight ? 0.95 : 0.15,
            strokeWidth: showTriHighlight ? 1.5 : 1.0
          });
        });
      }}
    >
      <DiagramTitle>
        Trilateración satelital (GPS 2D)
      </DiagramTitle>

      <DiagramInfoPanel title="Ecuaciones de Pitágoras" position="bottom-right">
        <div className="space-y-1.5 font-mono">
          <div className="flex justify-between gap-4">
            <span>d₁² = (x - 2)² + (y - 8)²</span>
            <span className="font-bold text-terracota">{(Math.pow(pos.x - 2, 2) + Math.pow(pos.y - 8, 2)).toFixed(2)}</span>
          </div>
          <div className="flex justify-between gap-4">
            <span>d₂² = (x + 4)² + (y - 2)²</span>
            <span className="font-bold text-ocre">{(Math.pow(pos.x + 4, 2) + Math.pow(pos.y - 2, 2)).toFixed(2)}</span>
          </div>
          <div className="flex justify-between gap-4">
            <span>d₃² = (x - 6)² + (y + 2)²</span>
            <span className="font-bold text-pavo">{(Math.pow(pos.x - 6, 2) + Math.pow(pos.y + 2, 2)).toFixed(2)}</span>
          </div>
        </div>
        <div className="font-sans text-[8px] text-carbon/40 dark:text-lienzo/30 mt-3 pt-1 border-t border-carbon/10 dark:border-lienzo/10 flex justify-between">
          <span>Receptor R:</span>
          <span>({pos.x.toFixed(2)}, {pos.y.toFixed(2)})</span>
        </div>
      </DiagramInfoPanel>
    </MathBoard>
  );
};
