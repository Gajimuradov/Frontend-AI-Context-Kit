import type { ComponentExample } from '../../types';

export const buttonExamples: ComponentExample[] = [
  {
    title: 'Основное действие',
    description: 'Primary хорошо работает там, где у пользователя есть один очевидный следующий шаг.',
    code: `<Button variant="primary">Сохранить изменения</Button>`,
  },
  {
    title: 'Состояние загрузки',
    description: 'Покажите загрузку, когда действие уже выполняется и повторный клик может навредить.',
    code: `<Button isLoading>Публикуем</Button>`,
  },
  {
    title: 'Опасное действие',
    description: 'Danger нужен для действий, после которых пользователю сложно вернуться назад.',
    code: `<Button variant="danger" size="sm">Удалить токен</Button>`,
  },
];
