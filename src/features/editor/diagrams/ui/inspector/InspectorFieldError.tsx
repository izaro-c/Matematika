import React from 'react';

interface InspectorFieldErrorProps {
  message?: string;
  focused?: boolean;
}

export function inspectorFieldClass(hasError: boolean, focused: boolean): string {
  if (!hasError) return '';
  return focused
    ? 'border-granada bg-granada/10 ring-1 ring-granada/30'
    : 'border-granada/35 bg-granada/5';
}

export const InspectorFieldError: React.FC<InspectorFieldErrorProps> = ({ message, focused = false }) => {
  if (!message) return null;
  return (
    <p
      className={`mt-1 text-[10px] leading-snug ${focused ? 'font-bold text-granada' : 'text-granada'}`}
      role="alert"
    >
      {message}
    </p>
  );
};
