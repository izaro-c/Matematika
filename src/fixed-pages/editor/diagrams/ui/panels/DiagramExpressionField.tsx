import React, { useMemo, useRef, useState } from 'react';
import {
  DiagramExpressionError,
  evaluateMathExpression,
  expressionVariables,
  extractMathExpressionIdentifiers,
  parseMathExpression,
} from '@/diagrams/public';
import type { VisualDiagramModel } from '../../model/types';
import { DiagramFormField, diagramInputClassName } from '../primitives/DiagramFormField';
import { useI18n } from '@/i18n';
import { renderRichText } from '@/fixed-pages/editor/diagrams/ui/primitives/richText';
import { Button } from '@/fixed-pages/editor/ui/primitives';

interface DiagramExpressionFieldProps {
  model: VisualDiagramModel;
  label: string;
  ariaLabel?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  optional?: boolean;
  parameter?: string;
  help?: string;
  compact?: boolean;
  error?: string;
}

type TranslateWithParams = (...args: [string] | [string, Record<string, string | number>]) => string;

function variableLabel(t: TranslateWithParams, variable: string, value?: number): string {
  const kind = variable.endsWith('.x') ? 'Horizontal'
    : variable.endsWith('.y') ? 'Vertical'
    : variable.endsWith('.length') ? 'Length'
    : variable.endsWith('.radians') ? 'Radians'
    : variable.endsWith('.degrees') ? 'Degrees'
    : variable.endsWith('.value') ? 'RadiansAlias'
    : 'Control';
  const keys = VARIABLE_LABEL_KEYS[kind];
  return value === undefined
    ? t(keys[0], { variable })
    : t(keys[1], { variable, value: Number(value.toFixed(6)) });
}

const VARIABLE_LABEL_KEYS: Record<string, [string, string]> = {
  Horizontal: ['editor.diagramPanels.variableHorizontal', 'editor.diagramPanels.variableHorizontalNow'],
  Vertical: ['editor.diagramPanels.variableVertical', 'editor.diagramPanels.variableVerticalNow'],
  Length: ['editor.diagramPanels.variableLength', 'editor.diagramPanels.variableLengthNow'],
  Radians: ['editor.diagramPanels.variableRadians', 'editor.diagramPanels.variableRadiansNow'],
  Degrees: ['editor.diagramPanels.variableDegrees', 'editor.diagramPanels.variableDegreesNow'],
  RadiansAlias: ['editor.diagramPanels.variableRadiansAlias', 'editor.diagramPanels.variableRadiansAliasNow'],
  Control: ['editor.diagramPanels.variableControl', 'editor.diagramPanels.variableControlNow'],
};

function normalizeSearch(value: string): string {
  return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase();
}

function validationStatusClass(kind: 'empty' | 'error' | 'warning' | 'valid'): string {
  if (kind === 'error') return 'border-granada/25 bg-granada/5 text-granada';
  if (kind === 'warning') return 'border-ocre/25 bg-ocre/5 text-ocre';
  if (kind === 'valid') return 'border-canela/30 bg-canela/10 text-musgo';
  return 'border-carbon/10 bg-carbon/[0.02] text-carbon/45';
}

function compactValidationStatusClass(kind: 'empty' | 'error' | 'warning' | 'valid'): string {
  if (kind === 'error') return 'px-0.5 text-granada';
  if (kind === 'warning') return 'px-0.5 text-ocre';
  if (kind === 'valid') return 'px-0.5 text-musgo';
  return 'px-0.5 text-carbon/45';
}

const EXPRESSION_SHORTCUTS = [
  { display: '+', token: '+', cursorBack: 0 },
  { display: '−', token: '-', cursorBack: 0 },
  { display: '×', token: '*', cursorBack: 0 },
  { display: '÷', token: '/', cursorBack: 0 },
  { display: '^', token: '^', cursorBack: 0 },
  { display: 'sqrt()', token: 'sqrt()', cursorBack: 1 },
  { display: 'sin()', token: 'sin()', cursorBack: 1 },
  { display: 'cos()', token: 'cos()', cursorBack: 1 },
  { display: 'min(, )', token: 'min(, )', cursorBack: 3 },
  { display: 'max(, )', token: 'max(, )', cursorBack: 3 },
  { display: '≈', token: 'approx(, , 0.001)', cursorBack: 10 },
  { display: '=', token: 'eq(, )', cursorBack: 3 },
  { display: '<', token: 'lt(, )', cursorBack: 3 },
  { display: '>', token: 'gt(, )', cursorBack: 3 },
  { display: 'y', token: 'and(, )', cursorBack: 3 },
  { display: 'o', token: 'or(, )', cursorBack: 3 },
] as const;

