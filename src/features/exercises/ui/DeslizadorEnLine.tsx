import React, { useEffect } from 'react';
import { useDynamicVarStore } from '@/features/dynamic-vars/DynamicVarStore';
import { KatexText } from '@/shared/ui/KatexText';

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
    <span className="inline-flex items-center gap-2 bg-lienzo border border-carbon/20 px-2 py-0.5 font-serif my-1 transition-colors align-middle relative top-[-1px]">
      {label && <span className="text-[11px] font-serif italic text-carbon/80"><KatexText text={label} /></span>}
      <span className="text-[11px] font-bold text-terracota mr-1">{value}</span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => setVar(name, parseFloat(e.target.value))}
        className="w-20 h-px bg-carbon/40 appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-[4px] [&::-webkit-slider-thumb]:h-[12px] [&::-webkit-slider-thumb]:bg-carbon [&::-webkit-slider-thumb]:hover:bg-terracota [&::-webkit-slider-thumb]:transition-colors"
      />
    </span>
  );
};

/**
 * Componente de solo lectura para renderizar el valor actual de una variable global.
 */
export const DynamicValue: React.FC<{ name: string, fallback: number }> = ({ name, fallback }) => {
  const val = useDynamicVarStore(state => state.vars[name]);
  return <span className="font-bold text-terracota transition-all duration-200">{val ?? fallback}</span>;
};
