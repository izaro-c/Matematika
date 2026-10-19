import React from 'react';
import {
  HeaderBadge,
  HeaderPillContainer,
  HeaderPillButton,
  HeaderActionButton,
  DocumentVersions,
  UiLanguageSwitch,
} from './EditorHeaderPrimitives';
import type { DocumentVersion } from '@/fixed-pages/editor/session/conceptVersions';
import { EditorWorkbenchHeader } from './EditorWorkbenchHeader';
import type { EditorSaveCapability } from '@/fixed-pages/editor/save/saveCapability';
import { saveChromeFromCapability, translateSaveChrome } from '@/fixed-pages/editor/save/saveCapability';
import { useI18n } from '@/i18n';

export type MdxViewMode = 'code' | 'visual' | 'preview' | 'translate';

interface MdxWorkbenchHeaderProps {
  currentFile: string | null;
  fileTitle: string;
  contentType?: string;
  currentLang?: string;
  documentVersions?: DocumentVersion[];
  /** Hay otra versión de idioma con la que comparar: muestra la vista «Traducir». */
  canTranslate?: boolean;
  onSwitchLanguage?: (lang: string) => void;
  onCreateTranslation?: (targetLang: string) => void;
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
  currentLang,
  documentVersions = [],
  canTranslate = false,
  onSwitchLanguage,
  onCreateTranslation,
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
  const untitledFallback = t('editor.mdx.untitledDocument');
  const displayTitle = fileTitle || currentFile?.split('/').pop()?.replace(/\.mdx$/, '') || untitledFallback;
  const saveChrome = translateSaveChrome(t, saveChromeFromCapability(saveCapability));

  return (
    <EditorWorkbenchHeader
      title={displayTitle}
      titlePlaceholder={t('editor.mdx.pageTitlePlaceholder')}
      onTitleChange={onTitleChange}
      titleDisabled={isReadOnly}
      badges={
        <div className="flex items-center gap-2">
          {contentType ? (
            <HeaderBadge variant="canela" className="hidden lg:inline-flex">
              {contentType}
            </HeaderBadge>
          ) : null}

          <DocumentVersions
            activeLang={currentLang || 'es'}
            versions={documentVersions}
            onSelect={onSwitchLanguage}
            onCreate={onCreateTranslation}
            className="hidden sm:inline-flex"
            aria-label={t('editor.language.documentEditing')}
          />
        </div>
      }
      isDirty={saveCapability.isDirty}
      isSidebarOpen={isSidebarOpen}
      onToggleSidebar={onToggleSidebar}
      isInspectorOpen={isInspectorOpen}
      onToggleInspector={onToggleInspector}
      confirmCloseWhenDirty
      closeTitle={t('editor.nav.closeDocument')}
      closeConfirmMessage={t('editor.save.unsavedCloseConfirm')}
      onCloseEditor={onCloseEditor}
      avisos={{
        errorCount: saveCapability.errorCount,
        warningCount: saveCapability.warningCount,
        onOpen: onOpenAvisos,
        healthyLabel: t('editor.mdx.diagnostics'),
      }}
      save={{
        ...saveChrome,
        onSave,
      }}
      center={
        <>
          <HeaderPillContainer>
            <HeaderPillButton active={viewMode === 'visual'} onClick={() => onSetViewMode('visual')}>
              {t('editor.nav.editTab')}
            </HeaderPillButton>
            {(workspaceLevel === 'advanced' || viewMode === 'code') && (
              <HeaderPillButton active={viewMode === 'code'} onClick={() => onSetViewMode('code')}>
                {t('editor.nav.sourceTab')}
              </HeaderPillButton>
            )}
            {(canTranslate || viewMode === 'translate') && (
              <HeaderPillButton active={viewMode === 'translate'} onClick={() => onSetViewMode('translate')}>
                {t('editor.translation.tab')}
              </HeaderPillButton>
            )}
            <HeaderPillButton active={viewMode === 'preview'} onClick={() => onSetViewMode('preview')}>
              {t('editor.nav.publishedTab')}
            </HeaderPillButton>
          </HeaderPillContainer>
        </>
      }
      actions={
        <>
          <UiLanguageSwitch size="compact" className="hidden xl:inline-flex" />
          {onToggleWorkspaceLevel && (
            <HeaderActionButton
              onClick={onToggleWorkspaceLevel}
              variant="secondary"
              className="hidden lg:inline-flex"
              title={workspaceLevel === 'advanced' ? t('editor.nav.switchToBasic') : t('editor.nav.switchToAdvanced')}
            >
              {workspaceLevel === 'advanced' ? t('editor.common.advanced') : t('editor.common.basic')}
            </HeaderActionButton>
          )}
          {canSaveDraft && onSaveDraft && (
            <HeaderActionButton onClick={onSaveDraft} variant="secondary" className="hidden md:inline-flex" title={t('editor.save.saveDraft')}>
              {t('editor.save.draft')}
            </HeaderActionButton>
          )}
        </>
      }
    />
  );
};
