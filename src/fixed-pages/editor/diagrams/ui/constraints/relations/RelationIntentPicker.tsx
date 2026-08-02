import React from 'react';
import type { VisualConstraint, VisualDiagramModel } from '../../../model/types';
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

interface RelationIntentPickerProps {
  model: VisualDiagramModel;
  scope: RelationScope;
  targetId: string;
  value: VisualConstraint['kind'];
  onChange: (kind: VisualConstraint['kind']) => void;
  activeKinds?: readonly VisualConstraint['kind'][];
  ignoreKind?: VisualConstraint['kind'];
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
  const entries = scope === 'point' ? relationsForPointPicker() : relationsForScope(scope);
  const selected = relationAvailability(model, value, targetId, activeKinds, { ignoreKind });

  return (
    <div className="space-y-1">
      <label className="block text-[10px] font-bold text-carbon/65">
        Tipo de relación
        <select
          aria-label="Nueva restricción"
          className={diagramControlClassName}
          value={value}
          onChange={event => onChange(event.target.value as VisualConstraint['kind'])}
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
