import type { InputHTMLAttributes } from 'react';
import type { ComponentMeta } from '../../types';
import { cx } from '../../utils';

export const inputMeta: ComponentMeta = {
  name: 'Input',
  description:
    'Input делает текстовое поле понятным: рядом есть подпись, подсказка и место для ошибки, если пользователь ввел что-то не так.',
  category: 'Формы',
  tags: ['форма', 'текстовое поле', 'валидация', 'доступность'],
};

/**
 * Пропсы компонента Input.
 */
export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  /** Видимая подпись поля. Она визуально связана с input. */
  label?: string;
  /** Подсказка под контролом, если ошибки нет. */
  description?: string;
  /** Сообщение валидации. При наличии поле помечается как невалидное. */
  error?: string;
  /** Высота контрола и размер текста. */
  size?: 'sm' | 'md' | 'lg';
  /** Растягивает обертку и control на всю ширину родителя. */
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
