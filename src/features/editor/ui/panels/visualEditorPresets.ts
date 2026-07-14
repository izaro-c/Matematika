import type { BlockType } from '../../core/parser';

export const LATEX_SYMBOLS = [
  { label: '∀', code: '\\forall ' }, { label: '∃', code: '\\exists ' },
  { label: '⟹', code: '\\implies ' }, { label: '∈', code: '\\in ' },
  { label: '≅', code: '\\cong ' }, { label: 'AB', code: '\\overline{AB}' },
  { label: '∠', code: '\\angle ' }, { label: '△', code: '\\triangle ' },
  { label: '⊥', code: '\\perp ' }, { label: '∥', code: '\\parallel ' },
];

export interface BlockPreset {
  label: string;
  type: BlockType;
  content: string;
  metadata?: Record<string, unknown>;
  group?: 'general' | 'profile';
}

export const GENERAL_BLOCK_PRESETS: BlockPreset[] = [
  { label: 'Párrafo', type: 'paragraph', content: '' },
  { label: 'Título', type: 'heading', content: 'Nueva sección', metadata: { level: 3 } },
  { label: 'Lista', type: 'list', content: 'Primer elemento\nSegundo elemento', metadata: { ordered: false } },
  { label: 'Tabla', type: 'table', content: '| Magnitud | Valor |\n|---|---|\n| a | $1$ |' },
  { label: 'Fórmula', type: 'formula', content: '$$ x = y $$' },
  { label: 'Definición', type: 'definition_box', content: 'Se define con precisión el objeto matemático.', metadata: { title: 'Definición' } },
  { label: 'Advertencia / nota', type: 'note', content: 'Se declara con precisión una advertencia, un caso límite o una aclaración.' },
  { label: 'Cita', type: 'citation', content: 'Texto de la cita.', metadata: { author: '' } },
  { label: 'Separador', type: 'separator', content: '' },
  { label: 'Demostración', type: 'demonstration', content: '', metadata: { steps: [] } },
];

export const PAGE_PROFILE_PRESETS: Record<string, BlockPreset[]> = {
  definicion: [
    { label: 'Motivación', type: 'heading', content: 'Motivación', metadata: { level: 3 }, group: 'profile' },
    { label: 'Definición formal', type: 'definition_box', content: 'Se especifican las condiciones necesarias y suficientes.', metadata: { title: 'Definición formal' }, group: 'profile' },
    { label: 'Casos límite', type: 'note', content: 'Se aclara qué ocurre en los casos degenerados o frontera.', group: 'profile' },
  ],
  teorema: [
    { label: 'Hipótesis', type: 'paragraph', content: 'Bajo las hipótesis indicadas en el enunciado formal, se consideran los objetos relevantes.', group: 'profile' },
    { label: 'Conclusión', type: 'formula', content: '$$ \\text{conclusión simbólica} $$', group: 'profile' },
    { label: 'Demostración asociada', type: 'paragraph', content: 'La demostración formal se enlaza como página independiente mediante un identificador de demostración en metadatos.', group: 'profile' },
  ],
  demostracion: [
    { label: 'Paso lógico', type: 'demonstration', content: '', metadata: { steps: [{ number: 1, title: 'Paso lógico', justificacion: 'Por hipótesis o por resultado previo especificado.', target: '', body: 'Se escribe la afirmación del paso con sus enlaces semánticos e interactivos.' }] }, group: 'profile' },
  ],
  ejemplo: [
    { label: 'Datos del ejemplo', type: 'definition_box', content: 'Se fijan los datos y las hipótesis del caso concreto.', metadata: { title: 'Datos' }, group: 'profile' },
    { label: 'Desarrollo razonado', type: 'paragraph', content: 'Se aplica el resultado correspondiente y se justifica cada transformación.', group: 'profile' },
    { label: 'Resultado', type: 'formula', content: '$$ x = y $$', group: 'profile' },
    { label: 'Comprobación', type: 'note', content: 'Se comprueba el resultado sin usar la apariencia del diagrama como argumento.', group: 'profile' },
  ],
  ejercicio: [
    {
      label: 'Pregunta interactiva',
      type: 'exercise',
      content: `Identifica la relación matemática adecuada.\n\n<Pregunta\n  id="p1_q1"\n  correct="a"\n  texto="¿Qué afirmación es correcta?"\n  opciones={[\n    { value: "a", texto: "Respuesta correcta" },\n    { value: "b", texto: "Distractor razonable" }\n  ]}\n/>\n\n<Resolucion>\n  Se justifica la respuesta paso a paso.\n</Resolucion>`,
      metadata: { component: 'PasoEjercicio', id: 'p1', numero: 1, titulo: 'Planteamiento', questionIds: ['p1_q1'] },
      group: 'profile',
    },
    { label: 'Hueco', type: 'advancedMdx', content: '', metadata: { component: 'Hueco', id: 'q1', correct: 'respuesta', pista: 'Pista breve.' }, group: 'profile' },
    { label: 'Solución revelable', type: 'advancedMdx', content: 'Se desarrolla la solución completa con pasos justificados.', metadata: { component: 'Solucion', label: 'Ver solución' }, group: 'profile' },
  ],
  'caso-de-uso': [
    { label: 'Situación', type: 'heading', content: 'Situación', metadata: { level: 3 }, group: 'profile' },
    { label: 'Modelo matemático', type: 'definition_box', content: 'Se identifica el objeto matemático que modela la situación.', metadata: { title: 'Modelo matemático' }, group: 'profile' },
    { label: 'Cálculo', type: 'formula', content: '$$ \\text{cálculo} $$', group: 'profile' },
    { label: 'Interpretación', type: 'note', content: 'Se interpreta el resultado y se declaran los límites del modelo.', group: 'profile' },
  ],
  matematico: [
    { label: 'Contribución', type: 'heading', content: 'Contribución', metadata: { level: 3 }, group: 'profile' },
    { label: 'Conceptos asociados', type: 'list', content: '<ConceptLink targetId="concepto" isDependency={false}>concepto relacionado</ConceptLink>', metadata: { ordered: false }, group: 'profile' },
    { label: 'Obra', type: 'list', content: 'Obra o resultado principal', metadata: { ordered: false }, group: 'profile' },
  ],
  modelo: [
    { label: 'Estructura concreta', type: 'definition_box', content: 'Se describe el universo y las relaciones que forman el modelo.', metadata: { title: 'Estructura concreta' }, group: 'profile' },
    { label: 'Axiomas satisfechos', type: 'list', content: '<ConceptLink targetId="axioma" isDependency={false}>axioma verificado</ConceptLink>', metadata: { ordered: false }, group: 'profile' },
  ],
};

export const INLINE_EDITABLE_BLOCKS = new Set<BlockType>([
  'paragraph', 'heading', 'list', 'table', 'note', 'citation', 'definition_box', 'exercise',
]);
