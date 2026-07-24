import React, { useEffect, useRef, useState } from 'react';
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

function MenuAction({ label, description, active, disabled, onClick }: {
  label: string;
  description: string;
  active?: boolean;
  disabled?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-pressed={active}
      className={`block w-full rounded px-3 py-2 text-left disabled:cursor-not-allowed disabled:opacity-40 ${active ? 'bg-salvia/10' : 'hover:bg-carbon/5'}`}
    >
      <span className="flex items-center justify-between gap-3 text-xs font-bold text-carbon">
        {label}
        {active !== undefined && <span className={`h-2 w-2 rounded-full ${active ? 'bg-salvia' : 'bg-carbon/20'}`} aria-hidden="true" />}
      </span>
      <span className="mt-0.5 block text-[10px] leading-snug text-carbon/50">{description}</span>
    </button>
  );
}

function ToolbarMenu({ label, children }: { label: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return undefined;
    const closeOutside = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const closeWithEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    document.addEventListener('pointerdown', closeOutside);
    document.addEventListener('keydown', closeWithEscape);
    return () => {
      document.removeEventListener('pointerdown', closeOutside);
      document.removeEventListener('keydown', closeWithEscape);
    };
  }, [open]);
  return (
    <div ref={rootRef} className="relative">
      <button type="button" onClick={() => setOpen(value => !value)} aria-expanded={open} className="rounded border border-carbon/15 px-2.5 py-2 text-xs font-bold text-carbon/70 hover:bg-carbon/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-salvia">
        {label} <span className="ml-1 text-[9px] text-carbon/40" aria-hidden="true">▾</span>
      </button>
      {open && <div onClick={() => setOpen(false)} className="absolute right-0 top-full z-50 mt-2 w-64 rounded border border-carbon/15 bg-lienzo p-1.5 shadow-xl">
        {children}
      </div>}
    </div>
  );
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
  const fileName = currentFile?.split('/').pop() ?? 'Editor de Matematika';
  const hasPendingChanges = dirtyState !== 'clean';
  const indicatorClass = changeIndicatorClass(hasPendingChanges, Boolean(currentFile));
  const resourceClass = isDiagramFile ? 'bg-pavo/10 text-pavo' : 'bg-salvia/10 text-salvia';
  const resourceLabel = isDiagramFile ? 'Diagrama' : 'Documento MDX';
  const primarySaveLabel = saveLabel(saving, isDiagramFile);
  const diagnosticsLabel = validation.errorCount > 0 ? `Diagnósticos (${validation.errorCount})` : 'Diagnósticos';

  return (
    <header className="relative z-30 shrink-0 border-b border-carbon/15 bg-lienzo" aria-label="Barra del editor">
      <div className="flex min-h-16 items-center gap-2 px-2 sm:px-4">
        <button
          type="button"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          aria-expanded={isSidebarOpen}
          aria-controls="editor-navigation"
          className={`rounded border px-3 py-2 text-xs font-bold ${isSidebarOpen ? 'border-salvia/30 bg-salvia/10 text-salvia' : 'border-carbon/15 text-carbon/70 hover:bg-carbon/5'}`}
          title="Mostrar u ocultar recursos (Ctrl/⌘ Mayús E)"
        >
          Recursos
        </button>

        <div className="min-w-0 flex-1 px-1">
          <div className="flex items-center gap-2">
            <span className={`h-2 w-2 shrink-0 rounded-full ${indicatorClass}`} aria-hidden="true" />
            <h1 className="truncate font-serif text-sm font-bold text-carbon">{fileName}</h1>
            {currentFile && <span className={`hidden ac-editor-badge rounded px-1.5 py-0.5 md:inline ${resourceClass}`}>{resourceLabel}</span>}
          </div>
          <p className="truncate text-[10px] text-carbon/45" aria-live="polite">{message || persistenceLabel}</p>
        </div>

        {currentFile && <div className="hidden lg:block">
          <EditorModeSwitcher editorMode={editorMode} isDiagramFile={isDiagramFile} onToggleMode={toggleEditorMode} />
        </div>}

        {currentFile && <button
          type="button"
          onClick={() => saveCurrentFile()}
          disabled={saving || !validation.canSave}
          className="whitespace-nowrap rounded bg-salvia px-3 py-2 text-xs font-bold text-lienzo hover:bg-salvia/85 disabled:cursor-not-allowed disabled:opacity-40"
          title={isDiagramFile ? 'Guardar el archivo TSX completo' : 'Revisar los cambios antes de aplicarlos'}
        >
          <span className="hidden sm:inline">{primarySaveLabel}</span>
          <span className="sm:hidden">Guardar</span>
        </button>}

        {currentFile && <ToolbarMenu label="Paneles">
          <MenuAction label="Inspector" description={isDiagramFile ? 'Usos y capacidad del diagrama.' : 'Metadatos, diagramas y conexiones de la página.'} active={isInspectorOpen} onClick={() => setIsInspectorOpen(!isInspectorOpen)} />
          <MenuAction label={diagnosticsLabel} description="Validación y estado de la sesión actual." active={isDiagnosticsOpen} onClick={() => setIsDiagnosticsOpen(!isDiagnosticsOpen)} />
          {!isDiagramFile && <MenuAction label="Visual + código" description="Muestra ambas representaciones coordinadas." active={coordinatedView} onClick={onToggleCoordinatedView} />}
        </ToolbarMenu>}

        <ToolbarMenu label="Más">
          <MenuAction label="Nueva página" description="Crea un documento MDX estructurado." onClick={onCreatePage} />
          {currentFile && !isDiagramFile && <MenuAction label="Vista publicada" description="Abre la página con el runtime real." disabled={!previewPath} onClick={onOpenPreview} />}
          <MenuAction label="Búsqueda global" description="Busca conceptos en toda Matematika (Ctrl/⌘ K)." onClick={toggleSearch} />
          <MenuAction label={level === 'basic' ? 'Activar vista avanzada' : 'Usar vista básica'} description={level === 'basic' ? 'Muestra rutas y detalles técnicos.' : 'Oculta detalles técnicos no esenciales.'} active={level === 'advanced'} onClick={() => setLevel(level === 'basic' ? 'advanced' : 'basic')} />
          <Link href={routePath('/')} className="block rounded px-3 py-2 hover:bg-carbon/5">
            <span className="flex items-center gap-2 text-xs font-bold text-carbon"><Logo className="h-5 w-5" /> Volver a la biblioteca</span>
            <span className="mt-0.5 block text-[10px] text-carbon/50">Sale del editor y abre el jardín matemático.</span>
          </Link>
        </ToolbarMenu>

        <ThemeToggle />
      </div>

      {currentFile && <div className="flex items-center justify-between gap-3 border-t border-carbon/10 px-3 py-2 lg:hidden">
        <div className="min-w-0 sm:hidden">
          <p className="truncate font-serif text-xs font-bold text-carbon">{fileName}</p>
          <p className="text-[9px] text-carbon/45">{resourceLabel}</p>
        </div>
        <div className="ml-auto">
          <EditorModeSwitcher editorMode={editorMode} isDiagramFile={isDiagramFile} onToggleMode={toggleEditorMode} />
        </div>
      </div>}
    </header>
  );
};
