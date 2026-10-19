import React, { useRef, useState } from 'react';
import { CONTENT_TYPE_OPTIONS, LANGUAGE_OPTIONS } from '@/fixed-pages/editor/metadata/metadataFields';
import type { CreatePageInput } from '@/fixed-pages/editor/review/authoringModel';
import { Button, Field, Modal } from '@/fixed-pages/editor/ui/primitives';
import { useI18n } from '@/i18n';

interface CreatePageDialogProps {
  open: boolean;
  onClose: () => void;
  onCreate: (input: CreatePageInput) => Promise<boolean>;
  initialLang?: string;
}

const ID_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const EMPTY_PAGE: CreatePageInput = { id: '', type: 'definicion', lang: 'es', title: '', description: '' };

export const CreatePageDialog: React.FC<CreatePageDialogProps> = ({ open, onClose, onCreate, initialLang }) => {
  const [value, setValue] = useState<CreatePageInput>(() => ({ ...EMPTY_PAGE, lang: initialLang || 'es' }));
  const [creating, setCreating] = useState(false);
  const idRef = useRef<HTMLInputElement>(null);
  const { t } = useI18n();

  const cancel = () => {
    setValue({ ...EMPTY_PAGE, lang: initialLang || 'es' });
    setCreating(false);
    onClose();
  };


  const needsRelated = ['lema', 'corolario', 'demostracion', 'ejemplo', 'ejercicio', 'modelo'].includes(value.type);
  const valid = ID_RE.test(value.id) && value.title.trim().length > 0 && value.description.trim().length > 0 && (!needsRelated || Boolean(value.relatedId?.trim()));

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!valid || creating) return;
    setCreating(true);
    if (await onCreate(value)) {
      setValue({ ...EMPTY_PAGE, lang: initialLang || 'es' });
      setCreating(false);
      onClose();
    } else setCreating(false);
  };

  return (
    <Modal
      open={open}
      onClose={cancel}
      title={t('editor.create.newStructuredPage')}
      size="md"
      dismissible={!creating}
      initialFocusRef={idRef}
      footer={
        <>
          <Button onClick={cancel} disabled={creating}>{t('editor.common.cancel')}</Button>
          <Button variant="primary" type="submit" form="create-page-form" disabled={!valid || creating}>
            {creating ? t('editor.create.creating') : t('editor.create.createAndOpen')}
          </Button>
        </>
      }
    >
      <form id="create-page-form" onSubmit={submit} className="space-y-4">
        <p>{t('editor.create.newStructuredPageDesc')}</p>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label={t('editor.create.typeLabel')}>
            <select value={value.type} onChange={event => setValue(previous => ({ ...previous, type: event.target.value }))}>
              {CONTENT_TYPE_OPTIONS.map(option => <option key={option.value} value={option.value}>{option.label}</option>)}
            </select>
          </Field>
          <Field label="Idioma">
            <select value={value.lang || 'es'} onChange={event => setValue(previous => ({ ...previous, lang: event.target.value }))}>
              {LANGUAGE_OPTIONS.map(option => <option key={option.value} value={option.value}>{option.label}</option>)}
            </select>
          </Field>
          <Field
            className="sm:col-span-2"
            label={t('editor.create.slugLabel')}
            error={value.id && !ID_RE.test(value.id) ? t('editor.create.slugValidation') : undefined}
          >
            <input ref={idRef} value={value.id} onChange={event => setValue(previous => ({ ...previous, id: event.target.value }))} placeholder="definicion-nueva" className="font-mono" />
          </Field>
          <Field className="sm:col-span-2" label={t('editor.create.titleLabel')}>
            <input value={value.title} onChange={event => setValue(previous => ({ ...previous, title: event.target.value }))} />
          </Field>
          <Field className="sm:col-span-2" label={t('editor.create.descriptionLabel')}>
            <textarea value={value.description} onChange={event => setValue(previous => ({ ...previous, description: event.target.value }))} className="min-h-20" />
          </Field>
          {needsRelated && (
            <Field className="sm:col-span-2" label={t('editor.create.relatedIdLabel')}>
              <input value={value.relatedId ?? ''} onChange={event => setValue(previous => ({ ...previous, relatedId: event.target.value }))} placeholder={value.type === 'modelo' ? 'sistema-axiomatikoa' : 'lotutako-teorema'} className="font-mono" />
            </Field>
          )}
        </div>
        <p className="border-t border-[color:var(--ed-rule-faint)] pt-3 text-sm italic text-carbon/65">
          {t('editor.mdx.proofStepNote')}
        </p>
      </form>
    </Modal>
  );
};
