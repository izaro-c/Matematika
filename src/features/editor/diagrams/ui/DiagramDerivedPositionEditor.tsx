import React from 'react';
import type { VisualDiagramModel, VisualPoint } from '../model/types';
import { expressionDependencySources } from './inspector/useInspectorHandlers';
import { DiagramExpressionField } from './DiagramExpressionField';
import { DiagramPanel } from './primitives';

interface DiagramDerivedPositionEditorProps {
  model: VisualDiagramModel;
  point: VisualPoint;
  onPointChange: (update: Partial<VisualPoint>) => void;
  xExpressionError?: string;
  yExpressionError?: string;
}

function sceneItemLabel(model: VisualDiagramModel, id: string): string {
  const point = model.points.find(item => item.id === id);
  if (point) return `${point.label} (${id})`;
  const element = model.elements.find(item => item.id === id);
  if (element) return `${element.label} (${id})`;
  const slider = model.sliders.find(item => item.id === id);
  if (slider) return `${slider.label} (${id})`;
  return id;
}

export const DiagramDerivedPositionEditor: React.FC<DiagramDerivedPositionEditorProps> = ({
  model,
  point,
  onPointChange,
  xExpressionError,
  yExpressionError,
}) => {
  const inferredDependencies = expressionDependencySources(model, [
    point.xExpression,
    point.yExpression,
  ]);

  return (
    <DiagramPanel
      title="Posición calculada"
      badge="Por expresiones"
      collapsible
      defaultOpen
    >
      <p className="text-[10px] leading-relaxed text-carbon/55">
        Las coordenadas se obtienen de fórmulas. El punto no se arrastra: cambia cuando cambian los objetos referenciados en las expresiones.
      </p>
      <DiagramExpressionField
        model={model}
        label="Coordenada x"
        ariaLabel="Expresión x derivada"
        value={point.xExpression || ''}
        onChange={value => onPointChange({ xExpression: value })}
        help="Ejemplo: pA.x + 2 o dist(segAB)."
      />
      {xExpressionError && <p className="text-[10px] text-granada">{xExpressionError}</p>}
      <DiagramExpressionField
        model={model}
        label="Coordenada y"
        ariaLabel="Expresión y derivada"
        value={point.yExpression || ''}
        onChange={value => onPointChange({ yExpression: value })}
        help="Ejemplo: pA.y o 0.5 * (pB.y + pC.y)."
      />
      {yExpressionError && <p className="text-[10px] text-granada">{yExpressionError}</p>}
      <div className="rounded border border-carbon/10 bg-lienzo px-2 py-1.5">
        <p className="text-[10px] font-bold text-carbon/70">Objetos detectados en las expresiones</p>
        {inferredDependencies.length === 0 ? (
          <p className="mt-1 text-[10px] leading-relaxed text-carbon/45">
            Aparecerán aquí automáticamente al usar identificadores de puntos, segmentos o controles en las fórmulas.
          </p>
        ) : (
          <ul className="mt-1 space-y-0.5 text-[10px] text-carbon/60">
            {inferredDependencies.map(id => (
              <li key={id}>{sceneItemLabel(model, id)}</li>
            ))}
          </ul>
        )}
      </div>
    </DiagramPanel>
  );
};

export default DiagramDerivedPositionEditor;
