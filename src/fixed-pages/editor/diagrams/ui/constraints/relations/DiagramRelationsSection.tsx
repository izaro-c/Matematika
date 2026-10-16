import { objectKind } from '@/diagrams';
import React from 'react';
import type { VisualDiagramModel, VisualElement, VisualPoint } from '../../../model/types';
import { DiagramConstraintEditor } from '../../panels/DiagramConstraintEditor';
import { SegmentLengthConstraintEditor } from '../SegmentLengthConstraintEditor';
import { SegmentReflectionConstraintEditor } from '../SegmentReflectionConstraintEditor';
import { AngleEqualityConstraintEditor } from '../AngleEqualityConstraintEditor';
import type { RelationScope } from '../../../model/constraints/constraintOptions';
import { useI18n } from '@/i18n';

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
  const { t } = useI18n();
  if (scope === 'point' && point) {
    return <DiagramConstraintEditor model={model} point={point} onModelEdit={onModelEdit} />;
  }

  if (scope === 'segment' && element && objectKind(element) === 'segment') {
    return (
      <section className="space-y-2" aria-label={t('editor.diagramConstraints.segmentRelationsTitle')}>
        <div className="flex items-start justify-between gap-3">
          <div>
            <h5 className="text-xs font-bold text-carbon">{t('editor.diagramConstraints.geometricRelations')}</h5>
            <p className="mt-1 text-[10px] leading-relaxed text-carbon/50">
              {t('editor.diagramConstraints.segmentRelationsHint')}
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

  if (scope === 'angle' && element && ['angle', 'nonReflexAngle'].includes(objectKind(element))) {
    return (
      <section className="space-y-2" aria-label={t('editor.diagramConstraints.angleRelationsTitle')}>
        <div className="flex items-start justify-between gap-3">
          <div>
            <h5 className="text-xs font-bold text-carbon">{t('editor.diagramConstraints.geometricRelations')}</h5>
            <p className="mt-1 text-[10px] leading-relaxed text-carbon/50">
              {t('editor.diagramConstraints.angleRelationsHint')}
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
