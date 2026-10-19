import React from 'react';
import type { VisualDiagramModel } from '../../model/types';
import type { DiagramMode } from '@/diagrams';
import { SUPPORTED_LANGUAGES } from '@/i18n/config';
import { DiagramHeaderReadingsEditor } from '../DiagramHeaderReadingsEditor';
import { DocumentVersions } from '@/fixed-pages/editor/ui/workbench/EditorHeaderPrimitives';
import { diagramVersionStatuses } from '../../model/scene/translationStatus';
import { useI18n } from '@/i18n';
import { renderRichText } from '@/fixed-pages/editor/diagrams/ui/primitives/richText';

interface DiagramDataPanelProps {
  model: VisualDiagramModel | null;
  activeLang: string;
  onSelectActiveLang: (lang: string) => void;
  onUpdateModel: (updates: Partial<VisualDiagramModel>, label: string) => void;
  width?: number;
  onClose?: () => void;
}

export const DiagramDataPanel: React.FC<DiagramDataPanelProps> = ({
  model,
  activeLang,
  onSelectActiveLang,
  onUpdateModel,
  width = 320,
  onClose,
}) => {
  const { t } = useI18n();
  if (!model) {
    return (
      <aside
        id="diagram-data-panel"
        aria-label={t('editor.diagramWorkbench.diagramDataEditor')}
        className="fixed inset-y-0 left-0 z-40 flex max-w-[92vw] flex-col border-r border-carbon/15 bg-lienzo shadow-xl lg:relative lg:z-auto lg:max-w-none lg:shadow-none font-serif text-carbon select-none"
        style={{ width }}
      >
        <div className="p-4 text-xs text-carbon/50 italic">{t('editor.diagramWorkbench.noActiveModel')}</div>
      </aside>
    );
  }

  const isDefaultLang = activeLang === 'es';
  const activeLangConfig = SUPPORTED_LANGUAGES.find(l => l.code === activeLang) ?? { code: activeLang, name: activeLang };
  const currentTranslations = model.translations ?? {};
  const activeTranslation = currentTranslations[activeLang];

  const currentTitle = isDefaultLang
    ? (model.title || '')
    : (activeTranslation?.title ?? '');

  const currentNote = isDefaultLang
    ? (model.note || '')
    : (activeTranslation?.note ?? '');

  const handleTitleChange = (newTitle: string) => {
    if (isDefaultLang) {
      onUpdateModel({ title: newTitle }, 'Editar título del diagrama');
    } else {
      const nextTr = { ...(currentTranslations[activeLang] || {}), title: newTitle };
      onUpdateModel({
        translations: {
          ...currentTranslations,
          [activeLang]: nextTr,
        },
      }, `Editar título (${activeLang.toUpperCase()})`);
    }
  };

  const handleNoteChange = (newNote: string) => {
    if (isDefaultLang) {
      onUpdateModel({ note: newNote }, 'Editar nota del diagrama');
    } else {
      const nextTr = { ...(currentTranslations[activeLang] || {}), note: newNote };
      onUpdateModel({
        translations: {
          ...currentTranslations,
          [activeLang]: nextTr,
        },
      }, `Editar nota (${activeLang.toUpperCase()})`);
    }
  };

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
    <aside
      id="diagram-data-panel"
      aria-label={t('editor.diagramWorkbench.diagramDataEditor')}
      className="fixed inset-y-0 left-0 z-40 flex max-w-[92vw] flex-col border-r border-carbon/15 bg-lienzo shadow-xl lg:relative lg:z-auto lg:max-w-none lg:shadow-none font-serif text-carbon select-none"
      style={{ width }}
    >
      {/* Header */}
      <header className="flex items-center justify-between border-b border-carbon/15 px-4 py-3 bg-carbon/[0.02]">
        <div>
          <p className="ac-label ac-label--sm ac-label--canela">{t('editor.diagramWorkbench.diagram')}</p>
          <h2 className="font-serif text-sm font-bold text-carbon">{t('editor.diagramWorkbench.diagramData')}</h2>
        </div>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            aria-label={t('editor.diagramWorkbench.hideDataPanel')}
            className="rounded border border-carbon/15 px-2 py-1 text-xs text-carbon/65 hover:bg-carbon/5 transition-colors cursor-pointer"
          >
            {t('editor.diagramWorkbench.hide')}
          </button>
        )}
      </header>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
        {/* Idioma de edición y traducción */}
        <div className="rounded-lg border border-carbon/15 bg-carbon/[0.02] p-3 space-y-2">
          <div className="flex items-center justify-between">
            <span className="ac-label ac-label--xs">{t('editor.diagramWorkbench.workingLanguage')}</span>
            <span className="text-[10px] font-bold text-canela">{activeLangConfig.name}</span>
          </div>

          <DocumentVersions
            kind="diagram"
            activeLang={activeLang}
            versions={diagramVersionStatuses(model, SUPPORTED_LANGUAGES.map(language => language.code))}
            onSelect={onSelectActiveLang}
            onCreate={onSelectActiveLang}
            aria-label={t('editor.diagramWorkbench.diagramEditingLanguageSelector')}
          />
          {!isDefaultLang && (
            <p className="text-[10px] text-carbon/55 italic">
              {renderRichText(t('editor.diagramWorkbench.editingVariantIn', { language: activeLangConfig.name }), { b: c => <strong>{c}</strong> })}
            </p>
          )}
        </div>

        {/* Título */}
        <div>
          <label className="block ac-label ac-label--xs mb-1">
            {t('editor.diagramWorkbench.titleWithLang', { lang: activeLang.toUpperCase() })}
          </label>
          <input
            type="text"
            value={currentTitle}
            onChange={e => handleTitleChange(e.target.value)}
            placeholder={isDefaultLang ? t('editor.diagramWorkbench.diagramTitle') : (model.title || t('editor.diagramWorkbench.titleInSpanish'))}
            className="w-full rounded border border-carbon/20 bg-lienzo px-2.5 py-1.5 text-xs font-bold text-carbon focus:border-canela outline-none"
          />
        </div>

        {/* Subtítulo / Nota explicativa */}
        <div>
          <label className="block ac-label ac-label--xs mb-1">
            {t('editor.diagramWorkbench.subtitleWithLang', { lang: activeLang.toUpperCase() })}
          </label>
          <textarea
            value={currentNote}
            onChange={e => handleNoteChange(e.target.value)}
            rows={3}
            placeholder={isDefaultLang ? t('editor.diagramWorkbench.notePlaceholder') : (model.note || t('editor.diagramWorkbench.instructionsInSpanish'))}
            className="w-full rounded border border-carbon/20 bg-lienzo px-2.5 py-1.5 text-xs text-carbon focus:border-canela outline-none"
          />
        </div>

        {/* Modo de Publicación y Categoría */}
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block ac-label ac-label--xs mb-1">{t('editor.diagramWorkbench.mode')}</label>
            <select
              value={model.mode || 'simulation'}
              onChange={e => onUpdateModel({ mode: e.target.value as DiagramMode }, 'Editar modo de publicación')}
              className="w-full rounded border border-carbon/20 bg-lienzo px-2 py-1.5 text-xs text-carbon focus:border-canela outline-none"
            >
              <option value="simulation">{t('editor.diagramWorkbench.simulation')}</option>
              <option value="diagram">{t('editor.diagramWorkbench.fixed')}</option>
              <option value="inline">{t('editor.diagramWorkbench.inline')}</option>
            </select>
          </div>
          <div>
            <label className="block ac-label ac-label--xs mb-1">{t('editor.diagramWorkbench.category')}</label>
            <input
              type="text"
              value={model.category || ''}
              onChange={e => onUpdateModel({ category: e.target.value }, 'Editar categoría')}
              placeholder={t('editor.diagramWorkbench.theorems')}
              className="w-full rounded border border-carbon/20 bg-lienzo px-2 py-1.5 text-xs text-carbon focus:border-canela outline-none"
            />
          </div>
        </div>

        {/* Opciones del Lienzo */}
        <div className="rounded-lg border border-carbon/15 p-2.5 space-y-2">
          <span className="ac-label ac-label--xs">{t('editor.diagramWorkbench.canvasAndCoordinates')}</span>
          <div className="flex flex-wrap gap-3">
            <label className="flex items-center gap-1.5 text-xs cursor-pointer">
              <input
                type="checkbox"
                checked={Boolean(model.grid)}
                onChange={e => onUpdateModel({ grid: e.target.checked }, 'Alternar rejilla')}
                className="rounded border-carbon/30 text-canela focus:ring-canela"
              />
              <span>{t('editor.diagramWorkbench.grid')}</span>
            </label>
            <label className="flex items-center gap-1.5 text-xs cursor-pointer">
              <input
                type="checkbox"
                checked={Boolean(model.axis)}
                onChange={e => onUpdateModel({ axis: e.target.checked }, 'Alternar ejes')}
                className="rounded border-carbon/30 text-canela focus:ring-canela"
              />
              <span>{t('editor.diagramWorkbench.axes')}</span>
            </label>
            <label className="flex items-center gap-1.5 text-xs cursor-pointer">
              <input
                type="checkbox"
                checked={model.showLabels !== false}
                onChange={e => onUpdateModel({ showLabels: e.target.checked }, 'Alternar etiquetas globales')}
                className="rounded border-carbon/30 text-canela focus:ring-canela"
              />
              <span>{t('editor.diagramWorkbench.labels')}</span>
            </label>
            <label className="flex items-center gap-1.5 text-xs cursor-pointer">
              <input
                type="checkbox"
                checked={model.showHeader !== false}
                onChange={e => onUpdateModel({ showHeader: e.target.checked }, 'Alternar cabecera (Título y Subtítulo)')}
                className="rounded border-carbon/30 text-canela focus:ring-canela"
              />
              <span>{t('editor.diagramWorkbench.titleAndSubtitle')}</span>
            </label>
          </div>
        </div>

        {/* Encuadre / Viewport */}
        <div className="rounded-lg border border-carbon/15 p-2.5 space-y-2.5">
          <span className="ac-label ac-label--xs">{t('editor.diagramWorkbench.framingAndInitialView')}</span>
          {(['bounds', 'home'] as const).map(key => (
            <fieldset key={key} className="space-y-1">
              <legend className="text-[10px] font-bold text-carbon/60">
                {key === 'bounds' ? t('editor.diagramWorkbench.canvasBoundsBounds') : t('editor.diagramWorkbench.defaultViewHome')}
              </legend>
              <div className="grid grid-cols-4 gap-1.5">
                {[t('editor.diagramModals.xMin'), t('editor.diagramModals.xMax'), t('editor.diagramModals.yMax'), t('editor.diagramModals.yMin')].map((label, index) => (
                  <label key={label} className="text-[9px] text-carbon/50">
                    {label}
                    <input
                      type="number"
                      value={(model.viewport[key] ?? model.viewport.bounds)[index]}
                      onChange={event => updateViewportValue(key, index, event.target.value)}
                      className="mt-0.5 w-full rounded border border-carbon/20 bg-lienzo px-1.5 py-1 text-xs text-carbon text-center"
                    />
                  </label>
                ))}
              </div>
            </fieldset>
          ))}
        </div>

        {/* Lecturas de cabecera */}
        <div className="rounded-lg border border-carbon/15 p-2.5">
          <DiagramHeaderReadingsEditor
            model={model}
            onModelEdit={(nextModel, command) => onUpdateModel(nextModel, command?.label ?? 'Editar lecturas')}
          />
        </div>
      </div>
    </aside>
  );
};

export default DiagramDataPanel;
