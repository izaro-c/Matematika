import { useRef, useEffect } from 'react';
import JXG from 'jsxgraph';
import { useMathStore } from '../../store/MathStoreContext';
import { useLessonStore } from '../../store/LessonStore';

function getCSSVar(name: string): string {
  if (typeof document !== 'undefined') return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  return '#000';
}

export const Order2 = () => {
  const boardRef = useRef<HTMLDivElement>(null);
  const jxgBoard = useRef<any>(null);
  const elementsRef = useRef<Record<string, unknown>>({});
  const mathHighlight = useMathStore(state => state.variables?.['highlight']);
  const lessonHighlight = useLessonStore(state => state.activeStep);
  const highlight = mathHighlight || lessonHighlight;

  useEffect(() => {
    if (!boardRef.current) return;
    const board = JXG.JSXGraph.initBoard(boardRef.current.id, {
      boundingbox: [-5, 2, 5, -2], axis: false, showCopyright: false, keepaspectratio: true,
    });
    jxgBoard.current = board;

    const line = board.create('line', [[-10, 0], [10, 0]], {
      name: 'l', withLabel: true, label: { position: 'bot', offset: [-15, -15], strokeColor: getCSSVar('--theme-carbon'), fontSize: 16 },
      strokeColor: getCSSVar('--theme-carbon'), strokeWidth: 2, straightFirst: true, straightLast: true,
    });

    const pA = board.create('glider', [-2, 0, line], {
      name: 'A', size: 5, fillColor: getCSSVar('--theme-terracota'), strokeColor: getCSSVar('--theme-terracota'), showInfobox: false,
    });
    const pC = board.create('glider', [2, 0, line], {
      name: 'C', size: 5, fillColor: getCSSVar('--theme-terracota'), strokeColor: getCSSVar('--theme-terracota'), showInfobox: false,
    });
    
    const seg = board.create('segment', [pA, pC], { visible: false });
    const pB = board.create('glider', [0, 0, seg], {
      name: 'B', size: 5, fillColor: getCSSVar('--theme-ocre'), strokeColor: getCSSVar('--theme-ocre'), showInfobox: false,
    });

    elementsRef.current = { line, pA, pB, pC, board };

    return () => {
      JXG.JSXGraph.freeBoard(board);
      jxgBoard.current = null;
    };
  }, []);

  useEffect(() => {
    const { pA, pB, pC, board } = elementsRef.current as Record<string, any>;
    if (!board) return;

    [pA, pC].forEach(p => p.setAttribute({ fillColor: getCSSVar('--theme-terracota'), strokeColor: getCSSVar('--theme-terracota'), size: 5 }));
    pB.setAttribute({ fillColor: getCSSVar('--theme-ocre'), strokeColor: getCSSVar('--theme-ocre'), size: 5 });

    if (highlight === 'pA') pA.setAttribute({ fillColor: getCSSVar('--theme-salvia'), strokeColor: getCSSVar('--theme-salvia'), size: 8 });
    if (highlight === 'pB') pB.setAttribute({ fillColor: getCSSVar('--theme-salvia'), strokeColor: getCSSVar('--theme-salvia'), size: 8 });
    if (highlight === 'pC') pC.setAttribute({ fillColor: getCSSVar('--theme-salvia'), strokeColor: getCSSVar('--theme-salvia'), size: 8 });

    board.update();
  }, [highlight]);

  return (
    <div className="w-full h-full min-h-[250px] relative bg-lienzo/30 border border-pizarra/10 rounded-sm">
      <div ref={boardRef} className="w-full h-full touch-none" />
    </div>
  );
};
