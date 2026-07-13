import React, { useState } from 'react';
import type { FileNode } from '../lib/editorContracts';

interface EditorNavigationProps {
  files: FileNode[];
  isLoading: boolean;
  currentFile: string | null;
  openFile: (path: string) => void;
  setIsSidebarOpen: (open: boolean) => void;
}

const CATEGORY_MAP: Record<string, string> = {
  theorems: 'Teoremas y Lemas',
  definitions: 'Definiciones',
  demonstrations: 'Demostraciones',
  lessons: 'Lecciones de Estudio',
  exercises: 'Ejercicios Prácticos',
  mathematicians: 'Biografías',
  axioms: 'Axiomas',
  'axiomatic-systems': 'Sistemas Axiomáticos',
  models: 'Modelos',
  usecases: 'Casos de Uso',
  diagrams: 'Diagramas finales'
};

function categoryLabel(folderKey: string): string {
  if (folderKey.startsWith('diagram-')) {
    const category = folderKey.slice('diagram-'.length);
    return `Diagramas · ${category.charAt(0).toUpperCase()}${category.slice(1)}`;
  }
  return CATEGORY_MAP[folderKey] || folderKey.charAt(0).toUpperCase() + folderKey.slice(1);
}

function capabilityBadge(capability: FileNode['capability']): { label: string; className: string } {
  if (capability === 'visual-exact') return { label: 'Visual exacto', className: 'text-musgo bg-musgo/10' };
  if (capability === 'code-preview') return { label: 'Código + vista', className: 'text-pavo bg-pavo/10' };
  return { label: 'Inválido', className: 'text-granada bg-granada/10' };
}

export const EditorNavigation: React.FC<EditorNavigationProps> = ({
  files,
  isLoading,
  currentFile,
  openFile,
  setIsSidebarOpen,
}) => {
  const [expandedFolders, setExpandedFolders] = useState<Record<string, boolean>>({
    theorems: true,
    definitions: true,
    lessons: true
  });

  const formatFileName = (name: string) => {
    let clean = name.replace(/\.(mdx|tsx)$/, '');
    clean = clean.replace(/^(teorema|lema|corolario|definicion|axioma|ejercicio|ejemplo|modelo)-/, '');
    clean = clean.replace(/-/g, ' ');
    return clean.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  const toggleFolder = (folderKey: string) => {
    setExpandedFolders(prev => ({
      ...prev,
      [folderKey]: !prev[folderKey]
    }));
  };

  return (
    <div className="w-64 bg-lienzo border-r border-carbon/15 flex flex-col shrink-0">
      <div className="p-4 border-b border-carbon/15 flex justify-between items-center bg-carbon/5">
        <h2 className="text-xs font-serif font-bold tracking-wider uppercase text-carbon/70">Catálogo editable</h2>
        <button
          type="button"
          onClick={() => setIsSidebarOpen(false)}
          className="text-xs text-carbon/40 hover:text-carbon font-bold cursor-pointer"
        >
          Ocultar
        </button>
      </div>
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {files.length === 0 ? (
          <p className="text-xs italic text-carbon/40 p-4 font-serif">
            {isLoading ? 'Comprobando capacidades del catálogo…' : 'No hay recursos editables en el catálogo.'}
          </p>
        ) : (
          Object.entries(
            files.reduce<Record<string, typeof files>>((acc, file) => {
              const type = file.type || 'others';
              if (!acc[type]) acc[type] = [];
              acc[type].push(file);
              return acc;
            }, {})
          ).map(([folderKey, folderFiles]) => {
            const isExpanded = !!expandedFolders[folderKey];
            const folderLabel = categoryLabel(folderKey);

            return (
              <div key={folderKey} className="space-y-1">
                <button
                  type="button"
                  onClick={() => toggleFolder(folderKey)}
                  className="w-full flex items-center justify-between px-2 py-1.5 rounded-sm hover:bg-carbon/5 text-xs text-carbon font-serif font-bold transition-all text-left cursor-pointer"
                >
                  <span>{folderLabel}</span>
                  <span className="text-[10px] text-carbon/30 font-mono">{isExpanded ? '▾' : '▸'}</span>
                </button>

                {isExpanded && (
                  <div className="pl-3 border-l border-carbon/10 space-y-0.5 ml-1 animate-in fade-in slide-in-from-top-1 duration-100">
                    {folderFiles.map(file => {
                      const badge = capabilityBadge(file.capability);
                      return <button
                        type="button"
                        key={file.path}
                        onClick={() => openFile(file.path)}
                        title={`${file.capabilityLabel}. ${file.reason}`}
                        className={`w-full text-left px-2 py-1 rounded text-xs transition-all truncate block cursor-pointer ${
                          currentFile === file.path
                            ? 'text-salvia font-serif font-bold bg-salvia/5 border-l border-salvia pl-3'
                            : 'hover:bg-carbon/5 text-carbon/60 hover:text-carbon'
                        }`}
                      >
                        <span className="block truncate">{formatFileName(file.name)}</span>
                        <span className={`mt-0.5 inline-block rounded px-1.5 py-0.5 font-sans text-[8px] font-bold uppercase tracking-wide ${badge.className}`}>
                          {badge.label}
                        </span>
                      </button>;
                    })}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
export default EditorNavigation;
