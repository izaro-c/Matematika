import React from 'react';
import { isCurveObject, type CurvePath } from '@/diagrams';
import type { ElementPanelProps } from '../../types';
import { parseOptionalNumber } from '../../../workbenchSelection';
import { modelPoints } from '@/fixed-pages/editor/diagrams/model';

type CurveGeometryPatch = Partial<{
  expression: string;
  x: string;
  y: string;
  domain: [number, number];
  areaFill: 'none' | 'interior' | 'half-plane';
  areaSide: string | undefined;
}>;

/** Aplica un parche a la geometría de una curva; las claves ajenas a su tipo se ignoran. */
function withCurveGeometry(curve: CurvePath, patch: CurveGeometryPatch): CurvePath {
  const geometry = curve.geometry;
  const { areaSide, ...rest } = patch;
  const next = { ...geometry } as Record<string, unknown>;
  Object.entries(rest).forEach(([key, value]) => {
    if (geometry.type === 'function' && (key === 'x' || key === 'y')) return;
    if (geometry.type === 'parametric' && key === 'expression') return;
    next[key] = value;
  });
  if ('areaSide' in patch) {
    if (areaSide) next.areaSide = areaSide;
    else delete next.areaSide;
  }
  return { ...curve, geometry: next as CurvePath['geometry'] };
}

/** Propiedades: expression, xExpression, yExpression, domain, areaFill, refs[0] para semiplano */
export const ElementCurveSection: React.FC<ElementPanelProps> = ({
  model,
  element,
  onUpdateElement,
}) => {
  if (!isCurveObject(element)) return null;
  const geometry = element.geometry;
  const update = (patch: CurveGeometryPatch) => onUpdateElement(element.id, current => (
    isCurveObject(current) ? withCurveGeometry(current, patch) : current
  ));
  return (
  <div className="space-y-3">
    {geometry.type === 'function' && (
      <div>
        <label className="block text-[11px] font-bold text-carbon/75 tracking-tight mb-1">
          Expresión <code className="font-mono text-[10px] text-canela">f(x)</code>
        </label>
        <input
          type="text"
          aria-label="Expresión $f(x)$"
          value={geometry.type === 'function' ? geometry.expression : ''}
          onChange={e =>
            update({ expression: e.target.value })
          }
          placeholder="ej. sin(x) o x^2 - 2*x + 1"
          className="w-full rounded-lg border border-carbon/15 bg-lienzo px-3 py-1.5 font-mono text-xs font-bold text-carbon shadow-2xs transition-colors focus:border-canela focus:outline-none focus:ring-2 focus:ring-canela/20 placeholder-carbon/30"
        />
      </div>
    )}

    {geometry.type === 'parametric' && (
      <div className="grid grid-cols-2 gap-2.5">
        <div>
          <label className="block text-[11px] font-bold text-carbon/75 tracking-tight mb-1">
            Expresión <code className="font-mono text-[10px] text-canela">x(t)</code>
          </label>
          <input
            type="text"
            aria-label="Expresión $x(t)$"
            value={geometry.type === 'parametric' ? geometry.x : ''}
            onChange={e =>
              update({ x: e.target.value })
            }
            placeholder="ej. cos(t)"
            className="w-full rounded-lg border border-carbon/15 bg-lienzo px-3 py-1.5 font-mono text-xs font-bold text-carbon shadow-2xs transition-colors focus:border-canela focus:outline-none focus:ring-2 focus:ring-canela/20 placeholder-carbon/30"
          />
        </div>
        <div>
          <label className="block text-[11px] font-bold text-carbon/75 tracking-tight mb-1">
            Expresión <code className="font-mono text-[10px] text-canela">y(t)</code>
          </label>
          <input
            type="text"
            aria-label="Expresión $y(t)$"
            value={geometry.type === 'parametric' ? geometry.y : ''}
            onChange={e =>
              update({ y: e.target.value })
            }
            placeholder="ej. sin(t)"
            className="w-full rounded-lg border border-carbon/15 bg-lienzo px-3 py-1.5 font-mono text-xs font-bold text-carbon shadow-2xs transition-colors focus:border-canela focus:outline-none focus:ring-2 focus:ring-canela/20 placeholder-carbon/30"
          />
        </div>
      </div>
    )}

    <div className="grid grid-cols-2 gap-2.5 pt-1">
      <div>
        <label className="block text-[11px] font-bold text-carbon/75 tracking-tight mb-1">
          Mínimo Dominio
        </label>
        <input
          type="number"
          step="0.5"
          aria-label="Mínimo Dominio"
          value={geometry.domain[0]}
          onChange={e => {
            const minVal = parseOptionalNumber(e.target.value, -5);
            const maxVal = geometry.domain[1];
            update({ domain: [minVal, maxVal] });
          }}
          className="w-full rounded-lg border border-carbon/15 bg-lienzo px-3 py-1.5 text-xs text-carbon shadow-2xs transition-colors focus:border-canela focus:outline-none focus:ring-2 focus:ring-canela/20"
        />
      </div>
      <div>
        <label className="block text-[11px] font-bold text-carbon/75 tracking-tight mb-1">
          Máximo Dominio
        </label>
        <input
          type="number"
          step="0.5"
          aria-label="Máximo Dominio"
          value={geometry.domain[1]}
          onChange={e => {
            const minVal = geometry.domain[0];
            const maxVal = parseOptionalNumber(e.target.value, 5);
            update({ domain: [minVal, maxVal] });
          }}
          className="w-full rounded-lg border border-carbon/15 bg-lienzo px-3 py-1.5 text-xs text-carbon shadow-2xs transition-colors focus:border-canela focus:outline-none focus:ring-2 focus:ring-canela/20"
        />
      </div>
    </div>

    <div className="pt-2.5 border-t border-carbon/10 space-y-2.5">
      <div>
        <label className="block text-[11px] font-bold text-carbon/75 tracking-tight mb-1">Relleno de Área bajo la Curva</label>
        <select
          value={geometry.areaFill || 'none'}
          onChange={e =>
            update({ areaFill: e.target.value as 'none' | 'interior' | 'half-plane', })
          }
          className="w-full rounded-lg border border-carbon/15 bg-lienzo px-3 py-1.5 text-xs font-bold text-carbon shadow-2xs transition-colors focus:border-canela focus:outline-none focus:ring-2 focus:ring-canela/20 cursor-pointer"
        >
          <option value="none">Sin relleno de área</option>
          <option value="interior">Relleno hasta el eje X (Interior)</option>
          <option value="half-plane">Relleno de semiplano respecto a punto</option>
        </select>
      </div>

      {geometry.areaFill === 'half-plane' && (
        <div className="p-2.5 rounded-lg border border-canela/20 bg-canela/5 space-y-1">
          <label className="block text-[10px] font-bold text-canela uppercase tracking-wider mb-1">Punto de Referencia del Semiplano</label>
          <select
            value={geometry.areaSide || ''}
            onChange={e => update({ areaSide: e.target.value || undefined })}
            className="w-full rounded-md border border-canela/20 bg-lienzo px-2.5 py-1 text-xs font-mono font-bold text-carbon focus:border-canela focus:outline-none"
          >
            <option value="">-- Seleccionar punto --</option>
            {modelPoints(model).map(p => (
              <option key={p.id} value={p.id}>
                Punto {p.label || p.id} ({p.id})
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  </div>
  );
};
