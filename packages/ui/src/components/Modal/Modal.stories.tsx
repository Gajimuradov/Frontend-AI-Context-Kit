import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Button } from '../Button';
import { Modal, type ModalProps } from './Modal';

const meta = {
  title: 'Components/Modal',
  component: Modal,
  tags: ['autodocs'],
  args: {
    children: 'Archived components remain searchable for migration and compatibility work.',
    isOpen: true,
    onClose: () => undefined,
    title: 'Archive component?',
    description: 'This keeps documentation available while hiding it from new usage suggestions.',
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
      <Button onClick={() => setIsOpen(true)}>Open modal</Button>
      <Modal
        {...args}
        footer={
          <>
            <Button variant="secondary" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={() => setIsOpen(false)}>
              Archive
            </Button>
          </>
        }
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      >
        <p>Archived components remain searchable for migration and compatibility work.</p>
      </Modal>
    </>
  );
}

export const Playground: Story = {
  render: (args) => <ModalPlayground {...args} />,
};
