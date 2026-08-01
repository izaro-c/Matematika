import React from 'react';
import type { ElementPanelProps } from '../../types';

/** Propiedades: expression, xExpression, yExpression, domain, areaFill, refs[0] para semiplano */
export const ElementCurveSection: React.FC<ElementPanelProps> = ({
  model,
  element,
  onUpdateElement,
}) => (
  <div className="p-2.5 space-y-2 bg-carbon/5 rounded-xl border border-carbon/10 shadow-2xs">
    {element.kind === 'functionCurve' && (
      <div>
        <label className="block text-[11px] font-bold text-carbon/70 mb-0.5">
          Expresión $f(x)$
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
            className="mt-0.5 w-full bg-lienzo border border-carbon/20 rounded px-2 py-1 text-xs font-mono font-bold text-carbon"
          />
        </label>
      </div>
    )}

    {element.kind === 'parametricCurve' && (
      <>
        <div>
          <label className="block text-[11px] font-bold text-carbon/70 mb-0.5">
            Expresión $x(t)$
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
              className="mt-0.5 w-full bg-lienzo border border-carbon/20 rounded px-2 py-1 text-xs font-mono font-bold text-carbon"
            />
          </label>
        </div>
        <div>
          <label className="block text-[11px] font-bold text-carbon/70 mb-0.5">
            Expresión $y(t)$
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
              className="mt-0.5 w-full bg-lienzo border border-carbon/20 rounded px-2 py-1 text-xs font-mono font-bold text-carbon"
            />
          </label>
        </div>
      </>
    )}

    <div className="grid grid-cols-2 gap-2 pt-1">
      <div>
        <label className="block text-[10px] font-bold text-carbon/70 mb-0.5">
          Mínimo Dominio
          <input
            type="number"
            step="0.5"
            aria-label="Mínimo Dominio"
            value={element.properties?.domain?.[0] ?? -5}
            onChange={e => {
              const minVal = parseFloat(e.target.value) || -5;
              const maxVal = element.properties?.domain?.[1] ?? 5;
              onUpdateElement(element.id, {
                properties: { ...(element.properties || {}), domain: [minVal, maxVal] },
              });
            }}
            className="mt-0.5 w-full bg-lienzo border border-carbon/20 rounded px-2 py-1 text-xs text-carbon"
          />
        </label>
      </div>
      <div>
        <label className="block text-[10px] font-bold text-carbon/70 mb-0.5">
          Máximo Dominio
          <input
            type="number"
            step="0.5"
            aria-label="Máximo Dominio"
            value={element.properties?.domain?.[1] ?? 5}
            onChange={e => {
              const minVal = element.properties?.domain?.[0] ?? -5;
              const maxVal = parseFloat(e.target.value) || 5;
              onUpdateElement(element.id, {
                properties: { ...(element.properties || {}), domain: [minVal, maxVal] },
              });
            }}
            className="mt-0.5 w-full bg-lienzo border border-carbon/20 rounded px-2 py-1 text-xs text-carbon"
          />
        </label>
      </div>
    </div>

    <div className="pt-2 border-t border-carbon/10 space-y-2">
      <label className="block text-[11px] font-bold text-carbon/70 mb-0.5">Relleno de Área bajo la Curva</label>
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
        className="w-full bg-lienzo border border-carbon/20 rounded px-2 py-1 text-xs text-carbon font-bold"
      >
        <option value="none">Sin relleno de área</option>
        <option value="interior">Relleno hasta el eje X (Interior)</option>
        <option value="half-plane">Relleno de semiplano respecto a punto</option>
      </select>

      {element.properties?.areaFill === 'half-plane' && (
        <div className="p-2 bg-lienzo rounded border border-carbon/10 space-y-1">
          <label className="block text-[10px] font-bold text-salvia">Punto de Referencia del Semiplano (refs[0])</label>
          <select
            value={element.refs[0] || ''}
            onChange={e => {
              const nextRefs = [e.target.value, ...element.refs.slice(1)];
              onUpdateElement(element.id, { refs: nextRefs });
            }}
            className="w-full bg-carbon/5 border border-carbon/20 rounded px-1.5 py-0.5 text-xs text-carbon font-mono font-bold"
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
