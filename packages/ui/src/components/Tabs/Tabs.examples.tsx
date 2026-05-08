import type { ComponentExample } from '../../types';

export const tabsExamples: ComponentExample[] = [
  {
    title: 'Documentation tabs',
    description: 'Use Tabs when component docs need API, examples, and rules in one focused view.',
    code: `<Tabs
  items={[
    { id: 'api', label: 'API', content: <PropsTable /> },
    { id: 'examples', label: 'Examples', content: <Examples /> },
    { id: 'rules', label: 'Usage rules', content: <UsageRules /> }
  ]}
/>`,
  },
  {
    title: 'Controlled tab state',
    description: 'Use activeId and onChange when the selected tab is stored in URL or app state.',
    code: `<Tabs activeId={tab} onChange={setTab} items={items} ariaLabel="Component docs" />`,
  },
];

