import { useEffect, useMemo, useState } from 'react';
import { Card, Input, Tabs } from '@frontend-ai-context-kit/ui';
import type { ComponentIndex, IndexedComponent } from './types';

function formatComponentCount(count: number) {
  const lastDigit = count % 10;
  const lastTwoDigits = count % 100;

  if (lastDigit === 1 && lastTwoDigits !== 11) {
    return `${count} компонент`;
  }

  if (lastDigit >= 2 && lastDigit <= 4 && (lastTwoDigits < 12 || lastTwoDigits > 14)) {
    return `${count} компонента`;
  }

  return `${count} компонентов`;
}

function formatPropCount(count: number) {
  const lastDigit = count % 10;
  const lastTwoDigits = count % 100;

  if (lastDigit === 1 && lastTwoDigits !== 11) {
    return `${count} свойство`;
  }

  if (lastDigit >= 2 && lastDigit <= 4 && (lastTwoDigits < 12 || lastTwoDigits > 14)) {
    return `${count} свойства`;
  }

  return `${count} свойств`;
}

function formatExampleCount(count: number) {
  const lastDigit = count % 10;
  const lastTwoDigits = count % 100;

  if (lastDigit === 1 && lastTwoDigits !== 11) {
    return `${count} пример`;
  }

  if (lastDigit >= 2 && lastDigit <= 4 && (lastTwoDigits < 12 || lastTwoDigits > 14)) {
    return `${count} примера`;
  }

  return `${count} примеров`;
}

function matchesQuery(component: IndexedComponent, query: string) {
  const normalizedQuery = query.trim().toLowerCase();

  if (!normalizedQuery) {
    return true;
  }

  return [
    component.name,
    component.description,
    component.category,
    ...component.tags,
    ...component.props.map((prop) => `${prop.name} ${prop.type} ${prop.description}`),
  ]
    .join(' ')
    .toLowerCase()
    .includes(normalizedQuery);
}

function PropsTable({ component }: { component: IndexedComponent }) {
  return (
    <div className="tableWrap">
      <table>
        <thead>
          <tr>
            <th>Свойство</th>
            <th>Тип</th>
            <th>Обязательный</th>
            <th>По умолчанию</th>
            <th>Описание</th>
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
        title={component.name}
        subtitle={`${component.category} - ${formatPropCount(component.props.length)} - ${formatExampleCount(component.examples.length)}`}
        actions={<span className="componentBadge">UI API</span>}
      >
        <p className="componentDescription">{component.description}</p>
        <div className="metaGrid">
          <span>Импорт</span>
          <code>import {'{'} {component.name} {'}'} from '{component.importPath}';</code>
          <span>Исходник</span>
          <code>{component.filePath}</code>
          <span>Stories</span>
          <code>{component.storyPath ?? 'Не найдено в индексе'}</code>
        </div>
        <div className="tagRow">
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
            label: 'API компонента',
            content: <PropsTable component={component} />,
          },
          {
            id: 'examples',
            label: 'Примеры',
            content: (
              <div className="examplesGrid">
                {component.examples.map((example) => (
                  <Card key={example.title} padding="compact" title={example.title}>
                    <p className="exampleDescription">{example.description}</p>
                    <pre>
                      <code>{example.code}</code>
                    </pre>
                  </Card>
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

  useEffect(() => {
    if (selectedComponent && selectedComponent.name !== selectedName) {
      setSelectedName(selectedComponent.name);
    }
  }, [selectedComponent, selectedName]);

  return (
    <main className="appShell">
      <header className="topBar">
        <div>
          <p className="eyebrow">AI-контекст для frontend-команд</p>
          <h1>Frontend AI Context Kit</h1>
          <p className="intro">
            Живой каталог UI-компонентов, который одинаково полезен разработчику и
            AI-ассистенту: здесь есть API, примеры, правила и готовый MCP-слой для контекста.
          </p>
        </div>
        <div className="statusPill">
          {index ? `${formatComponentCount(index.components.length)} готовы для AI` : 'Загружаем каталог'}
        </div>
      </header>

      <section className="workspace">
        <aside className="sidebar">
          <Input
            fullWidth
            label="Найти компонент"
            name="component-search"
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Например: кнопка, форма, диалог"
            value={query}
          />

          {error ? <p className="errorText">{error}</p> : null}

          <div className="listHeader">
            <span>Каталог</span>
            <small>{formatComponentCount(filteredComponents.length)}</small>
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
                <small>{component.category}</small>
              </button>
            ))}
          </div>
        </aside>

        <section className="contentPane">
          {selectedComponent ? (
            <ComponentDetail component={selectedComponent} />
          ) : (
            <Card title="Компоненты не найдены">
              <p className="componentDescription">
                Попробуйте описать задачу другими словами или обновите индекс командой
                pnpm generate:index.
              </p>
            </Card>
          )}
        </section>

        <aside className="contextPane">
          <Card
            title="Как пользоваться библиотекой"
            subtitle="Эти же правила получает AI-ассистент через get_usage_rules"
          >
            <ul className="rulesList">
              {index?.usageRules.slice(0, 6).map((rule) => <li key={rule}>{rule}</li>)}
            </ul>
          </Card>

          <Card title="Что делает AI с этим контекстом">
            <ol className="flowList">
              <li>Находит подходящий компонент по смыслу задачи.</li>
              <li>Проверяет реальные свойства перед тем, как писать JSX.</li>
              <li>Берет готовый пример как основу и адаптирует его под продуктовый сценарий.</li>
              <li>Использует правила библиотеки, когда ревьюит или переписывает код.</li>
            </ol>
          </Card>
        </aside>
      </section>
    </main>
  );
}
