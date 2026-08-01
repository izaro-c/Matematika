import React from 'react';
import type { VisualPoint } from '@/fixed-pages/editor/diagrams/model/types';
import { KatexText } from '@/components/ui/KatexText';
import { AccordionSection } from '../accordion';
import { InspectorHeader } from '../WorkbenchInspectorHeader';
import { PointLabelHelp } from '../help';
import { PALETTE_TOKENS } from '../paletteTokens';
import type { PointPanelProps } from '../types';
import { availableLayers, handleRenameId } from '../utils';
import { DiagramDerivedPositionEditor } from '@/fixed-pages/editor/diagrams/ui/DiagramDerivedPositionEditor';
import { DiagramNativeLabelEditor } from '@/fixed-pages/editor/diagrams/ui/DiagramNativeLabelEditor';
import { DiagramPointMovementAidsEditor } from '@/fixed-pages/editor/diagrams/ui/DiagramPointMovementAidsEditor';
import { supportElements } from '@/fixed-pages/editor/diagrams/model';
import { parseOptionalNumber } from '../../workbenchSelection';
import { ConstraintEditor } from '../../ConstraintEditor';

export const PointInspector: React.FC<PointPanelProps & {
  openAccordion: Record<string, boolean>;
  onToggleAccordion: (sec: string) => void;
}> = ({
  model,
  point,
  onUpdatePoint,
  onDeleteSelected,
  onUpdateModel,
  onSelectId,
  openAccordion,
  onToggleAccordion,
}) => {
  const colorToken = PALETTE_TOKENS.find(c => c.id === point.color) || PALETTE_TOKENS[0];
  const isFixed = point.fixed || point.constraint === 'fixed';
  const layers = availableLayers(model);
  const gliderSupports = supportElements(model);

  return (
    <div className="p-3 space-y-2 text-xs font-serif text-carbon">
      <InspectorHeader
        title={`Punto: ${point.id}`}
        colorClass={colorToken.bgClass}
        onDelete={() => onDeleteSelected(point.id)}
      />

      <AccordionSection sec="identity" title="Identidad & Etiqueta KaTeX" isOpen={openAccordion.identity} onToggle={onToggleAccordion}>
        <div className="p-2.5 space-y-2 bg-carbon/5 rounded-xl border border-carbon/10 shadow-2xs">
          <div>
            <label className="block text-[11px] font-bold text-carbon/70 mb-0.5">
              Identificador Técnico (ID)
              <input
                type="text"
                defaultValue={point.id}
                key={`id-input-${point.id}`}
                onBlur={e => handleRenameId(model, point.id, e.target.value, onUpdateModel, onSelectId)}
                onKeyDown={e => {
                  if (e.key === 'Enter') handleRenameId(model, point.id, e.currentTarget.value, onUpdateModel, onSelectId);
                }}
                className="mt-0.5 w-full bg-lienzo border border-carbon/20 rounded px-2 py-1 text-xs font-mono font-bold text-carbon"
                title="Presiona Enter o cambia el foco para confirmar renombrado"
              />
            </label>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-carbon/70 mb-0.5">
              Etiqueta Visual (KaTeX)
              <input
                type="text"
                value={point.label || ''}
                onChange={e => onUpdatePoint(point.id, { label: e.target.value })}
                placeholder="ej. $A$ o $P_1$"
                className="mt-0.5 w-full bg-lienzo border border-carbon/20 rounded px-2 py-1 text-xs text-carbon"
              />
            </label>
            {point.label && (
              <div className="mt-1.5 p-1.5 bg-carbon/5 rounded border border-carbon/10 flex items-center space-x-2">
                <span className="text-[10px] text-carbon/50 uppercase font-bold">Vista previa:</span>
                <KatexText text={point.label} className="text-xs font-bold text-salvia" />
              </div>
            )}
          </div>

          <DiagramNativeLabelEditor
            label={point.label}
            visible={point.showLabel !== false}
            size={point.style?.labelSize ?? 19}
            offset={point.style?.labelOffset}
            position={point.style?.labelPosition}
            onVisibleChange={showLabel => onUpdatePoint(point.id, { showLabel })}
            onStyleChange={style => onUpdatePoint(point.id, { style: { ...point.style, ...style } })}
          />

          <PointLabelHelp />
        </div>
      </AccordionSection>

      <AccordionSection sec="geometry" title="Geometría, Soporte & Coordenadas" isOpen={openAccordion.geometry} onToggle={onToggleAccordion}>
        <div className="p-2.5 space-y-2 bg-carbon/5 rounded-xl border border-carbon/10 shadow-2xs">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-[11px] font-medium text-carbon/70 mb-0.5">
                Coordenada X
                <input
                  type="number"
                  step="0.1"
                  value={point.x ?? 0}
                  onChange={e => onUpdatePoint(point.id, { x: parseOptionalNumber(e.target.value, point.x ?? 0) })}
                  className="mt-0.5 w-full bg-lienzo border border-carbon/20 rounded px-2 py-1 text-xs text-carbon"
                />
              </label>
            </div>
            <div>
              <label className="block text-[11px] font-medium text-carbon/70 mb-0.5">
                Coordenada Y
                <input
                  type="number"
                  step="0.1"
                  value={point.y ?? 0}
                  onChange={e => onUpdatePoint(point.id, { y: parseOptionalNumber(e.target.value, point.y ?? 0) })}
                  className="mt-0.5 w-full bg-lienzo border border-carbon/20 rounded px-2 py-1 text-xs text-carbon"
                />
              </label>
            </div>
          </div>

          <div className="pt-2 border-t border-carbon/10 space-y-2">
            <label className="block text-[11px] font-bold text-carbon/70">
              Tipo de Punto & Soporte
              <select
                value={point.constraint || (isFixed ? 'fixed' : 'free')}
                onChange={e => {
                  const nextConstraint = e.target.value as VisualPoint['constraint'];
                  onUpdatePoint(point.id, {
                    constraint: nextConstraint,
                    ...(nextConstraint === 'glider' && !point.gliderTarget && gliderSupports[0]
                      ? { gliderTarget: gliderSupports[0].id }
                      : {}),
                  });
                }}
                className="mt-0.5 w-full bg-lienzo border border-carbon/20 rounded px-2 py-1 text-xs text-carbon font-bold"
              >
                <option value="free">Punto Libre (Arrastrable en el plano)</option>
                <option value="fixed">Punto Fijo (Bloqueado)</option>
                <option value="horizontal">Restringido horizontalmente</option>
                <option value="vertical">Restringido verticalmente</option>
                <option value="glider">Glider sobre objeto</option>
                <option value="derived">Derivado (expresiones)</option>
                <option value="constrained">Con restricciones geométricas</option>
              </select>
            </label>

            {point.constraint === 'glider' && (
              <div className="space-y-1.5 bg-lienzo p-2 rounded-lg border border-carbon/10 text-[10px]">
                <label className="block font-bold text-salvia uppercase">
                  Objeto soporte (gliderTarget)
                  <select
                    value={point.gliderTarget || ''}
                    onChange={e => onUpdatePoint(point.id, { gliderTarget: e.target.value || undefined })}
                    className="mt-0.5 w-full bg-carbon/5 border border-carbon/20 rounded px-1.5 py-0.5 text-xs text-carbon font-mono font-bold"
                  >
                    <option value="">-- Seleccionar soporte --</option>
                    {gliderSupports.map(e => (
                      <option key={e.id} value={e.id}>
                        {e.label || e.id} ({e.id}) - {e.kind}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
            )}
          </div>

          <div className="flex items-center space-x-2 pt-1">
            <input
              type="checkbox"
              id={`fixed-${point.id}`}
              checked={isFixed}
              onChange={e => onUpdatePoint(point.id, { fixed: e.target.checked, constraint: e.target.checked ? 'fixed' : 'free' })}
              className="rounded border-carbon/30 text-salvia focus:ring-salvia cursor-pointer"
            />
            <label htmlFor={`fixed-${point.id}`} className="text-xs font-bold text-carbon/80 cursor-pointer">
              Fijar posición (Bloquear arrastre)
            </label>
          </div>

          {point.constraint === 'derived' && (
            <DiagramDerivedPositionEditor
              model={model}
              point={point}
              onPointChange={updates => onUpdatePoint(point.id, updates)}
            />
          )}

          <DiagramPointMovementAidsEditor
            model={model}
            point={point}
            onPointChange={updates => onUpdatePoint(point.id, updates)}
            onAttractorsChange={attractorIds => onUpdatePoint(point.id, { attractorIds })}
          />
        </div>
      </AccordionSection>

      <AccordionSection sec="style" title="Estilo, Tamaño & Apariencia (Normal y Hover)" isOpen={openAccordion.style} onToggle={onToggleAccordion}>
        <div className="p-2.5 space-y-2 bg-carbon/5 rounded-xl border border-carbon/10 shadow-2xs">
          <div>
            <label className="block text-[11px] font-bold text-carbon/70 mb-1">Color del Punto</label>
            <div className="flex flex-wrap gap-1.5">
              {PALETTE_TOKENS.map(c => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => onUpdatePoint(point.id, { color: c.id })}
                  className={`h-6 w-6 rounded-full border-2 transition-all cursor-pointer ${c.bgClass} ${
                    point.color === c.id ? 'border-carbon scale-110 shadow-xs' : 'border-transparent opacity-80'
                  }`}
                  title={c.name}
                />
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-1">
            <div>
              <label className="block text-[11px] font-bold text-carbon/70 mb-0.5">
                Tamaño Base (px)
                <input
                  type="number"
                  min="3"
                  max="20"
                  value={point.style?.pointSize ?? 7}
                  onChange={e =>
                    onUpdatePoint(point.id, {
                      style: { ...(point.style || {}), pointSize: parseInt(e.target.value, 10) || 7 },
                    })
                  }
                  className="mt-0.5 w-full bg-lienzo border border-carbon/20 rounded px-2 py-1 text-xs text-carbon"
                />
              </label>
            </div>
            <div>
              <label className="block text-[11px] font-bold text-carbon/70 mb-0.5">
                Tamaño Hover (px)
                <input
                  type="number"
                  min="4"
                  max="24"
                  value={point.style?.highlightPointSize ?? 10}
                  onChange={e =>
                    onUpdatePoint(point.id, {
                      style: { ...(point.style || {}), highlightPointSize: parseInt(e.target.value, 10) || 10 },
                    })
                  }
                  className="mt-0.5 w-full bg-lienzo border border-carbon/20 rounded px-2 py-1 text-xs text-carbon"
                />
              </label>
            </div>
          </div>

          <div className="flex items-center space-x-2 pt-1">
            <input
              type="checkbox"
              id={`preserveColor-pt-${point.id}`}
              checked={point.style?.preserveColorOnHighlight !== false}
              onChange={e =>
                onUpdatePoint(point.id, {
                  style: { ...(point.style || {}), preserveColorOnHighlight: e.target.checked },
                })
              }
              className="rounded border-carbon/30 text-salvia focus:ring-salvia cursor-pointer"
            />
            <label htmlFor={`preserveColor-pt-${point.id}`} className="text-xs text-carbon/80 cursor-pointer">
              Conservar color propio en hover
            </label>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-carbon/70 mb-0.5">Capa del Tablero</label>
            <select
              value={point.layerId || 'geometry'}
              onChange={e => onUpdatePoint(point.id, { layerId: e.target.value })}
              className="w-full bg-lienzo border border-carbon/20 rounded px-2 py-1 text-xs text-carbon"
            >
              {layers.map(l => (
                <option key={l.id} value={l.id}>
                  {l.label} ({l.id})
                </option>
              ))}
            </select>
          </div>
        </div>
      </AccordionSection>

      <AccordionSection sec="constraints" title="Restricciones Geométricas" isOpen={openAccordion.constraints} onToggle={onToggleAccordion}>
        {onUpdateModel ? (
          <div className="p-2.5 space-y-3 bg-carbon/5 rounded-xl border border-carbon/10 shadow-2xs">
            <ConstraintEditor
              model={model}
              selectedId={point.id}
              onUpdateModel={onUpdateModel}
            />
          </div>
        ) : null}
      </AccordionSection>
    </div>
  );
};
