import { useState } from 'react';
import type { ReactNode } from 'react';
import type { ComponentMeta } from '../../types';
import { cx } from '../../utils';

export const tabsMeta: ComponentMeta = {
  name: 'Tabs',
  description:
    'Tabs разделяет близкие по смыслу материалы на вкладки, чтобы пользователь оставался в одном контексте и не терялся между страницами.',
  category: 'Навигация',
  tags: ['навигация', 'панели', 'controlled', 'uncontrolled'],
};

export interface TabItem {
  /** Стабильный идентификатор вкладки. Используйте семантичные id вроде "api". */
  id: string;
  /** Текст на переключателе вкладки. */
  label: string;
  /** Контент панели, который рендерится при активной вкладке. */
  content: ReactNode;
  /** Запрещает выбрать вкладку. */
  disabled?: boolean;
}

/**
 * Пропсы компонента Tabs.
 */
export interface TabsProps {
  /** Набор вкладок и панелей. */
  items: TabItem[];
  /** Controlled id активной вкладки. Используйте вместе с onChange. */
  activeId?: string;
  /** Начальная вкладка для uncontrolled-сценария. */
  defaultActiveId?: string;
  /** Вызывается при смене активной вкладки. */
  onChange?: (tabId: string) => void;
  /** Доступная подпись списка вкладок. */
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
