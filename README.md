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

## Куда развивать дальше

Следующие шаги сделали бы проект ближе к production-инструменту:

- Подключить настоящий MCP SDK transport и проверить JSON-RPC сценарии.
- Парсить Storybook CSF stories напрямую, а не только ручные `*.examples.tsx`.
- Добавить тесты для indexer, MCP handlers и поиска компонентов.
- Добавить поля `owner`, `stability`, `accessibilityNotes` и `deprecated`.
- Подмешать design tokens или Figma metadata, чтобы AI понимал не только API, но и визуальные правила.
