import React from 'react';
import { MathBoard } from '../../../features/graph/ui/MathBoard';
import { createPoint, createPolygon, createSegment } from '../../../features/graph/ui/MathFactory';

export const DemoInvarianciaTriangulacion: React.FC = () => {
  return (
    <MathBoard
      boundingbox={[-1, 5, 6, -1]}
      onInit={(board: any, els: any, theme: any) => {
        // Polígono
        els.P_A = createPoint(board, [0, 0], { name: '', visible: false }, theme);
        els.P_B = createPoint(board, [4, 0], { name: '', visible: false }, theme);
        els.P_C = createPoint(board, [5, 3], { name: '', visible: false }, theme);
        els.P_D = createPoint(board, [2, 4], { name: '', visible: false }, theme);

        els.poly = createPolygon(board, [els.P_A, els.P_B, els.P_C, els.P_D], {
          fillColor: theme.lienzo, fillOpacity: 0.1, borders: { strokeColor: theme.carbon, strokeWidth: 3 }
        }, theme);

        // Triangulación 1 (A-C)
        els.t1_1 = createPolygon(board, [els.P_A, els.P_B, els.P_C], { fillColor: theme.terracota, fillOpacity: 0, borders: { strokeColor: theme.terracota, strokeWidth: 2, dash: 1 } }, theme);
        els.t1_2 = createPolygon(board, [els.P_A, els.P_C, els.P_D], { fillColor: theme.terracota, fillOpacity: 0, borders: { strokeColor: theme.terracota, strokeWidth: 2, dash: 1 } }, theme);
        els.diagT1 = createSegment(board, [els.P_A, els.P_C], { strokeColor: theme.terracota, strokeWidth: 2, dash: 1 }, theme);

        // Triangulación 2 (B-D)
        els.t2_1 = createPolygon(board, [els.P_A, els.P_B, els.P_D], { fillColor: theme.salvia, fillOpacity: 0, borders: { strokeColor: theme.salvia, strokeWidth: 2, dash: 2 } }, theme);
        els.t2_2 = createPolygon(board, [els.P_B, els.P_C, els.P_D], { fillColor: theme.salvia, fillOpacity: 0, borders: { strokeColor: theme.salvia, strokeWidth: 2, dash: 2 } }, theme);
        els.diagT2 = createSegment(board, [els.P_B, els.P_D], { strokeColor: theme.salvia, strokeWidth: 2, dash: 2 }, theme);

        // Intersección
        els.intersect = board.create('intersection', [els.diagT1, els.diagT2], { 
          name: '', fillColor: theme.pizarra, strokeColor: theme.pizarra, size: 5, visible: false 
        });

      }}
      onUpdate={(_board: any, els: any, theme: any, isStep: any, isHL: any) => {
        const s1 = isStep('step1'); // T1
        const s2 = isStep('step2'); // T2
        const s3 = isStep('step3'); // Superposicion

        const hlT1 = isHL('triangulacion-t1');
        const hlT2 = isHL('triangulacion-t2');
        const hlInter = isHL('refinamiento-t-star') || isHL('intersecciones');

        const showT1 = s1 || s3 || hlT1;
        const showT2 = s2 || s3 || hlT2;

        els.diagT1.setAttribute({ visible: showT1, strokeWidth: hlT1 ? 4 : 2 });
        els.diagT2.setAttribute({ visible: showT2, strokeWidth: hlT2 ? 4 : 2 });

        els.intersect.setAttribute({ 
          visible: s3 || hlInter, 
          size: hlInter ? 8 : 4,
          fillColor: hlInter ? theme.terracota : theme.pizarra
        });

        els.t1_1.setAttribute({ fillOpacity: hlT1 ? 0.2 : 0 });
        els.t1_2.setAttribute({ fillOpacity: hlT1 ? 0.2 : 0 });
        els.t2_1.setAttribute({ fillOpacity: hlT2 ? 0.2 : 0 });
        els.t2_2.setAttribute({ fillOpacity: hlT2 ? 0.2 : 0 });
      }}
    />
  );
};
