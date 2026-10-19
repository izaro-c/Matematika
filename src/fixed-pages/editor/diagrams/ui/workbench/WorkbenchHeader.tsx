import React, { useMemo } from 'react';
import type { VisualDiagramModel } from '../../model/types';
import type { CanvasFrameMode } from '../canvas/canvasFrameMode';
import {
  HeaderBadge,
  HeaderPillContainer,
  HeaderPillButton,
  HeaderActionButton,
  DocumentVersions,
} from '@/fixed-pages/editor/ui/workbench/EditorHeaderPrimitives';
import { SUPPORTED_LANGUAGE_CODES } from '@/i18n/config';
import { diagramVersionStatuses } from '../../model/scene/translationStatus';
import { EditorWorkbenchHeader } from '@/fixed-pages/editor/ui/workbench/EditorWorkbenchHeader';
import type { EditorSaveCapability } from '@/fixed-pages/editor/save/saveCapability';
import { saveChromeFromCapability, translateSaveChrome } from '@/fixed-pages/editor/save/saveCapability';
import { documentPathCrumbs } from '@/fixed-pages/editor/session/editorNavigationModel';
import { useI18n } from '@/i18n';
import { Button } from '@/fixed-pages/editor/ui/primitives';

interface WorkbenchHeaderProps {
  model: VisualDiagramModel | null;
  componentName: string;
  /** Archivo del diagrama; `null` en un diagrama en línea o nuevo. */
  filePath?: string | null;
  metadataType?: string;
  activeLang?: string;
  onSelectActiveLang?: (lang: string) => void;
  canUndo: boolean;
  canRedo: boolean;
  frameMode: CanvasFrameMode;
  onSelectFrameMode: (mode: CanvasFrameMode) => void;
  onUndo: () => void;
  onRedo: () => void;
  onOpenPresets: () => void;
  onOpenCode: () => void;
  onOpenSettings: () => void;
  onOpenMdxLinks: () => void;
  onOpenGuided?: () => void;
  onResetViewport: () => void;
  isDiagnosticsOpen: boolean;
  onToggleDiagnostics: () => void;
  onTitleChange: (newTitle: string) => void;
  onCloseEditor?: () => void;
  sandboxMode?: boolean;
  saveCapability: EditorSaveCapability;
  onSave?: () => void;
  isSidebarOpen?: boolean;
  onToggleSidebar?: () => void;
  isInspectorOpen?: boolean;
  onToggleInspector?: () => void;
}

