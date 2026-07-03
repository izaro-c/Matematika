import { useRef, useEffect } from 'react';
import { getCSSVar } from '@/features/graph/ui/MathUtils';
import JXG from 'jsxgraph';
import { KatexText } from '@/shared/ui/KatexText';

export const AxiomaDedekind = () => {
  const boardRef = useRef<HTMLDivElement>(null);
  const jxgBoard = useRef<any>(null);
  const elementsRef = useRef<Record<string, unknown>>({});

  useEffect(() => {
    if (!boardRef.current) return;

    if (!boardRef.current.id) boardRef.current.id = "jxgbox_" + Math.random().toString(36).substring(2, 9);
    const board = JXG.JSXGraph.initBoard(boardRef.current.id, {
      boundingbox: [-6, 3, 6, -3],
      axis: false,
      showCopyright: false,
      keepaspectratio: true,
      grid: false,
    });
    jxgBoard.current = board;

    // The infinite line (visually)
    const baseLine = board.create('line', [[-10, 0], [10, 0]], { strokeColor: getCSSVar('--theme-pizarra'), strokeWidth: 1, dash: 1 });

    // The Dedekind Cut Point P
    const pP = board.create('glider', [0, 0, baseLine], { 
      name: 'P', 
      size: 8, 
      fillColor: getCSSVar('--theme-terracota'), 
      strokeColor: getCSSVar('--theme-lienzo'), 
      strokeWidth: 3,
      showInfobox: false
    });

    // Class L (Left)
    const pLeft = board.create('point', [-10, 0], { visible: false });
    const rayL = board.create('segment', [pLeft, pP], { 
      strokeColor: getCSSVar('--theme-carbon'), 
      strokeWidth: 6,
      strokeOpacity: 0.8
    });

    // Class R (Right)
    const pRight = board.create('point', [10, 0], { visible: false });
    const rayR = board.create('segment', [pP, pRight], { 
      strokeColor: getCSSVar('--theme-salvia'), 
      strokeWidth: 6,
      strokeOpacity: 0.8
    });

    // Text labels for sets L and R
    board.create('text', [
      () => pP.X() / 2 - 2, 
      0.5, 
      () => '<span style="font-family: serif; font-size: 1.2rem; color:' + getCSSVar('--theme-carbon') + '">Clase L (≤ P)</span>'
    ], { anchorX: 'middle', anchorY: 'bottom' });

    board.create('text', [
      () => pP.X() / 2 + 2, 
      0.5, 
      () => '<span style="font-family: serif; font-size: 1.2rem; color:' + getCSSVar('--theme-salvia') + '">Clase R (&gt; P)</span>'
    ], { anchorX: 'middle', anchorY: 'bottom' });

    // Math representation
    board.create('text', [
      0, 
      -1.5, 
      () => {
        const x = pP.X().toFixed(2);
        return `<div style="font-family: monospace; font-size: 16px; text-align: center; width: 300px; margin-left: -150px; background: rgba(255,255,255,0.7); padding: 10px; border-radius: 8px;">
          L = { x ∈ ℝ | x ≤ ${x} }<br/>
          R = { x ∈ ℝ | x > ${x} }<br/>
          <hr style="margin: 5px 0; border-color: rgba(0,0,0,0.1);" />
          El supremo de L es <span style="color:${getCSSVar('--theme-terracota')}; font-weight: bold;">P = ${x}</span><br/>
          P pertenece a L, pero no a R.
        </div>`;
      }
    ], { anchorX: 'left', anchorY: 'top' });

    elementsRef.current = { pP, rayL, rayR, baseLine, board };

    board.update();
    (board.renderer as any).container.style.backgroundColor = getCSSVar('--theme-lienzo');

    const observer = new MutationObserver(() => {
      if (board) {
        (board.renderer as any).container.style.backgroundColor = getCSSVar('--theme-lienzo');
        board.update();
      }
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

    return () => {
      observer.disconnect();
      JXG.JSXGraph.freeBoard(board);
      jxgBoard.current = null;
      elementsRef.current = {};
    };
  }, []);

  return (
    <div className="w-full flex flex-col items-center my-8">
      <div className="w-full h-full min-h-[350px] relative bg-lienzo/30 border border-carbon/10 shadow-inner rounded-md overflow-hidden">
        <div className="absolute top-4 left-4 z-10 text-[10px] font-sans text-pizarra/60 uppercase tracking-wider bg-lienzo/80 p-2 rounded">
          Arrastra el punto P (Cortadura de Dedekind)
        </div>
        <div ref={boardRef} className="jxgbox w-full h-full touch-none" style={{ width: '100%', height: '400px' }} />
      </div>
      <div className="text-sm font-serif text-carbon/80 italic text-center max-w-xl mt-6 leading-relaxed border-l-2 border-terracota/30 pl-4">
        Toda partición de la recta en dos clases no vacías <KatexText text="$L$" /> y <KatexText text="$R$" /> (donde todo elemento de <KatexText text="$L$" /> precede a los de <KatexText text="$R$" />) define un <strong className="text-terracota">único punto de ruptura <KatexText text="$P$" /></strong>. No puede haber "huecos" (continuidad absoluta).
      </div>
    </div>
  );
};
