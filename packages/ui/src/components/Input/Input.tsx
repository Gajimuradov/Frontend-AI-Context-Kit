import type { InputHTMLAttributes } from 'react';
import type { ComponentMeta } from '../../types';
import { cx } from '../../utils';

export const inputMeta: ComponentMeta = {
  name: 'Input',
  description:
    'Text input wrapper with label, description, validation message, and consistent sizing.',
  category: 'Forms',
  tags: ['form', 'text-field', 'validation', 'a11y'],
};

/**
 * Props for the Input component.
 */
export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  /** Human-readable field label. It is visually associated with the input. */
  label?: string;
  /** Supporting copy shown below the control when there is no error. */
  description?: string;
  /** Validation message. When present, the input is marked invalid. */
  error?: string;
  /** Control height and text sizing. */
  size?: 'sm' | 'md' | 'lg';
  /** Expands the input wrapper and control to fill the parent width. */
  fullWidth?: boolean;
}

export function Input({
  label,
  description,
  error,
  size = 'md',
  fullWidth = false,
  id,
  className,
  ...rest
}: InputProps) {
  const inputId = id ?? rest.name;
  const descriptionId = description && inputId ? `${inputId}-description` : undefined;
  const errorId = error && inputId ? `${inputId}-error` : undefined;

  return (
    <label className={cx('fack-field', fullWidth && 'fack-field--full', className)}>
      {label ? <span className="fack-field__label">{label}</span> : null}
      <input
        aria-describedby={error ? errorId : descriptionId}
        aria-invalid={error ? true : undefined}
        className={cx(
          'fack-input__control',
          `fack-input__control--${size}`,
          error && 'fack-input__control--invalid',
          fullWidth && 'fack-input__control--full',
        )}
        id={inputId}
        {...rest}
      />
      {error ? (
        <span className="fack-field__error" id={errorId}>
          {error}
        </span>
      ) : description ? (
        <span className="fack-field__description" id={descriptionId}>
          {description}
        </span>
      ) : null}
    </label>
  );
}

