import React, { useEffect, useId, useLayoutEffect, useRef } from 'react';
import JXG from 'jsxgraph';
import { useMathStore } from '@/lib/page-context/MathStoreContext';
import { matchesScopedDiagramTarget } from '@/lib/page-context/DiagramTargetRegistryContext';
import { syncBoardToContainerSize, readLayoutBoxSize } from '@/diagrams/jsxgraph/mathBoardContainerSize';
import {
  contentBoundsFromSafeArea,
  fitBoundsToSafeArea,
  type DiagramBounds,
  type MathBoardSafeArea,
} from '@/diagrams/jsxgraph/mathBoardViewport';
import { safeBoardUpdate } from '@/diagrams/jsxgraph/MathUtils';
import type { ThemeColors } from '@/diagrams/jsxgraph/theme';
import { useDiagramPaintReport } from '@/components/ui/skeletons';
import { syncDiagramTextScale } from '@/diagrams/diagramTextScale';

export type { DiagramBounds, MathBoardSafeArea };
export {
  contentBoundsFromSafeArea,
  fitBoundsToAspect,
  fitBoundsToSafeArea,
} from '@/diagrams/jsxgraph/mathBoardViewport';
export { syncBoardToContainerSize, readLayoutBoxSize } from '@/diagrams/jsxgraph/mathBoardContainerSize';

function getCSSVar(name: keyof ThemeColors): string {
  if (typeof document === 'undefined') return '';
  return getComputedStyle(document.documentElement)
    .getPropertyValue(`--theme-${name}`)
    .trim();
}

function getTheme(): ThemeColors {
  return {
    carbon: getCSSVar('carbon'),
    terracota: getCSSVar('terracota'),
    salvia: getCSSVar('salvia'),
    lienzo: getCSSVar('lienzo'),
    pizarra: getCSSVar('pizarra'),
    ocre: getCSSVar('ocre'),
    pavo: getCSSVar('pavo'),
    granada: getCSSVar('granada'),
    musgo: getCSSVar('musgo'),
  };
}

export interface MathBoardProps {
  id?: string;
  className?: string;
  boundingbox?: [number, number, number, number];
  keepaspectratio?: boolean;
  axis?: boolean;
  grid?: boolean;
  pan?: boolean;
  zoom?: boolean;
  revision?: string;
  /** Cambia cuando varía el apilamiento; fuerza un repintado sin reiniciar el board. */
  stackRevision?: string;
  scopeId?: string;
  onBoundingBoxChange?: (bounds: [number, number, number, number]) => void;
  onInit: (board: any, elements: Record<string, any>, theme: ThemeColors) => void;
  onUpdate?: (
    board: any,
    elements: Record<string, any>,
    theme: ThemeColors,
    isStep: (id: string) => boolean,
    isHL: (id: string) => boolean,
  ) => void;
  children?: React.ReactNode;
  borderWidth?: number | string;
  borderColor?: string;
  borderRadius?: number | string;
  ariaLabel?: string;
  keyboardInstructions?: string;
  safeArea?: MathBoardSafeArea;
  /** Área usada por anotaciones ligadas al viewport; no altera la escala geométrica. */
  viewportSafeArea?: MathBoardSafeArea;
}

