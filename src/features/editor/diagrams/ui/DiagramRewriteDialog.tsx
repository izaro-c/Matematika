import React, { useMemo, useRef, useState } from 'react';
import { TEMPLATE_OPTIONS } from '../model/commands';
import type { TemplateKind } from '../model/types';
import { useModalFocus } from '../../ui/hooks/useModalFocus';

interface DiagramRewriteDialogProps {
  path: string;
  initialTitle: string;
  onClose: () => void;
  onStart: (value: { title: string; template: TemplateKind }) => void;
}

export const DiagramRewriteDialog: React.FC<DiagramRewriteDialogProps> = ({
  path,
  initialTitle,
  onClose,
  onStart,
}) => {
  const [title, setTitle] = useState(initialTitle);
  const [template, setTemplate] = useState<TemplateKind>('lienzo-inicial');
  const titleRef = useRef<HTMLInputElement>(null);
  const dialogRef = useModalFocus<HTMLFormElement>(true, onClose, titleRef);
  const selectedTemplate = useMemo(
    () => TEMPLATE_OPTIONS.find(option => option.value === template) ?? TEMPLATE_OPTIONS[0],
    [template],
  );
  const valid = title.trim().length > 0;

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!valid) return;
    onStart({ title: title.trim(), template });
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-carbon/30 p-4" role="presentation">
      <form
        ref={dialogRef}
        onSubmit={submit}
        role="dialog"
        aria-modal="true"
        aria-labelledby="rewrite-diagram-title"
        aria-describedby="rewrite-diagram-description"
        className="w-full max-w-lg rounded border border-carbon/20 bg-lienzo p-5 shadow-xl"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 id="rewrite-diagram-title" className="font-serif text-lg font-bold text-carbon">Reescribir como diagrama visual</h2>
            <p id="rewrite-diagram-description" className="mt-1 text-xs leading-relaxed text-carbon/55">
              Se iniciará un modelo visual nuevo. El código existente no se interpreta ni se mezcla con la plantilla.
            </p>
          </div>
          <button type="button" onClick={onClose} className="rounded px-2 py-1 text-xs text-carbon/55">Cerrar</button>
        </div>

        <div className="mt-4 rounded border border-ocre/25 bg-ocre/5 p-3 text-xs leading-relaxed text-carbon/65">
          <strong className="text-ocre">La sustitución solo ocurre al guardar.</strong> En ese momento se comprobará que el archivo no ha cambiado y se creará un backup de la fuente actual.
          <span className="mt-1 block break-all font-mono text-[9px] text-carbon/45">{path}</span>
        </div>

        <div className="mt-4 space-y-4">
          <label className="grid gap-1 text-[10px] font-bold uppercase tracking-wider text-carbon/55">
            Título del nuevo modelo
            <input
              ref={titleRef}
              value={title}
              onChange={event => setTitle(event.target.value)}
              className="rounded border border-carbon/15 bg-lienzo p-2 font-serif text-sm font-normal normal-case text-carbon"
            />
          </label>
          <label className="grid gap-1 text-[10px] font-bold uppercase tracking-wider text-carbon/55">
            Punto de partida
            <select
              value={template}
              onChange={event => setTemplate(event.target.value as TemplateKind)}
              className="rounded border border-carbon/15 bg-lienzo p-2 text-xs font-normal normal-case text-carbon"
            >
              {TEMPLATE_OPTIONS.map(option => <option key={option.value} value={option.value}>{option.label}</option>)}
            </select>
          </label>
          <p className="rounded bg-carbon/5 p-2 text-[10px] leading-relaxed text-carbon/55">{selectedTemplate.description}</p>
        </div>

        <div className="mt-5 flex justify-end gap-2">
          <button type="button" onClick={onClose} className="rounded border border-carbon/15 px-3 py-2 text-xs font-bold text-carbon/60">Cancelar</button>
          <button type="submit" disabled={!valid} className="rounded bg-ocre px-4 py-2 text-xs font-bold text-lienzo disabled:opacity-40">Empezar desde cero</button>
        </div>
      </form>
    </div>
  );
};

export default DiagramRewriteDialog;
