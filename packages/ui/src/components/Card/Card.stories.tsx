import type { Meta, StoryObj } from '@storybook/react';
import { Button } from '../Button';
import { Card } from './Card';

const meta = {
  title: 'Components/Card',
  component: Card,
  tags: ['autodocs'],
  args: {
    title: 'Button',
    subtitle: 'Действия - 7 пропсов',
    children: 'Основная кнопка с загрузкой и опасным состоянием.',
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['outlined', 'elevated', 'interactive'],
    },
    padding: {
      control: 'select',
      options: ['compact', 'comfortable', 'spacious'],
    },
  },
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Elevated: Story = {
  args: {
    variant: 'elevated',
  },
};

export const WithActions: Story = {
  args: {
    actions: <Button variant="ghost">Открыть</Button>,
  },
};
