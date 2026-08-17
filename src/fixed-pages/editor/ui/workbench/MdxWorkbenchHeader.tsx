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
import { useI18n } from '@/i18n';

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
  onCreatePage: _onCreatePage,
  onCloseEditor,
  canSaveDraft = false,
  isReadOnly = false,
  workspaceLevel = 'basic',
  onToggleWorkspaceLevel,
  saveCapability,
}) => {
  const { t } = useI18n();
  const untitledFallback = t('editor', 'untitledDocument');
  const displayTitle = fileTitle || currentFile?.split('/').pop()?.replace(/\.mdx$/, '') || untitledFallback;
  const saveChrome = saving
    ? {
        label: t('editor', 'saving'),
        variant: 'saving' as const,
        title: t('editor', 'saving'),
        disabled: true,
      }
    : saveChromeFromCapability(saveCapability);

  return (
    <EditorWorkbenchHeader
      title={displayTitle}
      titlePlaceholder={t('editor', 'pageTitlePlaceholder')}
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
      closeTitle={t('editor', 'closeDocument')}
      closeConfirmMessage={t('editor', 'unsavedCloseConfirm')}
      onCloseEditor={onCloseEditor}
      avisos={{
        errorCount: saveCapability.errorCount,
        warningCount: saveCapability.warningCount,
        onOpen: onOpenAvisos,
        healthyLabel: t('editor', 'diagnostics'),
      }}
      save={{
        ...saveChrome,
        onSave,
      }}
      center={
        <>
          <HeaderPillContainer>
            <HeaderPillButton active={viewMode === 'visual'} onClick={() => onSetViewMode('visual')}>
              {t('editor', 'editTab')}
            </HeaderPillButton>
            {(workspaceLevel === 'advanced' || viewMode === 'code') && (
              <HeaderPillButton active={viewMode === 'code'} onClick={() => onSetViewMode('code')}>
                {t('editor', 'sourceTab')}
              </HeaderPillButton>
            )}
            <HeaderPillButton active={viewMode === 'preview'} onClick={() => onSetViewMode('preview')}>
              {t('editor', 'publishedTab')}
            </HeaderPillButton>
          </HeaderPillContainer>
        </>
      }
      actions={
        <>
          {onToggleWorkspaceLevel && (
            <button
              type="button"
              onClick={onToggleWorkspaceLevel}
              className="hidden lg:inline-flex rounded-lg border border-carbon/15 bg-lienzo px-2.5 py-1 text-[10px] font-bold text-carbon/65 hover:bg-carbon/5 transition-colors cursor-pointer"
              title={workspaceLevel === 'advanced' ? t('editor', 'switchToBasic') : t('editor', 'switchToAdvanced')}
            >
              {workspaceLevel === 'advanced' ? t('editor', 'advanced') : t('editor', 'basic')}
            </button>
          )}
          {canSaveDraft && onSaveDraft && (
            <HeaderActionButton onClick={onSaveDraft} variant="secondary" className="hidden md:inline-flex" title={t('editor', 'saveDraft')}>
              {t('editor', 'draft')}
            </HeaderActionButton>
          )}
        </>
      }
    />
  );
};
