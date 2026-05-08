import type { ReactNode } from 'react';
import type { ComponentMeta } from '../../types';
import { cx } from '../../utils';

export const modalMeta: ComponentMeta = {
  name: 'Modal',
  description:
    'Dialog surface for focused decisions, short forms, confirmations, and contextual details.',
  category: 'Overlays',
  tags: ['dialog', 'overlay', 'confirmation', 'a11y'],
};

/**
 * Props for the Modal component.
 */
export interface ModalProps {
  /** Controls whether the dialog is rendered. */
  isOpen: boolean;
  /** Dialog title announced by assistive technologies. */
  title: string;
  /** Optional supporting text shown under the title. */
  description?: string;
  /** Called when the user asks to close the modal. */
  onClose: () => void;
  /** Dialog body content. Keep it focused and short. */
  children: ReactNode;
  /** Optional footer actions, usually cancel and confirm buttons. */
  footer?: ReactNode;
  /** Maximum modal width. */
  size?: 'sm' | 'md' | 'lg';
  /** Whether clicking the backdrop should call onClose. */
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

