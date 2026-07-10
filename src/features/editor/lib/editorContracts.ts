export const ARTS_AND_CRAFTS_COLORS = [
  'lienzo',
  'carbon',
  'salvia',
  'terracota',
  'pizarra',
  'ocre',
  'pavo',
  'granada',
  'musgo',
] as const;

export type ArtsAndCraftsColor = (typeof ARTS_AND_CRAFTS_COLORS)[number];

export const EDITOR_THEME_COLOR_OPTIONS = [
  { value: 'terracota', label: 'Terracota (Teoremas, Default)' },
  { value: 'salvia', label: 'Salvia (Lógica, Análisis)' },
  { value: 'ocre', label: 'Ocre (Corolarios, Especial)' },
  { value: 'carbon', label: 'Carbón (Definiciones)' },
  { value: 'pizarra', label: 'Pizarra (Auxiliar)' },
] as const satisfies ReadonlyArray<{ value: ArtsAndCraftsColor; label: string }>;

export const EDITOR_REFERENCE_COLORS = [
  'carbon',
  'salvia',
  'terracota',
  'ocre',
  'pizarra',
] as const satisfies ReadonlyArray<ArtsAndCraftsColor>;

export interface WizardData {
  type: string;
  id: string;
  title: string;
  description: string;
  era: string;
  birth: string;
  death: string;
  color: string;
  authors: string;
  tags: string;
  corollaries: string;
  demos: string;
  parentTheorem: string;
  proofMethod: string;
  lemmas: string;
  satisfies: string;
  axioms_verified: string;
  hasDiagram: boolean;
}

export interface FileNode {
  path: string;
  name: string;
  type: string;
}

const BLOCK_SNIPPETS: Readonly<Record<string, string>> = {
  'caja-formula': `\n<Formula>\n  $$ x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a} $$\n</Formula>\n`,
  'caja-nota': `\n<Nota>\n  Añade aquí una aclaración histórica o curiosidad.\n</Nota>\n`,
  'caja-demostracion': `\n<Demostracion>\n  Escribe aquí los pasos de la demostración lógica.\n</Demostracion>\n`,
  'medieval-step': `\n<ProofStep number={1} title="Título del Paso" justificacion="Especificar justificación lógica" />\n`,
  'caja-definicion': `\n<Definicion title="Nueva Definición">\n  Explica el concepto formalmente aquí.\n</Definicion>\n`,
  'caja-corolario': `\n<Corolario>\n  Consecuencia directa del teorema anterior.\n</Corolario>\n`,
  cita: `\n<Cita author="Pitágoras">\n  Todo es número.\n</Cita>\n`,
  separador: `\n<Separador />\n`,
  capitular: `\n<Capitular letra="E" />n un lugar de la Mancha...\n`,
  lista: `\n- Elemento 1\n- Elemento 2\n- Elemento 3\n`,
};

const LATEX_SNIPPETS: Readonly<Record<string, string>> = {
  frac: '\\frac{numerador}{denominador}',
  sqrt: '\\sqrt{x}',
  int: '\\int_{a}^{b} x \\, dx',
  sum: '\\sum_{i=1}^{n} i',
  lim: '\\lim_{x \\to \\infty} f(x)',
  alpha: '\\alpha',
  beta: '\\beta',
  gamma: '\\gamma',
  theta: '\\theta',
  pi: '\\pi',
};

function escapeAttribute(value: string): string {
  return value.replace(/&/g, '&amp;').replace(/"/g, '&quot;');
}

export function normalizeContentId(value: string): string {
  return value
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/['’]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-/, '')
    .replace(/-$/, '');
}

export function isArtsAndCraftsColor(value: string): value is ArtsAndCraftsColor {
  return ARTS_AND_CRAFTS_COLORS.some(color => color === value);
}

export function normalizeEditorColor(
  value: string,
  fallback: ArtsAndCraftsColor,
): ArtsAndCraftsColor {
  return isArtsAndCraftsColor(value) ? value : fallback;
}

export function buildConceptLink(targetId: string, text: string): string {
  const normalizedTarget = normalizeContentId(targetId);
  const linkText = text || normalizedTarget;
  return `<ConceptLink targetId="${escapeAttribute(normalizedTarget)}" isDependency={false}>${linkText}</ConceptLink>`;
}

export function buildInteractiveReference(target: string, color: string, text: string): string {
  const safeColor = normalizeEditorColor(color, 'salvia');
  return `<InteractiveElement target="${escapeAttribute(target)}" color="${safeColor}">${text}</InteractiveElement>`;
}

export function getBlockSnippet(type: string): string | undefined {
  return BLOCK_SNIPPETS[type];
}

export function getLatexSnippet(type: string): string | undefined {
  return LATEX_SNIPPETS[type];
}

export function ensureProofStepJustifications(body: string): string {
  return body.replace(/<ProofStep\b[^>]*>/g, tag => {
    if (tag.includes('justificacion=')) {
      return tag;
    }

    const tagStart = tag.slice(0, -1).trimEnd();
    const selfClosing = tagStart.endsWith('/');
    const attributes = selfClosing ? tagStart.slice(0, -1).trimEnd() : tagStart;
    return `${attributes} justificacion="Especificar justificación lógica"${selfClosing ? ' />' : '>'}`;
  });
}

function normalizeCsvIds(value: string): string {
  return value
    .split(',')
    .map(item => normalizeContentId(item))
    .filter(Boolean)
    .join(', ');
}

export function normalizeWizardData(data: WizardData): WizardData {
  return {
    ...data,
    id: normalizeContentId(data.id),
    color: normalizeEditorColor(data.color, 'terracota'),
    authors: normalizeCsvIds(data.authors),
    corollaries: normalizeCsvIds(data.corollaries),
    demos: normalizeCsvIds(data.demos),
    parentTheorem: normalizeContentId(data.parentTheorem),
    lemmas: normalizeCsvIds(data.lemmas),
    satisfies: normalizeContentId(data.satisfies),
    axioms_verified: normalizeCsvIds(data.axioms_verified),
  };
}

export interface DiagramWizardData {
  templateType: 'triangulo-deformable' | 'eje-coordenadas' | 'circulo-unitario';
  id: string;
  category: string;
  color: ArtsAndCraftsColor;
  variable: string;
  labelA: string;
  labelB: string;
  labelC: string;
}

export function normalizeDiagramWizardData(data: DiagramWizardData): DiagramWizardData {
  return {
    ...data,
    id: normalizeContentId(data.id),
    category: data.category ? data.category.trim() : 'Geometria',
    color: normalizeEditorColor(data.color, 'terracota'),
    variable: data.variable ? normalizeContentId(data.variable) : '',
    labelA: data.labelA || 'A',
    labelB: data.labelB || 'B',
    labelC: data.labelC || 'C',
  };
}
