import type { BlockType } from '@/fixed-pages/editor/session/parser';
import type { EditorMessageCode } from '@/fixed-pages/editor/types/editorMessage';

/**
 * Everything the block palette can insert. Labels are i18n codes; the inserted
 * source is a starting text in the document's own register (still in Castilian:
 * the author rewrites it), never interface copy.
 */

export type PaletteLabelCode = Extract<EditorMessageCode, `palette.${string}`>;

export type BlockCatalogGroup = 'profile' | 'text' | 'math' | 'exercise' | 'diagram' | 'inline';

export const BLOCK_CATALOG_GROUPS: Record<BlockCatalogGroup, PaletteLabelCode> = {
  profile: 'palette.groupProfile',
  text: 'palette.groupText',
  math: 'palette.groupMath',
  exercise: 'palette.groupExercise',
  diagram: 'palette.groupDiagram',
  inline: 'palette.groupInline',
};

export type BlockCatalogAction =
  | { kind: 'block'; type: BlockType; content: string; metadata?: Record<string, unknown> }
  /** Opens the diagram builder: the page's `Simulation` or a figure inside the text. */
  | { kind: 'diagram' }
  /** Goes into the prose at the caret, or into a new paragraph when no prose is active. */
  | { kind: 'inline'; markup: (selectedText: string) => string };

export interface BlockCatalogEntry {
  id: string;
  group: BlockCatalogGroup;
  label: PaletteLabelCode;
  /** The MDX the entry writes, shown beside the label and matched by the search. */
  syntax: string;
  /** Extra search words, in the three interface languages. */
  keywords?: string;
  action: BlockCatalogAction;
}

const block = (type: BlockType, content: string, metadata?: Record<string, unknown>): BlockCatalogAction => (
  { kind: 'block', type, content, metadata }
);
const component = (name: string, content: string, attributes: Record<string, unknown> = {}): BlockCatalogAction => (
  block('advancedMdx', content, { component: name, ...attributes })
);

const PROOF_STEP = block('demonstration', 'Por hipótesis, se afirma el paso.', { number: 1, title: 'Paso 1' });

const QUESTION_ATTRIBUTES = {
  id: 'q1',
  correct: 'a',
  texto: '¿Qué afirmación es correcta?',
  opciones: [{ value: 'a', texto: 'Respuesta correcta' }, { value: 'b', texto: 'Distractor razonable' }],
};

