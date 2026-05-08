import { z } from 'zod';
import {
  findComponent,
  scoreComponent,
  summarizeComponent,
  type loadComponentIndex,
} from './context';
import { createPrompt, promptDefinitions, type PromptName } from './prompts';
import type { ComponentIndex, McpResourceResult, McpToolResult } from './types';

type LoadedIndex = ReturnType<typeof loadComponentIndex>;

const SearchComponentsInput = z.object({
  query: z.string().default(''),
  limit: z.number().int().positive().max(20).default(10),
});

const ComponentNameInput = z.object({
  componentName: z.string().min(1),
});

export function createContextKitServer(index: LoadedIndex) {
  const tools = [
    {
      name: 'search_components',
      description: 'Search UI components by name, description, tags, and prop API.',
      inputSchema: {
        type: 'object',
        properties: {
          query: { type: 'string' },
          limit: { type: 'number', minimum: 1, maximum: 20 },
        },
      },
    },
    {
      name: 'get_component_api',
      description: 'Return prop API metadata for a UI component.',
      inputSchema: {
        type: 'object',
        required: ['componentName'],
        properties: {
          componentName: { type: 'string' },
        },
      },
    },
    {
      name: 'get_component_examples',
      description: 'Return examples and Storybook path for a UI component.',
      inputSchema: {
        type: 'object',
        required: ['componentName'],
        properties: {
          componentName: { type: 'string' },
        },
      },
    },
    {
      name: 'get_usage_rules',
      description: 'Return frontend usage rules for AI-generated UI.',
      inputSchema: {
        type: 'object',
        properties: {},
      },
    },
  ];

  const resources = [
    {
      uri: 'ui://components',
      name: 'UI component catalog',
      description: 'All indexed UI components with summaries and metadata.',
      mimeType: 'application/json',
    },
    ...index.components.map((component) => ({
      uri: `ui://components/${component.name}`,
      name: `${component.name} API`,
      description: component.description,
      mimeType: 'application/json',
    })),
    {
      uri: 'ui://rules/frontend',
      name: 'Frontend usage rules',
      description: 'Rules that guide AI assistants when generating frontend UI.',
      mimeType: 'text/markdown',
    },
  ];

  function toToolResult(payload: unknown): McpToolResult {
    return {
      content: [{ type: 'text', text: JSON.stringify(payload, null, 2) }],
      structuredContent: payload,
    };
  }

  function callTool(name: string, input: unknown): McpToolResult {
    if (name === 'search_components') {
      const { query, limit } = SearchComponentsInput.parse(input ?? {});
      const matches = index.components
        .map((component) => ({ component, score: scoreComponent(component, query) }))
        .filter((match) => match.score > 0)
        .sort((a, b) => b.score - a.score || a.component.name.localeCompare(b.component.name))
        .slice(0, limit)
        .map((match) => summarizeComponent(match.component));

      return toToolResult({ query, matches });
    }

    if (name === 'get_component_api') {
      const { componentName } = ComponentNameInput.parse(input);
      const component = findComponent(index, componentName);

      return toToolResult(
        component
          ? {
              name: component.name,
              description: component.description,
              importPath: component.importPath,
              props: component.props,
            }
          : { error: `Component "${componentName}" was not found.` },
      );
    }

    if (name === 'get_component_examples') {
      const { componentName } = ComponentNameInput.parse(input);
      const component = findComponent(index, componentName);

      return toToolResult(
        component
          ? {
              name: component.name,
              storyPath: component.storyPath,
              examples: component.examples,
            }
          : { error: `Component "${componentName}" was not found.` },
      );
    }

    if (name === 'get_usage_rules') {
      return toToolResult({ rules: index.usageRules });
    }

    return toToolResult({ error: `Unknown tool "${name}".` });
  }

  function readResource(uri: string): McpResourceResult {
    if (uri === 'ui://components') {
      return {
        uri,
        mimeType: 'application/json',
        text: JSON.stringify(
          {
            generatedAt: index.generatedAt,
            components: index.components.map(summarizeComponent),
          },
          null,
          2,
        ),
      };
    }

    if (uri === 'ui://rules/frontend') {
      return {
        uri,
        mimeType: 'text/markdown',
        text: index.usageRules.map((rule) => `- ${rule}`).join('\n'),
      };
    }

    const componentMatch = uri.match(/^ui:\/\/components\/(.+)$/);

    if (componentMatch) {
      const component = findComponent(index, decodeURIComponent(componentMatch[1]));

      return {
        uri,
        mimeType: 'application/json',
        text: JSON.stringify(component ?? { error: `Resource "${uri}" was not found.` }, null, 2),
      };
    }

    return {
      uri,
      mimeType: 'application/json',
      text: JSON.stringify({ error: `Resource "${uri}" was not found.` }, null, 2),
    };
  }

  function getPrompt(name: PromptName, args: Record<string, string> = {}) {
    const component = args.componentName ? findComponent(index, args.componentName) : undefined;

    return {
      name,
      messages: [
        {
          role: 'user',
          content: {
            type: 'text',
            text: createPrompt(name, component, args),
          },
        },
      ],
    };
  }

  return {
    name: 'frontend-ai-context-kit',
    version: '0.1.0',
    tools,
    resources,
    prompts: promptDefinitions,
    callTool,
    readResource,
    getPrompt,
  };
}

export type ContextKitServer = ReturnType<typeof createContextKitServer>;
export type { ComponentIndex };

