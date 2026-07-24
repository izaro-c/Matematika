import React from 'react';
import type { EditorValidationIssue, EditorValidationResult } from '../../core/editorTypes';

interface ValidationPanelProps {
  validation: EditorValidationResult;
  onSelectIssue?: (issue: EditorValidationIssue) => void;
}

const AREA_LABELS: Record<string, string> = {
  metadata: 'Metadatos',
  body: 'Contenido',
  block: 'Bloque',
  diagram: 'Diagrama',
  proof: 'Demostración',
  source: 'Fuente',
};

export const ValidationPanel: React.FC<ValidationPanelProps> = ({ validation, onSelectIssue }) => {
  const hasIssues = validation.issues.length > 0;

  return (
    <section className="border-t border-carbon/15 p-4 animate-in fade-in duration-100">
      <div className="flex items-center justify-between">
        <h3 className="ac-label ac-label--sm ac-label--strong select-none">Validación</h3>
        <span
          className={`rounded px-2 py-0.5 text-[10px] font-bold ${
            validation.canSave
              ? 'bg-salvia/10 text-salvia'
              : 'bg-granada/10 text-granada'
          }`}
        >
          {validation.canSave ? 'Aplicable' : `${validation.errorCount} errores`}
        </span>
      </div>

      {!hasIssues ? (
        <p className="mt-3 rounded border border-salvia/20 bg-salvia/5 p-3 text-xs italic text-carbon/65">
          El documento cumple las reglas críticas del editor.
        </p>
      ) : (
        <div className="mt-3 max-h-64 space-y-2 overflow-y-auto pr-1">
          {validation.issues.map(item => {
            const Card = onSelectIssue ? 'button' : 'div';
            const extraProps = onSelectIssue ? {
              type: 'button' as const,
              onClick: () => onSelectIssue(item),
              className: `w-full text-left rounded border p-2 hover:border-carbon/30 focus:outline-none focus:ring-1 focus:ring-salvia transition-all cursor-pointer block ${
                item.severity === 'error'
                  ? 'border-granada/20 bg-granada/5 hover:bg-granada/10'
                  : 'border-ocre/20 bg-ocre/5 hover:bg-ocre/10'
              }`
            } : {
              className: `rounded border p-2 ${
                item.severity === 'error'
                  ? 'border-granada/20 bg-granada/5'
                  : 'border-ocre/20 bg-ocre/5'
              }`
            };

            return (
              <Card
                key={item.id}
                {...extraProps}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="ac-label ac-label--xs ac-label--soft">
                    {AREA_LABELS[item.area] || item.area}
                  </span>
                  <span
                    className={`ac-label ac-label--xs ${
                      item.severity === 'error' ? 'text-granada' : 'text-ocre'
                    }`}
                  >
                    {item.severity === 'error' ? 'Error' : 'Aviso'}
                  </span>
                </div>
                <p className="mt-1 text-xs leading-snug text-carbon/75">{item.message}</p>
                {onSelectIssue && (item.blockId || item.sourceRange) && (
                  <span className="mt-1 block text-[8px] font-mono text-carbon/40 italic">Haga clic para navegar al origen</span>
                )}
              </Card>
            );
          })}
        </div>
      )}
    </section>
  );
};
