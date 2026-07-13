import { MathBoard } from '@/shared/diagrams/core/MathBoard';
import {
  createPoint, createLine
} from '@/shared/diagrams/core/MathFactory';






export const Paralelas = () => {










  const onInit = (board: any, els: any, theme: any) => {
      void board; void els; void theme;
      const pA = createPoint(board, [-3, -2], { visible: false }, theme);
    const pB = createPoint(board, [3, -1], { visible: false }, theme);

    const rectaBase = createLine(board, [pA, pB], {
      strokeColor: theme.carbon,
      strokeWidth: 2,
      name: 'l',
      withLabel: true,
      label: { position: 'rt', offset: [10, 10] }
    }, theme);

    const puntoP = createPoint(board, [-2, 2], {
      name: 'P',
      size: 5,
      fillColor: theme.terracota,
      strokeColor: theme.terracota,
      showInfobox: false,
      fixed: false,
    }, theme);

    const rectaParalela = board.create('parallel', [rectaBase, puntoP], {
      strokeColor: theme.salvia,
      strokeWidth: 2,
      name: 'm',
      withLabel: true,
      label: { position: 'rt', offset: [10, 10] }
    });

      // Registrar elementos para interactividad y auditoría
      els.rectaBase = rectaBase;
        els.puntoP = puntoP;
        els.rectaParalela = rectaParalela;
    };;

  const onUpdate = (board: any, els: any, theme: any, isStep: any, isHL: any) => {
      const isHighlight = isHL;
      void board; void els; void theme; void isStep; void isHL; void isHighlight;
      const { rectaBase, puntoP, rectaParalela } = els;
      // Reset styles
    puntoP.setAttribute({ size: 5, fillColor: theme.terracota, strokeColor: theme.terracota, fillOpacity: 1, strokeOpacity: 1 });
    rectaBase.setAttribute({ strokeWidth: 2, strokeColor: theme.carbon, strokeOpacity: 1 });
    rectaParalela.setAttribute({ strokeWidth: 2, strokeColor: theme.salvia, strokeOpacity: 1 });

    const hBase = isHighlight('recta-base');
    const hPar = isHighlight('recta-paralela');
    const hP = isHighlight('punto-p');
    const showAll = !hBase && !hPar && !hP;

    // Apply highlights
    rectaBase.setAttribute({
      strokeOpacity: hBase || showAll ? 1 : 0.3,
      strokeWidth: hBase ? 4 : 2,
      strokeColor: hBase ? theme.ocre : theme.carbon
    });

    rectaParalela.setAttribute({
      strokeOpacity: hPar || showAll ? 1 : 0.3,
      strokeWidth: hPar ? 4 : 2,
      strokeColor: hPar ? theme.ocre : theme.salvia
    });

    puntoP.setAttribute({
      strokeOpacity: hP || showAll ? 1 : 0.3,
      fillOpacity: hP || showAll ? 1 : 0.3,
      size: hP ? 8 : 5,
      fillColor: hP ? theme.ocre : theme.terracota,
      strokeColor: hP ? theme.ocre : theme.terracota
    });
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
        Arrastra el punto <span className="font-bold not-italic text-terracota">P</span> para cambiar la posición de la paralela
      </div>
    </MathBoard>
  );
};
