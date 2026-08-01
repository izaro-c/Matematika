import { useEffect, useState, type RefObject } from 'react';

/**
 * Computes a uniform down-scale factor so `targetRef`'s natural (untransformed)
 * box fits inside `containerRef`'s available box. Never scales up (max 1).
 */
export function useFitScale(
  containerRef: RefObject<HTMLElement | null>,
  targetRef: RefObject<HTMLElement | null>,
  enabled: boolean,
  /** Re-run when the scaled target remounts (e.g. publication frame mode switch). */
  mountKey?: string | number | boolean,
): number {
  const [scale, setScale] = useState(1);

  useEffect(() => {
    if (!enabled) {
      setScale(1);
      return undefined;
    }
    const container = containerRef.current;
    const target = targetRef.current;
    if (!container || !target) return undefined;

    const recompute = () => {
      const availW = container.clientWidth;
      const availH = container.clientHeight;
      const frameW = target.offsetWidth;
      const frameH = target.offsetHeight;
      if (!frameW || !frameH) return;
      const next = Math.min(1, availW / frameW, availH / frameH);
      setScale(Number.isFinite(next) && next > 0 ? next : 1);
    };

    recompute();
    const observer = new ResizeObserver(recompute);
    observer.observe(container);
    observer.observe(target);
    return () => observer.disconnect();
  }, [enabled, containerRef, targetRef, mountKey]);

  return enabled ? scale : 1;
}
