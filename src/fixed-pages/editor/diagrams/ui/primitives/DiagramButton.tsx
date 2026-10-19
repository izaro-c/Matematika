import React from 'react';
import { Button, type ButtonVariant } from '@/fixed-pages/editor/ui/primitives';

export type DiagramButtonVariant = 'primary' | 'danger' | 'warning' | 'success' | 'ghost';

export interface DiagramButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: DiagramButtonVariant;
  fullWidth?: boolean;
}

/** Legacy variants on top of the shared Button (one printed style; tone only for danger). */
const buttonVariant: Record<DiagramButtonVariant, ButtonVariant> = {
  primary: 'primary',
  success: 'primary',
  warning: 'primary',
  danger: 'danger',
  ghost: 'quiet',
};

export const DiagramButton: React.FC<DiagramButtonProps> = ({ variant = 'primary', ...props }) => (
  <Button variant={buttonVariant[variant]} {...props} />
);

export default DiagramButton;
