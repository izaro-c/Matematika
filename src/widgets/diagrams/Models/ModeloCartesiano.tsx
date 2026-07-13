import { MathBoard } from '@/shared/diagrams/core/MathBoard';
import {
  createLine,
  createParallelLine,
  createPoint,
  createText,
} from '@/shared/diagrams/core/MathFactory';

export const ModeloCartesiano = () => {
  const onInit = (board: any, els: any, theme: any) => {
    const A = createPoint(board, [1, 2], {
      name: 'A',
      size: 5,
      fillColor: theme.terracota,
      strokeColor: theme.terracota,
      showInfobox: false,
      snapToGrid: true,
      snapSizeX: 0.5,
      snapSizeY: 0.5,
    }, theme);
    const B = createPoint(board, [-3, -1], {
      name: 'B',
      size: 5,
      fillColor: theme.terracota,
      strokeColor: theme.terracota,
      showInfobox: false,
      snapToGrid: true,
      snapSizeX: 0.5,
      snapSizeY: 0.5,
    }, theme);
    const P = createPoint(board, [3, -2], {
      name: 'P',
      size: 5,
      fillColor: theme.terracota,
      strokeColor: theme.terracota,
      showInfobox: false,
      snapToGrid: true,
      snapSizeX: 0.5,
      snapSizeY: 0.5,
    }, theme);

    const lineAB = createLine(board, [A, B], {
      strokeColor: theme.musgo,
      strokeWidth: 2.5,
    }, theme);
    const parallelP = createParallelLine(board, [A, B, P], {
      strokeColor: theme.salvia,
      strokeWidth: 2,
      dash: 2,
    }, theme);
    const info = createText(board, [4.5, 5.5, () => {
      const dx = B.X() - A.X();
      const dy = B.Y() - A.Y();
      const distance = Math.hypot(dx, dy);
      return `<div style="font-family: var(--font-serif); color:${theme.carbon}; text-align:right;">
        <strong style="font-size:1.1rem;">&reals;<sup>2</sup></strong><br/>
        <small style="color:${theme.musgo};">l: ${dy.toFixed(1)}x ${-dx >= 0 ? '+' : '-'} ${Math.abs(dx).toFixed(1)}y = c</small><br/>
        <small style="color:${theme.salvia};">l' ∥ l por P</small><br/>
        <small>d(A,B) = ${distance.toFixed(2)}</small>
      </div>`;
    }], {
      fixed: true,
      anchorX: 'right',
      anchorY: 'top',
    }, theme);

    els.A = A;
    els.B = B;
    els.P = P;
    els.lineAB = lineAB;
    els.parallelP = parallelP;
    els.info = info;
  };

  return (
    <MathBoard boundingbox={[-6, 6, 6, -6]} axis grid onInit={onInit}>
      <div className="absolute top-2 left-3 z-10 text-xs font-serif italic text-pizarra/50">
        &reals;<sup>2</sup>: puntos &rarr; pares (x,y) &middot; rectas &rarr; ax+by+c=0
      </div>
    </MathBoard>
  );
};