export const MathBoard: React.FC<MathBoardProps> = ({
  id,
  className = 'relative min-h-[350px] w-full overflow-hidden',
  boundingbox = [-5, 5, 5, -5],
  keepaspectratio = true,
  axis = false,
  grid = false,
  pan = false,
  zoom = false,
  revision = '',
  stackRevision = '',
  scopeId = '',
  onBoundingBoxChange,
  onInit,
  onUpdate,
  children,
  borderWidth = 2,
  borderColor = 'var(--page-accent, var(--theme-pizarra))',
  borderRadius = 20,
  ariaLabel = 'Diagrama matemático interactivo',
  keyboardInstructions = 'Use Tab para recorrer los objetos interactivos. En puntos móviles y deslizadores, use las flechas para cambiar el valor.',
  safeArea,
  viewportSafeArea,
}) => {
  const reportPaint = useDiagramPaintReport();
  const reportPaintRef = useRef(reportPaint);
  const containerRef = useRef<HTMLDivElement>(null);
  const boardRef = useRef<HTMLDivElement>(null);
  const boardObj = useRef<any>(null);
  const elementsRef = useRef<Record<string, any>>({});
  const onInitRef = useRef(onInit);
  const onUpdateRef = useRef(onUpdate);
  const onBoundingBoxChangeRef = useRef(onBoundingBoxChange);
  const boundingboxRef = useRef(boundingbox);
  const safeAreaRef = useRef<MathBoardSafeArea>(safeArea ?? {});
  const viewportSafeAreaRef = useRef<MathBoardSafeArea>(viewportSafeArea ?? safeArea ?? {});
  const highlight = useMathStore(state => state.variables?.[scopeId ? `highlight:${scopeId}` : 'highlight'] ?? state.variables?.['highlight']);
  const step = useMathStore(state => (scopeId && state.variables?.[`step:${scopeId}`])
    ? state.variables?.[`step:${scopeId}`]
    : state.variables?.['step']);
  const highlightRef = useRef(highlight);
  const stepRef = useRef(step);
  const generatedId = useId().replace(/:/g, '');
  const instructionsId = `math-board-instructions-${generatedId}`;
  const suppressBoundingBoxReportRef = useRef(false);
  const layoutSyncRef = useRef(0);
  const programmaticBoundingBoxRef = useRef<[number, number, number, number] | null>(null);
  // userNavigatingRef está activo mientras el usuario sostiene un gesto de
  // arrastre/pan (entre 'down' y 'up') para que assertControlledViewport no
  // reescriba el bounding box a mitad de gesto. Se rastrea el gesto real en
  // vez de un temporizador fijo porque un arrastre puede durar más que
  // cualquier ventana arbitraria — con un temporizador, un gesto lento vuelve
  // a exponerse a que se recalcule el viewport mientras el punto sigue en
  // movimiento (la causa confirmada del "flip" intermitente de la semirrecta).
  const userNavigatingRef = useRef(false);
  const activeGestureRef = useRef(false);
  const wheelNavigationTimerRef = useRef<number | null>(null);

  const beginLayoutSync = () => { layoutSyncRef.current += 1; };
  const endLayoutSync = () => { layoutSyncRef.current = Math.max(0, layoutSyncRef.current - 1); };

  const beginUserGesture = () => {
    activeGestureRef.current = true;
    userNavigatingRef.current = true;
  };

  const endUserGesture = () => {
    activeGestureRef.current = false;
    userNavigatingRef.current = false;
  };

  // El scroll de la rueda no tiene un evento de "fin de gesto" fiable (cada
  // tick es independiente), así que conserva una ventana corta tras el último
  // evento para absorber un gesto de zoom continuo.
  const markWheelNavigation = () => {
    userNavigatingRef.current = true;
    if (wheelNavigationTimerRef.current !== null && typeof window !== 'undefined') {
      window.clearTimeout(wheelNavigationTimerRef.current);
    }
    if (typeof window !== 'undefined') {
      wheelNavigationTimerRef.current = window.setTimeout(() => {
        if (!activeGestureRef.current) userNavigatingRef.current = false;
        wheelNavigationTimerRef.current = null;
      }, 120);
    }
  };

  const fittedDisplayBounds = (
    contentBounds: DiagramBounds,
    width: number,
    height: number,
  ): DiagramBounds => (
    keepaspectratio
      ? fitBoundsToSafeArea(contentBounds, width, height, safeAreaRef.current)
      : contentBounds
  );

  /**
   * Push already-fitted display bounds to JSXGraph without:
   * - a second keepaspectratio letterbox (ratchets the mathematical camera)
   * - committing the display box back through onBoundingBoxChange
   */
  const applyFittedDisplayBounds = (board: any, fittedBounds: DiagramBounds) => {
    beginLayoutSync();
    suppressBoundingBoxReportRef.current = true;
    try {
      programmaticBoundingBoxRef.current = [...fittedBounds] as DiagramBounds;
      board.setBoundingBox(fittedBounds, false);
      const nextBounds = board.getBoundingBox?.();
      if (Array.isArray(nextBounds) && nextBounds.length === 4) {
        programmaticBoundingBoxRef.current = [...nextBounds] as DiagramBounds;
      }
    } finally {
      suppressBoundingBoxReportRef.current = false;
      endLayoutSync();
    }
  };

  const assertControlledViewport = (board: any, width: number, height: number) => {
    if (userNavigatingRef.current) return;
    // board.setBoundingBox() sólo recalcula la transformación interna
    // (unitX/unitY/origen); el redibujado real que la hace visible depende
    // de un board.update() posterior. JSXGraph protege ese update() contra
    // reentrancia (board.inUpdate) devolviéndose sin hacer nada si ya hay una
    // pasada en curso, así que llamar a esta función DESDE DENTRO de esa
    // pasada (p. ej. directamente desde el evento 'update') dejaría la
    // transformación cambiada sin que el render la reflejase hasta el
    // siguiente ciclo — la causa más probable del "flip" intermitente. Por
    // eso el efecto de abajo la invoca envolviendo board.update() para que
    // se ejecute siempre DESPUÉS de que board.inUpdate vuelva a false.
    if (board.inUpdate) return;
    const fittedBounds = fittedDisplayBounds(boundingboxRef.current, width, height);
    const current = board.getBoundingBox?.() as number[] | undefined;
    const changed = !current || fittedBounds.some((value, index) => Math.abs(value - current[index]) > 1e-8);
    if (!changed) return;
    applyFittedDisplayBounds(board, fittedBounds);
    safeBoardUpdate(board);
  };

  useEffect(() => {
    reportPaintRef.current = reportPaint;
    onInitRef.current = onInit;
    onUpdateRef.current = onUpdate;
    onBoundingBoxChangeRef.current = onBoundingBoxChange;
    boundingboxRef.current = boundingbox;
    safeAreaRef.current = safeArea ?? {};
    viewportSafeAreaRef.current = viewportSafeArea ?? safeArea ?? {};
    if (boardObj.current) {
      boardObj.current.__matematikaSafeArea = safeAreaRef.current;
      boardObj.current.__matematikaViewportSafeArea = viewportSafeAreaRef.current;
    }
    if (boardObj.current) safeBoardUpdate(boardObj.current);
  }, [reportPaint, boundingbox, onBoundingBoxChange, onInit, onUpdate, safeArea, viewportSafeArea]);

  useEffect(() => {
    highlightRef.current = highlight;
    stepRef.current = step;

    if (!boardObj.current) return;
    const currentTheme = getTheme();
    const isStep = (target: string) => matchesScopedDiagramTarget(stepRef.current, target, scopeId);
    const isHL = (target: string) => matchesScopedDiagramTarget(highlightRef.current, target, scopeId);
    onUpdateRef.current?.(boardObj.current, elementsRef.current, currentTheme, isStep, isHL);
    safeBoardUpdate(boardObj.current);
  }, [highlight, scopeId, step]);

  useEffect(() => {
    if (!boardRef.current) return;
    boardRef.current.id ||= id || `shared-jxgbox-${generatedId}`;

    const initialBounds = fittedDisplayBounds(
      boundingboxRef.current,
      boardRef.current.clientWidth,
      boardRef.current.clientHeight,
    );
    const board = JXG.JSXGraph.initBoard(boardRef.current.id, {
      boundingbox: initialBounds,
      axis,
      grid,
      pan: { enabled: pan },
      zoom: { wheel: zoom, pinchHorizontal: zoom, pinchVertical: zoom },
      keepaspectratio,
      // MathBoard owns resize synchronization below. Disabling JSXGraph's
      // throttled observer avoids a queued callback touching a freed renderer
      // when the editor saves, closes and immediately reopens the board.
      resize: { enabled: false, throttle: 100 },
      showCopyright: false,
      showNavigation: false,
    });

    // JSXGraph replaces accessibility attributes while initializing its
    // container. Restore the editor-owned name and instructions afterwards.
    boardRef.current.setAttribute('role', 'region');
    boardRef.current.setAttribute('aria-label', ariaLabel);
    boardRef.current.setAttribute('aria-describedby', instructionsId);
    boardRef.current.setAttribute('tabindex', '0');

    boardObj.current = board;
    (board as any).__matematikaSafeArea = safeAreaRef.current;
    (board as any).__matematikaViewportSafeArea = viewportSafeAreaRef.current;
    // Drop any inline size JSXGraph may have written during init so CSS layout owns the box.
    syncBoardToContainerSize(
      board,
      boardRef.current.clientWidth,
      boardRef.current.clientHeight,
      boardRef.current,
    );
    (board as any).__matematikaContainerSize = { width: boardRef.current.clientWidth, height: boardRef.current.clientHeight };
    const actualInitialBounds = board.getBoundingBox?.();
    if (Array.isArray(actualInitialBounds) && actualInitialBounds.length === 4) {
      programmaticBoundingBoxRef.current = [...actualInitialBounds] as [number, number, number, number];
    }
    const theme = getTheme();
    boardRef.current.style.backgroundColor = theme.lienzo;
    onInitRef.current(board, elementsRef.current, theme);
    // DiagramSlot espera este aviso; sin él los demos legacy (MathBoard) se quedan
    // en skeleton hasta el timeout de seguridad (~12s).
    requestAnimationFrame(() => {
      requestAnimationFrame(() => reportPaintRef.current?.());
    });

    const runUpdate = () => {
      const currentTheme = getTheme();
      const isStep = (target: string) => matchesScopedDiagramTarget(stepRef.current, target, scopeId);
      const isHL = (target: string) => matchesScopedDiagramTarget(highlightRef.current, target, scopeId);
      onUpdateRef.current?.(board, elementsRef.current, currentTheme, isStep, isHL);
    };

    // El hook de estilo (onUpdate) sólo cambia atributos (color, visibilidad)
    // vía setAttribute, que JSXGraph aplica al DOM inmediatamente sin
    // necesitar una nueva pasada de update(); puede correr de forma segura
    // dentro del propio evento 'update'.
    board.on('update', runUpdate);
    runUpdate();

    // Corregir el bounding box exige, a su vez, un update() para que el
    // redibujado refleje la transformación nueva (ver assertControlledViewport).
    // Esa llamada vuelve a pasar por el wrapper de abajo y desencadenaría de
    // nuevo checkControlledViewport(); esta guarda asegura una única
    // corrección por disparo real en vez de una recursión (potencialmente sin
    // fin si el ajuste de aspecto de JSXGraph nunca converge exactamente al
    // resultado esperado en el primer intento).
    let checkingViewport = false;
    const checkControlledViewport = () => {
      if (checkingViewport) return;
      checkingViewport = true;
      try {
        assertControlledViewport(
          board,
          boardRef.current?.clientWidth ?? 0,
          boardRef.current?.clientHeight ?? 0,
        );
      } finally {
        checkingViewport = false;
      }
    };

    // A diferencia del hook de estilo, assertControlledViewport necesita que
    // la pasada de actualización YA haya terminado (ver su comentario), así
    // que en vez de escuchar 'update' (disparado con board.inUpdate todavía
    // en true) se envuelve el propio método update() para ejecutarla justo
    // después de que devuelva y board.inUpdate vuelva a false.
    const originalBoardUpdate = board.update.bind(board);
    board.update = ((...args: unknown[]) => {
      const result = originalBoardUpdate(...(args as Parameters<typeof originalBoardUpdate>));
      checkControlledViewport();
      return result;
    }) as typeof board.update;
    checkControlledViewport();

    // 'down'/'up' son los eventos unificados de JSXGraph (cubren mouse, touch
    // y pointer) y se disparan a nivel de documento, por lo que capturan todo
    // el gesto real incluso si el puntero se suelta fuera del contenedor.
    board.on('down', beginUserGesture);
    board.on('up', endUserGesture);
    board.on('mousewheel', markWheelNavigation);

    const reportBoundingBox = () => {
      // Resize / safe-area re-fits must not write the display box back into the
      // React camera: contentBoundsFromSafeArea is lossy and ratchets zoom-out.
      if (suppressBoundingBoxReportRef.current || layoutSyncRef.current > 0) return;
      if (!userNavigatingRef.current && !activeGestureRef.current) return;
      const current = board.getBoundingBox?.();
      if (Array.isArray(current) && current.length === 4) {
        const programmatic = programmaticBoundingBoxRef.current;
        if (programmatic && current.every((value, index) => Math.abs(value - programmatic[index]) <= 1e-8)) return;
        onBoundingBoxChangeRef.current?.(contentBoundsFromSafeArea(
          [...current] as [number, number, number, number],
          boardRef.current?.clientWidth ?? 0,
          boardRef.current?.clientHeight ?? 0,
          safeAreaRef.current,
        ));
      }
    };
    board.on('boundingbox', reportBoundingBox);

    // Layout shell owns the CSS box (see content-layout-columns). Sync the
    // canvas *buffer* to that box — never the other way around.
    let lastApplied = { width: 0, height: 0 };
    const applyContainerSize = (width: number, height: number) => {
      const w = Math.round(width);
      const h = Math.round(height);
      if (w <= 2 || h <= 2) {
        lastApplied = { width: 0, height: 0 };
        return;
      }
      if (Math.abs(w - lastApplied.width) < 1 && Math.abs(h - lastApplied.height) < 1) return;
      // Height-only minor shrinks are browser-chrome / vh flicker (width stable while
      // height oscillates). Real window resizes change width too.
      if (lastApplied.width > 0 && Math.abs(w - lastApplied.width) < 1 && h < lastApplied.height - 1 && (lastApplied.height - h < 120)) {
        return;
      }
      beginLayoutSync();
      try {
        if (!syncBoardToContainerSize(board, w, h, boardRef.current)) return;
        const fittedBounds = fittedDisplayBounds(boundingboxRef.current, w, h);
        applyFittedDisplayBounds(board, fittedBounds);
        (board as any).__matematikaContainerSize = { width: w, height: h };
        lastApplied = { width: w, height: h };
        safeBoardUpdate(board);
      } finally {
        endLayoutSync();
      }
    };

    let resizeFrame = 0;
    const scheduleSyncFromShell = () => {
      if (boardObj.current !== board) return;
      if (typeof window !== 'undefined' && typeof window.requestAnimationFrame === 'function') {
        if (resizeFrame) window.cancelAnimationFrame(resizeFrame);
        resizeFrame = window.requestAnimationFrame(() => {
          resizeFrame = 0;
          if (boardObj.current !== board || board.inUpdate) return;
          // Re-measure shell in rAF — never trust a stale RO entry.
          const { width, height } = readLayoutBoxSize(undefined, containerRef.current);
          applyContainerSize(width, height);
        });
        return;
      }
      if (board.inUpdate) return;
      const { width, height } = readLayoutBoxSize(undefined, containerRef.current);
      applyContainerSize(width, height);
    };

    // Observe only the MathBoard shell. Do NOT listen to window/visualViewport
    // resize: those fire on browser-chrome / svh flicker and shrink the diagram
    // without a user resize. Real layout changes reach us via this observer.
    const resizeObserver = typeof ResizeObserver === 'undefined'
      ? null
      : new ResizeObserver(() => { scheduleSyncFromShell(); });
    if (resizeObserver && containerRef.current) resizeObserver.observe(containerRef.current);
    scheduleSyncFromShell();

    const themeObserver = new MutationObserver(() => {
      if (boardObj.current !== board) return;
      const currentTheme = getTheme();
      const renderer = board.renderer as any;
      if (renderer?.container) {
        renderer.container.style.backgroundColor = currentTheme.lienzo;
      }
      safeBoardUpdate(board);
    });
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

    return () => {
      themeObserver.disconnect();
      resizeObserver?.disconnect();
      if (typeof window !== 'undefined') {
        if (resizeFrame) window.cancelAnimationFrame(resizeFrame);
      }
      if (wheelNavigationTimerRef.current !== null && typeof window !== 'undefined') {
        window.clearTimeout(wheelNavigationTimerRef.current);
      }
      if (boardObj.current === board) boardObj.current = null;
      JXG.JSXGraph.freeBoard(board);
      elementsRef.current = {};
    };
  }, [ariaLabel, axis, generatedId, grid, id, instructionsId, keepaspectratio, pan, revision, scopeId, zoom]);

  useEffect(() => {
    const board = boardObj.current;
    if (!board) return;
    const width = containerRef.current?.clientWidth ?? boardRef.current?.clientWidth ?? 0;
    const height = containerRef.current?.clientHeight ?? boardRef.current?.clientHeight ?? 0;
    // Do NOT resizeContainer here: sync+setBoundingBox fed boundingbox events
    // back into React (~100+/s) and made the diagram thrash/shrink alone.
    // Canvas size is owned by the ResizeObserver above.
    const fittedBounds = fittedDisplayBounds(boundingbox, width, height);
    const current = board.getBoundingBox?.() as number[] | undefined;
    const changed = !current || fittedBounds.some((value, index) => Math.abs(value - current[index]) > 1e-8);
    board.__matematikaSafeArea = safeArea ?? {};
    board.__matematikaViewportSafeArea = viewportSafeArea ?? safeArea ?? {};
    if (width > 2 && height > 2) board.__matematikaContainerSize = { width, height };
    if (changed) {
      applyFittedDisplayBounds(board, fittedBounds);
    }
    safeBoardUpdate(board);
  }, [boundingbox, keepaspectratio, safeArea, viewportSafeArea]);

  useEffect(() => {
    if (boardObj.current) safeBoardUpdate(boardObj.current);
  }, [stackRevision, highlight, step]);

  useLayoutEffect(() => {
    const element = containerRef.current;
    if (!element) return;
    syncDiagramTextScale(element);
    const observer = new ResizeObserver(() => syncDiagramTextScale(element));
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} className={`${className} h-full`} data-math-board>
      <p id={instructionsId} className="sr-only">{keyboardInstructions}</p>
      <div ref={boardRef} className="jxgbox absolute inset-0 h-full w-full touch-none"
        role="region"
        aria-label={ariaLabel}
        aria-describedby={instructionsId}
        tabIndex={0}
        style={{
          borderStyle: 'solid',
          borderWidth,
          borderColor,
          borderRadius,
          boxSizing: 'border-box',
        }} 
      />
      {children}
    </div>
  );
};
