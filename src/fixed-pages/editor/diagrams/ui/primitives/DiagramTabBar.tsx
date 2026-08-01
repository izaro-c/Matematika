import React from 'react';

export interface DiagramTabItem {
  id: string;
  label: string;
}

export interface DiagramTabBarProps {
  tabs: DiagramTabItem[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  'aria-label'?: string;
  className?: string;
  variant?: 'nav' | 'tabs';
}

export const DiagramTabBar: React.FC<DiagramTabBarProps> = ({
  tabs,
  activeTab,
  onTabChange,
  'aria-label': ariaLabel,
  className = '',
  variant = 'nav',
}) => (
  <nav
    className={`flex gap-1 overflow-x-auto border-b border-carbon/10 pb-2 ${className}`.trim()}
    aria-label={ariaLabel}
    {...(variant === 'tabs' ? { role: 'tablist' } : {})}
  >
    {tabs.map(tab => {
      const active = tab.id === activeTab;
      return (
        <button
          key={tab.id}
          type="button"
          {...(variant === 'tabs'
            ? { role: 'tab', 'aria-selected': active }
            : { 'aria-current': active ? 'page' : undefined })}
          onClick={() => onTabChange(tab.id)}
          className={`min-h-11 whitespace-nowrap rounded px-2 text-[10px] font-bold ${
            active ? 'bg-carbon text-lienzo' : 'text-carbon/55 hover:bg-carbon/5'
          }`}
        >
          {tab.label}
        </button>
      );
    })}
  </nav>
);

export default DiagramTabBar;
