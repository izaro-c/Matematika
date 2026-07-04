import { useRef, useEffect, useState } from 'react';
import { getCSSVar } from '@/features/graph/ui/MathUtils';
import JXG from 'jsxgraph';
import { KatexText } from '@/shared/ui/KatexText';
import { useMathStore } from '@/app/providers/MathStoreContext';

export const AxiomaArquimedes = () => {
  const boardRef = useRef<HTMLDivElement>(null);
  const jxgBoard = useRef<any>(null);
  const elementsRef = useRef<Record<string, unknown>>({});
  const [multiplier, setMultiplier] = useState(1);
  const [maxSlider, setMaxSlider] = useState(15);

  const highlight = useMathStore(state => state.variables?.['highlight']);

  useEffect(() => {
    if (!boardRef.current) return;

    if (!boardRef.current.id) boardRef.current.id = "jxgbox_" + Math.random().toString(36).substring(2, 9);
    const board = JXG.JSXGraph.initBoard(boardRef.current.id, {
      boundingbox: [-1, 5, 12, -2],
      axis: false,
      showCopyright: false,
      keepaspectratio: true,
      grid: false,
    });
    jxgBoard.current = board;

    // Segment CD (the large segment we want to surpass)
    const pC = board.create('point', [0, 3], { name: 'C', size: 4, fillColor: getCSSVar('--theme-carbon'), strokeColor: getCSSVar('--theme-carbon'), fixed: true });
    const pD = board.create('point', [8, 3], { name: 'D', size: 4, fillColor: getCSSVar('--theme-carbon'), strokeColor: getCSSVar('--theme-carbon'), fixed: true });
    board.create('segment', [pC, pD], { strokeColor: getCSSVar('--theme-carbon'), strokeWidth: 3 });

    // Segment AB (the small segment we will copy)
    const pA = board.create('point', [0, 1], { name: 'A', size: 4, fillColor: getCSSVar('--theme-salvia'), strokeColor: getCSSVar('--theme-salvia'), fixed: true });
    const pB = board.create('point', [1.5, 1], { name: 'B', size: 4, fillColor: getCSSVar('--theme-salvia'), strokeColor: getCSSVar('--theme-salvia'), fixed: false });
    board.create('segment', [pA, pB], { strokeColor: getCSSVar('--theme-salvia'), strokeWidth: 3 });

    // Baseline for the copies
    board.create('line', [[0, -0.5], [1, -0.5]], { strokeColor: getCSSVar('--theme-pizarra'), strokeWidth: 1, dash: 2 });
    
    // Projection line from D to visually compare surpassing
    board.create('line', [[() => pD.X(), 4], [() => pD.X(), -2]], { strokeColor: getCSSVar('--theme-carbon'), strokeWidth: 1, dash: 1 });

    elementsRef.current = { pA, pB, pC, pD, board, copies: [] };

    pB.on('drag', () => {
      const lenAB = Math.max(0.05, pB.X() - pA.X());
      const lenCD = pD.X() - pC.X();
      const needed = Math.ceil(lenCD / lenAB) + 5;
      setMaxSlider(Math.max(15, needed));
    });

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

  useEffect(() => {
    const { board, pA, pB, pC, pD } = elementsRef.current as any;
    if (!board) return;

    // Remove old copies
    const copies = (elementsRef.current as any).copies || [];
    copies.forEach((c: any) => board.removeObject(c));
    (elementsRef.current as any).copies = [];

    const newCopies = [];
    
    for (let i = 0; i < multiplier; i++) {
      const p1 = board.create('point', [
        () => i * (Math.max(0.1, pB.X() - pA.X())), -0.5
      ], { name: '', size: 3, fillColor: getCSSVar('--theme-salvia'), strokeColor: getCSSVar('--theme-salvia'), fixed: true });
      
      const p2 = board.create('point', [
        () => (i + 1) * (Math.max(0.1, pB.X() - pA.X())), -0.5
      ], { name: i === multiplier - 1 ? 'n·B' : '', size: 3, fillColor: getCSSVar('--theme-salvia'), strokeColor: getCSSVar('--theme-salvia'), fixed: true });
      
      const isSurpassing = () => ((i + 1) * (Math.max(0.1, pB.X() - pA.X())) > (pD.X() - pC.X()));
      
      const seg = board.create('segment', [p1, p2], { 
        strokeColor: () => isSurpassing() ? getCSSVar('--theme-terracota') : getCSSVar('--theme-salvia'), 
        strokeWidth: 5 
      });
      
      newCopies.push(p1, p2, seg);
    }

    (elementsRef.current as any).copies = newCopies;
    board.update();
  }, [multiplier]);

  useEffect(() => {
    const { pA, pC, board } = elementsRef.current as any;
    if (!board || !pA || !pC) return;

    pA.setAttribute({ size: 4, fillColor: getCSSVar('--theme-salvia'), strokeColor: getCSSVar('--theme-salvia') });
    pC.setAttribute({ size: 4, fillColor: getCSSVar('--theme-carbon'), strokeColor: getCSSVar('--theme-carbon') });

    if (highlight === 'pA') pA.setAttribute({ size: 8, fillColor: getCSSVar('--theme-ocre'), strokeColor: getCSSVar('--theme-ocre') });
    if (highlight === 'pC') pC.setAttribute({ size: 8, fillColor: getCSSVar('--theme-ocre'), strokeColor: getCSSVar('--theme-ocre') });

    board.update();
  }, [highlight]);

  return (
    <div className="w-full flex flex-col items-center">
      <div className="w-full h-full min-h-[300px] relative bg-lienzo/30 border border-carbon/10">
        <div className="absolute top-3 left-3 z-10 text-[10px] font-sans text-pizarra/60 uppercase tracking-wider">
          Arrastra el punto B. Mueve el deslizador.
        </div>
        <div ref={boardRef} className="jxgbox w-full h-full touch-none" style={{ width: '100%', height: '400px' }} />
      </div>
      <div className="flex items-center gap-4 mt-6 mb-2">
        <span className="font-serif text-carbon uppercase tracking-widest text-sm">Multiplicador <KatexText text="$n$" />: <strong className="page-accent-text text-lg">{multiplier}</strong></span>
        <input 
          type="range" 
          min="1" max={maxSlider} 
          value={multiplier} 
          onChange={(e) => setMultiplier(parseInt(e.target.value))}
          className="page-accent-range w-64 h-px bg-carbon/40 appearance-none cursor-grab active:cursor-grabbing [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-[6px] [&::-webkit-slider-thumb]:h-[16px] [&::-webkit-slider-thumb]:transition-colors"
        />
      </div>
      <div className="text-sm font-serif text-carbon/80 italic text-center max-w-lg mt-4 leading-relaxed">
        Observa cómo, sin importar lo pequeño que sea el segmento <KatexText text={"$\\overline{AB}$"} />, siempre existe un multiplicador finito <KatexText text={"$n$"} /> tal que <KatexText text={"$n \\cdot \\overline{AB} > \\overline{CD}$"} /> (marcado en terracota).
      </div>
    </div>
  );
};
