import React from 'react';
import {
  HeaderBadge,
  HeaderPillContainer,
  HeaderPillButton,
  HeaderActionButton,
} from './EditorHeaderPrimitives';
import { EditorWorkbenchHeader } from './EditorWorkbenchHeader';

export type MdxViewMode = 'code' | 'visual' | 'preview';

interface MdxWorkbenchHeaderProps {
  currentFile: string | null;
  fileTitle: string;
  contentType?: string;
  hasLocalChanges: boolean;
  saving: boolean;
  persistenceStatus?: string;
  viewMode: MdxViewMode;
  onSetViewMode: (mode: MdxViewMode) => void;
  isSidebarOpen: boolean;
  onToggleSidebar: () => void;
  isInspectorOpen: boolean;
  onToggleInspector: () => void;
  onOpenAvisos: () => void;
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
  workspaceLevel?: 'basic' | 'advanced';
  onToggleWorkspaceLevel?: () => void;
}

export const MdxWorkbenchHeader: React.FC<MdxWorkbenchHeaderProps> = ({
  currentFile,
  fileTitle,
  contentType = 'Página',
  hasLocalChanges,
  saving,
  persistenceStatus,
  viewMode,
  onSetViewMode,
  isSidebarOpen,
  onToggleSidebar,
  isInspectorOpen,
  onToggleInspector,
  onOpenAvisos,
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
  workspaceLevel = 'basic',
  onToggleWorkspaceLevel,
}) => {
  const displayTitle = fileTitle || currentFile?.split('/').pop()?.replace(/\.mdx$/, '') || 'Documento Sin Título';
  const saveUpToDate = !hasLocalChanges && persistenceStatus === 'saved';

  return (
    <EditorWorkbenchHeader
      title={displayTitle}
      titlePlaceholder="Título de la Página"
      onTitleChange={onTitleChange}
      titleDisabled={isReadOnly}
      fileBadge={currentFile?.split('/').pop() ?? 'nuevo.mdx'}
      badges={
        contentType ? (
          <HeaderBadge variant="salvia" className="hidden lg:inline">
            {contentType}
          </HeaderBadge>
        ) : null
      }
      isDirty={hasLocalChanges}
      isSidebarOpen={isSidebarOpen}
      onToggleSidebar={onToggleSidebar}
      isInspectorOpen={isInspectorOpen}
      onToggleInspector={onToggleInspector}
      confirmCloseWhenDirty
      closeConfirmMessage="Hay cambios sin guardar en la página. ¿Deseas salir del editor de todos modos?"
      onCloseEditor={onCloseEditor}
      avisos={{
        errorCount,
        warningCount,
        onOpen: onOpenAvisos,
        healthyLabel: 'Avisos',
      }}
      save={{
        label: saving ? 'Guardando…' : hasLocalChanges ? 'Guardar' : 'Guardado',
        variant: saving ? 'saving' : hasLocalChanges ? 'pavo' : 'saved',
        title: saving ? 'Guardando...' : hasLocalChanges ? 'Guardar cambios' : 'Al día',
        disabled: saving || isReadOnly || saveUpToDate,
        onSave,
      }}
      center={
        <>
          <HeaderPillContainer>
            <HeaderPillButton active={viewMode === 'visual'} onClick={() => onSetViewMode('visual')}>
              Edición
            </HeaderPillButton>
            {(workspaceLevel === 'advanced' || viewMode === 'code') && (
              <HeaderPillButton active={viewMode === 'code'} onClick={() => onSetViewMode('code')}>
                Fuente
              </HeaderPillButton>
            )}
            <HeaderPillButton active={viewMode === 'preview'} onClick={() => onSetViewMode('preview')}>
              Publicada
            </HeaderPillButton>
          </HeaderPillContainer>
          <button
            type="button"
            onClick={onToggleDiagramDrawer}
            className={`flex items-center space-x-1 rounded-lg border px-2.5 py-1 text-xs font-semibold transition-all cursor-pointer ${
              hasDiagrams
                ? 'border-pavo/30 bg-pavo/5 text-pavo hover:bg-pavo/10'
                : 'border-carbon/15 bg-lienzo text-carbon/60 hover:text-carbon'
            }`}
            title="Abrir editor de diagramas"
          >
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
            </svg>
            <span className="hidden md:inline">Diagramas</span>
          </button>
        </>
      }
      actions={
        <>
          {onCreatePage && (
            <HeaderActionButton onClick={onCreatePage} variant="secondary" className="hidden xl:inline-flex" title="Crear nueva página">
              + Nueva
            </HeaderActionButton>
          )}
          {onToggleWorkspaceLevel && (
            <button
              type="button"
              onClick={onToggleWorkspaceLevel}
              className="hidden lg:inline-flex rounded-lg border border-carbon/15 bg-lienzo px-2.5 py-1 text-[10px] font-bold text-carbon/65 hover:bg-carbon/5 transition-colors cursor-pointer"
              title={workspaceLevel === 'advanced' ? 'Volver a vista básica' : 'Mostrar herramientas avanzadas'}
            >
              {workspaceLevel === 'advanced' ? 'Avanzado' : 'Básico'}
            </button>
          )}
          {canReviewDiff && onReviewDiff && (
            <HeaderActionButton onClick={onReviewDiff} variant="secondary" title="Revisar cambios antes de guardar">
              Revisar cambios
            </HeaderActionButton>
          )}
          {canSaveDraft && onSaveDraft && (
            <HeaderActionButton onClick={onSaveDraft} variant="secondary" className="hidden sm:inline-flex" title="Guardar borrador">
              Borrador
            </HeaderActionButton>
          )}
        </>
      }
    />
  );
};
