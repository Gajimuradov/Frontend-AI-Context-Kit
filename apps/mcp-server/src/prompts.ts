import { promptTemplates } from '@frontend-ai-context-kit/prompt-rules';
import type { IndexedComponent } from './types';

export const promptDefinitions = [
  {
    name: 'create_component_usage_example',
    description: 'Create a React usage example for a selected UI component.',
    arguments: ['componentName', 'useCase'],
  },
  {
    name: 'review_component_usage',
    description: 'Review a React snippet against UI library rules and component APIs.',
    arguments: ['componentName', 'code'],
  },
  {
    name: 'generate_form_with_ui_library',
    description: 'Generate a compact form using the UI library primitives.',
    arguments: ['fields', 'submitAction'],
  },
] as const;

export type PromptName = (typeof promptDefinitions)[number]['name'];

export function createPrompt(name: PromptName, component?: IndexedComponent, args: Record<string, string> = {}) {
  if (name === 'create_component_usage_example') {
    return `${promptTemplates.createComponentUsageExample}

Component: ${component?.name ?? args.componentName ?? 'Unknown'}
Use case: ${args.useCase ?? 'A realistic product workflow'}
Available props: ${component?.props.map((prop) => `${prop.name}: ${prop.type}`).join(', ') ?? 'Unknown'}
Examples:
${component?.examples.map((example) => `- ${example.title}: ${example.code}`).join('\n') ?? 'No examples found'}`;
  }

  if (name === 'review_component_usage') {
    return `${promptTemplates.reviewComponentUsage}

Component: ${component?.name ?? args.componentName ?? 'Unknown'}
Known API:
${component?.props.map((prop) => `- ${prop.name}${prop.required ? ' required' : ''}: ${prop.type}`).join('\n') ?? 'Unknown'}

Code to review:
${args.code ?? '<paste code here>'}`;
  }

  return `${promptTemplates.generateFormWithUiLibrary}

Fields: ${args.fields ?? 'name, status, owner'}
Submit action: ${args.submitAction ?? 'Save changes'}
Use existing components and follow the usage rules from ui://rules/frontend.`;
}

