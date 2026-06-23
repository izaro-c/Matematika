import React from 'react';

interface RefModalProps {
  isOpen: boolean;
  refText: string;
  refTarget: string;
  refColor: string;
  availableColors: string[];
  onClose: () => void;
  onTextChange: (text: string) => void;
  onTargetChange: (target: string) => void;
  onColorChange: (color: string) => void;
  onApply: (target: string, color: string, text: string) => void;
}

export const RefModal: React.FC<RefModalProps> = ({
  isOpen, refText, refTarget, refColor, availableColors,
  onClose, onTextChange, onTargetChange, onColorChange, onApply
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-carbon/50 backdrop-blur-sm">
      <div className="bg-white p-6 rounded shadow-lg w-[400px]">
        <h3 className="text-xl font-serif font-bold mb-4">Añadir Referencia Interactiva</h3>
        <p className="text-xs text-carbon/60 mb-4">Esta etiqueta resalta elementos en el texto que se sincronizan con los diagramas interactivos.</p>
        
        <label className="block text-sm font-bold mb-1 mt-4">Texto a mostrar:</label>
        <input 
          type="text"
          className="w-full p-2 border border-carbon/20 rounded bg-white text-sm focus:outline-none focus:ring-1 focus:ring-carbon"
          value={refText}
          onChange={(e) => onTextChange(e.target.value)}
          placeholder="Ej: **$c$**, hipotenusa..."
        />
        
        <label className="block text-sm font-bold mb-1 mt-4">ID del elemento (Target):</label>
        <input 
          type="text"
          className="w-full p-2 border border-carbon/20 rounded bg-white text-sm focus:outline-none focus:ring-1 focus:ring-carbon font-mono"
          value={refTarget}
          onChange={(e) => onTargetChange(e.target.value)}
          placeholder="Ej: ladoC, puntoA"
        />
        
        <label className="block text-sm font-bold mb-1 mt-4">Color de Resalte:</label>
        <div className="flex gap-2 mb-2">
          {availableColors.map(c => (
            <button
              key={c}
              onClick={() => onColorChange(c)}
              className={`w-8 h-8 rounded-full border-2 transition-transform ${refColor === c ? 'border-carbon scale-110' : 'border-transparent'}`}
              style={{ backgroundColor: `var(--color-${c})` } as React.CSSProperties}
              title={c}
            />
          ))}
        </div>

        <div className="flex justify-end gap-2 mt-6">
          <button 
            onClick={onClose}
            className="px-4 py-2 text-sm text-carbon hover:bg-carbon/5 rounded"
          >
            Cancelar
          </button>
          <button 
            onClick={() => onApply(refTarget, refColor, refText)}
            disabled={!refTarget || !refText}
            className="px-4 py-2 text-sm bg-terracota text-white rounded hover:bg-terracota/80 disabled:opacity-50"
          >
            Añadir Referencia
          </button>
        </div>
      </div>
    </div>
  );
};
