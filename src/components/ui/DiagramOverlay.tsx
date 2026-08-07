import React from 'react';

interface DiagramTitleProps {
  children: React.ReactNode;
  layout?: 'overlay' | 'inline';
  className?: string;
  /** Authored desktop font size in px. Defaults: overlay 18, inline 24. */
  fontSize?: number;
}

/**
 * DiagramTitle — Componente estandarizado para mostrar el título en la esquina superior izquierda de un diagrama.
 * Hereda los estilos Arts & Crafts de Matematika de forma unificada.
 * El tamaño se escala vía CSS (`cqw`) desde el px de escritorio autorado.
 */
export const DiagramTitle: React.FC<DiagramTitleProps> = ({ children, layout = 'overlay', className = "", fontSize }) => {
  const authoredPx = fontSize ?? (layout === 'overlay' ? 18 : 24);
  const layoutClasses = layout === 'overlay'
    ? 'pointer-events-none absolute left-4 top-4 z-10 max-w-[calc(100%-8rem)] border-l-2 border-ocre/70 pl-3 text-carbon/80 select-none'
    : 'relative text-carbon font-bold';

  return (
    <div
      className={`${layoutClasses} font-diagram font-semibold leading-tight tracking-normal ${className}`}
      data-diagram-title
      data-layout={layout}
      style={{ '--diagram-authored-font-size': `${authoredPx}px` } as React.CSSProperties}
    >
      {children}
    </div>
  );
};

interface DiagramInfoPanelProps {
  title?: string;
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  layout?: 'overlay' | 'inline';
  blockLayout?: 'stack' | 'columns';
  className?: string;
  /** Authored desktop body font size in px. Default 14. */
  fontSize?: number;
  children: React.ReactNode;
}

/**
 * DiagramInfoPanel — Panel flotante estandarizado para mostrar fórmulas, ecuaciones o datos en tiempo real
 * dentro de las simulaciones y diagramas. Soporta modo claro/oscuro de forma automática.
 */
export const DiagramInfoPanel: React.FC<DiagramInfoPanelProps> = ({
  title,
  position = 'bottom-right',
  layout = 'overlay',
  blockLayout = 'stack',
  className = "",
  fontSize = 14,
  children
}) => {
  const positionStyle: React.CSSProperties = layout === 'overlay' ? {
    top: (position === 'top-left' || position === 'top-right')
      ? 'calc(var(--diagram-safe-top, 3.5rem) + 0.5rem)'
      : undefined,
    bottom: (position === 'bottom-left' || position === 'bottom-right')
      ? 'calc(var(--diagram-safe-bottom, 1rem) + 0.5rem)'
      : undefined,
    left: (position === 'top-left' || position === 'bottom-left')
      ? 'calc(var(--diagram-safe-left, 1rem) + 0.5rem)'
      : undefined,
    right: (position === 'top-right' || position === 'bottom-right')
      ? 'calc(var(--diagram-safe-right, 1rem) + 0.5rem)'
      : undefined,
  } : {};

  const layoutClasses = layout === 'overlay'
    ? 'absolute z-10 bg-lienzo/90 backdrop-blur-[2px]'
    : 'relative w-full bg-transparent';

  const blockLayoutClasses = blockLayout === 'columns'
    ? 'flex flex-row flex-wrap gap-3 sm:gap-4 items-start'
    : 'flex flex-col space-y-1.5 sm:space-y-2';

  return (
    <aside
      className={`${layoutClasses} max-w-[min(36rem,calc(100%-1.5rem))] min-w-[10rem] border-l-2 border-ocre/70 px-2.5 py-1.5 sm:px-3.5 sm:py-2 font-diagram leading-relaxed text-carbon/80 select-none ${className}`}
      data-diagram-info-panel
      data-layout={layout}
      data-block-layout={blockLayout}
      data-position={position}
      style={{ '--diagram-authored-font-size': `${fontSize}px`, ...positionStyle } as React.CSSProperties}
    >
      {title && (
        <div className="mb-1 font-diagram font-semibold leading-tight text-carbon" style={{ fontSize: '1.15em' }}>
          {title}
        </div>
      )}
      <div className={blockLayoutClasses}>
        {children}
      </div>
    </aside>
  );
};
