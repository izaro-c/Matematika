import React, { useEffect, useState } from 'react';
import type { VisualDiagramModel } from '../../diagrams/model/types';
import type { EnrichedDiagramDiagnostic } from '../../diagrams/diagnostics';
import type { DiagramSaveCapability } from '../../diagrams/model/selectors';
import type { V2CanvasFrameMode } from './canvas/canvasFrameMode';
import { IconSun, IconMoon, IconClose } from './V2Icons';

interface V2HeaderProps {
  model: VisualDiagramModel | null;
  componentName: string;
  canUndo: boolean;
  canRedo: boolean;
  frameMode: V2CanvasFrameMode;
  onSelectFrameMode: (mode: V2CanvasFrameMode) => void;
  onUndo: () => void;
  onRedo: () => void;
  onOpenPresets: () => void;
  onOpenCode: () => void;
  onOpenSettings: () => void;
  onOpenMdxLinks: () => void;
  onOpenGuided: () => void;
  onResetViewport: () => void;
  diagnostics: readonly EnrichedDiagramDiagnostic[];
  errorCount: number;
  warningCount: number;
  onOpenDiagnostics: () => void;
  onTitleChange: (newTitle: string) => void;
  onCloseEditor?: () => void;
  sandboxMode?: boolean;
  isDirty?: boolean;
  syncStatus?: string;
  /** When true, Guardar stays enabled even if clean (e.g. inline apply via onConfirm). */
  allowCleanApply?: boolean;
  saveCapability?: DiagramSaveCapability;
  onSave?: () => void;
}

