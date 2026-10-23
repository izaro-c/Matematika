import React, { useState } from 'react';
import { useI18n } from '@/i18n';
import { getMetadataFields, type MetadataFieldConfig } from '@/fixed-pages/editor/metadata/metadataFields';
import { Button, Card, IconButton, Panel, controlClassName } from '@/fixed-pages/editor/ui/primitives';

interface MetadataInspectorProps {
  metadata: Record<string, unknown>;
  onChange: (key: string, value: unknown) => void;
  onRemove: (key: string) => void;
  onAddCustom: (key: string) => void;
  disabled?: boolean;
}

function readFieldValue(field: MetadataFieldConfig, value: unknown) {
  if (value !== undefined) return value;
  if (field.type === 'array') return [];
  if (field.type === 'boolean') return false;
  return '';
}

const IDENTITY_KEYS = new Set(['id', 'type', 'lang', 'branch', 'title', 'name', 'description', 'subtitle', 'birthYear', 'deathYear', 'image']);
const RELATION_KEYS = new Set(['statement', 'parentTheorem', 'requires', 'lemmas', 'demos', 'dependencias', 'relatedTheorem', 'concept', 'requiredNodes', 'satisfies', 'axioms_verified', 'axioms_falsified', 'axiomSystem', 'axiomFamily', 'alternativeGroup', 'extends', 'builtIn']);

