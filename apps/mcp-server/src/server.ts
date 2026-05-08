import { loadComponentIndex } from './context';
import { createContextKitServer } from './mcpAdapter';

const index = loadComponentIndex();
const server = createContextKitServer(index);

console.log(
  JSON.stringify(
    {
      name: server.name,
      version: server.version,
      mode: 'mock-adapter',
      description:
        'Mock-compatible MCP server adapter. Wire these capabilities to @modelcontextprotocol/sdk for stdio transport.',
      capabilities: {
        tools: server.tools.map((tool) => tool.name),
        resources: server.resources.map((resource) => resource.uri),
        prompts: server.prompts.map((prompt) => prompt.name),
      },
      indexedComponents: index.components.length,
    },
    null,
    2,
  ),
);

