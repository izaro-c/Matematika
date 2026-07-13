import { MathBoard } from '@/shared/diagrams/core/MathBoard';
import {
  createCircle,
  createPoint,
  createSegment,
} from '@/shared/diagrams/core/MathFactory';

export const ModeloFano = () => {
  const onInit = (board: any, els: any, theme: any) => {
    const sqrt3 = Math.sqrt(3);
    const p1 = createPoint(board, [0, 2], {
      name: '1',
      size: 5,
      fillColor: theme.terracota,
      strokeColor: theme.terracota,
      fixed: true,
    }, theme);
    const p2 = createPoint(board, [-sqrt3, -1], {
      name: '2',
      size: 5,
      fillColor: theme.terracota,
      strokeColor: theme.terracota,
      fixed: true,
    }, theme);
    const p3 = createPoint(board, [sqrt3, -1], {
      name: '3',
      size: 5,
      fillColor: theme.terracota,
      strokeColor: theme.terracota,
      fixed: true,
    }, theme);
    const p4 = createPoint(board, [0, -1], {
      name: '4',
      size: 5,
      fillColor: theme.terracota,
      strokeColor: theme.terracota,
      fixed: true,
    }, theme);
    const p5 = createPoint(board, [sqrt3 / 2, 0.5], {
      name: '5',
      size: 5,
      fillColor: theme.terracota,
      strokeColor: theme.terracota,
      fixed: true,
    }, theme);
    const p6 = createPoint(board, [-sqrt3 / 2, 0.5], {
      name: '6',
      size: 5,
      fillColor: theme.terracota,
      strokeColor: theme.terracota,
      fixed: true,
    }, theme);
    const p7 = createPoint(board, [0, 0], {
      name: '7',
      size: 5,
      fillColor: theme.musgo,
      strokeColor: theme.musgo,
      fixed: true,
    }, theme);

    const l1 = createSegment(board, [p1, p2], { strokeColor: theme.carbon, name: 'l1' }, theme);
    const l2 = createSegment(board, [p2, p3], { strokeColor: theme.carbon, name: 'l2' }, theme);
    const l3 = createSegment(board, [p3, p1], { strokeColor: theme.carbon, name: 'l3' }, theme);
    const l4 = createSegment(board, [p1, p4], { strokeColor: theme.carbon, name: 'l4' }, theme);
    const l5 = createSegment(board, [p2, p5], { strokeColor: theme.carbon, name: 'l5' }, theme);
    const l6 = createSegment(board, [p3, p6], { strokeColor: theme.carbon, name: 'l6' }, theme);
    const l7 = createCircle(board, [p7, p4], {
      strokeColor: theme.carbon,
      dash: 2,
      name: 'l7',
    }, theme);

    Object.assign(els, { p1, p2, p3, p4, p5, p6, p7, l1, l2, l3, l4, l5, l6, l7 });
  };

  const onUpdate = (_board: any, els: any, _theme: any, _isStep: any, isHL: any) => {
    const points = [els.p1, els.p2, els.p3, els.p4, els.p5, els.p6, els.p7];
    const lines = [els.l1, els.l2, els.l3, els.l4, els.l5, els.l6, els.l7];

    points.forEach((point: any) => point.setAttribute({ size: 5, fillOpacity: 1, strokeOpacity: 1 }));
    lines.forEach((line: any, index: number) => line.setAttribute({ strokeWidth: index === 6 ? 1 : 2, strokeOpacity: 1 }));

    for (let i = 1; i <= 7; i++) {
      if (isHL(String(i))) {
        points.forEach((point: any) => point.setAttribute({ fillOpacity: 0.2, strokeOpacity: 0.2 }));
        points[i - 1].setAttribute({ size: 9, fillOpacity: 1, strokeOpacity: 1 });
      }
      if (isHL(`l${i}`)) {
        lines.forEach((line: any) => line.setAttribute({ strokeOpacity: 0.2 }));
        lines[i - 1].setAttribute({ strokeWidth: 4, strokeOpacity: 1 });
      }
    }
  };

  return (
    <MathBoard boundingbox={[-3, 3, 3, -3]} onInit={onInit} onUpdate={onUpdate}>
      <div className="absolute top-2 left-3 z-10 text-xs font-serif italic text-pizarra/50">
        Plano de Fano
      </div>
    </MathBoard>
  );
};
