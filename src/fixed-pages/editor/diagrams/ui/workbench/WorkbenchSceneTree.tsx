import React, { useState } from 'react';
import katex from 'katex';
import type { VisualDiagramModel, VisualPoint, VisualElement, VisualSlider } from '../../model/types';
import { PALETTE_TOKENS } from '../inspector/paletteTokens';
import { IconEye, IconEyeOff, IconLock, IconUnlock, IconChevronDown, IconChevronRight } from '../toolbar/WorkbenchIcons';
import { ObjectListBatchToolbar } from '../scene/ObjectListBatchToolbar';

export interface DiagramObjectLabelProps {
  label?: string;
  id: string;
  className?: string;
  suffix?: string;
}

export const DiagramObjectLabel: React.FC<DiagramObjectLabelProps> = ({
  label,
  id,
  className = '',
  suffix = '',
}) => {
  if (!label || label.trim() === '') {
    return <span className={`truncate ${className}`.trim()}>{id}{suffix ? ` ${suffix}` : ''}</span>;
  }

  const trimmed = label.trim();
  const hasDollar = trimmed.includes('$');
  let cleaned = trimmed;

  // Remove outer $$ or $ delimiters if present
  if (cleaned.startsWith('$$') && cleaned.endsWith('$$') && cleaned.length >= 4) {
    cleaned = cleaned.slice(2, -2).trim();
  } else if (cleaned.startsWith('$') && cleaned.endsWith('$') && cleaned.length >= 2) {
    cleaned = cleaned.slice(1, -1).trim();
  }

  // Clean any residual $$ inside
  cleaned = cleaned.replace(/\$\$/g, '');

  if (hasDollar || /\\[a-zA-Z]+|[{}^_]/.test(cleaned)) {
    let html: string | null = null;
    try {
      html = katex.renderToString(cleaned, { displayMode: false, throwOnError: false });
    } catch {
      // Fallback to text
    }
    if (html !== null) {
      return (
        <span className={`inline-flex items-center gap-1 min-w-0 ${className}`.trim()}>
          <span dangerouslySetInnerHTML={{ __html: html }} />
          <span className="text-carbon/40 font-normal shrink-0">({id})</span>
          {suffix && <span className="text-carbon/60 font-mono text-[10px] shrink-0">{suffix}</span>}
        </span>
      );
    }
  }

  return (
    <span className={`truncate ${className}`.trim()}>
      {cleaned} <span className="text-carbon/40 font-normal shrink-0">({id})</span>
      {suffix && <span className="text-carbon/60 font-mono text-[10px] ml-1">{suffix}</span>}
    </span>
  );
};

interface WorkbenchSceneTreeProps {
  model: VisualDiagramModel | null;
  selectedIds: readonly string[];
  onSelectObjects: (ids: string[], additive?: boolean) => void;
  onUpdatePoint: (id: string, updates: Partial<VisualPoint>) => void;
  onUpdateElement?: (id: string, updates: Partial<VisualElement>) => void;
  onUpdateSlider?: (id: string, updates: Partial<VisualSlider>) => void;
  onUpdateModel?: (nextModel: VisualDiagramModel, label: string) => void;
  onCopySelection?: () => void;
  onDeleteSelection?: () => void;
}

