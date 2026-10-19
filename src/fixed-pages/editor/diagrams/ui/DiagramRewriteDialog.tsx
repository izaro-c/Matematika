import React, { useMemo, useRef, useState } from 'react';
import { TEMPLATE_OPTIONS } from '../model';
import type { TemplateKind } from '../model/types';
import { useI18n } from '@/i18n';
import { Button, Field, Modal } from '@/fixed-pages/editor/ui/primitives';

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
    <Modal
      open
      onClose={onClose}
      title={t('editor.diagramEditors.rewriteTitle')}
      size="md"
      initialFocusRef={titleRef}
      footer={
        <>
          <Button onClick={onClose}>{t('editor.diagramEditors.cancel')}</Button>
          <Button variant="primary" type="submit" form="rewrite-diagram-form" disabled={!valid}>{t('editor.diagramEditors.startFromScratch')}</Button>
        </>
      }
    >
      <form id="rewrite-diagram-form" onSubmit={submit} className="space-y-4">
        <p>{t('editor.diagramEditors.rewriteDescription')}</p>
        <p className="border-l-2 border-[color:var(--ed-rule-strong)] pl-3 text-sm">
          <strong>{t('editor.diagramEditors.rewriteOnSaveNote')}</strong> {t('editor.diagramEditors.rewriteBackupNote')}
          <span className="mt-1 block break-all font-mono text-xs text-carbon/55">{path}</span>
        </p>
        <Field label={t('editor.diagramEditors.newModelTitle')}>
          <input ref={titleRef} value={title} onChange={event => setTitle(event.target.value)} />
        </Field>
        <Field label={t('editor.diagramEditors.startingPoint')} help={selectedTemplate.description}>
          <select value={template} onChange={event => setTemplate(event.target.value as TemplateKind)}>
            {TEMPLATE_OPTIONS.map(option => <option key={option.value} value={option.value}>{option.label}</option>)}
          </select>
        </Field>
      </form>
    </Modal>
  );
};

export default DiagramRewriteDialog;
