import type { Meta, StoryObj } from '@storybook/react';
import { Select } from './Select';

const options = [
  { label: 'Stable', value: 'stable' },
  { label: 'Experimental', value: 'experimental' },
  { label: 'Deprecated', value: 'deprecated' },
];

const meta = {
  title: 'Components/Select',
  component: Select,
  tags: ['autodocs'],
  args: {
    label: 'Component status',
    placeholder: 'Choose status',
    description: 'Used by docs and AI usage suggestions.',
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
    error: 'Select a status before publishing.',
  },
};

