import { loadComponentIndex } from './context';
import { createContextKitServer } from './mcpAdapter';

const server = createContextKitServer(loadComponentIndex());

const searchResult = server.callTool('search_components', { query: 'form', limit: 3 });
const apiResult = server.callTool('get_component_api', { componentName: 'Button' });
const rulesResult = server.callTool('get_usage_rules', {});

console.log(
  JSON.stringify(
    {
      search: searchResult.structuredContent,
      buttonApi: apiResult.structuredContent,
      rules: rulesResult.structuredContent,
    },
    null,
    2,
  ),
);

