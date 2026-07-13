import React from 'react';
import { MathBoard } from '@/shared/diagrams/core/MathBoard';
import { createPoint, createSegment, createPolygon } from '@/shared/diagrams/core/MathFactory';

export const DemoAreaAditividad: React.FC = () => {
  return (
    <MathBoard
      boundingbox={[-1, 6, 9, -1]}
      onInit={(board: any, els: any, theme: any) => {
        // Vértices del polígono grande
        els.A = createPoint(board, [0, 0], { name: 'A', visible: false }, theme);
        els.B = createPoint(board, [4, 0], { name: 'B', visible: false }, theme);
        els.C = createPoint(board, [5, 3], { name: 'C', visible: false }, theme);
        els.D = createPoint(board, [8, 1], { name: 'D', visible: false }, theme);
        els.E = createPoint(board, [7, 5], { name: 'E', visible: false }, theme);
        els.F = createPoint(board, [3, 4], { name: 'F', visible: false }, theme);
        els.G = createPoint(board, [1, 5], { name: 'G', visible: false }, theme);

        // Frontera P1 y P2
        els.borderP1 = createPolygon(board, [els.A, els.B, els.C, els.F, els.G], {
          fillColor: theme.terracota,
          fillOpacity: 0.1,
          borders: { strokeColor: theme.carbon, strokeWidth: 2 }
        }, theme);

        els.borderP2 = createPolygon(board, [els.C, els.D, els.E, els.F], {
          fillColor: theme.salvia,
          fillOpacity: 0.1,
          borders: { strokeColor: theme.carbon, strokeWidth: 2 }
        }, theme);

        // Frontera común CF
        els.commonEdge = createSegment(board, [els.C, els.F], {
          strokeColor: theme.carbon,
          strokeWidth: 3,
          dash: 2
        }, theme);

        // Triangulación de P1 (A-C, A-F, B-F - wait, A-C-F, A-B-C, A-F-G)
        // Triangles for P1
        els.t1_1 = createPolygon(board, [els.A, els.B, els.C], { fillColor: theme.terracota, fillOpacity: 0, borders: { strokeWidth: 1, strokeColor: theme.carbon, dash: 1 } }, theme);
        els.t1_2 = createPolygon(board, [els.A, els.C, els.F], { fillColor: theme.terracota, fillOpacity: 0, borders: { strokeWidth: 1, strokeColor: theme.carbon, dash: 1 } }, theme);
        els.t1_3 = createPolygon(board, [els.A, els.F, els.G], { fillColor: theme.terracota, fillOpacity: 0, borders: { strokeWidth: 1, strokeColor: theme.carbon, dash: 1 } }, theme);

        // Triangulación de P2 (C-E-F, C-D-E)
        els.t2_1 = createPolygon(board, [els.C, els.F, els.E], { fillColor: theme.salvia, fillOpacity: 0, borders: { strokeWidth: 1, strokeColor: theme.carbon, dash: 1 } }, theme);
        els.t2_2 = createPolygon(board, [els.C, els.E, els.D], { fillColor: theme.salvia, fillOpacity: 0, borders: { strokeWidth: 1, strokeColor: theme.carbon, dash: 1 } }, theme);

      }}
      onUpdate={(_board: any, els: any, theme: any, _isStep: any, isHL: any) => {
        // Hovers
        const hlP1 = isHL('poligono-p1');
        const hlP2 = isHL('poligono-p2');
        const hlT1 = isHL('triangulacion-p1');
        const hlT2 = isHL('triangulacion-p2');
        const hlP = isHL('poligono-p');

        const anyH = hlP1 || hlP2 || hlT1 || hlT2 || hlP;

        const getOp = (hovered: boolean, activeInStep: boolean, base = 0.2, hlOp = 0.6) => {
            if (hovered) return hlOp;
            if (anyH) return base * 0.5;
            return activeInStep ? base : base * 0.5;
        };

        // P1
        els.borderP1.setAttribute({ fillOpacity: getOp(hlP1 || hlP, true, 0.15, 0.4) });
        const t1Op = getOp(hlT1, true, 0.1, 0.5);
        els.t1_1.setAttribute({ fillOpacity: t1Op });
        els.t1_2.setAttribute({ fillOpacity: t1Op });
        els.t1_3.setAttribute({ fillOpacity: t1Op });

        // P2
        els.borderP2.setAttribute({ fillOpacity: getOp(hlP2 || hlP, true, 0.15, 0.4) });
        const t2Op = getOp(hlT2, true, 0.1, 0.5);
        els.t2_1.setAttribute({ fillOpacity: t2Op });
        els.t2_2.setAttribute({ fillOpacity: t2Op });

        // Highlight shared edge
        els.commonEdge.setAttribute({
          strokeColor: (hlP1 || hlP2 || hlP) ? theme.carbon : theme.pizarra,
          strokeWidth: (hlP1 || hlP2 || hlP) ? 4 : 2
        });
      }}
    />
  );
};
