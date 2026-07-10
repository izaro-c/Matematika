import { MathBoard } from '@/shared/diagrams/core/MathBoard';
import { createPoint } from '@/shared/diagrams/core/MathFactory';

export const TemplateComponent = () => {
  return (
    <MathBoard
      boundingbox={[-5, 5, 5, -5]}
      onInit={(board: any, els: any, theme: any) => {
        // Crear ejes cartesianos interactivos
        board.create('axis', [[0, 0], [1, 0]], {
          ticks: { drawZero: true, label: { offset: [-5, -15] } },
          strokeColor: theme.carbon,
          strokeWidth: 1.5
        });
        board.create('axis', [[0, 0], [0, 1]], {
          ticks: { drawZero: false, label: { offset: [-20, 0] } },
          strokeColor: theme.carbon,
          strokeWidth: 1.5
        });

        // Punto de control interactivo para modificar la función
        els.ctrlPt = createPoint(board, [1, 2], { name: 'P(x,y)', fillColor: theme.__COLOR__, strokeColor: theme.__COLOR__ }, theme);

        // Crear una curva basada en el punto de control
        els.curve = board.create('functiongraph', [
          (x: number) => {
            // Ejemplo: una parábola y = a * x^2 + c
            const a = els.ctrlPt.Y() / (els.ctrlPt.X() * els.ctrlPt.X() || 1);
            return a * x * x;
          }
        ], {
          strokeColor: theme.__COLOR__,
          strokeWidth: 3
        });
      }}
      onUpdate={(_board: any, els: any, _theme: any, _isStep: any, isHL: any) => {
        const isHl = isHL('ctrlPt');
        els.ctrlPt.setAttribute({ size: isHl ? 8 : 4 });
      }}
    />
  );
};
