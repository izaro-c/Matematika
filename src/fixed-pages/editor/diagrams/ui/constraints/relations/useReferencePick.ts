import { createContext, useContext } from 'react';
import type { ReferencePickSession } from './referencePickTypes';

export interface ReferencePickContextValue {
  session: ReferencePickSession | null;
  rejectMessage: string | null;
  beginPick: (session: ReferencePickSession) => void;
  clearPick: () => void;
  handleCanvasId: (id: string) => boolean;
}

export const ReferencePickContext = createContext<ReferencePickContextValue | null>(null);

export function useReferencePick(): ReferencePickContextValue {
  const value = useContext(ReferencePickContext);
  if (!value) {
    return {
      session: null,
      rejectMessage: null,
      beginPick: () => undefined,
      clearPick: () => undefined,
      handleCanvasId: () => false,
    };
  }
  return value;
}
