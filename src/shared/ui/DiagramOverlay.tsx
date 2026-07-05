import React from 'react';

interface DiagramTitleProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * DiagramTitle — Componente estandarizado para mostrar el título en la esquina superior izquierda de un diagrama.
 * Hereda los estilos Arts & Crafts de Matematika de forma unificada.
 */
export const DiagramTitle: React.FC<DiagramTitleProps> = ({ children, className = "" }) => {
  return (
    <div className={`absolute top-3 left-3 z-10 text-[10px] font-sans text-pizarra/50 dark:text-lienzo/40 uppercase tracking-wider select-none ${className}`}>
      {children}
    </div>
  );
};

interface DiagramInfoPanelProps {
  title?: string;
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
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
  className = "",
  children
}) => {
  // Mapear posición física a clases CSS absolutas
  const positionClasses = {
    'top-left': 'top-3 left-3',
    'top-right': 'top-3 right-3',
    'bottom-left': 'bottom-4 left-4',
    'bottom-right': 'bottom-4 right-4',
  };

  return (
    <div className={`absolute ${positionClasses[position]} z-10 bg-lienzo/90 dark:bg-carbon/95 backdrop-blur-sm border border-carbon/15 dark:border-lienzo/15 p-4 font-serif text-[11px] text-carbon/80 dark:text-lienzo/80 shadow-sm leading-relaxed min-w-[210px] rounded-sm select-none ${className}`}>
      {title && (
        <div className="font-sans font-bold text-[8px] uppercase tracking-wider text-carbon/40 dark:text-lienzo/30 mb-2 border-b border-carbon/10 dark:border-lienzo/10 pb-1">
          {title}
        </div>
      )}
      {children}
    </div>
  );
};
