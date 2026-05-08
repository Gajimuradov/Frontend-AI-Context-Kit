import type { Meta, StoryObj } from '@storybook/react';
import { Select } from './Select';

const options = [
  { label: 'Стабильный', value: 'stable' },
  { label: 'Экспериментальный', value: 'experimental' },
  { label: 'Устаревший', value: 'deprecated' },
];

const meta = {
  title: 'Components/Select',
  component: Select,
  tags: ['autodocs'],
  args: {
    label: 'Статус компонента',
    placeholder: 'Выберите статус',
    description: 'Используется документацией и AI-рекомендациями.',
    options,
  },
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
  },
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithError: Story = {
  args: {
    error: 'Выберите статус перед публикацией.',
  },
};
