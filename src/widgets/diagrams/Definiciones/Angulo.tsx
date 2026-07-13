import { MathBoard } from '@/shared/diagrams/core/MathBoard';
import {
  createPoint, createLine, createSegment, createAngle
} from '@/shared/diagrams/core/MathFactory';







export const Angulo = () => {










  const onInit = (board: any, els: any, theme: any) => {
      void board; void els; void theme;
      const pO = createPoint(board, [0, 0], {
      name: 'O',
      size: 6,
      fillColor: theme.pizarra,
      strokeColor: theme.pizarra,
      showInfobox: false,
      fixed: true,
    }, theme);

    const pA = createPoint(board, [2.5, 0.8], {
      name: 'A',
      size: 6,
      fillColor: theme.terracota,
      strokeColor: theme.terracota,
      showInfobox: false,
      fixed: false,
    }, theme);

    const lHoriz = createLine(board, [pO, pA], { visible: false }, theme);
    const lPerp = board.create('perpendicular', [lHoriz, pO], { visible: false });

    const pB = createPoint(board, [-1, 2], {
      name: 'B',
      size: 6,
      fillColor: theme.terracota,
      strokeColor: theme.terracota,
      showInfobox: false,
      fixed: false,
      attractors: [lHoriz, lPerp],
      attractorDistance: 0.3,
      snatchDistance: 0.5,
    }, theme);

    const farA = board.create('point', [
      function () { return pO.X() + 20 * (pA.X() - pO.X()); },
      function () { return pO.Y() + 20 * (pA.Y() - pO.Y()); },
    ], { visible: false, fixed: true });

    const farB = board.create('point', [
      function () { return pO.X() + 20 * (pB.X() - pO.X()); },
      function () { return pO.Y() + 20 * (pB.Y() - pO.Y()); },
    ], { visible: false, fixed: true });

    const rayOA = createSegment(board, [pO, farA], {
      strokeColor: theme.carbon,
      strokeWidth: 2,
      lastArrow: { type: 2 },
    }, theme);

    const rayOB = createSegment(board, [pO, farB], {
      strokeColor: theme.carbon,
      strokeWidth: 2,
      lastArrow: { type: 2 },
    }, theme);

    const arc = createAngle(board, [pB, pO, pA], {
      radius: 1.2,
      fillColor: theme.salvia,
      fillOpacity: 0.25,
      strokeColor: theme.carbon,
      strokeWidth: 1.5,
      name: '',
      withLabel: false,
    }, theme);

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

        return `<div style="font-family: var(--font-serif); color: ${theme.carbon};">
          <strong style="font-size: 1.2rem;">Ángulo ${name}</strong><br/>
          Medida: ${deg}&deg; <br/>
          Radianes: ${piStr} rad
        </div>`;
      }
    ], { fixed: true, anchorX: 'left', anchorY: 'top' });

      // Registrar elementos para interactividad y auditoría
      els.pO = pO;
        els.pA = pA;
        els.pB = pB;
        els.rayOA = rayOA;
        els.rayOB = rayOB;
        els.arc = arc;
        els.infoText = infoText;
    };;

  const onUpdate = (board: any, els: any, theme: any, isStep: any, isHL: any) => {
      const isHighlight = isHL;
      void board; void els; void theme; void isStep; void isHL; void isHighlight;
      const { pO, pA, pB, rayOA, rayOB, arc } = els;
      pO.setAttribute({ size: 6, fillColor: theme.pizarra, strokeColor: theme.pizarra });
    pA.setAttribute({ size: 6, fillColor: theme.terracota, strokeColor: theme.terracota });
    pB.setAttribute({ size: 6, fillColor: theme.terracota, strokeColor: theme.terracota });
    rayOA.setAttribute({ strokeColor: theme.carbon, strokeWidth: 2 });
    rayOB.setAttribute({ strokeColor: theme.carbon, strokeWidth: 2 });
    arc.setAttribute({ fillColor: theme.salvia, fillOpacity: 0.25, strokeColor: theme.carbon, strokeWidth: 1.5 });

    if (isHighlight('pO')) {
      pO.setAttribute({ size: 10, fillColor: theme.ocre, strokeColor: theme.ocre });
    }
    if (isHighlight('pA')) {
      pA.setAttribute({ size: 10, fillColor: theme.ocre, strokeColor: theme.ocre });
    }
    if (isHighlight('pB')) {
      pB.setAttribute({ size: 10, fillColor: theme.ocre, strokeColor: theme.ocre });
    }
    if (isHighlight('rayOA')) {
      rayOA.setAttribute({ strokeColor: theme.terracota, strokeWidth: 4 });
    }
    if (isHighlight('rayOB')) {
      rayOB.setAttribute({ strokeColor: theme.terracota, strokeWidth: 4 });
    }
    if (isHighlight('angleArc')) {
      arc.setAttribute({ fillColor: theme.terracota, fillOpacity: 0.4, strokeColor: theme.terracota });
    }
    };;

  return (
    <MathBoard
      boundingbox={[-4, 4, 4, -3]}
      axis={false}
      grid={false}
      onInit={onInit}
      onUpdate={onUpdate}
    >
      <div className="absolute top-2 left-3 z-10 text-xs font-serif italic text-pizarra/50">
        Arrastra los puntos <span className="font-bold not-italic text-terracota">A</span>, <span className="font-bold not-italic text-terracota">B</span>
      </div>
    </MathBoard>
  );
};
