import React from 'react';

export const diagramControlClassName = 'mt-1 min-h-11 w-full rounded border border-carbon/15 bg-lienzo px-2 text-xs';

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
