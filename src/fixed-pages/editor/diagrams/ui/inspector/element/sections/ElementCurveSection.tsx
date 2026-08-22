import React from 'react';
import type { ElementPanelProps } from '../../types';
import { parseOptionalNumber } from '../../../workbenchSelection';

/** Propiedades: expression, xExpression, yExpression, domain, areaFill, refs[0] para semiplano */
export const ElementCurveSection: React.FC<ElementPanelProps> = ({
  model,
  element,
  onUpdateElement,
}) => (
  <div className="space-y-3">
    {element.kind === 'functionCurve' && (
      <div>
        <label className="block text-[11px] font-bold text-carbon/75 tracking-tight mb-1">
          Expresión <code className="font-mono text-[10px] text-canela">f(x)</code>
        </label>
        <input
          type="text"
          aria-label="Expresión $f(x)$"
          value={element.properties?.expression || ''}
          onChange={e =>
            onUpdateElement(element.id, {
              properties: { ...(element.properties || {}), expression: e.target.value },
            })
          }
          placeholder="ej. sin(x) o x^2 - 2*x + 1"
          className="w-full rounded-lg border border-carbon/15 bg-lienzo px-3 py-1.5 font-mono text-xs font-bold text-carbon shadow-2xs transition-colors focus:border-canela focus:outline-none focus:ring-2 focus:ring-canela/20 placeholder-carbon/30"
        />
      </div>
    )}

    {element.kind === 'parametricCurve' && (
      <div className="grid grid-cols-2 gap-2.5">
        <div>
          <label className="block text-[11px] font-bold text-carbon/75 tracking-tight mb-1">
            Expresión <code className="font-mono text-[10px] text-canela">x(t)</code>
          </label>
          <input
            type="text"
            aria-label="Expresión $x(t)$"
            value={element.properties?.xExpression || ''}
            onChange={e =>
              onUpdateElement(element.id, {
                properties: { ...(element.properties || {}), xExpression: e.target.value },
              })
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
            value={element.properties?.yExpression || ''}
            onChange={e =>
              onUpdateElement(element.id, {
                properties: { ...(element.properties || {}), yExpression: e.target.value },
              })
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
          value={element.properties?.domain?.[0] ?? -5}
          onChange={e => {
            const minVal = parseOptionalNumber(e.target.value, -5);
            const maxVal = element.properties?.domain?.[1] ?? 5;
            onUpdateElement(element.id, {
              properties: { ...(element.properties || {}), domain: [minVal, maxVal] },
            });
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
          value={element.properties?.domain?.[1] ?? 5}
          onChange={e => {
            const minVal = element.properties?.domain?.[0] ?? -5;
            const maxVal = parseOptionalNumber(e.target.value, 5);
            onUpdateElement(element.id, {
              properties: { ...(element.properties || {}), domain: [minVal, maxVal] },
            });
          }}
          className="w-full rounded-lg border border-carbon/15 bg-lienzo px-3 py-1.5 text-xs text-carbon shadow-2xs transition-colors focus:border-canela focus:outline-none focus:ring-2 focus:ring-canela/20"
        />
      </div>
    </div>

    <div className="pt-2.5 border-t border-carbon/10 space-y-2.5">
      <div>
        <label className="block text-[11px] font-bold text-carbon/75 tracking-tight mb-1">Relleno de Área bajo la Curva</label>
        <select
          value={element.properties?.areaFill || 'none'}
          onChange={e =>
            onUpdateElement(element.id, {
              properties: {
                ...(element.properties || {}),
                areaFill: e.target.value as 'none' | 'interior' | 'half-plane',
              },
            })
          }
          className="w-full rounded-lg border border-carbon/15 bg-lienzo px-3 py-1.5 text-xs font-bold text-carbon shadow-2xs transition-colors focus:border-canela focus:outline-none focus:ring-2 focus:ring-canela/20 cursor-pointer"
        >
          <option value="none">Sin relleno de área</option>
          <option value="interior">Relleno hasta el eje X (Interior)</option>
          <option value="half-plane">Relleno de semiplano respecto a punto</option>
        </select>
      </div>

      {element.properties?.areaFill === 'half-plane' && (
        <div className="p-2.5 rounded-lg border border-canela/20 bg-canela/5 space-y-1">
          <label className="block text-[10px] font-bold text-canela uppercase tracking-wider mb-1">Punto de Referencia del Semiplano</label>
          <select
            value={element.refs[0] || ''}
            onChange={e => {
              const nextRefs = [e.target.value, ...element.refs.slice(1)];
              onUpdateElement(element.id, { refs: nextRefs });
            }}
            className="w-full rounded-md border border-canela/20 bg-lienzo px-2.5 py-1 text-xs font-mono font-bold text-carbon focus:border-canela focus:outline-none"
          >
            <option value="">-- Seleccionar punto --</option>
            {model.points.map(p => (
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
