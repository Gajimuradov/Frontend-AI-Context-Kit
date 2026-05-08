# Frontend AI Context Kit

Frontend AI Context Kit показывает, как может выглядеть AI-инфраструктура для современной
frontend-команды. Это не еще одна витрина компонентов, а связка из UI-библиотеки, документации,
индексатора и MCP-сервера, который умеет отдавать ассистенту понятный контекст о вашем интерфейсе.

Идея простая: если AI пишет код для продукта, он должен знать не только React, но и правила вашей
команды. Какие компоненты уже есть. Какие props у них поддерживаются. Как выглядят хорошие
примеры. Где нельзя изобретать новый control. Этот проект собирает такие знания в одном месте и
показывает, как их можно передать человеку и AI-ассистенту.

## Что внутри

- Небольшая React UI-библиотека с типами, JSDoc и Storybook stories.
- Индексатор на `ts-morph`, который читает компоненты и собирает `component-index.json`.
- MCP-совместимый server adapter с tools, resources и prompts для AI-ассистента.
- Web-интерфейс, где можно быстро найти компонент, посмотреть API и взять пример.
- Документация и CI, чтобы проект выглядел как законченная platform-задача, а не набор файлов.

## Зачем это нужно

AI-ассистент часто ошибается не потому, что плохо знает React, а потому что не знает ваш проект.
Он может придумать несуществующий prop, собрать форму из случайных div или проигнорировать
правила дизайн-системы. Frontend AI Context Kit решает эту проблему через явный слой контекста:
компоненты, примеры и правила превращаются в структурированные данные, которые можно читать,
искать и отдавать через MCP.

## Структура

```txt
apps/
  web/            Интерфейс для просмотра компонентного индекса
  mcp-server/     MCP-совместимый сервер контекста
packages/
  ui/             React-компоненты, examples и Storybook stories
  docs-indexer/   CLI для генерации component-index.json
  prompt-rules/   Правила и шаблоны промптов для AI
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

После запуска откройте URL, который выведет Vite.

## Основные команды

```bash
pnpm dev             # Запустить web-интерфейс
pnpm storybook       # Открыть Storybook для UI-библиотеки
pnpm build           # Сгенерировать индекс и собрать workspace
pnpm typecheck       # Проверить TypeScript
pnpm lint            # Запустить ESLint
pnpm generate:index  # Обновить component-index.json для web и MCP
```

## Как все связано

1. Компоненты в `packages/ui` описывают публичный API через TypeScript interfaces и JSDoc.
2. Рядом лежат короткие examples, которые показывают нормальное использование компонента.
3. `packages/docs-indexer` читает исходники через `ts-morph` и валидирует результат через Zod.
4. Индекс сохраняется в `apps/web/public` и `apps/mcp-server/data`.
5. Web app показывает этот индекс человеку.
6. MCP adapter отдает тот же индекс AI-ассистенту через tools, resources и prompts.

## MCP слой

В `apps/mcp-server` уже есть транспорт-независимая логика:

- `search_components` помогает найти подходящий компонент по задаче.
- `get_component_api` возвращает props, типы и описания.
- `get_component_examples` отдает готовые примеры.
- `get_usage_rules` возвращает правила, которые удерживают AI в рамках UI-библиотеки.

Сейчас это adapter layer без жесткой привязки к конкретной версии SDK. Чтобы подключить настоящий
MCP transport, добавьте `@modelcontextprotocol/sdk`, создайте entrypoint вроде `src/stdio.ts` и
зарегистрируйте handlers из `createContextKitServer(loadComponentIndex())`.

## Компоненты

В демо-библиотеке есть шесть базовых компонентов:

- `Button`
- `Input`
- `Modal`
- `Select`
- `Tabs`
- `Card`

У каждого компонента есть typed props, JSDoc, несколько состояний или вариантов, examples и
Storybook stories. Этого достаточно, чтобы показать полный путь от UI-кода до AI-контекста без
лишнего boilerplate.

## Что обсудить на интервью

- Как превратить компонентную библиотеку в источник AI-контекста.
- Почему TypeScript и JSDoc удобны как source of truth для component API.
- Чем MCP tools отличаются от resources и prompts.
- Как не дать AI-ассистенту изобретать несуществующие props.
- Как такой подход можно развить во внутреннюю frontend platform.

## Что можно развить дальше

- Подключить настоящий MCP SDK transport и JSON-RPC smoke tests.
- Парсить Storybook CSF stories напрямую, а не только `*.examples.tsx`.
- Добавить Vitest для indexer и MCP handlers.
- Публиковать Storybook и web app из CI.
- Добавить owner team, stability, accessibility notes и migration status.
- Подмешать design tokens или Figma metadata в общий AI-контекст.
