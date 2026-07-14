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
  const layoutClasses = layout === 'overlay'
    ? 'pointer-events-none absolute left-4 top-4 z-10 max-w-[calc(100%-8rem)] border-l-2 border-ocre/70 pl-3 text-lg text-carbon/80 select-none'
    : 'relative text-2xl text-carbon sm:text-3xl';

  return (
    <div
      className={`${layoutClasses} font-serif font-semibold leading-none tracking-tight ${className}`}
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

  return (
    <aside
      className={`${layoutClasses} max-w-[min(30rem,calc(100%-2rem))] min-w-[12rem] border-l-2 border-ocre/70 px-3 py-2 font-serif text-xs leading-relaxed text-carbon/75 select-none ${className}`}
      data-diagram-info-panel
      data-layout={layout}
      data-position={position}
    >
      {title && (
        <div className="mb-1 font-serif text-sm font-semibold leading-tight text-carbon">
          {title}
        </div>
      )}
      {children}
    </aside>
  );
};
