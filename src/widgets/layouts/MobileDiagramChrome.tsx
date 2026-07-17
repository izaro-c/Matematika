import { useEffect, useRef, useState } from 'react';

interface MobileContentHeaderSeparatorProps {
  hasDiagram: boolean;
  isDiagramExpanded: boolean;
}

function getSeparatorModifier(hasDiagram: boolean, isDiagramExpanded: boolean) {
  if (!hasDiagram) return 'mobile-content-header-separator--empty';
  if (isDiagramExpanded) return 'mobile-content-header-separator--diagram-fallback';
  return 'mobile-content-header-separator--collapsed';
}

export function MobileContentHeaderSeparator({
  hasDiagram,
  isDiagramExpanded,
}: MobileContentHeaderSeparatorProps) {
  const separatorRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef(0);
  const [isDiagramLeaving, setIsDiagramLeaving] = useState(false);
  const modifier = getSeparatorModifier(hasDiagram, isDiagramExpanded);

  useEffect(() => {
    if (!hasDiagram || !isDiagramExpanded) return;

    const update = () => {
      frameRef.current = 0;
      const separator = separatorRef.current;
      const diagram = separator?.parentElement?.querySelector<HTMLElement>('.content-diagram, .codex-diagram');
      if (!separator || !diagram || window.innerWidth >= 1024) return;

      const isLeaving = diagram.getBoundingClientRect().top < separator.getBoundingClientRect().bottom - 1;
      setIsDiagramLeaving(isLeaving);
    };
    const scheduleUpdate = () => {
      if (frameRef.current === 0) frameRef.current = window.requestAnimationFrame(update);
    };

    scheduleUpdate();
    window.addEventListener('scroll', scheduleUpdate, { passive: true });
    window.addEventListener('resize', scheduleUpdate, { passive: true });
    return () => {
      window.removeEventListener('scroll', scheduleUpdate);
      window.removeEventListener('resize', scheduleUpdate);
      if (frameRef.current !== 0) window.cancelAnimationFrame(frameRef.current);
      frameRef.current = 0;
    };
  }, [hasDiagram, isDiagramExpanded]);

  return (
    <div
      ref={separatorRef}
      className={`mobile-content-header-separator ${modifier} ${isDiagramLeaving ? 'is-diagram-leaving' : ''}`}
      aria-hidden="true"
    />
  );
}

interface MobileDiagramToolbarProps {
  diagramId: string;
  isExpanded: boolean;
  onToggle: () => void;
}

export function MobileDiagramToolbar({
  diagramId,
  isExpanded,
  onToggle,
}: MobileDiagramToolbarProps) {
  const accessibleLabel = isExpanded ? 'Ocultar diagrama' : 'Mostrar diagrama';

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
        {isExpanded ? 'Ocultar' : 'Mostrar diagrama'}
        <span className="mobile-diagram-toggle__chevron" aria-hidden="true">⌃</span>
      </button>
    </div>
  );
}
