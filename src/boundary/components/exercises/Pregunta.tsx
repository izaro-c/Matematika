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
import { useLessonStore } from '@/controller/store/LessonStore';
import { useExercise } from '@/boundary/components/exercises/ExerciseContext';
import { KatexText } from '@/boundary/components/ui/KatexText';

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

/**
 * Componente principal para renderizar una pregunta de Opción Múltiple.
 */
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
      className="my-8 p-8 elegant-panel relative font-serif"
    >

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

          let btnClass: string;
          if (showCorrect) {
            btnClass = 'border-salvia bg-salvia/10 text-salvia shadow-[inset_0_2px_4px_rgba(0,0,0,0.05)]';
          } else if (showWrong) {
            btnClass = 'border-terracota bg-terracota/5 text-terracota';
          } else if (isSelected) {
            btnClass = 'border-carbon/50 bg-carbon/5';
          } else if (isAnswered) {
            btnClass = 'border-carbon/10 text-carbon/40 cursor-not-allowed opacity-60';
          } else {
            btnClass = 'border-carbon/30 hover:border-carbon/60 hover:bg-carbon/[0.02] cursor-pointer hover:-translate-y-0.5 hover:shadow-sm';
          }

          let badgeClass: string, badgeChar: string;
          if (showCorrect) {
            badgeClass = 'border-salvia bg-salvia text-lienzo';
            badgeChar = '✓';
          } else if (showWrong) {
            badgeClass = 'border-terracota bg-terracota text-lienzo';
            badgeChar = '✗';
          } else {
            badgeClass = 'border-carbon/40 text-carbon/60 bg-transparent';
            badgeChar = letter;
          }

          return (
            <button
              key={opt.value}
              onClick={() => handleSelect(opt.value)}
              disabled={isAnswered}
              className={`text-left px-5 py-3 border rounded-none text-[15px] font-serif transition-all duration-300 flex items-center gap-4 ${btnClass}`}
            >
              {/* Sello de la opción */}
              <span
                className={`inline-flex items-center justify-center w-7 h-7 rounded-none border font-serif text-xs shrink-0 transition-all duration-300 ${badgeClass}`}
              >
                {badgeChar}
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
            <strong className="text-salvia not-italic block mt-1">
              <KatexText text={displayOpciones.find(o => o.value === correctAnswer)?.texto || correctAnswer} />
            </strong>
          </div>
        </div>
      )}
    </div>
  );
};
