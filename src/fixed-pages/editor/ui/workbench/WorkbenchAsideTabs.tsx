import React from 'react';

export type WorkbenchAsideTab = {
  id: string;
  label: string;
  endAdornment?: React.ReactNode;
};

export interface WorkbenchAsideTabsProps {
  tabs: WorkbenchAsideTab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  children: React.ReactNode;
  trailing?: React.ReactNode;
  className?: string;
  'aria-label'?: string;
}

export const WorkbenchAsideTabs: React.FC<WorkbenchAsideTabsProps> = ({
  tabs,
  activeTab,
  onTabChange,
  children,
  trailing,
  className = '',
  'aria-label': ariaLabel = 'Secciones del panel',
}) => (
  <div className={`flex h-full w-full flex-col overflow-hidden ${className}`.trim()}>
    <div className="flex shrink-0 items-center border-b border-carbon/10 bg-carbon/5 p-1" role="tablist" aria-label={ariaLabel}>
      {tabs.map(tab => {
        const active = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onTabChange(tab.id)}
            className={`relative flex-1 rounded-lg py-1.5 text-xs font-bold transition-all cursor-pointer ${
              active ? 'bg-lienzo text-carbon shadow-2xs' : 'text-carbon/60 hover:text-carbon'
            }`}
          >
            {tab.label}
            {tab.endAdornment}
          </button>
        );
      })}
      {trailing}
    </div>
    <div className="relative z-0 min-h-0 flex-1 overflow-x-visible overflow-y-auto">{children}</div>
  </div>
);

export default WorkbenchAsideTabs;
