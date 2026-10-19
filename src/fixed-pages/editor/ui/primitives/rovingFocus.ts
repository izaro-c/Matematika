import type React from 'react';

/**
 * Arrow/Home/End navigation for a row of options with a single tab stop
 * (radio groups and tab lists). Returns the index to move to, or null.
 */
export function rovingTargetIndex(event: React.KeyboardEvent, current: number, count: number): number | null {
  if (count === 0) return null;
  switch (event.key) {
    case 'ArrowRight':
    case 'ArrowDown':
      return (current + 1) % count;
    case 'ArrowLeft':
    case 'ArrowUp':
      return (current - 1 + count) % count;
    case 'Home':
      return 0;
    case 'End':
      return count - 1;
    default:
      return null;
  }
}
