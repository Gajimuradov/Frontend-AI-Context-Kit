import type { Meta, StoryObj } from '@storybook/react';
import { Input } from './Input';

const meta = {
  title: 'Components/Input',
  component: Input,
  tags: ['autodocs'],
  args: {
    label: 'Название проекта',
    description: 'Показывается в дашбордах и сгенерированной документации.',
    placeholder: 'Frontend AI Context Kit',
  },
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
  },
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithError: Story = {
  args: {
    error: 'Название проекта обязательно.',
  },
};

export const Large: Story = {
  args: {
    size: 'lg',
  },
};
