import React from 'react';

export const diagramControlClassName = 'mt-1 min-h-11 w-full rounded-md border border-carbon/20 bg-lienzo px-2 py-1.5 text-xs shadow-inner transition-all duration-200 focus:border-pavo focus:outline-none focus:ring-2 focus:ring-pavo/50';

export interface DiagramFieldProps {
  label: string;
  children: React.ReactElement<{ className?: string }>;
  className?: string;
}

export const DiagramField: React.FC<DiagramFieldProps> = ({ label, children, className = '' }) => {
  const control = React.cloneElement(children, {
    className: [diagramControlClassName, children.props.className, className].filter(Boolean).join(' '),
  });

  return (
    <label className="block text-[10px] font-bold text-carbon/65">
      {label}
      {control}
    </label>
  );
};

export default DiagramField;
