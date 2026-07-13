import React from 'react';
import { MathBoard } from '@/shared/diagrams/core/MathBoard';
import { createPoint, createPolygon, createSegment } from '@/shared/diagrams/core/MathFactory';

export const DemoAreaRectangulo_Conmensurable: React.FC = () => {
  return (
    <MathBoard
      boundingbox={[-1, 4, 6, -1]}
      onInit={(board: any, els: any, theme: any) => {
        const m = 4; // base
        const n = 3; // altura

        els.A = createPoint(board, [0, 0], { name: '', visible: false }, theme);
        els.B = createPoint(board, [m, 0], { name: '', visible: false }, theme);
        els.C = createPoint(board, [m, n], { name: '', visible: false }, theme);
        els.D = createPoint(board, [0, n], { name: '', visible: false }, theme);

        els.rect = createPolygon(board, [els.A, els.B, els.C, els.D], {
          fillColor: theme.lienzo, fillOpacity: 0.2, borders: { strokeColor: theme.carbon, strokeWidth: 3 }
        }, theme);

        // Crear cuadrícula
        els.grid = [];
        for (let i = 1; i < m; i++) {
          const p1 = createPoint(board, [i, 0], { visible: false }, theme);
          const p2 = createPoint(board, [i, n], { visible: false }, theme);
          els.grid.push(createSegment(board, [p1, p2], { strokeColor: theme.salvia, strokeWidth: 1, dash: 1 }, theme));
        }
        for (let j = 1; j < n; j++) {
          const p1 = createPoint(board, [0, j], { visible: false }, theme);
          const p2 = createPoint(board, [m, j], { visible: false }, theme);
          els.grid.push(createSegment(board, [p1, p2], { strokeColor: theme.salvia, strokeWidth: 1, dash: 1 }, theme));
        }

        // Un cuadrado unidad resaltado
        els.u_A = createPoint(board, [1, 1], { visible: false }, theme);
        els.u_B = createPoint(board, [2, 1], { visible: false }, theme);
        els.u_C = createPoint(board, [2, 2], { visible: false }, theme);
        els.u_D = createPoint(board, [1, 2], { visible: false }, theme);
        els.unitSquare = createPolygon(board, [els.u_A, els.u_B, els.u_C, els.u_D], {
          fillColor: theme.terracota, fillOpacity: 0.1, borders: { strokeWidth: 2, strokeColor: theme.terracota }
        }, theme);
      }}
      onUpdate={(_board: any, els: any, theme: any, _isStep: any, isHL: any) => {
        const hlRect = isHL('rectangulo-r');
        const hlUnit = isHL('cuadrado-unidad');

        els.rect.setAttribute({
          fillColor: hlRect ? theme.salvia : theme.lienzo,
          fillOpacity: hlRect ? 0.3 : 0.2
        });

        els.unitSquare.setAttribute({
          fillOpacity: hlUnit ? 0.6 : 0.1
        });
      }}
    />
  );
};
