import React, { useMemo, useRef, useState } from 'react';
import {
  DiagramExpressionError,
  evaluateMathExpression,
  expressionVariables,
  extractMathExpressionIdentifiers,
  parseMathExpression,
} from '@/shared/diagrams/public';
import type { VisualDiagramModel } from '../model/types';

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
}

function variableLabel(variable: string, value?: number): string {
  const currentValue = value === undefined ? '' : ` · ahora ${Number(value.toFixed(6))}`;
  if (variable.endsWith('.x')) return `${variable} · coordenada horizontal${currentValue}`;
  if (variable.endsWith('.y')) return `${variable} · coordenada vertical${currentValue}`;
  if (variable.endsWith('.length')) return `${variable} · longitud${currentValue}`;
  if (variable.endsWith('.radians')) return `${variable} · medida angular en radianes${currentValue}`;
  if (variable.endsWith('.degrees')) return `${variable} · medida angular en grados${currentValue}`;
  if (variable.endsWith('.value')) return `${variable} · medida angular en radianes (alias compatible)${currentValue}`;
  return `${variable} · valor del control${currentValue}`;
}

function normalizeSearch(value: string): string {
  return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase();
}

function validationStatusClass(kind: 'empty' | 'error' | 'warning' | 'valid'): string {
  if (kind === 'error') return 'border-granada/25 bg-granada/5 text-granada';
  if (kind === 'warning') return 'border-ocre/25 bg-ocre/5 text-ocre';
  if (kind === 'valid') return 'border-salvia/30 bg-salvia/10 text-musgo';
  return 'border-carbon/10 bg-carbon/[0.02] text-carbon/45';
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
}) => {
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
    const sceneItems = [...model.points, ...model.elements, ...model.sliders];
    const searchTerms = normalizeSearch(variableSearch.trim()).split(/\s+/).filter(Boolean);
    const grouped = new Map<string, Array<{ variable: string; label: string }>>();
    const candidates = [
      ...(parameter ? [parameter] : []),
      ...Object.keys(variables).filter(variable => !variable.endsWith('.value')).sort(),
    ];
    candidates.forEach(variable => {
      const root = variable.split('.')[0];
      const item = sceneItems.find(candidate => candidate.id === root);
      let group = 'Otras variables';
      if (variable === parameter) group = 'Variable de la curva';
      else if (item) group = `${item.label} — ${item.id}`;
      const label = variableLabel(variable, variables[variable]);
      const searchable = normalizeSearch(`${group} ${label}`);
      if (searchTerms.some(term => !searchable.includes(term))) return;
      grouped.set(group, [...(grouped.get(group) ?? []), { variable, label }]);
    });
    return [...grouped.entries()].map(([group, options]) => ({ group, options }));
  }, [model.elements, model.points, model.sliders, parameter, variableSearch, variables]);
  const availableVariableCount = variableGroups.reduce((total, group) => total + group.options.length, 0);

  const validation = useMemo(() => {
    if (!value.trim()) return optional
      ? { kind: 'empty' as const, message: 'Opcional: se usará el valor fijo o el comportamiento automático.' }
      : { kind: 'error' as const, message: 'La expresión no puede estar vacía.' };
    try {
      parseMathExpression(value);
      const identifiers = extractMathExpressionIdentifiers(value);
      const unknown = identifiers.filter(identifier => {
        const root = identifier.split('.')[0];
        return !(identifier in variables) && root !== parameter && root !== 'x' && root !== 't';
      });
      if (unknown.length > 0) return { kind: 'warning' as const, message: `Falta una variable disponible: ${unknown.join(', ')}.` };
      const result = evaluateMathExpression(value, {
        ...variables,
        ...(parameter ? { [parameter]: 0 } : {}),
        x: 0,
        t: 0,
      });
      return { kind: 'valid' as const, message: `Expresión válida · valor de prueba ${Number(result.toFixed(6))}` };
    } catch (error) {
      return {
        kind: 'error' as const,
        message: error instanceof DiagramExpressionError ? error.message : 'Expresión matemática no válida.',
      };
    }
  }, [optional, parameter, value, variables]);

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

  return (
    <div className={compact ? 'space-y-1' : 'space-y-2 rounded border border-pavo/20 bg-pavo/5 p-2'}>
      <label className="block text-xs font-bold text-carbon">
        {label}
        <input
          ref={inputRef}
          aria-label={ariaLabel ?? label}
          aria-describedby={`${ariaLabel ?? label}-expression-status`.replace(/\s+/g, '-').toLowerCase()}
          className="mt-1 w-full rounded border border-carbon/15 bg-lienzo p-1.5 font-mono text-xs"
          value={value}
          onChange={event => onChange(event.target.value)}
          placeholder={placeholder}
          spellCheck={false}
        />
      </label>
      <p id={`${ariaLabel ?? label}-expression-status`.replace(/\s+/g, '-').toLowerCase()} className={`rounded border px-2 py-1 text-[9px] leading-relaxed break-words ${statusClass}`} role="status">
        {validation.message}
      </p>
      {!compact && (
        <>
          {(variableGroups.length > 0 || variableSearch) && (
            <div className="space-y-1 rounded border border-pavo/15 bg-lienzo/60 p-1.5">
              <input
                type="search"
                aria-label={`Buscar variable para ${label}`}
                className="w-full rounded border border-carbon/15 bg-lienzo p-1 text-[10px]"
                value={variableSearch}
                onChange={event => setVariableSearch(event.target.value)}
                placeholder="Buscar por objeto, ID o magnitud…"
              />
              <div className="flex gap-1">
                <select aria-label={`Variable para ${label}`} className="min-w-0 flex-1 w-full rounded border border-carbon/15 bg-lienzo p-1 text-[10px]" value={chosenVariable} onChange={event => setChosenVariable(event.target.value)}>
                  <option value="">{availableVariableCount > 0 ? `Elegir entre ${availableVariableCount} variables…` : 'No hay coincidencias'}</option>
                  {variableGroups.map(group => (
                    <optgroup key={group.group} label={group.group}>
                      {group.options.map(option => <option key={option.variable} value={option.variable}>{option.label}</option>)}
                    </optgroup>
                  ))}
                </select>
                <button type="button" disabled={!chosenVariable} className="rounded border border-pavo/25 bg-lienzo px-2 text-[10px] font-bold text-pavo disabled:opacity-35" onClick={() => insert(chosenVariable)}>Insertar</button>
              </div>
              <p className="text-[9px] text-carbon/45">Las variables están agrupadas por objeto y muestran su valor actual.</p>
            </div>
          )}
          <div className="flex flex-wrap gap-1" aria-label={`Atajos para ${label}`}>
            {EXPRESSION_SHORTCUTS.map(shortcut => <button key={shortcut.display} type="button" className="rounded border border-carbon/15 bg-lienzo px-1.5 py-0.5 font-mono text-[9px] text-carbon/65 hover:bg-carbon/5" onClick={() => insert(shortcut.token, shortcut.cursorBack)}>{shortcut.display}</button>)}
          </div>
          <details className="rounded border border-carbon/10 bg-lienzo px-2 py-1.5">
            <summary className="cursor-pointer text-[10px] font-bold text-carbon/65">Qué se puede escribir y cómo</summary>
            <div className="mt-1 space-y-1 text-[9px] leading-relaxed text-carbon/55 break-words">
              {help && <p>{help}</p>}
              <p>Se admiten números, paréntesis y los operadores <code>+ − * / ^</code>. Las constantes son <code>pi</code> y <code>e</code>.</p>
              <p>Funciones: <code>sin</code>, <code>cos</code>, <code>tan</code>, <code>sqrt</code>, <code>abs</code>, <code>min</code>, <code>max</code>, <code>round</code>, <code>hypot</code> y logaritmos <code>ln</code>/<code>log</code>.</p>
              <p>Los ángulos ofrecen <code>id.radians</code> e <code>id.degrees</code>, tanto si son orientados como no reflejos.</p>
              <p>Las condiciones usan <code>lt(a,b)</code>, <code>lte</code>, <code>gt</code>, <code>gte</code>, <code>eq(a,b,…)</code>, <code>approx(a,b,tolerancia)</code>, <code>and</code>, <code>or</code> y <code>not</code>; producen 1 si se cumplen y 0 si no.</p>
              <p>No se ejecuta JavaScript: no se admiten asignaciones, llamadas arbitrarias ni acceso fuera de las variables enumeradas.</p>
            </div>
          </details>
        </>
      )}
    </div>
  );
};

