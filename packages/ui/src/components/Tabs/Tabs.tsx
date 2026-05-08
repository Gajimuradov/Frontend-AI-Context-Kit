import { useState } from 'react';
import type { ReactNode } from 'react';
import type { ComponentMeta } from '../../types';
import { cx } from '../../utils';

export const tabsMeta: ComponentMeta = {
  name: 'Tabs',
  description:
    'Navigation pattern for switching between related panels without leaving the current page.',
  category: 'Navigation',
  tags: ['navigation', 'panels', 'controlled', 'uncontrolled'],
};

export interface TabItem {
  /** Stable tab identifier. Use semantic ids such as "api" or "examples". */
  id: string;
  /** Text shown in the tab trigger. */
  label: string;
  /** Panel content rendered when the tab is active. */
  content: ReactNode;
  /** Prevents the tab from being selected. */
  disabled?: boolean;
}

/**
 * Props for the Tabs component.
 */
export interface TabsProps {
  /** Collection of tabs and panels. */
  items: TabItem[];
  /** Controlled active tab id. Use with onChange. */
  activeId?: string;
  /** Initial tab id for uncontrolled usage. */
  defaultActiveId?: string;
  /** Called when the active tab changes. */
  onChange?: (tabId: string) => void;
  /** Accessible label for the tab list. */
  ariaLabel?: string;
}

export function Tabs({ items, activeId, defaultActiveId, onChange, ariaLabel = 'Tabs' }: TabsProps) {
  const firstEnabledId = items.find((item) => !item.disabled)?.id;
  const [internalActiveId, setInternalActiveId] = useState(defaultActiveId ?? firstEnabledId);
  const selectedId = activeId ?? internalActiveId;
  const selectedItem = items.find((item) => item.id === selectedId) ?? items.find((item) => !item.disabled);

  function selectTab(tabId: string) {
    if (activeId === undefined) {
      setInternalActiveId(tabId);
    }

    onChange?.(tabId);
  }

  return (
    <div className="fack-tabs">
      <div aria-label={ariaLabel} className="fack-tabs__list" role="tablist">
        {items.map((item) => {
          const isActive = item.id === selectedItem?.id;

          return (
            <button
              aria-controls={`fack-tab-panel-${item.id}`}
              aria-selected={isActive}
              className={cx('fack-tabs__trigger', isActive && 'fack-tabs__trigger--active')}
              disabled={item.disabled}
              id={`fack-tab-${item.id}`}
              key={item.id}
              onClick={() => selectTab(item.id)}
              role="tab"
              type="button"
            >
              {item.label}
            </button>
          );
        })}
      </div>
      {selectedItem ? (
        <div
          aria-labelledby={`fack-tab-${selectedItem.id}`}
          className="fack-tabs__panel"
          id={`fack-tab-panel-${selectedItem.id}`}
          role="tabpanel"
        >
          {selectedItem.content}
        </div>
      ) : null}
    </div>
  );
}

