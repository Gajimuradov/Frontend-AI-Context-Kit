import type { ComponentExample } from '../../types';

export const tabsExamples: ComponentExample[] = [
  {
    title: 'Вкладки документации',
    description: 'API, примеры и правила удобно держать рядом, но не смешивать в одну длинную простыню.',
    code: `<Tabs
  items={[
    { id: 'api', label: 'API', content: <PropsTable /> },
    { id: 'examples', label: 'Примеры', content: <Examples /> },
    { id: 'rules', label: 'Правила', content: <UsageRules /> }
  ]}
/>`,
  },
  {
    title: 'Controlled-состояние',
    description: 'Controlled-режим нужен, когда выбранная вкладка должна жить в URL или общем состоянии приложения.',
    code: `<Tabs activeId={tab} onChange={setTab} items={items} ariaLabel="Документация компонента" />`,
  },
];
