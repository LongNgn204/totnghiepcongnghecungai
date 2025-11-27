import React from 'react';

interface FormFieldProps {
  label?: string;
  hint?: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
  id?: string;
  className?: string;
}

const FormField: React.FC<FormFieldProps> = ({ label, hint, error, required, children, id, className = '' }) => {
  const describedBy: string[] = [];
  if (hint) describedBy.push(`${id}-hint`);
  if (error) describedBy.push(`${id}-error`);

  // Clone child to inject accessibility attributes if it's an input/select/textarea
  const childWithProps = React.isValidElement(children)
    ? React.cloneElement(children as React.ReactElement, {
        id,
        'aria-describedby': describedBy.length ? describedBy.join(' ') : undefined,
        'aria-invalid': !!error || undefined,
        className: `${(children as any).props?.className || ''} input`.trim(),
      })
    : children;

  return (
    <div className={`form-field ${className}`}>
      {label && (
        <label htmlFor={id} className="form-label">
          {label}
          {required && <span className="text-accent-red-600 ml-1">*</span>}
        </label>
      )}
      {childWithProps}
      {hint && !error && (
        <p id={`${id}-hint`} className="form-hint">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} className="form-error">
          {error}
        </p>
      )}
    </div>
  );
};

export default FormField;


