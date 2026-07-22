import React, { useMemo, Suspense } from 'react';
import { useMathStore } from '@/shared/lib/MathStoreContext';
import { CodexLayout } from '@/widgets/layouts/CodexLayout';
import { insertQedAfterLastProofStep } from './insertQedAfterLastProofStep';

/**
 * Propiedades para el componente DemonstrationSection.
 * @property {React.ReactNode} diagram - El componente visual (JSXGraph/ThreeJS) único.
 * @property {Record<string, React.ReactNode>} diagrams - Mapa de diagramas por cada "paso" (highlight id).
 * @property {React.ReactNode} children - El texto o contenido markdown (pasos de la demostración) que escrolea en la derecha.
 */
interface DemonstrationSectionProps {
  diagram?: React.ReactNode;
  diagrams?: Record<string, React.ReactNode>;
  children: React.ReactNode;
}

interface DiagramFrame {
  key: React.Key;
  node: React.ReactNode;
}

const DiagramTransition: React.FC<{ activeKey: React.Key; frames: DiagramFrame[] }> = ({ activeKey, frames }) => {
  const activeIndex = Math.max(0, frames.findIndex(frame => frame.key === activeKey));
  return (
    <div className="diagram-transition-stack" data-diagram-transition-key={String(activeKey)}>
      {frames.map((frame, index) => {
        const isCurrent = index === activeIndex;
        return (
          <div
            key={frame.key}
            className={`diagram-transition-frame ${isCurrent ? 'is-current' : 'is-inactive'}`}
            data-diagram-transition-state={isCurrent ? 'current' : 'inactive'}
            aria-hidden={isCurrent ? undefined : true}
            style={{
              opacity: isCurrent ? 1 : 0.35,
              transform: `translateY(${(index - activeIndex) * 100}%)`,
            }}
          >
            <Suspense fallback={<div className="animate-pulse text-carbon/40 font-serif">Cargando visualización...</div>}>
              {frame.node}
            </Suspense>
          </div>
        );
      })}
    </div>
  );
};

/**
 * Componente layout para demostraciones interactivas.
 *
 * Implementa scrollytelling con una única instancia del diagrama activo.
 * - Evita colisión de múltiples tableros JSXGraph paralelos en el DOM, garantizando la estabilidad de tamaño.
 * - Implementa un extractor numérico tolerante a diferencias tipográficas en los pasos.
 */
export const DemonstrationSection: React.FC<DemonstrationSectionProps> = ({ diagram, diagrams, children }) => {
  const step = useMathStore(state => state.variables?.['step']);

  const { activeDiagram, activeKey } = useMemo(() => {
    if (!diagrams) return { activeDiagram: diagram, activeKey: 'default' };

    const keys = Object.keys(diagrams);
    if (keys.length === 0) return { activeDiagram: null, activeKey: 'default' };

    const stepStr = typeof step === 'string' ? step.trim() : '';

    // 1. Coincidencia exacta (ej. "step1")
    if (stepStr && diagrams[stepStr]) {
      return { activeDiagram: diagrams[stepStr], activeKey: stepStr };
    }

    // 2. Extracción numérica inteligente para robustez didáctica (ej: "step-2" o "step2" -> "2")
    const digitsMatch = stepStr.match(/\d+/);
    const stepNum = digitsMatch ? digitsMatch[0] : '';

    if (stepNum) {
      // Coincidencia con número simple (ej: "2")
      if (diagrams[stepNum]) return { activeDiagram: diagrams[stepNum], activeKey: stepNum };

      // Coincidencia parcial con variante (ej: "step2", "step-2")
      const foundKey = keys.find(k => {
        const kDigits = k.match(/\d+/);
        return kDigits ? kDigits[0] === stepNum : false;
      });
      if (foundKey) return { activeDiagram: diagrams[foundKey], activeKey: foundKey };
    }

    // 3. Fallback al primer diagrama
    return { activeDiagram: diagrams[keys[0]], activeKey: keys[0] };
  }, [diagram, diagrams, step]);

  const hasDiagram = diagram !== undefined || (diagrams !== undefined && Object.keys(diagrams).length > 0);
  const transitionKey = React.isValidElement(activeDiagram) && activeDiagram.key !== null
    ? activeDiagram.key
    : activeKey;
  const diagramFrames = useMemo(() => {
    const entries: Array<[string, React.ReactNode]> = diagrams
      ? Object.entries(diagrams)
      : (diagram !== undefined ? [['default', diagram]] : []);
    const uniqueFrames = new Map<React.Key, DiagramFrame>();

    entries.forEach(([key, node]) => {
      const frameKey = React.isValidElement(node) && node.key !== null ? node.key : key;
      if (!uniqueFrames.has(frameKey)) uniqueFrames.set(frameKey, { key: frameKey, node });
    });

    return Array.from(uniqueFrames.values());
  }, [diagram, diagrams]);

  const proofContent = useMemo(() => insertQedAfterLastProofStep(children), [children]);

  return (
    <CodexLayout
      diagram={hasDiagram && activeDiagram ? (
        <DiagramTransition activeKey={transitionKey} frames={diagramFrames} />
      ) : undefined}
      diagramLabel="Diagrama de la demostración"
    >
      <div className="prose prose-pizarra prose-lg max-w-none w-full editorial-reading">
        {proofContent}
      </div>
    </CodexLayout>
  );
};
export default DemonstrationSection;
