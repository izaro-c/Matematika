import { MathBoard } from '@/shared/diagrams/core/MathBoard';
import {
  createGlider,
  createPoint,
  createSegment,
} from '@/shared/diagrams/core/MathFactory';

export const Congruence3 = () => {
  const onInit = (board: any, els: any, theme: any) => {
    const pA = createPoint(board, [-3, 2], {
      name: 'A',
      size: 4,
      fillColor: theme.terracota,
      strokeColor: theme.terracota,
      label: { offset: [-15, 15] },
    }, theme);
    const pC = createPoint(board, [3, 2], {
      name: 'C',
      size: 4,
      fillColor: theme.ocre,
      strokeColor: theme.ocre,
      label: { offset: [15, 15] },
    }, theme);
    const segAC = createSegment(board, [pA, pC], {
      strokeColor: theme.pizarra,
      strokeWidth: 1,
      visible: false,
    }, theme);
    const pB = createGlider(board, [-0.5, 2, segAC], {
      name: 'B',
      size: 4,
      fillColor: theme.salvia,
      strokeColor: theme.salvia,
      label: { offset: [0, 15] },
    }, theme);
    const segAB = createSegment(board, [pA, pB], {
      strokeColor: theme.terracota,
      strokeWidth: 4,
    }, theme);
    const segBC = createSegment(board, [pB, pC], {
      strokeColor: theme.ocre,
      strokeWidth: 4,
    }, theme);

    const pA1 = createPoint(board, [-3, -2], {
      name: "A'",
      size: 4,
      fillColor: theme.terracota,
      strokeColor: theme.terracota,
      label: { offset: [-15, -15] },
    }, theme);
    const pB1 = createPoint(board, [
      () => pA1.X() + pA.Dist(pB),
      () => pA1.Y(),
    ], {
      name: "B'",
      size: 4,
      fillColor: theme.salvia,
      strokeColor: theme.salvia,
      label: { offset: [0, -15] },
    }, theme);
    const pC1 = createPoint(board, [
      () => pB1.X() + pB.Dist(pC),
      () => pB1.Y(),
    ], {
      name: "C'",
      size: 4,
      fillColor: theme.ocre,
      strokeColor: theme.ocre,
      label: { offset: [15, -15] },
    }, theme);
    const segA1B1 = createSegment(board, [pA1, pB1], {
      strokeColor: theme.terracota,
      strokeWidth: 4,
    }, theme);
    const segB1C1 = createSegment(board, [pB1, pC1], {
      strokeColor: theme.ocre,
      strokeWidth: 4,
    }, theme);

    els.pA = pA;
    els.pB = pB;
    els.pC = pC;
    els.segAC = segAC;
    els.pA1 = pA1;
    els.pB1 = pB1;
    els.pC1 = pC1;
    els.segAB = segAB;
    els.segBC = segBC;
    els.segA1B1 = segA1B1;
    els.segB1C1 = segB1C1;
  };

  const onUpdate = (_board: any, els: any, _theme: any, _isStep: any, isHL: any) => {
    [els.segAB, els.segBC, els.segA1B1, els.segB1C1].forEach((segment: any) => {
      segment.setAttribute({ strokeWidth: 4, opacity: 1 });
    });

    if (isHL('ab')) {
      els.segAB.setAttribute({ strokeWidth: 7 });
      els.segA1B1.setAttribute({ strokeWidth: 7 });
    }
    if (isHL('bc')) {
      els.segBC.setAttribute({ strokeWidth: 7 });
      els.segB1C1.setAttribute({ strokeWidth: 7 });
    }
    if (isHL('ac')) {
      [els.segAB, els.segBC, els.segA1B1, els.segB1C1].forEach((segment: any) => {
        segment.setAttribute({ strokeWidth: 7 });
      });
    }
  };

  return (
    <MathBoard boundingbox={[-5, 4, 5, -4]} onInit={onInit} onUpdate={onUpdate}>
      <div className="absolute bottom-3 left-3 right-3 z-10 text-sm text-center text-carbon/70 font-sans">
        Arrastra A, B y C en la línea superior; abajo se conserva la suma de segmentos.
      </div>
    </MathBoard>
  );
};
