import { createContext, useContext } from 'react';

/**
 * Figure number shown in the diagram caption ("Fig. 1").
 *
 * A page with one diagram needs no provider. A demonstration with several
 * diagrams numbers them in the order they are declared, so the prose can cite
 * "Fig. 2".
 */
export const DiagramFigureContext = createContext<number>(1);

export function useDiagramFigureNumber(): number {
  return useContext(DiagramFigureContext);
}