export const WorkbenchSceneTree: React.FC<WorkbenchSceneTreeProps> = ({
  model,
  selectedIds,
  onSelectObjects,
  onUpdatePoint,
  onUpdateElement,
  onUpdateSlider,
  onUpdateModel,
  onCopySelection: _onCopySelection,
  onDeleteSelection: _onDeleteSelection,
}) => {
  const [openCategory, setOpenCategory] = useState<Record<string, boolean>>({
    points: true,
    derived: true,
    lines: true,
    circles: true,
    angles: true,
    curves: true,
    annotations: true,
    other: true,
    sliders: true,
  });

  if (!model) return null;

  const toggleCategory = (cat: string) => {
    setOpenCategory(prev => ({ ...prev, [cat]: !prev[cat] }));
  };

  const points = model.points || [];
  const lines = (model.elements || []).filter(e =>
    ['segment', 'line', 'ray', 'perpendicular', 'parallel', 'baseExtension', 'angleBisector'].includes(e.kind)
  );
  const circles = (model.elements || []).filter(e => ['circle', 'arc'].includes(e.kind));
  const anglesAndMarks = (model.elements || []).filter(e =>
    ['angle', 'nonReflexAngle', 'rightAngle', 'congruenceMark', 'parallelMark', 'perpendicularMark', 'measureTicks'].includes(e.kind)
  );
  const curvesAndAreas = (model.elements || []).filter(e =>
    [
      'functionCurve',
      'parametricCurve',
      'poincareGeodesic',
      'poincareArc',
      'halfPlane',
      'areaDecomposition',
      'areaIntersection',
      'polygon',
      'grid',
    ].includes(e.kind)
  );
  const derivedPoints = (model.elements || []).filter(e =>
    ['intersection', 'midpoint', 'perpendicularFoot'].includes(e.kind)
  );
  const annotations = (model.elements || []).filter(e =>
    ['text', 'label', 'formula', 'measurement', 'dimensionLine', 'infoPanel'].includes(e.kind)
  );
  const uncategorized = (model.elements || []).filter(e =>
    ![
      ...lines,
      ...circles,
      ...anglesAndMarks,
      ...curvesAndAreas,
      ...derivedPoints,
      ...annotations,
    ].some(listed => listed.id === e.id)
  );
  const sliders = model.sliders || [];
  const totalObjects = points.length + (model.elements || []).length + sliders.length;

  const renderSectionHeader = (key: string, title: string, count: number) => (
    <button
      type="button"
      aria-expanded={openCategory[key]}
      onClick={() => toggleCategory(key)}
      className="flex w-full items-center justify-between font-serif text-xs font-bold uppercase tracking-wider text-carbon/70 py-1 cursor-pointer select-none"
    >
      <span className="flex items-center space-x-2">
        <span>{title}</span>
        <span className="text-[9px] font-mono text-carbon/60 bg-carbon/10 px-1.5 py-0.5 rounded border border-carbon/10">
          {count}
        </span>
      </span>
      <span className="text-carbon/40 hover:text-carbon transition-colors">
        {openCategory[key] ? <IconChevronDown className="w-3.5 h-3.5" /> : <IconChevronRight className="w-3.5 h-3.5" />}
      </span>
    </button>
  );

  const renderElementRow = (
    id: string,
    rawLabel?: string,
    colorTokenId?: string,
    typeLabel?: string,
    visible: boolean = true,
    locked: boolean = false,
    onToggleVis?: () => void,
    onToggleLock?: () => void,
    suffix?: string
  ) => {
    const isSelected = selectedIds.includes(id);
    const token = PALETTE_TOKENS.find(t => t.id === colorTokenId) || PALETTE_TOKENS[0];

    return (
      <div
        key={id}
        onClick={event => onSelectObjects([id], event.ctrlKey || event.metaKey || event.shiftKey)}
        className={`flex items-center justify-between p-2 rounded-xl border transition-all cursor-pointer ${
          isSelected
            ? 'border-salvia bg-salvia/10 text-carbon font-bold shadow-2xs'
            : 'border-carbon/10 hover:border-carbon/25 hover:bg-carbon/5 bg-lienzo'
        }`}
      >
        <div className="flex items-center space-x-2 min-w-0">
          <span className={`h-3 w-3 rounded-full border border-carbon/20 shrink-0 ${token.bgClass}`} />
          <DiagramObjectLabel label={rawLabel} id={id} suffix={suffix} className="text-carbon text-xs font-sans" />
        </div>
        <div className="flex items-center space-x-1.5 shrink-0">
          {typeLabel && <span className="text-[9px] font-mono text-carbon/40">{typeLabel}</span>}
          {onToggleVis && (
            <button
              type="button"
              onClick={e => {
                e.stopPropagation();
                onToggleVis();
              }}
              className={`p-1 rounded text-carbon/50 hover:text-carbon hover:bg-carbon/10 cursor-pointer ${
                !visible ? 'opacity-40' : ''
              }`}
              title={visible ? 'Ocultar' : 'Mostrar'}
            >
              {visible ? <IconEye /> : <IconEyeOff />}
            </button>
          )}
          {onToggleLock && (
            <button
              type="button"
              onClick={e => {
                e.stopPropagation();
                onToggleLock();
              }}
              className={`p-1 rounded text-carbon/50 hover:text-carbon hover:bg-carbon/10 cursor-pointer ${
                locked ? 'text-salvia opacity-100 font-bold' : 'opacity-40'
              }`}
              title={locked ? 'Desbloquear' : 'Bloquear (fijar)'}
            >
              {locked ? <IconLock /> : <IconUnlock />}
            </button>
          )}
        </div>
      </div>
    );
  };

  const renderCategoryBlock = (key: string, title: string, count: number, children: React.ReactNode) => {
    if (count === 0) return null;
    const isOpen = openCategory[key];
    return (
      <div className="rounded-2xl border border-carbon/15 bg-lienzo p-3.5 shadow-2xs mb-3 transition-all hover:border-carbon/25">
        {renderSectionHeader(key, title, count)}
        {isOpen && (
          <div className="space-y-1.5 pt-2.5 border-t border-carbon/10 mt-2">
            {children}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="p-4 space-y-3 text-xs font-serif text-carbon bg-lienzo h-full overflow-y-auto">
      <div className="flex items-center justify-between border-b border-carbon/15 pb-3">
        <div>
          <h3 className="font-serif text-base font-bold text-carbon">Objetos de la Escena</h3>
          <p className="text-xs italic text-carbon/50">Elementos e iteraciones en el lienzo</p>
        </div>
        <span className="ac-label ac-label--sm ac-label--salvia select-none uppercase tracking-wider">
          {totalObjects} {totalObjects === 1 ? 'Objeto' : 'Objetos'}
        </span>
      </div>

      <div className="space-y-1">
        {onUpdateModel && (
          <ObjectListBatchToolbar
            model={model}
            selectedIds={selectedIds}
            onModelEdit={nextModel => onUpdateModel(nextModel, 'Edición masiva de objetos')}
            onClearSelection={() => onSelectObjects([])}
          />
        )}

        {renderCategoryBlock(
          'points',
          'Puntos Libres & Fijos',
          points.length,
          points.map(p =>
            renderElementRow(
              p.id,
              p.label,
              p.color,
              p.fixed ? 'Fijo' : 'Libre',
              p.showLabel !== false,
              p.fixed || false,
              () => onUpdatePoint(p.id, { showLabel: p.showLabel === false }),
              () => onUpdatePoint(p.id, { fixed: !p.fixed, constraint: p.fixed ? 'free' : 'fixed' })
            )
          )
        )}

        {renderCategoryBlock(
          'derived',
          'Puntos Derivados',
          derivedPoints.length,
          derivedPoints.map(e =>
            renderElementRow(
              e.id,
              e.label,
              e.color,
              e.kind,
              e.showLabel !== false,
              false,
              onUpdateElement ? () => onUpdateElement(e.id, { showLabel: e.showLabel === false }) : undefined
            )
          )
        )}

        {renderCategoryBlock(
          'lines',
          'Segmentos & Rectas',
          lines.length,
          lines.map(e =>
            renderElementRow(
              e.id,
              e.label,
              e.color,
              e.kind,
              true,
              false,
              onUpdateElement ? () => onUpdateElement(e.id, { color: e.color === 'carbon' ? 'salvia' : 'carbon' }) : undefined
            )
          )
        )}

        {renderCategoryBlock(
          'circles',
          'Círculos & Arcos',
          circles.length,
          circles.map(e =>
            renderElementRow(e.id, e.label, e.color, e.kind)
          )
        )}

        {renderCategoryBlock(
          'angles',
          'Ángulos & Marcas',
          anglesAndMarks.length,
          anglesAndMarks.map(e =>
            renderElementRow(e.id, e.label, e.color, e.kind)
          )
        )}

        {renderCategoryBlock(
          'curves',
          'Curvas & Polígonos',
          curvesAndAreas.length,
          curvesAndAreas.map(e =>
            renderElementRow(e.id, e.label, e.color, e.kind)
          )
        )}

        {renderCategoryBlock(
          'annotations',
          'Anotaciones & Fórmulas',
          annotations.length,
          annotations.map(e =>
            renderElementRow(e.id, e.label, e.color, e.kind)
          )
        )}

        {renderCategoryBlock(
          'sliders',
          'Deslizadores',
          sliders.length,
          sliders.map(s =>
            renderElementRow(
              s.id,
              s.label,
              s.color,
              'Slider',
              true,
              false,
              onUpdateSlider ? () => onUpdateSlider(s.id, { value: (s.value || 0) + 1 }) : undefined,
              undefined,
              `= ${s.value}`
            )
          )
        )}

        {renderCategoryBlock(
          'other',
          'Otros Elementos',
          uncategorized.length,
          uncategorized.map(e =>
            renderElementRow(e.id, e.label, e.color, e.kind)
          )
        )}
      </div>
    </div>
  );
};
