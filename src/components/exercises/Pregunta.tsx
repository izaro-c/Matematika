/**
 * Pregunta.tsx — Componente de Opción Múltiple
 *
 * El estudiante elige entre varias opciones. Al seleccionar una,
 * el sistema muestra inmediatamente si es correcta o no, y resalta
 * la opción correcta en verde. Se acepta una sola respuesta.
 *
 * Uso en MDX:
 * <Pregunta
 *   id="p1"
 *   texto="¿Cuántas soluciones tiene un SCD?"
 *   correct="a"
 *   opciones={[
 *     { value: "a", texto: "Una única solución" },
 *     { value: "b", texto: "Infinitas soluciones" },
 *     { value: "c", texto: "Ninguna solución" },
 *   ]}
 * />
 */
import React, { useState, useEffect } from 'react';
import { useLessonStore } from '../../store/LessonStore';
import { useExercise } from './ExerciseContext';
import { KatexText } from '../ui/KatexText';

interface Opcion {
  value: string;
  texto: string;
}

interface PreguntaProps {
  id: string;
  texto?: string;
  question?: string;
  /** Value de la opción correcta */
  correct?: string;
  answer?: string;
  opciones?: Opcion[];
  options?: string[];
}

export const Pregunta: React.FC<PreguntaProps> = ({ id, texto, question, correct, answer: answerAlias, opciones, options }) => {
  const { register, answer } = useExercise();
  const { setActiveStep } = useLessonStore();
  const [selected, setSelected] = useState<string | null>(null);

  const displayTexto = texto || question || '';
  const correctAnswer = correct || answerAlias || '';
  const displayOpciones: Opcion[] = opciones || (options?.map(opt => ({ value: opt, texto: opt }))) || [];

  useEffect(() => { register(id, 'pregunta'); }, [id, register]);

  const isAnswered = selected !== null;
  const isCorrect = selected === correctAnswer;

  const handleSelect = (value: string) => {
    setActiveStep(id);
    if (isAnswered) return;
    setSelected(value);
    answer(id, value === correctAnswer);
  };

  return (
    <div 
      className="my-8 p-6 bg-[#fdfbf7] border border-carbon/20 shadow-sm relative font-serif group cursor-pointer transition-all duration-300 hover:border-carbon/40"
      onMouseEnter={() => setActiveStep(id)}
      onClick={() => setActiveStep(id)}
    >
      <div className="absolute -top-3 left-6 bg-[#F8F6F1] px-2 text-[10px] uppercase tracking-widest text-carbon/50 font-sans">
        Pregunta
      </div>

      {displayTexto && (
        <div className="text-base font-bold text-carbon mb-5 leading-relaxed">
          <KatexText text={displayTexto} />
        </div>
      )}

      <div className="flex flex-col gap-3">
        {displayOpciones.map((opt, index) => {
          const letter = String.fromCharCode(65 + index);
          const isSelected = selected === opt.value;
          const isThisCorrect = opt.value === correctAnswer;
          const showCorrect = isAnswered && isThisCorrect;
          const showWrong = isAnswered && isSelected && !isThisCorrect;

          return (
            <button
              key={opt.value}
              onClick={() => handleSelect(opt.value)}
              disabled={isAnswered}
              className={`text-left px-5 py-3 border rounded-sm text-[15px] font-serif transition-all duration-300 flex items-center gap-4 ${
                showCorrect
                  ? 'border-[#2a6a2a] bg-[#f0faf0] text-[#1a4a1a] shadow-inner'
                  : showWrong
                  ? 'border-terracota bg-terracota/5 text-terracota'
                  : isSelected
                  ? 'border-carbon/50 bg-carbon/5'
                  : isAnswered
                  ? 'border-carbon/10 text-carbon/40 cursor-not-allowed opacity-60'
                  : 'border-carbon/30 hover:border-carbon/60 hover:bg-carbon/[0.02] cursor-pointer hover:-translate-y-0.5 hover:shadow-sm'
              }`}
            >
              {/* Sello de la opción */}
              <span
                className={`inline-flex items-center justify-center w-7 h-7 rounded border font-serif text-xs shrink-0 transition-all duration-300 ${
                  showCorrect ? 'border-[#2a6a2a] bg-[#2a6a2a] text-[#f0faf0]' :
                  showWrong   ? 'border-terracota bg-terracota text-white' :
                  'border-carbon/40 text-carbon/60 bg-[#F8F6F1]'
                }`}
              >
                {showCorrect ? '✓' : showWrong ? '✗' : letter}
              </span>

              <span className="flex-1"><KatexText text={opt.texto} /></span>
            </button>
          );
        })}
      </div>

      {/* Feedback textual clásico */}
      {isAnswered && !isCorrect && (
        <div className="mt-5 pt-4 border-t border-carbon/15 text-sm text-carbon/60 italic font-serif flex gap-3 items-start animate-fade-in">
          <span className="text-terracota text-lg leading-none">❦</span>
          <div>
            La respuesta correcta era:{' '}
            <strong className="text-[#2a6a2a] not-italic block mt-1">
              <KatexText text={displayOpciones.find(o => o.value === correctAnswer)?.texto || correctAnswer} />
            </strong>
          </div>
        </div>
      )}
    </div>
  );
};
