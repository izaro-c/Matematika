import React, { useMemo, useRef, useState } from 'react';
import type { FileNode } from '@/fixed-pages/editor/types/editorContracts';
import type { CreateDiagramInput } from '@/fixed-pages/editor/review/authoringModel';
import { idToComponentName } from '@/fixed-pages/editor/review/authoringModel';
import { useModalFocus } from '@/fixed-pages/editor/ui/page/useModalFocus';
import { DiagramRuntimePreview } from '@/fixed-pages/editor/diagrams/ui/DiagramRuntimePreview';
import { DIAGRAM_CATEGORY_OPTIONS, DIAGRAM_TEMPLATE_OPTIONS } from './CreateDiagramDialog';

interface AddDiagramDialogProps {
  open: boolean;
  onClose: () => void;
  files: FileNode[];
  onSelectExisting: (diagramFile: FileNode) => Promise<void> | void;
  onCreateNew: (input: CreateDiagramInput) => Promise<boolean>;
}

const ID_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const EMPTY_NEW_DIAGRAM: CreateDiagramInput = {
  id: '',
  title: '',
  category: 'Teoremas',
  templateType: 'triangulo-deformable',
};

export const AddDiagramDialog: React.FC<AddDiagramDialogProps> = ({
  open,
  onClose,
  files,
  onSelectExisting,
  onCreateNew,
}) => {
  const [tab, setTab] = useState<'existing' | 'new'>('existing');
  const [search, setSearch] = useState('');
  const [selectedPath, setSelectedPath] = useState<string | null>(null);
  const [newDiagram, setNewDiagram] = useState<CreateDiagramInput>(EMPTY_NEW_DIAGRAM);
  const [busy, setBusy] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const diagramFiles = useMemo(() => files.filter(file => file.kind === 'diagram'), [files]);

  const filteredFiles = useMemo(() => {
    if (!search.trim()) return diagramFiles;
    const query = search.toLowerCase().trim();
    return diagramFiles.filter(file => (
      file.name.toLowerCase().includes(query) ||
      file.path.toLowerCase().includes(query) ||
      file.type.toLowerCase().includes(query)
    ));
  }, [diagramFiles, search]);

  const cancel = () => {
    setSearch('');
    setSelectedPath(null);
    setNewDiagram(EMPTY_NEW_DIAGRAM);
    setBusy(false);
    onClose();
  };

  const dialogRef = useModalFocus<HTMLFormElement>(open, cancel, searchInputRef, busy);
  if (!open) return null;

  const validNew = ID_RE.test(newDiagram.id) && newDiagram.title.trim().length > 0;
  const derivedComponentName = newDiagram.id ? idToComponentName(newDiagram.id) : '';

  const handleInsertExisting = async () => {
    const targetFile = diagramFiles.find(f => f.path === selectedPath);
    if (!targetFile || busy) return;
    setBusy(true);
    try {
      await onSelectExisting(targetFile);
      cancel();
    } finally {
      setBusy(false);
    }
  };

  const handleCreateSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!validNew || busy) return;
    setBusy(true);
    if (await onCreateNew(newDiagram)) {
      cancel();
    } else {
      setBusy(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-carbon/25 p-4" role="presentation">
      <form
        ref={dialogRef}
        onSubmit={tab === 'new' ? handleCreateSubmit : (e) => { e.preventDefault(); void handleInsertExisting(); }}
        role="dialog"
        aria-modal="true"
        aria-label="Añadir diagrama al documento"
        aria-labelledby="add-diagram-title"
        className="flex max-h-[90vh] w-full max-w-2xl flex-col rounded border border-carbon/20 bg-lienzo shadow-xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-carbon/15 p-4">
          <div>
            <h2 id="add-diagram-title" className="font-serif text-lg font-bold text-carbon">Añadir Diagrama al Documento</h2>
            <p className="mt-0.5 text-xs text-carbon/55">Selecciona un diagrama ya creado o define un diagrama nuevo con su ID.</p>
          </div>
          <button type="button" onClick={cancel} className="rounded px-2 py-1 text-xs text-carbon/55 hover:bg-carbon/5">
            Cerrar
          </button>
        </div>

        {/* Tab Buttons */}
        <div className="flex border-b border-carbon/15 bg-carbon/5 px-4 pt-2 gap-2">
          <button
            type="button"
            onClick={() => setTab('existing')}
            className={`rounded-t border-t border-x px-4 py-2 text-xs font-bold transition-colors ${
              tab === 'existing'
                ? 'border-carbon/15 bg-lienzo text-carbon'
                : 'border-transparent text-carbon/60 hover:text-carbon'
            }`}
          >
            Diagramas ya creados ({diagramFiles.length})
          </button>
          <button
            type="button"
            onClick={() => setTab('new')}
            className={`rounded-t border-t border-x px-4 py-2 text-xs font-bold transition-colors ${
              tab === 'new'
                ? 'border-carbon/15 bg-lienzo text-carbon'
                : 'border-transparent text-carbon/60 hover:text-carbon'
            }`}
          >
            ＋ Crear diagrama nuevo
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4">
          {tab === 'existing' && (
            <div className="space-y-4">
              <label className="block">
                <span className="sr-only">Buscar diagramas creados</span>
                <input
                  ref={searchInputRef}
                  type="search"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Buscar diagrama por nombre, categoría o ruta…"
                  className="w-full rounded border border-carbon/20 bg-lienzo px-3 py-2 text-xs text-carbon placeholder:text-carbon/35 focus:border-canela outline-none"
                />
              </label>

              {filteredFiles.length === 0 ? (
                <div className="rounded border border-dashed border-carbon/20 p-6 text-center text-xs text-carbon/55">
                  {search ? 'No se encontraron diagramas coincidentes.' : 'No existen diagramas creados todavía.'}
                </div>
              ) : (
                <div className="grid gap-3 sm:grid-cols-2 max-h-[50vh] overflow-y-auto pr-1">
                  {filteredFiles.map(file => {
                    const isSelected = selectedPath === file.path;
                    const componentName = file.name.replace(/\.tsx$/, '');
                    return (
                      <div
                        key={file.path}
                        onClick={() => setSelectedPath(file.path)}
                        className={`group relative cursor-pointer rounded border p-3 transition-all ${
                          isSelected
                            ? 'border-canela bg-canela/5 ring-1 ring-canela'
                            : 'border-carbon/15 bg-lienzo hover:border-carbon/30 hover:bg-carbon/[0.02]'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <span className="ac-label ac-label--2xs ac-label--canela block font-mono text-[9px]">
                              {file.type || 'Geometría'}
                            </span>
                            <h3 className="font-serif text-sm font-bold text-carbon">{componentName}</h3>
                          </div>
                          <input
                            type="radio"
                            name="selected-diagram"
                            checked={isSelected}
                            onChange={() => setSelectedPath(file.path)}
                            className="mt-1 accent-canela"
                          />
                        </div>
                        <p className="mt-1 truncate font-mono text-[9px] text-carbon/45">{file.path}</p>

                        <div className="mt-3 overflow-hidden rounded border border-carbon/10 bg-lienzo">
                          <DiagramRuntimePreview filePath={file.path} componentName={componentName} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {tab === 'new' && (
            <div className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="grid gap-1 ac-label ac-label--sm ac-label--strong">
                  Categoría
                  <select
                    value={newDiagram.category}
                    onChange={e => setNewDiagram(prev => ({ ...prev, category: e.target.value }))}
                    className="rounded border border-carbon/15 bg-lienzo p-2 text-xs normal-case text-carbon"
                  >
                    {DIAGRAM_CATEGORY_OPTIONS.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </label>

                <label className="grid gap-1 ac-label ac-label--sm ac-label--strong">
                  ID inmutable del diagrama
                  <input
                    value={newDiagram.id}
                    onChange={e => setNewDiagram(prev => ({ ...prev, id: e.target.value.toLowerCase().replace(/\s+/g, '-') }))}
                    placeholder="triangulo-pasos"
                    className="rounded border border-carbon/15 bg-lienzo p-2 font-mono text-xs normal-case text-carbon"
                  />
                  {newDiagram.id && !ID_RE.test(newDiagram.id) && (
                    <span className="normal-case text-granada text-[10px]">Usa minúsculas y guiones (ej. triangulo-pasos).</span>
                  )}
                  {derivedComponentName && ID_RE.test(newDiagram.id) && (
                    <span className="normal-case font-mono text-[10px] text-canela">
                      Componente: &lt;{derivedComponentName} /&gt;
                    </span>
                  )}
                </label>

                <label className="grid gap-1 ac-label ac-label--sm ac-label--strong sm:col-span-2">
                  Título
                  <input
                    value={newDiagram.title}
                    onChange={e => setNewDiagram(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Triángulo interactivo"
                    className="rounded border border-carbon/15 bg-lienzo p-2 font-serif text-sm normal-case text-carbon"
                  />
                </label>

                <label className="grid gap-1 ac-label ac-label--sm ac-label--strong sm:col-span-2">
                  Plantilla inicial
                  <select
                    value={newDiagram.templateType}
                    onChange={e => setNewDiagram(prev => ({ ...prev, templateType: e.target.value as CreateDiagramInput['templateType'] }))}
                    className="rounded border border-carbon/15 bg-lienzo p-2 text-xs normal-case text-carbon"
                  >
                    {DIAGRAM_TEMPLATE_OPTIONS.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </label>
              </div>

              <div className="rounded border border-ocre/20 bg-ocre/5 p-3 text-xs text-carbon/65">
                Se creará el archivo <span className="font-mono text-[10px]">content/diagrams/{newDiagram.category}/{derivedComponentName || '...'}.tsx</span> y se vinculará directamente al documento.
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-2 border-t border-carbon/15 p-4">
          <button
            type="button"
            onClick={cancel}
            className="rounded border border-carbon/15 px-3 py-2 text-xs font-bold text-carbon/60 hover:bg-carbon/5"
          >
            Cancelar
          </button>
          {tab === 'existing' ? (
            <button
              type="button"
              disabled={!selectedPath || busy}
              onClick={handleInsertExisting}
              className="rounded bg-canela px-4 py-2 text-xs font-bold text-lienzo disabled:opacity-40 hover:bg-canela/90"
            >
              {busy ? 'Viculando…' : 'Vincular e Insertar Diagrama'}
            </button>
          ) : (
            <button
              type="submit"
              disabled={!validNew || busy}
              className="rounded bg-canela px-4 py-2 text-xs font-bold text-lienzo disabled:opacity-40 hover:bg-canela/90"
            >
              {busy ? 'Creando…' : 'Crear y Vincular'}
            </button>
          )}
        </div>
      </form>
    </div>
  );
};
