import { evaluateMathExpression } from './expressions';
import type { DiagramColorToken, DiagramInfoPanelBlock, DiagramInfoPanelRule } from './types';

export interface ResolvedInfoPanelBlock {
  id: string;
  title?: string;
  text: string;
  color?: DiagramColorToken;
  matchedRuleIndex: number | null;
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
  const suffix = unit ? ` ${unit}` : '';
  const template = rule?.text ?? block.text;
  const text = template.replace(/\{([^{}]+)\}/g, (original, source: string) => {
    const candidate = source === 'value' ? expression : source;
    if (!candidate) return source === 'value' ? 'valor no definido' : original;
    try {
      return `${evaluateMathExpression(candidate, variables).toFixed(precision)}${suffix}`;
    } catch {
      return source === 'value' ? 'valor no definido' : original;
    }
  });
  const color = rule?.color ?? block.color;
  return { id: block.id, title: block.title, text, color, matchedRuleIndex: matched?.index ?? null };
}

