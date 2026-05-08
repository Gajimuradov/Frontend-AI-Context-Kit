import type { SelectHTMLAttributes } from 'react';
import type { ComponentMeta } from '../../types';
import { cx } from '../../utils';

export const selectMeta: ComponentMeta = {
  name: 'Select',
  description:
    'Native select wrapper for compact choice fields with label, helper copy, and validation state.',
  category: 'Forms',
  tags: ['form', 'choice', 'dropdown', 'native'],
};

export interface SelectOption {
  /** User-facing option label. */
  label: string;
  /** Submitted option value. */
  value: string;
  /** Prevents the option from being selected. */
  disabled?: boolean;
}

/**
 * Props for the Select component.
 */
export interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'children' | 'size'> {
  /** Human-readable field label. */
  label?: string;
  /** Placeholder option shown before a value is selected. */
  placeholder?: string;
  /** Supporting text shown below the control when there is no error. */
  description?: string;
  /** Validation message. When present, the select is marked invalid. */
  error?: string;
  /** Available options. Keep labels short and scannable. */
  options: SelectOption[];
  /** Control height and text sizing. */
  size?: 'sm' | 'md' | 'lg';
  /** Expands the select wrapper and control to fill the parent width. */
  fullWidth?: boolean;
}

export function Select({
  label,
  placeholder,
  description,
  error,
  options,
  size = 'md',
  fullWidth = false,
  id,
  className,
  ...rest
}: SelectProps) {
  const selectId = id ?? rest.name;
  const descriptionId = description && selectId ? `${selectId}-description` : undefined;
  const errorId = error && selectId ? `${selectId}-error` : undefined;

  return (
    <label className={cx('fack-field', fullWidth && 'fack-field--full', className)}>
      {label ? <span className="fack-field__label">{label}</span> : null}
      <select
        aria-describedby={error ? errorId : descriptionId}
        aria-invalid={error ? true : undefined}
        className={cx(
          'fack-select__control',
          `fack-select__control--${size}`,
          error && 'fack-select__control--invalid',
          fullWidth && 'fack-select__control--full',
        )}
        id={selectId}
        {...rest}
      >
        {placeholder ? (
          <option value="" disabled>
            {placeholder}
          </option>
        ) : null}
        {options.map((option) => (
          <option disabled={option.disabled} key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
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

