import React from 'react';
import type { FileNode } from '../hooks/useEditorState';

interface EditorSidebarProps {
  files: FileNode[];
  currentFile: string | null;
  searchQuery: string;
  isSidebarOpen: boolean;
  onSearchChange: (query: string) => void;
  onFileClick: (path: string) => void;
  onToggleSidebar: () => void;
  onNewFile: () => void;
}

export const EditorSidebar: React.FC<EditorSidebarProps> = ({
  files, currentFile, searchQuery, isSidebarOpen,
  onSearchChange, onFileClick, onToggleSidebar, onNewFile
}) => {
  if (!isSidebarOpen) return null;

  return (
    <div className="bg-white/50 flex flex-col h-full transition-all duration-300 overflow-hidden shrink-0 relative w-64 border-r border-carbon/20">
      <div className="p-4 border-b border-carbon/10 flex justify-between items-center sticky top-0 bg-white/90">
        <div className="flex items-center gap-2">
          <h2 className="font-serif font-bold text-lg whitespace-nowrap">Archivos</h2>
          <button 
            onClick={onToggleSidebar}
            className="text-carbon/40 hover:text-carbon/80 text-xs px-1"
            title="Ocultar panel"
          >
            ◀
          </button>
        </div>
        <button 
          onClick={onNewFile}
          className="text-xs bg-salvia text-white px-2 py-1 rounded hover:bg-salvia/80 flex-shrink-0"
        >
          + Nuevo
        </button>
      </div>

      <div className="p-3 border-b border-carbon/10 bg-white/50 sticky top-[65px] z-10 backdrop-blur-sm">
        <input 
          type="text"
          placeholder="Buscar fichero..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full text-sm p-2 bg-carbon/5 border border-transparent focus:border-carbon/20 rounded focus:outline-none transition-colors"
        />
      </div>
      
      <div className="p-4 flex-1 whitespace-nowrap overflow-y-auto overflow-x-hidden">
        {['theorems', 'definitions', 'lessons', 'demonstrations', 'mathematicians', 'diagrams', 'components'].map(type => {
          const typeFiles = files.filter(f => f.type === type && f.name.toLowerCase().includes(searchQuery.toLowerCase()));
          if (typeFiles.length === 0 && type !== 'definitions') return null;
          return (
            <div key={type} className="mb-4">
              <h3 className="text-xs uppercase tracking-widest text-carbon/50 font-bold mb-2">{type}</h3>
              <ul className="space-y-1">
                {typeFiles.map(f => (
                  <li key={f.path}>
                    <button 
                      onClick={() => onFileClick(f.path)}
                      className={`text-sm w-full text-left px-2 py-1 rounded truncate transition-colors ${currentFile === f.path ? 'bg-carbon/10 font-bold' : 'hover:bg-carbon/5'}`}
                      title={f.path}
                    >
                      {f.name}
                    </button>
                  </li>
                ))}
                {typeFiles.length === 0 && <li className="text-xs text-carbon/30 italic px-2">Vacío</li>}
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );
};
