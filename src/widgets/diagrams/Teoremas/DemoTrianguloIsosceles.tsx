import { MathBoard } from '@/features/graph/ui/MathBoard';

export const DemoTrianguloIsosceles = () => {
  return (
    <MathBoard
      boundingbox={[-5, 6, 5, -3]}
      onInit={(board, els, theme) => {
        const B = board.create('point', [-3, -2], {
          name: 'B', size: 5,
          fillColor: theme.carbon, strokeColor: theme.carbon, fixed: true,
          label: { fontSize: 18, cssClass: 'font-serif font-bold italic', strokeColor: theme.carbon }
        });
        const C = board.create('point', [3, -2], {
          name: 'C', size: 5,
          fillColor: theme.carbon, strokeColor: theme.carbon, fixed: true,
          label: { fontSize: 18, cssClass: 'font-serif font-bold italic', strokeColor: theme.carbon }
        });
        const M = board.create('midpoint', [B, C], { visible: false });
        const baseBC = board.create('line', [B, C], { visible: false });
        const perp = board.create('perpendicular', [baseBC, M], { visible: false });

        const A = board.create('glider', [0, 4, perp], {
          name: 'A', size: 5,
          fillColor: theme.terracota, strokeColor: theme.terracota,
          label: { fontSize: 18, cssClass: 'font-serif font-bold italic', strokeColor: theme.terracota }
        });

        els.ladoAB = board.create('segment', [A, B], { strokeColor: theme.carbon, strokeWidth: 2 });
        els.ladoAC = board.create('segment', [A, C], { strokeColor: theme.carbon, strokeWidth: 2 });
        els.ladoBC = board.create('segment', [B, C], { strokeColor: theme.carbon, strokeWidth: 2 });

        els.polyABC = board.create('polygon', [A, B, C], {
          fillColor: theme.salvia, fillOpacity: 0.1,
          borders: { visible: false }, vertices: { visible: false }
        });

        const puntoD = board.create('point', [() => M.X(), () => M.Y()], {
          name: 'D', size: 3,
          fillColor: theme.pizarra, strokeColor: theme.pizarra,
          label: { fontSize: 14, cssClass: 'font-serif italic', strokeColor: theme.pizarra },
          visible: false
        });
        els.puntoD = puntoD;
        els.bisectriz = board.create('segment', [A, puntoD], {
          dash: 2, strokeColor: theme.pizarra, strokeWidth: 1.5, visible: false
        });

        els.polyABD = board.create('polygon', [A, B, puntoD], {
          fillColor: theme.terracota, fillOpacity: 0.3,
          borders: { visible: false }, vertices: { visible: false }, visible: false
        });
        els.polyACD = board.create('polygon', [A, C, puntoD], {
          fillColor: theme.salvia, fillOpacity: 0.3,
          borders: { visible: false }, vertices: { visible: false }, visible: false
        });

        els.anguloBAD = board.create('angle', [puntoD, A, B], {
          name: '', radius: 0.8,
          fillColor: theme.terracota, strokeColor: theme.terracota, fillOpacity: 0.2, visible: false
        });
        els.anguloCAD = board.create('angle', [C, A, puntoD], {
          name: '', radius: 0.8,
          fillColor: theme.salvia, strokeColor: theme.salvia, fillOpacity: 0.2, visible: false
        });
        els.anguloB = board.create('angle', [C, B, A], {
          name: '\\beta', radius: 1,
          fillColor: theme.pizarra, strokeColor: theme.pizarra, fillOpacity: 0.2, visible: false
        });
        els.anguloC = board.create('angle', [A, C, B], {
          name: '\\gamma', radius: 1,
          fillColor: theme.pizarra, strokeColor: theme.pizarra, fillOpacity: 0.2, visible: false
        });
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
