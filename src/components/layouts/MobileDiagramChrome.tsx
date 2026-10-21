interface MobileDiagramToolbarProps {
  diagramId: string;
  isExpanded: boolean;
  onToggle: () => void;
}

import { useI18n } from '@/i18n';

export function MobileDiagramToolbar({
  diagramId,
  isExpanded,
  onToggle,
}: MobileDiagramToolbarProps) {
  const { t } = useI18n();
  const accessibleLabel = isExpanded ? t('common', 'hideDiagram') : t('common', 'showDiagram');

  return (
    <div className="mobile-diagram-toolbar">
      <button
        type="button"
        className="mobile-diagram-toggle"
        aria-controls={diagramId}
        aria-expanded={isExpanded}
        aria-label={accessibleLabel}
        onClick={onToggle}
      >
        {isExpanded ? t('common', 'hide') : t('common', 'showDiagram')}
        <span className="mobile-diagram-toggle__chevron" aria-hidden="true">⌃</span>
      </button>
    </div>
  );
}
