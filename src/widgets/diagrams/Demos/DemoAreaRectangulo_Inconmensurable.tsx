import React from 'react';
import { MathBoard } from '@/shared/diagrams/core/MathBoard';
import { createPoint, createPolygon } from '@/shared/diagrams/core/MathFactory';

export const DemoAreaRectangulo_Inconmensurable: React.FC = () => {
  return (
    <MathBoard
      boundingbox={[-1, 4, 6, -1]}
      onInit={(board: any, els: any, theme: any) => {
        // Base = Pi, Altura = E (irracionales) -> simplificado a 3.14 y 2.71
        const b = 3.14;
        const h = 2.71;

        els.A = createPoint(board, [0, 0], { name: '', visible: false }, theme);
        els.B = createPoint(board, [b, 0], { name: '', visible: false }, theme);
        els.C = createPoint(board, [b, h], { name: '', visible: false }, theme);
        els.D = createPoint(board, [0, h], { name: '', visible: false }, theme);

        els.rect = createPolygon(board, [els.A, els.B, els.C, els.D], {
          fillColor: theme.carbon, fillOpacity: 0.2, borders: { strokeColor: theme.carbon, strokeWidth: 3 }
        }, theme);

        // Rectángulo interior R- (epsilon = 0.3)
        const eps = 0.3;
        els.A_min = createPoint(board, [0, 0], { visible: false }, theme);
        els.B_min = createPoint(board, [b - eps, 0], { visible: false }, theme);
        els.C_min = createPoint(board, [b - eps, h - eps], { visible: false }, theme);
        els.D_min = createPoint(board, [0, h - eps], { visible: false }, theme);

        els.rectMin = createPolygon(board, [els.A_min, els.B_min, els.C_min, els.D_min], {
          fillColor: theme.musgo, fillOpacity: 0.3, borders: { strokeColor: theme.musgo, strokeWidth: 2, dash: 2 }
        }, theme);

        // Rectángulo exterior R+
        els.A_max = createPoint(board, [0, 0], { visible: false }, theme);
        els.B_max = createPoint(board, [b + eps, 0], { visible: false }, theme);
        els.C_max = createPoint(board, [b + eps, h + eps], { visible: false }, theme);
        els.D_max = createPoint(board, [0, h + eps], { visible: false }, theme);

        els.rectMax = createPolygon(board, [els.A_max, els.B_max, els.C_max, els.D_max], {
          fillColor: theme.terracota, fillOpacity: 0, borders: { strokeColor: theme.terracota, strokeWidth: 2, dash: 2 }
        }, theme);
      }}
      onUpdate={(_board: any, els: any, _theme: any, _isStep: any, isHL: any) => {
        const hlRMin = isHL('rectangulo-k-min');
        const hlRMax = isHL('rectangulo-k-max');
        const hlR = isHL('rectangulo-r');

        els.rect.setAttribute({ fillOpacity: hlR ? 0.4 : 0.2 });
        els.rectMin.setAttribute({ fillOpacity: hlRMin ? 0.6 : 0.3 });
        els.rectMax.setAttribute({ fillOpacity: hlRMax ? 0.2 : 0, strokeWidth: hlRMax ? 4 : 2 });
      }}
    />
  );
};
