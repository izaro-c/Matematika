import { afterEach } from 'vitest';
import JXG from 'jsxgraph';

if (typeof window !== 'undefined' && typeof window.matchMedia !== 'function') {
  Object.defineProperty(window, 'matchMedia', {
    configurable: true,
    value: (query: string): MediaQueryList => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: () => undefined,
      removeListener: () => undefined,
      addEventListener: () => undefined,
      removeEventListener: () => undefined,
      dispatchEvent: () => true,
    }),
  });
}

afterEach(() => {
  if (typeof JXG === 'undefined' || !JXG.JSXGraph?.freeBoard) return;
  const boards = JXG.JSXGraph.boards ?? [];
  for (const board of [...boards]) {
    try {
      JXG.JSXGraph.freeBoard(board);
    } catch {
      // board ya liberado
    }
  }
});
