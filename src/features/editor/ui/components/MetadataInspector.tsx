import React, { useState } from 'react';
import { getMetadataFields, type MetadataFieldConfig } from '@/features/editor/lib/metadataFields';

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

export const MetadataInspector: React.FC<MetadataInspectorProps> = ({
  metadata,
  onChange,
  onRemove,
  onAddCustom,
  disabled = false,
}) => {
  const [customFieldKey, setCustomFieldKey] = useState('');
  const type = String(metadata.type || '');
  const fields = getMetadataFields(type);
  const configuredKeys = new Set(fields.map(field => field.key));
  const customKeys = Object.keys(metadata).filter(key => !configuredKeys.has(key));
  const addCustomField = () => {
    const key = customFieldKey.trim();
    if (key.length === 0 || Object.prototype.hasOwnProperty.call(metadata, key)) return;
    onAddCustom(key);
    setCustomFieldKey('');
  };

  const renderField = (field: MetadataFieldConfig) => {
    const value = readFieldValue(field, metadata[field.key]);

    return (
      <label key={field.key} className="group grid gap-1 rounded border border-carbon/10 bg-carbon/5 p-2 shadow-sm">
        <span className="flex items-center justify-between gap-2 ac-label ac-label--xs">
          <span className="truncate">
            {field.label} {field.required && <span className="text-terracota">*</span>}
          </span>
          {field.readonly && <span className="text-[8px] text-carbon/35">bloqueado</span>}
        </span>

        {field.type === 'select' ? (
          <select
            className="w-full rounded border border-carbon/15 bg-lienzo p-1.5 text-xs text-carbon focus:border-terracota focus:outline-none"
            value={String(value)}
            disabled={field.readonly}
            onChange={(event) => onChange(field.key, event.target.value)}
          >
            <option value="">-</option>
            {field.options?.map(option => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        ) : field.type === 'textarea' ? (
          <textarea
            className="min-h-[58px] w-full resize-y rounded border border-carbon/15 bg-lienzo p-1.5 text-xs text-carbon focus:border-terracota focus:outline-none"
            value={String(value)}
            disabled={field.readonly}
            placeholder={field.placeholder}
            onChange={(event) => onChange(field.key, event.target.value)}
          />
        ) : field.type === 'array' ? (
          <input
            className="w-full rounded border border-carbon/15 bg-lienzo p-1.5 text-xs text-carbon focus:border-terracota focus:outline-none"
            value={Array.isArray(value) ? value.join(', ') : String(value || '')}
            disabled={field.readonly}
            placeholder={field.placeholder || 'id-uno, id-dos'}
            onChange={(event) => onChange(
              field.key,
              event.target.value.split(',').map(item => item.trim()).filter(Boolean),
            )}
          />
        ) : field.type === 'boolean' ? (
          <div className="flex items-center justify-between rounded border border-carbon/15 bg-lienzo px-2 py-1.5">
            <span className="text-xs text-carbon/65">{value ? 'Activado' : 'Desactivado'}</span>
            <input
              type="checkbox"
              checked={Boolean(value)}
              disabled={field.readonly}
              onChange={(event) => onChange(field.key, event.target.checked)}
            />
          </div>
        ) : (
          <input
            className="w-full rounded border border-carbon/15 bg-lienzo p-1.5 text-xs text-carbon focus:border-terracota focus:outline-none"
            value={String(value)}
            disabled={field.readonly}
            placeholder={field.placeholder}
            onChange={(event) => onChange(field.key, event.target.value)}
          />
        )}
      </label>
    );
  };

  return (
    <fieldset disabled={disabled} className="flex-1 space-y-4 overflow-y-auto bg-lienzo p-4 disabled:opacity-60">
      <div className="flex items-center justify-between border-b border-carbon/15 pb-2">
        <div>
          <h3 className="font-serif text-sm font-bold text-carbon">Metadatos</h3>
          <p className="mt-0.5 text-[10px] italic text-carbon/45">Campos guiados por el schema del contenido.</p>
        </div>
        <div className="flex items-center gap-1">
          <input
            className="w-28 rounded border border-carbon/15 bg-lienzo px-2 py-1 text-[10px] text-carbon focus:border-terracota focus:outline-none"
            value={customFieldKey}
            placeholder="campo"
            onChange={(event) => setCustomFieldKey(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                event.preventDefault();
                addCustomField();
              }
            }}
          />
          <button
            type="button"
            onClick={addCustomField}
            className="rounded border border-carbon/15 bg-carbon/5 px-2 py-1 text-[10px] font-bold text-carbon transition-colors hover:bg-carbon/10"
          >
            +
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {fields.map(renderField)}
      </div>

      {customKeys.length > 0 && (
        <div className="space-y-3 border-t border-carbon/15 pt-3">
          <p className="font-serif text-xs font-bold italic text-carbon/70">Campos no estándar</p>
          <div className="grid grid-cols-2 gap-3">
            {customKeys.map(key => (
              <label key={key} className="relative grid gap-1 rounded border border-salvia/20 bg-salvia/5 p-2 shadow-sm">
                <span className="truncate pr-5 ac-label ac-label--xs ac-label--salvia-soft">{key}</span>
                <button
                  type="button"
                  onClick={() => onRemove(key)}
                  className="absolute right-2 top-2 text-[10px] font-bold text-salvia opacity-0 transition-opacity group-hover:opacity-100"
                  title="Eliminar campo"
                >
                  x
                </button>
                <input
                  className="w-full rounded border border-salvia/20 bg-lienzo p-1.5 text-xs text-carbon focus:border-terracota focus:outline-none"
                  value={Array.isArray(metadata[key]) ? metadata[key].join(', ') : String(metadata[key] || '')}
                  onChange={(event) => {
                    const raw = event.target.value;
                    onChange(key, Array.isArray(metadata[key])
                      ? raw.split(',').map(item => item.trim()).filter(Boolean)
                      : raw);
                  }}
                />
              </label>
            ))}
          </div>
        </div>
      )}
    </fieldset>
  );
};
