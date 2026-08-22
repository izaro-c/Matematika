import React from 'react';
import type { VisualDiagramModel } from '../../model/types';
import type { CanvasFrameMode } from '../canvas/canvasFrameMode';
import {
  HeaderBadge,
  HeaderPillContainer,
  HeaderPillButton,
  HeaderActionButton,
  EditorLanguageBadges,
} from '@/fixed-pages/editor/ui/workbench/EditorHeaderPrimitives';
import { EditorWorkbenchHeader } from '@/fixed-pages/editor/ui/workbench/EditorWorkbenchHeader';
import type { EditorSaveCapability } from '@/fixed-pages/editor/save/saveCapability';
import { saveChromeFromCapability } from '@/fixed-pages/editor/save/saveCapability';

interface WorkbenchHeaderProps {
  model: VisualDiagramModel | null;
  componentName: string;
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
  onOpenAvisos: () => void;
  onTitleChange: (newTitle: string) => void;
  onCloseEditor?: () => void;
  sandboxMode?: boolean;
  syncStatus?: string;
  saveCapability: EditorSaveCapability;
  onSave?: () => void;
  isSidebarOpen?: boolean;
  onToggleSidebar?: () => void;
  isInspectorOpen?: boolean;
  onToggleInspector?: () => void;
}

export const WorkbenchHeader: React.FC<WorkbenchHeaderProps> = ({
  model,
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
  onOpenAvisos,
  onTitleChange,
  onCloseEditor,
  sandboxMode = false,
  syncStatus,
  saveCapability,
  onSave,
  isSidebarOpen,
  onToggleSidebar,
  isInspectorOpen,
  onToggleInspector,
}) => {
  const localizedTitle = activeLang && activeLang !== 'es'
    ? (model?.translations?.[activeLang]?.title ?? '')
    : (model?.title ?? '');
  const title = localizedTitle || (activeLang && activeLang !== 'es' ? '' : (model?.title || 'Diagrama Sin Título'));
  const saving = syncStatus === 'saving';
  const saveChrome = saving
    ? { label: 'Guardando…', variant: 'saving' as const, title: 'Guardando cambios…', disabled: true }
    : saveChromeFromCapability(saveCapability, { entityLabel: 'Diagrama' });

  return (
    <EditorWorkbenchHeader
      title={title}
      titlePlaceholder={activeLang && activeLang !== 'es' ? `Título en ${activeLang.toUpperCase()} (${model?.title || 'Base ES'})` : "Nombre del Diagrama"}
      onTitleChange={onTitleChange}
      badges={
        <div className="flex items-center gap-2">
          {sandboxMode ? (
            <HeaderBadge variant="ocre" title="Modo Sandbox">Sandbox</HeaderBadge>
          ) : (
            <HeaderBadge variant="canela" className="hidden lg:inline-flex">
              {metadataType || 'Diagrama'}
            </HeaderBadge>
          )}

          <EditorLanguageBadges
            mode="diagram"
            activeLang={activeLang || 'es'}
            onSelectLang={onSelectActiveLang}
            className="hidden sm:inline-flex"
            aria-label="Idioma de vista previa del diagrama"
          />
        </div>
      }
      isDirty={saveCapability.isDirty}
      isSidebarOpen={isSidebarOpen}
      onToggleSidebar={onToggleSidebar}
      isInspectorOpen={isInspectorOpen}
      onToggleInspector={onToggleInspector}
      confirmCloseWhenDirty
      closeTitle="Cerrar diagrama"
      closeConfirmMessage="Hay cambios sin guardar en el diagrama. ¿Deseas cerrar el diagrama de todos modos?"
      onCloseEditor={onCloseEditor}
      avisos={{
        errorCount: saveCapability.errorCount,
        warningCount: saveCapability.warningCount,
        onOpen: onOpenAvisos,
        healthyLabel: 'Avisos',
      }}
      save={{
        ...saveChrome,
        disabled: saveChrome.disabled || !onSave,
        onSave: onSave ?? (() => {}),
      }}
      center={
        <>
          <HeaderPillContainer>
            <button
              type="button"
              onClick={onUndo}
              disabled={!canUndo}
              className="inline-flex h-7 w-7 items-center justify-center rounded-md text-carbon/70 hover:bg-carbon/10 hover:text-carbon disabled:opacity-30 disabled:hover:bg-transparent transition-all cursor-pointer"
              title="Deshacer última acción (Ctrl+Z)"
            >
              <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
              </svg>
            </button>
            <button
              type="button"
              onClick={onRedo}
              disabled={!canRedo}
              className="inline-flex h-7 w-7 items-center justify-center rounded-md text-carbon/70 hover:bg-carbon/10 hover:text-carbon disabled:opacity-30 disabled:hover:bg-transparent transition-all cursor-pointer"
              title="Rehacer acción (Ctrl+Y)"
            >
              <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 10H11a8 8 0 00-8 8v2m18-10l-6 6m6-6l-6-6" />
              </svg>
            </button>
            <div className="mx-0.5 h-4 w-px bg-carbon/15" />
            <button
              type="button"
              onClick={onResetViewport}
              className="inline-flex h-7 items-center gap-1 rounded-md px-2 text-xs font-medium text-carbon/80 transition-all hover:bg-carbon/10 cursor-pointer leading-none"
              title="Centrar y restablecer la cámara del lienzo"
            >
              <svg className="h-3.5 w-3.5 text-canela" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              <span className="hidden md:inline">Centrar</span>
            </button>
          </HeaderPillContainer>
          <HeaderPillContainer className="hidden lg:inline-flex">
            <HeaderPillButton active={frameMode === 'editor'} onClick={() => onSelectFrameMode('editor')}>
              Editor
            </HeaderPillButton>
            <HeaderPillButton active={frameMode === 'desktop'} onClick={() => onSelectFrameMode('desktop')}>
              Escritorio
            </HeaderPillButton>
            <HeaderPillButton active={frameMode === 'tablet'} onClick={() => onSelectFrameMode('tablet')}>
              Tablet
            </HeaderPillButton>
            <HeaderPillButton active={frameMode === 'mobile'} onClick={() => onSelectFrameMode('mobile')}>
              Móvil
            </HeaderPillButton>
          </HeaderPillContainer>
        </>
      }
      actions={
        <>
          <HeaderActionButton onClick={onOpenPresets} variant="secondary" className="hidden lg:inline-flex">
            Plantillas
          </HeaderActionButton>
          <HeaderActionButton onClick={onOpenSettings} variant="secondary" className="hidden sm:inline-flex">
            Config
          </HeaderActionButton>
          <HeaderActionButton onClick={onOpenMdxLinks} variant="secondary" className="hidden xl:inline-flex text-canela">
            MDX
          </HeaderActionButton>
          <HeaderActionButton onClick={onOpenCode} variant="canela">
            Código
          </HeaderActionButton>
        </>
      }
    />
  );
};
