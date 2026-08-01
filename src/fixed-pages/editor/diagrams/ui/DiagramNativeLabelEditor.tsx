import React from 'react';

interface DiagramNativeLabelEditorProps {
  label: string;
  visible: boolean;
  size: number;
  offset?: [number, number];
  position?: number | string;
  alongPath?: boolean;
  onVisibleChange: (visible: boolean) => void;
  onStyleChange: (update: { labelSize?: number; labelOffset?: [number, number]; labelPosition?: number | string }) => void;
}

const COMPASS_POSITIONS = [
  ['', 'Automática'],
  ['top', 'Arriba'],
  ['bot', 'Abajo'],
  ['lft', 'Izquierda'],
  ['rt', 'Derecha'],
  ['ulft', 'Arriba izquierda'],
  ['urt', 'Arriba derecha'],
  ['llft', 'Abajo izquierda'],
  ['lrt', 'Abajo derecha'],
] as const;

export const DiagramNativeLabelEditor: React.FC<DiagramNativeLabelEditorProps> = ({
  label,
  visible,
  size,
  offset = [0, 0],
  position,
  alongPath = false,
  onVisibleChange,
  onStyleChange,
}) => (
  <section className="border-t border-carbon/10 pt-3" aria-label={`Etiqueta nativa de ${label}`}>
    <label className="flex min-h-10 items-center gap-2 text-xs font-bold text-carbon">
      <input type="checkbox" aria-label={`Mostrar etiqueta nativa de ${label}`} checked={visible} onChange={event => onVisibleChange(event.target.checked)} />
      Mostrar nombre en el lienzo
    </label>
    {visible && <div className="mt-2 space-y-2">
      <div className="grid grid-cols-2 gap-2">
        <label className="text-[10px] font-bold text-carbon/60">Tamaño
          <input type="number" min="6" max="72" step="1" aria-label={`Tamaño de etiqueta de ${label}`} className="mt-1 min-h-10 w-full rounded border border-carbon/15 bg-lienzo px-2 text-xs" value={size} onChange={event => onStyleChange({ labelSize: Number(event.target.value) })} />
        </label>
        {alongPath ? <label className="text-[10px] font-bold text-carbon/60">Posición · {Math.round((typeof position === 'number' ? position : 0.5) * 100)}%
          <input type="range" min="0" max="1" step="0.01" aria-label={`Posición de etiqueta de ${label}`} className="mt-2 w-full accent-ocre" value={typeof position === 'number' ? position : 0.5} onChange={event => onStyleChange({ labelPosition: Number(event.target.value) })} />
        </label> : <label className="text-[10px] font-bold text-carbon/60">Posición
          <select aria-label={`Posición de etiqueta de ${label}`} className="mt-1 min-h-10 w-full rounded border border-carbon/15 bg-lienzo px-2 text-xs" value={typeof position === 'string' ? position : ''} onChange={event => onStyleChange({ labelPosition: event.target.value || undefined })}>
            {COMPASS_POSITIONS.map(([value, text]) => <option key={value} value={value}>{text}</option>)}
          </select>
        </label>}
      </div>
      <div className="grid grid-cols-2 gap-2">
        <label className="text-[10px] font-bold text-carbon/60">Desplazamiento X
          <input type="number" min="-200" max="200" step="1" aria-label={`Desplazamiento horizontal de etiqueta de ${label}`} className="mt-1 min-h-10 w-full rounded border border-carbon/15 bg-lienzo px-2 text-xs" value={offset[0]} onChange={event => onStyleChange({ labelOffset: [Number(event.target.value), offset[1]] })} />
        </label>
        <label className="text-[10px] font-bold text-carbon/60">Desplazamiento Y
          <input type="number" min="-200" max="200" step="1" aria-label={`Desplazamiento vertical de etiqueta de ${label}`} className="mt-1 min-h-10 w-full rounded border border-carbon/15 bg-lienzo px-2 text-xs" value={offset[1]} onChange={event => onStyleChange({ labelOffset: [offset[0], Number(event.target.value)] })} />
        </label>
      </div>
      <p className="text-[9px] leading-relaxed text-carbon/45">El desplazamiento se mide en píxeles y permite evitar solapes sin alterar la geometría.</p>
    </div>}
  </section>
);

export default DiagramNativeLabelEditor;
