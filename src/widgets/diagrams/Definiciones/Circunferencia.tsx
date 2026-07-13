import { MathBoard } from '@/shared/diagrams/core/MathBoard';
import {
  createPoint, createSegment, createGlider, createCircle
} from '@/shared/diagrams/core/MathFactory';






export const Circunferencia = () => {










  const onInit = (board: any, els: any, theme: any) => {
      void board; void els; void theme;
      const O = createPoint(board, [0, 0], {
      name: 'O',
      size: 5,
      fillColor: theme.carbon,
      strokeColor: theme.carbon,
      showInfobox: false,
      fixed: false,
    }, theme);

    const P = createPoint(board, [3, 0], {
      name: 'P',
      size: 5,
      fillColor: theme.terracota,
      strokeColor: theme.terracota,
      showInfobox: false,
      fixed: false,
    }, theme);

    const circ = createCircle(board, [O, P], {
      strokeColor: theme.terracota,
      strokeWidth: 2,
      fillColor: theme.salvia,
      fillOpacity: 0,
    }, theme);

    const radio = createSegment(board, [O, P], {
      strokeColor: theme.pizarra,
      strokeWidth: 2,
      dash: 2,
      name: 'r',
      withLabel: true,
      label: { position: 'top' }
    }, theme);

    // Elementos Notables (invisibles por defecto)
    const diamP = board.create('point', [
      function() { return O.X() - (P.X() - O.X()); },
      function() { return O.Y() - (P.Y() - O.Y()); }
    ], { visible: false });

    const diametro = createSegment(board, [diamP, P], {
      strokeColor: theme.salvia,
      strokeWidth: 3,
      visible: false
    }, theme);

    const cuerdaP1 = createGlider(board, [0, 3, circ], { visible: false }, theme);
    const cuerdaP2 = createGlider(board, [-2, 2.23, circ], { visible: false }, theme);
    const cuerda = createSegment(board, [cuerdaP1, cuerdaP2], {
      strokeColor: theme.ocre,
      strokeWidth: 3,
      visible: false
    }, theme);

    const arcoP1 = createGlider(board, [-3, 0, circ], { visible: false }, theme);
    const arcoP2 = createGlider(board, [0, -3, circ], { visible: false }, theme);
    const arco = board.create('arc', [O, arcoP1, arcoP2], {
      strokeColor: theme.salvia,
      strokeWidth: 4,
      visible: false
    });

    const tangenteP = createGlider(board, [0, 3, circ], { visible: false }, theme);
    const tangente = board.create('tangent', [tangenteP], {
      strokeColor: theme.carbon,
      strokeWidth: 2,
      visible: false
    });

      // Registrar elementos para interactividad y auditoría
      els.O = O;
        els.P = P;
        els.circ = circ;
        els.radio = radio;
        els.diametro = diametro;
        els.cuerda = cuerda;
        els.arco = arco;
        els.tangente = tangente;
    };;

  const onUpdate = (board: any, els: any, theme: any, isStep: any, isHL: any) => {
      const isHighlight = isHL;
      void board; void els; void theme; void isStep; void isHL; void isHighlight;
      const { O, P, circ, radio, diametro, cuerda, arco, tangente } = els;
      // Reset base styles
    O.setAttribute({ size: 5, fillColor: theme.carbon, strokeColor: theme.carbon });
    P.setAttribute({ size: 5, fillColor: theme.terracota, strokeColor: theme.terracota });
    circ.setAttribute({ fillOpacity: 0, strokeWidth: 2, strokeColor: theme.terracota });
    radio.setAttribute({ strokeWidth: 2, strokeColor: theme.pizarra });

    // Hide notable elements by default
    diametro.setAttribute({ visible: false });
    cuerda.setAttribute({ visible: false });
    arco.setAttribute({ visible: false });
    tangente.setAttribute({ visible: false });

    // Highlight logic
    if (isHighlight('centro')) {
      O.setAttribute({ size: 9, fillColor: theme.ocre, strokeColor: theme.ocre });
    }
    if (isHighlight('circunferencia')) {
      circ.setAttribute({ strokeWidth: 4 });
    }
    if (isHighlight('circulo')) {
      circ.setAttribute({ fillOpacity: 0.15 });
    }
    if (isHighlight('radio')) {
      radio.setAttribute({ strokeWidth: 4, strokeColor: theme.ocre });
    }

    // Show notable elements if requested
    if (isHighlight('diametro')) {
      diametro.setAttribute({ visible: true });
    }
    if (isHighlight('cuerda')) {
      cuerda.setAttribute({ visible: true });
    }
    if (isHighlight('arco')) {
      arco.setAttribute({ visible: true });
    }
    if (isHighlight('tangente')) {
      tangente.setAttribute({ visible: true });
    }
    };;

  return (
    <MathBoard
      boundingbox={[-5, 5, 5, -5]}
      axis={false}
      grid={false}
      onInit={onInit}
      onUpdate={onUpdate}
    >
      <div className="absolute top-2 left-3 z-10 text-xs font-serif italic text-pizarra/50">
        Arrastra el centro <span className="font-bold not-italic text-carbon">O</span> o el punto <span className="font-bold not-italic text-terracota">P</span>
      </div>
    </MathBoard>
  );
};
