import React from 'react';
import { Tabs } from '../primitives';

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
    <div className="flex shrink-0 items-center gap-1 px-2">
      <Tabs
        className="min-w-0 flex-1 gap-3"
        aria-label={ariaLabel}
        activeTab={activeTab}
        onTabChange={onTabChange}
        tabs={tabs.map(tab => ({ id: tab.id, label: <>{tab.label}{tab.endAdornment}</> }))}
      />
      {trailing}
    </div>
    <div className="relative z-0 min-h-0 flex-1 overflow-x-visible overflow-y-auto">{children}</div>
  </div>
);

export default WorkbenchAsideTabs;
