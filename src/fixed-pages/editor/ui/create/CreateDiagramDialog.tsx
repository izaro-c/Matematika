import React, { useRef, useState } from 'react';
import type { CreateDiagramInput } from '@/fixed-pages/editor/review/authoringModel';
import { idToComponentName } from '@/fixed-pages/editor/review/authoringModel';
import { useModalFocus } from '@/fixed-pages/editor/ui/page/useModalFocus';

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

export const DIAGRAM_CATEGORY_OPTIONS = [
  { value: 'Teoremas', label: 'Teoremas' },
  { value: 'Definiciones', label: 'Definiciones' },
  { value: 'Axiomas', label: 'Axiomas' },
  { value: 'Demos', label: 'Demostraciones' },
  { value: 'Ejercicios', label: 'Ejercicios' },
  { value: 'Metodos', label: 'Métodos' },
  { value: 'CasosUso', label: 'Casos de Uso' },
  { value: 'Models', label: 'Modelos' },
];

import type { TemplateKind } from '@/fixed-pages/editor/diagrams/model/types';

export const DIAGRAM_TEMPLATE_OPTIONS: Array<{ value: TemplateKind; label: string }> = [
  { value: 'triangulo-deformable', label: 'Triángulo deformable' },
  { value: 'eje-cartesiano', label: 'Eje de coordenadas / cartesiano' },
  { value: 'circunferencia', label: 'Circunferencia / Círculo unitario' },
  { value: 'demostracion-pasos', label: 'Demostración con pasos' },
  { value: 'lienzo-inicial', label: 'Lienzo inicial vacío' },
  { value: 'cuadrilatero-clasificable', label: 'Cuadrilátero clasificable' },
  { value: 'lugar-geometrico', label: 'Lugar geométrico' },
  { value: 'modelo-estatico', label: 'Modelo estático' },
];

export const CreateDiagramDialog: React.FC<CreateDiagramDialogProps> = ({ open, onClose, onCreate }) => {
  const [value, setValue] = useState<CreateDiagramInput>(EMPTY_DIAGRAM);
  const [creating, setCreating] = useState(false);
  const idRef = useRef<HTMLInputElement>(null);

  const cancel = () => {
    setValue(EMPTY_DIAGRAM);
    setCreating(false);
    onClose();
  };

  const dialogRef = useModalFocus<HTMLFormElement>(open, cancel, idRef, creating);
  if (!open) return null;

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-carbon/25 p-4" role="presentation">
      <form
        ref={dialogRef}
        onSubmit={submit}
        role="dialog"
        aria-modal="true"
        aria-label="Crear diagrama matemático"
        aria-labelledby="create-diagram-title"
        aria-describedby="create-diagram-description"
        className="w-full max-w-xl rounded border border-carbon/20 bg-lienzo p-5 shadow-xl"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 id="create-diagram-title" className="font-serif text-lg font-bold text-carbon">Nuevo diagrama interactivo</h2>
            <p id="create-diagram-description" className="mt-1 text-xs text-carbon/55">
              Se define el ID y categoría para crear un componente TSX único en el catálogo autoritativo.
            </p>
          </div>
          <button type="button" onClick={cancel} className="rounded px-2 py-1 text-xs text-carbon/55 hover:bg-carbon/5">
            Cerrar
          </button>
        </div>

        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <label className="grid gap-1 ac-label ac-label--sm ac-label--strong">
            Categoría
            <select
              value={value.category}
              onChange={event => setValue(previous => ({ ...previous, category: event.target.value }))}
              className="rounded border border-carbon/15 bg-lienzo p-2 text-xs normal-case text-carbon"
            >
              {DIAGRAM_CATEGORY_OPTIONS.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </label>

          <label className="grid gap-1 ac-label ac-label--sm ac-label--strong">
            ID inmutable
            <input
              ref={idRef}
              value={value.id}
              onChange={event => setValue(previous => ({ ...previous, id: event.target.value.toLowerCase().replace(/\s+/g, '-') }))}
              placeholder="triangulo-pasos"
              className="rounded border border-carbon/15 bg-lienzo p-2 font-mono text-xs normal-case text-carbon"
            />
            {value.id && !ID_RE.test(value.id) && (
              <span className="normal-case text-granada text-[10px]">Usa minúsculas y guiones (ej. triangulo-pasos).</span>
            )}
            {derivedComponentName && ID_RE.test(value.id) && (
              <span className="normal-case font-mono text-[10px] text-salvia">
                Componente: &lt;{derivedComponentName} /&gt;
              </span>
            )}
          </label>

          <label className="grid gap-1 ac-label ac-label--sm ac-label--strong sm:col-span-2">
            Título
            <input
              value={value.title}
              onChange={event => setValue(previous => ({ ...previous, title: event.target.value }))}
              placeholder="Triángulo interactivo con altura"
              className="rounded border border-carbon/15 bg-lienzo p-2 font-serif text-sm normal-case text-carbon"
            />
          </label>

          <label className="grid gap-1 ac-label ac-label--sm ac-label--strong sm:col-span-2">
            Plantilla inicial
            <select
              value={value.templateType}
              onChange={event => setValue(previous => ({ ...previous, templateType: event.target.value as CreateDiagramInput['templateType'] }))}
              className="rounded border border-carbon/15 bg-lienzo p-2 text-xs normal-case text-carbon"
            >
              {DIAGRAM_TEMPLATE_OPTIONS.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </label>
        </div>

        <div className="mt-5 rounded border border-ocre/20 bg-ocre/5 p-3 text-xs text-carbon/65">
          El diagrama se creará como un componente TSX autoritativo en <span className="font-mono text-[10px]">content/diagrams/{value.category}/{derivedComponentName || '...'}.tsx</span>.
        </div>

        <div className="mt-5 flex justify-end gap-2">
          <button type="button" onClick={cancel} className="rounded border border-carbon/15 px-3 py-2 text-xs font-bold text-carbon/60 hover:bg-carbon/5">
            Cancelar
          </button>
          <button disabled={!valid || creating} className="rounded bg-salvia px-4 py-2 text-xs font-bold text-lienzo disabled:opacity-40 hover:bg-salvia/90">
            {creating ? 'Creando…' : 'Crear y abrir'}
          </button>
        </div>
      </form>
    </div>
  );
};
