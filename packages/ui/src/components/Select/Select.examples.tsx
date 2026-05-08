import type { ComponentExample } from '../../types';

export const selectExamples: ComponentExample[] = [
  {
    title: 'Базовый выбор',
    description: 'Если вариантов немного и они понятны без поиска, нативный select будет самым простым решением.',
    code: `<Select
  label="Статус компонента"
  placeholder="Выберите статус"
  options={[
    { label: 'Стабильный', value: 'stable' },
    { label: 'Экспериментальный', value: 'experimental' }
  ]}
/>`,
  },
  {
    title: 'Состояние ошибки',
    description: 'Ошибка должна подсказать, какой выбор нужен, а не просто остановить пользователя.',
    code: `<Select label="Команда-владелец" error="Выберите команду перед публикацией." options={teams} />`,
  },
];
