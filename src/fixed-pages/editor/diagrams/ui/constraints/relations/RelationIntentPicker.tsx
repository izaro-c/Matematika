import React from 'react';
import type { VisualDiagramModel } from '../../../model/types';
import type { RelationIntent } from '../../../model/constraints/relationIntents';
import {
  RELATION_CATEGORY_LABELS,
  RELATION_CATEGORY_ORDER,
  constraintPresentation,
  relationsForPointPicker,
  relationsForScope,
  type RelationScope,
} from '../../../model/constraints/constraintOptions';
import { relationAvailability } from '../../../model/constraints/relationSlots';
import { diagramControlClassName } from '../../primitives';
import { useI18n } from '@/i18n';

interface RelationIntentPickerProps {
  model: VisualDiagramModel;
  scope: RelationScope;
  targetId: string;
  value: RelationIntent;
  onChange: (kind: RelationIntent) => void;
  activeKinds?: readonly RelationIntent[];
  ignoreKind?: RelationIntent;
}

export const RelationIntentPicker: React.FC<RelationIntentPickerProps> = ({
  model,
  scope,
  targetId,
  value,
  onChange,
  activeKinds = [],
  ignoreKind,
}) => {
  const { t } = useI18n();
  const entries = scope === 'point' ? relationsForPointPicker() : relationsForScope(scope);
  const selected = relationAvailability(model, value, targetId, activeKinds, { ignoreKind });

  return (
    <div className="space-y-1">
      <label className="block text-[10px] font-bold text-carbon/65">
        {t('editor.diagramConstraints.relationType')}
        <select
          aria-label={t('editor.diagramConstraints.newConstraintHeading')}
          className={diagramControlClassName}
          value={value}
          onChange={event => onChange(event.target.value as RelationIntent)}
        >
          {RELATION_CATEGORY_ORDER.map(category => {
            const options = entries.filter(entry => entry.category === category);
            if (options.length === 0) return null;
            return (
              <optgroup key={category} label={RELATION_CATEGORY_LABELS[category]}>
                {options.map(option => {
                  const availability = relationAvailability(model, option.value, targetId, activeKinds, { ignoreKind });
                  return (
                    <option
                      key={option.value}
                      value={option.value}
                      disabled={availability.status === 'disabled'}
                      title={availability.reason}
                    >
                      {option.label}
                    </option>
                  );
                })}
              </optgroup>
            );
          })}
        </select>
      </label>
      <p className="text-[10px] leading-relaxed text-carbon/50">
        {constraintPresentation(value).description}
      </p>
      {selected.status === 'disabled' && selected.reason && (
        <p className="rounded bg-ocre/10 p-2 text-[10px] font-medium leading-relaxed text-ocre" role="status">
          {selected.reason}
        </p>
      )}
    </div>
  );
};

export default RelationIntentPicker;
