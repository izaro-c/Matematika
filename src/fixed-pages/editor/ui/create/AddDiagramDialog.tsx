import React, { useMemo, useRef, useState } from 'react';
import type { FileNode } from '@/fixed-pages/editor/types/editorContracts';
import type { CreateDiagramInput } from '@/fixed-pages/editor/review/authoringModel';
import { idToComponentName } from '@/fixed-pages/editor/review/authoringModel';
import { Button, Field, Modal, Tabs, controlClassName } from '@/fixed-pages/editor/ui/primitives';
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
    <Modal
      open={open}
      onClose={cancel}
      title="Añadir Diagrama al Documento"
      size="lg"
      dismissible={!busy}
      initialFocusRef={searchInputRef}
      footer={
        <>
          <Button onClick={cancel} disabled={busy}>Cancelar</Button>
          {tab === 'existing' ? (
            <Button variant="primary" form="add-diagram-form" type="submit" disabled={!selectedPath || busy}>
              {busy ? 'Viculando…' : 'Vincular e Insertar Diagrama'}
            </Button>
          ) : (
            <Button variant="primary" form="add-diagram-form" type="submit" disabled={!validNew || busy}>
              {busy ? 'Creando…' : 'Crear y Vincular'}
            </Button>
          )}
        </>
      }
    >
      <form
        id="add-diagram-form"
        onSubmit={tab === 'new' ? handleCreateSubmit : (e) => { e.preventDefault(); void handleInsertExisting(); }}
        className="space-y-4"
      >
        <p>Selecciona un diagrama ya creado o define un diagrama nuevo con su ID.</p>
        <Tabs
          aria-label="Añadir diagrama al documento"
          activeTab={tab}
          onTabChange={id => setTab(id as typeof tab)}
          tabs={[
            { id: 'existing', label: `Diagramas ya creados (${diagramFiles.length})` },
            { id: 'new', label: '＋ Crear diagrama nuevo' },
          ]}
        />

        <div className="space-y-4">
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
                  className={controlClassName}
                />
              </label>

              {filteredFiles.length === 0 ? (
                <p className="border border-dashed border-[color:var(--ed-rule)] p-6 text-center text-sm italic text-carbon/60">
                  {search ? 'No se encontraron diagramas coincidentes.' : 'No existen diagramas creados todavía.'}
                </p>
              ) : (
                <div className="grid gap-3 sm:grid-cols-2 max-h-[50vh] overflow-y-auto pr-1">
                  {filteredFiles.map(file => {
                    const isSelected = selectedPath === file.path;
                    const componentName = file.name.replace(/\.tsx$/, '');
                    return (
                      <div
                        key={file.path}
                        onClick={() => setSelectedPath(file.path)}
                        className={`cursor-pointer border p-3 ${
                          isSelected
                            ? 'border-[color:var(--ed-rule-strong)] bg-[color:var(--ed-wash)]'
                            : 'border-[color:var(--ed-rule-faint)] hover:border-[color:var(--ed-rule)]'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <span className="block font-mono text-[10px] text-carbon/55">
                              {file.type || 'Geometría'}
                            </span>
                            <h3 className="font-serif text-sm font-bold text-carbon">{componentName}</h3>
                          </div>
                          <input
                            type="radio"
                            name="selected-diagram"
                            checked={isSelected}
                            onChange={() => setSelectedPath(file.path)}
                            aria-label={componentName}
                            className="mt-1 accent-[color:var(--theme-carbon)]"
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
                <Field label="Categoría">
                  <select
                    value={newDiagram.category}
                    onChange={e => setNewDiagram(prev => ({ ...prev, category: e.target.value }))}
                  >
                    {DIAGRAM_CATEGORY_OPTIONS.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </Field>

                <Field
                  label="ID inmutable del diagrama"
                  error={newDiagram.id && !ID_RE.test(newDiagram.id) ? 'Usa minúsculas y guiones (ej. triangulo-pasos).' : undefined}
                  help={derivedComponentName && ID_RE.test(newDiagram.id) ? <span className="font-mono">Componente: &lt;{derivedComponentName} /&gt;</span> : undefined}
                >
                  <input
                    value={newDiagram.id}
                    onChange={e => setNewDiagram(prev => ({ ...prev, id: e.target.value.toLowerCase().replace(/\s+/g, '-') }))}
                    placeholder="triangulo-pasos"
                    className="font-mono"
                  />
                </Field>

                <Field className="sm:col-span-2" label="Título">
                  <input
                    value={newDiagram.title}
                    onChange={e => setNewDiagram(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Triángulo interactivo"
                  />
                </Field>

                <Field className="sm:col-span-2" label="Plantilla inicial">
                  <select
                    value={newDiagram.templateType}
                    onChange={e => setNewDiagram(prev => ({ ...prev, templateType: e.target.value as CreateDiagramInput['templateType'] }))}
                  >
                    {DIAGRAM_TEMPLATE_OPTIONS.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </Field>
              </div>

              <p className="border-t border-[color:var(--ed-rule-faint)] pt-3 text-sm italic text-carbon/65">
                Se creará el archivo <span className="font-mono text-xs not-italic">content/diagrams/{newDiagram.category}/{derivedComponentName || '...'}.tsx</span> y se vinculará directamente al documento.
              </p>
            </div>
          )}
        </div>

      </form>
    </Modal>
  );
};
