import React, { useEffect, useMemo, useState } from 'react';
import type { CanvasTool, VisualDiagramModel } from '../../model/types';
import { refsNeededForTool, toolReferenceCandidates } from '../../model';
import { ToolDrawingIcon, IconChevronDown, IconClose, IconSparkles } from './WorkbenchIcons';
import { useI18n } from '@/i18n';
import { kindLabel } from '@/fixed-pages/editor/diagrams/ui/diagramLabels';
import { Button, Card, IconButton, RowButton, controlClassName } from '@/fixed-pages/editor/ui/primitives';

interface WorkbenchToolbarProps {
  model?: VisualDiagramModel | null;
  activeTool: CanvasTool;
  onSelectTool: (tool: CanvasTool) => void;
  onAddSliderClick: () => void;
  onAddStepClick: () => void;
  onOpenGuidedClick?: () => void;
  onAddGliderPoint?: (supportId?: string) => void;
  gliderSupports?: Array<{ id: string; label?: string }>;
}

interface ToolCategory {
  id: string;
  label: string;
  tools: {
    id: CanvasTool | 'add_slider' | 'add_step' | 'guided' | 'add_glider';
    name: string;
    description: string;
    toolId?: CanvasTool;
    action?: () => void;
  }[];
}

export const WorkbenchToolbar: React.FC<WorkbenchToolbarProps> = ({
  model = null,
  activeTool,
  onSelectTool,
  onAddSliderClick,
  onAddStepClick,
  onOpenGuidedClick,
  onAddGliderPoint,
  gliderSupports = [],
}) => {
  const { t } = useI18n();
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [toolQuery, setToolQuery] = useState('');
  const [gliderSupportId, setGliderSupportId] = useState('');
  const effectiveGliderSupportId = gliderSupports.some(item => item.id === gliderSupportId)
    ? gliderSupportId
    : (gliderSupports[0]?.id ?? '');

  const toolCategories: (ToolCategory & { shortLabel?: string })[] = useMemo(() => [
    {
      id: 'points',
      label: t('editor.diagramToolbar.pointsSliders'),
      shortLabel: t('editor.diagramToolbar.points'),
      tools: [
        { id: 'point', toolId: 'point', name: t('editor.diagramToolbar.freePointTool'), description: t('editor.diagramToolbar.placePointHint') },
        { id: 'midpoint', toolId: 'midpoint', name: t('editor.diagramToolbar.midpoint'), description: t('editor.diagramToolbar.select2Points') },
        { id: 'intersection', toolId: 'intersection', name: t('editor.diagramToolbar.intersection'), description: t('editor.diagramToolbar.intersectionHint') },
        { id: 'perpendicularFoot', toolId: 'perpendicularFoot', name: t('editor.diagramToolbar.perpendicularFoot'), description: t('editor.diagramToolbar.perpendicularFootHint') },
        { id: 'add_glider', name: t('editor.diagramToolbar.pointOnObject'), description: t('editor.diagramToolbar.gliderHint'), action: () => onAddGliderPoint?.(effectiveGliderSupportId) },
        { id: 'add_slider', name: t('editor.diagramToolbar.slider'), description: t('editor.diagramToolbar.interactiveNumericVariable'), action: onAddSliderClick },
      ],
    },
    {
      id: 'lines',
      label: t('editor.diagramToolbar.linesGeometry'),
      shortLabel: t('editor.diagramToolbar.lines'),
      tools: [
        { id: 'guided', name: t('editor.diagramToolbar.guidedConstruction'), description: t('editor.diagramToolbar.guidedHint'), action: onOpenGuidedClick },
        { id: 'segment', toolId: 'segment', name: t('editor.diagramToolbar.segment'), description: t('editor.diagramToolbar.select2Points') },
        { id: 'line', toolId: 'line', name: t('editor.diagramToolbar.line'), description: t('editor.diagramToolbar.select2Points') },
        { id: 'ray', toolId: 'ray', name: t('editor.diagramToolbar.ray'), description: t('editor.diagramToolbar.originAndThroughPoint') },
        { id: 'circle', toolId: 'circle', name: t('editor.diagramToolbar.circle'), description: t('editor.diagramToolbar.centerAndEdgePoint') },
        { id: 'arc', toolId: 'arc', name: t('editor.diagramToolbar.arc'), description: t('editor.diagramToolbar.centerStartAndEnd') },
        { id: 'polygon', toolId: 'polygon', name: t('editor.diagramToolbar.polygon'), description: t('editor.diagramToolbar.polygonHint') },
        { id: 'segmentExtension', toolId: 'segmentExtension', name: t('editor.diagramToolbar.segmentExtension'), description: t('editor.diagramToolbar.segmentExtensionHint') },
        { id: 'perpendicular', toolId: 'perpendicular', name: t('editor.diagramToolbar.perpendicularLine'), description: t('editor.diagramToolbar.pointAndDirection') },
        { id: 'parallel', toolId: 'parallel', name: t('editor.diagramToolbar.parallelLine'), description: t('editor.diagramToolbar.pointAndDirection') },
        { id: 'angleBisector', toolId: 'angleBisector', name: t('editor.diagramToolbar.bisector'), description: t('editor.diagramToolbar.bisectorHint') },
      ],
    },
    {
      id: 'angles',
      label: t('editor.diagramToolbar.anglesMarks'),
      shortLabel: t('editor.diagramToolbar.angles'),
      tools: [
        { id: 'angle', toolId: 'angle', name: t('editor.diagramToolbar.orientedAngle'), description: t('editor.diagramToolbar.orientedAngleHint') },
        { id: 'nonReflexAngle', toolId: 'nonReflexAngle', name: t('editor.diagramToolbar.nonReflexAngleName'), description: t('editor.diagramToolbar.threePoints') },
        { id: 'rightAngle', toolId: 'rightAngle', name: t('editor.diagramToolbar.rightAngle'), description: t('editor.diagramToolbar.rightAngleHint') },
        { id: 'congruenceMark', toolId: 'congruenceMark', name: t('editor.diagramToolbar.congruenceMark'), description: t('editor.diagramToolbar.selectTheSegmentEndpoints') },
        { id: 'parallelMark', toolId: 'parallelMark', name: t('editor.diagramToolbar.parallelismMark'), description: t('editor.diagramToolbar.arrowOnTheSegment') },
        { id: 'perpendicularMark', toolId: 'perpendicularMark', name: t('editor.diagramToolbar.perpendicularMark'), description: t('editor.diagramToolbar.perpendicularMarkHint') },
        { id: 'measureTicks', toolId: 'measureTicks', name: t('editor.diagramToolbar.measureMarksTicks'), description: t('editor.diagramToolbar.ticksHint') },
        { id: 'dimensionLine', toolId: 'dimensionLine', name: t('editor.diagramToolbar.dimensionLine'), description: t('editor.diagramToolbar.distanceBetween2Points') },
        { id: 'measurement', toolId: 'measurement', name: t('editor.diagramToolbar.measurementDimension'), description: t('editor.diagramToolbar.lengthOrAreaMeasurement') },
      ],
    },
    {
      id: 'regions',
      label: t('editor.diagramToolbar.areasRegions'),
      shortLabel: t('editor.diagramToolbar.areas'),
      tools: [
        { id: 'halfPlane', toolId: 'halfPlane', name: t('editor.diagramToolbar.halfPlane'), description: t('editor.diagramToolbar.halfPlaneHint') },
        { id: 'areaDecomposition', toolId: 'areaDecomposition', name: t('editor.diagramToolbar.areaDecomposition'), description: t('editor.diagramToolbar.regionShadedByVertices') },
        { id: 'areaIntersection', toolId: 'areaIntersection', name: t('editor.diagramToolbar.areaIntersection'), description: t('editor.diagramToolbar.overlapOf2Regions') },
        { id: 'grid', toolId: 'grid', name: t('editor.diagramToolbar.geometricGrid'), description: t('editor.diagramToolbar.auxiliaryGrid') },
      ],
    },
    {
      id: 'curves',
      label: t('editor.diagramToolbar.curvesModels'),
      shortLabel: t('editor.diagramToolbar.curves'),
      tools: [
        { id: 'functionCurve', toolId: 'functionCurve', name: t('editor.diagramToolbar.functionGraphName'), description: t('editor.diagramToolbar.continuousMathematicalFunction') },
        { id: 'parametricCurve', toolId: 'parametricCurve', name: t('editor.diagramToolbar.parametricCurveXT'), description: t('editor.diagramToolbar.parametricEquations') },
        { id: 'poincareGeodesic', toolId: 'poincareGeodesic', name: t('editor.diagramToolbar.poincareGeodesic'), description: t('editor.diagramToolbar.hyperbolicDiskModel') },
        { id: 'poincareArc', toolId: 'poincareArc', name: t('editor.diagramToolbar.poincareArc'), description: t('editor.diagramToolbar.hyperbolicArc') },
      ],
    },
    {
      id: 'text',
      label: t('editor.diagramToolbar.annotationsExplanation'),
      shortLabel: t('editor.diagramToolbar.annotations'),
      tools: [
        { id: 'text', toolId: 'text', name: t('editor.diagramToolbar.katexLabelText'), description: t('editor.diagramToolbar.textToolHint') },
        { id: 'label', toolId: 'label', name: t('editor.diagramToolbar.mathLabel'), description: t('editor.diagramToolbar.mathematicalSymbol') },
        { id: 'formula', toolId: 'formula', name: t('editor.diagramToolbar.explanatoryFormula'), description: t('editor.diagramToolbar.complexEquationsInKatex') },
        { id: 'infoPanel', toolId: 'infoPanel', name: t('editor.diagramToolbar.infoPanel'), description: t('editor.diagramToolbar.floatingExplanatoryCard') },
        { id: 'add_step', name: t('editor.diagramToolbar.newProofStep'), description: t('editor.diagramToolbar.addStepHint'), action: onAddStepClick },
      ],
    },
  ], [effectiveGliderSupportId, onAddGliderPoint, onAddSliderClick, onAddStepClick, onOpenGuidedClick, t]);

  const normalizedQuery = toolQuery.trim().toLocaleLowerCase('es');
  const isSearching = normalizedQuery.length > 0;
  const filteredCategories = toolCategories
    .map(category => ({
      ...category,
      tools: category.tools.filter(tool =>
        !normalizedQuery
        || `${tool.name} ${tool.description} ${category.label} ${tool.toolId || ''}`.toLocaleLowerCase('es').includes(normalizedQuery),
      ),
    }))
    .filter(category => category.tools.length > 0);

  const searchHits = isSearching
    ? filteredCategories.flatMap(category =>
        category.tools.map(tool => ({ ...tool, categoryLabel: category.label, categoryId: category.id })),
      )
    : [];

  useEffect(() => {
    if (isSearching) setOpenMenu(null);
  }, [isSearching]);

  useEffect(() => {
    const close = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target?.closest('nav[data-workbench-toolbar]')) {
        setOpenMenu(null);
        // We only clear query if there's no text or if they completely click away to cancel search
        if (!target?.closest('[role="listbox"]')) {
           setToolQuery('');
        }
      }
    };
    window.addEventListener('mousedown', close);
    return () => window.removeEventListener('mousedown', close);
  }, []);

  const isToolDisabled = (toolId?: CanvasTool) => {
    if (!toolId || !model || toolId === 'select' || toolId === 'point') return false;
    const required = refsNeededForTool(toolId);
    if (required === 0) return false;
    return toolReferenceCandidates(model, toolId).length < required;
  };

  const handleToolSelect = (toolId?: CanvasTool, action?: () => void) => {
    if (toolId && isToolDisabled(toolId)) return;
    if (toolId) onSelectTool(toolId);
    if (action) action();
    setOpenMenu(null);
  };

  const getToolDisplayName = (tool: CanvasTool) => {
    if (tool === 'select') return t('editor.diagramToolbar.moveSelect');
    if (tool === 'point') return t('editor.diagramToolbar.freePointTool');
    return kindLabel(t, tool);
  };

  return (
    <nav data-workbench-toolbar className="relative z-50 flex w-full min-w-0 shrink-0 flex-wrap items-center gap-1.5 border-b border-carbon/10 bg-lienzo/95 p-1.5 font-serif text-carbon shadow-2xs backdrop-blur-md select-none transition-colors motion-safe:transition-all">
      <Button size="sm" aria-label={t('editor.diagramToolbar.moveSelect')} aria-pressed={activeTool === 'select'} onClick={() => onSelectTool('select')}>
        <ToolDrawingIcon tool="select" className="w-3.5 h-3.5" />
        <span>{t('editor.diagramToolbar.move')}</span>
      </Button>

      <Button size="sm" aria-label={t('editor.diagramToolbar.freePoint')} aria-pressed={activeTool === 'point'} onClick={() => onSelectTool('point')}>
        <ToolDrawingIcon tool="point" className="w-3.5 h-3.5" />
        <span>{t('editor.diagramToolbar.freePointTool')}</span>
      </Button>

      {onOpenGuidedClick && (
        <Button size="sm" onClick={onOpenGuidedClick} aria-label={t('editor.diagramToolbar.guidedConstructions')} title={t('editor.diagramToolbar.openGuidedTitle')}>
          <IconSparkles className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">{t('editor.diagramToolbar.guided')}</span>
        </Button>
      )}

      <div className="mx-1 h-5 w-px bg-carbon/15 shrink-0" />

      <div className="relative">
        <label className="flex h-8 items-center">
          <span className="sr-only">{t('editor.diagramToolbar.searchTool')}</span>
          <input
            type="search"
            value={toolQuery}
            onChange={e => setToolQuery(e.target.value)}
            placeholder={t('editor.diagramToolbar.search')}
            className={`${controlClassName} w-28 sm:w-44`}
          />
        </label>

        {isSearching && (
          <Card className="absolute mt-1.5 w-80 max-h-96 overflow-y-auto" role="listbox" aria-label={t('editor.diagramToolbar.searchResults')}>
            <div className="flex items-center justify-between px-2 py-1 mb-1 border-b border-carbon/10">
              <span className="text-[11px] font-bold text-carbon/70">
                {t(searchHits.length === 1 ? 'editor.diagramToolbar.resultsCountOne' : 'editor.diagramToolbar.resultsCountOther', { count: searchHits.length })}
              </span>
              <Button size="sm" variant="quiet" onClick={() => setToolQuery('')}>
                {t('editor.diagramToolbar.clear')}
              </Button>
            </div>
            {searchHits.length === 0 ? (
              <p className="px-2 py-3 text-[11px] text-carbon/50 italic">{t('editor.diagramToolbar.noToolMatches')}</p>
            ) : (
              <div className="space-y-1">
                {searchHits.map(hit => {
                  const isSelected = hit.toolId ? activeTool === hit.toolId : false;
                  const drawingTool = hit.id === 'add_glider' ? 'point' : hit.id;
                  const disabled = (hit.id === 'add_glider' && !effectiveGliderSupportId) || isToolDisabled(hit.toolId);
                  return (
                    <RowButton
                      key={`${hit.categoryId}-${hit.id}`}
                      role="option"
                      aria-selected={isSelected}
                      disabled={disabled}
                      onClick={() => {
                        handleToolSelect(hit.toolId, hit.action);
                        setToolQuery('');
                      }}
                      className="items-start border border-[color:var(--ed-rule-faint)]"
                      aria-current={isSelected ? 'true' : undefined}
                    >
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 shrink-0 text-canela">
                          <ToolDrawingIcon tool={drawingTool} className="w-4 h-4" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-xs font-bold truncate">{hit.name}</span>
                            <span className="text-[9px] shrink-0 text-carbon/45">
                              {hit.categoryLabel}
                            </span>
                          </div>
                          <p className="text-[10px] mt-0.5 truncate text-carbon/55">
                            {disabled && hit.toolId ? t('editor.diagramToolbar.compatibleReferencesAreMissing') : hit.description}
                          </p>
                        </div>
                      </div>
                    </RowButton>
                  );
                })}
              </div>
            )}
          </Card>
        )}
      </div>

      {toolCategories.map(category => {
        const isOpen = !isSearching && openMenu === category.id;
        const matchCount = filteredCategories.find(c => c.id === category.id)?.tools.length ?? 0;

        return (
          <div
            key={category.id}
            className={`relative motion-safe:transition-all motion-safe:duration-200 ${
              isSearching
                ? 'opacity-40 scale-95 pointer-events-none max-sm:hidden'
                : 'opacity-100 scale-100'
            }`}
          >
            <Button size="sm" aria-label={category.label} aria-expanded={isOpen} aria-haspopup="menu" disabled={isSearching} onClick={() => setOpenMenu(isOpen ? null : category.id)}>
              <span>{category.shortLabel || category.label}</span>
              {isSearching && matchCount > 0 && (
                <span className="text-[9px] font-mono bg-canela/20 text-canela px-1 rounded">{matchCount}</span>
              )}
              <IconChevronDown className="w-3 h-3 opacity-60" />
            </Button>

            {isOpen && (
              <Card className="absolute mt-1.5 w-76" role="menu">
                <div className="flex items-center justify-between px-2 py-1 mb-1 border-b border-carbon/10">
                  <span className="text-[11px] font-bold text-carbon/70 uppercase tracking-wider">
                    {category.label}
                  </span>
                  <IconButton size="sm" label={t('editor.diagramToolbar.closeMenu')} onClick={() => setOpenMenu(null)}>
                    <IconClose className="w-3.5 h-3.5" />
                  </IconButton>
                </div>

                <div className="space-y-1 max-h-80 overflow-y-auto">
                  {category.id === 'points' && onAddGliderPoint && (
                    <Card className="mb-1 space-y-1.5">
                      <label className="block text-[10px] font-bold text-carbon/70 uppercase">
                        {t('editor.diagramToolbar.pointSupportOnObject')}
                        <select
                          value={effectiveGliderSupportId}
                          onChange={e => setGliderSupportId(e.target.value)}
                          disabled={gliderSupports.length === 0}
                          className={`${controlClassName} mt-0.5`}
                        >
                          {gliderSupports.length === 0 && <option value="">{t('editor.diagramToolbar.needsLineOrCurve')}</option>}
                          {gliderSupports.map(item => (
                            <option key={item.id} value={item.id}>{item.label || item.id}</option>
                          ))}
                        </select>
                      </label>
                    </Card>
                  )}
                  {category.tools.map(tool => {
                    const isSelected = tool.toolId ? activeTool === tool.toolId : false;
                    const drawingTool = tool.id === 'add_glider' ? 'point' : tool.id;
                    const disabled = (tool.id === 'add_glider' && !effectiveGliderSupportId) || isToolDisabled(tool.toolId);
                    return (
                      <RowButton key={tool.id} disabled={disabled} aria-current={isSelected ? 'true' : undefined} onClick={() => handleToolSelect(tool.toolId, tool.action)}>
                        <div className="flex items-center space-x-2.5">
                          <div className="p-1.5 shrink-0 text-canela">
                            <ToolDrawingIcon tool={drawingTool} className="w-4 h-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold truncate">{tool.name}</span>
                              {tool.toolId && (
                                <span className="text-[9px] px-1.5 py-0.5 font-mono text-carbon/60">
                                  {tool.toolId}
                                </span>
                              )}
                            </div>
                            <p className="text-[10px] mt-0.5 leading-tight truncate text-carbon/60">
                              {disabled && tool.toolId ? t('editor.diagramToolbar.compatibleReferencesAreMissing') : tool.description}
                            </p>
                          </div>
                        </div>
                      </RowButton>
                    );
                  })}
                </div>
              </Card>
            )}
          </div>
        );
      })}

      <Card className="ml-auto sm:flex items-center space-x-2 text-xs">
        <span className="text-[11px] text-carbon/50">{t('editor.diagramToolbar.active')}</span>
        <div className="flex items-center space-x-1">
          <ToolDrawingIcon tool={activeTool} className="w-3.5 h-3.5 text-canela" />
          <span className="font-bold text-canela">{getToolDisplayName(activeTool)}</span>
        </div>
      </Card>
    </nav>
  );
};
