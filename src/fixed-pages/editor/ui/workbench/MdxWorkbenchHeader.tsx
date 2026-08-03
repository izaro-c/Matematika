import React, { useState } from 'react';
import { Link } from 'wouter';
import { isDarkMode, setTheme } from '@/lib/theme/theme';
import { routePath } from '@/lib/routes';
import { Logo } from '@/components/ui/Logo';
import { IconSun, IconMoon, IconClose } from '@/fixed-pages/editor/diagrams/ui/toolbar/WorkbenchIcons';

export type MdxViewMode = 'code' | 'visual' | 'preview';

interface MdxWorkbenchHeaderProps {
  currentFile: string | null;
  fileTitle: string;
  contentType?: string;
  hasLocalChanges: boolean;
  saving: boolean;
  persistenceStatus?: string;
  editorMode: 'code' | 'visual';
  viewMode: MdxViewMode;
  onSetViewMode: (mode: MdxViewMode) => void;
  isSidebarOpen: boolean;
  onToggleSidebar: () => void;
  isInspectorOpen: boolean;
  onToggleInspector: () => void;
  diagramDrawerOpen: boolean;
  onToggleDiagramDrawer: () => void;
  hasDiagrams: boolean;
  errorCount: number;
  warningCount: number;
  onTitleChange: (newTitle: string) => void;
  onSave: () => void;
  onSaveDraft?: () => void;
  onReviewDiff?: () => void;
  onCreatePage?: () => void;
  onCloseEditor?: () => void;
  canSaveDraft?: boolean;
  canReviewDiff?: boolean;
  isReadOnly?: boolean;
}

