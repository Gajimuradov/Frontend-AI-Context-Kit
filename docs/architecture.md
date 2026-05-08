# Architecture

Frontend AI Context Kit is a small monorepo that shows how frontend component knowledge can move
from source code into AI-assistant context.

## System Overview

```txt
packages/ui
  React components, prop interfaces, JSDoc, examples, Storybook stories
        |
        v
packages/docs-indexer
  ts-morph parser and Zod schema validation
        |
        v
component-index.json
        |
        +--> apps/mcp-server
        |      tools, resources, prompts
        |
        +--> apps/web
               searchable documentation UI
```

## Packages

`packages/ui` is the source of truth for component APIs. Every component owns its props,
metadata, examples, and Storybook stories.

`packages/docs-indexer` reads component files, extracts public prop metadata, validates the
result with Zod, and writes JSON for the MCP server and web app.

`packages/prompt-rules` stores shared rules and prompt templates so the same guidance can be used
by docs, MCP handlers, and future automation.

## Apps

`apps/mcp-server` loads the generated index and exposes MCP-shaped capabilities:

- tools for search, API lookup, examples, and usage rules
- resources for full catalog, single component, and frontend rules
- prompts for generation and review workflows

`apps/web` loads the public index at runtime and renders a documentation browser for humans.

## Design Choices

- Keep examples next to components so they are easy to review in code review.
- Use TypeScript interfaces and JSDoc as the API documentation source.
- Keep MCP business logic independent from transport details.
- Generate static JSON so the web app can be hosted anywhere.
- Avoid heavy build infrastructure to keep the project easy to understand.

