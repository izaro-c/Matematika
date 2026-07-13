import React from 'react';
import { Link } from 'wouter';
import { Logo } from '@/shared/ui/Logo';
import { routePath } from '@/shared/lib/routeHelper';
import { ThemeToggle } from '@/widgets/navigation/ThemeToggle';
import type { DirtyState, EditorMode, EditorValidationResult } from '../core/editorTypes';
import type { EditorWorkspaceLevel } from '../navigation/editorNavigationModel';
import { EditorModeSwitcher } from './EditorModeSwitcher';

interface EditorToolbarProps {
  isSidebarOpen: boolean;
  setIsSidebarOpen: (open: boolean) => void;
  currentFile: string | null;
  message: string;
  persistenceLabel: string;
  dirtyState: DirtyState;
  isDiagramFile: boolean;
  editorMode: EditorMode;
  toggleEditorMode: () => void;
  validation: EditorValidationResult;
  saveCurrentFile: () => Promise<boolean> | void;
  saving: boolean;
  previewPath: string | null;
  isInspectorOpen: boolean;
  setIsInspectorOpen: (open: boolean) => void;
  isDiagnosticsOpen: boolean;
  setIsDiagnosticsOpen: (open: boolean) => void;
  level: EditorWorkspaceLevel;
  setLevel: (level: EditorWorkspaceLevel) => void;
  toggleSearch: () => void;
  onCreatePage: () => void;
  onOpenPreview: () => void;
  coordinatedView: boolean;
  onToggleCoordinatedView: () => void;
}

function changeIndicatorClass(hasPendingChanges: boolean, hasCurrentFile: boolean): string {
  if (hasPendingChanges) return 'bg-ocre';
  if (hasCurrentFile) return 'bg-salvia';
  return 'bg-carbon/20';
}

function saveLabel(saving: boolean, isDiagramFile: boolean): string {
  if (saving) return 'Guardando…';
  return isDiagramFile ? 'Guardar TSX' : 'Revisar y guardar';
}

