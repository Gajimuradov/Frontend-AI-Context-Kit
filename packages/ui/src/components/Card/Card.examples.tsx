import type { ComponentExample } from '../../types';

export const cardExamples: ComponentExample[] = [
  {
    title: 'Component summary card',
    description: 'Use Card to group component metadata in documentation and search results.',
    code: `<Card title="Button" subtitle="Actions - 7 props">
  <p>Primary action component with loading and destructive states.</p>
</Card>`,
  },
  {
    title: 'Interactive card',
    description: 'Use the interactive variant only when the whole card is clickable.',
    code: `<Card variant="interactive" title="Input" onClick={openInputDocs}>
  <p>Text field wrapper with validation messaging.</p>
</Card>`,
  },
  {
    title: 'Card with actions',
    description: 'Use actions for contextual commands without crowding the main content.',
    code: `<Card title="Usage rules" actions={<Button variant="ghost">Copy</Button>}>
  <p>Prefer existing UI primitives before creating new controls.</p>
</Card>`,
  },
];
