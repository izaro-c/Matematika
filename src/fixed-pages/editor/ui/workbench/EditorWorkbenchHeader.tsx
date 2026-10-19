import React, { useState } from 'react';
import { Link } from 'wouter';
import { useI18n } from '@/i18n';
import { isDarkMode, setTheme } from '@/lib/theme/theme';
import { routePath } from '@/lib/routes';
import { Logo } from '@/components/ui/Logo';
import { Button, Modal } from '../primitives';
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
  /** Abre o cierra el panel inferior de avisos. */
  onOpen: () => void;
  /** Panel de avisos abierto (`aria-expanded`). */
  open?: boolean;
  /** Accessible / tooltip label when healthy. */
  healthyLabel?: string;
};

export interface EditorWorkbenchHeaderProps {
  title: string;
  titlePlaceholder?: string;
  onTitleChange: (value: string) => void;
  titleDisabled?: boolean;
  fileBadge?: string;
  /** Carpetas del documento, delante del título. */
  pathCrumbs?: string[];
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

function AvisosButton({ errorCount, warningCount, onOpen, open, healthyLabel }: EditorHeaderAvisosState) {
  const { t } = useI18n();
  const hasErrors = errorCount > 0;
  const hasWarnings = warningCount > 0;
  const healthy = healthyLabel ?? t('editor.nav.warnings');
  const summary = hasErrors || hasWarnings ? t('editor.common.errorsAndWarnings', { errors: errorCount, warnings: warningCount }) : healthy;
  return (
    <Button
      size="sm"
      variant={hasErrors ? 'danger' : 'secondary'}
      onClick={onOpen}
      aria-expanded={open}
      title={summary}
      aria-label={summary}
      className="tabular-nums"
    >
      <span className="hidden sm:inline">
        {hasErrors ? t('editor.common.errorsShort', { count: errorCount }) : hasWarnings ? t('editor.common.warningsShort', { count: warningCount }) : healthy}
      </span>
      <span className="sm:hidden" aria-hidden="true">{hasErrors ? errorCount : hasWarnings ? warningCount : '✓'}</span>
    </Button>
  );
}

export const EditorWorkbenchHeader: React.FC<EditorWorkbenchHeaderProps> = ({
  title,
  titlePlaceholder,
  onTitleChange,
  titleDisabled = false,
  fileBadge,
  pathCrumbs = [],
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
  closeTitle,
  confirmCloseWhenDirty = false,
  closeConfirmMessage,
}) => {
  const { t } = useI18n();
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
          title={t('editor.nav.goHome')}
          aria-label={t('editor.nav.goHome')}
        >
          <Logo decorative className="h-8 w-8" />
        </Link>

        {onToggleSidebar && (
          <HeaderIconButton
            onClick={onToggleSidebar}
            active={isSidebarOpen}
            title={isSidebarOpen ? t('editor.nav.hideExplorer') : t('editor.nav.showExplorer')}
            aria-label={isSidebarOpen ? t('editor.nav.hideExplorer') : t('editor.nav.showExplorer')}
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
            title={isInspectorOpen ? t('editor.nav.hideDetails') : t('editor.nav.showDetails')}
            aria-label={isInspectorOpen ? t('editor.nav.hideDetails') : t('editor.nav.showDetails')}
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
            </svg>
          </HeaderIconButton>
        )}

        <div className="flex min-w-0 items-center gap-2">
          {pathCrumbs.length > 0 && (
            <nav aria-label={t('editor.nav.documentPath')} className="hidden min-w-0 shrink 2xl:block">
              <ol className="flex min-w-0 items-center gap-1 font-serif text-xs italic text-carbon/55">
                {pathCrumbs.map((crumb, index) => (
                  <li key={`${index}-${crumb}`} className="flex min-w-0 items-center gap-1">
                    {index > 0 && <span aria-hidden="true" className="text-carbon/30">/</span>}
                    <span className="truncate">{crumb}</span>
                  </li>
                ))}
                <li aria-hidden="true" className="text-carbon/30">›</li>
              </ol>
            </nav>
          )}
          <HeaderTitleInput
            value={title}
            onChange={e => onTitleChange(e.target.value)}
            disabled={titleDisabled}
            placeholder={titlePlaceholder ?? t('editor.mdx.untitledDocument')}
          />
          {fileBadge ? <HeaderBadge variant="subtle">{fileBadge}</HeaderBadge> : null}
          <div className="inline-flex min-w-0 shrink-0 items-center gap-1.5">{badges}</div>
          <span
            className={`h-2 w-2 shrink-0 rounded-full bg-ocre ${isDirty ? 'animate-pulse opacity-100' : 'opacity-0'}`}
            title={isDirty ? t('editor.save.unsavedChanges') : undefined}
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
        <HeaderIconButton onClick={toggleTheme} title={isDark ? t('editor.nav.lightMode') : t('editor.nav.darkMode')}>
          {isDark ? <IconSun className="h-4 w-4" /> : <IconMoon className="h-4 w-4" />}
        </HeaderIconButton>
        <HeaderIconButton onClick={handleClose} variant="danger" title={closeTitle ?? t('editor.nav.closeDocument')} aria-label={closeTitle ?? t('editor.nav.closeDocument')}>
          <IconClose className="h-4 w-4" />
        </HeaderIconButton>
      </div>
    </HeaderContainer>

      <Modal
        open={Boolean(pendingAction)}
        onClose={() => setPendingAction(null)}
        title={t('editor.save.unsavedChanges')}
        footer={
          <>
            <Button onClick={() => setPendingAction(null)}>{t('editor.save.stay')}</Button>
            <Button
              variant="danger"
              onClick={() => {
                const action = pendingAction;
                setPendingAction(null);
                action?.();
              }}
            >
              {t('editor.save.exitWithoutSaving')}
            </Button>
          </>
        }
      >
        <p>{closeConfirmMessage ?? t('editor.save.unsavedCloseConfirm')}</p>
      </Modal>
    </>
  );
};

export default EditorWorkbenchHeader;
