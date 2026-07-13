import { MathBoard } from '@/shared/diagrams/core/MathBoard';
import {
  createLine,
  createPoint,
  createSegment,
  createSlider,
  createText,
} from '@/shared/diagrams/core/MathFactory';

export const AxiomaArquimedes = () => {
  const onInit = (board: any, els: any, theme: any) => {
    const pC = createPoint(board, [0, 3], {
      name: 'C',
      size: 4,
      fillColor: theme.carbon,
      strokeColor: theme.carbon,
      fixed: true,
    }, theme);
    const pD = createPoint(board, [8, 3], {
      name: 'D',
      size: 4,
      fillColor: theme.carbon,
      strokeColor: theme.carbon,
      fixed: true,
    }, theme);
    const segCD = createSegment(board, [pC, pD], {
      strokeColor: theme.carbon,
      strokeWidth: 3,
    }, theme);

    const pA = createPoint(board, [0, 1], {
      name: 'A',
      size: 4,
      fillColor: theme.salvia,
      strokeColor: theme.salvia,
      fixed: true,
    }, theme);
    const pB = createPoint(board, [1.5, 1], {
      name: 'B',
      size: 4,
      fillColor: theme.salvia,
      strokeColor: theme.salvia,
      fixed: false,
    }, theme);
    const segAB = createSegment(board, [pA, pB], {
      strokeColor: theme.salvia,
      strokeWidth: 3,
    }, theme);

    const baseline = createLine(board, [
      createPoint(board, [0, -0.5], { visible: false, target: false }, theme),
      createPoint(board, [1, -0.5], { visible: false, target: false }, theme),
    ], {
      strokeColor: theme.pizarra,
      strokeWidth: 1,
      dash: 2,
    }, theme);
    const projection = createLine(board, [
      createPoint(board, [() => pD.X(), 4], { visible: false, target: false }, theme),
      createPoint(board, [() => pD.X(), -2], { visible: false, target: false }, theme),
    ], {
      strokeColor: theme.carbon,
      strokeWidth: 1,
      dash: 1,
    }, theme);
    const sliderN = createSlider(board, [[1, -1.35], [7, -1.35]], [1, 4, 15], {
      name: 'n',
      snapWidth: 1,
    }, theme);

    const copies: any[] = [];
    for (let index = 0; index < 15; index++) {
      const start = createPoint(board, [
        () => index * Math.max(0.1, pB.X() - pA.X()),
        -0.5,
      ], {
        visible: false,
        target: false,
      }, theme);
      const end = createPoint(board, [
        () => (index + 1) * Math.max(0.1, pB.X() - pA.X()),
        -0.5,
      ], {
        visible: false,
        target: false,
      }, theme);
      const segment = createSegment(board, [start, end], {
        strokeColor: () => ((index + 1) * Math.max(0.1, pB.X() - pA.X()) > pD.X() - pC.X() ? theme.terracota : theme.salvia),
        strokeWidth: 5,
      }, theme);
      copies.push(segment);
    }

    const status = createText(board, [8.7, 0.25, () => {
      const n = Math.round(sliderN.Value());
      const lengthAB = Math.max(0.1, pB.X() - pA.X());
      const lengthCD = pD.X() - pC.X();
      const surpasses = n * lengthAB > lengthCD;
      return `<div style="font-family: var(--font-serif); color:${surpasses ? theme.terracota : theme.carbon}; text-align:right;">
        n = ${n}<br/>n·AB = ${(n * lengthAB).toFixed(2)}<br/>CD = ${lengthCD.toFixed(2)}
      </div>`;
    }], {
      fixed: true,
      anchorX: 'right',
      anchorY: 'middle',
    }, theme);

    Object.assign(els, {
      pA,
      pB,
      pC,
      pD,
      segAB,
      segCD,
      baseline,
      projection,
      sliderN,
      status,
      copies,
    });
  };

  const onUpdate = (_board: any, els: any, theme: any, _isStep: any, isHL: any) => {
    const n = Math.round(els.sliderN.Value());
    els.copies.forEach((segment: any, index: number) => {
      segment.setAttribute({ visible: index < n });
    });

    els.pA.setAttribute({ size: 4, fillColor: theme.salvia, strokeColor: theme.salvia });
    els.pC.setAttribute({ size: 4, fillColor: theme.carbon, strokeColor: theme.carbon });
    if (isHL('pA')) els.pA.setAttribute({ size: 8, fillColor: theme.ocre, strokeColor: theme.ocre });
    if (isHL('pC')) els.pC.setAttribute({ size: 8, fillColor: theme.ocre, strokeColor: theme.ocre });
  };

  return (
    <MathBoard boundingbox={[-1, 5, 12, -2]} onInit={onInit} onUpdate={onUpdate}>
      <div className="absolute top-3 left-3 z-10 text-[10px] font-sans text-pizarra/60 uppercase tracking-wider">
        Arrastra B y mueve el deslizador n
      </div>
      <div className="absolute bottom-3 left-3 right-3 z-10 text-sm font-serif text-carbon/80 italic text-center leading-relaxed pointer-events-none">
        Siempre existe un múltiplo finito de AB que supera a CD.
      </div>
    </MathBoard>
  );
};
