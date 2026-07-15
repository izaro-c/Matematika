import React, { useEffect, useRef, useState } from 'react';
import type { VisualDiagramModel, CanvasTool } from '../model/types';
import { KIND_LABELS, refsNeededForTool } from '../model/commands';

const TOOL_GROUPS: Array<{ label: string; description: string; tools: CanvasTool[] }> = [
  { label: 'Geometría básica', description: 'Objetos definidos por puntos.', tools: ['segment', 'line', 'ray', 'polygon', 'circle', 'arc'] },
  { label: 'Puntos y construcciones', description: 'Construcciones exactas a partir de puntos existentes.', tools: ['midpoint', 'perpendicularFoot', 'baseExtension', 'perpendicular', 'parallel', 'angleBisector'] },
  { label: 'Curvas', description: 'Gráficas y geometrías no euclidianas.', tools: ['functionCurve', 'parametricCurve', 'poincareGeodesic', 'poincareArc'] },
  { label: 'Ángulos y medidas', description: 'Marcas, relaciones y medidas visibles.', tools: ['angle', 'rightAngle', 'perpendicularMark', 'congruenceMark', 'dimensionLine', 'measurement'] },
  { label: 'Explicación', description: 'Texto, fórmulas y descomposición visual.', tools: ['grid', 'areaDecomposition', 'text', 'label', 'formula', 'infoPanel'] },
];

function toolLabel(tool: CanvasTool): string {
  if (tool === 'select') return 'Seleccionar';
  if (tool === 'point') return 'Punto libre';
  return KIND_LABELS[tool];
}

function toolInstruction(tool: CanvasTool): string {
  const required = refsNeededForTool(tool);
  if (required === 0) return 'Se crea inmediatamente y después se edita en Propiedades.';
  if (tool === 'polygon') return 'Elija al menos 3 vértices y finalice con Crear polígono.';
  if (tool === 'angle' || tool === 'rightAngle' || tool === 'perpendicularMark' || tool === 'angleBisector') {
    return 'Elija un punto del primer lado, el vértice y un punto del segundo lado, en ese orden.';
  }
  return `Después se eligen ${required} ${required === 1 ? 'punto' : 'puntos'} en el lienzo.`;
}

interface DiagramToolbarProps {
  model: VisualDiagramModel;
  canvasTool: CanvasTool;
  syncStatus: string;
  onSetCanvasTool: (tool: CanvasTool) => void;
  onAddElement: (tool: Exclude<CanvasTool, 'select' | 'point'>) => void;
  onModelEdit: (model: VisualDiagramModel) => void;
  onAddSlider: () => void;
  onAddGliderPoint: () => void;
  onAddStep: () => void;
  onResolveDivergence: (authority: 'visual' | 'source') => void;
}

type OpenMenu = 'objects' | 'view' | 'more' | null;

