import type { SelectHTMLAttributes } from 'react';
import type { ComponentMeta } from '../../types';
import { cx } from '../../utils';

export const selectMeta: ComponentMeta = {
  name: 'Select',
  description:
    'Select подходит для короткого выбора из заранее известных вариантов и сохраняет привычное нативное поведение.',
  category: 'Формы',
  tags: ['форма', 'выбор', 'выпадающий список', 'native'],
};

export interface SelectOption {
  /** Видимая подпись опции. */
  label: string;
  /** Значение опции, которое отправляется в форму. */
  value: string;
  /** Запрещает выбор опции. */
  disabled?: boolean;
}

/**
 * Пропсы компонента Select.
 */
export interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'children' | 'size'> {
  /** Видимая подпись поля. */
  label?: string;
  /** Placeholder-опция до выбора значения. */
  placeholder?: string;
  /** Подсказка под контролом, если ошибки нет. */
  description?: string;
  /** Сообщение валидации. При наличии select помечается как невалидный. */
  error?: string;
  /** Доступные опции. Делайте подписи короткими и легко сканируемыми. */
  options: SelectOption[];
  /** Высота контрола и размер текста. */
  size?: 'sm' | 'md' | 'lg';
  /** Растягивает обертку и control на всю ширину родителя. */
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
