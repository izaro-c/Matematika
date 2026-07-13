import { MathBoard } from '@/shared/diagrams/core/MathBoard';
import {
  createCircle,
  createGlider,
  createPoint,
  createSegment,
  createTicks,
} from '@/shared/diagrams/core/MathFactory';

export const Congruence2 = () => {
  const onInit = (board: any, els: any, theme: any) => {
    const pA = createPoint(board, [-2, 1.5], {
      name: 'A',
      size: 4,
      fillColor: theme.terracota,
      strokeColor: theme.terracota,
      label: { offset: [-15, 15] },
    }, theme);
    const pB = createPoint(board, [1, 1.5], {
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

    const pC = createPoint(board, [-2, 0], {
      name: 'C',
      size: 4,
      fillColor: theme.salvia,
      strokeColor: theme.salvia,
      label: { offset: [-15, 15] },
    }, theme);
    const cCD = createCircle(board, [pC, () => pA.Dist(pB)], { visible: false }, theme);
    const pD = createGlider(board, [1, 0, cCD], {
      name: 'D',
      size: 4,
      fillColor: theme.salvia,
      strokeColor: theme.salvia,
      label: { offset: [15, 15] },
    }, theme);
    const segCD = createSegment(board, [pC, pD], {
      strokeColor: theme.salvia,
      strokeWidth: 3,
    }, theme);

    const pE = createPoint(board, [-2, -1.5], {
      name: 'E',
      size: 4,
      fillColor: theme.ocre,
      strokeColor: theme.ocre,
      label: { offset: [-15, -15] },
    }, theme);
    const cEF = createCircle(board, [pE, () => pA.Dist(pB)], { visible: false }, theme);
    const pF = createGlider(board, [1, -1.5, cEF], {
      name: 'F',
      size: 4,
      fillColor: theme.ocre,
      strokeColor: theme.ocre,
      label: { offset: [15, -15] },
    }, theme);
    const segEF = createSegment(board, [pE, pF], {
      strokeColor: theme.ocre,
      strokeWidth: 3,
    }, theme);

    const ticksAB = createTicks(board, [segAB, 2], { strokeColor: theme.carbon }, theme);
    const ticksCD = createTicks(board, [segCD, 2], { strokeColor: theme.carbon }, theme);
    const ticksEF = createTicks(board, [segEF, 2], { strokeColor: theme.carbon }, theme);

    els.pA = pA;
    els.pB = pB;
    els.pC = pC;
    els.pD = pD;
    els.pE = pE;
    els.pF = pF;
    els.cCD = cCD;
    els.cEF = cEF;
    els.segAB = segAB;
    els.segCD = segCD;
    els.segEF = segEF;
    els.ticksAB = ticksAB;
    els.ticksCD = ticksCD;
    els.ticksEF = ticksEF;
  };

  const onUpdate = (_board: any, els: any, _theme: any, _isStep: any, isHL: any) => {
    els.segAB.setAttribute({ strokeWidth: 3, opacity: 1 });
    els.segCD.setAttribute({ strokeWidth: 3, opacity: 1 });
    els.segEF.setAttribute({ strokeWidth: 3, opacity: 1 });

    const highlightPair = (first: any, second?: any) => {
      first.setAttribute({ strokeWidth: 6, opacity: 1 });
      second?.setAttribute({ strokeWidth: 6, opacity: 1 });
    };

    if (isHL('segmento-ab')) highlightPair(els.segAB);
    if (isHL('segmento-cd')) highlightPair(els.segCD);
    if (isHL('segmento-ef')) highlightPair(els.segEF);
    if (isHL('ab-cd')) highlightPair(els.segAB, els.segCD);
    if (isHL('ab-ef')) highlightPair(els.segAB, els.segEF);
    if (isHL('cd-ef')) highlightPair(els.segCD, els.segEF);
  };

  return (
    <MathBoard boundingbox={[-5, 5, 5, -5]} onInit={onInit} onUpdate={onUpdate}>
      <div className="absolute bottom-3 left-3 right-3 z-10 text-sm text-center text-carbon/70 font-sans">
        Modifica AB; CD y EF conservan la misma longitud.
      </div>
    </MathBoard>
  );
};
