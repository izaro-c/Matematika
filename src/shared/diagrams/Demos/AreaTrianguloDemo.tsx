import { MathBoard } from '@/features/graph/ui/MathBoard';
import {
  createPoint, createSegment, createPolygon, createGlider,
  createRightAngle
} from '@/features/graph/ui/MathFactory';

export const AreaTrianguloDemo = () => {
  return (
    <MathBoard
      boundingbox={[-3.5, 3.5, 3.5, -1]}
      onInit={(board, els, theme) => {
        // Vértices del triángulo (arrastrables)
        els.A = createPoint(board, [-2.2, 0], { name: 'A' }, theme);
        els.B = createPoint(board, [2.2, 0], { name: 'B' }, theme);
        els.C = createPoint(board, [0.3, 2.5], { name: 'C' }, theme);

        // Segmento AB (base)
        els.segAB = createSegment(board, [els.A, els.B], {
          strokeColor: theme.terracota, strokeWidth: 3, dash: 2,
          name: 'b', label: { fontSize: 14, offset: [0, -20], strokeColor: theme.terracota }
        }, theme);

        // Recta AB para el glider
        els.lineAB = board.create('line', [els.A, els.B], { visible: false });

        // Pie D — glider sobre la recta AB
        els.D = createGlider(board, [
          () => els.C.X(),
          () => 0,
          els.lineAB
        ], { name: 'D', fillColor: theme.pizarra, strokeColor: theme.pizarra,
          label: { strokeColor: theme.pizarra }
        }, theme);

        // Segmento CD (altura, perpendicular desde C)
        els.segCD = createSegment(board, [els.C, els.D], {
          strokeColor: theme.pizarra, strokeWidth: 3, dash: 3,
          name: 'h', label: { fontSize: 14, offset: [12, 0], strokeColor: theme.pizarra }
        }, theme);

        // Marca de ángulo recto en D
        els.recto = createRightAngle(board, [els.C, els.D, els.A], {
          fillColor: theme.pizarra, strokeColor: theme.pizarra
        }, theme);

        // Lados del triángulo
        els.segAC = createSegment(board, [els.A, els.C], {
          strokeColor: theme.terracota, strokeWidth: 2
        }, theme);
        els.segBC = createSegment(board, [els.B, els.C], {
          strokeColor: theme.terracota, strokeWidth: 2
        }, theme);

        // Triángulo ABC
        els.polyABC = createPolygon(board, [els.A, els.B, els.C], {
          fillColor: theme.terracota, fillOpacity: 0.06,
          borders: { strokeColor: theme.terracota, strokeWidth: 2.5 }
        }, theme);

        // Segmentos AD y DB
        els.segAD = createSegment(board, [els.A, els.D], {
          strokeColor: theme.salvia, strokeWidth: 2.5
        }, theme);
        els.segDB = createSegment(board, [els.D, els.B], {
          strokeColor: theme.pizarra, strokeWidth: 2.5
        }, theme);

        // Triángulo izquierdo ADC
        els.polyADC = createPolygon(board, [els.A, els.D, els.C], {
          fillColor: theme.salvia, fillOpacity: 0,
          borders: { strokeOpacity: 0 }
        }, theme);

        // Triángulo derecho BDC
        els.polyBDC = createPolygon(board, [els.B, els.D, els.C], {
          fillColor: theme.pizarra, fillOpacity: 0,
          borders: { strokeOpacity: 0 }
        }, theme);

        // Rectángulo izquierdo auxiliar (puntos E)
        els.E = board.create('point', [
          () => els.A.X(),
          () => els.C.Y()
        ], { name: 'E', size: 3, fillColor: theme.salvia, strokeColor: theme.salvia,
          label: { strokeColor: theme.salvia, fontSize: 14 }
        });
        els.segAE = createSegment(board, [els.A, els.E], {
          strokeColor: theme.salvia, strokeWidth: 1, dash: 1
        }, theme);
        els.segCE = createSegment(board, [els.C, els.E], {
          strokeColor: theme.salvia, strokeWidth: 1, dash: 1
        }, theme);
        els.polyADCE = createPolygon(board, [els.A, els.D, els.C, els.E], {
          fillColor: theme.salvia, fillOpacity: 0,
          borders: { strokeOpacity: 0 }
        }, theme);

        // Rectángulo derecho auxiliar (punto F)
        els.F = board.create('point', [
          () => els.B.X(),
          () => els.C.Y()
        ], { name: 'F', size: 3, fillColor: theme.pizarra, strokeColor: theme.pizarra,
          label: { strokeColor: theme.pizarra, fontSize: 14 }
        });
        els.segBF = createSegment(board, [els.B, els.F], {
          strokeColor: theme.pizarra, strokeWidth: 1, dash: 1
        }, theme);
        els.segCF = createSegment(board, [els.C, els.F], {
          strokeColor: theme.pizarra, strokeWidth: 1, dash: 1
        }, theme);
        els.polyBDCF = createPolygon(board, [els.B, els.D, els.C, els.F], {
          fillColor: theme.pizarra, fillOpacity: 0,
          borders: { strokeOpacity: 0 }
        }, theme);
      }}
      onUpdate={(_board, els, theme, isStep, isHL) => {
        const s1 = isStep('step1');
        const s2 = isStep('step2');
        const s3 = isStep('step3');
        const s4 = isStep('step4');
        const s5 = isStep('step5');

        const hlTri = isHL('triangulo-abc');
        const hlBase = isHL('base-ab');
        const hlAltura = isHL('altura-cd');
        const hlIzq = isHL('triangulo-izq');
        const hlDer = isHL('triangulo-der');
        const hlPuntoC = isHL('punto-c');
        const hlPuntoD = isHL('punto-d');
        const hlRectI = isHL('rectangulo-izq');
        const hlRectD = isHL('rectangulo-der');
        const anyHL = hlTri || hlBase || hlAltura || hlIzq || hlDer || hlPuntoC || hlPuntoD || hlRectI || hlRectD;

        const getOp = (hovered: boolean, active: boolean, base = 0.25) => {
          if (hovered) return 1;
          if (anyHL) return base * 0.6;
          return active ? 1 : base;
        };
        const getW = (hovered: boolean, w1: number, w2: number) => hovered ? w2 : w1;
        const getC = (hovered: boolean, c1: string, c2 = theme.terracota) => hovered ? c2 : c1;

        const step123 = s1 || s2 || s3;
        const step124 = s1 || s2 || s4;
        const step345 = s3 || s4 || s5;
        // Triángulo principal
        els.polyABC.setAttribute({
          fillOpacity: hlTri ? 0.45 : (anyHL ? 0.04 : 0.1),
          borders: {
            strokeColor: hlTri ? theme.terracota : theme.terracota,
            strokeWidth: hlTri ? 4.5 : 2.5
          }
        });

        // Base AB — resalta en pasos 3-5 y al hacer hover
        els.segAB.setAttribute({
          strokeOpacity: getOp(hlBase, step345),
          strokeWidth: getW(hlBase, 3, 7),
          strokeColor: getC(hlBase, theme.terracota)
        });

        // Altura CD
        els.segCD.setAttribute({
          strokeOpacity: getOp(hlAltura, true),
          strokeWidth: getW(hlAltura, 3, 6),
          strokeColor: getC(hlAltura, theme.pizarra, theme.terracota)
        });
        els.recto.setAttribute({
          fillOpacity: getOp(hlAltura, true, 0.4),
          strokeOpacity: getOp(hlAltura, true, 0.4)
        });

        // Punto C
        els.C.setAttribute({
          fillOpacity: getOp(hlPuntoC, true),
          strokeOpacity: getOp(hlPuntoC, true),
          size: hlPuntoC ? 7 : 5,
          fillColor: hlPuntoC ? theme.terracota : theme.carbon,
          strokeColor: hlPuntoC ? theme.terracota : theme.carbon
        });
        if (els.C.label) els.C.label.setAttribute({
          strokeColor: hlPuntoC ? theme.terracota : theme.carbon
        });

        // Punto D — responde a altura-cd y a punto-d
        const hlD = hlAltura || hlPuntoD;
        els.D.setAttribute({
          fillOpacity: getOp(hlD, true),
          strokeOpacity: getOp(hlD, true),
          size: hlD ? 7 : 4,
          fillColor: hlD ? theme.terracota : theme.pizarra,
          strokeColor: hlD ? theme.terracota : theme.pizarra
        });
        if (els.D.label) els.D.label.setAttribute({
          strokeColor: hlD ? theme.terracota : theme.pizarra
        });

        // Triángulo izquierdo ADC
        els.polyADC.setAttribute({
          fillOpacity: hlIzq ? 0.5 : (anyHL ? 0.03 : (step123 ? 0.22 : 0.03)),
          borders: {
            strokeOpacity: hlIzq ? 1 : (step123 ? 0.6 : 0),
            strokeColor: theme.salvia,
            strokeWidth: hlIzq ? 3 : 1.5
          }
        });
        els.segAD.setAttribute({
          strokeOpacity: anyHL ? 0.15 : (step123 ? 1 : 0.2),
          strokeWidth: 2.5,
          strokeColor: theme.salvia
        });

        // Triángulo derecho BDC
        els.polyBDC.setAttribute({
          fillOpacity: hlDer ? 0.5 : (anyHL ? 0.03 : (step124 ? 0.22 : 0.03)),
          borders: {
            strokeOpacity: hlDer ? 1 : (step124 ? 0.6 : 0),
            strokeColor: theme.pizarra,
            strokeWidth: hlDer ? 3 : 1.5
          }
        });
        els.segDB.setAttribute({
          strokeOpacity: anyHL ? 0.15 : (step124 ? 1 : 0.2),
          strokeWidth: 2.5,
          strokeColor: theme.pizarra
        });

        // Rectángulo izquierdo (paso 3) — responde a paso y a hover
        const showRectI = s3 || hlRectI;
        els.polyADCE.setAttribute({
          visible: showRectI,
          fillOpacity: hlRectI ? 0.45 : (s3 ? 0.2 : 0),
          borders: { strokeOpacity: hlRectI ? 0.8 : (s3 ? 0.4 : 0), strokeColor: theme.salvia, strokeWidth: hlRectI ? 2.5 : 1.5 }
        });
        els.E.setAttribute({ visible: showRectI, fillOpacity: hlRectI ? 0.7 : (s3 ? 0.5 : 0), strokeOpacity: hlRectI ? 0.8 : (s3 ? 0.5 : 0) });
        if (els.E.label) els.E.label.setAttribute({ visible: showRectI, strokeColor: hlRectI ? theme.terracota : theme.salvia });
        els.segAE.setAttribute({ visible: showRectI, strokeOpacity: hlRectI ? 0.9 : (s3 ? 0.6 : 0), strokeWidth: hlRectI ? 3 : (s3 ? 2 : 1) });
        els.segCE.setAttribute({ visible: showRectI, strokeOpacity: hlRectI ? 0.9 : (s3 ? 0.6 : 0), strokeWidth: hlRectI ? 3 : (s3 ? 2 : 1) });

        // Rectángulo derecho (paso 4)
        const showRectD = s4 || hlRectD;
        els.polyBDCF.setAttribute({
          visible: showRectD,
          fillOpacity: hlRectD ? 0.45 : (s4 ? 0.2 : 0),
          borders: { strokeOpacity: hlRectD ? 0.8 : (s4 ? 0.4 : 0), strokeColor: theme.pizarra, strokeWidth: hlRectD ? 2.5 : 1.5 }
        });
        els.F.setAttribute({ visible: showRectD, fillOpacity: hlRectD ? 0.7 : (s4 ? 0.5 : 0), strokeOpacity: hlRectD ? 0.8 : (s4 ? 0.5 : 0) });
        if (els.F.label) els.F.label.setAttribute({ visible: showRectD, strokeColor: hlRectD ? theme.terracota : theme.pizarra });
        els.segBF.setAttribute({ visible: showRectD, strokeOpacity: hlRectD ? 0.9 : (s4 ? 0.6 : 0), strokeWidth: hlRectD ? 3 : (s4 ? 2 : 1) });
        els.segCF.setAttribute({ visible: showRectD, strokeOpacity: hlRectD ? 0.9 : (s4 ? 0.6 : 0), strokeWidth: hlRectD ? 3 : (s4 ? 2 : 1) });

        // Lados del triángulo — siempre visibles, ligeramente atenuados cuando hay hover
        els.segAC.setAttribute({ strokeOpacity: anyHL ? 0.5 : 0.8 });
        els.segBC.setAttribute({ strokeOpacity: anyHL ? 0.5 : 0.8 });
      }}
    />
  );
};
