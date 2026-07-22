import React, { useState } from 'react';
import type { DiagramTarget } from '@/features/editor/core/editorTypes';
import type { DiagramDiagnostic } from '../source/generator';
import { interactiveElementSnippet, conceptHighlightSnippet } from '../model/selectors';
import { DiagramButton, DiagramPanel } from './primitives';

interface DiagramValidationPanelProps {
  diagnostics: DiagramDiagnostic[];
  targets: DiagramTarget[];
  selectedTargetId: string;
  onSelectTarget: (target: DiagramTarget) => void;
}

export function humanizeDiagnosticMessage(message: string, targets: DiagramTarget[] = []): string {
  let text = message;

  text = text.replace(/^objects\.(\d+)\.([a-zA-Z0-9_.]+):\s*/, (_, index, path) => {
    return `En objeto #${Number(index) + 1} (${path}): `;
  });
  text = text.replace(/^points\.(\d+)\.([a-zA-Z0-9_.]+):\s*/, (_, index, path) => {
    return `En punto #${Number(index) + 1} (${path}): `;
  });
  text = text.replace(/^elements\.(\d+)\.([a-zA-Z0-9_.]+):\s*/, (_, index, path) => {
    return `En elemento #${Number(index) + 1} (${path}): `;
  });
  text = text.replace(/^relations\.(\d+)\.([a-zA-Z0-9_.]+):\s*/, (_, index, path) => {
    return `En relación #${Number(index) + 1} (${path}): `;
  });
  text = text.replace(/^constraints\.(\d+)\.([a-zA-Z0-9_.]+):\s*/, (_, index, path) => {
    return `En la restricción #${Number(index) + 1} (${path}): `;
  });
  text = text.replace(/^steps\.(\d+)\.([a-zA-Z0-9_.]+):\s*/, (_, index, path) => {
    return `En paso #${Number(index) + 1} (${path}): `;
  });

  text = text.replace(/Expected string, received (\w+)/g, 'Se esperaba un texto pero se recibió $1.');
  text = text.replace(/Expected number, received (\w+)/g, 'Se esperaba un número pero se recibió $1.');
  text = text.replace(/Invalid option: expected one of [^,\n]+/g, 'La opción o tipo seleccionado no pertenece a las opciones geométricas válidas.');
  text = text.replace(/Invalid enum value/g, 'El valor no es válido.');
  text = text.replace(/Required/g, 'Campo obligatorio no especificado.');

  targets.forEach(target => {
    if (target.label && target.label !== target.id) {
      const regex = new RegExp(`\\b${target.id}\\b`, 'g');
      text = text.replace(regex, `"${target.label}" (${target.id})`);
    }
  });

  return text;
}

