import { useRef, useEffect } from 'react';
import JXG from 'jsxgraph';
import { useMathStore } from '../../store/MathStoreContext';
import { useLessonStore } from '../../store/LessonStore';

function getCSSVar(name: string): string {
  if (typeof document !== 'undefined') return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  return '#000';
}

export const Order1 = () => {
  const boardRef = useRef<HTMLDivElement>(null);
  const jxgBoard = useRef<any>(null);
  const elementsRef = useRef<Record<string, unknown>>({});
  const mathHighlight = useMathStore(state => state.variables?.['highlight']);
  const lessonHighlight = useLessonStore(state => state.activeStep);
  const highlight = mathHighlight || lessonHighlight;

  useEffect(() => {
    if (!boardRef.current) return;
    if (!boardRef.current.id) boardRef.current.id = "jxgbox_" + Math.random().toString(36).substring(2, 9);
      const board = JXG.JSXGraph.initBoard(boardRef.current.id, {
      boundingbox: [-5, 2, 5, -2], axis: false, showCopyright: false, keepaspectratio: true,
    });
    jxgBoard.current = board;

    const line = board.create('line', [[-10, 0], [10, 0]], {
      name: 'l', withLabel: true, label: { position: 'bot', offset: [-15, -15], strokeColor: getCSSVar('--theme-carbon'), fontSize: 16 },
      strokeColor: getCSSVar('--theme-carbon'), strokeWidth: 2, straightFirst: true, straightLast: true,
    });

    const pA = board.create('glider', [-3, 0, line], {
      name: 'A', size: 5, fillColor: getCSSVar('--theme-terracota'), strokeColor: getCSSVar('--theme-terracota'), showInfobox: false,
    });
    const pC = board.create('glider', [3, 0, line], {
      name: 'C', size: 5, fillColor: getCSSVar('--theme-terracota'), strokeColor: getCSSVar('--theme-terracota'), showInfobox: false,
    });
    
    const seg = board.create('segment', [pA, pC], { visible: false });
    const pB = board.create('glider', [0, 0, seg], {
      name: 'B', size: 5, fillColor: getCSSVar('--theme-terracota'), strokeColor: getCSSVar('--theme-terracota'), showInfobox: false,
    });

    elementsRef.current = { line, pA, pB, pC, board };

    return () => {
      JXG.JSXGraph.freeBoard(board);
      jxgBoard.current = null;
    };
  }, []);

  useEffect(() => {
    const { line, pA, pB, pC, board } = elementsRef.current as Record<string, any>;
    if (!board) return;

    line.setAttribute({ strokeColor: highlight === 'line' ? getCSSVar('--theme-ocre') : getCSSVar('--theme-carbon'), strokeWidth: highlight === 'line' ? 4 : 2 });
    
    [pA, pB, pC].forEach(p => p.setAttribute({ fillColor: getCSSVar('--theme-terracota'), strokeColor: getCSSVar('--theme-terracota'), size: 5 }));
    
    if (highlight === 'pA') pA.setAttribute({ fillColor: getCSSVar('--theme-ocre'), strokeColor: getCSSVar('--theme-ocre'), size: 8 });
    if (highlight === 'pB') pB.setAttribute({ fillColor: getCSSVar('--theme-ocre'), strokeColor: getCSSVar('--theme-ocre'), size: 8 });
    if (highlight === 'pC') pC.setAttribute({ fillColor: getCSSVar('--theme-ocre'), strokeColor: getCSSVar('--theme-ocre'), size: 8 });

    board.update();
  }, [highlight]);

  return (
    <div className="w-full h-full min-h-[250px] relative bg-lienzo/30 border border-pizarra/10 rounded-sm">
      <div className="absolute top-3 left-3 z-10 text-[10px] font-sans text-pizarra/50 uppercase tracking-wider">
        Desplaza el punto B
      </div>
      <div ref={boardRef} className="w-full h-full touch-none" />
    </div>
  );
};