export const MetadataInspector: React.FC<MetadataInspectorProps> = ({
  metadata,
  onChange,
  onRemove,
  onAddCustom,
  disabled = false,
}) => {
  const { t } = useI18n();
  const [customFieldKey, setCustomFieldKey] = useState('');
  const [newArrayItem, setNewArrayItem] = useState<Record<string, string>>({});
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    identity: true,
    relations: true,
    config: true,
    custom: true,
  });

  const toggleSection = (secKey: string) => {
    setOpenSections(prev => ({ ...prev, [secKey]: !prev[secKey] }));
  };

  const type = String(metadata.type || '');
  const fields = getMetadataFields(type);
  const configuredKeys = new Set(fields.map(field => field.key));
  const customKeys = Object.keys(metadata).filter(key => !configuredKeys.has(key));

  const identityFields = fields.filter(f => IDENTITY_KEYS.has(f.key));
  const relationFields = fields.filter(f => RELATION_KEYS.has(f.key));
  const configFields = fields.filter(f => !IDENTITY_KEYS.has(f.key) && !RELATION_KEYS.has(f.key));

  const addCustomField = () => {
    const key = customFieldKey.trim();
    if (key.length === 0 || Object.prototype.hasOwnProperty.call(metadata, key)) return;
    onAddCustom(key);
    setCustomFieldKey('');
  };

  const handleArrayAdd = (key: string) => {
    const item = (newArrayItem[key] || '').trim();
    if (!item) return;
    const current = Array.isArray(metadata[key]) ? (metadata[key] as string[]) : [];
    if (!current.includes(item)) {
      onChange(key, [...current, item]);
    }
    setNewArrayItem(prev => ({ ...prev, [key]: '' }));
  };

  const handleArrayRemove = (key: string, indexToRemove: number) => {
    const current = Array.isArray(metadata[key]) ? (metadata[key] as string[]) : [];
    onChange(key, current.filter((_, i) => i !== indexToRemove));
  };

  const renderFieldInput = (field: MetadataFieldConfig) => {
    const value = readFieldValue(field, metadata[field.key]);

    if (field.type === 'select') {
      return (
        <select
          className={controlClassName}
          value={String(value)}
          disabled={field.readonly || disabled}
          onChange={(e) => onChange(field.key, e.target.value)}
        >
          <option value="">{t('editor.metadata.select')}</option>
          {field.options?.map(option => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </select>
      );
    }

    if (field.type === 'textarea') {
      return (
        <textarea
          className={`${controlClassName} min-h-[72px] resize-y`}
          value={String(value)}
          disabled={field.readonly || disabled}
          placeholder={field.placeholder || t('editor.metadata.fieldDetails')}
          onChange={(e) => onChange(field.key, e.target.value)}
        />
      );
    }

    if (field.type === 'array') {
      const items = Array.isArray(value) ? (value as string[]) : [];
      return (
        <div className="space-y-2">
          <Card className="flex flex-wrap gap-1.5 min-h-[32px]">
            {items.length === 0 ? (
              <span className="text-[11px] italic text-carbon/35">{t('editor.metadata.noItems')}</span>
            ) : (
              items.map((item, idx) => (
                <span
                  key={`${item}-${idx}`}
                  className="inline-flex items-center gap-1 rounded-md bg-canela/10 border border-canela/20 px-2 py-0.5 text-xs font-medium text-canela"
                >
                  <span className="truncate max-w-[140px]">{item}</span>
                  {!field.readonly && !disabled && (
                    <IconButton size="sm" className="ml-0.5" label={t('editor.metadata.remove')} onClick={() => handleArrayRemove(field.key, idx)}>
                      ×
                    </IconButton>
                  )}
                </span>
              ))
            )}
          </Card>
          {!field.readonly && !disabled && (
            <div className="flex gap-1.5">
              <input
                type="text"
                className={`${controlClassName} flex-1`}
                placeholder={field.placeholder || t('editor.metadata.addValuePlaceholder')}
                value={newArrayItem[field.key] || ''}
                onChange={(e) => setNewArrayItem(prev => ({ ...prev, [field.key]: e.target.value }))}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleArrayAdd(field.key);
                  }
                }}
              />
              <Button size="sm" onClick={() => handleArrayAdd(field.key)}>
                {t('editor.metadata.add')}
              </Button>
            </div>
          )}
        </div>
      );
    }

    if (field.type === 'boolean') {
      const boolVal = Boolean(value);
      return (
        <Button
          fullWidth
          aria-pressed={boolVal}
          disabled={field.readonly || disabled}
          onClick={() => onChange(field.key, !boolVal)}
        >
          {boolVal ? t('editor.metadata.on') : t('editor.metadata.off')}
        </Button>
      );
    }

    return (
      <input
        type="text"
        className={controlClassName}
        value={String(value)}
        disabled={field.readonly || disabled}
        placeholder={field.placeholder || ''}
        onChange={(e) => onChange(field.key, e.target.value)}
      />
    );
  };

  const renderFieldGroup = (secKey: string, title: string, groupFields: MetadataFieldConfig[]) => {
    if (groupFields.length === 0) return null;
    const isOpen = openSections[secKey] ?? true;

    return (
      <Panel title={title} collapsible open={isOpen} onOpenChange={() => toggleSection(secKey)}>
        <div className="space-y-3">
            {groupFields.map(field => (
              <div key={field.key} className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-medium text-carbon/80 flex items-center gap-1">
                    <span>{field.label}</span>
                    {field.required && <span className="text-terracota font-bold">*</span>}
                  </label>
                  {field.readonly && (
                    <span className="ac-label ac-label--2xs ac-label--faint">{t('editor.metadata.readOnly')}</span>
                  )}
                </div>
                {renderFieldInput(field)}
              </div>
            ))}
        </div>
      </Panel>
    );
  };

  const customIsOpen = openSections.custom ?? true;

  return (
    <fieldset disabled={disabled} className="flex-1 space-y-3 overflow-y-auto bg-lienzo p-4 disabled:opacity-60">
      <div className="flex items-center justify-between border-b border-carbon/15 pb-3">
        <div>
          <h3 className="font-serif text-base font-bold text-carbon">{t('editor.metadata.documentMetadata')}</h3>
          <p className="text-xs italic text-carbon/50"><span className="font-bold text-canela">{t('editor.metadata.officialSchemaFor', { type: type || t('editor.metadata.defaultType') })}</span></p>
        </div>
        <span className="ac-label ac-label--sm ac-label--canela select-none uppercase tracking-wider">
          {type || t('editor.metadata.general')}
        </span>
      </div>

      {renderFieldGroup('identity', t('editor.metadata.identity'), identityFields)}
      {renderFieldGroup('relations', t('editor.metadata.relations'), relationFields)}
      {renderFieldGroup('config', t('editor.metadata.config'), configFields)}

      {/* Sección de Campos Personalizados Colapsable */}
      <Panel title={t('editor.metadata.customFields')} collapsible open={customIsOpen} onOpenChange={() => toggleSection('custom')}>
        <div className="space-y-3">
            {customKeys.length > 0 && (
              <div className="space-y-2">
                {customKeys.map(key => (
                  <div key={key} className="flex items-center gap-2 border-b border-[color:var(--ed-rule-faint)] pb-2">
                    <span className="ac-label ac-label--xs ac-label--canela shrink-0">{key}</span>
                    <input
                      className={`${controlClassName} flex-1`}
                      value={Array.isArray(metadata[key]) ? (metadata[key] as string[]).join(', ') : String(metadata[key] || '')}
                      onChange={(e) => {
                        const raw = e.target.value;
                        onChange(key, Array.isArray(metadata[key]) ? raw.split(',').map(s => s.trim()).filter(Boolean) : raw);
                      }}
                    />
                    <IconButton size="sm" tone="danger" label={t('editor.metadata.removeField')} onClick={() => onRemove(key)}>
                      ×
                    </IconButton>
                  </div>
                ))}
              </div>
            )}

            <div className="flex gap-2 pt-1">
              <input
                className={`${controlClassName} flex-1`}
                value={customFieldKey}
                placeholder={t('editor.metadata.newFieldName')}
                onChange={(e) => setCustomFieldKey(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addCustomField();
                  }
                }}
              />
              <Button size="sm" onClick={addCustomField}>
                {t('editor.metadata.add')}
              </Button>
            </div>
        </div>
      </Panel>
    </fieldset>
  );
};
