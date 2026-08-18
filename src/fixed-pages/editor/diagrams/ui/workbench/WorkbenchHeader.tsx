import React from 'react';
import type { VisualDiagramModel } from '../../model/types';
import type { CanvasFrameMode } from '../canvas/canvasFrameMode';
import {
  HeaderBadge,
  HeaderPillContainer,
  HeaderPillButton,
  HeaderActionButton,
} from '@/fixed-pages/editor/ui/workbench/EditorHeaderPrimitives';
import { EditorWorkbenchHeader } from '@/fixed-pages/editor/ui/workbench/EditorWorkbenchHeader';
import type { EditorSaveCapability } from '@/fixed-pages/editor/save/saveCapability';
import { saveChromeFromCapability } from '@/fixed-pages/editor/save/saveCapability';
import { SUPPORTED_LANGUAGES } from '@/i18n/config';

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
            <HeaderBadge variant="ocre" title="...">Sandbox</HeaderBadge>
          ) : (
            <HeaderBadge variant="salvia" className="hidden lg:inline">
              {metadataType || 'Diagrama'}
            </HeaderBadge>
          )}

          <div
            className="hidden sm:inline-flex max-w-[200px] overflow-x-auto items-center gap-1 bg-carbon/5 p-0.5 rounded border border-carbon/15"
            role="group"
            aria-label="Idioma de vista previa del diagrama"
          >
            {SUPPORTED_LANGUAGES.map(lang => {
              const isActive = (activeLang || 'es') === lang.code;
              return (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => onSelectActiveLang?.(lang.code)}
                  className={`shrink-0 rounded px-1.5 py-0.5 text-[9px] font-bold uppercase transition-colors cursor-pointer ${
                    isActive
                      ? 'border border-salvia/50 bg-salvia text-lienzo'
                      : 'text-carbon/60 hover:bg-salvia/15 hover:text-salvia'
                  }`}
                  title={`Editar/Visualizar en ${lang.name}`}
                >
                  {lang.code}
                </button>
              );
            })}
          </div>
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
              className="flex h-7 w-7 items-center justify-center rounded-md text-carbon/70 hover:bg-carbon/10 hover:text-carbon disabled:opacity-30 disabled:hover:bg-transparent transition-all cursor-pointer"
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
              className="flex h-7 w-7 items-center justify-center rounded-md text-carbon/70 hover:bg-carbon/10 hover:text-carbon disabled:opacity-30 disabled:hover:bg-transparent transition-all cursor-pointer"
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
              className="flex items-center space-x-1 rounded-md px-2 py-1 text-xs font-medium text-carbon/80 transition-all hover:bg-carbon/10 cursor-pointer"
              title="Centrar y restablecer la cámara del lienzo"
            >
              <svg className="h-3.5 w-3.5 text-salvia" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              <span className="hidden md:inline">Centrar</span>
            </button>
          </HeaderPillContainer>
          <HeaderPillContainer className="hidden lg:flex">
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
          <HeaderActionButton onClick={onOpenMdxLinks} variant="secondary" className="hidden xl:inline-flex text-salvia">
            MDX
          </HeaderActionButton>
          <HeaderActionButton onClick={onOpenCode} variant="salvia">
            Código
          </HeaderActionButton>
        </>
      }
    />
  );
};
