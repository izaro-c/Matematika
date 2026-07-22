import {
  evaluateMathExpression,
  extractMathExpressionIdentifiers,
  renameMathExpressionIdentifier,
} from './expressions';
import type { DiagramColorToken, DiagramInfoPanelBlock, DiagramInfoPanelRule } from './types';

export interface ResolvedInfoPanelBlock {
  id: string;
  title?: string;
  text: string;
  color?: DiagramColorToken;
  matchedRuleIndex: number | null;
}

export interface DiagramTemplateExpression {
  /** Texto matemático seguro que se evalúa; nunca JavaScript. */
  expression: string;
  /** Número de decimales local. Si falta, se usa el de la anotación. */
  precision?: number;
  /** Unidad local. Si falta, se usa la de la anotación. */
  unit?: string;
  /** Token completo, útil para diagnósticos y edición sin pérdidas. */
  token: string;
  start: number;
  end: number;
  legacyValue: boolean;
}

export interface DiagramTemplateDefaults {
  expression?: string;
  precision?: number;
  unit?: string;
  undefinedValue?: string;
}

const TEMPLATE_TOKEN = /\{([^{}]+)\}/g;

function unquote(value: string): string {
  const trimmed = value.trim();
  if ((trimmed.startsWith('"') && trimmed.endsWith('"')) || (trimmed.startsWith("'") && trimmed.endsWith("'"))) {
    return trimmed.slice(1, -1);
  }
  return trimmed;
}

/**
 * Extrae cálculos de una plantilla. La sintaxis nueva empieza por `=` para no
 * confundir llaves de KaTeX (`\\frac{1}{2}`) con valores reactivos. Se siguen
 * leyendo `{value}` y `{objeto.magnitud}` de DiagramSpec v2.
 */
export function diagramTemplateExpressions(
  template: string,
  legacyExpression?: string,
): DiagramTemplateExpression[] {
  const entries: DiagramTemplateExpression[] = [];
  for (const match of template.matchAll(TEMPLATE_TOKEN)) {
    const token = match[0];
    const body = match[1].trim();
    const start = match.index ?? 0;
    if (body === 'value') {
      if (legacyExpression) entries.push({ expression: legacyExpression, token, start, end: start + token.length, legacyValue: true });
      continue;
    }
    if (!body.startsWith('=') && !body.includes('.')) continue;
    const parts = (body.startsWith('=') ? body.slice(1) : body).split('|').map(part => part.trim());
    const expression = parts.shift() ?? '';
    if (!expression) continue;
    let precision: number | undefined;
    let unit: string | undefined;
    parts.forEach(option => {
      const separator = option.indexOf(':');
      if (separator < 0) return;
      const name = option.slice(0, separator).trim().toLocaleLowerCase();
      const value = option.slice(separator + 1).trim();
      if (name === 'precision' || name === 'decimals' || name === 'decimales') {
        const parsed = Number(value);
        if (Number.isInteger(parsed) && parsed >= 0 && parsed <= 12) precision = parsed;
      }
      if (name === 'unit' || name === 'unidad') unit = unquote(value);
    });
    entries.push({ expression, precision, unit, token, start, end: start + token.length, legacyValue: false });
  }
  return entries;
}

export function diagramTemplateIdentifiers(template: string, legacyExpression?: string): string[] {
  const identifiers = new Set<string>();
  diagramTemplateExpressions(template, legacyExpression).forEach(entry => {
    try { extractMathExpressionIdentifiers(entry.expression).forEach(identifier => identifiers.add(identifier)); }
    catch { /* El schema o el editor muestran el error en su contexto. */ }
  });
  return [...identifiers];
}

export function interpolateDiagramTemplate(
  template: string,
  variables: Readonly<Record<string, number>>,
  defaults: DiagramTemplateDefaults = {},
): string {
  const byStart = new Map(diagramTemplateExpressions(template, defaults.expression).map(entry => [entry.start, entry]));
  return template.replace(TEMPLATE_TOKEN, (token, _body: string, offset: number) => {
    const entry = byStart.get(offset);
    if (!entry) return token;
    try {
      const value = evaluateMathExpression(entry.expression, variables);
      const precision = entry.precision ?? defaults.precision ?? 2;
      const unit = entry.unit ?? defaults.unit;
      const suffix = unit ? ` ${unit}` : '';
      return `${value.toFixed(precision)}${suffix}`;
    } catch {
      return entry.legacyValue ? (defaults.undefinedValue ?? 'valor no definido') : token;
    }
  });
}

export function renameDiagramTemplateIdentifiers(template: string, oldId: string, newId: string): string {
  const entries = diagramTemplateExpressions(template);
  if (entries.length === 0) return template;
  let result = template;
  [...entries].reverse().forEach(entry => {
    let renamed: string;
    try { renamed = renameMathExpressionIdentifier(entry.expression, oldId, newId); }
    catch { return; }
    const originalBody = entry.token.slice(1, -1);
    const expressionOffset = originalBody.indexOf(entry.expression);
    if (expressionOffset < 0) return;
    const nextBody = `${originalBody.slice(0, expressionOffset)}${renamed}${originalBody.slice(expressionOffset + entry.expression.length)}`;
    result = `${result.slice(0, entry.start)}{${nextBody}}${result.slice(entry.end)}`;
  });
  return result;
}

function firstMatchingRule(
  rules: readonly DiagramInfoPanelRule[] | undefined,
  variables: Readonly<Record<string, number>>,
): { rule: DiagramInfoPanelRule; index: number } | undefined {
  if (!rules) return undefined;
  for (let index = 0; index < rules.length; index += 1) {
    try {
      if (evaluateMathExpression(rules[index].when, variables) !== 0) return { rule: rules[index], index };
    } catch {
      // Una variante no evaluable no debe ocultar las siguientes ni el contenido base.
    }
  }
  return undefined;
}

/**
 * Resuelve un bloque compuesto sin depender de JSXGraph. El mismo resultado se
 * usa en publicación, preview y pruebas para evitar clasificaciones divergentes.
 */
export function resolveInfoPanelBlock(
  block: DiagramInfoPanelBlock,
  variables: Readonly<Record<string, number>>,
): ResolvedInfoPanelBlock {
  const matched = firstMatchingRule(block.rules, variables);
  const rule = matched?.rule;
  const expression = rule?.expression ?? block.expression;
  const precision = rule?.precision ?? block.precision ?? 2;
  const unit = rule?.unit ?? block.unit;
  const template = rule?.text ?? block.text;
  const text = interpolateDiagramTemplate(template, variables, { expression, precision, unit });
  const color = rule?.color ?? block.color;
  return { id: block.id, title: block.title, text, color, matchedRuleIndex: matched?.index ?? null };
}
