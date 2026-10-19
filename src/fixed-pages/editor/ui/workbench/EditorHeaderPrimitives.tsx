import React from 'react';
import { Button, IconButton } from '../primitives';
import { cx } from '../primitives/classNames';
export { UiLanguageSwitch, type UiLanguageSwitchProps } from './UiLanguageSwitch';
export { DocumentVersions, type DocumentVersionsProps } from './DocumentVersions';

export const HeaderContainer: React.FC<React.HTMLAttributes<HTMLElement>> = ({
  className = '',
  children,
  ...props
}) => (
  <header
    className={`ed-header grid h-14 w-full shrink-0 grid-cols-[minmax(0,1fr)_auto_minmax(max-content,1fr)] items-center border-b border-carbon/15 bg-lienzo/95 px-3 sm:px-4 backdrop-blur-md z-30 transition-colors ${className}`}
    {...props}
  >
    {children}
  </header>
);

export const HeaderTitleInput: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = ({
  className,
  ...props
}) => (
  <input
    type="text"
    className={cx('ed-title-input w-28 xl:w-40 2xl:w-52 max-w-[220px] min-w-[70px]', className)}
    {...props}
  />
);

export const HeaderBadge: React.FC<{
  variant?: 'subtle' | 'canela' | 'ocre' | 'musgo' | 'granada';
  className?: string;
  children: React.ReactNode;
  title?: string;
}> = ({ variant = 'subtle', className, children, title }) => (
  <span title={title} className={cx('ed-badge', variant !== 'subtle' && `ed-badge--${variant}`, className)}>
    {children}
  </span>
);

export const HeaderPillContainer: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className,
}) => (
  <div className={cx('inline-flex items-center gap-1', className)}>
    {children}
  </div>
);

export const HeaderPillButton: React.FC<{
  active?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
  title?: string;
  className?: string;
  disabled?: boolean;
}> = ({ active, onClick, children, title, className, disabled }) => (
  <Button
    variant="quiet"
    size="sm"
    onClick={onClick}
    disabled={disabled}
    title={title}
    aria-pressed={active ?? false}
    className={className}
  >
    {children}
  </Button>
);

export const HeaderIconButton: React.FC<{
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  children: React.ReactNode;
  title?: string;
  active?: boolean;
  variant?: 'default' | 'danger';
  className?: string;
  'aria-label'?: string;
}> = ({ onClick, children, title, active, variant = 'default', className, 'aria-label': ariaLabel }) => (
  <IconButton
    label={ariaLabel ?? title ?? ''}
    title={title}
    tone={variant === 'danger' ? 'danger' : 'neutral'}
    aria-pressed={active}
    onClick={onClick}
    className={className}
  >
    {children}
  </IconButton>
);

export type HeaderSaveState = {
  label: string;
  variant: 'pavo' | 'saved' | 'saving' | 'secondary';
  title: string;
  disabled: boolean;
  onSave?: () => void;
};

export const HeaderActionButton: React.FC<{
  onClick?: () => void;
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'saved' | 'saving' | 'pavo' | 'canela';
  disabled?: boolean;
  title?: string;
  className?: string;
  'aria-label'?: string;
  'aria-busy'?: boolean;
}> = ({ onClick, children, variant = 'secondary', disabled, title, className, 'aria-label': ariaLabel, 'aria-busy': ariaBusy }) => (
  <Button
    size="sm"
    variant={variant === 'secondary' || variant === 'saving' ? 'secondary' : 'primary'}
    onClick={onClick}
    disabled={disabled}
    title={title}
    aria-label={ariaLabel}
    aria-busy={ariaBusy}
    className={className}
  >
    {children}
  </Button>
);
