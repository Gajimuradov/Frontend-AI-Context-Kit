import type { HTMLAttributes, ReactNode } from 'react';
import type { ComponentMeta } from '../../types';
import { cx } from '../../utils';

export const cardMeta: ComponentMeta = {
  name: 'Card',
  description:
    'Card собирает связанные данные в понятный блок: summary компонента, небольшой отчет, набор метаданных или карточку результата.',
  category: 'Поверхности',
  tags: ['поверхность', 'summary', 'layout', 'контент'],
};

/**
 * Пропсы компонента Card.
 */
export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  /** Заголовок карточки в header. */
  title?: string;
  /** Дополнительный текст под заголовком. */
  subtitle?: string;
  /** Зона действий в header, обычно кнопка или компактная ссылка. */
  actions?: ReactNode;
  /** Визуальный вариант контейнера. */
  variant?: 'outlined' | 'elevated' | 'interactive';
  /** Плотность внутренних отступов. */
  padding?: 'compact' | 'comfortable' | 'spacious';
  /** Основной контент карточки. */
  children: ReactNode;
}

export function Card({
  title,
  subtitle,
  actions,
  variant = 'outlined',
  padding = 'comfortable',
  children,
  className,
  ...rest
}: CardProps) {
  return (
    <article
      className={cx('fack-card', `fack-card--${variant}`, `fack-card--${padding}`, className)}
      {...rest}
    >
      {title || subtitle || actions ? (
        <header className="fack-card__header">
          <div>
            {title ? <h3 className="fack-card__title">{title}</h3> : null}
            {subtitle ? <p className="fack-card__subtitle">{subtitle}</p> : null}
          </div>
          {actions ? <div>{actions}</div> : null}
        </header>
      ) : null}
      <div>{children}</div>
    </article>
  );
}
