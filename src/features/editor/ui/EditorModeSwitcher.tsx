import React from 'react';
import type { EditorMode } from '../core/editorTypes';

interface EditorModeSwitcherProps {
  editorMode: EditorMode;
  isDiagramFile: boolean;
  onToggleMode: () => void;
}

export const EditorModeSwitcher: React.FC<EditorModeSwitcherProps> = ({
  editorMode,
  isDiagramFile,
  onToggleMode,
}) => {
  if (isDiagramFile) {
    return (
      <span className="rounded border border-pavo/20 bg-pavo/10 px-3 py-1 text-xs font-serif font-bold text-pavo">
        Diagrama TSX
      </span>
    );
  }

  return (
    <div className="flex bg-carbon/5 border border-carbon/15 rounded-sm p-0.5">
      <button
        type="button"
        onClick={() => editorMode === 'code' && onToggleMode()}
        className={`px-3 py-1 text-xs rounded-sm transition-all font-bold font-serif cursor-pointer ${
          editorMode === 'visual'
            ? 'bg-lienzo text-carbon shadow-sm'
            : 'text-carbon/60 hover:text-carbon'
        }`}
      >
        Modo Visual (Experimental)
      </button>
      <button
        type="button"
        onClick={() => editorMode === 'visual' && onToggleMode()}
        className={`px-3 py-1 text-xs rounded-sm transition-all font-bold font-serif cursor-pointer ${
          editorMode === 'code'
            ? 'bg-lienzo text-carbon shadow-sm'
            : 'text-carbon/60 hover:text-carbon'
        }`}
      >
        Código Fuente
      </button>
    </div>
  );
};
