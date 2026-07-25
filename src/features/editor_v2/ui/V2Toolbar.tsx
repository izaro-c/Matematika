import React, { useEffect, useMemo, useState } from 'react';
import type { CanvasTool, ElementKind, VisualDiagramModel } from '../../editor/diagrams/model/types';
import { KIND_LABELS } from '../../editor/diagrams/model/diagramOptions';
import { refsNeededForTool, toolReferenceCandidates } from '../../editor/diagrams/model';
import { V2ToolDrawing, IconChevronDown, IconClose, IconSparkles } from './V2Icons';

interface V2ToolbarProps {
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

export const V2Toolbar: React.FC<V2ToolbarProps> = ({
  model = null,
  activeTool,
  onSelectTool,
  onAddSliderClick,
  onAddStepClick,
  onOpenGuidedClick,
  onAddGliderPoint,
  gliderSupports = [],
}) => {
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [toolQuery, setToolQuery] = useState('');
  const [gliderSupportId, setGliderSupportId] = useState('');
  const effectiveGliderSupportId = gliderSupports.some(item => item.id === gliderSupportId)
    ? gliderSupportId
    : (gliderSupports[0]?.id ?? '');

  const toolCategories: ToolCategory[] = useMemo(() => [
    {
      id: 'points',
      label: 'Puntos & Deslizadores',
      tools: [
        { id: 'point', toolId: 'point', name: 'Punto Libre', description: 'Haz clic en el lienzo para colocarlo' },
        { id: 'midpoint', toolId: 'midpoint', name: 'Punto Medio', description: 'Selecciona 2 puntos' },
        { id: 'intersection', toolId: 'intersection', name: 'Intersección', description: 'Selecciona 2 rectas, segmentos o círculos' },
        { id: 'perpendicularFoot', toolId: 'perpendicularFoot', name: 'Pie Perpendicular', description: '2 puntos de la base + punto a proyectar' },
        { id: 'add_glider', name: 'Punto sobre objeto', description: 'Glider sobre línea o curva', action: () => onAddGliderPoint?.(effectiveGliderSupportId) },
        { id: 'add_slider', name: 'Deslizador Numérico', description: 'Crea una variable numérica interactiva', action: onAddSliderClick },
      ],
    },
    {
      id: 'lines',
      label: 'Líneas & Geometría',
      tools: [
        { id: 'segment', toolId: 'segment', name: 'Segmento', description: 'Selecciona 2 puntos' },
        { id: 'line', toolId: 'line', name: 'Recta', description: 'Selecciona 2 puntos' },
        { id: 'ray', toolId: 'ray', name: 'Semirrecta', description: 'Origen y punto de paso' },
        { id: 'circle', toolId: 'circle', name: 'Circunferencia', description: 'Centro y punto de borde' },
        { id: 'arc', toolId: 'arc', name: 'Arco de Circunferencia', description: 'Centro, punto inicio y punto fin' },
        { id: 'polygon', toolId: 'polygon', name: 'Polígono', description: '≥3 vértices; finaliza con Crear polígono' },
        { id: 'baseExtension', toolId: 'baseExtension', name: 'Extensión de Base', description: '2 extremos de la base + punto exterior' },
        { id: 'perpendicular', toolId: 'perpendicular', name: 'Recta Perpendicular', description: 'Punto y dirección' },
        { id: 'parallel', toolId: 'parallel', name: 'Recta Paralela', description: 'Punto y dirección' },
        { id: 'angleBisector', toolId: 'angleBisector', name: 'Bisectriz de Ángulo', description: 'Tres puntos del ángulo' },
        { id: 'guided', name: 'Construcción Guiada', description: 'Mediatriz, bisectriz o circuncírculo automático', action: onOpenGuidedClick },
      ],
    },
    {
      id: 'angles',
      label: 'Ángulos & Marcas',
      tools: [
        { id: 'angle', toolId: 'angle', name: 'Ángulo Orientado', description: 'Tres puntos: lado 1, vértice, lado 2' },
        { id: 'nonReflexAngle', toolId: 'nonReflexAngle', name: 'Ángulo No Cóncavo (≤180°)', description: 'Tres puntos' },
        { id: 'rightAngle', toolId: 'rightAngle', name: 'Ángulo Recto', description: 'Tres puntos en ángulo de 90°' },
        { id: 'congruenceMark', toolId: 'congruenceMark', name: 'Marca de Congruencia', description: 'Selecciona los extremos del segmento' },
        { id: 'parallelMark', toolId: 'parallelMark', name: 'Marca de Paralelismo', description: 'Flecha en el segmento' },
        { id: 'perpendicularMark', toolId: 'perpendicularMark', name: 'Marca Perpendicular', description: 'Caja de 90° en intersección' },
        { id: 'measureTicks', toolId: 'measureTicks', name: 'Marcas de Medida (Ticks)', description: 'Marcas graduadas en el segmento' },
        { id: 'dimensionLine', toolId: 'dimensionLine', name: 'Línea de Cota', description: 'Distancia entre 2 puntos' },
        { id: 'measurement', toolId: 'measurement', name: 'Medición / Cota', description: 'Medición de longitud o área' },
      ],
    },
    {
      id: 'regions',
      label: 'Áreas & Regiones',
      tools: [
        { id: 'halfPlane', toolId: 'halfPlane', name: 'Semiplano', description: 'Recta borde y punto del semiplano' },
        { id: 'areaDecomposition', toolId: 'areaDecomposition', name: 'Descomposición de Área', description: 'Región sombreada por vértices' },
        { id: 'areaIntersection', toolId: 'areaIntersection', name: 'Intersección de Áreas', description: 'Superposición de 2 regiones' },
        { id: 'grid', toolId: 'grid', name: 'Cuadrícula Geométrica', description: 'Rejilla auxiliar' },
      ],
    },
    {
      id: 'curves',
      label: 'Curvas & Modelos',
      tools: [
        { id: 'functionCurve', toolId: 'functionCurve', name: 'Gráfica de Función f(x)', description: 'Función matemática continua' },
        { id: 'parametricCurve', toolId: 'parametricCurve', name: 'Curva Paramétrica x(t), y(t)', description: 'Ecuaciones paramétricas' },
        { id: 'poincareGeodesic', toolId: 'poincareGeodesic', name: 'Geodésica de Poincaré', description: 'Modelo hiperbólico del disco' },
        { id: 'poincareArc', toolId: 'poincareArc', name: 'Arco de Poincaré', description: 'Arco hiperbólico' },
      ],
    },
    {
      id: 'text',
      label: 'Anotaciones & Explicación',
      tools: [
        { id: 'text', toolId: 'text', name: 'Etiqueta / Texto KaTeX', description: 'Punto ancla y contenido LaTeX' },
        { id: 'label', toolId: 'label', name: 'Etiqueta Matemática', description: 'Símbolo matemático' },
        { id: 'formula', toolId: 'formula', name: 'Fórmula Explicativa', description: 'Ecuaciones complejas en KaTeX' },
        { id: 'infoPanel', toolId: 'infoPanel', name: 'Panel Informativo', description: 'Tarjeta explicativa flotante' },
        { id: 'add_step', name: 'Nuevo Paso de Demostración', description: 'Crea un paso en la animación', action: onAddStepClick },
      ],
    },
  ], [effectiveGliderSupportId, onAddGliderPoint, onAddSliderClick, onAddStepClick, onOpenGuidedClick]);

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
    if (tool === 'select') return 'Mover / Seleccionar';
    if (tool === 'point') return 'Punto Libre';
    return KIND_LABELS[tool as ElementKind] || tool;
  };

