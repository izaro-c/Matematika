import React from 'react';
import type { FileNode } from '@/features/editor/hooks/useEditorState';

interface ComponentGalleryProps {
  isOpen: boolean;
  files: FileNode[];
  onClose: () => void;
  onInsert: (componentName: string) => void;
}

export const ComponentGallery: React.FC<ComponentGalleryProps> = ({
  isOpen, files, onClose, onInsert
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-carbon/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-4xl max-h-[80vh] flex flex-col">
        <div className="p-6 border-b border-carbon/10 flex justify-between items-center bg-white/90 sticky top-0 rounded-t-lg">
          <div>
            <h3 className="text-2xl font-serif font-bold">Galería de Componentes</h3>
            <p className="text-sm text-carbon/60">Haz clic en un componente para insertarlo en el editor.</p>
          </div>
          <button onClick={onClose} className="text-carbon/50 hover:text-carbon text-2xl font-bold">✕</button>
        </div>
        
        <div className="p-6 overflow-y-auto flex-1 bg-carbon/5">
          {['diagrams', 'components'].map(type => {
            const compFiles = files.filter(f => f.type === type && f.name.endsWith('.tsx'));
            if (compFiles.length === 0) return null;
            return (
              <div key={type} className="mb-8">
                <h4 className="text-lg font-bold font-serif mb-4 capitalize">{type}</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {compFiles.map(f => {
                    const name = f.name.replace('.tsx', '');
                    return (
                      <button
                        key={f.path}
                        onClick={() => onInsert(name)}
                        className="bg-white p-4 rounded shadow-sm border border-carbon/10 hover:border-salvia hover:shadow-md transition-all text-left flex flex-col items-start group"
                      >
                        <span className="font-mono text-salvia font-bold text-sm mb-2 group-hover:underline">{`<${name} />`}</span>
                        <span className="text-xs text-carbon/50 truncate w-full">{f.path}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