export const EditorToolbar: React.FC<EditorToolbarProps> = ({
  isSidebarOpen,
  setIsSidebarOpen,
  currentFile,
  message,
  persistenceLabel,
  dirtyState,
  isDiagramFile,
  editorMode,
  toggleEditorMode,
  validation,
  saveCurrentFile,
  saving,
  previewPath,
  isInspectorOpen,
  setIsInspectorOpen,
  isDiagnosticsOpen,
  setIsDiagnosticsOpen,
  level,
  setLevel,
  toggleSearch,
  onCreatePage,
  onOpenPreview,
  coordinatedView,
  onToggleCoordinatedView,
}) => {
  const fileName = currentFile?.split('/').pop() ?? 'Ningún recurso abierto';
  const hasPendingChanges = dirtyState !== 'clean';
  const indicatorClass = changeIndicatorClass(hasPendingChanges, Boolean(currentFile));
  const resourceClass = isDiagramFile ? 'bg-pavo/10 text-pavo' : 'bg-salvia/10 text-salvia';
  const resourceLabel = isDiagramFile ? 'Diagrama' : 'Documento MDX';
  const primarySaveLabel = saveLabel(saving, isDiagramFile);

  return (
    <header className="shrink-0 border-b border-carbon/15 bg-lienzo" aria-label="Barra del editor">
      <div className="flex min-h-14 items-center gap-2 px-2 sm:px-4">
        <button
          type="button"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          aria-expanded={isSidebarOpen}
          aria-controls="editor-navigation"
          className="rounded border border-carbon/15 px-2.5 py-2 text-xs font-bold text-carbon/70 hover:bg-carbon/5"
          title="Mostrar u ocultar recursos (Ctrl/⌘ Mayús E)"
        >
          {isSidebarOpen ? 'Ocultar recursos' : 'Recursos'}
        </button>
        <button type="button" onClick={onCreatePage} className="rounded border border-salvia/25 bg-salvia/5 px-2.5 py-2 text-xs font-bold text-salvia hover:bg-salvia/10" title="Crear una página MDX estructurada">Nueva</button>

        <div className="min-w-0 flex-1 px-1">
          <div className="flex items-center gap-2">
            <span className={`h-2 w-2 shrink-0 rounded-full ${indicatorClass}`} aria-hidden="true" />
            <h1 className="truncate font-serif text-sm font-bold text-carbon">{fileName}</h1>
            {currentFile && <span className={`hidden rounded px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide sm:inline ${resourceClass}`}>{resourceLabel}</span>}
          </div>
          <p className="truncate text-[10px] text-carbon/45" aria-live="polite">{message || persistenceLabel}</p>
        </div>

        <div className="hidden items-center rounded border border-carbon/15 p-0.5 xl:flex" aria-label="Complejidad de la interfaz">
          {(['basic', 'advanced'] as const).map(option => (
            <button
              key={option}
              type="button"
              onClick={() => setLevel(option)}
              aria-pressed={level === option}
              className={`rounded px-2.5 py-1 text-[10px] font-bold ${level === option ? 'bg-carbon text-lienzo' : 'text-carbon/55 hover:bg-carbon/5'}`}
            >
              {option === 'basic' ? 'Básico' : 'Avanzado'}
            </button>
          ))}
        </div>

        {currentFile && <div className="hidden items-center gap-2 lg:flex">
          <EditorModeSwitcher editorMode={editorMode} isDiagramFile={isDiagramFile} onToggleMode={toggleEditorMode} />
          <button
            type="button"
            onClick={() => saveCurrentFile()}
            disabled={saving || !validation.canSave}
            className="rounded bg-salvia px-3 py-1.5 text-xs font-bold text-lienzo hover:bg-salvia/85 disabled:cursor-not-allowed disabled:opacity-40"
            title={isDiagramFile ? 'Guardar el archivo TSX completo' : 'Revisar los cambios antes de aplicarlos'}
          >
            {primarySaveLabel}
          </button>
          {!isDiagramFile && <button
            type="button"
            onClick={onOpenPreview}
            disabled={!previewPath}
            className="rounded border border-carbon/20 px-3 py-1.5 text-xs font-bold text-carbon/70 hover:bg-carbon/5 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Vista publicada
          </button>}
          {!isDiagramFile && <button type="button" onClick={onToggleCoordinatedView} aria-pressed={coordinatedView} className={`rounded border px-3 py-1.5 text-xs font-bold ${coordinatedView ? 'border-pavo/30 bg-pavo/10 text-pavo' : 'border-carbon/20 text-carbon/70 hover:bg-carbon/5'}`}>Visual + código</button>}
        </div>}

        <div className="flex items-center gap-1 border-l border-carbon/10 pl-2">
          {currentFile && <>
            <button
              type="button"
              onClick={() => setIsInspectorOpen(!isInspectorOpen)}
              aria-expanded={isInspectorOpen}
              className={`hidden rounded px-2 py-1.5 text-xs font-bold sm:block ${isInspectorOpen ? 'bg-carbon/10 text-carbon' : 'text-carbon/55'}`}
              title="Mostrar u ocultar inspector (Ctrl/⌘ Mayús I)"
            >
              Inspector
            </button>
            <button
              type="button"
              onClick={() => setIsDiagnosticsOpen(!isDiagnosticsOpen)}
              aria-expanded={isDiagnosticsOpen}
              className={`hidden rounded px-2 py-1.5 text-xs font-bold md:block ${isDiagnosticsOpen ? 'bg-carbon/10 text-carbon' : 'text-carbon/55'}`}
              title="Mostrar u ocultar diagnósticos (Ctrl/⌘ J)"
            >
              Diagnósticos {validation.errorCount > 0 ? `(${validation.errorCount})` : ''}
            </button>
          </>}
          <Link href={routePath('/')} className="flex h-9 w-9 items-center justify-center rounded border border-carbon/10 text-carbon" title="Volver a la biblioteca"><Logo className="h-6 w-6" /></Link>
          <button type="button" onClick={toggleSearch} className="hidden h-9 w-9 items-center justify-center rounded border border-carbon/10 text-carbon sm:flex" title="Búsqueda global (Ctrl/⌘ K)" aria-label="Abrir búsqueda global">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
          </button>
          <ThemeToggle />
        </div>
      </div>

      {currentFile && <div className="flex items-center gap-2 overflow-x-auto border-t border-carbon/10 px-2 py-2 lg:hidden">
        <EditorModeSwitcher editorMode={editorMode} isDiagramFile={isDiagramFile} onToggleMode={toggleEditorMode} />
        <button type="button" onClick={() => saveCurrentFile()} disabled={saving || !validation.canSave} className="whitespace-nowrap rounded bg-salvia px-3 py-1 text-xs font-bold text-lienzo disabled:opacity-40">{isDiagramFile ? 'Guardar TSX' : 'Revisar y guardar'}</button>
        {!isDiagramFile && <button type="button" onClick={onToggleCoordinatedView} className="whitespace-nowrap rounded border border-carbon/15 px-2 py-1 text-xs">{coordinatedView ? 'Una vista' : 'Visual + código'}</button>}
        {!isDiagramFile && <button type="button" onClick={onOpenPreview} disabled={!previewPath} className="whitespace-nowrap rounded border border-carbon/15 px-2 py-1 text-xs disabled:opacity-40">Preview</button>}
        <button type="button" onClick={() => setIsInspectorOpen(!isInspectorOpen)} className="whitespace-nowrap rounded border border-carbon/15 px-2 py-1 text-xs">Inspector</button>
        <button type="button" onClick={() => setIsDiagnosticsOpen(!isDiagnosticsOpen)} className="whitespace-nowrap rounded border border-carbon/15 px-2 py-1 text-xs">Diagnósticos</button>
        <button type="button" onClick={() => setLevel(level === 'basic' ? 'advanced' : 'basic')} className="whitespace-nowrap rounded border border-carbon/15 px-2 py-1 text-xs">Vista {level === 'basic' ? 'básica' : 'avanzada'}</button>
      </div>}
    </header>
  );
};
