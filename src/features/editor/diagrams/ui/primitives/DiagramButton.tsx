import React from 'react';

export type DiagramButtonVariant = 'primary' | 'danger' | 'ghost';

export interface DiagramButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: DiagramButtonVariant;
  fullWidth?: boolean;
}

const variantClassNames: Record<DiagramButtonVariant, string> = {
  primary: 'min-h-11 bg-pavo px-3 text-[11px] font-bold uppercase tracking-wider text-lienzo hover:bg-pavo/90 transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-35',
  danger: 'min-h-11 border border-granada/30 bg-lienzo px-3 text-[11px] font-bold uppercase tracking-wider text-granada hover:bg-granada/5 transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-35',
  ghost: 'min-h-11 px-2 text-[10px] font-bold uppercase tracking-wider text-granada/80 hover:text-granada hover:bg-granada/5 transition-colors duration-200',
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