export const V2Header: React.FC<V2HeaderProps> = ({
  model,
  componentName,
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
  diagnostics,
  errorCount,
  warningCount,
  onOpenDiagnostics,
  onTitleChange,
  onCloseEditor,
  sandboxMode = false,
  isDirty = false,
  syncStatus,
  allowCleanApply = false,
  saveCapability,
  onSave,
}) => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains('dark'));
  }, []);

  const toggleTheme = () => {
    const nextDark = !isDark;
    if (nextDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    setIsDark(nextDark);
  };

  const handleClose = () => {
    if (onCloseEditor) {
      onCloseEditor();
    } else if (window.history.length > 1) {
      window.history.back();
    } else {
      window.location.href = '/';
    }
  };

  const title = model?.title || 'Diagrama Sin Título';
  const saving = syncStatus === 'saving';
  const saveBlocked = saveCapability ? !saveCapability.allowed : false;
  const saveUpToDate = !isDirty && !saving && !allowCleanApply;
  const saveDisabled = saveBlocked || saving || saveUpToDate;
  const saveChrome = saving
    ? { label: 'Guardando…', className: 'bg-pizarra text-lienzo cursor-not-allowed', title: 'Guardando cambios…' }
    : saveBlocked
      ? { label: 'Guardar', className: 'bg-pavo/40 text-lienzo cursor-not-allowed', title: saveCapability?.summary ?? 'Guardado no disponible' }
      : saveUpToDate
        ? { label: 'Guardado', className: 'bg-musgo text-lienzo cursor-not-allowed', title: 'Diagrama al día' }
        : { label: 'Guardar', className: 'bg-pavo text-lienzo hover:bg-pavo/80 cursor-pointer', title: 'Guardar cambios' };

  return (
    <header className="flex h-14 w-full items-center justify-between border-b border-carbon/15 bg-lienzo/95 px-4 backdrop-blur-md z-30 transition-colors">
      {/* Sección Izquierda: Identidad y Título */}
      <div className="flex items-center space-x-3 min-w-0">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-salvia/20 text-salvia font-serif font-bold text-base shadow-2xs shrink-0">
          M²
        </div>
        <div className="flex flex-col min-w-0">
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={title}
              onChange={(e) => onTitleChange(e.target.value)}
              className="font-serif font-bold text-sm text-carbon bg-transparent hover:bg-carbon/5 focus:bg-lienzo focus:outline-hidden focus:ring-1 focus:ring-salvia rounded px-1.5 py-0.5 transition-colors truncate max-w-[160px] sm:max-w-[240px]"
              placeholder="Nombre del Diagrama"
              title="Haz clic para renombrar el diagrama"
            />
            <span className="text-[10px] font-mono text-carbon/50 bg-carbon/5 px-1.5 py-0.5 rounded border border-carbon/10 hidden sm:inline truncate max-w-[120px]">
              {componentName || 'DiagramaCustom'}
            </span>
            {sandboxMode && (
              <span
                className="text-[10px] font-bold uppercase tracking-wider text-ocre bg-ocre/15 px-1.5 py-0.5 rounded border border-ocre/30"
                title="Sandbox en memoria: no escribe al corpus ni enlaza MDX hasta guardar desde el workbench clásico."
              >
                Sandbox
              </span>
            )}
            {(diagnostics.length > 0 || errorCount > 0) && (
              <button
                type="button"
                onClick={onOpenDiagnostics}
                className="text-[10px] font-bold text-granada bg-granada/10 px-1.5 py-0.5 rounded border border-granada/20 cursor-pointer"
                title={`${errorCount} errores, ${warningCount} avisos`}
              >
                {errorCount} err · {warningCount} warn
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Sección Central: Atajos, Vista Inicial y Previsualización de Dimensiones */}
      <div className="flex items-center space-x-1.5 bg-carbon/5 p-1 rounded-xl border border-carbon/10">
        {/* Undo / Redo */}
        <button
          type="button"
          onClick={onUndo}
          disabled={!canUndo}
          className="flex h-7 w-7 items-center justify-center rounded-lg text-carbon/70 hover:bg-carbon/10 hover:text-carbon disabled:opacity-30 disabled:hover:bg-transparent transition-all shadow-2xs cursor-pointer"
          title="Deshacer última acción (Ctrl+Z)"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
          </svg>
        </button>
        <button
          type="button"
          onClick={onRedo}
          disabled={!canRedo}
          className="flex h-7 w-7 items-center justify-center rounded-lg text-carbon/70 hover:bg-carbon/10 hover:text-carbon disabled:opacity-30 disabled:hover:bg-transparent transition-all shadow-2xs cursor-pointer"
          title="Rehacer acción (Ctrl+Y)"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 10H11a8 8 0 00-8 8v2m18-10l-6 6m6-6l-6-6" />
          </svg>
        </button>

        <div className="h-4 w-px bg-carbon/15 mx-0.5" />

        {/* Reajustar Vista Inicial */}
        <button
          type="button"
          onClick={onResetViewport}
          className="flex items-center space-x-1 px-2 py-1 text-xs font-medium text-carbon/80 hover:bg-carbon/10 rounded-lg transition-all shadow-2xs cursor-pointer"
          title="Centrar y restablecer la cámara del lienzo"
        >
          <svg className="w-3.5 h-3.5 text-salvia" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          <span className="hidden md:inline">Centrar</span>
        </button>

        <div className="h-4 w-px bg-carbon/15 mx-0.5 hidden sm:block" />

        {/* Modo de lienzo: editor o marcos de publicación */}
        <div className="hidden sm:flex items-center space-x-1 bg-carbon/5 p-0.5 rounded-lg border border-carbon/10">
          <button
            type="button"
            onClick={() => onSelectFrameMode('editor')}
            className={`px-2 py-0.5 text-[11px] font-bold rounded transition-all cursor-pointer ${
              frameMode === 'editor' ? 'bg-carbon text-lienzo' : 'text-carbon/60 hover:text-carbon'
            }`}
          >
            Editor
          </button>
          <button
            type="button"
            onClick={() => onSelectFrameMode('desktop')}
            className={`px-2 py-0.5 text-[11px] font-bold rounded transition-all cursor-pointer ${
              frameMode === 'desktop' ? 'bg-carbon text-lienzo' : 'text-carbon/60 hover:text-carbon'
            }`}
          >
            Escritorio
          </button>
          <button
            type="button"
            onClick={() => onSelectFrameMode('tablet')}
            className={`px-2 py-0.5 text-[11px] font-bold rounded transition-all cursor-pointer ${
              frameMode === 'tablet' ? 'bg-carbon text-lienzo' : 'text-carbon/60 hover:text-carbon'
            }`}
          >
            Tablet
          </button>
          <button
            type="button"
            onClick={() => onSelectFrameMode('mobile')}
            className={`px-2 py-0.5 text-[11px] font-bold rounded transition-all cursor-pointer ${
              frameMode === 'mobile' ? 'bg-carbon text-lienzo' : 'text-carbon/60 hover:text-carbon'
            }`}
          >
            Móvil
          </button>
        </div>
      </div>

      {/* Sección Derecha: Acciones, Diagnósticos, Tema y Cerrar */}
      <div className="flex items-center space-x-1.5">

        <button
          type="button"
          onClick={onOpenPresets}
          className="px-2.5 py-1.5 text-xs font-medium text-carbon/80 hover:bg-carbon/10 rounded-lg transition-all cursor-pointer hidden md:inline"
        >
          Plantillas
        </button>

        <button
          type="button"
          onClick={onOpenSettings}
          className="px-2 py-1.5 text-xs font-medium text-carbon/80 hover:bg-carbon/10 rounded-lg transition-all cursor-pointer"
        >
          Config
        </button>

        <button
          type="button"
          onClick={onOpenMdxLinks}
          className="px-2.5 py-1.5 text-xs font-medium text-salvia hover:bg-salvia/10 rounded-lg transition-all cursor-pointer hidden xl:inline"
        >
          MDX
        </button>

        {/* Diagnósticos */}
        <button
          type="button"
          onClick={onOpenDiagnostics}
          className={`flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-all cursor-pointer ${
            errorCount > 0
              ? 'border-granada/30 bg-granada/10 text-granada animate-pulse'
              : warningCount > 0
              ? 'border-ocre/30 bg-ocre/10 text-ocre'
              : 'border-salvia/30 bg-salvia/10 text-salvia'
          }`}
          title="Ver diagnósticos del diagrama"
        >
          <span className={`h-2 w-2 rounded-full ${errorCount > 0 ? 'bg-granada' : warningCount > 0 ? 'bg-ocre' : 'bg-salvia'}`} />
          <span className="hidden sm:inline">
            {errorCount > 0 ? `${errorCount} Err` : warningCount > 0 ? `${warningCount} Av` : 'Salud'}
          </span>
        </button>

        {/* Código TSX */}
        <button
          type="button"
          onClick={onOpenCode}
          className="flex items-center space-x-1 px-2.5 py-1.5 text-xs font-bold text-lienzo bg-salvia hover:bg-salvia/90 rounded-lg shadow-2xs transition-all cursor-pointer"
        >
          Código
        </button>

        {!sandboxMode && onSave && (
          <button
            type="button"
            onClick={onSave}
            disabled={saveDisabled}
            title={saveChrome.title}
            aria-label="Guardar diagrama"
            aria-busy={saving || undefined}
            className={`flex items-center space-x-1 px-2.5 py-1.5 text-xs font-bold rounded-lg shadow-2xs transition-all ${saveChrome.className}`}
          >
            {saveChrome.label}
          </button>
        )}

        {/* Botón Cambio de Tema (Papiro / Códice Noche) */}
        <button
          type="button"
          onClick={toggleTheme}
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-carbon/15 bg-carbon/5 text-carbon hover:bg-carbon/15 transition-all shadow-2xs cursor-pointer"
          title={isDark ? 'Cambiar a modo Día (Papiro)' : 'Cambiar a modo Noche (Códice)'}
        >
          {isDark ? <IconSun /> : <IconMoon />}
        </button>

        {/* Botón Cerrar Editor */}
        <button
          type="button"
          onClick={handleClose}
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-granada/30 bg-granada/10 text-granada hover:bg-granada/20 transition-all shadow-2xs cursor-pointer"
          title="Cerrar el editor de diagramas"
        >
          <IconClose />
        </button>
      </div>
    </header>
  );
};
