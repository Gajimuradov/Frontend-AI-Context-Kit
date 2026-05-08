import type { ComponentExample } from '../../types';

export const cardExamples: ComponentExample[] = [
  {
    title: 'Карточка компонента',
    description: 'Карточка помогает быстро понять, что это за компонент и зачем он нужен.',
    code: `<Card title="Button" subtitle="Действия - 7 пропсов">
  <p>Основная кнопка с загрузкой и опасным состоянием.</p>
</Card>`,
  },
  {
    title: 'Интерактивная карточка',
    description: 'Interactive подходит, когда вся карточка ведет к одному понятному действию.',
    code: `<Card variant="interactive" title="Input" onClick={openInputDocs}>
  <p>Поле ввода с сообщением валидации.</p>
</Card>`,
  },
  {
    title: 'Карточка с действиями',
    description: 'Actions держат вторичные команды рядом, но не спорят с основным содержанием.',
    code: `<Card title="Правила использования" actions={<Button variant="ghost">Скопировать</Button>}>
  <p>Сначала используйте существующие UI-примитивы.</p>
</Card>`,
  },
];
