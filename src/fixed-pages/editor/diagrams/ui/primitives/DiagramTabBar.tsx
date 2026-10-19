import React from 'react';
import { Tabs, type TabsProps } from '@/fixed-pages/editor/ui/primitives';

export interface DiagramTabItem {
  id: string;
  label: string;
}

export interface DiagramTabBarProps extends Omit<TabsProps, 'tabs' | 'variant'> {
  tabs: DiagramTabItem[];
  variant?: 'nav' | 'tabs';
}

export const DiagramTabBar: React.FC<DiagramTabBarProps> = ({ variant = 'nav', ...props }) => (
  <Tabs variant={variant} {...props} />
);

export default DiagramTabBar;
