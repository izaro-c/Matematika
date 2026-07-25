import React from 'react';

interface ObjectListItemProps {
  id: string;
  label: string;
  kind: string;
  groupIdsCount: number;
  visible: boolean;
  locked: boolean;
  isSelected: boolean;
  isMultiSelected: boolean;
  hasError: boolean;
  canEdit: boolean;
  onSelect: (id: string) => void;
  onToggleSelection: (id: string) => void;
  onToggleVisible: (id: string, current: boolean) => void;
  onToggleLocked: (id: string, current: boolean) => void;
}

function EyeIcon({ visible }: { visible: boolean }) {
  return visible ? (
    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
      <path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="12" cy="12" r="2.6" fill="currentColor" />
    </svg>
  ) : (
    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
      <path d="M3 4.5 21 19.5M9.6 6.4A10.5 10.5 0 0 1 12 6c6 0 9.5 6 9.5 6a14 14 0 0 1-2.2 2.8M6.3 8.1A15 15 0 0 0 2.5 12s3.5 6 9.5 6c1 0 1.9-.2 2.8-.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function LockIcon({ locked }: { locked: boolean }) {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
      <rect x="5" y="10" width="14" height="10" rx="2" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <path d={locked ? 'M8 10V7a4 4 0 0 1 8 0v3' : 'M9 10V7a4 4 0 0 1 7.5-2'} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

export const ObjectListItem: React.FC<ObjectListItemProps> = ({
  id,
  label,
  kind,
  groupIdsCount,
  visible,
  locked,
  isSelected,
  isMultiSelected,
  hasError,
  canEdit,
  onSelect,
  onToggleSelection,
  onToggleVisible,
  onToggleLocked,
}) => {
  let rowStyle = 'border-carbon/10 text-carbon hover:bg-carbon/5';
  if (hasError && isSelected) {
    rowStyle = 'border-2 border-granada bg-granada text-lienzo';
  } else if (hasError) {
    rowStyle = 'border-2 border-granada bg-granada/20 text-carbon';
  } else if (isSelected) {
    rowStyle = 'border-carbon bg-carbon text-lienzo shadow-xs';
  } else if (isMultiSelected) {
    rowStyle = 'border-pavo/45 bg-pavo/10 text-carbon';
  }

  return (
    <div
      data-object-id={id}
      role="treeitem"
      aria-selected={isMultiSelected || isSelected}
      className={`grid grid-cols-[2.75rem_minmax(0,1fr)_2.75rem_2.75rem] items-stretch overflow-hidden rounded-lg border transition-colors ${rowStyle}`}
    >
      <label className="flex min-h-11 items-center justify-center border-r border-current/15 cursor-pointer" title={`Incluir ${label} en la selección múltiple`}>
        <input
          type="checkbox"
          aria-label={`Seleccionar ${label}`}
          checked={isMultiSelected}
          onChange={() => onToggleSelection(id)}
          className="h-4 w-4 accent-pavo cursor-pointer"
        />
      </label>

      <button
        type="button"
        onClick={() => onSelect(id)}
        className="min-h-11 min-w-0 px-2 py-1.5 text-left"
        aria-label={hasError ? `${label}, tiene errores` : label}
      >
        <span className="block truncate text-sm font-bold">{label}</span>
        <span className={`block truncate text-xs ${isSelected ? 'text-lienzo/75' : 'text-carbon/50'}`}>
          {kind} · {id}
          {groupIdsCount > 0 ? ` · ${groupIdsCount} grupo(s)` : ''}
        </span>
      </button>

      <button
        type="button"
        disabled={!canEdit}
        aria-label={`${visible ? 'Ocultar' : 'Mostrar'} ${label}`}
        aria-pressed={visible}
        title={visible ? 'Visible: pulsar para ocultar' : 'Oculto: pulsar para mostrar'}
        onClick={() => onToggleVisible(id, visible)}
        className="flex min-h-11 items-center justify-center border-l border-current/15 transition-opacity disabled:opacity-40 hover:bg-current/10"
      >
        <EyeIcon visible={visible} />
      </button>

      <button
        type="button"
        disabled={!canEdit}
        aria-label={`${locked ? 'Desbloquear' : 'Bloquear'} ${label}`}
        aria-pressed={locked}
        title={locked ? 'Bloqueado: pulsar para editar' : 'Editable: pulsar para bloquear'}
        onClick={() => onToggleLocked(id, locked)}
        className="flex min-h-11 items-center justify-center border-l border-current/15 transition-opacity disabled:opacity-40 hover:bg-current/10"
      >
        <LockIcon locked={locked} />
      </button>
    </div>
  );
};
