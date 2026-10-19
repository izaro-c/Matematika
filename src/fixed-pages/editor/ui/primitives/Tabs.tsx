import React, { useRef } from 'react';
import { cx } from './classNames';
import { rovingTargetIndex } from './rovingFocus';

export interface TabItem {
  id: string;
  label: React.ReactNode;
}

export interface TabsProps {
  tabs: ReadonlyArray<TabItem>;
  activeTab: string;
  onTabChange: (tabId: string) => void;
  'aria-label'?: string;
  className?: string;
  /**
   * `tabs` is a tab list over panels (arrow keys, `aria-selected`); `nav` is a
   * row of section links (Tab key, `aria-current`).
   */
  variant?: 'tabs' | 'nav';
  /** With `variant="tabs"`, the id of the panel each tab controls. */
  panelId?: (tabId: string) => string;
}

export const Tabs: React.FC<TabsProps> = ({
  tabs,
  activeTab,
  onTabChange,
  'aria-label': ariaLabel,
  className,
  variant = 'tabs',
  panelId,
}) => {
  const refs = useRef<Array<HTMLButtonElement | null>>([]);
  const isTabList = variant === 'tabs';
  const activeIndex = Math.max(0, tabs.findIndex(tab => tab.id === activeTab));

  const onKeyDown = (event: React.KeyboardEvent) => {
    if (!isTabList) return;
    const next = rovingTargetIndex(event, activeIndex, tabs.length);
    if (next === null) return;
    event.preventDefault();
    onTabChange(tabs[next].id);
    refs.current[next]?.focus();
  };

  return (
    <nav
      className={cx('ed-tabs', className)}
      aria-label={ariaLabel}
      onKeyDown={onKeyDown}
      {...(isTabList ? { role: 'tablist' } : {})}
    >
      {tabs.map((tab, index) => {
        const active = tab.id === activeTab;
        return (
          <button
            key={tab.id}
            ref={element => { refs.current[index] = element; }}
            type="button"
            className="ed-tab"
            onClick={() => onTabChange(tab.id)}
            {...(isTabList
              ? {
                  role: 'tab',
                  'aria-selected': active,
                  'aria-controls': panelId?.(tab.id),
                  tabIndex: index === activeIndex ? 0 : -1,
                }
              : { 'aria-current': active ? 'page' as const : undefined })}
          >
            {tab.label}
          </button>
        );
      })}
    </nav>
  );
};