export const DiagramExpressionField: React.FC<DiagramExpressionFieldProps> = ({
  model,
  label,
  ariaLabel,
  value,
  onChange,
  placeholder,
  optional = false,
  parameter,
  help,
  compact = false,
  error,
}) => {
  const { t } = useI18n();
  const inputRef = useRef<HTMLInputElement>(null);
  const [chosenVariable, setChosenVariable] = useState('');
  const [variableSearch, setVariableSearch] = useState('');
  const variables = useMemo(() => {
    try {
      return expressionVariables(model);
    } catch {
      return {};
    }
  }, [model]);
  const variableGroups = useMemo(() => {
    const searchTerms = normalizeSearch(variableSearch.trim()).split(/\s+/).filter(Boolean);
    const grouped = new Map<string, Array<{ variable: string; label: string }>>();
    const candidates = [
      ...(parameter ? [parameter] : []),
      ...Object.keys(variables).filter(variable => !variable.endsWith('.value')).sort(),
    ];
    candidates.forEach(variable => {
      const root = variable.split('.')[0];
      const item = model.objects.find(candidate => candidate.id === root);
      let group = t('editor.diagramPanels.otherVariables');
      if (variable === parameter) group = t('editor.diagramPanels.curveVariable');
      else if (item) group = `${item.label} — ${item.id}`;
      const label = variableLabel(t, variable, variables[variable]);
      const searchable = normalizeSearch(`${group} ${label}`);
      if (searchTerms.some(term => !searchable.includes(term))) return;
      grouped.set(group, [...(grouped.get(group) ?? []), { variable, label }]);
    });
    return [...grouped.entries()].map(([group, options]) => ({ group, options }));
  }, [model.objects, parameter, t, variableSearch, variables]);
  const availableVariableCount = variableGroups.reduce((total, group) => total + group.options.length, 0);

  const validation = useMemo(() => {
    if (!value.trim()) return optional
      ? { kind: 'empty' as const, message: t('editor.diagramPanels.optionalExpression') }
      : { kind: 'error' as const, message: t('editor.diagramPanels.emptyExpression') };
    try {
      parseMathExpression(value);
      const identifiers = extractMathExpressionIdentifiers(value);
      const unknown = identifiers.filter(identifier => {
        const root = identifier.split('.')[0];
        return !(identifier in variables) && root !== parameter && root !== 'x' && root !== 't';
      });
      if (unknown.length > 0) return { kind: 'warning' as const, message: t('editor.diagramPanels.missingVariable', { variables: unknown.join(', ') }) };
      const result = evaluateMathExpression(value, {
        ...variables,
        ...(parameter ? { [parameter]: 0 } : {}),
        x: 0,
        t: 0,
      });
      return { kind: 'valid' as const, message: t('editor.diagramPanels.validExpression', { value: Number(result.toFixed(6)) }) };
    } catch (error) {
      return {
        kind: 'error' as const,
        message: error instanceof DiagramExpressionError ? error.message : t('editor.diagramPanels.invalidExpression'),
      };
    }
  }, [optional, parameter, t, value, variables]);

  const insert = (token: string, cursorBack = 0) => {
    const input = inputRef.current;
    const start = input?.selectionStart ?? value.length;
    const end = input?.selectionEnd ?? value.length;
    const spacer = start > 0 && !/[\s(,+\-*/^]$/.test(value.slice(0, start)) && !token.startsWith('.') ? ' ' : '';
    const next = `${value.slice(0, start)}${spacer}${token}${value.slice(end)}`;
    onChange(next);
    requestAnimationFrame(() => {
      const cursor = start + spacer.length + token.length - cursorBack;
      inputRef.current?.focus();
      inputRef.current?.setSelectionRange(cursor, cursor);
    });
  };

  const statusClass = validationStatusClass(validation.kind);
  const validationClass = compact
    ? compactValidationStatusClass(validation.kind)
    : `rounded border px-2 py-1 ${statusClass}`;

  return (
    <DiagramFormField
      label={label}
      help={help}
      error={error}
      className="p-0 border-0" // We rely on DiagramFormField's wrapper for errors, but keep it tight
    >
      <div className="space-y-1.5">
        <input
          ref={inputRef}
          aria-label={ariaLabel ?? label}
          aria-describedby={`${ariaLabel ?? label}-expression-status`.replace(/\s+/g, '-').toLowerCase()}
          className={`font-mono ${diagramInputClassName}`}
          value={value}
          onChange={event => onChange(event.target.value)}
          placeholder={placeholder}
          spellCheck={false}
        />
        <p id={`${ariaLabel ?? label}-expression-status`.replace(/\s+/g, '-').toLowerCase()} className={`${validationClass} text-[9px] leading-relaxed break-words`} role="status">
          {validation.message}
        </p>
      {!compact && (
        <details className="border-t border-carbon/10 pt-1">
          <summary className="min-h-9 cursor-pointer py-2 text-[10px] font-bold text-pavo">{t('editor.diagramPanels.expressionHelpTitle')}</summary>
          <div className="space-y-2 pb-1">
          {(variableGroups.length > 0 || variableSearch) && (
            <div className="space-y-1">
              <input
                type="search"
                aria-label={t('editor.diagramPanels.searchVariableFor', { label })}
                className={diagramInputClassName}
                value={variableSearch}
                onChange={event => setVariableSearch(event.target.value)}
                placeholder={t('editor.diagramPanels.variableSearchPlaceholder')}
              />
              <div className="flex gap-1">
                <select aria-label={t('editor.diagramPanels.variableFor', { label })} className={`min-w-0 flex-1 ${diagramInputClassName}`} value={chosenVariable} onChange={event => setChosenVariable(event.target.value)}>
                  <option value="">{availableVariableCount > 0 ? t('editor.diagramPanels.chooseAmongVariables', { count: availableVariableCount }) : t('editor.diagramPanels.noMatches')}</option>
                  {variableGroups.map(group => (
                    <optgroup key={group.group} label={group.group}>
                      {group.options.map(option => <option key={option.variable} value={option.variable}>{option.label}</option>)}
                    </optgroup>
                  ))}
                </select>
                <Button size="sm" disabled={!chosenVariable} onClick={() => insert(chosenVariable)}>{t('editor.diagramPanels.insert')}</Button>
              </div>
              <p className="text-[9px] text-carbon/45">{t('editor.diagramPanels.variablesHint')}</p>
            </div>
          )}
          <div className="flex flex-wrap gap-1" aria-label={t('editor.diagramPanels.shortcutsFor', { label })}>
            {EXPRESSION_SHORTCUTS.map(shortcut => <Button size="sm" className="font-mono" key={shortcut.display} onClick={() => insert(shortcut.token, shortcut.cursorBack)}>{shortcut.display}</Button>)}
          </div>
            <div className="space-y-1 border-t border-carbon/10 pt-2 text-[9px] leading-relaxed text-carbon/55 break-words">
              <p>{renderRichText(t('editor.diagramPanels.exprHelpOperators'), { code: c => <code>{c}</code> })}</p>
              <p>{renderRichText(t('editor.diagramPanels.exprHelpFunctions'), { code: c => <code>{c}</code> })}</p>
              <p>{renderRichText(t('editor.diagramPanels.exprHelpAngles'), { code: c => <code>{c}</code> })}</p>
              <p>{renderRichText(t('editor.diagramPanels.exprHelpConditions'), { code: c => <code>{c}</code> })}</p>
              <p>{t('editor.diagramPanels.expressionSafetyNote')}</p>
            </div>
          </div>
        </details>
      )}
      </div>
    </DiagramFormField>
  );
};

export default DiagramExpressionField;
