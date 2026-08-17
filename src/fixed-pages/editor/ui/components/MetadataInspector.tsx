import React, { useState } from 'react';
import { getMetadataFields, type MetadataFieldConfig } from '@/fixed-pages/editor/metadata/metadataFields';
import { IconChevronDown, IconChevronRight } from '@/fixed-pages/editor/diagrams/ui/toolbar/WorkbenchIcons';

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
const RELATION_KEYS = new Set(['statement', 'parentTheorem', 'requires', 'lemmas', 'demos', 'dependencias', 'relatedTheorem', 'concept', 'requiredNodes', 'satisfies', 'axioms_verified', 'axiomSystem', 'axiomFamily', 'alternativeGroup']);

export const MetadataInspector: React.FC<MetadataInspectorProps> = ({
  metadata,
  onChange,
  onRemove,
  onAddCustom,
  disabled = false,
}) => {
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
          className="w-full rounded-lg border border-carbon/15 bg-lienzo px-3 py-2 text-xs font-sans text-carbon shadow-2xs transition-colors focus:border-salvia focus:outline-none focus:ring-2 focus:ring-salvia/20 disabled:bg-carbon/5 cursor-pointer"
          value={String(value)}
          disabled={field.readonly || disabled}
          onChange={(e) => onChange(field.key, e.target.value)}
        >
          <option value="">- Seleccionar -</option>
          {field.options?.map(option => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </select>
      );
    }

    if (field.type === 'textarea') {
      return (
        <textarea
          className="min-h-[72px] w-full resize-y rounded-lg border border-carbon/15 bg-lienzo p-2.5 text-xs font-serif text-carbon shadow-2xs transition-colors focus:border-salvia focus:outline-none focus:ring-2 focus:ring-salvia/20 disabled:bg-carbon/5 placeholder-carbon/25"
          value={String(value)}
          disabled={field.readonly || disabled}
          placeholder={field.placeholder || 'Detalles del campo...'}
          onChange={(e) => onChange(field.key, e.target.value)}
        />
      );
    }

    if (field.type === 'array') {
      const items = Array.isArray(value) ? (value as string[]) : [];
      return (
        <div className="space-y-2">
          <div className="flex flex-wrap gap-1.5 min-h-[32px] p-2 rounded-lg border border-carbon/10 bg-lienzo/60 shadow-2xs">
            {items.length === 0 ? (
              <span className="text-[11px] italic text-carbon/35">Sin elementos</span>
            ) : (
              items.map((item, idx) => (
                <span
                  key={`${item}-${idx}`}
                  className="inline-flex items-center gap-1 rounded-md bg-salvia/10 border border-salvia/20 px-2 py-0.5 text-xs font-medium text-salvia"
                >
                  <span className="truncate max-w-[140px]">{item}</span>
                  {!field.readonly && !disabled && (
                    <button
                      type="button"
                      onClick={() => handleArrayRemove(field.key, idx)}
                      className="text-salvia/70 hover:text-salvia font-bold ml-0.5 cursor-pointer"
                      title="Eliminar"
                    >
                      ×
                    </button>
                  )}
                </span>
              ))
            )}
          </div>
          {!field.readonly && !disabled && (
            <div className="flex gap-1.5">
              <input
                type="text"
                className="flex-1 rounded-md border border-carbon/15 bg-lienzo px-2.5 py-1 text-xs text-carbon placeholder-carbon/30 focus:border-salvia focus:outline-none focus:ring-1 focus:ring-salvia/30"
                placeholder={field.placeholder || 'Agregar ID o valor...'}
                value={newArrayItem[field.key] || ''}
                onChange={(e) => setNewArrayItem(prev => ({ ...prev, [field.key]: e.target.value }))}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleArrayAdd(field.key);
                  }
                }}
              />
              <button
                type="button"
                onClick={() => handleArrayAdd(field.key)}
                className="rounded-md border border-salvia/30 bg-salvia/10 px-2.5 py-1 text-xs font-bold text-salvia hover:bg-salvia/20 transition-colors cursor-pointer"
              >
                + Añadir
              </button>
            </div>
          )}
        </div>
      );
    }

    if (field.type === 'boolean') {
      const boolVal = Boolean(value);
      return (
        <button
          type="button"
          disabled={field.readonly || disabled}
          onClick={() => onChange(field.key, !boolVal)}
          className={`flex w-full items-center justify-between rounded-lg border px-3 py-2 transition-all cursor-pointer ${
            boolVal
              ? 'border-salvia bg-salvia/10 text-salvia font-bold'
              : 'border-carbon/15 bg-lienzo text-carbon/60 hover:bg-carbon/5'
          }`}
        >
          <span className="text-xs">{boolVal ? 'Activado' : 'Desactivado'}</span>
          <span className={`h-3.5 w-3.5 rounded-full border ${boolVal ? 'bg-salvia border-salvia' : 'bg-transparent border-carbon/30'}`} />
        </button>
      );
    }

    return (
      <input
        type="text"
        className="w-full rounded-lg border border-carbon/15 bg-lienzo px-3 py-2 text-xs font-sans text-carbon shadow-2xs transition-colors focus:border-salvia focus:outline-none focus:ring-2 focus:ring-salvia/20 disabled:bg-carbon/5 placeholder-carbon/25"
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
      <div className="rounded-2xl border border-carbon/15 bg-lienzo p-4 shadow-2xs transition-all hover:border-carbon/25">
        <button
          type="button"
          aria-expanded={isOpen}
          onClick={() => toggleSection(secKey)}
          className="flex w-full items-center justify-between font-serif text-xs font-bold uppercase tracking-wider text-carbon/80 py-0.5 cursor-pointer select-none"
        >
          <span>{title}</span>
          <span className="text-carbon/40 hover:text-carbon transition-colors p-0.5 rounded-lg hover:bg-carbon/5">
            {isOpen ? <IconChevronDown className="w-4 h-4" /> : <IconChevronRight className="w-4 h-4" />}
          </span>
        </button>

        {isOpen && (
          <div className="space-y-3 pt-3 border-t border-carbon/10 mt-2">
            {groupFields.map(field => (
              <div key={field.key} className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-medium text-carbon/80 flex items-center gap-1">
                    <span>{field.label}</span>
                    {field.required && <span className="text-terracota font-bold">*</span>}
                  </label>
                  {field.readonly && (
                    <span className="ac-label ac-label--2xs ac-label--faint">Solo lectura</span>
                  )}
                </div>
                {renderFieldInput(field)}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  const customIsOpen = openSections.custom ?? true;

  return (
    <fieldset disabled={disabled} className="flex-1 space-y-3 overflow-y-auto bg-lienzo p-4 disabled:opacity-60">
      <div className="flex items-center justify-between border-b border-carbon/15 pb-3">
        <div>
          <h3 className="font-serif text-base font-bold text-carbon">Metadatos del Documento</h3>
          <p className="text-xs italic text-carbon/50">Esquema oficial para <span className="font-bold text-salvia">{type || 'concepto'}</span></p>
        </div>
        <span className="ac-label ac-label--sm ac-label--salvia select-none uppercase tracking-wider">
          {type || 'General'}
        </span>
      </div>

      {renderFieldGroup('identity', 'Identificación Principal', identityFields)}
      {renderFieldGroup('relations', 'Estructura y Relaciones', relationFields)}
      {renderFieldGroup('config', 'Configuración y Estilo', configFields)}

      {/* Sección de Campos Personalizados Colapsable */}
      <div className="rounded-2xl border border-carbon/15 bg-lienzo p-4 shadow-2xs transition-all hover:border-carbon/25">
        <button
          type="button"
          aria-expanded={customIsOpen}
          onClick={() => toggleSection('custom')}
          className="flex w-full items-center justify-between font-serif text-xs font-bold uppercase tracking-wider text-carbon/80 py-0.5 cursor-pointer select-none"
        >
          <span>Campos Personalizados</span>
          <span className="text-carbon/40 hover:text-carbon transition-colors p-0.5 rounded-lg hover:bg-carbon/5">
            {customIsOpen ? <IconChevronDown className="w-4 h-4" /> : <IconChevronRight className="w-4 h-4" />}
          </span>
        </button>

        {customIsOpen && (
          <div className="space-y-3 pt-3 border-t border-carbon/10 mt-2">
            {customKeys.length > 0 && (
              <div className="space-y-2">
                {customKeys.map(key => (
                  <div key={key} className="flex items-center gap-2 rounded-lg border border-salvia/20 bg-salvia/5 p-2">
                    <span className="ac-label ac-label--xs ac-label--salvia shrink-0">{key}</span>
                    <input
                      className="flex-1 rounded-md border border-salvia/20 bg-lienzo px-2.5 py-1 text-xs text-carbon focus:border-salvia focus:outline-none"
                      value={Array.isArray(metadata[key]) ? (metadata[key] as string[]).join(', ') : String(metadata[key] || '')}
                      onChange={(e) => {
                        const raw = e.target.value;
                        onChange(key, Array.isArray(metadata[key]) ? raw.split(',').map(s => s.trim()).filter(Boolean) : raw);
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => onRemove(key)}
                      className="text-xs font-bold text-terracota hover:text-terracota/80 px-1 cursor-pointer"
                      title="Eliminar campo"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="flex gap-2 pt-1">
              <input
                className="flex-1 rounded-lg border border-carbon/15 bg-lienzo px-3 py-1.5 text-xs text-carbon placeholder-carbon/30 focus:border-salvia focus:outline-none focus:ring-1 focus:ring-salvia/30"
                value={customFieldKey}
                placeholder="Nombre del nuevo campo..."
                onChange={(e) => setCustomFieldKey(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addCustomField();
                  }
                }}
              />
              <button
                type="button"
                onClick={addCustomField}
                className="rounded-lg border border-carbon/15 bg-carbon/5 px-3 py-1.5 text-xs font-bold text-carbon hover:bg-carbon/10 transition-colors cursor-pointer"
              >
                + Añadir
              </button>
            </div>
          </div>
        )}
      </div>
    </fieldset>
  );
};