export const WorkbenchHeader: React.FC<WorkbenchHeaderProps> = ({
  model,
  filePath,
  metadataType,
  activeLang,
  onSelectActiveLang,
  canUndo,
  canRedo,
  frameMode,
  onSelectFrameMode,
  onUndo,
  onRedo,
  onOpenPresets,
  onOpenCode,
  onOpenSettings,
  onOpenMdxLinks,
  onResetViewport,
  isDiagnosticsOpen,
  onToggleDiagnostics,
  onTitleChange,
  onCloseEditor,
  sandboxMode = false,
  saveCapability,
  onSave,
  isSidebarOpen,
  onToggleSidebar,
  isInspectorOpen,
  onToggleInspector,
}) => {
  const { t } = useI18n();
  const translations = model?.translations;
  const versions = useMemo(() => diagramVersionStatuses(translations, SUPPORTED_LANGUAGE_CODES), [translations]);
  const localizedTitle = activeLang && activeLang !== 'es'
    ? (model?.translations?.[activeLang]?.title ?? '')
    : (model?.title ?? '');
  const title = localizedTitle || (activeLang && activeLang !== 'es' ? '' : (model?.title || t('editor.diagramWorkbench.untitledDiagram')));
  const saveChrome = translateSaveChrome(t, saveChromeFromCapability(saveCapability, { entity: 'diagram' }));

  return (
    <EditorWorkbenchHeader
      title={title}
      titlePlaceholder={activeLang && activeLang !== 'es' ? t('editor.diagramWorkbench.titleInLang', { lang: activeLang.toUpperCase(), base: model?.title || t('editor.diagramWorkbench.baseSpanish') }) : t('editor.diagramWorkbench.diagramNamePlaceholder')}
      onTitleChange={onTitleChange}
      pathCrumbs={filePath ? documentPathCrumbs(filePath) : []}
      badges={
        <div className="flex items-center gap-2">
          {sandboxMode ? (
            <HeaderBadge variant="ocre" title={t('editor.diagramWorkbench.sandboxMode')}>{t('editor.diagramWorkbench.sandbox')}</HeaderBadge>
          ) : (
            <HeaderBadge variant="canela" className="hidden lg:inline-flex">
              {metadataType || t('editor.diagramWorkbench.diagram')}
            </HeaderBadge>
          )}

          <DocumentVersions
            kind="diagram"
            activeLang={activeLang || 'es'}
            versions={versions}
            onSelect={onSelectActiveLang}
            onCreate={onSelectActiveLang}
            className="hidden sm:inline-flex"
            aria-label={t('editor.diagramWorkbench.diagramPreviewLanguage')}
          />
        </div>
      }
      isDirty={saveCapability.isDirty}
      isSidebarOpen={isSidebarOpen}
      onToggleSidebar={onToggleSidebar}
      isInspectorOpen={isInspectorOpen}
      onToggleInspector={onToggleInspector}
      confirmCloseWhenDirty
      closeTitle={t('editor.diagramWorkbench.closeDiagram')}
      closeConfirmMessage={t('editor.diagramWorkbench.closeDiagramConfirm')}
      onCloseEditor={onCloseEditor}
      avisos={{
        errorCount: saveCapability.errorCount,
        warningCount: saveCapability.warningCount,
        onOpen: onToggleDiagnostics,
        open: isDiagnosticsOpen,
        healthyLabel: t('editor.nav.warnings'),
      }}
      save={{
        ...saveChrome,
        disabled: saveChrome.disabled || !onSave,
        onSave: onSave ?? (() => {}),
      }}
      center={
        <>
          <HeaderPillContainer>
            <Button size="sm" className="w-7" onClick={onUndo} disabled={!canUndo} title={t('editor.diagramWorkbench.undoLastActionCtrl')}>
              <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
              </svg>
            </Button>
            <Button size="sm" className="w-7" onClick={onRedo} disabled={!canRedo} title={t('editor.diagramWorkbench.redoActionCtrlY')}>
              <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 10H11a8 8 0 00-8 8v2m18-10l-6 6m6-6l-6-6" />
              </svg>
            </Button>
            <div className="mx-0.5 h-4 w-px bg-carbon/15" />
            <Button size="sm" onClick={onResetViewport} title={t('editor.diagramWorkbench.centerTitle')}>
              <svg className="h-3.5 w-3.5 text-canela" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              <span className="hidden md:inline">{t('editor.diagramWorkbench.center')}</span>
            </Button>
          </HeaderPillContainer>
          <HeaderPillContainer className="hidden lg:inline-flex">
            <HeaderPillButton active={frameMode === 'editor'} onClick={() => onSelectFrameMode('editor')}>
              {t('editor.diagramWorkbench.editor')}
            </HeaderPillButton>
            <HeaderPillButton active={frameMode === 'desktop'} onClick={() => onSelectFrameMode('desktop')}>
              {t('editor.diagramWorkbench.desktop')}
            </HeaderPillButton>
            <HeaderPillButton active={frameMode === 'tablet'} onClick={() => onSelectFrameMode('tablet')}>
              {t('editor.diagramWorkbench.tablet')}
            </HeaderPillButton>
            <HeaderPillButton active={frameMode === 'mobile'} onClick={() => onSelectFrameMode('mobile')}>
              {t('editor.diagramWorkbench.mobile')}
            </HeaderPillButton>
          </HeaderPillContainer>
        </>
      }
      actions={
        <>
          <HeaderActionButton onClick={onOpenPresets} variant="secondary" className="hidden lg:inline-flex">
            {t('editor.diagramWorkbench.templates')}
          </HeaderActionButton>
          <HeaderActionButton onClick={onOpenSettings} variant="secondary" className="hidden sm:inline-flex">
            {t('editor.diagramWorkbench.config')}
          </HeaderActionButton>
          <HeaderActionButton onClick={onOpenMdxLinks} variant="secondary" className="hidden xl:inline-flex text-canela">
            {'MDX'}
          </HeaderActionButton>
          <HeaderActionButton onClick={onOpenCode} variant="canela">
            {t('editor.diagramWorkbench.code')}
          </HeaderActionButton>
        </>
      }
    />
  );
};
