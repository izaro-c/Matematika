import React from 'react';
import type { DiagramSceneItem } from '@/diagrams';
import { diagramControlClassName } from '../../primitives';
import { DiagramFormField } from '../../primitives/DiagramFormField';
import { useReferencePick } from './useReferencePick';

interface RelationSlotFieldProps {
  label: string;
  value: string;
  candidates: readonly DiagramSceneItem[];
  emptyHint: string;
  pickHint: string;
  ariaLabel: string;
  onChange: (id: string) => void;
  optionalEmptyOption?: { value: string; label: string };
}

export const RelationSlotField: React.FC<RelationSlotFieldProps> = ({
  label,
  value,
  candidates,
  emptyHint,
  pickHint,
  ariaLabel,
  onChange,
  optionalEmptyOption,
}) => {
  const { session, beginPick, clearPick } = useReferencePick();
  const allowedIds = candidates.map(item => item.id);
  const pickKey = `${ariaLabel}:${label}`;
  const picking = session?.key === pickKey;

  const togglePick = () => {
    if (picking) {
      clearPick();
      return;
    }
    if (allowedIds.length === 0) return;
    beginPick({
      key: pickKey,
      allowedIds,
      hint: pickHint,
      onPick: onChange,
    });
  };

  return (
    <div className="space-y-1">
      <DiagramFormField label={label} labelClassName="text-[10px] font-bold text-carbon/65" className="p-0 border-0">
        <select
          aria-label={ariaLabel}
          className={diagramControlClassName}
          value={value}
          onChange={event => onChange(event.target.value)}
          disabled={candidates.length === 0 && !optionalEmptyOption}
        >
          {optionalEmptyOption && (
            <option value={optionalEmptyOption.value}>{optionalEmptyOption.label}</option>
          )}
          {candidates.length === 0 && !optionalEmptyOption && (
            <option value="">{emptyHint}</option>
          )}
          {candidates.map(item => (
            <option key={item.id} value={item.id}>
              {item.label} ({item.id})
            </option>
          ))}
        </select>
      </DiagramFormField>
      {candidates.length === 0 && !optionalEmptyOption ? (
        <p className="text-[10px] leading-relaxed text-ocre" role="status">{emptyHint}</p>
      ) : (
        <button
          type="button"
          aria-pressed={picking}
          aria-label={picking ? 'Cancelar elección en el lienzo' : 'Elegir en el lienzo'}
          className={picking
            ? 'min-h-11 rounded bg-pavo px-2 text-xs font-bold text-lienzo'
            : 'min-h-11 rounded border border-pavo/25 bg-lienzo px-2 text-xs font-bold text-pavo disabled:cursor-not-allowed disabled:opacity-35'}
          onClick={togglePick}
          disabled={allowedIds.length === 0}
        >
          {picking ? 'Cancelar elección' : 'Elegir en el lienzo'}
        </button>
      )}
    </div>
  );
};

export default RelationSlotField;
