import React, { useEffect, useId, useRef } from 'react';
import JXG from 'jsxgraph';
import { useMathStore } from '@/shared/lib/MathStoreContext';
import { matchesScopedDiagramTarget } from '@/shared/lib/DiagramTargetRegistryContext';
import { safeBoardUpdate } from './MathUtils';

export interface ThemeColors {
  carbon: string;
  terracota: string;
  salvia: string;
  lienzo: string;
  pizarra: string;
  ocre: string;
  pavo: string;
  granada: string;
  musgo: string;
}

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

export function fitBoundsToAspect(
  bounds: [number, number, number, number],
  width: number,
  height: number,
): [number, number, number, number] {
  if (width <= 0 || height <= 0) return [...bounds];
  const [left, top, right, bottom] = bounds;
  const spanX = Math.abs(right - left);
  const spanY = Math.abs(top - bottom);
  if (spanX <= 0 || spanY <= 0) return [...bounds];
  const centerX = (left + right) / 2;
  const centerY = (top + bottom) / 2;
  const containerAspect = width / height;
  const boundsAspect = spanX / spanY;
  if (containerAspect > boundsAspect) {
    const fittedSpanX = spanY * containerAspect;
    return [centerX - fittedSpanX / 2, top, centerX + fittedSpanX / 2, bottom];
  }
  const fittedSpanY = spanX / containerAspect;
  return [left, centerY + fittedSpanY / 2, right, centerY - fittedSpanY / 2];
}

export interface MathBoardSafeArea {
  top?: number;
  right?: number;
  bottom?: number;
  left?: number;
}

function resolvedSafeArea(safeArea: MathBoardSafeArea | undefined, width: number, height: number) {
  const left = Math.max(0, Math.min(safeArea?.left ?? 0, Math.max(0, width - 1)));
  const right = Math.max(0, Math.min(safeArea?.right ?? 0, Math.max(0, width - left - 1)));
  const top = Math.max(0, Math.min(safeArea?.top ?? 0, Math.max(0, height - 1)));
  const bottom = Math.max(0, Math.min(safeArea?.bottom ?? 0, Math.max(0, height - top - 1)));
  return { top, right, bottom, left };
}

export function fitBoundsToSafeArea(
  bounds: [number, number, number, number],
  width: number,
  height: number,
  safeArea?: MathBoardSafeArea,
): [number, number, number, number] {
  if (width <= 0 || height <= 0) return [...bounds];
  const [left, top, right, bottom] = bounds;
  const spanX = Math.abs(right - left);
  const spanY = Math.abs(top - bottom);
  if (spanX <= 0 || spanY <= 0) return [...bounds];
  const insets = resolvedSafeArea(safeArea, width, height);
  const safeWidth = width - insets.left - insets.right;
  const safeHeight = height - insets.top - insets.bottom;
  const scale = Math.min(safeWidth / spanX, safeHeight / spanY);
  if (!Number.isFinite(scale) || scale <= 0) return fitBoundsToAspect(bounds, width, height);
  const xStart = insets.left + (safeWidth - spanX * scale) / 2;
  const yStart = insets.top + (safeHeight - spanY * scale) / 2;
  const displayLeft = left - xStart / scale;
  const displayTop = top + yStart / scale;
  return [displayLeft, displayTop, displayLeft + width / scale, displayTop - height / scale];
}

