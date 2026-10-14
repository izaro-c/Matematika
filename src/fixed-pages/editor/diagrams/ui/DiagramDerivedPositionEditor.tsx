import React from 'react';
import { expressionSourceIds } from '@/diagrams';
import type { VisualDiagramModel, VisualPoint } from '../model/types';
import { DiagramExpressionField } from './panels/DiagramExpressionField';
import { DiagramPanel } from './primitives';

interface DiagramDerivedPositionEditorProps {
  model: VisualDiagramModel;
  point: VisualPoint;
  onExpressionChange: (axis: 'x' | 'y', expression: string) => void;
  xExpressionError?: string;
  yExpressionError?: string;
}

/** Objetos del diagrama que leen las expresiones, sin repetidos y en orden de aparición. */
export function expressionDependencySources(model: VisualDiagramModel, expressions: Array<string | undefined>): string[] {
  const sceneIds = new Set(model.objects.map(item => item.id));
  return [...new Set(expressions.flatMap(expressionSourceIds))].filter(id => sceneIds.has(id));
}

function sceneItemLabel(model: VisualDiagramModel, id: string): string {
  const object = model.objects.find(item => item.id === id);
  return object ? `${object.label} (${id})` : id;
}

export const DiagramDerivedPositionEditor: React.FC<DiagramDerivedPositionEditorProps> = ({
  model,
  point,
  onExpressionChange,
  xExpressionError,
  yExpressionError,
}) => {
  const definition = point.definition.type === 'expression' ? point.definition : undefined;
  const inferredDependencies = expressionDependencySources(model, [definition?.x, definition?.y]);

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
      <div data-inspector-field="xExpression">
        <DiagramExpressionField
          model={model}
          label="Coordenada x"
          ariaLabel="Expresión x derivada"
          value={definition?.x || ''}
          onChange={value => onExpressionChange('x', value)}
          help="Ejemplo: pA.x + 2 o dist(segAB)."
          error={xExpressionError}
        />
      </div>
      <div data-inspector-field="yExpression">
        <DiagramExpressionField
          model={model}
          label="Coordenada y"
          ariaLabel="Expresión y derivada"
          value={definition?.y || ''}
          onChange={value => onExpressionChange('y', value)}
          help="Ejemplo: pA.y o 0.5 * (pB.y + pC.y)."
          error={yExpressionError}
        />
      </div>
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
