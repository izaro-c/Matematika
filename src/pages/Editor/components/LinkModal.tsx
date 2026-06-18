import React from 'react';

interface LinkOption {
  label: string;
  url: string;
}

interface LinkModalProps {
  isOpen: boolean;
  linkModalText: string;
  linkTarget: string;
  linkOptions: LinkOption[];
  onClose: () => void;
  onTextChange: (text: string) => void;
  onTargetChange: (target: string) => void;
  onApply: (target: string, text: string) => void;
}

export const LinkModal: React.FC<LinkModalProps> = ({
  isOpen, linkModalText, linkTarget, linkOptions,
  onClose, onTextChange, onTargetChange, onApply
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-carbon/50 backdrop-blur-sm">
      <div className="bg-white p-6 rounded shadow-lg w-[400px]">
        <h3 className="text-xl font-serif font-bold mb-4">Insertar Enlace</h3>
        
        <label className="block text-sm font-bold mb-1 mt-4">Texto del enlace:</label>
        <input 
          type="text"
          className="w-full p-2 border border-carbon/20 rounded bg-white text-sm focus:outline-none focus:ring-1 focus:ring-carbon"
          value={linkModalText}
          onChange={(e) => onTextChange(e.target.value)}
          placeholder="Texto visible"
        />
        
        <label className="block text-sm font-bold mb-1 mt-4">Destino (Ruta):</label>
        <select 
          className="w-full p-2 border border-carbon/20 rounded bg-white text-sm focus:outline-none focus:ring-1 focus:ring-carbon"
          value={linkTarget}
          onChange={(e) => onTargetChange(e.target.value)}
        >
          <option value="">-- Selecciona una página --</option>
          {linkOptions.map(opt => (
            <option key={opt.url} value={opt.url}>{opt.label}</option>
          ))}
        </select>

        <div className="flex justify-end gap-2 mt-6">
          <button 
            onClick={onClose}
            className="px-4 py-2 text-sm text-carbon hover:bg-carbon/5 rounded"
          >
            Cancelar
          </button>
          <button 
            onClick={() => onApply(linkTarget, linkModalText)}
            disabled={!linkTarget}
            className="px-4 py-2 text-sm bg-carbon text-white rounded hover:bg-carbon/80 disabled:opacity-50"
          >
            Insertar Enlace
          </button>
        </div>
      </div>
    </div>
  );
};
