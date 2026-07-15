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
      <span className="rounded border border-pavo/20 bg-pavo/10 px-3 py-1.5 text-xs font-serif font-bold text-pavo">
        Código de diagrama
      </span>
    );
  }

  return (
    <div className="flex rounded border border-carbon/15 bg-carbon/5 p-0.5" aria-label="Modo de edición">
      <button
        type="button"
        onClick={() => editorMode === 'code' && onToggleMode()}
        aria-pressed={editorMode === 'visual'}
        title="Editar el documento mediante bloques estructurados"
        className={`rounded px-3 py-1.5 text-xs font-bold transition-all ${
          editorMode === 'visual'
            ? 'bg-lienzo text-carbon shadow-sm'
            : 'text-carbon/60 hover:text-carbon'
        }`}
      >
        Visual
      </button>
      <button
        type="button"
        onClick={() => editorMode === 'visual' && onToggleMode()}
        aria-pressed={editorMode === 'code'}
        title="Editar directamente el código fuente MDX"
        className={`rounded px-3 py-1.5 text-xs font-bold transition-all ${
          editorMode === 'code'
            ? 'bg-lienzo text-carbon shadow-sm'
            : 'text-carbon/60 hover:text-carbon'
        }`}
      >
        Código
      </button>
    </div>
  );
};
