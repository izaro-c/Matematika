import { MathBoard } from '@/shared/diagrams/core/MathBoard';
import {
  createPoint, createLine, createCircle, createPolygon, createAngle
} from '@/shared/diagrams/core/MathFactory';






export const Triangulo = () => {










  const onInit = (board: any, els: any, theme: any) => {
      void board; void els; void theme;
      const pA = createPoint(board, [-2, -2], {
      name: 'A',
      size: 5,
      fillColor: theme.terracota,
      strokeColor: theme.terracota,
      showInfobox: false,
      fixed: false,
    }, theme);

    const pB = createPoint(board, [3, -1], {
      name: 'B',
      size: 5,
      fillColor: theme.terracota,
      strokeColor: theme.terracota,
      showInfobox: false,
      fixed: false,
    }, theme);

    // Attractors for C
    const midAB = board.create('midpoint', [pA, pB], { visible: false });
    const bisectorAB = board.create('perpendicular', [createLine(board, [pA, pB], {visible:false}, theme), midAB], { visible: false });
    const thalesAB = createCircle(board, [midAB, pA], { visible: false }, theme);
    const circleA = createCircle(board, [pA, pB], { visible: false }, theme);
    const circleB = createCircle(board, [pB, pA], { visible: false }, theme);

    const pC = createPoint(board, [0, 3], {
      name: 'C',
      size: 5,
      fillColor: theme.terracota,
      strokeColor: theme.terracota,
      showInfobox: false,
      fixed: false,
      attractors: [bisectorAB, thalesAB, circleA, circleB],
      attractorDistance: 0.2,
      snatchDistance: 0.4,
    }, theme);

    const poly = createPolygon(board, [pA, pB, pC], {
      fillColor: theme.salvia,
      fillOpacity: 0.15,
      borders: { strokeColor: theme.salvia, strokeWidth: 2 },
      vertices: { visible: false }
    }, theme);

    const ladoAB = (poly as any).borders[0];
    const ladoBC = (poly as any).borders[1];
    const ladoCA = (poly as any).borders[2];

    const hatchAB = board.create('hatch', [ladoAB, 2], { visible: false, strokeWidth: 2, strokeColor: theme.carbon });
    const hatchBC = board.create('hatch', [ladoBC, 2], { visible: false, strokeWidth: 2, strokeColor: theme.carbon });
    const hatchCA = board.create('hatch', [ladoCA, 2], { visible: false, strokeWidth: 2, strokeColor: theme.carbon });

    const angleA = createAngle(board, [pB, pA, pC], { visible: false, radius: 0.8 }, theme);
    const angleB = createAngle(board, [pC, pB, pA], { visible: false, radius: 0.8 }, theme);
    const angleC = createAngle(board, [pA, pC, pB], { visible: false, radius: 0.8 }, theme);

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
          if (Math.abs(vA - pi2) < 0.05) angleA.setAttribute({ visible: true, type: 'sectordot', fillColor: theme.ocre, strokeColor: theme.ocre });
          if (Math.abs(vB - pi2) < 0.05) angleB.setAttribute({ visible: true, type: 'sectordot', fillColor: theme.ocre, strokeColor: theme.ocre });
          if (Math.abs(vC - pi2) < 0.05) angleC.setAttribute({ visible: true, type: 'sectordot', fillColor: theme.ocre, strokeColor: theme.ocre });
        } else if (maxAng > pi2) {
          classAngulos = "Obtusángulo";
          if (vA > pi2) angleA.setAttribute({ visible: true, fillColor: theme.granada, strokeColor: theme.granada });
          if (vB > pi2) angleB.setAttribute({ visible: true, fillColor: theme.granada, strokeColor: theme.granada });
          if (vC > pi2) angleC.setAttribute({ visible: true, fillColor: theme.granada, strokeColor: theme.granada });
        }

        const maxAngDeg = Math.round(maxAng * 180 / Math.PI);
        const piFrac = (maxAng / Math.PI).toFixed(2);
        const piStr = classAngulos === "Rectángulo" ? "&pi;/2" : `${piFrac}&pi;`;

        return `<div style="font-family: var(--font-serif); color: ${theme.carbon};">
          <strong style="font-size: 1.2rem;">Triángulo ${classLados}</strong><br/>
          <i>${classAngulos}</i><br/>
          Ángulo mayor: ${maxAngDeg}&deg; (${piStr} rad)
        </div>`;
      }
    ], { fixed: true, anchorX: 'left', anchorY: 'top' });

      // Registrar elementos para interactividad y auditoría
      els.pA = pA;
        els.pB = pB;
        els.pC = pC;
        els.poly = poly;
        els.ladoAB = ladoAB;
        els.ladoBC = ladoBC;
        els.ladoCA = ladoCA;
        els.angleA = angleA;
        els.angleB = angleB;
        els.angleC = angleC;
        els.hatchAB = hatchAB;
        els.hatchBC = hatchBC;
        els.hatchCA = hatchCA;
        els.infoText = infoText;
    };;

  const onUpdate = (board: any, els: any, theme: any, isStep: any, isHL: any) => {
      const isHighlight = isHL;
      void board; void els; void theme; void isStep; void isHL; void isHighlight;
      const { pA, pB, pC, poly, ladoAB, ladoBC, ladoCA } = els;
      pA.setAttribute({ size: 5, fillColor: theme.terracota, strokeColor: theme.terracota });
    pB.setAttribute({ size: 5, fillColor: theme.terracota, strokeColor: theme.terracota });
    pC.setAttribute({ size: 5, fillColor: theme.terracota, strokeColor: theme.terracota });

    poly.setAttribute({ fillOpacity: 0.15 });

    if (isHighlight('vertice-a')) {
      pA.setAttribute({ size: 8, fillColor: theme.ocre, strokeColor: theme.ocre });
    }
    if (isHighlight('vertice-b')) {
      pB.setAttribute({ size: 8, fillColor: theme.ocre, strokeColor: theme.ocre });
    }
    if (isHighlight('vertice-c')) {
      pC.setAttribute({ size: 8, fillColor: theme.ocre, strokeColor: theme.ocre });
    }
    if (isHighlight('lado-ab')) {
      ladoAB.setAttribute({ strokeWidth: 5, strokeColor: theme.ocre });
    }
    if (isHighlight('lado-bc')) {
      ladoBC.setAttribute({ strokeWidth: 5, strokeColor: theme.ocre });
    }
    if (isHighlight('lado-ca')) {
      ladoCA.setAttribute({ strokeWidth: 5, strokeColor: theme.ocre });
    }
    if (isHighlight('triangulo')) {
      poly.setAttribute({ fillOpacity: 0.4 });
    }
    };;

  return (
    <MathBoard
      boundingbox={[-4, 4, 4, -4]}
      axis={false}
      grid={false}
      onInit={onInit}
      onUpdate={onUpdate}
    >
      <div className="absolute top-2 left-3 z-10 text-xs font-serif italic text-pizarra/50">
        Arrastra el vértice <span className="font-bold not-italic text-terracota">C</span> para encajar en triángulos notables
      </div>
    </MathBoard>
  );
};
