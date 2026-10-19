import React, { useRef, useState } from 'react';
import type { CreateDiagramInput } from '@/fixed-pages/editor/review/authoringModel';
import { idToComponentName } from '@/fixed-pages/editor/review/authoringModel';
import { Button, Field, Modal } from '@/fixed-pages/editor/ui/primitives';

interface CreateDiagramDialogProps {
  open: boolean;
  onClose: () => void;
  onCreate: (input: CreateDiagramInput) => Promise<boolean>;
}

const ID_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const EMPTY_DIAGRAM: CreateDiagramInput = {
  id: '',
  title: '',
  category: 'Teoremas',
  templateType: 'triangulo-deformable',
};

import { TEMPLATE_OPTIONS } from '@/fixed-pages/editor/diagrams/model/tools/diagramOptions';
import { getContentTypeLabel } from '@/lib/theme/constants';

const DIAGRAM_CATEGORIES: Array<{ folder: string; typeKey: string }> = [
  { folder: 'Teoremas', typeKey: 'teorema' },
  { folder: 'Definiciones', typeKey: 'definicion' },
  { folder: 'Axiomas', typeKey: 'axioma' },
  { folder: 'Demos', typeKey: 'demostracion' },
  { folder: 'Ejercicios', typeKey: 'ejercicio' },
  { folder: 'Metodos', typeKey: 'metodo' },
  { folder: 'CasosUso', typeKey: 'caso-de-uso' },
  { folder: 'Models', typeKey: 'modelo' },
];

export const DIAGRAM_CATEGORY_OPTIONS = DIAGRAM_CATEGORIES.map(({ folder, typeKey }) => ({
  value: folder,
  label: getContentTypeLabel(typeKey, 'plural'),
}));

export const DIAGRAM_TEMPLATE_OPTIONS = TEMPLATE_OPTIONS.map(({ value, label }) => ({ value, label }));


export const CreateDiagramDialog: React.FC<CreateDiagramDialogProps> = ({ open, onClose, onCreate }) => {
  const [value, setValue] = useState<CreateDiagramInput>(EMPTY_DIAGRAM);
  const [creating, setCreating] = useState(false);
  const idRef = useRef<HTMLInputElement>(null);

  const cancel = () => {
    setValue(EMPTY_DIAGRAM);
    setCreating(false);
    onClose();
  };


  const valid = ID_RE.test(value.id) && value.title.trim().length > 0;
  const derivedComponentName = value.id ? idToComponentName(value.id) : '';

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!valid || creating) return;
    setCreating(true);
    if (await onCreate(value)) {
      setValue(EMPTY_DIAGRAM);
      setCreating(false);
      onClose();
    } else {
      setCreating(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={cancel}
      title="Nuevo diagrama interactivo"
      size="md"
      dismissible={!creating}
      initialFocusRef={idRef}
      footer={
        <>
          <Button onClick={cancel} disabled={creating}>Cancelar</Button>
          <Button variant="primary" type="submit" form="create-diagram-form" disabled={!valid || creating}>
            {creating ? 'Creando…' : 'Crear y abrir'}
          </Button>
        </>
      }
    >
      <form id="create-diagram-form" onSubmit={submit} className="space-y-4">
        <p>Se define el ID y categoría para crear un componente TSX único en el catálogo autoritativo.</p>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Categoría">
            <select
              value={value.category}
              onChange={event => setValue(previous => ({ ...previous, category: event.target.value }))}
            >
              {DIAGRAM_CATEGORY_OPTIONS.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </Field>

          <Field
            label="ID inmutable"
            error={value.id && !ID_RE.test(value.id) ? 'Usa minúsculas y guiones (ej. triangulo-pasos).' : undefined}
            help={derivedComponentName && ID_RE.test(value.id) ? <span className="font-mono">Componente: &lt;{derivedComponentName} /&gt;</span> : undefined}
          >
            <input
              ref={idRef}
              value={value.id}
              onChange={event => setValue(previous => ({ ...previous, id: event.target.value.toLowerCase().replace(/\s+/g, '-') }))}
              placeholder="triangulo-pasos"
              className="font-mono"
            />
          </Field>

          <Field className="sm:col-span-2" label="Título">
            <input
              value={value.title}
              onChange={event => setValue(previous => ({ ...previous, title: event.target.value }))}
              placeholder="Triángulo interactivo con altura"
            />
          </Field>

          <Field className="sm:col-span-2" label="Plantilla inicial">
            <select
              value={value.templateType}
              onChange={event => setValue(previous => ({ ...previous, templateType: event.target.value as CreateDiagramInput['templateType'] }))}
            >
              {DIAGRAM_TEMPLATE_OPTIONS.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </Field>
        </div>

        <p className="border-t border-[color:var(--ed-rule-faint)] pt-3 text-sm italic text-carbon/65">
          El diagrama se creará como un componente TSX autoritativo en <span className="font-mono text-xs not-italic">content/diagrams/{value.category}/{derivedComponentName || '...'}.tsx</span>.
        </p>
      </form>
    </Modal>
  );
};
