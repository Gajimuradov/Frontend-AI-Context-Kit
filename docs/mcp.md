# MCP Capabilities

The MCP server package exposes a mock-compatible adapter in `apps/mcp-server/src/mcpAdapter.ts`.
It is intentionally transport-agnostic so the project can later be wired to the official MCP SDK.

## Tools

### `search_components`

Input:

```json
{
  "query": "form",
  "limit": 10
}
```

Returns component summaries ranked by name, tags, descriptions, and prop metadata.

### `get_component_api`

Input:

```json
{
  "componentName": "Button"
}
```

Returns description, import path, and prop API.

### `get_component_examples`

Input:

```json
{
  "componentName": "Modal"
}
```

Returns examples and Storybook path for the selected component.

### `get_usage_rules`

Returns frontend rules that guide AI-generated UI.

## Resources

### `ui://components`

Full component catalog summary.

### `ui://components/{componentName}`

Full metadata for one component.

Example:

```txt
ui://components/Button
```

### `ui://rules/frontend`

Markdown rules for frontend usage.

## Prompts

### `create_component_usage_example`

Creates a usage example for a selected component and use case.

### `review_component_usage`

Reviews a React snippet against component APIs and frontend rules.

### `generate_form_with_ui_library`

Generates a compact form using the UI library primitives.

## Real MCP SDK Wiring

The current package does not require `@modelcontextprotocol/sdk`. To add it:

1. Install the SDK in `apps/mcp-server`.
2. Keep `loadComponentIndex` and `createContextKitServer`.
3. Register each adapter tool/resource/prompt with the SDK server.
4. Attach a stdio or HTTP transport based on the SDK version in use.

