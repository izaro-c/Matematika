import React, { useState } from 'react';
import { Link } from 'wouter';
import { isDarkMode, setTheme } from '@/lib/theme/theme';
import { routePath } from '@/lib/routes';
import { Logo } from '@/components/ui/Logo';
import { IconSun, IconMoon, IconClose } from '@/fixed-pages/editor/diagrams/ui/toolbar/WorkbenchIcons';
import {
  HeaderContainer,
  HeaderTitleInput,
  HeaderBadge,
  HeaderIconButton,
  HeaderActionButton,
  HeaderSaveState,
} from './EditorHeaderPrimitives';

export type EditorHeaderAvisosState = {
  errorCount: number;
  warningCount: number;
  onOpen: () => void;
  /** Accessible / tooltip label when healthy. */
  healthyLabel?: string;
};

export interface EditorWorkbenchHeaderProps {
  title: string;
  titlePlaceholder?: string;
  onTitleChange: (value: string) => void;
  titleDisabled?: boolean;
  fileBadge?: string;
  badges?: React.ReactNode;
  isDirty?: boolean;
  /** Explorer / nav toggle — omit when not applicable. */
  isSidebarOpen?: boolean;
  onToggleSidebar?: () => void;
  /** Inspector / details panel toggle — omit when aside is always on. */
  isInspectorOpen?: boolean;
  onToggleInspector?: () => void;
  center: React.ReactNode;
  actions?: React.ReactNode;
  avisos: EditorHeaderAvisosState;
  save: HeaderSaveState;
  onCloseEditor?: () => void;
  closeTitle?: string;
  /** When true, closing while dirty asks for confirmation. */
  confirmCloseWhenDirty?: boolean;
  closeConfirmMessage?: string;
}

function AvisosButton({ errorCount, warningCount, onOpen, healthyLabel = 'Avisos' }: EditorHeaderAvisosState) {
  const hasErrors = errorCount > 0;
  const hasWarnings = warningCount > 0;
  return (
    <button
      type="button"
      onClick={onOpen}
      className={`inline-flex h-8 items-center justify-center gap-1.5 rounded-lg border px-2.5 text-xs font-semibold tabular-nums transition-all cursor-pointer select-none ${
        hasErrors
          ? 'border-granada/30 bg-granada/10 text-granada animate-pulse'
          : hasWarnings
            ? 'border-ocre/30 bg-ocre/10 text-ocre'
            : 'border-canela/30 bg-canela/10 text-canela'
      }`}
      title={hasErrors || hasWarnings ? `${errorCount} errores, ${warningCount} avisos` : healthyLabel}
      aria-label={hasErrors || hasWarnings ? `${errorCount} errores, ${warningCount} avisos` : healthyLabel}
    >
      <span className={`h-2 w-2 rounded-full ${hasErrors ? 'bg-granada' : hasWarnings ? 'bg-ocre' : 'bg-canela'}`} />
      <span className="hidden sm:inline">
        {hasErrors ? `${errorCount} Err` : hasWarnings ? `${warningCount} Av` : healthyLabel}
      </span>
    </button>
  );
}

