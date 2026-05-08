import type { HTMLAttributes, ReactNode } from 'react';
import type { ComponentMeta } from '../../types';
import { cx } from '../../utils';

export const cardMeta: ComponentMeta = {
  name: 'Card',
  description:
    'Contained surface for grouped content, component summaries, metadata, and small dashboards.',
  category: 'Surfaces',
  tags: ['surface', 'summary', 'layout', 'content'],
};

/**
 * Props for the Card component.
 */
export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  /** Optional card title rendered in the header. */
  title?: string;
  /** Optional supporting text below the title. */
  subtitle?: string;
  /** Header action area, typically a button or compact link. */
  actions?: ReactNode;
  /** Visual treatment of the card container. */
  variant?: 'outlined' | 'elevated' | 'interactive';
  /** Inner spacing density. */
  padding?: 'compact' | 'comfortable' | 'spacious';
  /** Main card content. */
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

