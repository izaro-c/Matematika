import React, { useRef, useState } from 'react';
import { CONTENT_TYPE_OPTIONS } from '../../lib/metadataFields';
import type { CreatePageInput } from '../../ux/authoringModel';
import { useModalFocus } from '../hooks/useModalFocus';

interface CreatePageDialogProps {
  open: boolean;
  onClose: () => void;
  onCreate: (input: CreatePageInput) => Promise<boolean>;
}

const ID_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const EMPTY_PAGE: CreatePageInput = { id: '', type: 'definicion', title: '', description: '' };

export const CreatePageDialog: React.FC<CreatePageDialogProps> = ({ open, onClose, onCreate }) => {
  const [value, setValue] = useState<CreatePageInput>(EMPTY_PAGE);
  const [creating, setCreating] = useState(false);
  const idRef = useRef<HTMLInputElement>(null);
  const cancel = () => {
    setValue(EMPTY_PAGE);
    setCreating(false);
    onClose();
  };
  const dialogRef = useModalFocus<HTMLFormElement>(open, cancel, idRef, creating);
  if (!open) return null;
  const needsRelated = ['lema', 'corolario', 'demostracion', 'ejemplo', 'ejercicio', 'modelo'].includes(value.type);
  const valid = ID_RE.test(value.id) && value.title.trim().length > 0 && value.description.trim().length > 0 && (!needsRelated || Boolean(value.relatedId?.trim()));
  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!valid || creating) return;
    setCreating(true);
    if (await onCreate(value)) {
      setValue(EMPTY_PAGE);
      setCreating(false);
      onClose();
    } else setCreating(false);
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-carbon/25 p-4" role="presentation">
      <form ref={dialogRef} onSubmit={submit} role="dialog" aria-modal="true" aria-label="Crear página matemática" aria-labelledby="create-page-title" aria-describedby="create-page-description" className="w-full max-w-xl rounded border border-carbon/20 bg-lienzo p-5 shadow-xl">
        <div className="flex items-start justify-between gap-4">
          <div><h2 id="create-page-title" className="font-serif text-lg font-bold text-carbon">Nueva página estructurada</h2><p id="create-page-description" className="mt-1 text-xs text-carbon/55">Se crea un MDX válido y después se edita mediante el motor lossless.</p></div>
          <button type="button" onClick={cancel} className="rounded px-2 py-1 text-xs text-carbon/55">Cerrar</button>
        </div>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <label className="grid gap-1 ac-label ac-label--sm ac-label--strong">Tipo<select value={value.type} onChange={event => setValue(previous => ({ ...previous, type: event.target.value }))} className="rounded border border-carbon/15 bg-lienzo p-2 text-xs normal-case text-carbon">
            {CONTENT_TYPE_OPTIONS.map(option => <option key={option.value} value={option.value}>{option.label}</option>)}
          </select></label>
          <label className="grid gap-1 ac-label ac-label--sm ac-label--strong">ID inmutable<input ref={idRef} value={value.id} onChange={event => setValue(previous => ({ ...previous, id: event.target.value }))} placeholder="definicion-nueva" className="rounded border border-carbon/15 bg-lienzo p-2 font-mono text-xs normal-case text-carbon" />
            {value.id && !ID_RE.test(value.id) && <span className="normal-case text-granada">Debe usar kebab-case.</span>}</label>
          <label className="grid gap-1 ac-label ac-label--sm ac-label--strong sm:col-span-2">Título<input value={value.title} onChange={event => setValue(previous => ({ ...previous, title: event.target.value }))} className="rounded border border-carbon/15 bg-lienzo p-2 font-serif text-sm normal-case text-carbon" /></label>
          <label className="grid gap-1 ac-label ac-label--sm ac-label--strong sm:col-span-2">Descripción motivacional<textarea value={value.description} onChange={event => setValue(previous => ({ ...previous, description: event.target.value }))} className="min-h-20 rounded border border-carbon/15 bg-lienzo p-2 font-serif text-sm normal-case text-carbon" /></label>
          {needsRelated && <label className="grid gap-1 ac-label ac-label--sm ac-label--strong sm:col-span-2">ID relacionado<input value={value.relatedId ?? ''} onChange={event => setValue(previous => ({ ...previous, relatedId: event.target.value }))} placeholder={value.type === 'modelo' ? 'sistema-axiomatico' : 'teorema-relacionado'} className="rounded border border-carbon/15 bg-lienzo p-2 font-mono text-xs normal-case text-carbon" /></label>}
        </div>
        <div className="mt-5 rounded border border-ocre/20 bg-ocre/5 p-3 text-xs text-carbon/65">Las demostraciones nacen con un paso justificado y nunca como texto libre sin estructura.</div>
        <div className="mt-5 flex justify-end gap-2"><button type="button" onClick={cancel} className="rounded border border-carbon/15 px-3 py-2 text-xs font-bold text-carbon/60">Cancelar</button><button disabled={!valid || creating} className="rounded bg-salvia px-4 py-2 text-xs font-bold text-lienzo disabled:opacity-40">{creating ? 'Creando…' : 'Crear y abrir'}</button></div>
      </form>
    </div>
  );
};
