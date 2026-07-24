import React from 'react';
import { DiagramRuntimePreview } from './DiagramRuntimePreview';

interface DiagramCodePanelProps {
  source: string;
  sourceTouched: boolean;
  filePath?: string | null;
  componentName?: string;
  onSourceChange: (source: string) => void;
  onRegenerate?: () => void;
}

export const DiagramCodePanel: React.FC<DiagramCodePanelProps> = ({
  source,
  sourceTouched,
  filePath = null,
  componentName = '',
  onSourceChange,
  onRegenerate,
}) => {
  return (
    <div className="grid min-h-0 flex-1 grid-cols-[minmax(0,1fr)_320px] overflow-hidden">
      <div className="min-w-0 p-4 h-full flex flex-col">
        <textarea
          className="flex-1 w-full resize-none rounded border border-carbon/15 bg-carbon/[0.03] p-4 font-mono text-xs leading-relaxed text-carbon outline-none focus:border-salvia"
          value={source}
          onChange={(e) => onSourceChange(e.target.value)}
          spellCheck={false}
        />
      </div>
      <aside className="space-y-4 overflow-y-auto border-l border-carbon/15 bg-carbon/5 p-4">
        <div className="rounded border border-carbon/10 bg-lienzo p-3">
          <h4 className="ac-label ac-label--sm ac-label--soft">Vista previa del archivo guardado</h4>
          <p className="mt-2 text-[11px] text-carbon/55">
            La vista previa ejecuta el componente real. Los cambios de código aparecen aquí después de guardarlos correctamente.
          </p>
          <div className="mt-3">
            <DiagramRuntimePreview filePath={filePath} componentName={componentName} />
          </div>
        </div>
        <div className="rounded border border-carbon/10 bg-lienzo p-3">
          <h4 className="ac-label ac-label--sm ac-label--soft">Edición de código</h4>
          <p className="mt-2 text-xs italic text-carbon/60">
            El TSX completo es la autoridad. La edición visual solo se habilita cuando el modelo regenera todo el archivo de forma idéntica.
          </p>
          {sourceTouched && (
            <p className="mt-2 rounded border border-ocre/30 bg-ocre/10 p-2 text-xs text-carbon">
              La fuente fue editada manualmente.
            </p>
          )}
          {onRegenerate && (
            <button
              type="button"
              onClick={onRegenerate}
              className="mt-3 w-full rounded bg-pavo/10 py-2 text-xs font-bold text-pavo hover:bg-pavo/20"
            >
              Regenerar desde el modelo visual exacto
            </button>
          )}
        </div>
        {onRegenerate && <div className="rounded border border-carbon/10 bg-lienzo p-3">
          <p className="ac-label ac-label--sm ac-label--soft">Garantías del generador visual</p>
          <ul className="mt-2 space-y-1 text-xs text-carbon/70 font-sans list-disc pl-4">
            <li>Usa MathBoard y MathFactory.</li>
            <li>Usa tokens Arts & Crafts, sin hex arbitrarios.</li>
            <li>Expone targets para InteractiveElement.</li>
          </ul>
        </div>}
      </aside>
    </div>
  );
};
export default DiagramCodePanel;
