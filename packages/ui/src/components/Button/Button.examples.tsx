import type { ComponentExample } from '../../types';

export const buttonExamples: ComponentExample[] = [
  {
    title: 'Primary action',
    description: 'Use a primary button for the main action in a form or focused workflow.',
    code: `<Button variant="primary">Save changes</Button>`,
  },
  {
    title: 'Loading state',
    description: 'Set isLoading while an async mutation is pending so duplicate submits are blocked.',
    code: `<Button isLoading>Publishing</Button>`,
  },
  {
    title: 'Destructive action',
    description: 'Use the danger variant only for irreversible or high-risk actions.',
    code: `<Button variant="danger" size="sm">Delete token</Button>`,
  },
];

