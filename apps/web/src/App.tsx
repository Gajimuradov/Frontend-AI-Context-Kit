import { useEffect, useMemo, useState } from 'react';
import { Button, Card, Input, Tabs } from '@frontend-ai-context-kit/ui';
import type { ComponentIndex, IndexedComponent } from './types';

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
            <th>Prop</th>
            <th>Type</th>
            <th>Required</th>
            <th>Default</th>
            <th>Description</th>
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
              <td>{prop.required ? 'Yes' : 'No'}</td>
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
        subtitle={`${component.category} - ${component.props.length} props - ${component.examples.length} examples`}
        actions={<Button variant="secondary">Storybook</Button>}
      >
        <p className="componentDescription">{component.description}</p>
        <div className="metaGrid">
          <span>Import</span>
          <code>import {'{'} {component.name} {'}'} from '{component.importPath}';</code>
          <span>Source</span>
          <code>{component.filePath}</code>
          <span>Stories</span>
          <code>{component.storyPath ?? 'Not indexed'}</code>
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
        ariaLabel={`${component.name} documentation`}
        items={[
          {
            id: 'api',
            label: 'Prop API',
            content: <PropsTable component={component} />,
          },
          {
            id: 'examples',
            label: 'Examples',
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
          throw new Error(`Failed to load component-index.json: ${response.status}`);
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
          <p className="eyebrow">AI infrastructure demo</p>
          <h1>Frontend AI Context Kit</h1>
          <p className="intro">
            Component metadata, examples, prompt rules, and MCP capabilities in one frontend
            platform workspace.
          </p>
        </div>
        <div className="statusPill">
          {index ? `${index.components.length} components indexed` : 'Loading index'}
        </div>
      </header>

      <section className="workspace">
        <aside className="sidebar">
          <Input
            fullWidth
            label="Search components"
            name="component-search"
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Button, form, dialog..."
            value={query}
          />

          {error ? <p className="errorText">{error}</p> : null}

          <div className="componentList">
            {filteredComponents.map((component) => (
              <button
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
            <Card title="No components found">
              <p>Try another query or regenerate the component index.</p>
            </Card>
          )}
        </section>

        <aside className="contextPane">
          <Card title="Usage rules" subtitle="Returned by get_usage_rules and ui://rules/frontend">
            <ul className="rulesList">
              {index?.usageRules.slice(0, 6).map((rule) => <li key={rule}>{rule}</li>)}
            </ul>
          </Card>

          <Card title="How AI assistant uses this context">
            <ol className="flowList">
              <li>Searches components by intent with search_components.</li>
              <li>Reads prop API before generating JSX.</li>
              <li>Copies examples and adapts only the business data.</li>
              <li>Applies usage rules during review and refactoring.</li>
            </ol>
          </Card>
        </aside>
      </section>
    </main>
  );
}
