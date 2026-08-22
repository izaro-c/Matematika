import React from 'react';
import type { VisualDiagramModel } from '../../model/types';
import type { DiagramMode } from '@/diagrams';
import { SUPPORTED_LANGUAGES } from '@/i18n/config';
import { DiagramHeaderReadingsEditor } from '../DiagramHeaderReadingsEditor';
import { EditorLanguageBadges } from '@/fixed-pages/editor/ui/workbench/EditorHeaderPrimitives';

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
  if (!model) {
    return (
      <aside
        id="diagram-data-panel"
        aria-label="Editor de datos del diagrama"
        className="fixed inset-y-0 left-0 z-40 flex max-w-[92vw] flex-col border-r border-carbon/15 bg-lienzo shadow-xl lg:relative lg:z-auto lg:max-w-none lg:shadow-none font-serif text-carbon select-none"
        style={{ width }}
      >
        <div className="p-4 text-xs text-carbon/50 italic">No hay un modelo de diagrama activo.</div>
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
      aria-label="Editor de datos del diagrama"
      className="fixed inset-y-0 left-0 z-40 flex max-w-[92vw] flex-col border-r border-carbon/15 bg-lienzo shadow-xl lg:relative lg:z-auto lg:max-w-none lg:shadow-none font-serif text-carbon select-none"
      style={{ width }}
    >
      {/* Header */}
      <header className="flex items-center justify-between border-b border-carbon/15 px-4 py-3 bg-carbon/[0.02]">
        <div>
          <p className="ac-label ac-label--sm ac-label--canela">Diagrama</p>
          <h2 className="font-serif text-sm font-bold text-carbon">Datos del diagrama</h2>
        </div>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            aria-label="Ocultar panel de datos"
            className="rounded border border-carbon/15 px-2 py-1 text-xs text-carbon/65 hover:bg-carbon/5 transition-colors cursor-pointer"
          >
            Ocultar
          </button>
        )}
      </header>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
        {/* Idioma de edición y traducción */}
        <div className="rounded-lg border border-carbon/15 bg-carbon/[0.02] p-3 space-y-2">
          <div className="flex items-center justify-between">
            <span className="ac-label ac-label--xs">Idioma de trabajo</span>
            <span className="text-[10px] font-bold text-canela">{activeLangConfig.name}</span>
          </div>

          <EditorLanguageBadges
            mode="diagram"
            activeLang={activeLang}
            onSelectLang={onSelectActiveLang}
            aria-label="Selector de idioma de edición del diagrama"
          />
          {!isDefaultLang && (
            <p className="text-[10px] text-carbon/55 italic">
              Editando variante en <strong>{activeLangConfig.name}</strong>. Si dejas un campo vacío se utilizará la versión base en español.
            </p>
          )}
        </div>

        {/* Título */}
        <div>
          <label className="block ac-label ac-label--xs mb-1">
            Título ({activeLang.toUpperCase()})
          </label>
          <input
            type="text"
            value={currentTitle}
            onChange={e => handleTitleChange(e.target.value)}
            placeholder={isDefaultLang ? 'Título del diagrama' : (model.title || 'Título en español')}
            className="w-full rounded border border-carbon/20 bg-lienzo px-2.5 py-1.5 text-xs font-bold text-carbon focus:border-canela outline-none"
          />
        </div>

        {/* Subtítulo / Nota explicativa */}
        <div>
          <label className="block ac-label ac-label--xs mb-1">
            Subtítulo / Nota explicativa ({activeLang.toUpperCase()})
          </label>
          <textarea
            value={currentNote}
            onChange={e => handleNoteChange(e.target.value)}
            rows={3}
            placeholder={isDefaultLang ? 'Instrucciones pedagógicas o notas para el estudiante…' : (model.note || 'Instrucciones en español…')}
            className="w-full rounded border border-carbon/20 bg-lienzo px-2.5 py-1.5 text-xs text-carbon focus:border-canela outline-none"
          />
        </div>

        {/* Modo de Publicación y Categoría */}
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block ac-label ac-label--xs mb-1">Modo</label>
            <select
              value={model.mode || 'simulation'}
              onChange={e => onUpdateModel({ mode: e.target.value as DiagramMode }, 'Editar modo de publicación')}
              className="w-full rounded border border-carbon/20 bg-lienzo px-2 py-1.5 text-xs text-carbon focus:border-canela outline-none"
            >
              <option value="simulation">Simulación</option>
              <option value="diagram">Fijo</option>
              <option value="inline">Inline</option>
            </select>
          </div>
          <div>
            <label className="block ac-label ac-label--xs mb-1">Categoría</label>
            <input
              type="text"
              value={model.category || ''}
              onChange={e => onUpdateModel({ category: e.target.value }, 'Editar categoría')}
              placeholder="Teoremas"
              className="w-full rounded border border-carbon/20 bg-lienzo px-2 py-1.5 text-xs text-carbon focus:border-canela outline-none"
            />
          </div>
        </div>

        {/* Opciones del Lienzo */}
        <div className="rounded-lg border border-carbon/15 p-2.5 space-y-2">
          <span className="ac-label ac-label--xs">Lienzo y coordenadas</span>
          <div className="flex flex-wrap gap-3">
            <label className="flex items-center gap-1.5 text-xs cursor-pointer">
              <input
                type="checkbox"
                checked={Boolean(model.grid)}
                onChange={e => onUpdateModel({ grid: e.target.checked }, 'Alternar rejilla')}
                className="rounded border-carbon/30 text-canela focus:ring-canela"
              />
              <span>Rejilla</span>
            </label>
            <label className="flex items-center gap-1.5 text-xs cursor-pointer">
              <input
                type="checkbox"
                checked={Boolean(model.axis)}
                onChange={e => onUpdateModel({ axis: e.target.checked }, 'Alternar ejes')}
                className="rounded border-carbon/30 text-canela focus:ring-canela"
              />
              <span>Ejes</span>
            </label>
            <label className="flex items-center gap-1.5 text-xs cursor-pointer">
              <input
                type="checkbox"
                checked={model.showLabels !== false}
                onChange={e => onUpdateModel({ showLabels: e.target.checked }, 'Alternar etiquetas globales')}
                className="rounded border-carbon/30 text-canela focus:ring-canela"
              />
              <span>Etiquetas</span>
            </label>
          </div>
        </div>

        {/* Encuadre / Viewport */}
        <div className="rounded-lg border border-carbon/15 p-2.5 space-y-2.5">
          <span className="ac-label ac-label--xs">Encuadre y vista inicial</span>
          {(['bounds', 'home'] as const).map(key => (
            <fieldset key={key} className="space-y-1">
              <legend className="text-[10px] font-bold text-carbon/60">
                {key === 'bounds' ? 'Límites del lienzo (Bounds)' : 'Vista por defecto (Home)'}
              </legend>
              <div className="grid grid-cols-4 gap-1.5">
                {['x mín', 'x máx', 'y máx', 'y mín'].map((label, index) => (
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