export const DiagramToolbar: React.FC<DiagramToolbarProps> = ({
  model,
  canvasTool,
  syncStatus,
  onSetCanvasTool,
  onAddElement,
  onModelEdit,
  onAddSlider,
  onAddGliderPoint,
  onAddStep,
  onResolveDivergence,
}) => {
  const [openMenu, setOpenMenu] = useState<OpenMenu>(null);
  const toolbarRef = useRef<HTMLDivElement>(null);
  const currentToolLabel = toolLabel(canvasTool);

  useEffect(() => {
    if (!openMenu) return undefined;
    const closeOutside = (event: PointerEvent) => {
      if (!toolbarRef.current?.contains(event.target as Node)) setOpenMenu(null);
    };
    const closeWithEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpenMenu(null);
    };
    document.addEventListener('pointerdown', closeOutside);
    document.addEventListener('keydown', closeWithEscape);
    return () => {
      document.removeEventListener('pointerdown', closeOutside);
      document.removeEventListener('keydown', closeWithEscape);
    };
  }, [openMenu]);

  const toggleMenu = (menu: Exclude<OpenMenu, null>) => setOpenMenu(current => current === menu ? null : menu);

  return (
    <div ref={toolbarRef} className="relative flex flex-wrap items-center gap-2 rounded border border-carbon/15 bg-carbon/5 p-2" aria-label="Herramientas del lienzo">
      <span className="hidden pl-1 text-[9px] font-bold uppercase tracking-widest text-carbon/45 sm:inline">Herramienta</span>
      {(['select', 'point'] as const).map(tool => (
        <button
          key={tool}
          type="button"
          aria-label={toolLabel(tool)}
          aria-pressed={canvasTool === tool}
          onClick={() => {
            setOpenMenu(null);
            onSetCanvasTool(tool);
          }}
          className={`rounded px-2.5 py-1.5 text-[10px] font-bold ${canvasTool === tool ? 'bg-carbon text-lienzo' : 'border border-carbon/15 bg-lienzo text-carbon/70 hover:bg-carbon/5'}`}
        >
          {toolLabel(tool)}
        </button>
      ))}
      <button
        type="button"
        disabled={!model.elements.some(item => ['segment', 'line', 'ray', 'circle', 'arc', 'functionCurve', 'parametricCurve', 'perpendicular', 'parallel', 'angleBisector'].includes(item.kind))}
        title="Crea un punto móvil sobre el primer objeto compatible; después puede cambiarse el objeto base en Propiedades."
        onClick={() => { setOpenMenu(null); onAddGliderPoint(); }}
        className="rounded border border-carbon/15 bg-lienzo px-2.5 py-1.5 text-[10px] font-bold text-carbon/70 hover:bg-carbon/5 disabled:opacity-35"
      >
        Punto sobre objeto
      </button>

      <div className="relative">
        <button
          type="button"
          aria-haspopup="menu"
          aria-expanded={openMenu === 'objects'}
          onClick={() => toggleMenu('objects')}
          className="rounded border border-carbon/15 bg-lienzo px-2.5 py-1.5 text-[10px] font-bold text-carbon/70 hover:bg-carbon/5"
        >
          Añadir objeto <span aria-hidden="true">▾</span>
        </button>
        {openMenu === 'objects' && (
          <div role="menu" className="absolute left-0 top-full z-30 mt-2 grid max-h-[min(34rem,72vh)] w-[min(28rem,calc(100vw-2rem))] gap-2 overflow-y-auto rounded border border-carbon/15 bg-lienzo p-2 shadow-xl">
            {TOOL_GROUPS.map(group => (
              <section key={group.label} className="rounded border border-carbon/10 p-2">
                <h4 className="text-[9px] font-bold uppercase tracking-wider text-carbon/55">{group.label}</h4>
                <p className="mb-2 mt-0.5 text-[9px] leading-relaxed text-carbon/45">{group.description}</p>
                <div className="grid gap-1 sm:grid-cols-2">
                  {group.tools.map(tool => {
                    const required = refsNeededForTool(tool);
                    const disabled = required > model.points.length;
                    return (
                      <button
                        key={tool}
                        type="button"
                        role="menuitem"
                        aria-label={toolLabel(tool)}
                        title={disabled ? `Se necesitan ${required} puntos; ahora hay ${model.points.length}.` : toolInstruction(tool)}
                        disabled={disabled}
                        className={`rounded border px-2 py-1.5 text-left text-[10px] font-bold disabled:opacity-35 ${canvasTool === tool ? 'border-carbon bg-carbon text-lienzo' : 'border-carbon/10 text-carbon/75 hover:bg-carbon/5'}`}
                        onClick={() => {
                          setOpenMenu(null);
                          if (required === 0) onAddElement(tool as Exclude<CanvasTool, 'select' | 'point'>);
                          else onSetCanvasTool(tool);
                        }}
                      >
                        <span className="block">{toolLabel(tool)}</span>
                        <span className={`block text-[9px] font-normal ${canvasTool === tool ? 'text-lienzo/70' : 'text-carbon/45'}`}>{disabled ? `Faltan ${required - model.points.length} punto(s)` : toolInstruction(tool)}</span>
                      </button>
                    );
                  })}
                </div>
              </section>
            ))}
          </div>
        )}
      </div>

      <div className="relative">
        <button type="button" aria-haspopup="menu" aria-expanded={openMenu === 'view'} onClick={() => toggleMenu('view')} className="rounded border border-carbon/15 bg-lienzo px-2.5 py-1.5 text-[10px] font-bold text-carbon/70 hover:bg-carbon/5">
          Vista <span aria-hidden="true">▾</span>
        </button>
        {openMenu === 'view' && (
          <div role="menu" className="absolute right-0 top-full z-30 mt-2 w-48 space-y-2 rounded border border-carbon/15 bg-lienzo p-3 shadow-xl">
            <label className="flex items-center gap-2 text-xs text-carbon"><input type="checkbox" aria-label="Cuadrícula" checked={model.grid} onChange={(event) => { onModelEdit({ ...model, grid: event.target.checked }); setOpenMenu(null); }} />Cuadrícula</label>
            <label className="flex items-center gap-2 text-xs text-carbon"><input type="checkbox" aria-label="Ejes" checked={model.axis} onChange={(event) => { onModelEdit({ ...model, axis: event.target.checked }); setOpenMenu(null); }} />Ejes</label>
          </div>
        )}
      </div>

      <div className="relative">
        <button type="button" aria-haspopup="menu" aria-expanded={openMenu === 'more'} onClick={() => toggleMenu('more')} className="rounded border border-carbon/15 bg-lienzo px-2.5 py-1.5 text-[10px] font-bold text-carbon/70 hover:bg-carbon/5">
          Más <span aria-hidden="true">▾</span>
        </button>
        {openMenu === 'more' && (
          <div role="menu" className="absolute right-0 top-full z-30 mt-2 w-56 space-y-1 rounded border border-carbon/15 bg-lienzo p-1.5 shadow-xl">
            <button type="button" role="menuitem" onClick={() => { setOpenMenu(null); onAddSlider(); }} className="block w-full rounded px-2 py-2 text-left text-[10px] font-bold text-carbon hover:bg-carbon/5">+ Control deslizante</button>
            <button type="button" role="menuitem" onClick={() => { setOpenMenu(null); onAddStep(); }} className="block w-full rounded px-2 py-2 text-left text-[10px] font-bold text-carbon hover:bg-carbon/5">+ Paso de la secuencia</button>
          </div>
        )}
      </div>

      <span className="ml-auto hidden text-[10px] text-carbon/45 md:inline">Activa: <strong className="text-carbon/65">{currentToolLabel}</strong></span>

      {syncStatus === 'diverged' && (
        <div className="flex w-full flex-wrap items-center gap-2 rounded bg-granada/10 px-2 py-1">
          <span className="text-[10px] font-bold text-granada">DIVERGENCIA DETECTADA:</span>
          <button onClick={() => onResolveDivergence('visual')} className="text-[10px] underline">Usar visual</button>
          <button onClick={() => onResolveDivergence('source')} className="text-[10px] underline">Usar código</button>
        </div>
      )}
    </div>
  );
};

export default DiagramToolbar;
