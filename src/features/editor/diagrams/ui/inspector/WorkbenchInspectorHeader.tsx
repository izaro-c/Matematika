import React from 'react';
import { IconTrash } from '../WorkbenchIcons';

interface InspectorHeaderProps {
  title: string;
  colorClass: string;
  onDelete: () => void;
}

export const InspectorHeader: React.FC<InspectorHeaderProps> = ({ title, colorClass, onDelete }) => (
  <div className="flex items-center justify-between border-b border-carbon/10 pb-2">
    <div className="flex items-center space-x-2">
      <span className={`h-3 w-3 rounded-full border border-carbon/20 shrink-0 ${colorClass}`} />
      <h3 className="font-bold text-sm truncate max-w-[180px]">{title}</h3>
    </div>
    <button
      type="button"
      onClick={onDelete}
      className="flex items-center space-x-1 px-2 py-1 text-granada hover:bg-granada/10 rounded transition-colors cursor-pointer text-[11px] font-bold"
    >
      <IconTrash className="w-3.5 h-3.5" />
      <span>Eliminar</span>
    </button>
  </div>
);
