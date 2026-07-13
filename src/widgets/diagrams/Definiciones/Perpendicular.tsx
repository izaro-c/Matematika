import { MathBoard } from '@/shared/diagrams/core/MathBoard';
import {
  createPoint, createLine, createGlider
} from '@/shared/diagrams/core/MathFactory';






export const Perpendicular = () => {










  const onInit = (board: any, els: any, theme: any) => {
      void board; void els; void theme;
      const pA = createPoint(board, [-3, -1], { visible: false }, theme);
    const pB = createPoint(board, [3, 1], { visible: false }, theme);

    const recta1 = createLine(board, [pA, pB], {
      strokeColor: theme.carbon,
      strokeWidth: 2,
      name: 'l_1',
      withLabel: true,
      label: { position: 'rt', offset: [10, 10] }
    }, theme);

    const puntoC = createGlider(board, [0, 0, recta1], {
      name: 'P',
      size: 5,
      fillColor: theme.terracota,
      strokeColor: theme.terracota,
      showInfobox: false,
      fixed: false,
    }, theme);

    const recta2 = board.create('perpendicular', [recta1, puntoC], {
      strokeColor: theme.carbon,
      strokeWidth: 2,
      name: 'l_2',
      withLabel: true,
      label: { position: 'rt', offset: [10, 10] }
    });

    // Angle representation points
    const p1 = createGlider(board, [2, 2/3, recta1], { visible: false }, theme);
    const p2 = createGlider(board, [-2, -2/3, recta1], { visible: false }, theme);
    const p3 = createGlider(board, [-1, 3, recta2], { visible: false }, theme);
    const p4 = createGlider(board, [1, -3, recta2], { visible: false }, theme);

    // Angles
    const angProps = { color: theme.salvia, radius: 1, type: 'sectordot', fillOpacity: 0.1, strokeOpacity: 0.5 };
    const a1 = board.create('angle', [p1, puntoC, p3], angProps);
    const a2 = board.create('angle', [p3, puntoC, p2], angProps);
    const a3 = board.create('angle', [p2, puntoC, p4], angProps);
    const a4 = board.create('angle', [p4, puntoC, p1], angProps);

      // Registrar elementos para interactividad y auditoría
      els.recta1 = recta1;
        els.puntoC = puntoC;
        els.recta2 = recta2;
        els.a1 = a1;
        els.a2 = a2;
        els.a3 = a3;
        els.a4 = a4;
    };;

  const onUpdate = (board: any, els: any, theme: any, isStep: any, isHL: any) => {
      const isHighlight = isHL;
      void board; void els; void theme; void isStep; void isHL; void isHighlight;
      const { recta1, puntoC, recta2, a1, a2, a3, a4 } = els;
      // Reset styles
    recta1.setAttribute({ strokeWidth: 2, strokeColor: theme.carbon, strokeOpacity: 1 });
    recta2.setAttribute({ strokeWidth: 2, strokeColor: theme.carbon, strokeOpacity: 1 });
    puntoC.setAttribute({ size: 5, fillColor: theme.terracota, strokeColor: theme.terracota });

    [a1, a2, a3, a4].forEach(a => {
      a.setAttribute({ fillOpacity: 0.1, strokeOpacity: 0.5, strokeColor: theme.salvia, fillColor: theme.salvia });
    });

    const hR1 = isHighlight('recta');
    const hR2 = isHighlight('perpendicular');
    const hAng = isHighlight('angulos-rectos');
    const showAllRectas = !hR1 && !hR2;

    recta1.setAttribute({
      strokeOpacity: hR1 || showAllRectas ? 1 : 0.3,
      strokeWidth: hR1 ? 4 : 2,
      strokeColor: hR1 ? theme.ocre : theme.carbon
    });

    recta2.setAttribute({
      strokeOpacity: hR2 || showAllRectas ? 1 : 0.3,
      strokeWidth: hR2 ? 4 : 2,
      strokeColor: hR2 ? theme.ocre : theme.carbon
    });

    if (hAng) {
      [a1, a2, a3, a4].forEach(a => {
        a.setAttribute({ fillOpacity: 0.4, strokeOpacity: 1, strokeColor: theme.ocre, fillColor: theme.ocre });
      });
    }
    };;

  return (
    <MathBoard
      boundingbox={[-4, 4, 4, -4]}
      axis={false}
      grid={false}
      onInit={onInit}
      onUpdate={onUpdate}
    >
      <div className="absolute top-2 left-3 z-10 text-xs font-serif italic text-pizarra/50">
        Arrastra el punto de intersección <span className="font-bold not-italic text-terracota">P</span>
      </div>
    </MathBoard>
  );
};
