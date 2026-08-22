import React from 'react';
import type { VisualPoint, VisualElement } from '@/fixed-pages/editor/diagrams/model/types';
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
import { ConstraintEditor } from '../../constraints/ConstraintEditor';
import { ElementVisibilitySection } from '../element/sections/ElementVisibilitySection';

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
    <div className="p-3 space-y-3 text-xs font-serif text-carbon">
      <InspectorHeader
        title={`Punto: ${point.id}`}
        colorClass={colorToken.bgClass}
        onDelete={() => onDeleteSelected(point.id)}
      />

      <AccordionSection sec="identity" title="Identidad & Etiqueta KaTeX" isOpen={openAccordion.identity} onToggle={onToggleAccordion}>
        <div className="space-y-3">
          <div>
            <label className="block text-[11px] font-bold text-carbon/75 tracking-tight mb-1">
              Identificador Técnico (ID)
            </label>
            <input
              type="text"
              defaultValue={point.id}
              key={`id-input-${point.id}`}
              onBlur={e => handleRenameId(model, point.id, e.target.value, onUpdateModel, onSelectId)}
              onKeyDown={e => {
                if (e.key === 'Enter') handleRenameId(model, point.id, e.currentTarget.value, onUpdateModel, onSelectId);
              }}
              className="w-full rounded-lg border border-carbon/15 bg-lienzo px-3 py-1.5 font-mono text-xs font-bold text-carbon shadow-2xs transition-colors focus:border-canela focus:outline-none focus:ring-2 focus:ring-canela/20"
              title="Presiona Enter o cambia el foco para confirmar renombrado"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-carbon/75 tracking-tight mb-1">
              Etiqueta Visual (KaTeX)
            </label>
            <input
              type="text"
              value={point.label || ''}
              onChange={e => onUpdatePoint(point.id, { label: e.target.value })}
              placeholder="ej. $A$ o $P_1$"
              className="w-full rounded-lg border border-carbon/15 bg-lienzo px-3 py-1.5 text-xs text-carbon shadow-2xs transition-colors focus:border-canela focus:outline-none focus:ring-2 focus:ring-canela/20 placeholder-carbon/30"
            />
            {point.label && (
              <div className="mt-2 flex items-center space-x-2 rounded-lg border border-carbon/10 bg-lienzo/80 p-2 shadow-2xs">
                <span className="text-[10px] uppercase font-bold text-carbon/50">Vista previa:</span>
                <KatexText text={point.label} className="text-xs font-bold text-canela" />
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
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className="block text-[11px] font-bold text-carbon/75 tracking-tight mb-1">
                Coordenada X
              </label>
              <input
                type="number"
                step="0.1"
                value={point.x ?? 0}
                onChange={e => onUpdatePoint(point.id, { x: parseOptionalNumber(e.target.value, point.x ?? 0) })}
                className="w-full rounded-lg border border-carbon/15 bg-lienzo px-3 py-1.5 text-xs text-carbon shadow-2xs transition-colors focus:border-canela focus:outline-none focus:ring-2 focus:ring-canela/20"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-carbon/75 tracking-tight mb-1">
                Coordenada Y
              </label>
              <input
                type="number"
                step="0.1"
                value={point.y ?? 0}
                onChange={e => onUpdatePoint(point.id, { y: parseOptionalNumber(e.target.value, point.y ?? 0) })}
                className="w-full rounded-lg border border-carbon/15 bg-lienzo px-3 py-1.5 text-xs text-carbon shadow-2xs transition-colors focus:border-canela focus:outline-none focus:ring-2 focus:ring-canela/20"
              />
            </div>
          </div>

          <div className="pt-2.5 border-t border-carbon/10 space-y-2.5">
            <div>
              <label className="block text-[11px] font-bold text-carbon/75 tracking-tight mb-1">
                Tipo de Punto & Soporte
              </label>
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
                className="w-full rounded-lg border border-carbon/15 bg-lienzo px-3 py-1.5 text-xs font-bold text-carbon shadow-2xs transition-colors focus:border-canela focus:outline-none focus:ring-2 focus:ring-canela/20 cursor-pointer"
              >
                <option value="free">Punto Libre (Arrastrable en el plano)</option>
                <option value="fixed">Punto Fijo (Bloqueado)</option>
                <option value="horizontal">Restringido horizontalmente</option>
                <option value="vertical">Restringido verticalmente</option>
                <option value="glider">Glider sobre objeto</option>
                <option value="derived">Derivado (expresiones)</option>
                <option value="constrained">Con restricciones geométricas</option>
              </select>
            </div>

            {point.constraint === 'glider' && (
              <div className="space-y-1.5 rounded-lg border border-canela/20 bg-canela/5 p-2.5">
                <label className="block text-[10px] font-bold text-canela uppercase tracking-wider mb-1">
                  Objeto soporte (gliderTarget)
                </label>
                <select
                  value={point.gliderTarget || ''}
                  onChange={e => onUpdatePoint(point.id, { gliderTarget: e.target.value || undefined })}
                  className="w-full rounded-lg border border-canela/20 bg-lienzo px-2.5 py-1 text-xs font-mono font-bold text-carbon focus:border-canela focus:outline-none"
                >
                  <option value="">-- Seleccionar soporte --</option>
                  {gliderSupports.map(e => (
                    <option key={e.id} value={e.id}>
                      {e.label || e.id} ({e.id}) - {e.kind}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          <div className="flex items-center space-x-2 pt-1">
            <input
              type="checkbox"
              id={`fixed-${point.id}`}
              checked={isFixed}
              onChange={e => onUpdatePoint(point.id, { fixed: e.target.checked, constraint: e.target.checked ? 'fixed' : 'free' })}
              className="rounded border-carbon/30 text-canela focus:ring-canela cursor-pointer"
            />
            <label htmlFor={`fixed-${point.id}`} className="text-xs font-bold text-carbon/80 cursor-pointer select-none">
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

      <AccordionSection sec="style" title="Estilo, Tamaño & Apariencia" isOpen={openAccordion.style} onToggle={onToggleAccordion}>
        <div className="space-y-3">
          <div>
            <label className="block text-[11px] font-bold text-carbon/75 tracking-tight mb-1.5">Color del Punto</label>
            <div className="flex flex-wrap gap-2">
              {PALETTE_TOKENS.map(c => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => onUpdatePoint(point.id, { color: c.id })}
                  className={`h-6 w-6 rounded-full border-2 transition-all cursor-pointer ${c.bgClass} ${
                    point.color === c.id ? 'border-carbon scale-110 shadow-xs ring-2 ring-carbon/20' : 'border-transparent opacity-80 hover:opacity-100'
                  }`}
                  title={c.name}
                />
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2.5 pt-1">
            <div>
              <label className="block text-[11px] font-bold text-carbon/75 tracking-tight mb-1">
                Tamaño Base (px)
              </label>
              <input
                type="number"
                min="0"
                max="20"
                value={point.style?.pointSize ?? 7}
                onChange={e =>
                  onUpdatePoint(point.id, {
                    style: { ...(point.style || {}), pointSize: parseOptionalNumber(e.target.value, 7) },
                  })
                }
                className="w-full rounded-lg border border-carbon/15 bg-lienzo px-3 py-1.5 text-xs text-carbon shadow-2xs transition-colors focus:border-canela focus:outline-none focus:ring-2 focus:ring-canela/20"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-carbon/75 tracking-tight mb-1">
                Tamaño Hover (px)
              </label>
              <input
                type="number"
                min="0"
                max="24"
                value={point.style?.highlightPointSize ?? 10}
                onChange={e =>
                  onUpdatePoint(point.id, {
                    style: { ...(point.style || {}), highlightPointSize: parseOptionalNumber(e.target.value, 10) },
                  })
                }
                className="w-full rounded-lg border border-carbon/15 bg-lienzo px-3 py-1.5 text-xs text-carbon shadow-2xs transition-colors focus:border-canela focus:outline-none focus:ring-2 focus:ring-canela/20"
              />
            </div>
          </div>

          <div className="space-y-2 pt-1">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id={`preserveColor-pt-${point.id}`}
                checked={point.style?.preserveColorOnHighlight !== false}
                onChange={e =>
                  onUpdatePoint(point.id, {
                    style: { ...(point.style || {}), preserveColorOnHighlight: e.target.checked },
                  })
                }
                className="rounded border-carbon/30 text-canela focus:ring-canela cursor-pointer"
              />
              <label htmlFor={`preserveColor-pt-${point.id}`} className="text-xs text-carbon/80 cursor-pointer select-none">
                Conservar color propio en hover
              </label>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id={`highlightable-pt-${point.id}`}
                checked={point.selection?.highlightable !== false}
                onChange={e =>
                  onUpdatePoint(point.id, {
                    selection: { ...(point.selection || { selectable: true }), highlightable: e.target.checked },
                  })
                }
                className="rounded border-carbon/30 text-canela focus:ring-canela cursor-pointer"
              />
              <label htmlFor={`highlightable-pt-${point.id}`} className="text-xs text-carbon/80 cursor-pointer select-none">
                Permitir resaltado visual con el puntero
              </label>
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-carbon/75 tracking-tight mb-1">Capa del Tablero</label>
            <select
              value={point.layerId || 'geometry'}
              onChange={e => onUpdatePoint(point.id, { layerId: e.target.value })}
              className="w-full rounded-lg border border-carbon/15 bg-lienzo px-3 py-1.5 text-xs text-carbon shadow-2xs transition-colors focus:border-canela focus:outline-none focus:ring-2 focus:ring-canela/20 cursor-pointer"
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

      <AccordionSection sec="visibility_selection" title="Visibilidad Condicionada & Selección" isOpen={openAccordion.visibility_selection} onToggle={onToggleAccordion}>
        <ElementVisibilitySection
          model={model}
          element={point as unknown as VisualElement}
          onUpdatePoint={onUpdatePoint}
          onUpdateElement={(id, updates) => onUpdatePoint(id, updates)}
          onUpdateSlider={() => undefined}
          onDeleteSelected={onDeleteSelected}
          onUpdateModel={onUpdateModel}
          onSelectId={onSelectId}
        />
      </AccordionSection>

      <AccordionSection sec="constraints" title="Restricciones Geométricas" isOpen={openAccordion.constraints} onToggle={onToggleAccordion}>
        {onUpdateModel ? (
          <ConstraintEditor
            model={model}
            selectedId={point.id}
            onUpdateModel={onUpdateModel}
          />
        ) : null}
      </AccordionSection>
    </div>
  );
};
