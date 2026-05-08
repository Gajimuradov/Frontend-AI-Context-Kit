import type { ComponentExample } from '../../types';

export const selectExamples: ComponentExample[] = [
  {
    title: 'Basic select',
    description: 'Use Select for short lists where native keyboard and mobile behavior is enough.',
    code: `<Select
  label="Component status"
  placeholder="Choose status"
  options={[
    { label: 'Stable', value: 'stable' },
    { label: 'Experimental', value: 'experimental' }
  ]}
/>`,
  },
  {
    title: 'Validation state',
    description: 'Pass error to make the invalid state explicit and accessible.',
    code: `<Select label="Owner team" error="Select a team before publishing." options={teams} />`,
  },
];

