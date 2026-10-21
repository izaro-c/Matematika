import {
  createContext,
  Suspense,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

type SkeletonVariant = 'diagram' | 'graph';

function SkeletonShell({
  variant,
  label,
  height,
  children,
}: {
  variant: SkeletonVariant;
  label: string;
  height?: number;
  children: ReactNode;
}) {
  return (
    <div
      className={`sk sk--${variant}`}
      style={height != null ? { height } : undefined}
      role="status"
      aria-live="polite"
      aria-busy="true"
      aria-label={label}
    >
      <div className="sk__ghost" aria-hidden="true">
        {children}
      </div>
      <p className="sk__label">{label}</p>
      <span className="sk__ink" aria-hidden="true" />
    </div>
  );
}

/**
 * Skeleton del slot de diagrama — misma lámina que DiagramRenderer: tablero con
 * filete de color y, debajo, las franjas del pie de figura y de la barra.
 * `figure={false}` deja solo el tablero (miniaturas sin pie ni barra).
 */
export function DiagramSkeleton({ label = 'Preparando visualización…', figure = true }: { label?: string; figure?: boolean }) {
  const shell = (
    <SkeletonShell variant="diagram" label={label}>
      <svg className="sk__figure" viewBox="0 0 120 120">
        <polygon points="28,88 92,88 60,28" fill="none" stroke="currentColor" strokeWidth="1.25" />
        <circle cx="60" cy="68" r="18" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="3 3" />
        <line x1="28" y1="88" x2="92" y2="88" stroke="currentColor" strokeWidth="1.25" />
      </svg>
    </SkeletonShell>
  );
  if (!figure) return shell;
  return (
    <div className="sk-figure">
      {shell}
      <div className="sk-figure__caption" aria-hidden="true" />
      <div className="sk-figure__bar" aria-hidden="true" />
    </div>
  );
}

type DiagramPaintGate = { reportReady: () => void };

const DiagramPaintContext = createContext<DiagramPaintGate | null>(null);

/** Lo llama DiagramRenderer / MathBoard cuando el tablero ya ha pintado. */
export function useDiagramPaintReport(): (() => void) | null {
  return useContext(DiagramPaintContext)?.reportReady ?? null;
}

/**
 * Slot de diagrama: skeleton encima hasta que el renderer reporta listo.
 * El MDX/texto ya puede verse; el diagrama no se revela a medias.
 */
export function DiagramSlot({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);

  const reportReady = useCallback(() => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => setReady(true));
    });
  }, []);

  const gate = useMemo(() => ({ reportReady }), [reportReady]);

  // Seguridad: si no hay MathBoard/DiagramRenderer, no dejar el skeleton eterno
  useEffect(() => {
    if (ready) return;
    const t = window.setTimeout(() => setReady(true), 12000);
    return () => clearTimeout(t);
  }, [ready]);

  return (
    <DiagramPaintContext.Provider value={gate}>
      <div className="relative h-full w-full min-h-0">
        <div
          className={`h-full w-full min-h-0${ready ? '' : ' invisible'}`}
          aria-hidden={ready ? undefined : true}
        >
          <Suspense fallback={null}>{children}</Suspense>
        </div>
        {!ready && (
          <div className="absolute inset-0 z-10">
            <DiagramSkeleton />
          </div>
        )}
      </div>
    </DiagramPaintContext.Provider>
  );
}
