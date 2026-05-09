import { useEffect, useMemo, useState } from 'react';
import { Card, Input, Tabs } from '@frontend-ai-context-kit/ui';
import type { ComponentIndex, IndexedComponent } from './types';

const quickQueries = ['форма', 'диалог', 'Button', 'API', 'навигация'];

const workflowSteps = [
  {
    label: 'UI kit',
    text: 'Компоненты, props, JSDoc и examples живут рядом с кодом.',
  },
  {
    label: 'Indexer',
    text: 'CLI собирает машинно-читаемый component-index.json.',
  },
  {
    label: 'Web docs',
    text: 'Команда видит тот же индекс в удобном интерфейсе.',
  },
  {
    label: 'MCP',
    text: 'AI получает поиск, API, examples и правила через tools.',
  },
];

const searchAliases: Record<string, string[]> = {
  api: ['props', 'prop', 'свойство', 'свойства', 'тип'],
  form: ['форма', 'формы', 'форму', 'поле', 'поля', 'input', 'select'],
  forms: ['форма', 'формы', 'форму', 'поле', 'поля', 'input', 'select'],
  dialog: ['диалог', 'modal', 'модалка', 'оверлей', 'подтверждение'],
  modal: ['диалог', 'оверлей', 'подтверждение'],
  button: ['кнопка', 'действие', 'cta'],
  input: ['поле', 'ввод', 'форма'],
  select: ['выбор', 'список', 'форма'],
  card: ['карточка', 'контент', 'summary'],
  tabs: ['вкладки', 'навигация', 'панели'],
};

function formatCount(count: number, one: string, few: string, many: string) {
  const lastDigit = count % 10;
  const lastTwoDigits = count % 100;

  if (lastDigit === 1 && lastTwoDigits !== 11) {
    return `${count} ${one}`;
  }

  if (lastDigit >= 2 && lastDigit <= 4 && (lastTwoDigits < 12 || lastTwoDigits > 14)) {
    return `${count} ${few}`;
  }

  return `${count} ${many}`;
}

function expandQuery(query: string) {
  const normalizedQuery = query.trim().toLowerCase();

  if (!normalizedQuery) {
    return [];
  }

  const tokens = normalizedQuery.split(/\s+/);
  const aliases = [
    ...(searchAliases[normalizedQuery] ?? []),
    ...tokens.flatMap((token) => searchAliases[token] ?? []),
  ];

  return Array.from(new Set([normalizedQuery, ...tokens, ...aliases]));
}

function matchesQuery(component: IndexedComponent, query: string) {
  const searchTerms = expandQuery(query);

  if (searchTerms.length === 0) {
    return true;
  }

  const haystack = [
    component.name,
    component.description,
    component.category,
    ...component.tags,
    ...component.props.map((prop) => `${prop.name} ${prop.type} ${prop.description}`),
    ...component.examples.map((example) => `${example.title} ${example.description}`),
  ]
    .join(' ')
    .toLowerCase();

  return searchTerms.some((term) => haystack.includes(term));
}

