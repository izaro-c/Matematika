import React, { useState } from 'react';
import { useI18n } from '@/i18n';
import { useExerciseQuestion } from '../../hooks/useExerciseQuestion';
import { useSubcomponents } from '../../hooks/useSubcomponents';
import { ExerciseCard } from '../shared/ExerciseCard';
import { QuestionFeedback } from '../shared/QuestionFeedback';
import type { ErrorComunProps, ResolucionProps, BaseQuestionProps } from '../../types';

export interface MatrizInteractivaProps extends BaseQuestionProps {
  /** Enunciado de la pregunta matricial */
  pregunta?: string;
  /** Matriz correcta esperada */
  correct: string[][];
}

const MatrizInteractivaErrorComun: React.FC<ErrorComunProps> = () => null;
MatrizInteractivaErrorComun.displayName = 'MatrizInteractivaErrorComun';

const MatrizInteractivaResolucion: React.FC<ResolucionProps> = () => null;
MatrizInteractivaResolucion.displayName = 'MatrizInteractivaResolucion';

type MatrizInteractivaComponent = React.FC<MatrizInteractivaProps> & {
  ErrorComun: React.FC<ErrorComunProps>;
  Resolucion: React.FC<ResolucionProps>;
};

function normalizeStr(s: string): string {
  return s.trim().toLowerCase().replace(/\s+/g, '').replace(',', '.');
}

/**
 * MatrizInteractiva — Ejercicio de álgebra lineal con cuadrícula de celdas matriciales
 * delimitadas por corchetes editoriales.
 */
export const MatrizInteractiva: MatrizInteractivaComponent = ({ id, pregunta, correct, children }) => {
  const { t } = useI18n();

  const {
    isCompleted,
    hasFailed,
    isShaking,
    activeTab,
    setActiveTab,
    submitAnswer,
    tryAgain,
  } = useExerciseQuestion({ id, type: 'matriz' });

  const { errorComunData, resolucionData, otherChildren } = useSubcomponents(children);

  const rows = correct.length;
  const cols = correct[0]?.length || 0;

  const [grid, setGrid] = useState<string[][]>(
    Array.from({ length: rows }, () => Array(cols).fill(''))
  );

  const handleCellChange = (r: number, c: number, val: string) => {
    if (isCompleted) return;
    const nextGrid = grid.map((rowArr, rowIdx) =>
      rowIdx === r ? rowArr.map((cellVal, colIdx) => (colIdx === c ? val : cellVal)) : rowArr
    );
    setGrid(nextGrid);
  };

  const check = () => {
    if (isCompleted) return;

    let isAllCorrect = true;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (normalizeStr(grid[r][c]) !== normalizeStr(correct[r][c])) {
          isAllCorrect = false;
          break;
        }
      }
      if (!isAllCorrect) break;
    }

    submitAnswer(isAllCorrect, grid);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, r: number, c: number) => {
    if (e.key === 'ArrowRight' && c < cols - 1) {
      document.getElementById(`matrix-cell-${id}-${r}-${c + 1}`)?.focus();
    } else if (e.key === 'ArrowLeft' && c > 0) {
      document.getElementById(`matrix-cell-${id}-${r}-${c - 1}`)?.focus();
    } else if (e.key === 'ArrowDown' && r < rows - 1) {
      document.getElementById(`matrix-cell-${id}-${r + 1}-${c}`)?.focus();
    } else if (e.key === 'ArrowUp' && r > 0) {
      document.getElementById(`matrix-cell-${id}-${r - 1}-${c}`)?.focus();
    } else if (e.key === 'Enter') {
      check();
    }
  };

  const showResolutionBookmark = isCompleted && Boolean(resolucionData);
  const showBookmarks = Boolean(errorComunData || showResolutionBookmark);

  return (
    <ExerciseCard
      id={id}
      errorComunData={errorComunData}
      resolucionData={resolucionData}
      isCorrect={isCompleted}
      hasFailed={hasFailed}
      activeTab={activeTab}
      onTabChange={setActiveTab}
      className={`transition-all duration-500 ${isCompleted ? 'bg-musgo/5 border-musgo/30' : ''}`}
    >
      {pregunta && (
        <p className={`text-base font-bold text-carbon mb-6 leading-relaxed relative z-30 ${showBookmarks ? 'pr-20 sm:pr-28' : ''}`}>
          {isCompleted && <span className="text-musgo mr-2">❦</span>}
          {pregunta}
        </p>
      )}

      <div className={`flex flex-col items-center gap-4 ${isShaking ? 'animate-shake' : ''}`}>
        {/* Renderizado de la matriz con corchetes Arts & Crafts */}
        <div className="w-full overflow-x-auto py-2 flex justify-center">
          <div className="relative flex items-center min-w-fit">
            <div
              className={`border-l-2 border-y-2 w-3 absolute left-0 top-0 bottom-0 transition-colors ${
                isCompleted ? 'border-musgo' : 'border-carbon/70'
              }`}
            />

            <div
              className="grid gap-2 p-4"
              style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
            >
              {grid.map((row, r) =>
                row.map((val, c) => (
                  <input
                    key={`${r}-${c}`}
                    id={`matrix-cell-${id}-${r}-${c}`}
                    type="text"
                    value={isCompleted ? correct[r][c] : val}
                    onChange={(e) => handleCellChange(r, c, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(e, r, c)}
                    className={`w-14 h-12 text-center text-lg font-serif outline-none transition-all ${
                      isCompleted
                        ? 'bg-transparent text-musgo font-bold border-none'
                        : 'page-accent-focus bg-lienzo border-b-2 border-dashed border-carbon/40 text-carbon'
                    }`}
                  />
                ))
              )}
            </div>

            <div
              className={`border-r-2 border-y-2 w-3 absolute right-0 top-0 bottom-0 transition-colors ${
                isCompleted ? 'border-musgo' : 'border-carbon/70'
              }`}
            />
          </div>
        </div>

        {!isCompleted && (
          <button
            onClick={check}
            className="ac-btn ac-interactive page-accent-button mt-4 px-6 py-3 text-xs border border-carbon/30 text-carbon shadow-sm hover:shadow-md hover:-translate-y-0.5 cursor-pointer"
          >
            {t('exercise', 'checkMatrix') || 'Comprobar Matriz'}
          </button>
        )}
      </div>

      <QuestionFeedback
        hasFailed={hasFailed}
        isSuccess={isCompleted}
        errorComunData={errorComunData}
        resolucionData={resolucionData}
        onTryAgain={tryAgain}
        onOpenError={() => setActiveTab('error')}
        onOpenResolucion={() => setActiveTab('resolucion')}
      />

      {otherChildren.length > 0 && <div className="mt-4">{otherChildren}</div>}
    </ExerciseCard>
  );
};

MatrizInteractiva.ErrorComun = MatrizInteractivaErrorComun;
MatrizInteractiva.Resolucion = MatrizInteractivaResolucion;
