import React from 'react';
import type { VisualDiagramModel } from '../../model/types';
import type { DiagramMode } from '@/diagrams';
import { DiagramHeaderReadingsEditor } from '../DiagramHeaderReadingsEditor';
import { useI18n } from '@/i18n';
import { Button, Modal, controlClassName } from '@/fixed-pages/editor/ui/primitives';

interface DiagramSettingsModalProps {
  isOpen: boolean;
  model: VisualDiagramModel | null;
  onClose: () => void;
  onUpdateModel: (updates: Partial<VisualDiagramModel>, label: string) => void;
}

export const DiagramSettingsModal: React.FC<DiagramSettingsModalProps> = ({
  isOpen,
  model,
  onClose,
  onUpdateModel,
}) => {
  const { t } = useI18n();
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
    <Modal
      open
      onClose={onClose}
      title={t('editor.diagramModals.globalDiagramSettings')}
      size="md"
      footer={<Button variant="primary" onClick={onClose}>{t('editor.diagramModals.saveAndClose')}</Button>}
    >
      <div className="space-y-4">
        <p className="italic">{t('editor.diagramModals.settingsSubtitle')}</p>
          {/* Título del Diagrama */}
          <div>
            <label className="block text-[11px] font-bold text-carbon/70 mb-1">{t('editor.diagramModals.mainTitle')}</label>
            <input
              type="text"
              value={model.title || ''}
              onChange={(e) => onUpdateModel({ title: e.target.value }, 'Editar título del diagrama')}
              className={controlClassName}
            />
          </div>

          {/* Notas explicativas / Ayuda */}
          <div>
            <label className="block text-[11px] font-bold text-carbon/70 mb-1">{t('editor.diagramModals.diagramNoteLabel')}</label>
            <textarea
              value={model.note || ''}
              onChange={(e) => onUpdateModel({ note: e.target.value }, 'Editar nota del diagrama')}
              className={controlClassName}
              rows={3}
              placeholder={t('editor.diagramModals.diagramNotePlaceholder')}
            />
          </div>

          {/* Categoría y Modo de Publicación */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-carbon/70 mb-1">{t('editor.diagramModals.publicationMode')}</label>
              <select
                value={model.mode || 'simulation'}
                onChange={(e) => onUpdateModel({ mode: e.target.value as DiagramMode }, 'Editar modo de publicación')}
                className={controlClassName}
              >
                <option value="simulation">{t('editor.diagramModals.modeSimulation')}</option>
                <option value="diagram">{t('editor.diagramModals.fixedDiagramStaticDemonstration')}</option>
                <option value="inline">{t('editor.diagramModals.inlineCompactForText')}</option>
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-bold text-carbon/70 mb-1">{t('editor.diagramModals.contentCategory')}</label>
              <input
                type="text"
                value={model.category || ''}
                onChange={(e) => onUpdateModel({ category: e.target.value }, 'Editar categoría')}
                className={controlClassName}
                placeholder="geometria-plana"
              />
            </div>
          </div>

          {/* Opciones del Lienzo */}
          <div className="border-t border-carbon/10 pt-3 space-y-2">
            <h4 className="font-bold text-carbon/80 text-xs">{t('editor.diagramModals.backgroundAndCoordinateOptions')}</h4>
            <div className="flex items-center space-x-4">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={Boolean(model.grid)}
                  onChange={(e) => onUpdateModel({ grid: e.target.checked }, 'Alternar rejilla')}
                  className="rounded border-carbon/30 text-canela focus:ring-canela"
                />
                <span>{t('editor.diagramModals.showGrid')}</span>
              </label>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={Boolean(model.axis)}
                  onChange={(e) => onUpdateModel({ axis: e.target.checked }, 'Alternar ejes')}
                  className="rounded border-carbon/30 text-canela focus:ring-canela"
                />
                <span>{t('editor.diagramModals.showCartesianAxes')}</span>
              </label>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={model.showLabels !== false}
                  onChange={(e) => onUpdateModel({ showLabels: e.target.checked }, 'Alternar etiquetas globales')}
                  className="rounded border-carbon/30 text-canela focus:ring-canela"
                />
                <span>{t('editor.diagramModals.visibleLabels')}</span>
              </label>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={model.showHeader !== false}
                  onChange={(e) => onUpdateModel({ showHeader: e.target.checked }, 'Alternar cabecera (Título y Subtítulo)')}
                  className="rounded border-carbon/30 text-canela focus:ring-canela"
                />
                <span>{t('editor.diagramModals.showTitleAndSubtitle')}</span>
              </label>
            </div>
          </div>

          <div className="border-t border-carbon/10 pt-3 space-y-3">
            <h4 className="font-bold text-carbon/80 text-xs">{t('editor.diagramModals.initialViewAndFraming')}</h4>
            {(['bounds', 'home'] as const).map(key => (
              <fieldset key={key}>
                <legend className="mb-1 text-[10px] font-bold text-carbon/55">
                  {key === 'bounds' ? t('editor.diagramModals.currentBounds') : t('editor.diagramModals.initialViewHome')}
                </legend>
                <div className="grid grid-cols-4 gap-2">
                  {[t('editor.diagramModals.xMin'), t('editor.diagramModals.xMax'), t('editor.diagramModals.yMax'), t('editor.diagramModals.yMin')].map((label, index) => (
                    <label key={label} className="text-[10px] text-carbon/55">
                      {label}
                      <input
                        type="number"
                        value={(model.viewport[key] ?? model.viewport.bounds)[index]}
                        onChange={event => updateViewportValue(key, index, event.target.value)}
                        className={`${controlClassName} mt-1`}
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
    </Modal>
  );
};
