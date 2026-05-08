import type { Meta, StoryObj } from '@storybook/react';
import { Tabs } from './Tabs';

const meta = {
  title: 'Components/Tabs',
  component: Tabs,
  tags: ['autodocs'],
  args: {
    items: [
      {
        id: 'api',
        label: 'API',
        content: 'Props, defaults, and usage constraints for the selected component.',
      },
      {
        id: 'examples',
        label: 'Examples',
        content: 'Copy-ready examples from Storybook and hand-authored documentation.',
      },
      {
        id: 'rules',
        label: 'Rules',
        content: 'AI-facing constraints that keep generated UI consistent.',
      },
    ],
  },
} satisfies Meta<typeof Tabs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithDisabledTab: Story = {
  args: {
    items: [
      { id: 'overview', label: 'Overview', content: 'Component summary.' },
      { id: 'api', label: 'API', content: 'Props and types.' },
      { id: 'migration', label: 'Migration', content: 'Migration guide.', disabled: true },
    ],
  },
};