export const DiagramValidationPanel: React.FC<DiagramValidationPanelProps> = ({
  diagnostics,
  targets,
  selectedTargetId,
  onSelectTarget,
}) => {
  const [copiedSnippet, setCopiedSnippet] = useState('');

  const copySnippet = async (key: string, value: string) => {
    if (!navigator.clipboard) return;
    try {
      await navigator.clipboard.writeText(value);
      setCopiedSnippet(key);
      window.setTimeout(() => setCopiedSnippet(''), 1300);
    } catch {
      setCopiedSnippet('');
    }
  };

  const errors = diagnostics.filter(d => d.severity === 'error');
  const warnings = diagnostics.filter(d => d.severity === 'warning' || d.severity === 'info');

  const expandDiagnosticItems = (list: DiagramDiagnostic[]) => {
    const items: string[] = [];
    list.forEach(item => {
      const parts = item.message.split(/(?=\b(?:elements|points|objects|relations|constraints|steps)\.\d+)/g).map(p => p.trim()).filter(Boolean);
      items.push(...parts);
    });
    return items;
  };

  const errorMessages = expandDiagnosticItems(errors);
  const warningMessages = expandDiagnosticItems(warnings);

  return (
    <DiagramPanel
      title="Comprobación antes de guardar"
      className="overflow-hidden border-carbon/10 bg-lienzo"
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-[10px] text-carbon/50">Revise la coherencia del modelo y pruebe cada enlace disponible para MDX.</p>
        <div className="flex gap-2">
          <span className={`rounded px-2 py-1 text-[10px] font-bold ${errorMessages.length > 0 ? 'bg-granada/10 text-granada' : 'bg-salvia/10 text-salvia'}`}>{errorMessages.length} errores</span>
          <span className="rounded bg-ocre/10 px-2 py-1 text-[10px] font-bold text-ocre">{warningMessages.length} avisos</span>
          <span className="rounded bg-pavo/10 px-2 py-1 text-[10px] font-bold text-pavo">{targets.length} enlaces</span>
        </div>
      </div>

      <div className="grid min-h-72 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:divide-x lg:divide-carbon/10">
        <div className="space-y-2 overflow-y-auto p-1">
          <p className="text-[10px] font-bold uppercase tracking-widest text-carbon/35">Diagnósticos</p>
          {errorMessages.length === 0 && warningMessages.length === 0 && (
            <p className="text-xs font-semibold italic text-salvia">✓ No se encontraron errores de coherencia.</p>
          )}
          {errorMessages.map((msg, index) => (
            <div key={`err-${index}`} className="rounded border border-granada/20 bg-granada/5 p-2 text-xs text-granada">
              <span className="font-bold">Error:</span> {humanizeDiagnosticMessage(msg, targets)}
            </div>
          ))}
          {warningMessages.map((msg, index) => (
            <div key={`warn-${index}`} className="rounded border border-ocre/20 bg-ocre/5 p-2 text-xs text-carbon">
              <span className="font-bold">Advertencia:</span> {humanizeDiagnosticMessage(msg, targets)}
            </div>
          ))}
        </div>

        <div className="space-y-2 border-t border-carbon/10 p-1 lg:border-t-0">
          <p className="text-[10px] font-bold uppercase tracking-widest text-carbon/35">Elementos enlazables desde MDX</p>
          {targets.length === 0 ? (
            <p className="text-xs italic text-carbon/50">Marque puntos o elementos como enlazables desde MDX para verlos aquí.</p>
          ) : (
            <div className="space-y-1.5">
              {targets.map(target => {
                const isSelected = selectedTargetId === target.id;
                const snippetIE = interactiveElementSnippet(target);
                const snippetCH = conceptHighlightSnippet(target);
                return (
                  <div
                    key={target.qualifiedId ?? `${target.id}-${target.objectId ?? ''}`}
                    onClick={() => onSelectTarget(target)}
                    className={`cursor-pointer rounded border p-2 transition-all ${
                      isSelected ? 'border-ocre/35 bg-ocre/5' : 'border-carbon/10 bg-transparent hover:bg-carbon/5'
                    }`}
                  >
                    <div className="mb-1 flex items-center justify-between text-xs">
                      <span className="font-bold text-carbon">{target.id}</span>
                      <span className="text-[9px] font-bold text-carbon/40">{target.label}</span>
                    </div>

                    <div className="mt-1.5 flex gap-2">
                      <DiagramButton
                        variant="ghost"
                        className="!min-h-0 rounded bg-carbon/10 px-2 py-0.5 text-[9px] text-carbon hover:bg-carbon/20 hover:no-underline"
                        onClick={(e) => { e.stopPropagation(); copySnippet(`${target.id}-ie`, snippetIE); }}
                      >
                        {copiedSnippet === `${target.id}-ie` ? 'Copiado' : 'Copiar vínculo interactivo'}
                      </DiagramButton>
                      <DiagramButton
                        variant="ghost"
                        className="!min-h-0 rounded bg-carbon/10 px-2 py-0.5 text-[9px] text-carbon hover:bg-carbon/20 hover:no-underline"
                        onClick={(e) => { e.stopPropagation(); copySnippet(`${target.id}-ch`, snippetCH); }}
                      >
                        {copiedSnippet === `${target.id}-ch` ? 'Copiado' : 'Copiar ConceptLink'}
                      </DiagramButton>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </DiagramPanel>
  );
};
export default DiagramValidationPanel;
