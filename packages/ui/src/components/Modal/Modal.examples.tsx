import type { ComponentExample } from '../../types';

export const modalExamples: ComponentExample[] = [
  {
    title: 'Confirmation dialog',
    description: 'Use Modal for focused confirmation flows with explicit cancel and confirm actions.',
    code: `<Modal
  isOpen={isOpen}
  title="Archive component?"
  description="This keeps the component documented but hides it from new usage suggestions."
  onClose={() => setIsOpen(false)}
  footer={<Button variant="danger">Archive</Button>}
>
  <p>Archived components remain searchable for migration work.</p>
</Modal>`,
  },
  {
    title: 'Form modal',
    description: 'Pair Modal with Input and Select for short forms that do not need a full page.',
    code: `<Modal isOpen={isOpen} title="Create token" onClose={closeModal}>
  <Input fullWidth label="Token name" />
</Modal>`,
  },
];

