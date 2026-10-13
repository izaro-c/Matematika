/** Helpers to detect and extract logical justifications in proof-step bodies. */

const JUSTIFICATION_KEYWORDS = [
  'hipótesis', 'hipotesis', 'axioma', 'teorema', 'definición', 'definicion',
  'lema', 'corolario', 'paso', 'regla', 'propiedad', 'ley', 'principio',
  'construcción', 'construccion', 'modus ponens', 'modus tollens',
  'simplificación', 'simplificacion', 'adición', 'adicion', 'resolución',
  'resolucion', 'sustitución', 'sustitucion', 'distributiva', 'conmutativa',
  'asociativa', 'transitividad',
];

export function bodyHasLogicalJustification(body: string): boolean {
  if (/<(?:ConceptLink|RefLink|ProofStepLink)\b/i.test(body)) return true;
  const lower = body.toLowerCase();
  return JUSTIFICATION_KEYWORDS.some(kw => lower.includes(kw));
}

export function extractJustificationIdsFromBody(body: string): string[] {
  const ids: string[] = [];
  const re = /<(?:ConceptLink|RefLink)\b([^>]*)>/gi;
  let m: RegExpExecArray | null;
  while ((m = re.exec(body)) !== null) {
    const idMatch = m[1].match(/targetId=\{?\s*(?:["']([^"']+)["']|\[([^\]]+)\])/);
    if (idMatch?.[1]) ids.push(idMatch[1]);
    else if (idMatch?.[2]) {
      for (const part of idMatch[2].match(/["']([^"']+)["']/g) ?? []) {
        ids.push(part.replace(/['"]/g, ''));
      }
    }
  }

  const stepRe = /<ProofStepLink\b[^>]*\bstep=\{?(\d+)\}?[^>]*>/gi;
  while ((m = stepRe.exec(body)) !== null) {
    if (m[1]) ids.push(`paso-${m[1]}`);
  }

  return [...new Set(ids)];
}
