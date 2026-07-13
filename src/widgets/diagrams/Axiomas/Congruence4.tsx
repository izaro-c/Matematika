import { MathBoard } from '@/shared/diagrams/core/MathBoard';
import {
  createAngle,
  createPoint,
  createRay,
} from '@/shared/diagrams/core/MathFactory';

export const Congruence4 = () => {
  const onInit = (board: any, els: any, theme: any) => {
    const pO = createPoint(board, [-2, 2], {
      name: 'O',
      size: 4,
      fillColor: theme.terracota,
      strokeColor: theme.terracota,
      label: { offset: [-15, -15] },
    }, theme);
    const pH = createPoint(board, [0, 2], {
      name: 'A',
      size: 4,
      fillColor: theme.pizarra,
      strokeColor: theme.pizarra,
      label: { offset: [15, -15] },
    }, theme);
    const pK = createPoint(board, [-1, 2.5], {
      name: 'B',
      size: 4,
      fillColor: theme.pizarra,
      strokeColor: theme.pizarra,
      label: { offset: [-15, 15] },
    }, theme);
    const rayH = createRay(board, [pO, pH], {
      strokeColor: theme.pizarra,
      strokeWidth: 2,
    }, theme);
    const rayK = createRay(board, [pO, pK], {
      strokeColor: theme.pizarra,
      strokeWidth: 2,
    }, theme);
    const angleOriginal = createAngle(board, [pH, pO, pK], {
      radius: 1,
      fillColor: theme.terracota,
      strokeColor: theme.terracota,
      fillOpacity: 0.2,
      strokeWidth: 2,
      hasInnerAngles: true,
    }, theme);

    const pO1 = createPoint(board, [-1, -2], {
      name: "O'",
      size: 4,
      fillColor: theme.salvia,
      strokeColor: theme.salvia,
      label: { offset: [-15, -15] },
    }, theme);
    const pH1 = createPoint(board, [1, -2], {
      name: "A'",
      size: 4,
      fillColor: theme.pizarra,
      strokeColor: theme.pizarra,
      label: { offset: [15, -15] },
    }, theme);
    const rayH1 = createRay(board, [pO1, pH1], {
      strokeColor: theme.pizarra,
      strokeWidth: 2,
    }, theme);
    const pK1 = createPoint(board, [
      () => {
        const angle = Math.atan2(pK.Y() - pO.Y(), pK.X() - pO.X()) - Math.atan2(pH.Y() - pO.Y(), pH.X() - pO.X());
        const base = Math.atan2(pH1.Y() - pO1.Y(), pH1.X() - pO1.X());
        return pO1.X() + 2 * Math.cos(base + angle);
      },
      () => {
        const angle = Math.atan2(pK.Y() - pO.Y(), pK.X() - pO.X()) - Math.atan2(pH.Y() - pO.Y(), pH.X() - pO.X());
        const base = Math.atan2(pH1.Y() - pO1.Y(), pH1.X() - pO1.X());
        return pO1.Y() + 2 * Math.sin(base + angle);
      },
    ], {
      name: "B'",
      size: 4,
      fillColor: theme.salvia,
      strokeColor: theme.salvia,
      label: { offset: [-15, 15] },
      fixed: true,
    }, theme);
    const rayK1 = createRay(board, [pO1, pK1], {
      strokeColor: theme.salvia,
      strokeWidth: 2,
      dash: 2,
    }, theme);
    const angleClonado = createAngle(board, [pH1, pO1, pK1], {
      radius: 1,
      fillColor: theme.salvia,
      strokeColor: theme.salvia,
      fillOpacity: 0.2,
      strokeWidth: 2,
      hasInnerAngles: true,
    }, theme);

    els.pO = pO;
    els.pH = pH;
    els.pK = pK;
    els.rayH = rayH;
    els.rayK = rayK;
    els.angleOriginal = angleOriginal;
    els.pO1 = pO1;
    els.pH1 = pH1;
    els.pK1 = pK1;
    els.rayH1 = rayH1;
    els.rayK1 = rayK1;
    els.angleClonado = angleClonado;
  };

  const onUpdate = (_board: any, els: any, theme: any, _isStep: any, isHL: any) => {
    els.angleOriginal.setAttribute({ fillOpacity: 0.2, strokeWidth: 2 });
    els.angleClonado.setAttribute({ fillOpacity: 0.2, strokeWidth: 2 });
    els.rayK1.setAttribute({ strokeWidth: 2 });
    els.rayH1.setAttribute({ strokeWidth: 2, strokeColor: theme.pizarra });

    if (isHL('angulo-original')) els.angleOriginal.setAttribute({ fillOpacity: 0.5, strokeWidth: 3 });
    if (isHL('angulo-clonado')) {
      els.angleClonado.setAttribute({ fillOpacity: 0.5, strokeWidth: 3 });
      els.rayK1.setAttribute({ strokeWidth: 4 });
    }
    if (isHL('rayo-h_prime')) els.rayH1.setAttribute({ strokeWidth: 4, strokeColor: theme.salvia });
  };

  return (
    <MathBoard boundingbox={[-5, 5, 5, -5]} onInit={onInit} onUpdate={onUpdate}>
      <div className="absolute bottom-3 left-3 right-3 z-10 text-sm text-center text-carbon/70 font-sans">
        Modifica el ángulo superior; la semirrecta punteada copia el ángulo abajo.
      </div>
    </MathBoard>
  );
};
