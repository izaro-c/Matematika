import React, { useState, useContext } from 'react';
import { useProgressStore } from '@/features/progress/UserProgressStore';
import { StudyPlanContext } from '@/app/providers/StudyPlanContext';

interface StudyPlanCheckpointProps {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export const StudyPlanCheckpoint: React.FC<StudyPlanCheckpointProps> = ({
  id,
  question,
  options,
  correctAnswer,
  explanation,
}) => {
  const { isRead, markAsRead } = useProgressStore();
  const completed = isRead(id);
  const context = useContext(StudyPlanContext);
  const isLocked = context?.isLocked ? context.isLocked(id) : false;

  const [selectedIdx, setSelectedIdx] = useState<number | null>(
    completed ? correctAnswer : null
  );
  const [showExplanation, setShowExplanation] = useState<boolean>(completed);
  const [isWrong, setIsWrong] = useState<boolean>(false);

  const handleOptionClick = (index: number) => {
    if (completed || isLocked) return;

    setSelectedIdx(index);
    if (index === correctAnswer) {
      setIsWrong(false);
      setShowExplanation(true);
      markAsRead(id);
    } else {
      setIsWrong(true);
      setShowExplanation(false);
      setTimeout(() => {
        setIsWrong(false);
      }, 500);
    }
  };

  // Renderizado en estado bloqueado (Niebla de Guerra)
  if (isLocked) {
    return (
      <div
        data-node-id={id}
        className="border border-carbon/10 p-6 my-8 rounded-[2px] bg-carbon/[0.01] filter blur-[0.6px] opacity-40 select-none pointer-events-none shadow-sm"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="w-6 h-6 border border-carbon/20 flex items-center justify-center font-bold text-xs opacity-40">
            <span>?</span>
          </div>
          <div className="flex-1">
            <div className="text-[9px] font-sans uppercase tracking-[0.25em] font-bold text-carbon/40">
              Checkpoint (Bloqueado)
            </div>
            <h4 className="text-sm italic font-serif text-carbon/40">
              Completa los conceptos de esta fase para habilitar el control
            </h4>
          </div>
        </div>

        <div className="text-lg font-serif font-bold text-carbon/40 mb-6 leading-relaxed">
          {question}
        </div>

        <div className="space-y-3">
          {options.map((option, idx) => (
            <div
              key={idx}
              className="w-full text-left p-4 border border-carbon/10 text-sm font-sans tracking-wide text-carbon/30 bg-transparent rounded-[1px]"
            >
              {option}
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div
      data-node-id={id}
      className={`border-2 p-6 my-8 rounded-[2px] transition-all duration-500 shadow-sm ${
        completed
          ? 'bg-salvia/5 border-salvia/40'
          : 'bg-pizarra/[0.02] border-carbon/15'
      }`}
    >
      {/* Cabecera del Checkpoint */}
      <div className="flex items-center gap-3 mb-4">
        <div
          className={`w-6 h-6 border flex items-center justify-center font-bold text-xs rotate-0 transition-transform duration-500 ${
            completed
              ? 'border-salvia bg-salvia text-lienzo rotate-45'
              : 'border-carbon/30 bg-transparent text-carbon/50'
          }`}
        >
          <span className={completed ? '-rotate-45 block' : ''}>
            {completed ? '✓' : '?'}
          </span>
        </div>
        <div className="flex-1">
          <div
            className={`text-[9px] font-sans uppercase tracking-[0.25em] font-bold ${
              completed ? 'text-salvia' : 'text-carbon/40'
            }`}
          >
            Checkpoint de Verificación
          </div>
          <h4 className="text-sm italic font-serif text-carbon/60">
            Responde correctamente para desbloquear el camino
          </h4>
        </div>
      </div>

      {/* Pregunta */}
      <div className="text-lg font-serif font-bold text-carbon mb-6 leading-relaxed">
        {question}
      </div>

      {/* Opciones */}
      <div className="space-y-3">
        {options.map((option, idx) => {
          const isSelected = selectedIdx === idx;
          const isCorrectOption = idx === correctAnswer;

          let btnClass = 'border-carbon/15 hover:bg-carbon/[0.03] hover:border-carbon/30 text-carbon/80';
          if (completed) {
            if (isCorrectOption) {
              btnClass = 'border-salvia bg-salvia/10 text-salvia font-bold';
            } else if (isSelected) {
              btnClass = 'border-granada/30 bg-granada/5 text-granada/80 opacity-70';
            } else {
              btnClass = 'border-carbon/10 text-carbon/40 opacity-50 cursor-not-allowed';
            }
          } else if (isSelected) {
            if (isWrong) {
              btnClass = 'border-granada bg-granada/10 text-granada font-bold animate-shake';
            } else {
              btnClass = 'border-carbon bg-carbon text-lienzo';
            }
          }

          return (
            <button
              key={idx}
              disabled={completed}
              onClick={() => handleOptionClick(idx)}
              className={`w-full text-left p-4 border text-sm font-sans tracking-wide transition-all duration-200 flex items-center justify-between rounded-[1px] ${btnClass}`}
            >
              <span>{option}</span>
              {completed && isCorrectOption && (
                <span className="text-xs font-bold font-sans uppercase tracking-widest text-salvia">
                  Correcto
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Explicación y feedback pedagógico */}
      {showExplanation && (
        <div className="mt-6 pt-5 border-t border-carbon/10 animate-fade-in">
          <div className="text-[9px] font-sans uppercase tracking-[0.2em] text-salvia/80 font-bold mb-2">
            Justificación Pedagógica
          </div>
          <p className="text-sm font-serif italic text-carbon/70 leading-relaxed">
            {explanation}
          </p>
        </div>
      )}
    </div>
  );
};
