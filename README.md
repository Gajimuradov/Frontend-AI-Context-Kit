# Frontend AI Context Kit

Frontend AI Context Kit - это pet-проект про то, как frontend-команда может подготовить свою
UI-библиотеку к работе с AI-ассистентом.

Обычно ассистент хорошо знает React, но плохо знает конкретный продукт. Он может придумать prop,
которого нет в дизайн-системе, собрать форму из случайных `div` или проигнорировать локальные
правила команды. Этот проект показывает другой подход: компоненты, examples, JSDoc и правила
превращаются в структурированный контекст, который одинаково удобно читать человеку и AI.

## Главный сценарий

Проект демонстрирует один полный workflow:

1. Команда пишет компоненты в `packages/ui`.
2. Рядом с компонентами лежат typed props, JSDoc, Storybook stories и examples.
3. `docs-indexer` читает TypeScript-код и собирает `component-index.json`.
4. Web app показывает этот индекс как аккуратный каталог компонентов.
5. MCP server отдает тот же индекс AI-ассистенту через tools, resources и prompts.

В итоге UI-библиотека становится не просто набором React-компонентов, а источником знаний для
разработчиков, ревьюеров и AI-инструментов.

## Что можно показать

- UI kit с компонентами `Button`, `Input`, `Modal`, `Select`, `Tabs`, `Card`.
- Storybook с состояниями, вариантами и примерами использования.
- Индексатор на `ts-morph`, который достает props, типы, JSDoc и examples.
- MCP-совместимый слой с поиском компонентов, API, examples и usage rules.
- Web-интерфейс, где видно, какой контекст реально получает ассистент.
- Документацию и CI, чтобы проект выглядел как законченная frontend platform-задача.

## Как это помогает AI

Без контекста AI угадывает. С контекстом он может:

- найти подходящий компонент по смыслу задачи;
- проверить реальные props перед генерацией JSX;
- взять готовый example как стартовую точку;
- применить правила библиотеки перед ревью или переписыванием кода.

Например, если попросить ассистента собрать форму создания API-токена, он должен найти `Input`,
`Select`, `Button` и `Card`, прочитать их API, посмотреть examples и только потом писать код.

## Структура проекта

```txt
apps/
  web/            Каталог компонентов и AI-контекста
  mcp-server/     MCP-совместимый сервер для ассистента
packages/
  ui/             React UI kit, examples и Storybook stories
  docs-indexer/   CLI для генерации component-index.json
  prompt-rules/   Правила, которые используют web app и MCP server
docs/
  architecture.md
  mcp.md
  ai-context.md
  prompts.md
```

## Быстрый запуск

```bash
corepack enable
corepack prepare pnpm@10.11.0 --activate
pnpm install
pnpm generate:index
pnpm dev
```

После запуска Vite откроет web app на локальном URL, обычно `http://localhost:5173/`.

## Основные команды

```bash
pnpm dev             # Web-интерфейс с каталогом компонентов
pnpm storybook       # Storybook для UI-библиотеки
pnpm build           # Генерация индекса и сборка workspace
pnpm typecheck       # Проверка TypeScript
pnpm lint            # ESLint
pnpm generate:index  # Обновить component-index.json для web и MCP
```

`pnpm storybook` перед запуском чистит Storybook/Vite cache, чтобы не ловить stale dynamic imports
после переименований или пересборки stories.

## Как проверить идею проекта

1. Запустите `pnpm generate:index`.
2. Проверьте, что индекс появился в двух местах:
   `apps/web/public/component-index.json` и `apps/mcp-server/data/component-index.json`.
3. Запустите `pnpm dev` и найдите компоненты по запросам `форма`, `диалог`, `Button`, `API`.
4. Запустите `pnpm --filter @frontend-ai-context-kit/mcp-server smoke`.
5. Убедитесь, что MCP layer возвращает search results, props для `Button` и usage rules.

Если эти шаги проходят, проект выполняет свою задачу: один источник компонентного знания работает
для человека в web app и для AI-ассистента через MCP.

## Куда развивать дальше

- Подключить настоящий MCP SDK transport и проверить JSON-RPC сценарии.
- Добавить Vitest для indexer, MCP handlers и поиска.
- Парсить Storybook CSF stories напрямую, а не только ручные `*.examples.tsx`.
- Добавить `owner`, `stability`, `deprecated`, `accessibilityNotes`.
- Подмешать design tokens или Figma metadata, чтобы AI видел не только API, но и визуальные правила.
