# Frontend AI Context Kit

Frontend AI Context Kit is a pet project that demonstrates how a frontend team can expose its
component system to AI assistants in a structured and maintainable way.

The repository connects a React UI library, Storybook examples, a TypeScript documentation
indexer, an MCP-compatible context server, and a web UI for exploring component documentation.
It is designed to be understandable in a resume review and concrete enough for a technical
interview discussion.

## What It Shows

- A typed React component library with documented props and examples.
- Storybook documentation for visual component review.
- A `ts-morph` powered indexer that converts TypeScript component APIs into JSON context.
- An MCP adapter that exposes tools, resources, and prompts for AI assistants.
- A Vite web interface for searching components, reading prop APIs, and reviewing usage rules.
- CI checks for install, lint, typecheck, index generation, and build.

## Repository Layout

```txt
apps/
  web/            Vite app for browsing the component index
  mcp-server/     MCP-compatible context server adapter
packages/
  ui/             React UI component library and Storybook stories
  docs-indexer/   CLI that generates component-index.json
  prompt-rules/   Shared AI usage rules and prompt templates
docs/
  architecture.md
  mcp.md
  ai-context.md
  prompts.md
```

## Quick Start

```bash
corepack enable
corepack prepare pnpm@10.11.0 --activate
pnpm install
pnpm generate:index
pnpm dev
```

Open the Vite URL printed by `pnpm dev`.

## Commands

```bash
pnpm dev             # Start the web app
pnpm storybook       # Start Storybook for packages/ui
pnpm build           # Generate index and build all packages/apps
pnpm typecheck       # Run TypeScript checks
pnpm lint            # Run ESLint
pnpm generate:index  # Regenerate MCP and web component indexes
```

## How The Context Flow Works

1. Components in `packages/ui/src/components` define props with TypeScript interfaces and JSDoc.
2. Examples live next to each component in `*.examples.tsx`.
3. `packages/docs-indexer` reads component source with `ts-morph`.
4. The generated JSON is written to:
   - `apps/mcp-server/data/component-index.json`
   - `apps/web/public/component-index.json`
5. The MCP adapter exposes this data through tools, resources, and prompts.
6. The web app reads the public JSON and renders searchable documentation.

## MCP SDK Integration

`apps/mcp-server` currently uses a small adapter layer with MCP-shaped tools, resources, and
prompts. This keeps the project installable even when the official SDK API changes.

To wire it to the real MCP SDK:

1. Add `@modelcontextprotocol/sdk` to `apps/mcp-server`.
2. Create a transport entrypoint, for example `src/stdio.ts`.
3. Register the handlers from `createContextKitServer(loadComponentIndex())`.
4. Use `StdioServerTransport` or the current SDK transport recommended by the MCP docs.

The business logic is intentionally isolated in `src/mcpAdapter.ts` so only the transport layer
needs to change.

## Included UI Components

- `Button`
- `Input`
- `Modal`
- `Select`
- `Tabs`
- `Card`

Each component includes:

- typed props interface
- JSDoc descriptions
- variants, sizes, or states where relevant
- examples
- Storybook stories

## Good Interview Talking Points

- Why AI assistants need structured component context instead of only source-code search.
- How docs can be generated from TypeScript as a source of truth.
- How MCP tools differ from resources and prompts.
- How to keep AI-generated UI aligned with a design system.
- Where this project could grow into a production internal platform.

## Possible Improvements

- Add a real MCP SDK transport and JSON-RPC smoke tests.
- Parse Storybook CSF stories directly in addition to `*.examples.tsx`.
- Add Vitest coverage for the indexer and MCP handlers.
- Publish Storybook as a static artifact in CI.
- Track component stability, owner team, accessibility notes, and migration status.
- Add a Figma or design-token source to enrich the AI context.

