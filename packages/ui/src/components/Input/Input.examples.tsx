import type { ComponentExample } from '../../types';

export const inputExamples: ComponentExample[] = [
  {
    title: 'Basic field',
    description: 'Use label and description to explain what data the user should enter.',
    code: `<Input label="Project name" name="projectName" description="Shown in dashboards and docs." />`,
  },
  {
    title: 'Validation state',
    description: 'Pass error to mark the field invalid and replace helper text with feedback.',
    code: `<Input label="Repository URL" error="Enter a valid GitHub URL." />`,
  },
  {
    title: 'Full-width form row',
    description: 'Use fullWidth when the field sits in a responsive form layout.',
    code: `<Input fullWidth label="Package name" placeholder="@acme/ui" />`,
  },
];

