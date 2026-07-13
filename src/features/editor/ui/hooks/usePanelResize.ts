import { useCallback, useEffect, useRef } from 'react';

interface ResizeOptions {
  direction: 'horizontal' | 'vertical';
  value: number;
  min: number;
  max: number;
  inverted?: boolean;
  onChange: (value: number) => void;
  onCommit?: (value: number) => void;
}

export function usePanelResize({ direction, value, min, max, inverted = false, onChange, onCommit }: ResizeOptions) {
  const dragRef = useRef<{ origin: number; initial: number; latest: number } | null>(null);

  const stop = useCallback(() => {
    if (!dragRef.current) return;
    const committed = dragRef.current.latest;
    dragRef.current = null;
    document.body.style.cursor = '';
    document.body.style.userSelect = '';
    onCommit?.(committed);
  }, [onCommit]);

  useEffect(() => {
    const move = (event: PointerEvent) => {
      const drag = dragRef.current;
      if (!drag) return;
      const pointer = direction === 'horizontal' ? event.clientX : event.clientY;
      const delta = (pointer - drag.origin) * (inverted ? -1 : 1);
      const next = Math.min(max, Math.max(min, drag.initial + delta));
      drag.latest = next;
      onChange(next);
    };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', stop);
    window.addEventListener('pointercancel', stop);
    return () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', stop);
      window.removeEventListener('pointercancel', stop);
    };
  }, [direction, inverted, max, min, onChange, stop]);

  return {
    role: 'separator' as const,
    tabIndex: 0,
    'aria-orientation': direction,
    'aria-valuemin': min,
    'aria-valuemax': max,
    'aria-valuenow': Math.round(value),
    onPointerDown: (event: React.PointerEvent) => {
      event.currentTarget.setPointerCapture?.(event.pointerId);
      dragRef.current = {
        origin: direction === 'horizontal' ? event.clientX : event.clientY,
        initial: value,
        latest: value,
      };
      document.body.style.cursor = direction === 'horizontal' ? 'col-resize' : 'row-resize';
      document.body.style.userSelect = 'none';
    },
    onKeyDown: (event: React.KeyboardEvent) => {
      const negativeKey = direction === 'horizontal' ? 'ArrowLeft' : 'ArrowUp';
      const positiveKey = direction === 'horizontal' ? 'ArrowRight' : 'ArrowDown';
      if (event.key !== negativeKey && event.key !== positiveKey) return;
      event.preventDefault();
      const sign = event.key === positiveKey ? 1 : -1;
      const next = Math.min(max, Math.max(min, value + sign * (event.shiftKey ? 32 : 8) * (inverted ? -1 : 1)));
      onChange(next);
      onCommit?.(next);
    },
  };
}