interface DiagramFormulaFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export const DiagramFormulaField: React.FC<DiagramFormulaFieldProps> = ({ label, value, onChange, placeholder }) => (
  <div className="space-y-2 rounded border border-ocre/20 bg-ocre/5 p-2">
    <label className="block text-xs font-bold text-carbon">
      {label}
      <input className="mt-1 w-full rounded border border-carbon/15 bg-lienzo p-1.5 font-mono text-xs" value={value} onChange={event => onChange(event.target.value)} placeholder={placeholder} spellCheck={false} />
    </label>
    <details className="rounded border border-carbon/10 bg-lienzo px-2 py-1.5">
      <summary className="cursor-pointer text-[10px] font-bold text-carbon/65">Cómo escribir la fórmula visible</summary>
      <div className="mt-1 space-y-1 text-[9px] leading-relaxed text-carbon/55">
        <p>Se usa sintaxis KaTeX: <code>x^2</code> crea un exponente, <code>\frac{'{a}'}{'{b}'}</code> una fracción y <code>\sqrt{'{x}'}</code> una raíz.</p>
        <p>Puede insertar valores reactivos con <code>{'{value}'}</code>, <code>{'{pA.x}'}</code>, <code>{'{pA.y}'}</code> o <code>{'{segAB.length}'}</code>. La fórmula matemática segura que calcula <code>{'{value}'}</code> se edita justo debajo.</p>
      </div>
    </details>
  </div>
);

export default DiagramExpressionField;
