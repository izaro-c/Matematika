import React from 'react';
import type { VisualDiagramModel, VisualPoint, VisualElement, VisualSlider, VisualStep, ColorToken, PointConstraint } from '../model/types';
import { COLOR_OPTIONS, KIND_LABELS } from '../model/commands';
import { cleanTargetId, renamePoint, renameElement, renameSlider } from '../model/commands';
import { updatePoint, updateElement, updateSlider, updateStep } from '../model/commands';

interface DiagramInspectorProps {
  model: VisualDiagramModel;
  selectedId: string;
  onSelect: (id: string) => void;
  onModelEdit: (model: VisualDiagramModel) => void;
  onDeleteSelected: () => void;
}

export const DiagramInspector: React.FC<DiagramInspectorProps> = ({
  model,
  selectedId,
  onSelect,
  onModelEdit,
  onDeleteSelected,
}) => {
  const selectedPoint = model.points.find(item => item.id === selectedId);
  const selectedElement = model.elements.find(item => item.id === selectedId);
  const selectedSlider = model.sliders.find(item => item.id === selectedId);
  const selectedStep = model.steps.find(item => item.id === selectedId);

  const hasSelection = selectedPoint || selectedElement || selectedSlider || selectedStep;

  const handlePointChange = (update: Partial<VisualPoint>) => {
    if (!selectedPoint) return;
    onModelEdit(updatePoint(model, selectedPoint.id, update));
  };

  const handleElementChange = (update: Partial<VisualElement>) => {
    if (!selectedElement) return;
    onModelEdit(updateElement(model, selectedElement.id, update));
  };

  const handleSliderChange = (update: Partial<VisualSlider>) => {
    if (!selectedSlider) return;
    onModelEdit(updateSlider(model, selectedSlider.id, update));
  };

  const handleStepChange = (update: Partial<VisualStep>) => {
    if (!selectedStep) return;
    onModelEdit(updateStep(model, selectedStep.id, update));
  };

  return (
    <section className="rounded border border-carbon/10 bg-lienzo p-3 h-full overflow-y-auto">
      <h4 className="text-[10px] font-bold uppercase tracking-widest text-carbon/45 border-b border-carbon/10 pb-1 mb-3">Propiedades</h4>
      
      {!hasSelection && (
        <p className="text-xs italic text-carbon/55">Seleccione un punto, elemento o slider en el lienzo.</p>
      )}

      {selectedPoint && (
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-bold text-carbon mb-1">Target ID</label>
            <input
              className="w-full rounded border border-carbon/15 bg-lienzo p-1.5 font-mono text-xs"
              value={selectedPoint.id}
              onChange={(e) => {
                const nextId = cleanTargetId(e.target.value, selectedPoint.id);
                onModelEdit(renamePoint(model, selectedPoint.id, nextId));
                onSelect(nextId);
              }}
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-carbon mb-1">Etiqueta</label>
            <input
              className="w-full rounded border border-carbon/15 bg-lienzo p-1.5 text-xs"
              value={selectedPoint.label}
              onChange={(e) => handlePointChange({ label: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs font-bold text-carbon mb-1">Coordenada X</label>
              <input
                type="number"
                step="0.5"
                className="w-full rounded border border-carbon/15 bg-lienzo p-1.5 text-xs"
                value={selectedPoint.x}
                onChange={(e) => handlePointChange({ x: Number(e.target.value) })}
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-carbon mb-1">Coordenada Y</label>
              <input
                type="number"
                step="0.5"
                className="w-full rounded border border-carbon/15 bg-lienzo p-1.5 text-xs"
                value={selectedPoint.y}
                onChange={(e) => handlePointChange({ y: Number(e.target.value) })}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-carbon mb-1">Restricción</label>
            <select
              className="w-full rounded border border-carbon/15 bg-lienzo p-1.5 text-xs"
              value={selectedPoint.constraint || 'free'}
              onChange={(e) => handlePointChange({ constraint: e.target.value as PointConstraint })}
            >
              <option value="free">Libre</option>
              <option value="fixed">Fijo</option>
              <option value="horizontal">Horizontal</option>
              <option value="vertical">Vertical</option>
              <option value="glider">Glider (sobre elemento)</option>
            </select>
          </div>

          {selectedPoint.constraint === 'glider' && (
            <div>
              <label className="block text-xs font-bold text-carbon mb-1">Elemento base</label>
              <select
                className="w-full rounded border border-carbon/15 bg-lienzo p-1.5 text-xs font-mono"
                value={selectedPoint.gliderTarget || ''}
                onChange={(e) => handlePointChange({ gliderTarget: e.target.value })}
              >
                <option value="">Seleccione elemento...</option>
                {model.elements.map(el => (
                  <option key={el.id} value={el.id}>{el.id} ({KIND_LABELS[el.kind]})</option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-carbon mb-1">Color</label>
            <select
              className="w-full rounded border border-carbon/15 bg-lienzo p-1.5 text-xs"
              value={selectedPoint.color}
              onChange={(e) => handlePointChange({ color: e.target.value as ColorToken })}
            >
              {COLOR_OPTIONS.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>

          <label className="flex items-center gap-1.5 text-xs font-bold text-carbon">
            <input
              type="checkbox"
              checked={selectedPoint.target}
              onChange={(e) => handlePointChange({ target: e.target.checked })}
              className="rounded border-carbon/15 bg-lienzo"
            />
            ¿Es Target MDX?
          </label>
        </div>
      )}

      {selectedElement && (
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-bold text-carbon mb-1">Target ID</label>
            <input
              className="w-full rounded border border-carbon/15 bg-lienzo p-1.5 font-mono text-xs"
              value={selectedElement.id}
              onChange={(e) => {
                const nextId = cleanTargetId(e.target.value, selectedElement.id);
                onModelEdit(renameElement(model, selectedElement.id, nextId));
                onSelect(nextId);
              }}
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-carbon mb-1">Etiqueta</label>
            <input
              className="w-full rounded border border-carbon/15 bg-lienzo p-1.5 text-xs"
              value={selectedElement.label}
              onChange={(e) => handleElementChange({ label: e.target.value })}
            />
          </div>

          <div>
            <p className="block text-xs font-bold text-carbon mb-1">Tipo: <span className="font-normal text-carbon/75">{KIND_LABELS[selectedElement.kind]}</span></p>
          </div>

          {(selectedElement.kind === 'text' || selectedElement.kind === 'measurement') && (
            <div>
              <label className="block text-xs font-bold text-carbon mb-1">Contenido de texto</label>
              <input
                className="w-full rounded border border-carbon/15 bg-lienzo p-1.5 text-xs"
                value={selectedElement.text || ''}
                onChange={(e) => handleElementChange({ text: e.target.value })}
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-carbon mb-1">Color</label>
            <select
              className="w-full rounded border border-carbon/15 bg-lienzo p-1.5 text-xs"
              value={selectedElement.color}
              onChange={(e) => handleElementChange({ color: e.target.value as ColorToken })}
            >
              {COLOR_OPTIONS.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>

          <label className="flex items-center gap-1.5 text-xs font-bold text-carbon">
            <input
              type="checkbox"
              checked={selectedElement.dashed || false}
              onChange={(e) => handleElementChange({ dashed: e.target.checked })}
              className="rounded border-carbon/15 bg-lienzo"
            />
            ¿Línea discontinua?
          </label>

          <label className="flex items-center gap-1.5 text-xs font-bold text-carbon">
            <input
              type="checkbox"
              checked={selectedElement.target}
              onChange={(e) => handleElementChange({ target: e.target.checked })}
              className="rounded border-carbon/15 bg-lienzo"
            />
            ¿Es Target MDX?
          </label>
        </div>
      )}

      {selectedSlider && (
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-bold text-carbon mb-1">Target ID</label>
            <input
              className="w-full rounded border border-carbon/15 bg-lienzo p-1.5 font-mono text-xs"
              value={selectedSlider.id}
              onChange={(e) => {
                const nextId = cleanTargetId(e.target.value, selectedSlider.id);
                onModelEdit(renameSlider(model, selectedSlider.id, nextId));
                onSelect(nextId);
              }}
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-carbon mb-1">Etiqueta</label>
            <input
              className="w-full rounded border border-carbon/15 bg-lienzo p-1.5 text-xs"
              value={selectedSlider.label}
              onChange={(e) => handleSliderChange({ label: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-3 gap-1">
            <div>
              <label className="block text-[10px] font-bold text-carbon mb-1">Mínimo</label>
              <input
                type="number"
                className="w-full rounded border border-carbon/15 bg-lienzo p-1 text-xs"
                value={selectedSlider.min}
                onChange={(e) => handleSliderChange({ min: Number(e.target.value) })}
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-carbon mb-1">Valor</label>
              <input
                type="number"
                step={selectedSlider.step}
                className="w-full rounded border border-carbon/15 bg-lienzo p-1 text-xs"
                value={selectedSlider.value}
                onChange={(e) => handleSliderChange({ value: Number(e.target.value) })}
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-carbon mb-1">Máximo</label>
              <input
                type="number"
                className="w-full rounded border border-carbon/15 bg-lienzo p-1 text-xs"
                value={selectedSlider.max}
                onChange={(e) => handleSliderChange({ max: Number(e.target.value) })}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-carbon mb-1">Color</label>
            <select
              className="w-full rounded border border-carbon/15 bg-lienzo p-1.5 text-xs"
              value={selectedSlider.color}
              onChange={(e) => handleSliderChange({ color: e.target.value as ColorToken })}
            >
              {COLOR_OPTIONS.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
        </div>
      )}

      {selectedStep && (
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-bold text-carbon mb-1">Etiqueta</label>
            <input
              className="w-full rounded border border-carbon/15 bg-lienzo p-1.5 text-xs"
              value={selectedStep.label}
              onChange={(e) => handleStepChange({ label: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-carbon mb-1">Descripción</label>
            <textarea
              className="w-full h-16 rounded border border-carbon/15 bg-lienzo p-1.5 text-xs resize-none"
              value={selectedStep.description}
              onChange={(e) => handleStepChange({ description: e.target.value })}
            />
          </div>
        </div>
      )}

      {hasSelection && (
        <button
          onClick={onDeleteSelected}
          className="mt-6 w-full rounded bg-granada/10 border border-granada/25 hover:bg-granada text-granada hover:text-lienzo transition-all py-1.5 text-xs font-bold"
        >
          Eliminar elemento
        </button>
      )}
    </section>
  );
};
export default DiagramInspector;
