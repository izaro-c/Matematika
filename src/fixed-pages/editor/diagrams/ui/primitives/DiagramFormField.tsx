import React, { ReactNode } from 'react';
import { controlClassName } from '@/fixed-pages/editor/ui/primitives';
import { InspectorFieldError } from '../inspector/InspectorFieldError';

export interface DiagramFormFieldProps {
  label?: string | ReactNode;
  help?: string | ReactNode;
  error?: string;
  focused?: boolean;
  children: ReactNode;
  className?: string;
  labelClassName?: string;
}

export const diagramInputClassName = controlClassName;

export function formFieldContainerClass(hasError: boolean, focused: boolean): string {
  if (!hasError) return 'border-transparent';
  return focused
    ? 'border-granada/50 bg-granada/5 ring-1 ring-granada/20'
    : 'border-granada/20 bg-granada/5';
}

export const DiagramFormField: React.FC<DiagramFormFieldProps> = ({
  label,
  help,
  error,
  focused = false,
  children,
  className = '',
  labelClassName = 'ed-field__label',
}) => {
  return (
    <div className={`rounded p-1 border transition-colors ${formFieldContainerClass(Boolean(error), focused)} ${className}`}>
      {label && <label className={`block mb-1 ${labelClassName}`}>{label}</label>}
      {children}
      {help && !error && <span className="ed-field__help mt-1 block">{help}</span>}
      <InspectorFieldError message={error} focused={focused} />
    </div>
  );
};
