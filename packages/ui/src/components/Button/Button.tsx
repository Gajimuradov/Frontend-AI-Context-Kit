import type { ButtonHTMLAttributes, ReactNode } from 'react';
import type { ComponentMeta } from '../../types';
import { cx } from '../../utils';

export const buttonMeta: ComponentMeta = {
  name: 'Button',
  description:
    'Кнопка помогает пользователю сделать следующий шаг: сохранить форму, запустить действие, подтвердить рискованную операцию или выбрать спокойный вторичный сценарий.',
  category: 'Действия',
  tags: ['действие', 'cta', 'загрузка', 'форма'],
};

/**
 * Пропсы компонента Button.
 */
export interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  /** Визуальный акцент действия. Используйте primary только для главного действия в секции. */
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  /** Высота контрола и горизонтальные отступы. */
  size?: 'sm' | 'md' | 'lg';
  /** Показывает спиннер и блокирует кнопку на время асинхронного действия. */
  isLoading?: boolean;
  /** Растягивает кнопку на всю ширину родительского контейнера. */
  fullWidth?: boolean;
  /** Содержимое кнопки. Используйте короткие подписи вроде "Сохранить". */
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
