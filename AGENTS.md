# AGENTS.md

Локальные подсказки для Codex и других AI-ассистентов, которые работают с этим репозиторием.
Проект нужно читать как небольшую frontend platform в миниатюре: здесь важны не только
компоненты, но и путь от UI-кода до AI-ready context layer.

## Суть проекта

Frontend AI Context Kit показывает, как frontend-команда может дать AI-ассистенту понятный
контекст о своей UI-библиотеке. Ассистент должен знать не только React, но и локальные правила:
какие компоненты уже есть, какие props они поддерживают, как выглядят хорошие examples и где не
нужно изобретать кастомный control.

Главная идея: AI должен работать не просто с фреймворком, а с контекстом конкретной
frontend-платформы.

## Общий сценарий

Представьте команду, у которой уже есть UI-библиотека. Разработчики знают ее через код,
Storybook и привычки команды. AI-ассистент этого знания не имеет, поэтому проект добавляет
недостающий слой между UI-библиотекой и AI:

1. Команда описывает компоненты в `packages/ui`: типы props, JSDoc, examples и Storybook stories.
2. `packages/docs-indexer` проходит по исходникам и собирает `component-index.json`.
3. `apps/web` показывает этот индекс человеку: поиск, API, examples и usage rules.
4. `apps/mcp-server` отдает тот же индекс AI-ассистенту через tools, resources и prompts.
5. Когда ассистент генерирует UI, он опирается на реальные компоненты проекта, а не на догадки.

Один источник знаний работает сразу для двух аудиторий: человека в web-документации и
AI-ассистента через MCP.

## Пример задачи

Если пользователь просит: "Собери форму создания API-токена", ожидаемый AI-flow такой:

1. Вызвать `search_components` с запросом про форму.
2. Найти `Input`, `Select`, `Button` и `Card`.
3. Вызвать `get_component_api`, чтобы узнать реальные props этих компонентов.
4. Вызвать `get_component_examples`, чтобы увидеть нормальные паттерны использования.
5. Вызвать `get_usage_rules`, чтобы учесть label, error, primary button и запрет на лишние custom controls.
6. Сгенерировать JSX в стиле этой UI-библиотеки.

При работе с кодом сохраняй эту модель: component source -> generated index -> web docs -> MCP context.

## Как читать проект

1. `packages/ui` - компоненты, props, examples и Storybook stories.
2. `packages/docs-indexer` - как TypeScript-код превращается в `component-index.json`.
3. `apps/web` - человеческий интерфейс к индексу.
4. `apps/mcp-server` - tools, resources и prompts поверх того же индекса.
5. `packages/prompt-rules` - правила, которые получают web app и MCP server.
6. `docs` - архитектурные заметки и примеры промптов.

## Что важно сохранить

- UI-библиотека должна оставаться источником машинно-читаемого знания.
- Документация должна собираться из TypeScript, JSDoc и examples, а не жить отдельно от кода.
- Web app и MCP server должны использовать один и тот же `component-index.json`.
- Prompt rules должны лежать рядом с кодом и быть частью инженерного процесса.
- Проект должен отвечать на вопрос: "Как сделать так, чтобы AI писал frontend-код в стиле нашей команды?"

## Запуск проекта

```bash
corepack enable
corepack prepare pnpm@10.11.0 --activate
pnpm install
pnpm generate:index
pnpm dev
```

Полезные команды:

```bash
pnpm storybook
pnpm typecheck
pnpm lint
pnpm build
```

## Как добавить новый компонент

1. Создать `packages/ui/src/components/ComponentName/ComponentName.tsx`.
2. Экспортировать `ComponentNameProps` с JSDoc для каждого public prop.
3. Экспортировать `componentNameMeta` с `name`, `description`, `category` и `tags`.
4. Добавить `ComponentName.examples.tsx` с реалистичными examples.
5. Добавить `ComponentName.stories.tsx` для Storybook.
6. Реэкспортировать компонент из `packages/ui/src/components/ComponentName/index.ts` и
   `packages/ui/src/components/index.ts`.
7. Запустить `pnpm generate:index`.

## Как обновить индекс

Generated index нужен и MCP server, и web app.

```bash
pnpm generate:index
```

Команда записывает:

- `apps/mcp-server/data/component-index.json`
- `apps/web/public/component-index.json`

Не редактируй generated JSON вручную, кроме редких bootstrap-ситуаций, когда pnpm временно
недоступен.

## Тесты и проверки

Тестового раннера пока нет. Для нетривиальной логики лучше добавить Vitest и покрыть:

- parsing в docs-indexer
- MCP tool handlers
- resource URI lookup
- prompt generation

Пока тестов нет, для изменений в коде запускай:

```bash
pnpm typecheck
pnpm lint
pnpm generate:index
pnpm build
```

Для чистых markdown-правок достаточно проверить diff.

## Definition Of Done

- Public APIs типизированы и описаны.
- Storybook stories показывают реалистичные состояния.
- Generated index содержит новый или измененный компонент.
- Web app показывает актуальную документацию.
- MCP adapter возвращает API, examples, rules и search results.
- README, docs или этот `AGENTS.md` обновлены, если поменялась модель проекта.
