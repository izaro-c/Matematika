import React from 'react';

interface ImportsPanelProps {
  imports: string;
  onUpdate: (value: string) => void;
  onAutoGenerate: () => void;
}

export const ImportsPanel: React.FC<ImportsPanelProps> = ({ imports, onUpdate, onAutoGenerate }) => {
  return (
    <div className="bg-white p-6 border border-carbon/10 rounded shadow-sm flex flex-col flex-1">
      <div className="flex justify-between items-center border-b border-carbon/10 pb-2 mb-4">
        <h3 className="font-serif font-bold text-lg">Imports (Componentes)</h3>
        <button 
          onClick={onAutoGenerate}
          className="text-xs bg-salvia text-white px-2 py-1 rounded hover:bg-salvia/80"
        >
          ⚡ Escanear Imports
        </button>
      </div>
      <textarea
        className="w-full flex-1 bg-carbon/5 p-4 font-mono text-sm focus:outline-none focus:ring-1 focus:ring-carbon border-none rounded"
        value={imports}
        onChange={(e) => onUpdate(e.target.value)}
        placeholder="import { Component } from '@/pages/...';"
      />
    </div>
  );
};
