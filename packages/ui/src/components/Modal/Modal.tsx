import type { ReactNode } from 'react';
import type { ComponentMeta } from '../../types';
import { cx } from '../../utils';

export const modalMeta: ComponentMeta = {
  name: 'Modal',
  description:
    'Modal удерживает внимание на одном коротком решении: подтвердить действие, заполнить небольшую форму или посмотреть важные детали.',
  category: 'Оверлеи',
  tags: ['диалог', 'оверлей', 'подтверждение', 'доступность'],
};

/**
 * Пропсы компонента Modal.
 */
export interface ModalProps {
  /** Управляет отображением диалога. */
  isOpen: boolean;
  /** Заголовок диалога, который озвучивают assistive technologies. */
  title: string;
  /** Дополнительный текст под заголовком. */
  description?: string;
  /** Вызывается, когда пользователь закрывает модальное окно. */
  onClose: () => void;
  /** Основное содержимое диалога. Держите его коротким и сфокусированным. */
  children: ReactNode;
  /** Действия в футере, обычно отмена и подтверждение. */
  footer?: ReactNode;
  /** Максимальная ширина модального окна. */
  size?: 'sm' | 'md' | 'lg';
  /** Нужно ли закрывать окно по клику на backdrop. */
  closeOnBackdrop?: boolean;
}

export function Modal({
  isOpen,
  title,
  description,
  onClose,
  children,
  footer,
  size = 'md',
  closeOnBackdrop = true,
}: ModalProps) {
  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="fack-modal__backdrop"
      onClick={closeOnBackdrop ? onClose : undefined}
      role="presentation"
    >
      <section
        aria-labelledby="fack-modal-title"
        aria-modal="true"
        className={cx('fack-modal', `fack-modal--${size}`)}
        onClick={(event) => event.stopPropagation()}
        role="dialog"
      >
        <header className="fack-modal__header">
          <div>
            <h2 className="fack-modal__title" id="fack-modal-title">
              {title}
            </h2>
            {description ? <p className="fack-modal__description">{description}</p> : null}
          </div>
          <button aria-label="Close modal" className="fack-modal__close" onClick={onClose} type="button">
            x
          </button>
        </header>
        <div className="fack-modal__body">{children}</div>
        {footer ? <footer className="fack-modal__footer">{footer}</footer> : null}
      </section>
    </div>
  );
}
