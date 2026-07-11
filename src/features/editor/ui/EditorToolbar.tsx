import React from 'react';
import { Link } from 'wouter';
import { Logo } from '@/shared/ui/Logo';
import { routePath } from '@/shared/lib/routeHelper';
import { ThemeToggle } from '@/widgets/navigation/ThemeToggle';
import type { EditorMode, EditorValidationResult } from '../core/editorTypes';
import { EditorModeSwitcher } from './EditorModeSwitcher';

interface EditorToolbarProps {
  isSidebarOpen: boolean;
  setIsSidebarOpen: (open: boolean) => void;
  currentFile: string | null;
  message: string;
  persistenceLabel: string;
  isDiagramFile: boolean;
  editorMode: EditorMode;
  toggleEditorMode: () => void;
  validation: EditorValidationResult;
  saveCurrentFile: () => Promise<boolean> | void;
  saving: boolean;
  previewPath: string | null;
  setLocation: (loc: string) => void;
  isInspectorOpen: boolean;
  setIsInspectorOpen: (open: boolean) => void;
  toggleSearch: () => void;
}

export const EditorToolbar: React.FC<EditorToolbarProps> = ({
  isSidebarOpen,
  setIsSidebarOpen,
  currentFile,
  message,
  persistenceLabel,
  isDiagramFile,
  editorMode,
  toggleEditorMode,
  validation,
  saveCurrentFile,
  saving,
  previewPath,
  setLocation,
  isInspectorOpen,
  setIsInspectorOpen,
  toggleSearch,
}) => {
  return (
    <div className="h-14 bg-lienzo border-b border-carbon/15 flex justify-between items-center px-6 shrink-0 z-10">
      <div className="flex items-center gap-3">
        {!isSidebarOpen && (
          <button
            type="button"
            onClick={() => setIsSidebarOpen(true)}
            className="p-1 text-carbon/50 hover:text-carbon text-sm mr-2 cursor-pointer"
            title="Mostrar archivos"
          >
            ▸
          </button>
        )}
        <div>
          <h1 className="text-sm font-serif font-bold text-carbon">
            {currentFile ? currentFile.split('/').pop() : 'Seleccionar Archivo'}
          </h1>
          <p className="text-[10px] text-carbon/40 font-serif italic">
            {message || persistenceLabel}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {currentFile && (
          <>
            <EditorModeSwitcher
              editorMode={editorMode}
              isDiagramFile={isDiagramFile}
              onToggleMode={toggleEditorMode}
            />

            <div className={`text-[10px] font-bold uppercase tracking-wider ${validation.canSave ? 'text-salvia' : 'text-granada'}`}>
              {validation.canSave ? `${validation.warningCount} avisos` : `${validation.errorCount} errores`}
            </div>

            <button
              type="button"
              onClick={() => saveCurrentFile()}
              disabled={saving || !validation.canSave || (!isDiagramFile && editorMode === 'visual')}
              className="rounded bg-salvia px-3 py-1 text-xs font-serif font-bold text-lienzo shadow-sm transition-colors hover:bg-salvia/80 disabled:cursor-not-allowed disabled:opacity-40 cursor-pointer"
              title={isDiagramFile ? 'Guardar el archivo TSX del diagrama' : validation.canSave ? 'Guardar en el archivo real' : 'Corrige los errores críticos para poder aplicar'}
            >
              {isDiagramFile ? 'Guardar TSX' : 'Guardar'}
            </button>

            <button
              type="button"
              onClick={() => {
                if (previewPath) setLocation(routePath(previewPath));
              }}
              disabled={isDiagramFile || !previewPath}
              className="rounded border border-carbon/25 px-3 py-1 text-xs font-serif font-bold text-carbon transition-colors hover:bg-carbon/5 disabled:cursor-not-allowed disabled:opacity-40 cursor-pointer"
            >
              Ver como estudiante
            </button>

            {/* Toggle del Panel Lateral Derecho */}
            {!isDiagramFile && (
              <button
                type="button"
                onClick={() => setIsInspectorOpen(!isInspectorOpen)}
                className="text-xs border border-carbon/25 px-3 py-1 rounded-sm hover:bg-carbon/5 text-carbon font-serif font-bold transition-all cursor-pointer"
              >
                {isInspectorOpen ? 'Ocultar Metadatos' : 'Mostrar Metadatos'}
              </button>
            )}
          </>
        )}

        {/* Controles de Navegación y Tema Global del Editor */}
        <div className="flex items-center gap-2 border-l border-carbon/15 pl-4">
          <Link
            href={routePath('/')}
            className="w-12 h-12 flex items-center justify-center elegant-panel text-carbon"
            title="Volver a la Biblioteca"
          >
            <Logo className="w-8 h-8" />
          </Link>
          <button
            type="button"
            onClick={toggleSearch}
            className="w-12 h-12 flex items-center justify-center elegant-panel text-carbon cursor-pointer"
            title="Buscar (Cmd + K)"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </button>
          <ThemeToggle />
        </div>
      </div>
    </div>
  );
};
