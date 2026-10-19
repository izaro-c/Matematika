import React from 'react';
import { Field, controlClassName } from '@/fixed-pages/editor/ui/primitives';

export const diagramControlClassName = controlClassName;

export interface DiagramFieldProps {
  label: string;
  children: React.ReactElement<{ className?: string }>;
  className?: string;
}

export const DiagramField: React.FC<DiagramFieldProps> = ({ label, children, className }) => (
  <Field label={label} className={className}>{children}</Field>
);

export default DiagramField;
