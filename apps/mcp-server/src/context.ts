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
  const normalizedQuery = query.trim().toLowerCase();

  if (!normalizedQuery) {
    return 1;
  }

  const haystack = [
    component.name,
    component.description,
    component.category,
    ...component.tags,
    ...component.props.map((prop) => `${prop.name} ${prop.description} ${prop.type}`),
  ]
    .join(' ')
    .toLowerCase();

  if (component.name.toLowerCase() === normalizedQuery) {
    return 100;
  }

  if (component.name.toLowerCase().includes(normalizedQuery)) {
    return 80;
  }

  if (component.tags.some((tag) => tag.toLowerCase().includes(normalizedQuery))) {
    return 60;
  }

  return haystack.includes(normalizedQuery) ? 30 : 0;
}
