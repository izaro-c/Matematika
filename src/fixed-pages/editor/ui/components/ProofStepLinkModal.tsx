import React, { useState } from 'react';
import { IconClose, IconPlus } from '@/fixed-pages/editor/diagrams/ui/toolbar/WorkbenchIcons';

interface ProofStepLinkModalProps {
  isOpen: boolean;
  initialStep?: number;
  maxSteps?: number;
  onClose: () => void;
  onConfirm: (step: number) => void;
  onRemove?: () => void;
}

export const ProofStepLinkModal: React.FC<ProofStepLinkModalProps> = ({
  isOpen,
  initialStep = 1,
  maxSteps = 10,
  onClose,
  onConfirm,
  onRemove,
}) => {
  const [stepValue, setStepValue] = useState<string>(String(initialStep));

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const num = parseInt(stepValue.trim(), 10);
    const valid = isNaN(num) || num < 1 ? 1 : num;
    onConfirm(valid);
    onClose();
  };

  const handleSelectStep = (num: number) => {
    onConfirm(num);
    onClose();
  };

  const stepOptions = Array.from({ length: Math.max(maxSteps, 5) }, (_, i) => i + 1);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-carbon/40 backdrop-blur-xs p-4 animate-fadeIn">
      <div
        className="w-full max-w-md rounded-2xl border border-carbon/20 bg-lienzo p-6 shadow-2xl space-y-4 font-serif text-carbon"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-carbon/10 pb-3">
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-md bg-pavo/15 font-mono text-xs font-bold text-pavo">
              #
            </span>
            <h3 className="font-serif text-lg font-bold text-carbon">Referencia a Paso</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-7 w-7 items-center justify-center rounded-lg border border-carbon/15 text-carbon/60 hover:bg-carbon/5 transition-colors cursor-pointer"
          >
            <IconClose className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-carbon/60 mb-1.5">
              Número del paso referenciado
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                min="1"
                value={stepValue}
                onChange={e => setStepValue(e.target.value)}
                className="flex-1 rounded-xl border border-carbon/20 bg-carbon/5 px-3 py-2 font-mono text-sm font-bold text-carbon outline-none focus:border-pavo focus:ring-1 focus:ring-pavo"
                placeholder="1"
                autoFocus
              />
              <button
                type="submit"
                className="flex items-center gap-1.5 rounded-xl bg-pavo px-4 py-2 text-xs font-bold text-lienzo shadow-xs hover:bg-pavo/90 transition-all cursor-pointer"
              >
                <IconPlus className="w-4 h-4" />
                <span>Aplicar</span>
              </button>
            </div>
          </div>

          {stepOptions.length > 0 && (
            <div>
              <span className="block text-[11px] font-bold text-carbon/50 mb-2">
                Pasos disponibles en el documento:
              </span>
              <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto p-1">
                {stepOptions.map(num => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => handleSelectStep(num)}
                    className={`flex items-center gap-1 rounded-lg border px-2.5 py-1 font-mono text-xs font-bold transition-all cursor-pointer ${
                      Number(stepValue) === num
                        ? 'border-pavo bg-pavo/15 text-pavo shadow-2xs'
                        : 'border-carbon/15 bg-lienzo text-carbon/70 hover:border-pavo/40 hover:text-pavo'
                    }`}
                  >
                    <span>Paso {num}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="flex items-center justify-between border-t border-carbon/10 pt-3">
            {onRemove ? (
              <button
                type="button"
                onClick={() => {
                  onRemove();
                  onClose();
                }}
                className="rounded-lg px-3 py-1.5 text-xs font-bold text-granada hover:bg-granada/10 transition-colors cursor-pointer"
              >
                Eliminar Enlace
              </button>
            ) : <span />}
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-carbon/20 px-3 py-1.5 text-xs font-bold text-carbon/70 hover:bg-carbon/5 transition-colors cursor-pointer"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