export const EditorWorkbenchHeader: React.FC<EditorWorkbenchHeaderProps> = ({
  title,
  titlePlaceholder = 'Sin título',
  onTitleChange,
  titleDisabled = false,
  fileBadge,
  badges,
  isDirty = false,
  isSidebarOpen,
  onToggleSidebar,
  isInspectorOpen,
  onToggleInspector,
  center,
  actions,
  avisos,
  save,
  onCloseEditor,
  closeTitle = 'Cerrar documento',
  confirmCloseWhenDirty = false,
  closeConfirmMessage = 'Hay cambios sin guardar. ¿Deseas cerrar de todos modos?',
}) => {
  const [isDark, setIsDark] = useState(isDarkMode);
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);

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

  const handleClose = () => {
    if (confirmCloseWhenDirty && isDirty) {
      setPendingAction(() => executeClose);
    } else {
      executeClose();
    }
  };

  const handleGoHome = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (confirmCloseWhenDirty && isDirty) {
      e.preventDefault();
      setPendingAction(() => () => {
        window.location.href = routePath('/');
      });
    }
  };

  return (
    <>
    <HeaderContainer>
      <div className="flex min-w-0 items-center justify-self-start gap-2">
        <Link
          href={routePath('/')}
          onClick={handleGoHome}
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-colors hover:bg-carbon/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-canela cursor-pointer"
          title="Ir al Inicio"
          aria-label="Ir al Inicio"
        >
          <Logo decorative className="h-8 w-8" />
        </Link>

        {onToggleSidebar && (
          <HeaderIconButton
            onClick={onToggleSidebar}
            active={isSidebarOpen}
            title={isSidebarOpen ? 'Ocultar explorador' : 'Mostrar explorador'}
            aria-label={isSidebarOpen ? 'Ocultar explorador' : 'Mostrar explorador'}
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h8m-8 6h16" />
            </svg>
          </HeaderIconButton>
        )}

        {onToggleInspector && (
          <HeaderIconButton
            onClick={onToggleInspector}
            active={isInspectorOpen}
            title={isInspectorOpen ? 'Ocultar detalles' : 'Mostrar detalles'}
            aria-label={isInspectorOpen ? 'Ocultar detalles' : 'Mostrar detalles'}
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
            </svg>
          </HeaderIconButton>
        )}

        <div className="flex min-w-0 items-center gap-2">
          <HeaderTitleInput
            value={title}
            onChange={e => onTitleChange(e.target.value)}
            disabled={titleDisabled}
            placeholder={titlePlaceholder}
          />
          {fileBadge ? <HeaderBadge variant="subtle">{fileBadge}</HeaderBadge> : null}
          <div className="inline-flex min-w-0 shrink-0 items-center gap-1.5">{badges}</div>
          <span
            className={`h-2 w-2 shrink-0 rounded-full bg-ocre ${isDirty ? 'animate-pulse opacity-100' : 'opacity-0'}`}
            title={isDirty ? 'Cambios no guardados' : undefined}
            aria-hidden={!isDirty}
          />
        </div>
      </div>

      <div className="flex items-center justify-self-center gap-1.5 sm:gap-2">{center}</div>

      <div className="flex items-center justify-self-end gap-1.5">
        {actions}
        <AvisosButton {...avisos} />
        <HeaderActionButton
          onClick={save.onSave}
          disabled={save.disabled || !save.onSave}
          variant={save.variant}
          title={save.title}
          aria-label={save.label}
          aria-busy={save.variant === 'saving' || undefined}
          className="px-2.5 sm:px-3"
        >
          {save.label}
        </HeaderActionButton>
        <HeaderIconButton onClick={toggleTheme} title={isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}>
          {isDark ? <IconSun className="h-4 w-4" /> : <IconMoon className="h-4 w-4" />}
        </HeaderIconButton>
        <HeaderIconButton onClick={handleClose} variant="danger" title={closeTitle} aria-label={closeTitle}>
          <IconClose className="h-4 w-4" />
        </HeaderIconButton>
      </div>
    </HeaderContainer>

      {pendingAction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-carbon/40 p-4" role="dialog" aria-modal="true" aria-labelledby="editor-header-close-title">
          <div className="w-full max-w-sm rounded-xl border border-carbon/15 bg-lienzo p-4 shadow-xl">
            <h2 id="editor-header-close-title" className="font-serif text-sm font-bold text-carbon">Cambios sin guardar</h2>
            <p className="mt-2 text-xs text-carbon/70">{closeConfirmMessage}</p>
            <div className="mt-4 flex justify-end gap-2">
              <HeaderActionButton onClick={() => setPendingAction(null)} variant="secondary">
                Permanecer
              </HeaderActionButton>
              <HeaderActionButton
                onClick={() => {
                  const action = pendingAction;
                  setPendingAction(null);
                  action();
                }}
                variant="pavo"
              >
                Salir sin guardar
              </HeaderActionButton>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default EditorWorkbenchHeader;
