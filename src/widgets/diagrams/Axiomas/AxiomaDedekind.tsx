import { MathBoard } from '@/shared/diagrams/core/MathBoard';
import {
  createPoint, createLine, createSegment, createGlider
} from '@/shared/diagrams/core/MathFactory';



import { KatexText } from '@/shared/ui/KatexText';

export const AxiomaDedekind = () => {




  const onInit = (board: any, els: any, theme: any) => {
      void board; void els; void theme;
      // The infinite line (visually)
    const baseLine = createLine(board, [[-10, 0], [10, 0]], { strokeColor: theme.pizarra, strokeWidth: 1, dash: 1 }, theme);

    // The Dedekind Cut Point P
    const pP = createGlider(board, [0, 0, baseLine], {
      name: 'P',
      size: 8,
      fillColor: theme.terracota,
      strokeColor: theme.lienzo,
      strokeWidth: 3,
      showInfobox: false
    }, theme);

    // Class L (Left)
    const pLeft = createPoint(board, [-10, 0], { visible: false }, theme);
    const rayL = createSegment(board, [pLeft, pP], {
      strokeColor: theme.carbon,
      strokeWidth: 6,
      strokeOpacity: 0.8
    }, theme);

    // Class R (Right)
    const pRight = createPoint(board, [10, 0], { visible: false }, theme);
    const rayR = createSegment(board, [pP, pRight], {
      strokeColor: theme.salvia,
      strokeWidth: 6,
      strokeOpacity: 0.8
    }, theme);

    // Text labels for sets L and R
    board.create('text', [
      () => pP.X() / 2 - 2,
      0.5,
      () => '<span style="font-family: serif; font-size: 1.2rem; color:' + theme.carbon + '">Clase L (≤ P)</span>'
    ], { anchorX: 'middle', anchorY: 'bottom' });

    board.create('text', [
      () => pP.X() / 2 + 2,
      0.5,
      () => '<span style="font-family: serif; font-size: 1.2rem; color:' + theme.salvia + '">Clase R (&gt; P)</span>'
    ], { anchorX: 'middle', anchorY: 'bottom' });

    // Math representation
    board.create('text', [
      0,
      -1.5,
      () => {
        const x = pP.X().toFixed(2);
        return `<div style="font-family: monospace; font-size: 16px; text-align: center; width: 300px; margin-left: -150px; background: color-mix(in srgb, ${theme.lienzo} 85%, transparent); padding: 10px; border-radius: 8px;">
          L = { x ∈ ℝ | x ≤ ${x} }<br/>
          R = { x ∈ ℝ | x > ${x} }<br/>
          <hr style="margin: 5px 0; border-color: color-mix(in srgb, ${theme.carbon} 10%, transparent);" />
          El supremo de L es <span style="color:${theme.terracota}; font-weight: bold;">P = ${x}</span><br/>
          P pertenece a L, pero no a R.
        </div>`;
      }
    ], { anchorX: 'left', anchorY: 'top' });

      // Registrar elementos para interactividad y auditoría
      els.pP = pP;
        els.rayL = rayL;
        els.rayR = rayR;
        els.baseLine = baseLine;
    };;

  return (
    <MathBoard
      boundingbox={[-6, 3, 6, -3]}
      axis={false}
      grid={false}
      onInit={onInit}

    >
      <div className="w-full h-full min-h-[350px] relative bg-lienzo/30 border border-carbon/10 shadow-inner rounded-md overflow-hidden">
        <div className="absolute top-4 left-4 z-10 text-[10px] font-sans text-pizarra/60 uppercase tracking-wider bg-lienzo/80 p-2 rounded">
          Arrastra el punto P (Cortadura de Dedekind)
        </div>

      </div>
      <div className="text-sm font-serif text-carbon/80 italic text-center max-w-xl mt-6 leading-relaxed border-l-2 border-terracota/30 pl-4">
        Toda partición de la recta en dos clases no vacías <KatexText text="$L$" /> y <KatexText text="$R$" /> (donde todo elemento de <KatexText text="$L$" /> precede a los de <KatexText text="$R$" />) define un <strong className="text-terracota">único punto de ruptura <KatexText text="$P$" /></strong>. No puede haber "huecos" (continuidad absoluta).
      </div>
    </MathBoard>
  );
};
