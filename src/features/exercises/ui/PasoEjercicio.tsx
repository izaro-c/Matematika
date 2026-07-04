import React from 'react';
import { useExercise } from '@/features/exercises/ui/ExerciseContext';
import { useLessonStore } from '@/features/lessons/LessonStore';

interface PasoEjercicioProps {
  /** Identificador único del paso (para reportar hover/click al diagrama lateral) */
  id: string;
  /** Número correlativo del paso */
  numero: number;
  /** Título descriptivo del paso */
  titulo: string;
  /** IDs de las preguntas de este paso que el alumno debe resolver para completarlo */
  questionIds: string[];
  /** IDs de las preguntas de pasos anteriores que deben resolverse para desbloquear este paso */
  dependeDeQuestions?: string[];
  /** Explicación didáctica/resolución final que se revela al completar el paso */
  resolucion: React.ReactNode;
  /** Preguntas u otros componentes interactivos del paso */
  children?: React.ReactNode;
}

export const PasoEjercicio: React.FC<PasoEjercicioProps> = ({
  id,
  numero,
  titulo,
  questionIds,
  dependeDeQuestions = [],
  resolucion,
  children
}) => {
  const { state } = useExercise();
  const { setActiveStep } = useLessonStore();

  // Comprobar si el paso está desbloqueado (todas las dependencias están resueltas)
  const isUnlocked = dependeDeQuestions.every(
    qId => state.questions[qId]?.isCorrect === true || state.questions[qId]?.revealed === true
  );

  // Comprobar si el paso actual está completado (todas sus preguntas están resueltas o reveladas)
  const isCompleted = questionIds.length > 0 && questionIds.every(
    qId => state.questions[qId]?.isCorrect === true || state.questions[qId]?.revealed === true
  );

  // Reportar hover o click al store de lección para actualizar el diagrama lateral
  const handleActivation = () => {
    if (isUnlocked) {
      setActiveStep(id);
    }
  };

  return (
    <div 
      className={`my-8 font-serif border-l-2 transition-all duration-300 pl-6 ${
        isCompleted 
          ? 'border-salvia/60' 
          : isUnlocked 
            ? 'border-ocre/60' 
            : 'border-carbon/10'
      }`}
      onMouseEnter={handleActivation}
      onClick={handleActivation}
    >
      {/* Cabecera del paso */}
      <div className="flex items-center gap-3 mb-4 select-none">
        <div className={`flex items-center justify-center w-8 h-8 font-sans font-bold text-sm transition-all duration-300 border ${
          isCompleted 
            ? 'bg-salvia/10 border-salvia text-salvia' 
            : isUnlocked 
              ? 'bg-ocre/10 border-ocre text-ocre' 
              : 'bg-carbon/5 border-carbon/10 text-carbon/30'
        }`}>
          {isCompleted ? '✓' : numero}
        </div>
        <h3 className={`font-sans font-bold text-sm uppercase tracking-wider transition-colors ${
          isCompleted 
            ? 'text-salvia' 
            : isUnlocked 
              ? 'text-carbon' 
              : 'text-carbon/30'
        }`}>
          {titulo}
          {!isUnlocked && <span className="ml-2 text-xs font-normal lowercase tracking-normal text-carbon/40 font-serif">(bloqueado)</span>}
        </h3>
      </div>

      {/* Cuerpo del paso */}
      <div className="relative">
        {!isUnlocked ? (
          // Vista bloqueada
          <div className="p-5 border border-dashed border-carbon/20 bg-carbon/5 select-none rounded-none text-sm text-carbon/50 italic flex items-center gap-3">
            <span className="text-base">🔒</span>
            <span>Resuelve las preguntas anteriores para desbloquear este paso.</span>
          </div>
        ) : (
          // Vista activa/desbloqueada
          <div className="space-y-4">
            {/* Contenido interactivo (Preguntas / Inputs) */}
            <div className={isCompleted ? 'pointer-events-none opacity-90' : ''}>
              {children}
            </div>

            {/* Explicación de la resolución — se revela sólo al completar el paso */}
            {isCompleted ? (
              <div className="mt-6 p-5 bg-salvia/5 border border-salvia/20 animate-fade-in text-sm text-carbon/80 leading-relaxed [&_p]:mb-2 [&_p:last-child]:mb-0">
                <div className="font-sans font-bold text-[10px] uppercase tracking-widest text-salvia/80 mb-2 flex items-center gap-2">
                  <span>✦</span> Resolución explicada:
                </div>
                {resolucion}
              </div>
            ) : (
              <div className="mt-4 p-4 border border-dashed border-ocre/20 bg-ocre/5 text-xs text-ocre/70 italic text-center rounded-none select-none">
                Completa las preguntas de arriba para revelar la resolución geométrica y el cálculo detallado.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
