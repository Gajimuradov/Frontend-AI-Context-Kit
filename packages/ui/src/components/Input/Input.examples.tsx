import type { ComponentExample } from '../../types';

export const inputExamples: ComponentExample[] = [
  {
    title: 'Базовое поле',
    description: 'Подпись и подсказка снимают лишние вопросы еще до того, как пользователь начнет ввод.',
    code: `<Input label="Название проекта" name="projectName" description="Показывается в дашбордах и документации." />`,
  },
  {
    title: 'Состояние ошибки',
    description: 'Сообщение ошибки должно объяснять, что исправить, а не просто подсвечивать поле.',
    code: `<Input label="URL репозитория" error="Введите корректный GitHub URL." />`,
  },
  {
    title: 'Поле на всю ширину',
    description: 'FullWidth помогает полю аккуратно лечь в форму, где важна ровная сетка.',
    code: `<Input fullWidth label="Название пакета" placeholder="@acme/ui" />`,
  },
];
