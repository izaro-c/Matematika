import { useRef, useEffect } from 'react';
import { getCSSVar } from '@/features/graph/ui/MathUtils';
import JXG from 'jsxgraph';
import { useMathStore } from '@/app/providers/MathStoreContext';
import { useLessonStore } from '@/features/lessons/LessonStore';

export const Paralelas = () => {
  const boardRef = useRef<HTMLDivElement>(null);
  const jxgBoard = useRef<any>(null);
  const elementsRef = useRef<Record<string, unknown>>({});

  const mathHighlight = useMathStore(state => state.variables?.['highlight']);
  const lessonHighlight = useLessonStore(state => state.activeStep);
  const highlight = mathHighlight || lessonHighlight;
  
  const isHighlight = (id: string) => Array.isArray(highlight) ? (highlight as unknown as string[]).includes(id) : highlight === id;

  useEffect(() => {
    if (!boardRef.current) return;

    if (!boardRef.current.id) boardRef.current.id = "jxgbox_" + Math.random().toString(36).substring(2, 9);
    const board = JXG.JSXGraph.initBoard(boardRef.current.id, {
      boundingbox: [-4, 4, 4, -4],
      axis: false,
      showCopyright: false,
      keepaspectratio: true,
      grid: false,
    });
    jxgBoard.current = board;

    const pA = board.create('point', [-3, -2], { visible: false });
    const pB = board.create('point', [3, -1], { visible: false });
    
    const rectaBase = board.create('line', [pA, pB], {
      strokeColor: getCSSVar('--theme-carbon'),
      strokeWidth: 2,
      name: 'l',
      withLabel: true,
      label: { position: 'rt', offset: [10, 10] }
    });

    const puntoP = board.create('point', [-2, 2], {
      name: 'P',
      size: 5,
      fillColor: getCSSVar('--theme-terracota'),
      strokeColor: getCSSVar('--theme-terracota'),
      showInfobox: false,
      fixed: false,
    });

    const rectaParalela = board.create('parallel', [rectaBase, puntoP], {
      strokeColor: getCSSVar('--theme-salvia'),
      strokeWidth: 2,
      name: 'm',
      withLabel: true,
      label: { position: 'rt', offset: [10, 10] }
    });

    elementsRef.current = { rectaBase, puntoP, rectaParalela, board };

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
    const { rectaBase, puntoP, rectaParalela, board } = elementsRef.current as Record<string, any>;
    if (!board) return;

    // Reset styles
    puntoP.setAttribute({ size: 5, fillColor: getCSSVar('--theme-terracota'), strokeColor: getCSSVar('--theme-terracota'), fillOpacity: 1, strokeOpacity: 1 });
    rectaBase.setAttribute({ strokeWidth: 2, strokeColor: getCSSVar('--theme-carbon'), strokeOpacity: 1 });
    rectaParalela.setAttribute({ strokeWidth: 2, strokeColor: getCSSVar('--theme-salvia'), strokeOpacity: 1 });

    const hBase = isHighlight('recta-base');
    const hPar = isHighlight('recta-paralela');
    const hP = isHighlight('punto-p');
    const showAll = !hBase && !hPar && !hP;

    // Apply highlights
    rectaBase.setAttribute({
      strokeOpacity: hBase || showAll ? 1 : 0.3,
      strokeWidth: hBase ? 4 : 2,
      strokeColor: hBase ? getCSSVar('--theme-ocre') : getCSSVar('--theme-carbon')
    });
    
    rectaParalela.setAttribute({
      strokeOpacity: hPar || showAll ? 1 : 0.3,
      strokeWidth: hPar ? 4 : 2,
      strokeColor: hPar ? getCSSVar('--theme-ocre') : getCSSVar('--theme-salvia')
    });
    
    puntoP.setAttribute({
      strokeOpacity: hP || showAll ? 1 : 0.3,
      fillOpacity: hP || showAll ? 1 : 0.3,
      size: hP ? 8 : 5,
      fillColor: hP ? getCSSVar('--theme-ocre') : getCSSVar('--theme-terracota'),
      strokeColor: hP ? getCSSVar('--theme-ocre') : getCSSVar('--theme-terracota')
    });

    board.update();
  }, [highlight]);

  return (
    <div className="w-full h-full min-h-[300px] relative bg-lienzo/40 border border-pizarra/10 rounded-sm overflow-hidden">
      <div className="absolute top-2 left-3 z-10 text-xs font-serif italic text-pizarra/50">
        Arrastra el punto <span className="font-bold not-italic text-terracota">P</span> para cambiar la posición de la paralela
      </div>
      <div ref={boardRef} className="w-full h-full touch-none" />
    </div>
  );
};
