import React, { useEffect } from 'react';
import { useDynamicVarStore } from '../../store/DynamicVarStore';
import { KatexText } from '../ui/KatexText';

interface DeslizadorEnLineProps {
  /** Nombre de la variable (ej. "n", "x") */
  name: string;
  /** Valor mínimo */
  min: number;
  /** Valor máximo */
  max: number;
  /** Valor inicial */
  initial?: number;
  /** Salto entre valores */
  step?: number;
  /** Etiqueta a mostrar antes del deslizador */
  label?: string;
}

/**
 * DeslizadorEnLine.tsx
 * 
 * Componente que permite modificar una variable global interactiva.
 * Muy útil para ver cómo cambia una fórmula al variar un parámetro.
 */
export const DeslizadorEnLine: React.FC<DeslizadorEnLineProps> = ({
  name,
  min,
  max,
  initial,
  step = 1,
  label
}) => {
  const { vars, setVar } = useDynamicVarStore();
  const value = vars[name] ?? initial ?? min;

  // Registrar valor inicial al montar
  useEffect(() => {
    if (vars[name] === undefined) {
      setVar(name, initial ?? min);
    }
  }, [name, initial, min, setVar, vars]);

  return (
    <span className="inline-flex items-center gap-3 bg-[#fdfbf7] border border-carbon/20 px-3 py-1 rounded-full shadow-sm font-sans my-1 group hover:border-carbon/40 transition-colors">
      {label && <span className="text-xs font-serif text-carbon/80"><KatexText text={label} /></span>}
      <span className="text-xs font-bold font-mono text-terracota">{value}</span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => setVar(name, parseFloat(e.target.value))}
        className="w-24 h-1 bg-carbon/10 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-carbon [&::-webkit-slider-thumb]:hover:scale-125 [&::-webkit-slider-thumb]:transition-transform"
      />
    </span>
  );
};

export const DynamicValue: React.FC<{ name: string, fallback: number }> = ({ name, fallback }) => {
  const val = useDynamicVarStore(state => state.vars[name]);
  return <span className="font-bold text-terracota transition-all duration-200">{val ?? fallback}</span>;
};