export function contentBoundsFromSafeArea(
  displayBounds: [number, number, number, number],
  width: number,
  height: number,
  safeArea?: MathBoardSafeArea,
): [number, number, number, number] {
  if (width <= 0 || height <= 0) return [...displayBounds];
  const [left, top, right, bottom] = displayBounds;
  const insets = resolvedSafeArea(safeArea, width, height);
  const unitX = (right - left) / width;
  const unitY = (top - bottom) / height;
  return [
    left + insets.left * unitX,
    top - insets.top * unitY,
    right - insets.right * unitX,
    bottom + insets.bottom * unitY,
  ];
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
    contentBounds: [number, number, number, number],
    width: number,
    height: number,
  ): [number, number, number, number] => (
    keepaspectratio
      ? fitBoundsToSafeArea(contentBounds, width, height, safeAreaRef.current)
      : contentBounds
  );

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
    suppressBoundingBoxReportRef.current = true;
    board.setBoundingBox(fittedBounds, keepaspectratio);
    safeBoardUpdate(board);
    const nextBounds = board.getBoundingBox?.();
    if (Array.isArray(nextBounds) && nextBounds.length === 4) {
      programmaticBoundingBoxRef.current = [...nextBounds] as [number, number, number, number];
    }
    suppressBoundingBoxReportRef.current = false;
  };

  useEffect(() => {
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
  }, [boundingbox, onBoundingBoxChange, onInit, onUpdate, safeArea, viewportSafeArea]);

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
    (board as any).__matematikaContainerSize = { width: boardRef.current.clientWidth, height: boardRef.current.clientHeight };
    const actualInitialBounds = board.getBoundingBox?.();
    if (Array.isArray(actualInitialBounds) && actualInitialBounds.length === 4) {
      programmaticBoundingBoxRef.current = [...actualInitialBounds] as [number, number, number, number];
    }
    const theme = getTheme();
    boardRef.current.style.backgroundColor = theme.lienzo;
    onInitRef.current(board, elementsRef.current, theme);

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
      if (suppressBoundingBoxReportRef.current) return;
      markWheelNavigation();
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

    const resizeObserver = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(() => {
      if (boardObj.current !== board || !containerRef.current || board.inUpdate) return;
      const width = containerRef.current.clientWidth;
      const height = containerRef.current.clientHeight;
      if (width <= 2 || height <= 2) return;
      suppressBoundingBoxReportRef.current = true;
      board.resizeContainer(width, height);
      const fittedBounds = fittedDisplayBounds(boundingboxRef.current, width, height);
      board.setBoundingBox(fittedBounds, keepaspectratio);
      (board as any).__matematikaContainerSize = { width, height };
      safeBoardUpdate(board);
      const resizedBounds = board.getBoundingBox?.();
      if (Array.isArray(resizedBounds) && resizedBounds.length === 4) {
        programmaticBoundingBoxRef.current = [...resizedBounds] as [number, number, number, number];
      }
      suppressBoundingBoxReportRef.current = false;
    });
    if (resizeObserver && containerRef.current) resizeObserver.observe(containerRef.current);

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
    const width = boardRef.current?.clientWidth ?? 0;
    const height = boardRef.current?.clientHeight ?? 0;
    const fittedBounds = fittedDisplayBounds(boundingbox, width, height);
    const current = board.getBoundingBox?.() as number[] | undefined;
    const changed = !current || fittedBounds.some((value, index) => Math.abs(value - current[index]) > 1e-8);
    if (changed) {
      suppressBoundingBoxReportRef.current = true;
      board.setBoundingBox(fittedBounds, keepaspectratio);
      safeBoardUpdate(board);
      const nextBounds = board.getBoundingBox?.();
      if (Array.isArray(nextBounds) && nextBounds.length === 4) {
        programmaticBoundingBoxRef.current = [...nextBounds] as [number, number, number, number];
      }
      suppressBoundingBoxReportRef.current = false;
    }
    board.__matematikaSafeArea = safeArea ?? {};
    board.__matematikaViewportSafeArea = viewportSafeArea ?? safeArea ?? {};
    board.__matematikaContainerSize = { width, height };
  }, [boundingbox, keepaspectratio, safeArea, viewportSafeArea]);

  useEffect(() => {
    if (boardObj.current) safeBoardUpdate(boardObj.current);
  }, [stackRevision]);

  return (
    <div ref={containerRef} className={`${className} h-full`}>
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
