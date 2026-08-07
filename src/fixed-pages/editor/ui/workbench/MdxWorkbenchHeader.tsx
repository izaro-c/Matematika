import React from 'react';
import {
  HeaderBadge,
  HeaderPillContainer,
  HeaderPillButton,
  HeaderActionButton,
} from './EditorHeaderPrimitives';
import { EditorWorkbenchHeader } from './EditorWorkbenchHeader';
import type { EditorSaveCapability } from '@/fixed-pages/editor/save/saveCapability';
import { saveChromeFromCapability } from '@/fixed-pages/editor/save/saveCapability';

export type MdxViewMode = 'code' | 'visual' | 'preview';

interface MdxWorkbenchHeaderProps {
  currentFile: string | null;
  fileTitle: string;
  contentType?: string;
  saving: boolean;
  viewMode: MdxViewMode;
  onSetViewMode: (mode: MdxViewMode) => void;
  isSidebarOpen: boolean;
  onToggleSidebar: () => void;
  isInspectorOpen: boolean;
  onToggleInspector: () => void;
  onOpenAvisos: () => void;
  onTitleChange: (newTitle: string) => void;
  onSave: () => void;
  onSaveDraft?: () => void;
  onCreatePage?: () => void;
  onCloseEditor?: () => void;
  canSaveDraft?: boolean;
  isReadOnly?: boolean;
  workspaceLevel?: 'basic' | 'advanced';
  onToggleWorkspaceLevel?: () => void;
  saveCapability: EditorSaveCapability;
}

export const MdxWorkbenchHeader: React.FC<MdxWorkbenchHeaderProps> = ({
  currentFile,
  fileTitle,
  contentType,
  saving,
  viewMode,
  onSetViewMode,
  isSidebarOpen,
  onToggleSidebar,
  isInspectorOpen,
  onToggleInspector,
  onOpenAvisos,
  onTitleChange,
  onSave,
  onSaveDraft,
  onCreatePage,
  onCloseEditor,
  canSaveDraft = false,
  isReadOnly = false,
  workspaceLevel = 'basic',
  onToggleWorkspaceLevel,
  saveCapability,
}) => {
  const displayTitle = fileTitle || currentFile?.split('/').pop()?.replace(/\.mdx$/, '') || 'Documento Sin Título';
  const saveChrome = saving
    ? { label: 'Guardando…', variant: 'saving' as const, title: 'Guardando cambios…', disabled: true }
    : saveChromeFromCapability(saveCapability);

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
      isDirty={saveCapability.isDirty}
      isSidebarOpen={isSidebarOpen}
      onToggleSidebar={onToggleSidebar}
      isInspectorOpen={isInspectorOpen}
      onToggleInspector={onToggleInspector}
      confirmCloseWhenDirty
      closeTitle="Cerrar documento"
      closeConfirmMessage="Hay cambios sin guardar en el documento. ¿Deseas cerrar el documento de todos modos?"
      onCloseEditor={onCloseEditor}
      avisos={{
        errorCount: saveCapability.errorCount,
        warningCount: saveCapability.warningCount,
        onOpen: onOpenAvisos,
        healthyLabel: 'Avisos',
      }}
      save={{
        ...saveChrome,
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
          {canSaveDraft && onSaveDraft && (
            <HeaderActionButton onClick={onSaveDraft} variant="secondary" className="hidden md:inline-flex" title="Guardar borrador">
              Borrador
            </HeaderActionButton>
          )}
        </>
      }
    />
  );
};
