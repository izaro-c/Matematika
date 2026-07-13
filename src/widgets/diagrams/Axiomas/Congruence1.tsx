import { MathBoard } from '@/shared/diagrams/core/MathBoard';
import {
  createCircle,
  createPoint,
  createRay,
  createSegment,
} from '@/shared/diagrams/core/MathFactory';

export const Congruence1 = () => {
  const onInit = (board: any, els: any, theme: any) => {
    const pA = createPoint(board, [-3, 3], {
      name: 'A',
      size: 4,
      fillColor: theme.terracota,
      strokeColor: theme.terracota,
      label: { offset: [-15, 15] },
    }, theme);
    const pB = createPoint(board, [0, 4], {
      name: 'B',
      size: 4,
      fillColor: theme.terracota,
      strokeColor: theme.terracota,
      label: { offset: [15, 15] },
    }, theme);
    const segAB = createSegment(board, [pA, pB], {
      strokeColor: theme.terracota,
      strokeWidth: 3,
    }, theme);

    const pC = createPoint(board, [-2, -2], {
      name: 'C',
      size: 4,
      fillColor: theme.salvia,
      strokeColor: theme.salvia,
      label: { offset: [-15, -15] },
    }, theme);
    const pDir = createPoint(board, [2, -1], {
      name: '',
      size: 3,
      fillColor: theme.pizarra,
      strokeColor: theme.pizarra,
      showInfobox: false,
    }, theme);
    const rayR = createRay(board, [pC, pDir], {
      strokeColor: theme.pizarra,
      strokeWidth: 2,
      dash: 2,
    }, theme);
    const circle = createCircle(board, [pC, () => pA.Dist(pB)], {
      strokeWidth: 1,
      strokeColor: theme.carbon,
      opacity: 0.2,
      dash: 1,
    }, theme);
    const pD = createPoint(board, [
      () => {
        const distance = pA.Dist(pB);
        const dx = pDir.X() - pC.X();
        const dy = pDir.Y() - pC.Y();
        const norm = Math.hypot(dx, dy) || 1;
        return pC.X() + (dx / norm) * distance;
      },
      () => {
        const distance = pA.Dist(pB);
        const dx = pDir.X() - pC.X();
        const dy = pDir.Y() - pC.Y();
        const norm = Math.hypot(dx, dy) || 1;
        return pC.Y() + (dy / norm) * distance;
      },
    ], {
      name: 'D',
      size: 5,
      fillColor: theme.salvia,
      strokeColor: theme.salvia,
      label: { offset: [15, -15] },
    }, theme);
    const segCD = createSegment(board, [pC, pD], {
      strokeColor: theme.salvia,
      strokeWidth: 3,
    }, theme);

    els.pA = pA;
    els.pB = pB;
    els.pC = pC;
    els.pDir = pDir;
    els.pD = pD;
    els.segAB = segAB;
    els.rayR = rayR;
    els.segCD = segCD;
    els.circle = circle;
  };

  const onUpdate = (_board: any, els: any, _theme: any, _isStep: any, isHL: any) => {
    els.segAB.setAttribute({ strokeWidth: 3, opacity: 1 });
    els.segCD.setAttribute({ strokeWidth: 3, opacity: 1 });
    els.rayR.setAttribute({ opacity: 1, strokeWidth: 2 });
    els.circle.setAttribute({ opacity: 0.2, strokeWidth: 1 });
    els.pD.setAttribute({ size: 5 });
    els.pA.setAttribute({ size: 4 });
    els.pB.setAttribute({ size: 4 });
    els.pC.setAttribute({ size: 4 });

    if (isHL('segmento-ab')) {
      els.segAB.setAttribute({ strokeWidth: 6 });
      els.pA.setAttribute({ size: 6 });
      els.pB.setAttribute({ size: 6 });
    }
    if (isHL('rayo-r')) {
      els.rayR.setAttribute({ strokeWidth: 4 });
      els.pC.setAttribute({ size: 6 });
    }
    if (isHL('punto-d')) els.pD.setAttribute({ size: 8 });
    if (isHL('segmento-cd')) {
      els.segCD.setAttribute({ strokeWidth: 6 });
      els.pC.setAttribute({ size: 6 });
      els.pD.setAttribute({ size: 6 });
    }
    if (isHL('circulo')) els.circle.setAttribute({ opacity: 0.8, strokeWidth: 2 });
  };

  return (
    <MathBoard boundingbox={[-5, 5, 5, -5]} onInit={onInit} onUpdate={onUpdate}>
      <div className="absolute bottom-3 left-3 right-3 z-10 text-sm text-center text-carbon/70 font-sans">
        Arrastra A, B, C o el punto director para copiar la longitud sobre la semirrecta.
      </div>
    </MathBoard>
  );
};
