import type { ElementUpdate, PointUpdate, SliderUpdate } from '../inspector/types';
import { objectKind, pointIsImmovable } from '@/diagrams';
import { withPointMode } from '../../model/elements/pointModes';
import { modelElements, modelPoints, modelSliders } from '../../model/scene/objectLists';
import React, { useState } from 'react';
import katex from 'katex';
import type { VisualDiagramModel } from '../../model/types';
import { PALETTE_TOKENS } from '../inspector/paletteTokens';
import { IconEye, IconEyeOff, IconLock, IconUnlock, IconChevronDown, IconChevronRight } from '../toolbar/WorkbenchIcons';
import { ObjectListBatchToolbar } from '../scene/ObjectListBatchToolbar';
import { useI18n } from '@/i18n';

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
      html = katex.renderToString(cleaned, { displayMode: false, throwOnError: false, trust: false });
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
  onUpdatePoint: (id: string, updates: PointUpdate) => void;
  onUpdateElement?: (id: string, updates: ElementUpdate) => void;
  onUpdateSlider?: (id: string, updates: SliderUpdate) => void;
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
  const { t } = useI18n();
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

  const points = modelPoints(model) || [];
  const lines = (modelElements(model) || []).filter(e =>
    ['segment', 'line', 'ray', 'perpendicular', 'parallel', 'segmentExtension', 'angleBisector'].includes(objectKind(e))
  );
  const circles = (modelElements(model) || []).filter(e => ['circle', 'arc'].includes(objectKind(e)));
  const anglesAndMarks = (modelElements(model) || []).filter(e =>
    ['angle', 'nonReflexAngle', 'rightAngle', 'congruenceMark', 'parallelMark', 'perpendicularMark', 'measureTicks'].includes(objectKind(e))
  );
  const curvesAndAreas = (modelElements(model) || []).filter(e =>
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
    ].includes(objectKind(e))
  );
  const derivedPoints = (modelElements(model) || []).filter(e =>
    ['intersection', 'midpoint', 'perpendicularFoot'].includes(objectKind(e))
  );
  const annotations = (modelElements(model) || []).filter(e =>
    ['text', 'label', 'formula', 'measurement', 'dimensionLine', 'infoPanel'].includes(objectKind(e))
  );
  const uncategorized = (modelElements(model) || []).filter(e =>
    ![
      ...lines,
      ...circles,
      ...anglesAndMarks,
      ...curvesAndAreas,
      ...derivedPoints,
      ...annotations,
    ].some(listed => listed.id === e.id)
  );
  const sliders = modelSliders(model) || [];
  const totalObjects = points.length + (modelElements(model) || []).length + sliders.length;

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
            ? 'border-canela bg-canela/10 text-carbon font-bold shadow-2xs'
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
              title={visible ? t('editor.diagramWorkbench.hide') : t('editor.diagramWorkbench.show')}
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
                locked ? 'text-canela opacity-100 font-bold' : 'opacity-40'
              }`}
              title={locked ? t('editor.diagramWorkbench.unlock') : t('editor.diagramWorkbench.lockFix')}
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
          <h3 className="font-serif text-base font-bold text-carbon">{t('editor.diagramWorkbench.sceneObjects')}</h3>
          <p className="text-xs italic text-carbon/50">{t('editor.diagramWorkbench.sceneSubtitle')}</p>
        </div>
        <span className="ac-label ac-label--sm ac-label--canela select-none uppercase tracking-wider">
          {t(totalObjects === 1 ? 'editor.diagramWorkbench.objectCountOne' : 'editor.diagramWorkbench.objectCountOther', { count: totalObjects })}
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
          t('editor.diagramWorkbench.freeFixedPoints'),
          points.length,
          points.map(p =>
            renderElementRow(
              p.id,
              p.label,
              p.color,
              pointIsImmovable(p) ? 'Fijo' : 'Libre',
              p.visible !== false,
              pointIsImmovable(p),
              () => onUpdatePoint(p.id, { visible: p.visible === false }),
              () => onUpdatePoint(p.id, current => withPointMode(current, pointIsImmovable(current) ? 'free' : 'fixed'))
            )
          )
        )}

        {renderCategoryBlock(
          'derived',
          t('editor.diagramWorkbench.derivedPoints'),
          derivedPoints.length,
          derivedPoints.map(e =>
            renderElementRow(
              e.id,
              e.label,
              e.color,
              objectKind(e),
              e.visible !== false,
              false,
              onUpdateElement ? () => onUpdateElement(e.id, { visible: e.visible === false }) : undefined
            )
          )
        )}

        {renderCategoryBlock(
          'lines',
          t('editor.diagramWorkbench.segmentsLines'),
          lines.length,
          lines.map(e =>
            renderElementRow(
              e.id,
              e.label,
              e.color,
              objectKind(e),
              e.visible !== false,
              false,
              onUpdateElement ? () => onUpdateElement(e.id, { visible: e.visible === false }) : undefined
            )
          )
        )}

        {renderCategoryBlock(
          'circles',
          t('editor.diagramWorkbench.circlesArcs'),
          circles.length,
          circles.map(e =>
            renderElementRow(
              e.id,
              e.label,
              e.color,
              objectKind(e),
              e.visible !== false,
              false,
              onUpdateElement ? () => onUpdateElement(e.id, { visible: e.visible === false }) : undefined
            )
          )
        )}

        {renderCategoryBlock(
          'angles',
          t('editor.diagramWorkbench.anglesMarks'),
          anglesAndMarks.length,
          anglesAndMarks.map(e =>
            renderElementRow(
              e.id,
              e.label,
              e.color,
              objectKind(e),
              e.visible !== false,
              false,
              onUpdateElement ? () => onUpdateElement(e.id, { visible: e.visible === false }) : undefined
            )
          )
        )}

        {renderCategoryBlock(
          'curves',
          t('editor.diagramWorkbench.curvesPolygons'),
          curvesAndAreas.length,
          curvesAndAreas.map(e =>
            renderElementRow(
              e.id,
              e.label,
              e.color,
              objectKind(e),
              e.visible !== false,
              false,
              onUpdateElement ? () => onUpdateElement(e.id, { visible: e.visible === false }) : undefined
            )
          )
        )}

        {renderCategoryBlock(
          'annotations',
          t('editor.diagramWorkbench.annotationsFormulas'),
          annotations.length,
          annotations.map(e =>
            renderElementRow(
              e.id,
              e.label,
              e.color,
              objectKind(e),
              e.visible !== false,
              false,
              onUpdateElement ? () => onUpdateElement(e.id, { visible: e.visible === false }) : undefined
            )
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
              s.visible !== false,
              false,
              onUpdateSlider ? () => onUpdateSlider(s.id, { visible: s.visible === false }) : undefined,
              undefined,
              `= ${s.value}`
            )
          )
        )}

        {renderCategoryBlock(
          'other',
          t('editor.diagramWorkbench.otherElements'),
          uncategorized.length,
          uncategorized.map(e =>
            renderElementRow(
              e.id,
              e.label,
              e.color,
              objectKind(e),
              e.visible !== false,
              false,
              onUpdateElement ? () => onUpdateElement(e.id, { visible: e.visible === false }) : undefined
            )
          )
        )}
      </div>
    </div>
  );
};