const GENERAL_ENTRIES: BlockCatalogEntry[] = [
  { id: 'paragraph', group: 'text', label: 'palette.paragraph', syntax: '¶', keywords: 'texto testua text prosa', action: block('paragraph', '') },
  { id: 'heading', group: 'text', label: 'palette.heading', syntax: '###', keywords: 'sección atala section título izenburua', action: block('heading', 'Nueva sección', { level: 3 }) },
  { id: 'subheading', group: 'text', label: 'palette.subheading', syntax: '####', keywords: 'apartado azpiatala subsection', action: block('heading', 'Nuevo apartado', { level: 4 }) },
  { id: 'list', group: 'text', label: 'palette.list', syntax: '-', keywords: 'viñetas zerrenda bullets', action: block('list', 'Primer elemento\nSegundo elemento', { ordered: false }) },
  { id: 'ordered-list', group: 'text', label: 'palette.orderedList', syntax: '1.', keywords: 'numerada zenbakidun numbered', action: block('list', 'Primer elemento\nSegundo elemento', { ordered: true }) },
  { id: 'table', group: 'text', label: 'palette.table', syntax: '| |', keywords: 'taula', action: block('table', '| Magnitud | Valor |\n|---|---|\n| a | $1$ |') },
  { id: 'citation', group: 'text', label: 'palette.citation', syntax: '<Cita>', keywords: 'aipua quote', action: block('citation', 'Texto de la cita.', { author: '' }) },
  { id: 'separator', group: 'text', label: 'palette.separator', syntax: '<Separador />', keywords: 'bereizlea divider', action: block('separator', '') },
  { id: 'note', group: 'text', label: 'palette.note', syntax: '<Nota>', keywords: 'advertencia oharra warning observación', action: block('note', 'Se declara con precisión una advertencia, un caso límite o una aclaración.') },

  { id: 'formula', group: 'math', label: 'palette.formula', syntax: '<Formula>', keywords: 'ecuación latex formula ekuazioa equation', action: block('formula', '$$ x = y $$') },
  { id: 'definition', group: 'math', label: 'palette.definition', syntax: '<Definicion>', keywords: 'definizioa', action: block('definition_box', 'Se define con precisión el objeto matemático.', { title: 'Definición' }) },
  { id: 'statement', group: 'math', label: 'palette.statement', syntax: '<Definicion title>', keywords: 'teorema enunciado teorema theorem statement axioma', action: block('definition_box', 'Sean los objetos indicados. Entonces se cumple la conclusión.', { title: 'Enunciado' }) },
  { id: 'proof-step', group: 'math', label: 'palette.proofStep', syntax: '<ProofStep>', keywords: 'demostración frogapena proof paso pausoa', action: PROOF_STEP },
  { id: 'step-section', group: 'math', label: 'palette.stepSection', syntax: '<StepSection>', keywords: 'paso diagrama pausoa step sección', action: component('StepSection', 'Texto ligado al paso del diagrama.', { step: 'step-1' }) },

  { id: 'exercise', group: 'exercise', label: 'palette.exercise', syntax: '<ExerciseStep>', keywords: 'ariketa ejercicio planteamiento', action: block('exercise', 'Planteamiento del apartado.', { id: 'p1', numero: 1, titulo: 'Planteamiento' }) },
  { id: 'question', group: 'exercise', label: 'palette.question', syntax: '<Pregunta />', keywords: 'galdera question test opciones', action: component('Pregunta', '', QUESTION_ATTRIBUTES) },
  { id: 'gap', group: 'exercise', label: 'palette.gap', syntax: '<Hueco />', keywords: 'hutsunea gap rellenar', action: component('Hueco', '', { id: 'h1', correct: 'respuesta', pista: 'Pista breve.' }) },
  { id: 'solution', group: 'exercise', label: 'palette.solution', syntax: '<Solucion>', keywords: 'soluzioa solution', action: component('Solucion', 'Se desarrolla la solución completa con pasos justificados.', { label: 'Ver solución' }) },
  { id: 'support', group: 'exercise', label: 'palette.support', syntax: '<Apoyo>', keywords: 'pista laguntza hint ayuda', action: component('Apoyo', 'Se recuerda el resultado que hace falta.') },
  { id: 'common-error', group: 'exercise', label: 'palette.commonError', syntax: '<ErrorComun>', keywords: 'errore ohikoa mistake', action: component('ErrorComun', 'Se describe el error y por qué no es válido.') },

  { id: 'diagram', group: 'diagram', label: 'palette.diagram', syntax: 'Simulation', keywords: 'diagrama irudia figura simulación simulation', action: { kind: 'diagram' } },

  {
    id: 'visual-bind', group: 'inline', label: 'palette.visualBind', syntax: '<VisualBind>', keywords: 'resaltar nabarmendu highlight elemento',
    action: { kind: 'inline', markup: text => `<VisualBind element="elemento" color="canela">${text || 'elemento'}</VisualBind>` },
  },
  {
    id: 'inline-formula', group: 'inline', label: 'palette.inlineFormula', syntax: '$…$', keywords: 'latex lerroko inline',
    action: { kind: 'inline', markup: text => `$${text || 'x'}$` },
  },
];