function PropsTable({ component }: { component: IndexedComponent }) {
  return (
    <div className="tableWrap">
      <table>
        <thead>
          <tr>
            <th>Prop</th>
            <th>Тип</th>
            <th>Обяз.</th>
            <th>Default</th>
            <th>Когда использовать</th>
          </tr>
        </thead>
        <tbody>
          {component.props.map((prop) => (
            <tr key={prop.name}>
              <td>
                <code>{prop.name}</code>
              </td>
              <td>
                <code>{prop.type}</code>
              </td>
              <td>{prop.required ? 'Да' : 'Нет'}</td>
              <td>{prop.defaultValue ? <code>{prop.defaultValue}</code> : '-'}</td>
              <td>{prop.description || '-'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ComponentDetail({ component }: { component: IndexedComponent }) {
  return (
    <div className="detailStack">
      <Card
        actions={<span className="componentBadge">Готов для AI</span>}
        subtitle={`${component.category} · ${formatCount(component.props.length, 'свойство', 'свойства', 'свойств')} · ${formatCount(component.examples.length, 'пример', 'примера', 'примеров')}`}
        title={component.name}
      >
        <p className="componentDescription">{component.description}</p>

        <div className="componentFacts" aria-label="Краткая сводка компонента">
          <div>
            <span>Импорт</span>
            <code>import {'{'} {component.name} {'}'} from '{component.importPath}';</code>
          </div>
          <div>
            <span>Исходник</span>
            <code>{component.filePath}</code>
          </div>
          <div>
            <span>Storybook</span>
            <code>{component.storyPath ?? 'Story не найден в индексе'}</code>
          </div>
        </div>

        <div className="tagRow" aria-label="Теги компонента">
          {component.tags.map((tag) => (
            <span className="tag" key={tag}>
              {tag}
            </span>
          ))}
        </div>
      </Card>

      <Tabs
        ariaLabel={`Документация компонента ${component.name}`}
        items={[
          {
            id: 'api',
            label: 'Props API',
            content: <PropsTable component={component} />,
          },
          {
            id: 'examples',
            label: 'Примеры',
            content: (
              <div className="examplesGrid">
                {component.examples.map((example) => (
                  <article className="exampleCard" key={example.title}>
                    <div>
                      <h3>{example.title}</h3>
                      <p>{example.description}</p>
                    </div>
                    <pre>
                      <code>{example.code}</code>
                    </pre>
                  </article>
                ))}
              </div>
            ),
          },
        ]}
      />
    </div>
  );
}

export function App() {
  const [index, setIndex] = useState<ComponentIndex | null>(null);
  const [query, setQuery] = useState('');
  const [selectedName, setSelectedName] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/component-index.json')
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Не удалось загрузить component-index.json: ${response.status}`);
        }

        return response.json() as Promise<ComponentIndex>;
      })
      .then((payload) => {
        setIndex(payload);
        setSelectedName(payload.components[0]?.name ?? '');
      })
      .catch((loadError: Error) => setError(loadError.message));
  }, []);

  const filteredComponents = useMemo(
    () => index?.components.filter((component) => matchesQuery(component, query)) ?? [],
    [index, query],
  );

  const selectedComponent =
    filteredComponents.find((component) => component.name === selectedName) ?? filteredComponents[0];
  const isLoading = !index && !error;

  useEffect(() => {
    if (selectedComponent && selectedComponent.name !== selectedName) {
      setSelectedName(selectedComponent.name);
    }
  }, [selectedComponent, selectedName]);

  return (
    <main className="appShell">
      <section className="hero">
        <div className="heroCopy">
          <p className="eyebrow">AI-ready документация для frontend-платформы</p>
          <h1>Компоненты, которые понимает не только команда, но и AI</h1>
          <p className="intro">
            Этот проект показывает, как превратить UI-библиотеку в живой слой контекста:
            разработчик видит аккуратную документацию, а ассистент получает те же знания через MCP.
          </p>
        </div>

        <div className="heroStats" aria-label="Состояние индекса">
          <div>
            <strong>{index ? index.components.length : '...'}</strong>
            <span>компонентов</span>
          </div>
          <div>
            <strong>{index ? index.usageRules.length : '...'}</strong>
            <span>правил</span>
          </div>
          <div>
            <strong>4</strong>
            <span>MCP tools</span>
          </div>
        </div>
      </section>

      <section className="workflow" aria-label="Как работает проект">
        {workflowSteps.map((step, indexOfStep) => (
          <article key={step.label}>
            <span>{indexOfStep + 1}</span>
            <div>
              <h2>{step.label}</h2>
              <p>{step.text}</p>
            </div>
          </article>
        ))}
      </section>

      <section className="workspace">
        <aside className="sidebar">
          <div className="searchPanel">
            <Input
              fullWidth
              label="Найти компонент"
              name="component-search"
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Например: форма, диалог, API"
              value={query}
            />
            <div className="quickQueries" aria-label="Быстрые запросы">
              {quickQueries.map((item) => (
                <button key={item} onClick={() => setQuery(item)} type="button">
                  {item}
                </button>
              ))}
            </div>
          </div>

          {error ? <p className="errorText">{error}</p> : null}

          <div className="listHeader">
            <span>Каталог</span>
            <small>
              {isLoading
                ? 'загрузка'
                : formatCount(filteredComponents.length, 'компонент', 'компонента', 'компонентов')}
            </small>
          </div>

          <div className="componentList">
            {filteredComponents.map((component) => (
              <button
                aria-current={component.name === selectedComponent?.name ? 'true' : undefined}
                className={component.name === selectedComponent?.name ? 'listItem active' : 'listItem'}
                key={component.name}
                onClick={() => setSelectedName(component.name)}
                type="button"
              >
                <span>{component.name}</span>
                <small>
                  {component.category} · {formatCount(component.props.length, 'prop', 'props', 'props')}
                </small>
              </button>
            ))}
          </div>
        </aside>

        <section className="contentPane">
          {isLoading ? (
            <Card title="Загружаем компонентный индекс">
              <p className="componentDescription">
                Сейчас web app читает тот же <code>component-index.json</code>, который использует
                MCP server. Через пару секунд здесь появятся компоненты, props, examples и правила.
              </p>
            </Card>
          ) : selectedComponent ? (
            <ComponentDetail component={selectedComponent} />
          ) : (
            <Card title="Компоненты не найдены">
              <p className="componentDescription">
                Попробуйте другой запрос: например, "форма", "диалог", "кнопка" или название компонента.
                Если компонент только что добавлен, обновите индекс командой pnpm generate:index.
              </p>
            </Card>
          )}
        </section>

        <aside className="contextPane">
          <Card
            subtitle="Их читает человек в web app и AI через get_usage_rules"
            title="Правила, которые держат интерфейс цельным"
          >
            {index ? (
              <ul className="rulesList">
                {index.usageRules.slice(0, 6).map((rule) => <li key={rule}>{rule}</li>)}
              </ul>
            ) : (
              <p className="componentDescription">Загружаем правила из общего индекса.</p>
            )}
          </Card>

          <Card title="Как ассистент использует этот контекст">
            <ol className="flowList">
              <li>Сначала ищет подходящий компонент по смыслу задачи.</li>
              <li>Проверяет реальные props, чтобы не придумать лишний API.</li>
              <li>Берет пример как стартовую точку для JSX.</li>
              <li>Применяет usage rules перед генерацией или ревью кода.</li>
            </ol>
          </Card>
        </aside>
      </section>
    </main>
  );
}
