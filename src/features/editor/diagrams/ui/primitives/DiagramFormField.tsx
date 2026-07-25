import React, { ReactNode } from 'react';
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

export const diagramInputClassName = 'w-full border border-carbon/30 bg-lienzo px-2 py-1.5 text-xs text-carbon transition-colors duration-200 focus:outline-none focus:border-carbon focus:ring-1 focus:ring-carbon disabled:opacity-50 disabled:cursor-not-allowed';

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
  labelClassName = 'text-[10px] font-bold uppercase tracking-wider text-carbon/70',
}) => {
  return (
    <div className={`rounded p-1 border transition-colors ${formFieldContainerClass(Boolean(error), focused)} ${className}`}>
      {label && <label className={`block mb-1 ${labelClassName}`}>{label}</label>}
      {children}
      {help && !error && <span className="mt-1 block text-[10px] leading-relaxed text-carbon/50">{help}</span>}
      <InspectorFieldError message={error} focused={focused} />
    </div>
  );
};
