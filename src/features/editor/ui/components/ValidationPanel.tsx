import React from 'react';
import type { EditorValidationResult } from '../../core/editorTypes';

interface ValidationPanelProps {
  validation: EditorValidationResult;
}

const AREA_LABELS: Record<string, string> = {
  metadata: 'Metadatos',
  body: 'Contenido',
  block: 'Bloque',
  diagram: 'Diagrama',
  proof: 'Demostración',
  source: 'Fuente',
};

export const ValidationPanel: React.FC<ValidationPanelProps> = ({ validation }) => {
  const hasIssues = validation.issues.length > 0;

  return (
    <section className="border-t border-carbon/15 p-4">
      <div className="flex items-center justify-between">
        <h3 className="text-[10px] font-bold uppercase tracking-widest text-carbon/55">Validación</h3>
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
          {validation.issues.map(item => (
            <div
              key={item.id}
              className={`rounded border p-2 ${
                item.severity === 'error'
                  ? 'border-granada/20 bg-granada/5'
                  : 'border-ocre/20 bg-ocre/5'
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-[9px] font-bold uppercase tracking-wider text-carbon/45">
                  {AREA_LABELS[item.area] || item.area}
                </span>
                <span
                  className={`text-[9px] font-bold uppercase ${
                    item.severity === 'error' ? 'text-granada' : 'text-ocre'
                  }`}
                >
                  {item.severity === 'error' ? 'Error' : 'Aviso'}
                </span>
              </div>
              <p className="mt-1 text-xs leading-snug text-carbon/75">{item.message}</p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};
