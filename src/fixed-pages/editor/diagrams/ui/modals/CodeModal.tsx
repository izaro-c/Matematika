import React, { useEffect, useState } from 'react';
import type { VisualDiagramModel } from '../../model/types';
import { generateDiagramSource } from '../../source/generator';

interface CodeModalProps {
  isOpen: boolean;
  model: VisualDiagramModel | null;
  componentName: string;
  sandboxMode?: boolean;
  source?: string;
  onSourceChange?: (source: string) => void;
  onClose: () => void;
}

export const CodeModal: React.FC<CodeModalProps> = ({
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
    let success = false;
    try {
      if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
        await navigator.clipboard.writeText(contentToCopy);
        success = true;
      }
    } catch {
      success = false;
    }

    if (!success) {
      try {
        const textarea = document.createElement('textarea');
        textarea.value = contentToCopy;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();
        success = document.execCommand('copy');
        document.body.removeChild(textarea);
      } catch {
        success = false;
      }
    }

    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
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
                Fuente del diagrama
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('json')}
                className={`px-2.5 py-1 text-xs font-bold rounded-md transition-all cursor-pointer ${
                  activeTab === 'json' ? 'bg-lienzo text-carbon shadow-2xs' : 'text-carbon/60 hover:text-carbon'
                }`}
              >
                Especificación
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
          <textarea
            aria-label="Código fuente o especificación del diagrama"
            value={sandboxMode ? contentToCopy : sourceDraft}
            readOnly={sandboxMode}
            onChange={event => {
              if (!sandboxMode) setSourceDraft(event.target.value);
            }}
            onClick={event => (event.target as HTMLTextAreaElement).select()}
            spellCheck={false}
            className="min-h-80 w-full resize-y bg-transparent text-lienzo outline-none font-mono text-xs select-all"
          />
        </div>

        {/* Pie de Acciones */}
        <div className="flex items-center justify-between p-4 border-t border-carbon/10 bg-lienzo">
          <span className="text-xs text-mora/70 italic">
            {generated.ok
              ? sandboxMode
                ? 'Exportación de lectura: el sandbox no guarda en el corpus.'
                : 'Al aplicar, se analiza la fuente antes de permitir guardar.'
              : 'La generación falló; revisa los avisos en el comentario de la fuente.'}
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
              className="px-4 py-1.5 text-xs font-bold text-lienzo bg-canela hover:bg-canela/90 rounded-lg shadow-sm transition-all cursor-pointer"
            >
              {copied ? '¡Copiado!' : 'Copiar'}
            </button>
            {!sandboxMode && (
              <button
                type="button"
                onClick={() => onSourceChange?.(sourceDraft)}
                disabled={!canApplySource}
                className="px-4 py-1.5 text-xs font-bold text-lienzo bg-pavo hover:bg-pavo/90 rounded-lg shadow-sm transition-all cursor-pointer disabled:opacity-40"
              >
                Aplicar fuente
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
