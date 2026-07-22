import React, { useMemo } from 'react';
import { useMathStore } from '@/shared/lib/MathStoreContext';
import { ProofStepExpander } from './ProofStepExpander';
import { ProofStepNumberBadge } from './ProofStepNumberBadge';

interface ProofStepProps {
  number: number;
  title: string;
  /** Si se provee, activa el estado global "highlight" con este valor cuando el bloque es visible en pantalla */
  target?: string | string[];
  /** Especifica explícitamente el paso de diagrama a activar (ej. 'initial', 1, 'paso-congruencia'). */
  diagramStep?: string | number;
  /** IDs de bloques de táctica Lean asociados a este paso. Se muestran colapsados por defecto. */
  leanBlocks?: string[];
  /** IDs de justificaciones (axiomas, teoremas) de este paso. Si no se provee, se extraen automáticamente de los ConceptLinks. */
  justifications?: string[];
  children?: React.ReactNode;
}

// Función recursiva para extraer automáticamente los targetId de ConceptLink o RefLink en los children de React
const extractConceptIds = (nodes: React.ReactNode): string[] => {
  const ids: string[] = [];
  React.Children.forEach(nodes, (child) => {
    if (React.isValidElement(child)) {
      const props = child.props as Record<string, unknown>;
      const targetId = props?.targetId;
      if (targetId) {
        if (Array.isArray(targetId)) {
          ids.push(targetId[0] as string);
        } else if (typeof targetId === 'string') {
          ids.push(targetId);
        }
      }
      const innerChildren = props?.children as React.ReactNode;
      if (innerChildren) {
        ids.push(...extractConceptIds(innerChildren));
      }
    }
  });
  return Array.from(new Set(ids));
};

/**
 * ProofStep
 *
 * Bloque de paso numerado con estética Arts & Crafts.
 * Su visibilidad y sincronización se controlan de forma centralizada por el CodexLayout
 * mediante atributos de datos (data-target, data-justifications), eliminando observers redundantes.
 */
export const ProofStep: React.FC<ProofStepProps> = ({
  number,
  title,
  target,
  diagramStep,
  leanBlocks = [],
  justifications,
  children,
}) => {
  const finalTarget = target || `step-${number}`;
  const currentStep = useMathStore((state) => state.variables?.['step']);
  
  const isActive = Array.isArray(finalTarget) 
    ? JSON.stringify(currentStep) === JSON.stringify(finalTarget)
    : currentStep === finalTarget;

  // Extraer las justificaciones lógicas automáticamente si no se especifican a mano
  const activeJustifications = useMemo(() => {
    if (justifications && justifications.length > 0) return justifications;
    return extractConceptIds(children);
  }, [children, justifications]);

  return (
    <div
      className={`mt-10 mb-6 w-full proof-step ${isActive ? 'is-active' : ''}`}
      data-target={typeof finalTarget === 'string' ? finalTarget : JSON.stringify(finalTarget)}
      data-diagram-step={diagramStep !== undefined ? String(diagramStep) : ''}
      data-justifications={JSON.stringify(activeJustifications)}
      data-proof-step-number={number}
      id={`proof-step-${number}`}
    >
      {/* Cabecera: número + título */}
      <div className="flex items-center gap-3 lg:gap-4 mb-4">
        <ProofStepNumberBadge number={number} size="header" />

        {/* Título */}
        <h3 className="text-xl lg:text-2xl font-serif m-0 border-b pb-1 flex-1 italic text-carbon border-carbon/20">
          {title}
        </h3>
      </div>

      {/* Contenido del paso */}
      {children && (
        <div className="proof-step-content">
          {children}
          <ProofStepExpander blockIds={leanBlocks} />
        </div>
      )}
    </div>
  );
};

ProofStep.displayName = 'ProofStep';
