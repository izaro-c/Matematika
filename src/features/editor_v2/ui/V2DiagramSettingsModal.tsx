import React from 'react';
import type { VisualDiagramModel } from '../../editor/diagrams/model/types';
import type { DiagramMode } from '@/shared/diagrams/spec';
import { DiagramHeaderReadingsEditor } from '../../editor/diagrams/ui/DiagramHeaderReadingsEditor';

interface V2DiagramSettingsModalProps {
  isOpen: boolean;
  model: VisualDiagramModel | null;
  onClose: () => void;
  onUpdateModel: (updates: Partial<VisualDiagramModel>, label: string) => void;
}

export const V2DiagramSettingsModal: React.FC<V2DiagramSettingsModalProps> = ({
  isOpen,
  model,
  onClose,
  onUpdateModel,
}) => {
  if (!isOpen || !model) return null;
  const updateViewportValue = (
    key: 'bounds' | 'home',
    index: number,
    value: string,
  ) => {
    const number = Number(value);
    if (!Number.isFinite(number)) return;
    const current = [...(model.viewport[key] ?? model.viewport.bounds)] as [number, number, number, number];
    current[index] = number;
    onUpdateModel({ viewport: { ...model.viewport, [key]: current } }, `Editar vista ${key}`);
  };

  return (
    <div role="presentation" className="fixed inset-0 z-50 flex items-center justify-center bg-carbon/50 backdrop-blur-xs p-4 font-serif">
      <div role="dialog" aria-modal="true" className="w-full max-w-xl bg-lienzo rounded-2xl border border-carbon/15 shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200 text-carbon">
        <div className="flex items-center justify-between p-4 border-b border-carbon/10 bg-carbon/5">
          <div>
            <h2 className="font-serif font-bold text-base text-carbon">Configuración Global del Diagrama</h2>
            <p className="text-xs text-pizarra/70 italic">Edita el título, modo, notas explicativas y lienzo.</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-carbon/60 hover:text-carbon p-1 rounded-lg text-lg font-bold cursor-pointer"
          >
            ✕
          </button>
        </div>

        <div className="p-5 space-y-4 text-xs font-serif text-carbon max-h-[75vh] overflow-y-auto">
          {/* Título del Diagrama */}
          <div>
            <label className="block text-[11px] font-bold text-carbon/70 mb-1">Título Principal</label>
            <input
              type="text"
              value={model.title || ''}
              onChange={(e) => onUpdateModel({ title: e.target.value }, 'Editar título del diagrama')}
              className="w-full bg-carbon/5 border border-carbon/20 rounded px-2.5 py-1.5 text-xs font-bold text-carbon focus:ring-1 focus:ring-salvia"
            />
          </div>

          {/* Notas explicativas / Ayuda */}
          <div>
            <label className="block text-[11px] font-bold text-carbon/70 mb-1">Nota del Diagrama (Instrucciones para el estudiante)</label>
            <textarea
              value={model.note || ''}
              onChange={(e) => onUpdateModel({ note: e.target.value }, 'Editar nota del diagrama')}
              className="w-full bg-carbon/5 border border-carbon/20 rounded px-2.5 py-1.5 text-xs text-carbon focus:ring-1 focus:ring-salvia"
              rows={3}
              placeholder="Ejemplo: Arrastre los vértices A y B para comprobar que el área permanece constante."
            />
          </div>

          {/* Categoría y Modo de Publicación */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-carbon/70 mb-1">Modo de Publicación</label>
              <select
                value={model.mode || 'simulation'}
                onChange={(e) => onUpdateModel({ mode: e.target.value as DiagramMode }, 'Editar modo de publicación')}
                className="w-full bg-carbon/5 border border-carbon/20 rounded px-2 py-1.5 text-xs text-carbon focus:ring-1 focus:ring-salvia"
              >
                <option value="simulation">Simulación (Arrastrable por el estudiante)</option>
                <option value="diagram">Diagrama Fijo (Demostración estática)</option>
                <option value="inline">Inline (Compacto para texto)</option>
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-bold text-carbon/70 mb-1">Categoría del Contenido</label>
              <input
                type="text"
                value={model.category || ''}
                onChange={(e) => onUpdateModel({ category: e.target.value }, 'Editar categoría')}
                className="w-full bg-carbon/5 border border-carbon/20 rounded px-2 py-1.5 text-xs text-carbon focus:ring-1 focus:ring-salvia"
                placeholder="geometria-plana"
              />
            </div>
          </div>

          {/* Opciones del Lienzo */}
          <div className="border-t border-carbon/10 pt-3 space-y-2">
            <h4 className="font-bold text-carbon/80 text-xs">Opciones de Fondo y Coordenadas</h4>
            <div className="flex items-center space-x-4">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={Boolean(model.grid)}
                  onChange={(e) => onUpdateModel({ grid: e.target.checked }, 'Alternar rejilla')}
                  className="rounded border-carbon/30 text-salvia focus:ring-salvia"
                />
                <span>Mostrar Rejilla</span>
              </label>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={Boolean(model.axis)}
                  onChange={(e) => onUpdateModel({ axis: e.target.checked }, 'Alternar ejes')}
                  className="rounded border-carbon/30 text-salvia focus:ring-salvia"
                />
                <span>Mostrar Ejes Cartesianos</span>
              </label>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={model.showLabels !== false}
                  onChange={(e) => onUpdateModel({ showLabels: e.target.checked }, 'Alternar etiquetas globales')}
                  className="rounded border-carbon/30 text-salvia focus:ring-salvia"
                />
                <span>Etiquetas Visibles</span>
              </label>
            </div>
          </div>

          <div className="border-t border-carbon/10 pt-3 space-y-3">
            <h4 className="font-bold text-carbon/80 text-xs">Vista y encuadre inicial</h4>
            {(['bounds', 'home'] as const).map(key => (
              <fieldset key={key}>
                <legend className="mb-1 text-[10px] font-bold text-carbon/55">
                  {key === 'bounds' ? 'Límites actuales' : 'Vista inicial (Inicio)'}
                </legend>
                <div className="grid grid-cols-4 gap-2">
                  {['x mín.', 'x máx.', 'y máx.', 'y mín.'].map((label, index) => (
                    <label key={label} className="text-[10px] text-carbon/55">
                      {label}
                      <input
                        type="number"
                        value={(model.viewport[key] ?? model.viewport.bounds)[index]}
                        onChange={event => updateViewportValue(key, index, event.target.value)}
                        className="mt-1 w-full rounded border border-carbon/20 bg-carbon/5 px-2 py-1 text-xs text-carbon"
                      />
                    </label>
                  ))}
                </div>
              </fieldset>
            ))}
          </div>

          <div className="border-t border-carbon/10 pt-3">
            <DiagramHeaderReadingsEditor
              model={model}
              onModelEdit={(nextModel, command) => onUpdateModel(nextModel, command?.label ?? 'Editar información de cabecera')}
            />
          </div>
        </div>

        <div className="flex justify-end p-4 border-t border-carbon/10 bg-carbon/5">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 bg-salvia text-lienzo rounded-lg font-bold text-xs hover:bg-salvia/90 transition-all cursor-pointer shadow-2xs"
          >
            Guardar en memoria y Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
