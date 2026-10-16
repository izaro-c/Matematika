import React, { useMemo, useRef, useState } from 'react';
import { TEMPLATE_OPTIONS } from '../model';
import type { TemplateKind } from '../model/types';
import { useModalFocus } from '@/fixed-pages/editor/ui/page/useModalFocus';
import { useI18n } from '@/i18n';

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
  const { t } = useI18n();
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
            <h2 id="rewrite-diagram-title" className="font-serif text-lg font-bold text-carbon">{t('editor.diagramEditors.rewriteTitle')}</h2>
            <p id="rewrite-diagram-description" className="mt-1 text-xs leading-relaxed text-carbon/55">
              {t('editor.diagramEditors.rewriteDescription')}
            </p>
          </div>
          <button type="button" onClick={onClose} className="rounded px-2 py-1 text-xs text-carbon/55">{t('editor.diagramEditors.close')}</button>
        </div>

        <div className="mt-4 rounded border border-ocre/25 bg-ocre/5 p-3 text-xs leading-relaxed text-carbon/65">
          <strong className="text-ocre">{t('editor.diagramEditors.rewriteOnSaveNote')}</strong> {t('editor.diagramEditors.rewriteBackupNote')}
          <span className="mt-1 block break-all font-mono text-[9px] text-carbon/45">{path}</span>
        </div>

        <div className="mt-4 space-y-4">
          <label className="grid gap-1 ac-label ac-label--sm ac-label--strong">
            {t('editor.diagramEditors.newModelTitle')}
            <input
              ref={titleRef}
              value={title}
              onChange={event => setTitle(event.target.value)}
              className="rounded border border-carbon/15 bg-lienzo p-2 font-serif text-sm font-normal normal-case text-carbon"
            />
          </label>
          <label className="grid gap-1 ac-label ac-label--sm ac-label--strong">
            {t('editor.diagramEditors.startingPoint')}
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
          <button type="button" onClick={onClose} className="rounded border border-carbon/15 px-3 py-2 text-xs font-bold text-carbon/60">{t('editor.diagramEditors.cancel')}</button>
          <button type="submit" disabled={!valid} className="rounded bg-ocre px-4 py-2 text-xs font-bold text-lienzo disabled:opacity-40">{t('editor.diagramEditors.startFromScratch')}</button>
        </div>
      </form>
    </div>
  );
};

export default DiagramRewriteDialog;
