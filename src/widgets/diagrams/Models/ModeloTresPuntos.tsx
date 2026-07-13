import { MathBoard } from '@/shared/diagrams/core/MathBoard';
import {
  createLine,
  createPoint,
  createPolygon,
} from '@/shared/diagrams/core/MathFactory';

export const ModeloTresPuntos = () => {
  const onInit = (board: any, els: any, theme: any) => {
    const A = createPoint(board, [-2, -1], {
      name: 'A',
      size: 6,
      fillColor: theme.terracota,
      strokeColor: theme.terracota,
      showInfobox: false,
      fixed: true,
    }, theme);
    const B = createPoint(board, [2, -1], {
      name: 'B',
      size: 6,
      fillColor: theme.terracota,
      strokeColor: theme.terracota,
      showInfobox: false,
      fixed: true,
    }, theme);
    const C = createPoint(board, [0, 2], {
      name: 'C',
      size: 6,
      fillColor: theme.terracota,
      strokeColor: theme.terracota,
      showInfobox: false,
      fixed: true,
    }, theme);
    const rAB = createLine(board, [A, B], {
      strokeColor: theme.carbon,
      strokeWidth: 2,
      name: 'r_{AB}',
      label: { fontSize: 14, position: 'bl', offset: [-10, -10] },
      withLabel: true,
    }, theme);
    const rBC = createLine(board, [B, C], {
      strokeColor: theme.carbon,
      strokeWidth: 2,
      name: 'r_{BC}',
      label: { fontSize: 14, position: 'rt', offset: [10, 10] },
      withLabel: true,
    }, theme);
    const rCA = createLine(board, [C, A], {
      strokeColor: theme.carbon,
      strokeWidth: 2,
      name: 'r_{CA}',
      label: { fontSize: 14, position: 'lt', offset: [-10, 10] },
      withLabel: true,
    }, theme);
    const plano = createPolygon(board, [A, B, C], {
      fillColor: theme.musgo,
      fillOpacity: 0.08,
      borders: { visible: false },
      vertices: { visible: false },
    }, theme);

    Object.assign(els, { A, B, C, rAB, rBC, rCA, plano });
  };

  const onUpdate = (_board: any, els: any, _theme: any, _isStep: any, isHL: any) => {
    [els.A, els.B, els.C].forEach((point: any) => point.setAttribute({ size: 6, fillOpacity: 1, strokeOpacity: 1 }));
    [els.rAB, els.rBC, els.rCA].forEach((line: any) => line.setAttribute({ strokeWidth: 2, strokeOpacity: 1 }));
    els.plano.setAttribute({ fillOpacity: 0.08 });

    for (const id of ['A', 'B', 'C']) {
      if (isHL(id)) {
        [els.A, els.B, els.C].forEach((point: any) => point.setAttribute({ fillOpacity: 0.2, strokeOpacity: 0.2 }));
        els[id].setAttribute({ size: 9, fillOpacity: 1, strokeOpacity: 1 });
      }
    }
    for (const id of ['rAB', 'rBC', 'rCA']) {
      if (isHL(id)) {
        [els.rAB, els.rBC, els.rCA].forEach((line: any) => line.setAttribute({ strokeOpacity: 0.2 }));
        els[id].setAttribute({ strokeWidth: 4, strokeOpacity: 1 });
      }
    }
    if (isHL('plano')) els.plano.setAttribute({ fillOpacity: 0.3 });
  };

  return (
    <MathBoard boundingbox={[-3, 3, 3, -3]} onInit={onInit} onUpdate={onUpdate}>
      <div className="absolute top-2 left-3 z-10 text-xs font-serif italic text-pizarra/50">
        Modelo de 3 puntos: 3 puntos, 3 rectas, 1 plano
      </div>
    </MathBoard>
  );
};
