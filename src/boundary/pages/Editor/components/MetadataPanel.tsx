import React from 'react';

interface MetadataPanelProps {
  metadata: Record<string, unknown>;
  onUpdate: (key: string, value: unknown) => void;
  onAddField: () => void;
  onRemoveField: (key: string) => void;
}

export const MetadataPanel: React.FC<MetadataPanelProps> = ({
  metadata, onUpdate, onAddField, onRemoveField
}) => {
  return (
    <div className="bg-white p-6 border border-carbon/10 rounded shadow-sm overflow-y-auto flex-1">
      <div className="flex justify-between items-center border-b border-carbon/10 pb-2 mb-4">
        <h3 className="font-serif font-bold text-lg">Metadatos</h3>
        <button onClick={onAddField} className="text-xs bg-carbon/10 hover:bg-carbon/20 px-2 py-1 rounded transition-colors">+ Añadir</button>
      </div>
      
      <div className="space-y-4">
        {Object.entries(metadata).map(([key, value]) => {
          const isArray = Array.isArray(value);
          return (
            <div key={key} className="relative group">
              <label className="block text-xs font-bold text-carbon/70 mb-1 uppercase tracking-wider">{key}</label>
              <button 
                onClick={() => onRemoveField(key)}
                className="absolute right-0 top-0 text-salvia opacity-0 group-hover:opacity-100 transition-opacity text-xs font-bold"
                title="Eliminar campo"
              >
                ✕
              </button>
              {isArray ? (
                <input 
                  type="text"
                  placeholder="Valores separados por coma..."
                  className="w-full bg-carbon/5 p-2 text-sm border border-transparent focus:border-carbon/30 rounded focus:outline-none transition-colors"
                  value={(value as string[]).join(', ')}
                  onChange={(e) => {
                    const arr = e.target.value.split(',').map(s => s.trim()).filter(Boolean);
                    onUpdate(key, arr.length === 0 && e.target.value.includes(',') ? [''] : arr);
                  }}
                />
              ) : (
                <input 
                  type="text"
                  className="w-full bg-carbon/5 p-2 text-sm border border-transparent focus:border-carbon/30 rounded focus:outline-none transition-colors"
                  value={value as string || ''}
                  onChange={(e) => onUpdate(key, e.target.value)}
                />
              )}
              {isArray && <p className="text-[10px] text-carbon/40 mt-1">Valores separados por coma (,)</p>}
            </div>
          );
        })}
      </div>
    </div>
  );
};
