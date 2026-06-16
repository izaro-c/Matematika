import { createContext } from 'react';

export interface StudyPlanContextType {
  registerTaskRef: (id: string, el: HTMLElement | null) => void;
}

export const StudyPlanContext = createContext<StudyPlanContextType>({
  registerTaskRef: () => {},
});
