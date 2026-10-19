import React from 'react';
import { Panel } from '@/fixed-pages/editor/ui/primitives';

export interface DiagramPanelProps {
  title: string;
  badge?: string;
  collapsible?: boolean;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
  className?: string;
}

/** The shared Panel; `badge` becomes the italic aside after the title. */
export const DiagramPanel: React.FC<DiagramPanelProps> = ({ badge, ...props }) => (
  <Panel meta={badge} {...props} />
);

export default DiagramPanel;
