import { createContext, useContext } from 'react';
import type { DiagramSpecV3 } from '@/diagrams/model/schema/v3';

export interface CanvasControlContextType {
  onComplete: () => void;
  isCompleted: boolean;
  activeSpec?: DiagramSpecV3;
  onPointMove?: (pointId: string, x: number, y: number, updatedSpec?: DiagramSpecV3) => void;
  hideHeader?: boolean;
}

export const CanvasControlContext = createContext<CanvasControlContextType | null>(null);

export const useCanvasControl = () => {
  return useContext(CanvasControlContext);
};