export const MdxWorkbenchHeader: React.FC<MdxWorkbenchHeaderProps> = ({
  currentFile,
  fileTitle,
  contentType = 'MDX',
  hasLocalChanges,
  saving,
  persistenceStatus,
  viewMode,
  onSetViewMode,
  isSidebarOpen,
  onToggleSidebar,
  isInspectorOpen,
  onToggleInspector,
  diagramDrawerOpen,
  onToggleDiagramDrawer,
  hasDiagrams,
  errorCount,
  warningCount,
  onTitleChange,
  onSave,
  onSaveDraft,
  onReviewDiff,
  onCreatePage,
  onCloseEditor,
  canSaveDraft = false,
  canReviewDiff = false,
  isReadOnly = false,
}) => {
  const [isDark, setIsDark] = useState(isDarkMode);

  const toggleTheme = () => {
    const nextDark = !isDark;
    setTheme(nextDark);
    setIsDark(nextDark);
  };

  const executeClose = () => {
    if (onCloseEditor) {
      onCloseEditor();
    } else if (window.history.length > 1) {
      window.history.back();
    } else {
      window.location.href = routePath('/');
    }
  };

  const displayTitle = fileTitle || currentFile?.split('/').pop()?.replace(/\.mdx$/, '') || 'Documento Sin Título';

  return (
    <header className="flex h-14 w-full shrink-0 items-center justify-between border-b border-carbon/15 bg-lienzo/95 px-3 backdrop-blur-md z-30 transition-colors">
      {/* 1. Sección Izquierda: Logo, Título, Badge de Tipo y Sidebar Toggle */}
      <div className="flex items-center space-x-2.5 min-w-0">
        <Link
          href={routePath('/')}
          className="flex h-8 w-8 items-center justify-center cursor-pointer rounded-lg hover:bg-carbon/5 transition-colors focus-visible:outline-2 focus-visible:outline-salvia"
          title="Ir al Inicio"
        >
          <Logo decorative className="h-8 w-8" />
        </Link>

        {/* Sidebar Toggle Button */}
        <button
          type="button"
          onClick={onToggleSidebar}
          className={`flex h-8 w-8 items-center justify-center rounded-lg border text-xs font-semibold transition-all ${
            isSidebarOpen
              ? 'border-salvia/40 bg-salvia/10 text-salvia'
              : 'border-carbon/15 bg-lienzo hover:bg-carbon/5 text-carbon/70'
          }`}
          title={isSidebarOpen ? 'Ocultar Explorador de Archivos' : 'Mostrar Explorador de Archivos'}
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h8m-8 6h16" />
          </svg>
        </button>

        {/* Título editable del archivo y badges */}
        <div className="flex items-center space-x-2 min-w-0">
          <input
            type="text"
            value={displayTitle}
            onChange={(e) => onTitleChange(e.target.value)}
            disabled={isReadOnly}
            className="font-serif font-bold text-sm text-carbon bg-transparent hover:bg-carbon/5 focus:bg-lienzo focus:outline-hidden focus:ring-1 focus:ring-salvia rounded px-1.5 py-0.5 transition-colors truncate max-w-[140px] sm:max-w-[220px]"
            placeholder="Título de la Página"
          />
          <span className="text-[10px] font-mono text-carbon/50 bg-carbon/5 px-1.5 py-0.5 rounded border border-carbon/10 hidden md:inline truncate max-w-[130px]">
            {currentFile?.split('/').pop() ?? 'nuevo.mdx'}
          </span>
          {contentType && (
            <span className="text-[10px] font-bold uppercase tracking-wider text-salvia bg-salvia/15 px-1.5 py-0.5 rounded border border-salvia/30 hidden lg:inline">
              {contentType}
            </span>
          )}
          {hasLocalChanges && (
            <span className="h-2 w-2 rounded-full bg-ocre shrink-0 animate-pulse" title="Cambios no guardados" />
          )}
        </div>
      </div>

      {/* 2. Sección Central: View Mode Switcher Pills + Embedded Diagram Drawer Button */}
      <div className="flex items-center space-x-1 sm:space-x-2">
        <div className="flex items-center rounded-lg border border-carbon/15 bg-carbon/5 p-0.5 text-xs font-medium">
          <button
            type="button"
            onClick={() => onSetViewMode('visual')}
            className={`rounded-md px-2.5 py-1 transition-colors ${
              viewMode === 'visual'
                ? 'bg-lienzo font-semibold text-carbon shadow-xs'
                : 'text-carbon/70 hover:text-carbon'
            }`}
          >
            Visual
          </button>
          <button
            type="button"
            onClick={() => onSetViewMode('code')}
            className={`rounded-md px-2.5 py-1 transition-colors ${
              viewMode === 'code'
                ? 'bg-lienzo font-semibold text-carbon shadow-xs'
                : 'text-carbon/70 hover:text-carbon'
            }`}
          >
            Código MDX
          </button>
          <button
            type="button"
            onClick={() => onSetViewMode('preview')}
            className={`rounded-md px-2.5 py-1 transition-colors ${
              viewMode === 'preview'
                ? 'bg-lienzo font-semibold text-carbon shadow-xs'
                : 'text-carbon/70 hover:text-carbon'
            }`}
          >
            Previsualización
          </button>
        </div>

        {/* Embedded Diagram Toggle */}
        <button
          type="button"
          onClick={onToggleDiagramDrawer}
          className={`flex items-center space-x-1 rounded-lg border px-2.5 py-1 text-xs font-semibold transition-all ${
            diagramDrawerOpen
              ? 'border-pavo/50 bg-pavo/15 text-pavo'
              : hasDiagrams
                ? 'border-pavo/30 bg-pavo/5 text-pavo hover:bg-pavo/10'
                : 'border-carbon/15 bg-lienzo text-carbon/60 hover:text-carbon'
          }`}
          title="Abrir Editor de Diagramas Integrado (Diagram Workbench)"
        >
          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
          </svg>
          <span className="hidden md:inline">Diagramas</span>
        </button>
      </div>

      {/* 3. Sección Derecha: Acciones, Inspector Toggle y Cierre */}
      <div className="flex items-center space-x-1.5">
        {onCreatePage && (
          <button
            type="button"
            onClick={onCreatePage}
            className="hidden xl:flex items-center space-x-1 rounded-lg border border-carbon/15 bg-lienzo px-2.5 py-1 text-xs font-medium text-carbon hover:bg-carbon/5 transition-colors"
            title="Crear Nueva Página MDX"
          >
            <span>+ Nueva</span>
          </button>
        )}

        {canReviewDiff && onReviewDiff && (
          <button
            type="button"
            onClick={onReviewDiff}
            className="rounded-lg border border-carbon/15 bg-lienzo px-2.5 py-1 text-xs font-medium text-carbon hover:bg-carbon/5 transition-colors"
            title="Revisar Cambios (Diff)"
          >
            Diff
          </button>
        )}

        {canSaveDraft && onSaveDraft && (
          <button
            type="button"
            onClick={onSaveDraft}
            className="hidden sm:inline-flex rounded-lg border border-carbon/20 bg-carbon/5 px-2.5 py-1 text-xs font-medium text-carbon hover:bg-carbon/10 transition-colors"
            title="Guardar Borrador"
          >
            Borrador
          </button>
        )}

        <button
          type="button"
          onClick={onSave}
          disabled={saving || isReadOnly || (!hasLocalChanges && persistenceStatus === 'saved')}
          className={`rounded-lg px-3 py-1 text-xs font-bold transition-colors ${
            saving
              ? 'bg-pizarra text-lienzo cursor-wait'
              : hasLocalChanges
                ? 'bg-pavo text-lienzo hover:bg-pavo/90 cursor-pointer shadow-xs'
                : 'bg-musgo text-lienzo cursor-default opacity-90'
          }`}
          title={saving ? 'Guardando...' : hasLocalChanges ? 'Guardar Cambios' : 'Al día'}
        >
          {saving ? 'Guardando…' : hasLocalChanges ? 'Guardar' : 'Guardado'}
        </button>

        {/* Inspector & Diagnostics Toggle Button */}
        <button
          type="button"
          onClick={onToggleInspector}
          className={`relative flex items-center space-x-1.5 rounded-lg border px-2.5 py-1 text-xs font-semibold transition-all ${
            isInspectorOpen
              ? 'border-salvia/40 bg-salvia/10 text-salvia'
              : 'border-carbon/15 bg-lienzo hover:bg-carbon/5 text-carbon/70'
          }`}
          title={isInspectorOpen ? 'Ocultar Panel de Inspección' : 'Mostrar Panel de Inspección'}
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
          </svg>
          <span className="hidden sm:inline">Inspector</span>
          {errorCount > 0 && (
            <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-crimson px-1 text-[9px] font-bold text-lienzo" title={`${errorCount} errores bloqueantes`}>
              {errorCount}
            </span>
          )}
          {warningCount > 0 && (
            <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-ocre px-1 text-[9px] font-bold text-lienzo" title={`${warningCount} avisos`}>
              {warningCount}
            </span>
          )}
        </button>

        {/* Theme Toggle Button */}
        <button
          type="button"
          onClick={toggleTheme}
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-carbon/15 bg-lienzo hover:bg-carbon/5 text-carbon transition-colors"
          title={isDark ? 'Cambiar a Modo Claro' : 'Cambiar a Modo Oscuro'}
        >
          {isDark ? <IconSun className="h-4 w-4" /> : <IconMoon className="h-4 w-4" />}
        </button>

        {/* Close Button */}
        <button
          type="button"
          onClick={executeClose}
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-carbon/15 bg-lienzo hover:bg-crimson/10 hover:text-crimson hover:border-crimson/30 text-carbon transition-colors"
          title="Cerrar Editor"
        >
          <IconClose className="h-4 w-4" />
        </button>
      </div>
    </header>
  );
};
