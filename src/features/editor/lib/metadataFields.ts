import { EDITOR_THEME_COLOR_OPTIONS } from './editorContracts';

export type MetadataFieldType = 'text' | 'textarea' | 'select' | 'array' | 'boolean';

export interface MetadataFieldConfig {
  key: string;
  label: string;
  type: MetadataFieldType;
  required?: boolean;
  readonly?: boolean;
  options?: Array<{ value: string; label: string }>;
  placeholder?: string;
}

export const CONTENT_TYPE_OPTIONS = [
  { value: 'definicion', label: 'Definición' },
  { value: 'teorema', label: 'Teorema' },
  { value: 'lema', label: 'Lema' },
  { value: 'corolario', label: 'Corolario' },
  { value: 'demostracion', label: 'Demostración' },
  { value: 'axioma', label: 'Axioma' },
  { value: 'sistema-axiomatico', label: 'Sistema axiomático' },
  { value: 'modelo', label: 'Modelo' },
  { value: 'ejemplo', label: 'Ejemplo' },
  { value: 'ejercicio', label: 'Ejercicio' },
  { value: 'caso-de-uso', label: 'Caso de uso' },
  { value: 'leccion', label: 'Lección' },
  { value: 'plan-de-estudio', label: 'Plan de estudio' },
  { value: 'matematico', label: 'Matemático' },
] as const;

const difficultyOptions = [
  { value: 'básico', label: 'Básico' },
  { value: 'intermedio', label: 'Intermedio' },
  { value: 'avanzado', label: 'Avanzado' },
];

const proofMethodOptions = [
  { value: 'directo', label: 'Directo' },
  { value: 'contradiccion', label: 'Contradicción' },
  { value: 'induccion', label: 'Inducción' },
  { value: 'contraposicion', label: 'Contraposición' },
  { value: 'constructivo', label: 'Constructivo' },
  { value: 'geometrico', label: 'Geométrico' },
  { value: 'exhaustivo', label: 'Exhaustivo' },
];

const common: MetadataFieldConfig[] = [
  { key: 'id', label: 'ID', type: 'text', required: true, placeholder: 'teorema-pitagoras' },
  { key: 'type', label: 'Tipo', type: 'select', required: true, options: [...CONTENT_TYPE_OPTIONS] },
  { key: 'title', label: 'Título', type: 'text', required: true },
  { key: 'description', label: 'Descripción', type: 'textarea' },
];

export function getMetadataFields(type?: string): MetadataFieldConfig[] {
  switch (type) {
    case 'definicion':
      return [
        ...common,
        { key: 'subtype', label: 'Subtipo lógico', type: 'select', required: true, options: [
          { value: 'primitivo', label: 'Primitivo' },
          { value: 'nominal', label: 'Nominal' },
          { value: 'fundamentada', label: 'Fundamentada' },
        ] },
        { key: 'statement', label: 'Enunciado formal', type: 'textarea' },
        { key: 'color', label: 'Color', type: 'select', options: [...EDITOR_THEME_COLOR_OPTIONS] },
        { key: 'authors', label: 'Autores', type: 'array' },
        { key: 'hasSimulation', label: 'Tiene diagrama', type: 'boolean' },
      ];
    case 'teorema':
    case 'lema':
    case 'corolario':
      return [
        ...common,
        { key: 'statement', label: 'Enunciado formal', type: 'textarea', required: type === 'teorema' },
        { key: 'parentTheorem', label: 'Teorema padre', type: 'text', required: type !== 'teorema' },
        { key: 'color', label: 'Color', type: 'select', options: [...EDITOR_THEME_COLOR_OPTIONS] },
        { key: 'authors', label: 'Autores', type: 'array' },
        { key: 'demos', label: 'Demostraciones', type: 'array' },
        { key: 'lemmas', label: 'Lemas', type: 'array' },
        { key: 'requires', label: 'Dependencias', type: 'array' },
        { key: 'difficulty', label: 'Dificultad', type: 'select', options: difficultyOptions },
        { key: 'hasSimulation', label: 'Tiene diagrama', type: 'boolean' },
      ];
    case 'demostracion':
      return [
        ...common,
        { key: 'parentTheorem', label: 'Teorema probado', type: 'text', required: true },
        { key: 'proofMethod', label: 'Método', type: 'select', options: proofMethodOptions },
        { key: 'layout', label: 'Layout', type: 'select', options: [
          { value: 'split', label: 'Split: texto + diagrama' },
          { value: 'text', label: 'Solo texto' },
        ] },
        { key: 'dependencias', label: 'Dependencias', type: 'array' },
        { key: 'lemmas', label: 'Lemas', type: 'array' },
        { key: 'authors', label: 'Autores', type: 'array' },
      ];
    case 'modelo':
      return [
        ...common,
        { key: 'satisfies', label: 'Sistema que satisface', type: 'text', required: true },
        { key: 'axioms_verified', label: 'Axiomas verificados', type: 'array' },
        { key: 'hasDiagram', label: 'Tiene diagrama', type: 'boolean' },
      ];
    case 'axioma':
      return [
        ...common,
        { key: 'statement', label: 'Enunciado', type: 'textarea' },
        { key: 'axiomSystem', label: 'Sistema axiomático', type: 'text' },
        { key: 'authors', label: 'Autores', type: 'array' },
        { key: 'hasSimulation', label: 'Tiene diagrama', type: 'boolean' },
      ];
    case 'ejemplo':
    case 'ejercicio':
      return [
        ...common,
        { key: 'relatedTheorem', label: 'Concepto relacionado', type: 'text' },
        { key: 'difficulty', label: 'Dificultad', type: 'select', options: difficultyOptions },
        { key: 'hint', label: 'Pista', type: 'textarea' },
        { key: 'hasSimulation', label: 'Tiene diagrama', type: 'boolean' },
      ];
    case 'caso-de-uso':
      return [
        ...common,
        { key: 'concept', label: 'Concepto ilustrado', type: 'text' },
        { key: 'domain', label: 'Dominio', type: 'text' },
        { key: 'difficulty', label: 'Dificultad', type: 'select', options: difficultyOptions },
      ];
    case 'plan-de-estudio':
      return [
        ...common,
        { key: 'subtitle', label: 'Subtítulo', type: 'text' },
        { key: 'requiredNodes', label: 'Nodos requeridos', type: 'array' },
      ];
    case 'matematico':
      return [
        { key: 'id', label: 'ID', type: 'text', required: true },
        { key: 'type', label: 'Tipo', type: 'select', required: true, options: [...CONTENT_TYPE_OPTIONS] },
        { key: 'name', label: 'Nombre', type: 'text', required: true },
        { key: 'description', label: 'Descripción', type: 'textarea', required: true },
        { key: 'birthYear', label: 'Nacimiento', type: 'text' },
        { key: 'deathYear', label: 'Fallecimiento', type: 'text' },
        { key: 'image', label: 'Imagen', type: 'text' },
      ];
    default:
      return common;
  }
}
