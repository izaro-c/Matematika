import { MathBoard } from '@/shared/diagrams/core/MathBoard';
import {
  createAngle,
  createGlider,
  createMidpoint,
  createPerpendicularLine,
  createPoint,
  createPolygon,
  createSegment,
} from '@/shared/diagrams/core/MathFactory';

export const DemoTrianguloIsosceles = () => {
  return (
    <MathBoard
      boundingbox={[-5, 6, 5, -3]}
      onInit={(board, els, theme) => {
        const B = createPoint(board, [-3, -2], {
          name: 'B', size: 5,
          fillColor: theme.carbon, strokeColor: theme.carbon, fixed: true,
          label: { fontSize: 18, cssClass: 'font-serif font-bold italic', strokeColor: theme.carbon }
        }, theme);
        const C = createPoint(board, [3, -2], {
          name: 'C', size: 5,
          fillColor: theme.carbon, strokeColor: theme.carbon, fixed: true,
          label: { fontSize: 18, cssClass: 'font-serif font-bold italic', strokeColor: theme.carbon }
        }, theme);
        const M = createMidpoint(board, [B, C], { visible: false }, theme);
        const perp = createPerpendicularLine(board, [B, C, M], { visible: false }, theme);

        const A = createGlider(board, [0, 4, perp], {
          name: 'A', size: 5,
          fillColor: theme.terracota, strokeColor: theme.terracota,
          label: { fontSize: 18, cssClass: 'font-serif font-bold italic', strokeColor: theme.terracota }
        }, theme);

        els.A = A;
        els.B = B;
        els.C = C;
        els.ladoAB = createSegment(board, [A, B], { strokeColor: theme.carbon, strokeWidth: 2 }, theme);
        els.ladoAC = createSegment(board, [A, C], { strokeColor: theme.carbon, strokeWidth: 2 }, theme);
        els.ladoBC = createSegment(board, [B, C], { strokeColor: theme.carbon, strokeWidth: 2 }, theme);

        els.polyABC = createPolygon(board, [A, B, C], {
          fillColor: theme.salvia, fillOpacity: 0.1,
          borders: { visible: false }, vertices: { visible: false }
        }, theme);

        const puntoD = createPoint(board, [() => M.X(), () => M.Y()], {
          name: 'D', size: 3,
          fillColor: theme.pizarra, strokeColor: theme.pizarra,
          label: { fontSize: 14, cssClass: 'font-serif italic', strokeColor: theme.pizarra },
          visible: false
        }, theme);
        els.puntoD = puntoD;
        els.bisectriz = createSegment(board, [A, puntoD], {
          dash: 2, strokeColor: theme.pizarra, strokeWidth: 1.5, visible: false
        }, theme);

        els.polyABD = createPolygon(board, [A, B, puntoD], {
          fillColor: theme.terracota, fillOpacity: 0.3,
          borders: { visible: false }, vertices: { visible: false }, visible: false
        }, theme);
        els.polyACD = createPolygon(board, [A, C, puntoD], {
          fillColor: theme.salvia, fillOpacity: 0.3,
          borders: { visible: false }, vertices: { visible: false }, visible: false
        }, theme);

        els.anguloBAD = createAngle(board, [puntoD, A, B], {
          name: '', radius: 0.8,
          fillColor: theme.terracota, strokeColor: theme.terracota, fillOpacity: 0.2, visible: false
        }, theme);
        els.anguloCAD = createAngle(board, [C, A, puntoD], {
          name: '', radius: 0.8,
          fillColor: theme.salvia, strokeColor: theme.salvia, fillOpacity: 0.2, visible: false
        }, theme);
        els.anguloB = createAngle(board, [C, B, A], {
          name: '\\beta', radius: 1,
          fillColor: theme.pizarra, strokeColor: theme.pizarra, fillOpacity: 0.2, visible: false
        }, theme);
        els.anguloC = createAngle(board, [A, C, B], {
          name: '\\gamma', radius: 1,
          fillColor: theme.pizarra, strokeColor: theme.pizarra, fillOpacity: 0.2, visible: false
        }, theme);
      }}
      onUpdate={(_board, els, theme, _isStep, isHL) => {
        const isTriangulo = isHL('triangulo-abc');
        const isLadoAB    = isHL('lado-ab');
        const isLadoAC    = isHL('lado-ac');
        const isLadoBC    = isHL('lado-bc');
        const isBisectriz = isHL('bisectriz');
        const isPuntoD    = isHL('punto-d');
        const isBAD       = isHL('angulo-bad');
        const isCAD       = isHL('angulo-cad');
        const isLadoAD    = isHL('lado-ad');
        const isTriIzq    = isHL('triangulo-izq');
        const isTriDer    = isHL('triangulo-der');
        const isAngB      = isHL('angulo-b');
        const isAngC      = isHL('angulo-c');

        const anyHL = isTriangulo || isLadoAB || isLadoAC || isLadoBC ||
          isBisectriz || isPuntoD || isBAD || isCAD || isLadoAD ||
          isTriIzq || isTriDer || isAngB || isAngC;

        els.polyABC.setAttribute({ fillOpacity: isTriangulo ? 0.35 : (anyHL ? 0.0 : 0.1) });

        els.ladoAB.setAttribute({ strokeColor: isLadoAB ? theme.terracota : theme.carbon, strokeWidth: isLadoAB ? 4 : 2 });
        els.ladoAC.setAttribute({ strokeColor: isLadoAC ? theme.terracota : theme.carbon, strokeWidth: isLadoAC ? 4 : 2 });
        els.ladoBC.setAttribute({ strokeColor: isLadoBC ? theme.terracota : theme.carbon, strokeWidth: isLadoBC ? 4 : 2 });

        const showBisectriz = isBisectriz || isLadoAD || isTriIzq || isTriDer || isBAD || isCAD || isPuntoD || isAngB;
        els.bisectriz.setAttribute({
          visible: showBisectriz,
          strokeColor: isLadoAD ? theme.terracota : theme.pizarra,
          strokeWidth: isLadoAD ? 3 : 1.5
        });
        els.puntoD.setAttribute({ visible: isPuntoD || showBisectriz });

        els.polyABD.setAttribute({ visible: isTriIzq });
        els.polyACD.setAttribute({ visible: isTriDer });

        els.anguloBAD.setAttribute({ visible: isBAD });
        els.anguloCAD.setAttribute({ visible: isCAD });
        els.anguloB.setAttribute({ visible: isAngB });
        els.anguloC.setAttribute({ visible: isAngC });
      }}
    />
  );
};
