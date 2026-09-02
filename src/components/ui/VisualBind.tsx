import React from 'react';
import { useMathStore } from '@/lib/page-context/MathStoreContext';
import { useDiagramTargetRegistry } from '@/lib/page-context/DiagramTargetRegistryContext';

interface VisualBindProps {
  element: string;
  color?: string;
  children: React.ReactNode;
}

const COLOR_MAP: Record<string, string> = {
  'terracota': 'var(--theme-terracota)',
  'canela': 'var(--theme-canela)',
  'mora': 'var(--theme-mora)',
  'carbon': 'var(--theme-carbon)',
  'granada': 'var(--theme-granada)',
  'ocre': 'var(--theme-ocre)',
  'pavo': 'var(--theme-pavo)',
  'musgo': 'var(--theme-musgo)',
};

export const VisualBind: React.FC<VisualBindProps> = ({ element, color = 'canela', children }) => {
  const setVariable = useMathStore(state => state.setVariable);
  const targetRegistry = useDiagramTargetRegistry();
  const cssColor = COLOR_MAP[color] ?? COLOR_MAP['canela'];
  const activate = () => setVariable('highlight', targetRegistry.resolve(element));

  const bgColor = `color-mix(in srgb, ${cssColor} 20%, var(--theme-lienzo) 80%)`;
  const lateralSpread = 2; // Píxeles que ensanchas a cada lado (cámbialo si usas otro valor)

  return (
    <span
      onClick={activate}
      onMouseEnter={activate}
      onMouseLeave={() => setVariable('highlight', null)}
      onFocus={activate}
      onBlur={() => setVariable('highlight', null)}
      onKeyDown={(event) => {
        if (event.key !== 'Enter' && event.key !== ' ') return;
        event.preventDefault();
        activate();
      }}
      role="button"
      tabIndex={0}
      aria-label={`Resaltar ${element} en el diagrama`}
      className="cursor-pointer transition-colors rounded-none py-[1px] font-bold text-carbon shadow-sm box-decoration-clone"
      style={{
        backgroundColor: bgColor,
        // 1. El fondo se ensancha lateralSpread píxeles a izquierda y derecha
        boxShadow: [
          // Ala izquierda (fondo)
          `-${lateralSpread}px 0 0 0 ${bgColor}`,
          // Ala derecha (fondo)
          `${lateralSpread}px 0 0 0 ${bgColor}`,
          // Prolongación borde abajo a la izquierda (offset-x negativo, offset-y hacia el borde)
          `-${lateralSpread}px 1.5px 0 0 ${cssColor}`,
          // Prolongación borde abajo a la derecha
          `${lateralSpread}px 1.5px 0 0 ${cssColor}`,
        ].join(', '),
      }}
      title={`Resaltar '${element}' en el gráfico`}
    >
      {children}
    </span>
  );
};

export const InteractiveElement: React.FC<Omit<VisualBindProps, 'element'> & { target: string }> = ({ target, color, children }) => (
  <VisualBind element={target} color={color}>{children}</VisualBind>
);
