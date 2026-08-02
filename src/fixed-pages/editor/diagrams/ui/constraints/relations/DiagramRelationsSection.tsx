import React from 'react';
import type { VisualDiagramModel, VisualElement, VisualPoint } from '../../../model/types';
import { DiagramConstraintEditor } from '../../panels/DiagramConstraintEditor';
import { SegmentLengthConstraintEditor } from '../SegmentLengthConstraintEditor';
import { SegmentReflectionConstraintEditor } from '../SegmentReflectionConstraintEditor';
import { AngleEqualityConstraintEditor } from '../AngleEqualityConstraintEditor';
import type { RelationScope } from '../../../model/constraints/constraintOptions';

export type DiagramRelationsScope = RelationScope;

interface DiagramRelationsSectionProps {
  model: VisualDiagramModel;
  onModelEdit: (model: VisualDiagramModel) => void;
  scope: DiagramRelationsScope;
  point?: VisualPoint;
  element?: VisualElement;
}

export const DiagramRelationsSection: React.FC<DiagramRelationsSectionProps> = ({
  model,
  onModelEdit,
  scope,
  point,
  element,
}) => {
  if (scope === 'point' && point) {
    return <DiagramConstraintEditor model={model} point={point} onModelEdit={onModelEdit} />;
  }

  if (scope === 'segment' && element?.kind === 'segment') {
    return (
      <section className="space-y-2" aria-label="Relaciones geométricas del segmento">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h5 className="text-xs font-bold text-carbon">Relaciones geométricas</h5>
            <p className="mt-1 text-[10px] leading-relaxed text-carbon/50">
              Igualar longitudes y reflejos simétricos se configuran desde el segmento.
            </p>
          </div>
        </div>
        <SegmentLengthConstraintEditor
          key={element.id}
          model={model}
          segment={element}
          onModelEdit={onModelEdit}
        />
        <SegmentReflectionConstraintEditor
          key={`refl-${element.id}`}
          model={model}
          segment={element}
          onModelEdit={onModelEdit}
        />
      </section>
    );
  }

  if (scope === 'angle' && element && (element.kind === 'angle' || element.kind === 'nonReflexAngle')) {
    return (
      <section className="space-y-2" aria-label="Relaciones geométricas del ángulo">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h5 className="text-xs font-bold text-carbon">Relaciones geométricas</h5>
            <p className="mt-1 text-[10px] leading-relaxed text-carbon/50">
              La igualdad de amplitud se configura desde el ángulo.
            </p>
          </div>
        </div>
        <AngleEqualityConstraintEditor
          key={element.id}
          model={model}
          angle={element}
          onModelEdit={onModelEdit}
        />
      </section>
    );
  }

  return null;
};

export default DiagramRelationsSection;