  return (
    <nav className="relative z-50 flex flex-wrap items-center gap-1.5 p-1.5 bg-lienzo/95 border-b border-carbon/10 shadow-2xs backdrop-blur-md font-serif select-none transition-colors text-carbon motion-safe:transition-all">
      <button
        type="button"
        aria-label="Mover / Seleccionar"
        aria-pressed={activeTool === 'select'}
        onClick={() => onSelectTool('select')}
        className={`flex min-h-11 items-center space-x-1.5 h-8 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-salvia ${
          activeTool === 'select'
            ? 'bg-salvia text-lienzo shadow-xs'
            : 'bg-carbon/5 border border-carbon/15 text-carbon/80 hover:bg-carbon/10'
        }`}
      >
        <V2ToolDrawing tool="select" className="w-3.5 h-3.5" />
        <span>Mover</span>
      </button>

      <button
        type="button"
        aria-label="Punto libre"
        aria-pressed={activeTool === 'point'}
        onClick={() => onSelectTool('point')}
        className={`flex min-h-11 items-center space-x-1.5 h-8 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-salvia ${
          activeTool === 'point'
            ? 'bg-salvia text-lienzo shadow-xs'
            : 'bg-carbon/5 border border-carbon/15 text-carbon/80 hover:bg-carbon/10'
        }`}
      >
        <V2ToolDrawing tool="point" className="w-3.5 h-3.5" />
        <span>Punto Libre</span>
      </button>

      {onOpenGuidedClick && (
        <button
          type="button"
          onClick={onOpenGuidedClick}
          aria-label="Construcciones guiadas"
          className="flex min-h-11 items-center space-x-1.5 h-8 px-2.5 rounded-lg text-xs font-bold text-salvia bg-salvia/10 hover:bg-salvia/20 border border-salvia/30 transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-salvia"
          title="Abrir asistente de construcciones guiadas"
        >
          <IconSparkles className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Guiadas</span>
        </button>
      )}

      <div className="h-5 w-px bg-carbon/15 mx-1" />

      <div className="relative">
        <label className="flex min-h-11 items-center">
          <span className="sr-only">Buscar herramienta</span>
          <input
            type="search"
            value={toolQuery}
            onChange={e => setToolQuery(e.target.value)}
            placeholder="Buscar…"
            className="h-8 w-28 sm:w-44 rounded-lg border border-carbon/15 bg-carbon/5 px-2 text-xs text-carbon focus-visible:ring-2 focus-visible:ring-salvia"
          />
        </label>

        {isSearching && (
          <div
            role="listbox"
            aria-label="Resultados de búsqueda"
            className="absolute left-0 top-full mt-1.5 w-80 max-h-96 overflow-y-auto bg-lienzo rounded-2xl border border-carbon/20 shadow-2xl p-2 z-[80] motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-top-1 duration-200"
          >
            <div className="flex items-center justify-between px-2 py-1 mb-1 border-b border-carbon/10">
              <span className="text-[11px] font-bold text-carbon/70">
                {searchHits.length} resultado{searchHits.length === 1 ? '' : 's'}
              </span>
              <button
                type="button"
                onClick={() => setToolQuery('')}
                className="text-[10px] font-bold text-carbon/50 hover:text-carbon"
              >
                Limpiar
              </button>
            </div>
            {searchHits.length === 0 ? (
              <p className="px-2 py-3 text-[11px] text-carbon/50 italic">Ninguna herramienta coincide.</p>
            ) : (
              <div className="space-y-1">
                {searchHits.map(t => {
                  const isSelected = t.toolId ? activeTool === t.toolId : false;
                  const drawingTool = t.id === 'add_glider' ? 'point' : t.id;
                  const disabled = (t.id === 'add_glider' && !effectiveGliderSupportId) || isToolDisabled(t.toolId);
                  return (
                    <button
                      key={`${t.categoryId}-${t.id}`}
                      type="button"
                      role="option"
                      aria-selected={isSelected}
                      disabled={disabled}
                      onClick={() => {
                        handleToolSelect(t.toolId, t.action);
                        setToolQuery('');
                      }}
                      className={`w-full text-left p-2 rounded-xl border transition-all cursor-pointer disabled:opacity-40 ${
                        isSelected
                          ? 'bg-salvia text-lienzo border-salvia'
                          : 'bg-carbon/5 border-carbon/10 text-carbon hover:bg-carbon/10'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <div className={`p-1.5 rounded-lg shrink-0 ${isSelected ? 'bg-lienzo/20' : 'bg-salvia/10 text-salvia'}`}>
                          <V2ToolDrawing tool={drawingTool} className="w-4 h-4" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-xs font-bold truncate">{t.name}</span>
                            <span className={`text-[9px] shrink-0 ${isSelected ? 'text-lienzo/70' : 'text-carbon/45'}`}>
                              {t.categoryLabel}
                            </span>
                          </div>
                          <p className={`text-[10px] mt-0.5 truncate ${isSelected ? 'text-lienzo/80' : 'text-carbon/55'}`}>
                            {disabled && t.toolId ? 'Faltan referencias compatibles' : t.description}
                          </p>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

      {toolCategories.map(category => {
        const isOpen = !isSearching && openMenu === category.id;
        const hasActiveTool = category.tools.some(t => t.toolId === activeTool);
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
            <button
              type="button"
              aria-expanded={isOpen}
              aria-haspopup="menu"
              disabled={isSearching}
              onClick={() => setOpenMenu(isOpen ? null : category.id)}
              className={`flex min-h-11 items-center space-x-1.5 h-8 px-2.5 rounded-lg text-xs font-medium transition-all cursor-pointer border focus-visible:ring-2 focus-visible:ring-salvia ${
                hasActiveTool
                  ? 'bg-salvia/15 border-salvia text-salvia font-bold'
                  : isOpen
                  ? 'bg-carbon/10 border-carbon/20 text-carbon font-bold'
                  : 'bg-carbon/5 border-carbon/15 text-carbon/80 hover:bg-carbon/10'
              }`}
            >
              <span>{category.label}</span>
              {isSearching && matchCount > 0 && (
                <span className="text-[9px] font-mono bg-salvia/20 text-salvia px-1 rounded">{matchCount}</span>
              )}
              <IconChevronDown className="w-3 h-3 opacity-60" />
            </button>

            {isOpen && (
              <div role="menu" className="absolute top-full left-0 mt-1.5 w-76 bg-lienzo rounded-2xl border border-carbon/20 shadow-2xl p-2 z-[80] motion-safe:animate-in motion-safe:fade-in motion-safe:zoom-in duration-150">
                <div className="flex items-center justify-between px-2 py-1 mb-1 border-b border-carbon/10">
                  <span className="text-[11px] font-bold text-carbon/70 uppercase tracking-wider">
                    {category.label}
                  </span>
                  <button
                    type="button"
                    aria-label="Cerrar menú"
                    onClick={() => setOpenMenu(null)}
                    className="text-carbon/40 hover:text-carbon text-xs font-bold cursor-pointer focus-visible:ring-2 focus-visible:ring-salvia rounded"
                  >
                    <IconClose className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="space-y-1 max-h-80 overflow-y-auto">
                  {category.id === 'points' && onAddGliderPoint && (
                    <div className="p-2 mb-1 rounded-xl border border-carbon/10 bg-carbon/5 space-y-1.5">
                      <label className="block text-[10px] font-bold text-carbon/70 uppercase">
                        Soporte del punto sobre objeto
                        <select
                          value={effectiveGliderSupportId}
                          onChange={e => setGliderSupportId(e.target.value)}
                          disabled={gliderSupports.length === 0}
                          className="mt-0.5 w-full bg-lienzo border border-carbon/20 rounded px-2 py-1 text-xs disabled:opacity-40"
                        >
                          {gliderSupports.length === 0 && <option value="">Añade antes una línea o curva</option>}
                          {gliderSupports.map(item => (
                            <option key={item.id} value={item.id}>{item.label || item.id}</option>
                          ))}
                        </select>
                      </label>
                    </div>
                  )}
                  {category.tools.map(t => {
                    const isSelected = t.toolId ? activeTool === t.toolId : false;
                    const drawingTool = t.id === 'add_glider' ? 'point' : t.id;
                    const disabled = (t.id === 'add_glider' && !effectiveGliderSupportId) || isToolDisabled(t.toolId);
                    return (
                      <button
                        key={t.id}
                        type="button"
                        disabled={disabled}
                        aria-pressed={isSelected}
                        onClick={() => handleToolSelect(t.toolId, t.action)}
                        className={`w-full text-left p-2 rounded-xl border transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed focus-visible:ring-2 focus-visible:ring-salvia ${
                          isSelected
                            ? 'bg-salvia text-lienzo border-salvia shadow-2xs font-bold'
                            : 'bg-carbon/5 border-carbon/10 text-carbon hover:bg-carbon/10'
                        }`}
                      >
                        <div className="flex items-center space-x-2.5">
                          <div className={`p-1.5 rounded-lg shrink-0 ${isSelected ? 'bg-lienzo/20 text-lienzo' : 'bg-salvia/10 text-salvia'}`}>
                            <V2ToolDrawing tool={drawingTool} className="w-4 h-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold truncate">{t.name}</span>
                              {t.toolId && (
                                <span
                                  className={`text-[9px] px-1.5 py-0.5 rounded font-mono ${
                                    isSelected ? 'bg-lienzo/20 text-lienzo' : 'bg-carbon/10 text-carbon/60'
                                  }`}
                                >
                                  {t.toolId}
                                </span>
                              )}
                            </div>
                            <p
                              className={`text-[10px] mt-0.5 leading-tight truncate ${
                                isSelected ? 'text-lienzo/80' : 'text-carbon/60'
                              }`}
                            >
                              {disabled && t.toolId ? 'Faltan referencias compatibles' : t.description}
                            </p>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        );
      })}

      <div className="ml-auto flex items-center space-x-2 bg-carbon/5 px-2.5 py-1 rounded-lg border border-carbon/15 text-xs">
        <span className="text-[11px] text-carbon/50">Activa:</span>
        <div className="flex items-center space-x-1">
          <V2ToolDrawing tool={activeTool} className="w-3.5 h-3.5 text-salvia" />
          <span className="font-bold text-salvia">{getToolDisplayName(activeTool)}</span>
        </div>
      </div>
    </nav>
  );
};
