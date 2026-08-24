import React, { useRef } from 'react';
import { useI18n } from '@/i18n';
import { useExerciseQuestion } from '../../hooks/useExerciseQuestion';
import { useSubcomponents } from '../../hooks/useSubcomponents';
import { ExerciseCard } from '../shared/ExerciseCard';
import { QuestionFeedback } from '../shared/QuestionFeedback';
import { CANVAS_VALIDATORS, CANVAS_INITIAL_SPECS } from '../../validators/canvasValidators';
import type { DiagramSpecV3 } from '@/diagrams';
import type { ErrorComunProps, ResolucionProps, BaseQuestionProps } from '../../types';
import { CanvasControlContext, useCanvasControl } from '@/diagrams/render/CanvasControlContext';

export { useCanvasControl };

export interface CanvasInteractivoProps extends BaseQuestionProps {
  /** Título opcional del lienzo interactivo */
  title?: string;
  /** Enunciado opcional de la pregunta del lienzo */
  pregunta?: string;
  /** Texto del botón de acción manual (opcional) */
  botonTexto?: string;
  /** Función de validación personalizada para el DiagramSpecV3 */
  validator?: (spec?: DiagramSpecV3) => boolean;
  /** Componentes hijos del diagrama */
  children: React.ReactNode;
}

const CanvasInteractivoErrorComun: React.FC<ErrorComunProps> = () => null;
CanvasInteractivoErrorComun.displayName = 'CanvasInteractivoErrorComun';

const CanvasInteractivoResolucion: React.FC<ResolucionProps> = () => null;
CanvasInteractivoResolucion.displayName = 'CanvasInteractivoResolucion';

type CanvasInteractivoComponent = React.FC<CanvasInteractivoProps> & {
  ErrorComun: React.FC<ErrorComunProps>;
  Resolucion: React.FC<ResolucionProps>;
};

/**
 * CanvasInteractivo — Envoltorio estandarizado que conecta diagramas visuales con el motor de ejercicios
 * y la tarjeta con marcapáginas Arts & Crafts.
 *
 * Mantiene la separación de responsabilidades: los diagramas son especificaciones V3 puras,
 * mientras que la validación del estado del ejercicio se ejecuta modularmente.
 */
export const CanvasInteractivo: CanvasInteractivoComponent = ({
  id,
  title,
  pregunta,
  botonTexto,
  validator,
  children,
}) => {
  const { t } = useI18n();

  const {
    isCompleted,
    hasFailed,
    userAnswer,
    activeTab,
    setActiveTab,
    submitAnswer,
    tryAgain,
  } = useExerciseQuestion({
    id,
    type: 'canvas',
  });

  const { errorComunData, resolucionData, otherChildren } = useSubcomponents(children);

  const currentSpecRef = useRef<DiagramSpecV3 | undefined>(undefined);

  const baseChild = otherChildren.find(React.isValidElement);
  const initialSpecFromChild = (baseChild?.props as any)?.spec;
  const initialSpec = initialSpecFromChild || CANVAS_INITIAL_SPECS[id];

  // Únicamente pasamos una especificación congelada a través de props cuando el ejercicio
  // está completado (restaurando la respuesta guardada del usuario).
  // Durante la resolución activa (no completado), dejamos que DiagramRenderer maneje la especificación
  // inicial para no interferir ni bloquear el arrastre fluido del lienzo JSXGraph.
  const activeCompletedSpec = isCompleted ? (userAnswer as DiagramSpecV3) : undefined;

  const handlePointMove = (pointId: string, x: number, y: number, updatedSpec?: DiagramSpecV3) => {
    if (isCompleted) return;

    if (updatedSpec) {
      currentSpecRef.current = updatedSpec;
      return;
    }

    const baseSpec = currentSpecRef.current || (userAnswer as DiagramSpecV3) || initialSpec;

    if (baseSpec && Array.isArray(baseSpec.objects)) {
      currentSpecRef.current = {
        ...baseSpec,
        objects: baseSpec.objects.map((obj: any) =>
          obj.id === pointId && obj.objectType === 'point'
            ? { ...obj, definition: { ...obj.definition, type: 'coordinates', x, y } }
            : obj
        ),
      };
    }
  };

  const handleComplete = () => {
    if (isCompleted) return;
    const specToSave = currentSpecRef.current || (userAnswer as DiagramSpecV3) || initialSpec;
    submitAnswer(true, specToSave);
  };

  const handleValidate = () => {
    if (isCompleted) return;

    const specToValidate = currentSpecRef.current || (userAnswer as DiagramSpecV3) || initialSpec;

    // Buscar validador explícito o registrado por ID
    const validateFn = validator || CANVAS_VALIDATORS[id];
    const isValid = validateFn ? validateFn(specToValidate) : true;

    if (isValid) {
      submitAnswer(true, specToValidate);
    } else {
      submitAnswer(false, specToValidate);
    }
  };

  const handleTryAgain = () => {
    currentSpecRef.current = undefined;
    tryAgain();
  };

  const renderedChildren = otherChildren.map((child, index) =>
    React.isValidElement(child)
      ? React.cloneElement(child, { key: child.key ?? index } as any)
      : child
  );

  return (
    <ExerciseCard
      id={id}
      errorComunData={errorComunData}
      resolucionData={resolucionData}
      isCorrect={isCompleted}
      hasFailed={hasFailed}
      activeTab={activeTab}
      onTabChange={setActiveTab}
      className={`transition-all`}
      pregunta={title}
    >

      {pregunta && (
        <p className="text-sm text-carbon/80 mb-3 font-serif italic">
          {pregunta}
        </p>
      )}

      <CanvasControlContext.Provider value={{ onComplete: handleComplete, isCompleted, activeSpec: activeCompletedSpec, onPointMove: handlePointMove, hideHeader: true }}>
        <div className={`relative mb-3 w-full h-[360px] max-h-[360px] overflow-hidden bg-lienzo transition-colors ${isCompleted ? 'pointer-events-none select-none' : ''}`}>
          {renderedChildren}
          {isCompleted && (
            <div className="absolute inset-0 z-50 pointer-events-none bg-musgo/[0.02]" />
          )}
        </div>

        {!isCompleted && (
          <div className="mt-4 flex justify-end border-t border-carbon/10 pt-3">
            <button
              onClick={handleValidate}
              className="ac-btn ac-interactive page-accent-button px-6 py-3 text-xs border border-carbon/30 text-carbon transition-colors cursor-pointer"
            >
              {botonTexto || t('exercise', 'check') || 'Validar / Completar Análisis'}
            </button>
          </div>
        )}
      </CanvasControlContext.Provider>

      <QuestionFeedback
        hasFailed={hasFailed}
        isSuccess={isCompleted}
        errorComunData={errorComunData}
        resolucionData={resolucionData}
        onTryAgain={handleTryAgain}
        onOpenError={() => setActiveTab('error')}
        onOpenResolucion={() => setActiveTab('resolucion')}
      />
    </ExerciseCard>
  );
};

CanvasInteractivo.ErrorComun = CanvasInteractivoErrorComun;
CanvasInteractivo.Resolucion = CanvasInteractivoResolucion;
