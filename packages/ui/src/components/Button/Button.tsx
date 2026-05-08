import type { ButtonHTMLAttributes, ReactNode } from 'react';
import type { ComponentMeta } from '../../types';
import { cx } from '../../utils';

export const buttonMeta: ComponentMeta = {
  name: 'Button',
  description:
    'Action component for primary flows, secondary actions, destructive operations, and low-emphasis controls.',
  category: 'Actions',
  tags: ['action', 'cta', 'loading', 'form'],
};

/**
 * Props for the Button component.
 */
export interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  /** Visual emphasis of the action. Use primary once per workflow section. */
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  /** Control height and horizontal padding. */
  size?: 'sm' | 'md' | 'lg';
  /** Shows a spinner and disables the button while an async action is running. */
  isLoading?: boolean;
  /** Expands the button to fill the width of its parent container. */
  fullWidth?: boolean;
  /** Button content. Prefer concise labels such as "Save changes". */
  children: ReactNode;
}

export function Button({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  fullWidth = false,
  disabled,
  children,
  className,
  type = 'button',
  ...rest
}: ButtonProps) {
  return (
    <button
      className={cx(
        'fack-button',
        `fack-button--${variant}`,
        `fack-button--${size}`,
        fullWidth && 'fack-button--full',
        className,
      )}
      disabled={disabled || isLoading}
      type={type}
      {...rest}
    >
      {isLoading ? <span aria-hidden="true" className="fack-button__spinner" /> : null}
      <span>{children}</span>
    </button>
  );
}

