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

/** Skeleton del slot de diagrama — misma cáscara visual que MathBoard. */
export function DiagramSkeleton({ label = 'Preparando visualización…' }: { label?: string }) {
  return (
    <SkeletonShell variant="diagram" label={label}>
      <svg className="sk__figure" viewBox="0 0 120 120">
        <polygon points="28,88 92,88 60,28" fill="none" stroke="currentColor" strokeWidth="1.25" />
        <circle cx="60" cy="68" r="18" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="3 3" />
        <line x1="28" y1="88" x2="92" y2="88" stroke="currentColor" strokeWidth="1.25" />
      </svg>
    </SkeletonShell>
  );
}

/** Skeleton compacto para grafos de metadatos / red de conexiones. */
export function GraphSkeleton({
  height = 200,
  label = 'Trazando conexiones…',
}: {
  height?: number;
  label?: string;
}) {
  return (
    <SkeletonShell variant="graph" label={label} height={height}>
      <svg className="sk__figure sk__figure--graph" viewBox="0 0 160 100">
        <line x1="80" y1="48" x2="28" y2="28" stroke="currentColor" strokeWidth="1.1" />
        <line x1="80" y1="48" x2="132" y2="30" stroke="currentColor" strokeWidth="1.1" />
        <line x1="80" y1="48" x2="118" y2="78" stroke="currentColor" strokeWidth="1.1" />
        <line x1="80" y1="48" x2="42" y2="76" stroke="currentColor" strokeWidth="1.1" />
        <circle cx="80" cy="48" r="7" fill="none" stroke="currentColor" strokeWidth="1.4" />
        <circle cx="28" cy="28" r="4.5" fill="none" stroke="currentColor" strokeWidth="1.15" />
        <circle cx="132" cy="30" r="4.5" fill="none" stroke="currentColor" strokeWidth="1.15" />
        <circle cx="118" cy="78" r="4" fill="none" stroke="currentColor" strokeWidth="1.15" />
        <circle cx="42" cy="76" r="4" fill="none" stroke="currentColor" strokeWidth="1.15" />
      </svg>
    </SkeletonShell>
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
