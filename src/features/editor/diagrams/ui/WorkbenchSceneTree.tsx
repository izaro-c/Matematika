import React, { useState } from 'react';
import type { VisualDiagramModel, VisualPoint, VisualElement, VisualSlider } from '../model/types';
import { PALETTE_TOKENS } from './inspector/paletteTokens';
import { GroupsAndLayersManager } from './scene/GroupsAndLayersManager';
import { IconEye, IconEyeOff, IconLock, IconUnlock, IconChevronDown, IconChevronRight } from './WorkbenchIcons';
import { ObjectListBatchToolbar } from './scene/ObjectListBatchToolbar';

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
  onCopySelection,
  onDeleteSelection,
}) => {
  const [viewMode, setViewMode] = useState<'tree' | 'groups_layers'>('tree');
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

  const renderSectionHeader = (key: string, title: string, count: number) => (
    <button
      type="button"
      onClick={() => toggleCategory(key)}
      className="flex w-full items-center justify-between py-1.5 px-2 bg-carbon/5 hover:bg-carbon/10 rounded-lg text-xs font-bold text-carbon transition-all cursor-pointer mt-2"
    >
      <span className="flex items-center space-x-1.5">
        <span className="text-carbon/50">
          {openCategory[key] ? <IconChevronDown className="w-3 h-3" /> : <IconChevronRight className="w-3 h-3" />}
        </span>
        <span>{title}</span>
      </span>
      <span className="text-[10px] font-mono text-carbon/60 bg-carbon/10 px-1.5 py-0.2 rounded border border-carbon/10">
        {count}
      </span>
    </button>
  );

  const renderElementRow = (
    id: string,
    label: string,
    colorTokenId?: string,
    typeLabel?: string,
    visible: boolean = true,
    locked: boolean = false,
    onToggleVis?: () => void,
    onToggleLock?: () => void
  ) => {
    const isSelected = selectedIds.includes(id);
    const token = PALETTE_TOKENS.find(t => t.id === colorTokenId) || PALETTE_TOKENS[0];

    return (
      <div
        key={id}
        onClick={event => onSelectObjects([id], event.ctrlKey || event.metaKey || event.shiftKey)}
        className={`flex items-center justify-between p-1.5 rounded-lg border transition-all cursor-pointer ${
          isSelected
            ? 'border-salvia bg-salvia/15 font-bold'
            : 'border-carbon/10 hover:bg-carbon/5 bg-carbon/5'
        }`}
      >
        <div className="flex items-center space-x-2 min-w-0">
          <span className={`h-3 w-3 rounded-full border border-carbon/20 shrink-0 ${token.bgClass}`} />
          <span className="truncate text-carbon">{label || id}</span>
        </div>
        <div className="flex items-center space-x-1.5 shrink-0">
          {typeLabel && <span className="text-[9px] font-mono text-carbon/40">{typeLabel}</span>}
          <span className="text-[10px] font-mono text-carbon/60 font-bold bg-carbon/10 px-1.5 rounded">
            {id}
          </span>
          <div className="flex items-center space-x-0.5 border-l border-carbon/15 pl-1 ml-0.5">
            {onToggleVis ? (
              <button
                type="button"
                onClick={e => {
                  e.stopPropagation();
                  onToggleVis();
                }}
                className={`p-1 rounded cursor-pointer transition-colors w-6 h-6 flex items-center justify-center ${
                  visible ? 'text-salvia hover:bg-salvia/10' : 'text-carbon/30 hover:bg-carbon/10'
                }`}
                title={visible ? 'Ocultar elemento' : 'Mostrar elemento'}
              >
                {visible ? <IconEye className="w-3.5 h-3.5" /> : <IconEyeOff className="w-3.5 h-3.5" />}
              </button>
            ) : (
              <div className="w-6 h-6" />
            )}

            {onToggleLock ? (
              <button
                type="button"
                onClick={e => {
                  e.stopPropagation();
                  onToggleLock();
                }}
                className={`p-1 rounded cursor-pointer transition-colors w-6 h-6 flex items-center justify-center ${
                  locked ? 'text-terracota hover:bg-terracota/10' : 'text-carbon/30 hover:bg-carbon/10'
                }`}
                title={locked ? 'Desbloquear elemento' : 'Bloquear elemento'}
              >
                {locked ? <IconLock className="w-3.5 h-3.5" /> : <IconUnlock className="w-3.5 h-3.5" />}
              </button>
            ) : (
              <div className="w-6 h-6" />
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="p-3 space-y-2 text-xs font-serif text-carbon">
      <div className="flex border-b border-carbon/10 bg-carbon/5 p-1 rounded-lg">
        <button
          type="button"
          onClick={() => setViewMode('tree')}
          className={`flex-1 py-1 text-xs font-bold rounded transition-all cursor-pointer ${
            viewMode === 'tree' ? 'bg-lienzo text-carbon shadow-2xs' : 'text-carbon/60 hover:text-carbon'
          }`}
        >
          Árbol de Objetos
        </button>
        <button
          type="button"
          onClick={() => setViewMode('groups_layers')}
          className={`flex-1 py-1 text-xs font-bold rounded transition-all cursor-pointer ${
            viewMode === 'groups_layers' ? 'bg-lienzo text-carbon shadow-2xs' : 'text-carbon/60 hover:text-carbon'
          }`}
        >
          Grupos & Capas
        </button>
      </div>

      {selectedIds.length > 1 && onUpdateModel && (
        <div className="space-y-1">
          <ObjectListBatchToolbar
            model={model}
            selectedIds={selectedIds}
            onModelEdit={nextModel => onUpdateModel(nextModel, 'Editar selección múltiple')}
            onClearSelection={() => onSelectObjects([])}
          />
          <div className="flex justify-end gap-2 text-[10px]">
            {onCopySelection && <button type="button" onClick={onCopySelection} className="text-salvia underline">Copiar selección</button>}
            {onDeleteSelection && <button type="button" onClick={onDeleteSelection} className="text-granada underline">Eliminar selección</button>}
          </div>
        </div>
      )}

      {viewMode === 'groups_layers' && onUpdateModel ? (
        <GroupsAndLayersManager model={model} onUpdateModel={onUpdateModel} />
      ) : (
        <div className="space-y-1">
          {/* Puntos */}
          {renderSectionHeader('points', 'Puntos', points.length)}
          {openCategory['points'] && (
            <div className="pl-2 space-y-1">
              {points.map(p =>
                renderElementRow(
                  p.id,
                  `${p.label || p.id} (${p.x.toFixed(1)}, ${p.y.toFixed(1)})`,
                  p.color,
                  'Punto',
                  p.visible !== false,
                  p.fixed || p.constraint === 'fixed',
                  () => onUpdatePoint(p.id, { visible: p.visible === false }),
                  () => {
                    const locked = p.fixed || p.constraint === 'fixed';
                    onUpdatePoint(p.id, locked
                      ? { fixed: false, constraint: 'free' }
                      : { fixed: true, constraint: 'fixed' });
                  }
                )
              )}
            </div>
          )}

          {/* Puntos derivados (elementos midpoint/intersection) */}
          {renderSectionHeader('derived', 'Puntos derivados', derivedPoints.length)}
          {openCategory['derived'] && (
            <div className="pl-2 space-y-1">
              {derivedPoints.map(e =>
                renderElementRow(
                  e.id,
                  e.label || e.id,
                  e.color,
                  e.kind,
                  e.visible !== false,
                  e.locked,
                  onUpdateElement ? () => onUpdateElement(e.id, { visible: e.visible === false }) : undefined,
                  onUpdateElement ? () => onUpdateElement(e.id, { locked: !e.locked }) : undefined
                )
              )}
            </div>
          )}

          {/* Líneas y Polígonos */}
          {renderSectionHeader('lines', 'Líneas y Segmentos', lines.length)}
          {openCategory['lines'] && (
            <div className="pl-2 space-y-1">
              {lines.map(e =>
                renderElementRow(
                  e.id,
                  e.label || e.id,
                  e.color,
                  e.kind,
                  e.visible !== false,
                  e.locked,
                  onUpdateElement ? () => onUpdateElement(e.id, { visible: e.visible === false }) : undefined,
                  onUpdateElement ? () => onUpdateElement(e.id, { locked: !e.locked }) : undefined
                )
              )}
            </div>
          )}

          {/* Círculos y Arcos */}
          {renderSectionHeader('circles', 'Círculos y Arcos', circles.length)}
          {openCategory['circles'] && (
            <div className="pl-2 space-y-1">
              {circles.map(e =>
                renderElementRow(
                  e.id,
                  e.label || e.id,
                  e.color,
                  e.kind,
                  e.visible !== false,
                  e.locked,
                  onUpdateElement ? () => onUpdateElement(e.id, { visible: e.visible === false }) : undefined,
                  onUpdateElement ? () => onUpdateElement(e.id, { locked: !e.locked }) : undefined
                )
              )}
            </div>
          )}

          {/* Ángulos y Marcas */}
          {renderSectionHeader('angles', 'Ángulos y Marcas', anglesAndMarks.length)}
          {openCategory['angles'] && (
            <div className="pl-2 space-y-1">
              {anglesAndMarks.map(e =>
                renderElementRow(
                  e.id,
                  e.label || e.id,
                  e.color,
                  e.kind,
                  e.visible !== false,
                  e.locked,
                  onUpdateElement ? () => onUpdateElement(e.id, { visible: e.visible === false }) : undefined,
                  onUpdateElement ? () => onUpdateElement(e.id, { locked: !e.locked }) : undefined
                )
              )}
            </div>
          )}

          {/* Curvas y Áreas */}
          {renderSectionHeader('curves', 'Curvas y Áreas', curvesAndAreas.length)}
          {openCategory['curves'] && (
            <div className="pl-2 space-y-1">
              {curvesAndAreas.map(e =>
                renderElementRow(
                  e.id,
                  e.label || e.id,
                  e.color,
                  e.kind,
                  e.visible !== false,
                  e.locked,
                  onUpdateElement ? () => onUpdateElement(e.id, { visible: e.visible === false }) : undefined,
                  onUpdateElement ? () => onUpdateElement(e.id, { locked: !e.locked }) : undefined
                )
              )}
            </div>
          )}

          {/* Anotaciones y Texto */}
          {renderSectionHeader('annotations', 'Anotaciones y Texto', annotations.length)}
          {openCategory['annotations'] && (
            <div className="pl-2 space-y-1">
              {annotations.map(e =>
                renderElementRow(
                  e.id,
                  e.label || e.id,
                  e.color,
                  e.kind,
                  e.visible !== false,
                  e.locked,
                  onUpdateElement ? () => onUpdateElement(e.id, { visible: e.visible === false }) : undefined,
                  onUpdateElement ? () => onUpdateElement(e.id, { locked: !e.locked }) : undefined
                )
              )}
            </div>
          )}

          {uncategorized.length > 0 && (
            <>
              {renderSectionHeader('other', 'Otros elementos', uncategorized.length)}
              {openCategory['other'] && (
                <div className="pl-2 space-y-1">
                  {uncategorized.map(e =>
                    renderElementRow(
                      e.id,
                      e.label || e.id,
                      e.color,
                      e.kind,
                      e.visible !== false,
                      e.locked,
                      onUpdateElement ? () => onUpdateElement(e.id, { visible: e.visible === false }) : undefined,
                      onUpdateElement ? () => onUpdateElement(e.id, { locked: !e.locked }) : undefined
                    )
                  )}
                </div>
              )}
            </>
          )}

          {/* Deslizadores */}
          {renderSectionHeader('sliders', 'Deslizadores Numéricos', sliders.length)}
          {openCategory['sliders'] && (
            <div className="pl-2 space-y-1">
              {sliders.map(s =>
                renderElementRow(
                  s.id,
                  `${s.label || s.id} = ${s.value}`,
                  s.color,
                  'Slider',
                  s.visible !== false,
                  s.locked,
                  onUpdateSlider ? () => onUpdateSlider(s.id, { visible: s.visible === false }) : undefined,
                  onUpdateSlider ? () => onUpdateSlider(s.id, { locked: !s.locked }) : undefined
                )
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
