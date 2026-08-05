import React from 'react';

interface InspectorFieldErrorProps {
  message?: string;
  focused?: boolean;
}


export const InspectorFieldError: React.FC<InspectorFieldErrorProps> = ({ message, focused = false }) => {
  if (!message) return null;
  return (
    <div className="mt-1 flex items-start gap-1">
      <svg className={`mt-[2px] h-3 w-3 shrink-0 ${focused ? 'text-granada' : 'text-granada/80'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
      <p
        className={`text-[10px] leading-snug ${focused ? 'font-bold text-granada' : 'text-granada'}`}
        role="alert"
      >
        {message}
      </p>
    </div>
  );
};
