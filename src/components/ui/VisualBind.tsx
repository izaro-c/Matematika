import React from 'react';
import { useLessonStore } from '../../store/LessonStore';

/**
 * Propiedades del Enlace Visual
 */
interface VisualBindProps {
  /** Nombre del elemento a resaltar en el gráfico/simulador conectado */
  element: string;
  /** Color temático (terracota, salvia, pizarra, carbon, granada) */
  color?: string;
  children: React.ReactNode;
}

/**
 * Componente similar a HighlightLink pero con diseño más compacto y sutil,
 * usado específicamente dentro de párrafos densos o demostraciones formales 
 * para vincular texto a partes específicas de un diagrama cercano.
 */
export const VisualBind: React.FC<VisualBindProps> = ({ element, color = 'salvia', children }) => {
  const { setActiveStep } = useLessonStore();

  // Mapeamos los nombres simplificados a variables CSS del sistema de diseño
  const colorMap: Record<string, string> = {
    'terracota': 'var(--theme-terracota)',
    'salvia': 'var(--theme-salvia)',
    'pizarra': 'var(--theme-pizarra)',
    'carbon': 'var(--theme-carbon)',
    'granada': 'var(--theme-granada)',
  };

  const cssColor = colorMap[color] || colorMap['salvia'];

  return (
    <span 
      onClick={() => setActiveStep(element)}
      onMouseEnter={() => setActiveStep(element)}
      onMouseLeave={() => setActiveStep(null)}
      className="cursor-pointer border-b-2 transition-colors rounded-none px-[4px] py-[2px] font-bold text-carbon shadow-sm inline-block mx-1"
      style={{
        borderColor: cssColor,
        backgroundColor: `color-mix(in srgb, ${cssColor} 20%, transparent)`,
      }}
      title={`Resaltar '${element}' en el gráfico`}
    >
      {children}
    </span>
  );
};
