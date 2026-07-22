import React from 'react';

export type DiagramButtonVariant = 'primary' | 'danger' | 'ghost';

export interface DiagramButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: DiagramButtonVariant;
  fullWidth?: boolean;
}

const variantClassNames: Record<DiagramButtonVariant, string> = {
  primary: 'min-h-11 rounded bg-pavo px-2 text-xs font-bold text-lienzo hover:bg-pavo/90 disabled:cursor-not-allowed disabled:opacity-35',
  danger: 'min-h-11 rounded border border-granada/20 bg-lienzo px-2 text-xs font-bold text-granada hover:bg-granada/5',
  ghost: 'min-h-11 px-1 text-[10px] font-bold text-granada hover:underline',
};

export const DiagramButton: React.FC<DiagramButtonProps> = ({
  variant = 'primary',
  fullWidth = false,
  className = '',
  type = 'button',
  children,
  ...props
}) => (
  <button
    type={type}
    className={[variantClassNames[variant], fullWidth ? 'w-full' : '', className].filter(Boolean).join(' ')}
    {...props}
  >
    {children}
  </button>
);

export default DiagramButton;
