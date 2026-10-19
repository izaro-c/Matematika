import React, { useId } from 'react';
import { cx } from './classNames';

/** Class for a bare input, select or textarea outside a Field. */
export const controlClassName = 'ed-control';

type ControlProps = {
  id?: string;
  className?: string;
  'aria-describedby'?: string;
  'aria-invalid'?: boolean | 'true' | 'false';
};

export interface FieldProps {
  label: React.ReactNode;
  /** A single input, select or textarea; Field links it to the label, help and error. */
  children: React.ReactElement<ControlProps>;
  /** Only when it says something the control does not already show. */
  help?: React.ReactNode;
  error?: React.ReactNode;
  className?: string;
}

export const Field: React.FC<FieldProps> = ({ label, children, help, error, className }) => {
  const generatedId = useId();
  const controlId = children.props.id ?? `${generatedId}-control`;
  const helpId = help && !error ? `${generatedId}-help` : undefined;
  const errorId = error ? `${generatedId}-error` : undefined;
  const describedBy = cx(children.props['aria-describedby'], helpId, errorId) || undefined;

  const control = React.cloneElement(children, {
    id: controlId,
    className: cx(controlClassName, children.props.className),
    'aria-describedby': describedBy,
    ...(error ? { 'aria-invalid': true } : {}),
  });

  return (
    <div className={cx('ed-field', className)}>
      <label className="ed-field__label" htmlFor={controlId}>{label}</label>
      {control}
      {helpId && <span id={helpId} className="ed-field__help">{help}</span>}
      {errorId && <span id={errorId} className="ed-field__error" role="alert">{error}</span>}
    </div>
  );
};
