import { EDITOR_THEME_COLOR_OPTIONS } from '@/fixed-pages/editor/types/editorContracts';
import { SUPPORTED_LANGUAGES } from '@/i18n/config';

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
  { value: 'metodo', label: 'Método' },
  { value: 'plan-de-estudio', label: 'Plan de estudio' },
  { value: 'matematico', label: 'Matemático' },
] as const;

export const LANGUAGE_OPTIONS: ReadonlyArray<{ value: string; label: string }> = SUPPORTED_LANGUAGES.map(lang => ({
  value: lang.code,
  label: `${lang.name} (${lang.code})`,
}));

export const BRANCH_OPTIONS = [
  { value: 'fundamentos-y-logica', label: 'Fundamentos y Lógica (03, 08)' },
  { value: '03', label: '03 - Lógica matemática y fundamentos' },
  { value: '03A', label: '03A - Aspectos filosóficos y fundacionales' },
  { value: '03B', label: '03B - Lógica general' },
  { value: '03C', label: '03C - Teoría de modelos' },
  { value: '03D', label: '03D - Computabilidad y recursión' },
  { value: '03E', label: '03E - Teoría de conjuntos' },
  { value: '03F', label: '03F - Teoría de la demostración' },
  { value: '03G', label: '03G - Lógica algebraica' },
  { value: '08', label: '08 - Sistemas algebraicos generales' },
  { value: 'algebra-y-teoria-de-numeros', label: 'Álgebra y Teoría de Números' },
  { value: '11', label: '11 - Teoría de números' },
  { value: '11A', label: '11A - Teoría de números elemental' },
  { value: '12', label: '12 - Teoría de cuerpos y polinomios' },
  { value: '13', label: '13 - Álgebra conmutativa' },
  { value: '14', label: '14 - Geometría algebraica' },
  { value: '15', label: '15 - Álgebra lineal y matrices' },
  { value: '15A', label: '15A - Espacios vectoriales y transformaciones lineales' },
  { value: '15B', label: '15B - Matrices especiales' },
  { value: '18', label: '18 - Teoría de categorías y álgebra homológica' },
  { value: '20', label: '20 - Teoría de grupos' },
  { value: 'analisis-matematico', label: 'Análisis Matemático' },
  { value: '26', label: '26 - Funciones reales y cálculo' },
  { value: '26A', label: '26A - Funciones de una variable' },
  { value: '30', label: '30 - Variable compleja' },
  { value: '34', label: '34 - Ecuaciones diferenciales ordinarias' },
  { value: '46', label: '46 - Análisis funcional' },
  { value: 'geometria-y-topologia', label: 'Geometría y Topología' },
  { value: '51', label: '51 - Geometría' },
  { value: '51A', label: '51A - Geometría de incidencia' },
  { value: '51M', label: '51M - Geometría euclidiana y absoluta' },
  { value: '51P', label: '51P - Geometría y física' },
  { value: '53', label: '53 - Geometría diferencial' },
  { value: '54', label: '54 - Topología general' },
  { value: '55', label: '55 - Topología algebraica' },
  { value: 'matematica-discreta-y-computacional', label: 'Matemática Discreta y Computacional' },
  { value: '05', label: '05 - Combinatoria y grafos' },
  { value: '68', label: '68 - Ciencias de la computación' },
  { value: 'probabilidad-estadistica-y-aplicaciones', label: 'Probabilidad, Estadística y Aplicaciones' },
  { value: '49', label: '49 - Optimización y control' },
  { value: '60', label: '60 - Probabilidad y procesos estocásticos' },
  { value: '62', label: '62 - Estadística' },
  { value: '65', label: '65 - Análisis numérico' },
  { value: 'metadatos-y-divulgacion', label: 'Historia, Divulgación y Educación' },
  { value: '00', label: '00 - Temas generales y filosofía' },
  { value: '01', label: '01 - Historia y biografías' },
  { value: '97', label: '97 - Educación matemática' },
] as const;

const difficultyOptions = [
  { value: 'básico', label: 'Básico' },
  { value: 'intermedio', label: 'Intermedio' },
  { value: 'avanzado', label: 'Avanzado' },
];

const proofMethodOptions = [
  { value: 'metodo-directo', label: 'Directo' },
  { value: 'metodo-contradiccion', label: 'Contradicción' },
  { value: 'metodo-induccion', label: 'Inducción' },
  { value: 'metodo-contraposicion', label: 'Contraposición' },
  { value: 'metodo-constructivo', label: 'Constructivo' },
  { value: 'metodo-geometrico', label: 'Geométrico' },
  { value: 'metodo-exhaustivo', label: 'Exhaustivo' },
];

const common: MetadataFieldConfig[] = [
  { key: 'id', label: 'ID', type: 'text', required: true, readonly: true, placeholder: 'teorema-pitagoras' },
  { key: 'type', label: 'Tipo', type: 'select', required: true, options: [...CONTENT_TYPE_OPTIONS] },
  { key: 'lang', label: 'Idioma', type: 'select', options: [...LANGUAGE_OPTIONS] },
  { key: 'branch', label: 'Rama (MSC2020)', type: 'select', options: [...BRANCH_OPTIONS], placeholder: '51M' },
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
    case 'metodo':
      return [
        ...common,
        { key: 'subtype', label: 'Clase de procedimiento', type: 'select', required: true, options: [
          { value: 'demostracion', label: 'Demostración' },
          { value: 'construccion', label: 'Construcción' },
          { value: 'calculo', label: 'Cálculo' },
          { value: 'algoritmo', label: 'Algoritmo' },
        ] },
        { key: 'authors', label: 'Autores', type: 'array' },
        { key: 'requires', label: 'Dependencias', type: 'array' },
        { key: 'difficulty', label: 'Dificultad', type: 'select', options: difficultyOptions },
        { key: 'hasSimulation', label: 'Tiene diagrama', type: 'boolean' },
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
        { key: 'axiomFamily', label: 'Familia axiomática', type: 'text' },
        { key: 'alternativeGroup', label: 'Grupo de alternativas', type: 'text' },
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
        { key: 'id', label: 'ID', type: 'text', required: true, readonly: true },
        { key: 'type', label: 'Tipo', type: 'select', required: true, options: [...CONTENT_TYPE_OPTIONS] },
        { key: 'lang', label: 'Idioma', type: 'select', options: [...LANGUAGE_OPTIONS] },
        { key: 'branch', label: 'Rama (MSC2020)', type: 'select', options: [...BRANCH_OPTIONS] },
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
