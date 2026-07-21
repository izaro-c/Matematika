import React from 'react';

interface DiagramNativeLabelEditorProps {
  label: string;
  showLabel: boolean;
  ariaLabel?: string;
  sizeAriaLabel?: string;
  labelSize?: number;
  labelOffset?: [number, number];
  labelPosition?: number;
  showSizeControl?: boolean;
  showOffsetControl?: boolean;
  showPositionControl?: boolean;
  onChangeLabel: (label: string) => void;
  onChangeShowLabel: (show: boolean) => void;
  onChangeStyle: (update: { labelSize?: number; labelOffset?: [number, number]; labelPosition?: number }) => void;
}

export const DiagramNativeLabelEditor: React.FC<DiagramNativeLabelEditorProps> = ({
  label,
  showLabel,
  ariaLabel = "Mostrar etiqueta en el lienzo",
  sizeAriaLabel = "Tamaño de la etiqueta nativa",
  labelSize,
  labelOffset,
  labelPosition,
  showSizeControl = true,
  showOffsetControl = true,
  showPositionControl = false,
  onChangeLabel,
  onChangeShowLabel,
  onChangeStyle,
}) => {
  return (
    <div>
      <label className="block text-xs font-bold text-carbon mb-1">Nombre en el editor</label>
      <input
        className="w-full rounded border border-carbon/15 bg-lienzo p-1.5 text-xs"
        value={label}
        onChange={(e) => onChangeLabel(e.target.value)}
      />
      <span className="mt-1 block text-[10px] text-carbon/45">
        Admite LaTeX entre <code>$...$</code> o <code>$$...$$</code>. El nombre se conserva para el editor, la accesibilidad y los enlaces aunque no se dibuje.
      </span>

      <label className="mt-2 flex items-center gap-2 text-xs font-bold text-carbon">
        <input
          type="checkbox"
          aria-label={ariaLabel}
          checked={showLabel}
          onChange={(event) => onChangeShowLabel(event.target.checked)}
        />
        Mostrar etiqueta en el lienzo
      </label>

      {showLabel && (showSizeControl || showOffsetControl || showPositionControl) && (
        <div className="mt-2 space-y-2 rounded border border-ocre/20 bg-ocre/5 p-2">
          {showSizeControl && (
            <label className="block text-xs font-bold text-carbon">
              Tamaño de la etiqueta nativa
              <input
                type="number"
                min="6"
                max="72"
                step="1"
                aria-label={sizeAriaLabel}
                className="mt-1 w-full rounded border border-carbon/15 bg-lienzo p-1.5 text-xs"
                value={labelSize ?? 19}
                onChange={(event) => onChangeStyle({ labelSize: Number(event.target.value) })}
              />
            </label>
          )}

          {showPositionControl && (
            <label className="block text-xs font-bold text-carbon">
              Posición en la recta
              <input
                type="number"
                step="0.05"
                aria-label="Posición de la etiqueta en la recta"
                className="mt-1 w-full rounded border border-carbon/15 bg-lienzo p-1.5 text-xs"
                value={labelPosition ?? 0.5}
                onChange={(event) => onChangeStyle({ labelPosition: Number(event.target.value) })}
              />
              <span className="mt-1 block text-[10px] leading-relaxed text-carbon/45">
                0 es el primer punto, 1 es el segundo. Puedes usar valores negativos o mayores que 1.
              </span>
            </label>
          )}

          {showOffsetControl && (
            <div className="grid grid-cols-2 gap-2">
              <label className="text-xs font-bold text-carbon">
                Separación X
                <input
                  type="number"
                  step="1"
                  aria-label="Separación horizontal de la etiqueta"
                  className="mt-1 w-full rounded border border-carbon/15 bg-lienzo p-1.5 text-xs"
                  value={labelOffset?.[0] ?? 10}
                  onChange={(event) =>
                    onChangeStyle({ labelOffset: [Number(event.target.value), labelOffset?.[1] ?? 10] })
                  }
                />
              </label>
              <label className="text-xs font-bold text-carbon">
                Separación Y
                <input
                  type="number"
                  step="1"
                  aria-label="Separación vertical de la etiqueta"
                  className="mt-1 w-full rounded border border-carbon/15 bg-lienzo p-1.5 text-xs"
                  value={labelOffset?.[1] ?? 10}
                  onChange={(event) =>
                    onChangeStyle({ labelOffset: [labelOffset?.[0] ?? 10, Number(event.target.value)] })
                  }
                />
              </label>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
