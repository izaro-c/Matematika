import { MathBoard } from '@/shared/diagrams/core/MathBoard';
import { createPoint } from '@/shared/diagrams/core/MathFactory';

export const TemplateComponent = () => {
  return (
    <MathBoard
      boundingbox={[-2, 2, 2, -2]}
      onInit={(board: any, els: any, theme: any) => {
        // Centro y punto de radio
        els.O = createPoint(board, [0, 0], { name: 'O', fixed: true, size: 2 }, theme);
        els.circle = board.create('circle', [els.O, 1.0], {
          strokeColor: theme.carbon,
          strokeWidth: 1.5,
          fillColor: 'none'
        });

        // Glider interactivo sobre el círculo unitario
        els.pAngle = board.create('glider', [1.0, 0.0, els.circle], {
          name: 'P',
          strokeColor: theme.__COLOR__,
          fillColor: theme.__COLOR__,
          size: 4
        });

        // Segmento O-P
        els.radiusSeg = board.create('segment', [els.O, els.pAngle], {
          strokeColor: theme.__COLOR__,
          strokeWidth: 2
        });

        // Proyección sobre el eje X (Coseno)
        els.pCos = createPoint(board, [() => els.pAngle.X(), 0], { name: '', visible: false }, theme);
        els.cosSeg = board.create('segment', [els.O, els.pCos], {
          strokeColor: theme.pizarra,
          strokeWidth: 3,
          name: 'cos(θ)',
          withLabel: true,
          label: { position: 'bot', offset: [0, -10], strokeColor: theme.pizarra }
        });

        // Proyección sobre el eje Y (Seno)
        els.sinSeg = board.create('segment', [els.pCos, els.pAngle], {
          strokeColor: theme.terracota,
          strokeWidth: 3,
          name: 'sin(θ)',
          withLabel: true,
          label: { position: 'right', offset: [10, 0], strokeColor: theme.terracota }
        });
      }}
      onUpdate={(_board: any, els: any, _theme: any, _isStep: any, isHL: any) => {
        const isHl = isHL('pAngle');
        els.pAngle.setAttribute({ size: isHl ? 8 : 4 });
      }}
    />
  );
};