const PROFILE_ENTRIES: Record<string, BlockCatalogEntry[]> = {
  definicion: [
    { id: 'profile-motivation', group: 'profile', label: 'palette.profileMotivation', syntax: '###', action: block('heading', 'Motivación', { level: 3 }) },
    { id: 'profile-formal-definition', group: 'profile', label: 'palette.profileFormalDefinition', syntax: '<Definicion>', action: block('definition_box', 'Se especifican las condiciones necesarias y suficientes.', { title: 'Definición formal' }) },
    { id: 'profile-edge-cases', group: 'profile', label: 'palette.profileEdgeCases', syntax: '<Nota>', action: block('note', 'Se aclara qué ocurre en los casos degenerados o frontera.') },
  ],
  teorema: [
    { id: 'profile-hypotheses', group: 'profile', label: 'palette.profileHypotheses', syntax: '¶', action: block('paragraph', 'Bajo las hipótesis indicadas en el enunciado formal, se consideran los objetos relevantes.') },
    { id: 'profile-conclusion', group: 'profile', label: 'palette.profileConclusion', syntax: '<Formula>', action: block('formula', '$$ \\text{conclusión simbólica} $$') },
    { id: 'profile-linked-proof', group: 'profile', label: 'palette.profileLinkedProof', syntax: '¶', action: block('paragraph', 'La demostración formal se enlaza como página independiente mediante un identificador de demostración en metadatos.') },
  ],
  demostracion: [
    {
      id: 'profile-logical-step', group: 'profile', label: 'palette.profileLogicalStep', syntax: '<ProofStep>',
      action: block('demonstration', 'Por <ConceptLink targetId="concepto" isDependency={true}>resultado previo</ConceptLink>, se escribe la afirmación del paso.', { number: 1, title: 'Paso lógico' }),
    },
  ],
  ejemplo: [
    { id: 'profile-example-data', group: 'profile', label: 'palette.profileExampleData', syntax: '<Definicion>', action: block('definition_box', 'Se fijan los datos y las hipótesis del caso concreto.', { title: 'Datos' }) },
    { id: 'profile-reasoning', group: 'profile', label: 'palette.profileReasoning', syntax: '¶', action: block('paragraph', 'Se aplica el resultado correspondiente y se justifica cada transformación.') },
    { id: 'profile-result', group: 'profile', label: 'palette.profileResult', syntax: '<Formula>', action: block('formula', '$$ x = y $$') },
    { id: 'profile-check', group: 'profile', label: 'palette.profileCheck', syntax: '<Nota>', action: block('note', 'Se comprueba el resultado sin usar la apariencia del diagrama como argumento.') },
  ],
  ejercicio: [
    {
      id: 'profile-interactive-question', group: 'profile', label: 'palette.profileInteractiveQuestion', syntax: '<ExerciseStep>',
      action: block('exercise', `Identifica la relación matemática adecuada.\n\n<Pregunta\n  id="p1_q1"\n  correct="a"\n  texto="¿Qué afirmación es correcta?"\n  opciones={[\n    { value: "a", texto: "Respuesta correcta" },\n    { value: "b", texto: "Distractor razonable" }\n  ]}\n/>\n\n<Resolucion>\n  Se justifica la respuesta paso a paso.\n</Resolucion>`,
        { id: 'p1', numero: 1, titulo: 'Planteamiento', questionIds: ['p1_q1'] }),
    },
  ],
  'caso-de-uso': [
    { id: 'profile-situation', group: 'profile', label: 'palette.profileSituation', syntax: '###', action: block('heading', 'Situación', { level: 3 }) },
    { id: 'profile-model', group: 'profile', label: 'palette.profileModel', syntax: '<Definicion>', action: block('definition_box', 'Se identifica el objeto matemático que modela la situación.', { title: 'Modelo matemático' }) },
    { id: 'profile-calculation', group: 'profile', label: 'palette.profileCalculation', syntax: '<Formula>', action: block('formula', '$$ \\text{cálculo} $$') },
    { id: 'profile-interpretation', group: 'profile', label: 'palette.profileInterpretation', syntax: '<Nota>', action: block('note', 'Se interpreta el resultado y se declaran los límites del modelo.') },
  ],
  matematico: [
    { id: 'profile-contribution', group: 'profile', label: 'palette.profileContribution', syntax: '###', action: block('heading', 'Contribución', { level: 3 }) },
    { id: 'profile-related-concepts', group: 'profile', label: 'palette.profileRelatedConcepts', syntax: '-', action: block('list', '<ConceptLink targetId="concepto" isDependency={false}>concepto relacionado</ConceptLink>', { ordered: false }) },
    { id: 'profile-works', group: 'profile', label: 'palette.profileWorks', syntax: '-', action: block('list', 'Obra o resultado principal', { ordered: false }) },
  ],
  modelo: [
    { id: 'profile-structure', group: 'profile', label: 'palette.profileStructure', syntax: '<Definicion>', action: block('definition_box', 'Se describe el universo y las relaciones que forman el modelo.', { title: 'Estructura concreta' }) },
    { id: 'profile-satisfied-axioms', group: 'profile', label: 'palette.profileSatisfiedAxioms', syntax: '-', action: block('list', '<ConceptLink targetId="axioma" isDependency={false}>axioma verificado</ConceptLink>', { ordered: false }) },
  ],
};

/** The page type's own blocks first, then every general block. */
export function blockCatalog(pageType: string): BlockCatalogEntry[] {
  return [...(PROFILE_ENTRIES[pageType] ?? []), ...GENERAL_ENTRIES];
}

export function normalizeSearch(value: string): string {
  return value.normalize('NFD').replace(/[̀-ͯ]/g, '').toLocaleLowerCase('es').trim();
}

/**
 * Entries whose label, syntax or keywords contain every word of the query,
 * accents ignored; entries whose label starts with the query come first.
 */
export function filterBlockCatalog(
  entries: BlockCatalogEntry[],
  query: string,
  label: (entry: BlockCatalogEntry) => string,
): BlockCatalogEntry[] {
  const words = normalizeSearch(query).split(/\s+/).filter(Boolean);
  if (words.length === 0) return entries;
  const matches = entries.filter(entry => {
    const haystack = normalizeSearch(`${label(entry)} ${entry.syntax} ${entry.keywords ?? ''} ${entry.id}`);
    return words.every(word => haystack.includes(word));
  });
  const head = words.join(' ');
  return [
    ...matches.filter(entry => normalizeSearch(label(entry)).startsWith(head)),
    ...matches.filter(entry => !normalizeSearch(label(entry)).startsWith(head)),
  ];
}
