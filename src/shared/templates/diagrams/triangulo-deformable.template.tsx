import { MathBoard } from '@/shared/diagrams/core/MathBoard';
import { createPoint, createPolygon, createSegment } from '@/shared/diagrams/core/MathFactory';

export const TemplateComponent = () => {
  return (
    <MathBoard
      boundingbox={[-4, 4, 4, -4]}
      onInit={(board: any, els: any, theme: any) => {
        // Vértices deformables
        els.pA = createPoint(board, [-2, -1.5], { name: '__LABEL_A__', fillColor: theme.__COLOR__, strokeColor: theme.__COLOR__ }, theme);
        els.pB = createPoint(board, [2, -1.5], { name: '__LABEL_B__', fillColor: theme.__COLOR__, strokeColor: theme.__COLOR__ }, theme);
        els.pC = createPoint(board, [0, 2], { name: '__LABEL_C__', fillColor: theme.__COLOR__, strokeColor: theme.__COLOR__ }, theme);

        // Lados del triángulo
        els.segAB = createSegment(board, [els.pA, els.pB], { name: 'c', withLabel: true }, theme);
        els.segBC = createSegment(board, [els.pB, els.pC], { name: 'a', withLabel: true }, theme);
        els.segCA = createSegment(board, [els.pC, els.pA], { name: 'b', withLabel: true }, theme);

        // Polígono relleno
        els.poly = createPolygon(board, [els.pA, els.pB, els.pC], {
          fillColor: theme.__COLOR__,
          fillOpacity: 0.15,
          borders: { visible: false }
        }, theme);

      }}
      onUpdate={(_board: any, els: any, _theme: any, _isStep: any, isHL: any) => {
        // Highlight de elementos individuales en hover
        const hlA = isHL('pA');
        els.pA.setAttribute({ size: hlA ? 8 : 4 });

        const hlB = isHL('pB');
        els.pB.setAttribute({ size: hlB ? 8 : 4 });

        const hlC = isHL('pC');
        els.pC.setAttribute({ size: hlC ? 8 : 4 });
      }}
    />
  );
};
