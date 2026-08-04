import React from 'react';

interface DiagramTitleProps {
  children: React.ReactNode;
  layout?: 'overlay' | 'inline';
  className?: string;
}

/**
 * DiagramTitle — Componente estandarizado para mostrar el título en la esquina superior izquierda de un diagrama.
 * Hereda los estilos Arts & Crafts de Matematika de forma unificada.
 */
export const DiagramTitle: React.FC<DiagramTitleProps> = ({ children, layout = 'overlay', className = "" }) => {
  const hasCustomSize = className.includes('text-');
  const defaultSize = layout === 'overlay'
    ? 'pointer-events-none absolute left-4 top-4 z-10 max-w-[calc(100%-8rem)] border-l-2 border-ocre/70 pl-3 text-sm sm:text-base lg:text-lg text-carbon/80 select-none'
    : 'relative text-sm sm:text-xl lg:text-2xl text-carbon font-bold';

  const layoutClasses = hasCustomSize
    ? (layout === 'overlay' ? 'pointer-events-none absolute left-4 top-4 z-10 max-w-[calc(100%-8rem)] border-l-2 border-ocre/70 pl-3 select-none' : 'relative text-carbon')
    : defaultSize;

  return (
    <div
      className={`${layoutClasses} font-diagram font-semibold leading-tight tracking-normal ${className}`}
      data-diagram-title
      data-layout={layout}
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
  children
}) => {
  const positionClasses = {
    'top-left': 'top-14 left-4',
    'top-right': 'top-14 right-4',
    'bottom-left': 'bottom-4 left-4',
    'bottom-right': 'bottom-4 right-4',
  };
  const layoutClasses = layout === 'overlay'
    ? `absolute ${positionClasses[position]} z-10 bg-lienzo/90 backdrop-blur-[2px]`
    : 'relative w-full bg-transparent';

  const blockLayoutClasses = blockLayout === 'columns'
    ? 'flex flex-row flex-wrap gap-3 sm:gap-4 items-start'
    : 'flex flex-col space-y-1.5 sm:space-y-2';

  return (
    <aside
      className={`${layoutClasses} max-w-[min(36rem,calc(100%-1.5rem))] min-w-[10rem] border-l-2 border-ocre/70 px-2.5 py-1.5 sm:px-3.5 sm:py-2 font-diagram text-[11px] sm:text-xs lg:text-sm leading-relaxed text-carbon/80 select-none ${className}`}
      data-diagram-info-panel
      data-layout={layout}
      data-block-layout={blockLayout}
      data-position={position}
    >
      {title && (
        <div className="mb-1 font-diagram text-xs sm:text-sm font-semibold leading-tight text-carbon">
          {title}
        </div>
      )}
      <div className={blockLayoutClasses}>
        {children}
      </div>
    </aside>
  );
};
