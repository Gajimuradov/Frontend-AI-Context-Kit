import type { ComponentExample } from '../../types';

export const modalExamples: ComponentExample[] = [
  {
    title: 'Подтверждение действия',
    description: 'Когда действие может повлиять на данные, дайте пользователю спокойно подтвердить выбор.',
    code: `<Modal
  isOpen={isOpen}
  title="Архивировать компонент?"
  description="Компонент останется в документации, но исчезнет из новых рекомендаций."
  onClose={() => setIsOpen(false)}
  footer={<Button variant="danger">Архивировать</Button>}
>
  <p>Архивные компоненты остаются доступными для миграций.</p>
</Modal>`,
  },
  {
    title: 'Форма в модальном окне',
    description: 'Короткую форму можно оставить в модальном окне, если она не превращается в отдельный процесс.',
    code: `<Modal isOpen={isOpen} title="Создать токен" onClose={closeModal}>
  <Input fullWidth label="Название токена" />
</Modal>`,
  },
];
