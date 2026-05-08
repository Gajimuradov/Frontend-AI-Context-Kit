# AGENTS.md

This repository is a frontend platform pet project. Keep changes focused, typed, and easy to
explain in an interview.

## Run The Project

```bash
corepack enable
corepack prepare pnpm@10.11.0 --activate
pnpm install
pnpm generate:index
pnpm dev
```

Useful commands:

```bash
pnpm storybook
pnpm typecheck
pnpm lint
pnpm build
```

## Add A New Component

1. Create `packages/ui/src/components/ComponentName/ComponentName.tsx`.
2. Export a `ComponentNameProps` interface with JSDoc for every public prop.
3. Export `componentNameMeta` with name, description, category, and tags.
4. Add `ComponentName.examples.tsx` with copy-ready code examples.
5. Add `ComponentName.stories.tsx` for Storybook.
6. Re-export from `packages/ui/src/components/ComponentName/index.ts` and
   `packages/ui/src/components/index.ts`.
7. Run `pnpm generate:index`.

## Update The Documentation Index

The generated index is consumed by both the MCP server and web app.

```bash
pnpm generate:index
```

This writes:

- `apps/mcp-server/data/component-index.json`
- `apps/web/public/component-index.json`

Do not manually edit generated JSON unless pnpm is unavailable and a bootstrapping update is
needed.

## Write Tests

There is no test runner yet. For non-trivial logic, prefer adding Vitest and covering:

- docs-indexer parsing behavior
- MCP tool handlers
- resource URI lookup
- prompt generation

Until tests exist, always run:

```bash
pnpm typecheck
pnpm lint
pnpm generate:index
pnpm build
```

## Definition Of Done

- Public APIs are typed and documented.
- Storybook stories demonstrate realistic states.
- Generated index includes the new or changed component.
- Web app still renders component docs.
- MCP adapter can return API, examples, rules, and search results.
- README or docs are updated when behavior changes.

