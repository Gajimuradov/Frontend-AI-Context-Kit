import { existsSync, readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { frontendUsageRules } from '@frontend-ai-context-kit/prompt-rules';
import type { ComponentIndex } from './types';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const fallbackIndex: ComponentIndex = {
  generatedAt: new Date(0).toISOString(),
  source: {
    uiPackage: 'packages/ui',
    componentsRoot: 'packages/ui/src/components',
  },
  usageRules: [...frontendUsageRules],
  components: [],
};

const searchAliases: Record<string, string[]> = {
  form: ['forms', 'форма', 'формы', 'форму', 'форм', 'поле', 'поля'],
  forms: ['form', 'форма', 'формы', 'форму', 'форм', 'поле', 'поля'],
  dialog: ['modal', 'диалог', 'диалоги', 'оверлей', 'подтверждение'],
  modal: ['dialog', 'диалог', 'оверлей', 'подтверждение'],
  button: ['кнопка', 'действие', 'cta'],
  input: ['поле', 'текстовое поле', 'ввод', 'форма'],
  select: ['выбор', 'выпадающий список', 'форма'],
  card: ['карточка', 'поверхность', 'summary'],
  tabs: ['вкладки', 'навигация', 'панели'],
};

function expandSearchTerms(query: string) {
  const normalizedQuery = query.trim().toLowerCase();

  if (!normalizedQuery) {
    return [];
  }

  const tokens = normalizedQuery.split(/\s+/);
  const aliases = [
    ...(searchAliases[normalizedQuery] ?? []),
    ...tokens.flatMap((token) => searchAliases[token] ?? []),
  ];

  return Array.from(new Set([normalizedQuery, ...aliases]));
}

export function loadComponentIndex(indexPath = resolve(__dirname, '../data/component-index.json')) {
  if (!existsSync(indexPath)) {
    return fallbackIndex;
  }

  return JSON.parse(readFileSync(indexPath, 'utf8')) as ComponentIndex;
}

export function findComponent(index: ComponentIndex, componentName: string) {
  return index.components.find(
    (component) => component.name.toLowerCase() === componentName.toLowerCase(),
  );
}

export function summarizeComponent(component: ComponentIndex['components'][number]) {
  return {
    name: component.name,
    description: component.description,
    category: component.category,
    tags: component.tags,
    propsCount: component.props.length,
    examplesCount: component.examples.length,
    filePath: component.filePath,
    storyPath: component.storyPath,
  };
}

export function scoreComponent(component: ComponentIndex['components'][number], query: string) {
  const searchTerms = expandSearchTerms(query);

  if (searchTerms.length === 0) {
    return 1;
  }

  const componentName = component.name.toLowerCase();
  const haystack = [
    component.name,
    component.description,
    component.category,
    ...component.tags,
    ...component.props.map((prop) => `${prop.name} ${prop.description} ${prop.type}`),
  ]
    .join(' ')
    .toLowerCase();

  if (searchTerms.some((term) => componentName === term)) {
    return 100;
  }

  if (searchTerms.some((term) => componentName.includes(term))) {
    return 80;
  }

  if (
    component.tags.some((tag) =>
      searchTerms.some((term) => tag.toLowerCase().includes(term)),
    )
  ) {
    return 60;
  }

  return searchTerms.some((term) => haystack.includes(term)) ? 30 : 0;
}
