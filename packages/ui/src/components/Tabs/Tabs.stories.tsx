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
        content: 'Пропсы, значения по умолчанию и ограничения выбранного компонента.',
      },
      {
        id: 'examples',
        label: 'Примеры',
        content: 'Готовые примеры из Storybook и ручной документации.',
      },
      {
        id: 'rules',
        label: 'Правила',
        content: 'Ограничения для AI, которые сохраняют консистентность UI.',
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
      { id: 'overview', label: 'Обзор', content: 'Краткое описание компонента.' },
      { id: 'api', label: 'API', content: 'Пропсы и типы.' },
      { id: 'migration', label: 'Миграция', content: 'Гайд по миграции.', disabled: true },
    ],
  },
};
