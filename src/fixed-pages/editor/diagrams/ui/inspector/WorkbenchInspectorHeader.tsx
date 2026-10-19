import React from 'react';
import { IconTrash } from '../toolbar/WorkbenchIcons';
import { useI18n } from '@/i18n';
import { Button } from '@/fixed-pages/editor/ui/primitives';

interface InspectorHeaderProps {
  title: string;
  colorClass: string;
  onDelete: () => void;
}

export const InspectorHeader: React.FC<InspectorHeaderProps> = ({ title, colorClass, onDelete }) => {
  const { t } = useI18n();
  return (
  <div className="flex items-center justify-between border-b border-carbon/10 pb-2">
    <div className="flex items-center space-x-2">
      <span className={`h-3 w-3 rounded-full border border-carbon/20 shrink-0 ${colorClass}`} />
      <h3 className="font-bold text-sm truncate max-w-[180px]">{title}</h3>
    </div>
    <Button size="sm" variant="danger" onClick={onDelete}>
      <IconTrash className="w-3.5 h-3.5" />
      <span>{t('editor.diagramInspector.delete')}</span>
    </Button>
  </div>
);
};
