import React from 'react';
import { MathBoard } from '@/shared/diagrams/core/MathBoard';
import { createPoint, createPolygon, createSegment } from '@/shared/diagrams/core/MathFactory';

export const DemoTriangulacionPoligono: React.FC = () => {
  return (
    <MathBoard
      boundingbox={[-1, 6, 7, -1]}
      onInit={(board: any, els: any, theme: any) => {
        // Puntos de un polígono cóncavo (orejas)
        els.P1 = createPoint(board, [0, 0], { name: 'P1', visible: true, label: { offset: [-15, -15] } }, theme);
        els.P2 = createPoint(board, [4, 0], { name: 'P2', visible: true, label: { offset: [15, -15] } }, theme);
        els.P3 = createPoint(board, [6, 3], { name: 'P3', visible: true, label: { offset: [15, 15] } }, theme);
        els.P4 = createPoint(board, [3, 2], { name: 'P4', visible: true, label: { offset: [-15, 20] } }, theme); // cóncavo
        els.P5 = createPoint(board, [1, 5], { name: 'P5', visible: true, label: { offset: [-15, 15] } }, theme);

        // Polígono completo
        els.poly = createPolygon(board, [els.P1, els.P2, els.P3, els.P4, els.P5], {
          fillColor: theme.lienzo, fillOpacity: 0.1, borders: { strokeColor: theme.carbon, strokeWidth: 3 }
        }, theme);

        // Diagonal P3-P5 (interior)
        els.diag = createSegment(board, [els.P3, els.P5], { strokeColor: theme.terracota, strokeWidth: 2, dash: 2 }, theme);

        // Oreja P4
        els.oreja = createPolygon(board, [els.P3, els.P4, els.P5], {
          fillColor: theme.salvia, fillOpacity: 0, borders: { strokeColor: theme.carbon, strokeWidth: 1 }
        }, theme);

        // Resto del polígono
        els.resto = createPolygon(board, [els.P1, els.P2, els.P3, els.P5], {
          fillColor: theme.pizarra, fillOpacity: 0, borders: { strokeColor: theme.carbon, strokeWidth: 1 }
        }, theme);
      }}
      onUpdate={(_board: any, els: any, _theme: any, isStep: any, isHL: any) => {
        const s1 = isStep('step1'); // Oreja
        const s2 = isStep('step2'); // Inducción

        const hlOreja = isHL('oreja');
        const hlDiag = isHL('diagonal');
        const hlResto = isHL('subpoligono');
        const hlP = isHL('poligono-p');

        els.poly.setAttribute({ fillOpacity: hlP ? 0.3 : 0.1 });

        els.oreja.setAttribute({ fillOpacity: (s1 || hlOreja) ? 0.4 : 0 });
        els.resto.setAttribute({ fillOpacity: (s2 || hlResto) ? 0.3 : 0 });

        els.diag.setAttribute({ strokeWidth: (s1 || s2 || hlDiag || hlOreja || hlResto) ? 4 : 2 });
      }}
    />
  );
};
