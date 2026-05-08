import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Button } from '../Button';
import { Modal, type ModalProps } from './Modal';

const meta = {
  title: 'Components/Modal',
  component: Modal,
  tags: ['autodocs'],
  args: {
    children: 'Архивные компоненты остаются доступными для миграций и совместимости.',
    isOpen: true,
    onClose: () => undefined,
    title: 'Архивировать компонент?',
    description: 'Документация останется доступной, но компонент исчезнет из новых рекомендаций.',
    size: 'md',
    closeOnBackdrop: true,
  },
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
  },
} satisfies Meta<typeof Modal>;

export default meta;
type Story = StoryObj<typeof meta>;

function ModalPlayground(args: ModalProps) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Открыть окно</Button>
      <Modal
        {...args}
        footer={
          <>
            <Button variant="secondary" onClick={() => setIsOpen(false)}>
                Отмена
            </Button>
            <Button variant="danger" onClick={() => setIsOpen(false)}>
                Архивировать
            </Button>
          </>
        }
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      >
        <p>Архивные компоненты остаются доступными для миграций и совместимости.</p>
      </Modal>
    </>
  );
}

export const Playground: Story = {
  render: (args) => <ModalPlayground {...args} />,
};
