/**
 * Hueco.tsx — Componente de Completar Huecos
 *
 * El estudiante escribe una respuesta libre (número, expresión o texto corto).
 * El sistema comprueba la respuesta contra el valor correcto con tolerancia
 * numérica configurable. Tras MAX_TRIES intentos fallidos se ofrece revelar
 * la solución.
 */
import React, { useCallback, useState, useEffect } from 'react';
import { useExercise } from '@/features/exercises/ui/ExerciseContext';

const MAX_TRIES = 3;

interface HuecoProps {
  /** Identificador único dentro del ejercicio */
  id: string;
  /** Texto de la pregunta que aparece encima del campo */
  pregunta?: string;
  /** Valor correcto (string o número) */
  correct: string;
  /** Pista que se muestra automáticamente tras 2 intentos fallidos */
  pista?: string;
  /** Tolerancia para comparación numérica (por defecto 0.001) */
  tolerance?: number;
}

function normalizeStr(s: string) {
  return s.trim().toLowerCase().replace(/\s+/g, '').replace(',', '.');
}

function numericMatch(a: string, b: string, tol: number) {
  const fa = parseFloat(a.replace(',', '.'));
  const fb = parseFloat(b.replace(',', '.'));
  return !isNaN(fa) && !isNaN(fb) && Math.abs(fa - fb) <= tol;
}

/**
 * Componente principal para ejercicios de completar huecos (Fill in the blanks).
 */
const SHAKE_STYLE = `
  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    25% { transform: translateX(-4px); }
    75% { transform: translateX(4px); }
  }
  .animate-shake { animation: shake 0.4s ease-in-out; }
`;

const InlineHueco: React.FC<{
  input: string;
  isShaking: boolean;
  isDone: boolean;
  isCorrect: boolean | null;
  isRevealed: boolean;
  correct: string;
  showHint: boolean;
  pista?: string;
  onInputChange: (v: string) => void;
  onCheck: () => void;
}> = ({ input, isShaking, isDone, isCorrect, isRevealed, correct, showHint, pista, onInputChange, onCheck }) => {
  if (isDone) {
    return (
      <span className="inline-block px-2 font-bold font-serif text-salvia transition-all duration-500">
        {isRevealed && isCorrect !== true ? correct : input}
      </span>
    );
  }

  return (
    <span className="inline-flex flex-col items-start relative group">
      <style>{SHAKE_STYLE}</style>
      <span className="inline-flex items-center gap-2">
        <input
          type="text"
          value={input}
          onChange={e => onInputChange(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && onCheck()}
          className={`w-24 text-center bg-transparent border-b-2 border-dashed font-serif text-carbon outline-none transition-all ${
            isShaking ? 'border-terracota animate-shake text-terracota' : 'page-accent-focus border-carbon/40'
          }`}
        />
        {input.trim() && (
          <button onClick={onCheck} className="page-accent-text ac-eyebrow ac-eyebrow--sm opacity-0 group-hover:opacity-100 transition-opacity">
            ↵
          </button>
        )}
      </span>
      {showHint && (
        <span className="absolute top-full left-0 mt-1 w-48 p-2 bg-lienzo border border-carbon/20 shadow-md text-xs font-serif italic text-carbon/70 z-10">
          {pista}
        </span>
      )}
    </span>
  );
};

export const Hueco: React.FC<HuecoProps> = ({
  id,
  pregunta,
  correct,
  pista,
  tolerance = 0.001,
}) => {
  const { state, register, answer, reveal } = useExercise();
  const [input, setInput] = useState('');
  const [isShaking, setIsShaking] = useState(false);

  useEffect(() => { register(id, 'hueco'); }, [id, register]);

  const qState = state.questions[id];
  const isCorrect = qState?.isCorrect ?? null;
  const isRevealed = qState?.revealed ?? false;
  const isDone = isCorrect === true || isRevealed;
  const tries = qState?.tries ?? 0;

  const check = useCallback(() => {
    if (!input.trim() || isDone) return;
    const ok = numericMatch(input, correct, tolerance) || normalizeStr(input) === normalizeStr(correct);
    answer(id, ok);
    if (!ok) {
      setInput('');
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 400);
    }
  }, [input, isDone, correct, tolerance, answer, id]);

  const showHint = tries >= 2 && isCorrect !== true && !isRevealed && !!pista;
  const canReveal = tries >= MAX_TRIES && isCorrect !== true && !isRevealed;

  if (!pregunta) {
    return (
      <InlineHueco
        input={input} isShaking={isShaking} isDone={isDone}
        isCorrect={isCorrect} isRevealed={isRevealed} correct={correct}
        showHint={showHint} pista={pista}
        onInputChange={setInput} onCheck={check}
      />
    );
  }

  const feedbackClass = isCorrect === true ? 'border-salvia/40 bg-salvia/5'
    : isCorrect === false ? 'border-terracota/50 bg-terracota/5'
    : '';

  return (
    <div className={`my-8 p-8 elegant-panel font-serif transition-all duration-500 relative group ${feedbackClass}`} style={{ '--hover-accent': isCorrect === true ? 'var(--theme-salvia)' : 'var(--page-accent)' } as React.CSSProperties}>
       <style>{SHAKE_STYLE}</style>
      <p className="text-base text-carbon mb-6 mt-2 leading-relaxed">{pregunta}</p>

      {isDone ? (
        <div className="text-xl font-bold text-salvia transition-all duration-500">
          {isRevealed && isCorrect !== true ? correct : input}
        </div>
      ) : (
        <div className="flex items-center gap-4 flex-wrap">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && check()}
            placeholder="Respuesta..."
            className={`min-w-[120px] text-lg bg-transparent border-b-2 border-dashed font-serif text-carbon outline-none transition-all ${
              isShaking ? 'border-terracota animate-shake text-terracota' : 'page-accent-focus border-carbon/40'
            }`}
          />
          <button
            onClick={check}
            disabled={!input.trim()}
            className="ac-btn ac-interactive page-accent-button px-6 py-2 text-xs border border-carbon/40 text-carbon/80 transition-all shadow-sm disabled:opacity-30 disabled:cursor-not-allowed hover:-translate-y-0.5 hover:shadow-md"
          >
            Comprobar
          </button>
        </div>
      )}

      {/* Pista estilo marginalia inferior */}
      {showHint && !isDone && (
        <div className="mt-4 pt-3 border-t border-carbon/10 text-sm text-carbon/60 italic font-serif flex gap-2">
          <span className="page-accent-text">❦</span>
          <span>{pista}</span>
        </div>
      )}

      {/* Botón revelar */}
      {canReveal && !isDone && (
        <button
          onClick={() => reveal(id)}
          className="page-accent-text ac-eyebrow ac-eyebrow--sm mt-4 underline underline-offset-4 opacity-70 hover:opacity-100 transition-opacity"
        >
          Revelar Solución
        </button>
      )}
    </div>
  );
};
