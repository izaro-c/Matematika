/**
 * Dominio: Exercise
 *
 * Módulo de ejercicios interactivos, pasos secuenciales, preguntas estructuradas
 * y componentes de retroalimentación didáctica con diseño Arts & Crafts.
 */

// Tipos
export * from './types';

// Constantes
export * from './constants';

// Contexto de ejercicio (re-export desde lib)
export { useExercise, ExerciseProvider } from '@/lib/page-context/ExerciseContext';
export type { ExerciseContextType, QuestionState } from '@/lib/page-context/ExerciseContext';

// Hooks
export { useExerciseQuestion } from './hooks/useExerciseQuestion';
export { useSubcomponents } from './hooks/useSubcomponents';

// UI Compartida
export { ExerciseCard } from './ui/shared/ExerciseCard';

// Preguntas
export { Pregunta } from './ui/questions/Pregunta';
export type { PreguntaProps } from './ui/questions/Pregunta';

export { Hueco } from './ui/questions/Hueco';
export type { HuecoProps } from './ui/questions/Hueco';

export { Emparejar } from './ui/questions/Emparejar';
export type { EmparejarProps } from './ui/questions/Emparejar';

export { Clasificador } from './ui/questions/Clasificador';
export type { ClasificadorProps } from './ui/questions/Clasificador';

export { Ordenacion } from './ui/questions/Ordenacion';
export type { OrdenacionProps } from './ui/questions/Ordenacion';

export { MatrizInteractiva } from './ui/questions/MatrizInteractiva';
export type { MatrizInteractivaProps } from './ui/questions/MatrizInteractiva';

export { CanvasInteractivo } from './ui/questions/CanvasInteractivo';
export type { CanvasInteractivoProps } from './ui/questions/CanvasInteractivo';

// Pasos
export { ExerciseStep } from './ui/steps/ExerciseStep';
export type { ExerciseStepProps } from './ui/steps/ExerciseStep';

export { Paso } from './ui/steps/Paso';
export type { PasoProps } from './ui/steps/Paso';

export { PasoContext } from './ui/steps/PasoContext';
export type { PasoContextType } from './ui/steps/PasoContext';

// Feedback
export { ErrorComun } from './ui/feedback/ErrorComun';
export { Resolucion } from './ui/feedback/Resolucion';
export { Solucion } from './ui/feedback/Solucion';
export type { SolucionProps } from './ui/feedback/Solucion';
export { Apoyo } from './ui/feedback/Apoyo';
export type { ApoyoProps } from './ui/feedback/Apoyo';

// Widgets
export { DeslizadorEnLine, DynamicValue } from './ui/widgets/DeslizadorEnLine';
export type { DeslizadorEnLineProps } from './ui/widgets/DeslizadorEnLine';
