import { createContext } from 'react';

export interface PasoContextType {
  isCompleted: boolean;
}

export const PasoContext = createContext<PasoContextType>({
  isCompleted: false,
});
