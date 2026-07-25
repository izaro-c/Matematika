import React, { useEffect, useState } from 'react';
import type { VisualDiagramModel } from '../../editor/diagrams/model/types';
import { generateDiagramSource } from '../../editor/diagrams/source/generator';

interface V2CodeModalProps {
  isOpen: boolean;
  model: VisualDiagramModel | null;
  componentName: string;
  sandboxMode?: boolean;
  source?: string;
  onSourceChange?: (source: string) => void;
  onClose: () => void;
}

export const V2CodeModal: React.FC<V2CodeModalProps> = ({
  isOpen,
  model,
  componentName,
  sandboxMode = true,
  source = '',
  onSourceChange,
  onClose,
}) => {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'tsx' | 'json'>('tsx');
  const [sourceDraft, setSourceDraft] = useState(source);

  useEffect(() => {
    if (isOpen) setSourceDraft(source);
  }, [isOpen, source]);

  if (!isOpen || !model) return null;

  const generated = generateDiagramSource(model, componentName || 'DiagramaCustom');
  const generationErrorLines = (generated.diagnostics || []).map(d => `// - ${d.message}`).join('\n');
  const codeTSX = generated.ok
    ? generated.source
    : `// Error al generar fuente TSX\n${generationErrorLines}`;
  const jsonSpec = JSON.stringify(model, null, 2);

  const contentToCopy = activeTab === 'tsx' ? codeTSX : jsonSpec;
  const canApplySource = !sandboxMode && Boolean(onSourceChange) && sourceDraft.trim().length > 0;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(contentToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      console.error('No se pudo copiar al portapapeles');
    }
  };

  const handleDownload = () => {
    const filename = `${componentName || 'Diagrama'}.${activeTab === 'tsx' ? 'tsx' : 'json'}`;
    const blob = new Blob([contentToCopy], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div role="presentation" className="fixed inset-0 z-50 flex items-center justify-center bg-carbon/50 backdrop-blur-xs p-4 font-serif">
      <div role="dialog" aria-modal="true" className="w-full max-w-3xl bg-lienzo rounded-2xl border border-carbon/15 shadow-2xl overflow-hidden flex flex-col max-h-[85vh] animate-in fade-in zoom-in duration-200 text-carbon">
        {/* Cabecera del Modal */}
        <div className="flex items-center justify-between p-4 border-b border-carbon/10 bg-carbon/5">
          <div className="flex items-center space-x-3">
            <h2 className="font-serif font-bold text-base text-carbon">Código Fuente & Especificación</h2>
            <div className="flex bg-carbon/10 p-0.5 rounded-lg">
              <button
                type="button"
                onClick={() => setActiveTab('tsx')}
                className={`px-2.5 py-1 text-xs font-bold rounded-md transition-all cursor-pointer ${
                  activeTab === 'tsx' ? 'bg-lienzo text-carbon shadow-2xs' : 'text-carbon/60 hover:text-carbon'
                }`}
              >
                TSX Canónico
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('json')}
                className={`px-2.5 py-1 text-xs font-bold rounded-md transition-all cursor-pointer ${
                  activeTab === 'json' ? 'bg-lienzo text-carbon shadow-2xs' : 'text-carbon/60 hover:text-carbon'
                }`}
              >
                JSON Spec
              </button>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-carbon/60 hover:text-carbon p-1 rounded-lg text-lg font-bold cursor-pointer"
          >
            ✕
          </button>
        </div>

        <div className="flex-1 overflow-auto p-4 bg-carbon text-lienzo font-mono text-xs leading-relaxed select-text">
          {sandboxMode ? (
            <pre>{contentToCopy}</pre>
          ) : (
            <textarea
              aria-label="Aplicar desde TSX"
              value={sourceDraft}
              onChange={event => setSourceDraft(event.target.value)}
              spellCheck={false}
              className="min-h-80 w-full resize-y bg-transparent text-lienzo outline-none"
            />
          )}
        </div>

        {/* Pie de Acciones */}
        <div className="flex items-center justify-between p-4 border-t border-carbon/10 bg-lienzo">
          <span className="text-xs text-pizarra/70 italic">
            {generated.ok
              ? sandboxMode
                ? 'Exportación de lectura: el sandbox no aplica parse-roundtrip ni guarda al corpus.'
                : 'Editar y aplicar TSX analiza la fuente en el servidor antes de permitir guardar.'
              : 'La generación falló; revisa los diagnósticos en el comentario del TSX.'}
          </span>
          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={handleDownload}
              disabled={!generated.ok && activeTab === 'tsx'}
              className="px-3 py-1.5 text-xs font-bold text-carbon border border-carbon/20 hover:bg-carbon/5 rounded-lg transition-all cursor-pointer disabled:opacity-40"
            >
              Descargar .{activeTab}
            </button>
            <button
              type="button"
              onClick={handleCopy}
              className="px-4 py-1.5 text-xs font-bold text-lienzo bg-salvia hover:bg-salvia/90 rounded-lg shadow-sm transition-all cursor-pointer"
            >
              {copied ? '¡Copiado!' : 'Copiar Código'}
            </button>
            {!sandboxMode && (
              <button
                type="button"
                onClick={() => onSourceChange?.(sourceDraft)}
                disabled={!canApplySource}
                className="px-4 py-1.5 text-xs font-bold text-lienzo bg-pavo hover:bg-pavo/90 rounded-lg shadow-sm transition-all cursor-pointer disabled:opacity-40"
              >
                Aplicar desde TSX
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
