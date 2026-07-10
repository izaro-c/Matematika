import React from 'react';
import { useMathStore } from '@/shared/lib/MathStoreContext';

interface VisualBindProps {
  element: string;
  color?: string;
  children: React.ReactNode;
}

const COLOR_MAP: Record<string, string> = {
  'terracota': 'var(--theme-terracota)',
  'salvia': 'var(--theme-salvia)',
  'pizarra': 'var(--theme-pizarra)',
  'carbon': 'var(--theme-carbon)',
  'granada': 'var(--theme-granada)',
  'ocre': 'var(--theme-ocre)',
  'pavo': 'var(--theme-pavo)',
  'musgo': 'var(--theme-musgo)',
};

export const VisualBind: React.FC<VisualBindProps> = ({ element, color = 'salvia', children }) => {
  const setVariable = useMathStore(state => state.setVariable);
  const cssColor = COLOR_MAP[color] ?? COLOR_MAP['salvia'];

  return (
    <span
      onClick={() => setVariable('highlight', element)}
      onMouseEnter={() => setVariable('highlight', element)}
      onMouseLeave={() => setVariable('highlight', null)}
      className="cursor-pointer border-b-2 transition-colors rounded-none px-[2px] py-[1px] font-bold text-carbon shadow-sm box-decoration-clone"
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

export const InteractiveElement: React.FC<Omit<VisualBindProps, 'element'> & { target: string }> = ({ target, color, children }) => (
  <VisualBind element={target} color={color}>{children}</VisualBind>
);
