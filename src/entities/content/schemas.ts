import { z } from 'zod';

/**
 * MathematicianSchema - Esquema de metadatos para Biografías de Matemáticos
 * 
 * Valida los datos históricos y biográficos de las figuras matemáticas.
 */
export const MathematicianSchema = z.object({
  id: z.string(),
  type: z.literal('matematico'),
  name: z.string(),
  birthYear: z.number().optional(),
  deathYear: z.number().optional(),
  country: z.string().optional(),
  description: z.string(),
  image: z.string().optional(),
});

/**
 * TheoremSchema - Esquema de metadatos para Teoremas
 * 
 * Estructura principal de la enciclopedia. Valida el enunciado formal,
 * dependencias (requires), demostraciones (demos) y corolarios.
 */
export const TheoremSchema = z.object({
  id: z.string(),
  type: z.enum(['teorema', 'lema', 'corolario']),
  title: z.string(),
  description: z.string(),
  statement: z.string().optional(),
  color: z.string().optional(),
  branch: z.string().optional(),
  branches: z.array(z.string()).optional(),
  authors: z.array(z.string()).optional(),
  lemmas: z.array(z.string()).optional(),
  corollaries: z.array(z.string()).optional(),
  demos: z.array(z.string()).optional(),
  /** IDs de ejemplos resueltos asociados */
  examples: z.array(z.string()).optional(),
  /** IDs de ejercicios propuestos asociados */
  exercises: z.array(z.string()).optional(),
  parentTheorem: z.string().optional(),
  difficulty: z.enum(['básico', 'intermedio', 'avanzado']).optional(),
});

/**
 * LessonSchema - Esquema para Lecciones o Ramas
 * 
 * Agrupa múltiples teoremas y definiciones bajo una misma categoría de aprendizaje.
 */
export const LessonSchema = z.object({
  id: z.string(),
  type: z.union([z.literal('leccion'), z.literal('lesson')]),
  title: z.string(),
  description: z.string().optional(),
  difficulty: z.enum(['básico', 'intermedio', 'avanzado']).optional(),
});

/**
 * DemoSchema - Esquema para Demostraciones
 * 
 * Valida la estructura de una demostración formal de un teorema, 
 * incluyendo el método de demostración utilizado.
 */
export const DemoSchema = z.object({
  id: z.string(),
  type: z.literal('demostracion'),
  title: z.string(),
  description: z.string().optional(),
  parentTheorem: z.string().optional(),
  lemmas: z.array(z.string()).optional(),
  proofMethod: z.enum(['directo', 'contradiccion', 'induccion', 'contraposicion', 'constructivo', 'geometrico', 'exhaustivo']).optional(),
  authors: z.array(z.string()).optional(),
  layout: z.enum(['split', 'text']).optional(),
  dependencias: z.array(z.string()).optional(),
});

/**
 * DefinitionSchema - Esquema para Definiciones Formales
 * 
 * Valida axiomas y definiciones base. Incluye el enunciado matemático (`statement`).
 */
export const DefinitionSchema = z.object({
  id: z.string(),
  type: z.literal('definicion'),
  title: z.string(),
  description: z.string(),
  statement: z.string().optional(),
  authors: z.array(z.string()).optional(),
  color: z.string().optional(),
  subtype: z.enum(['primitivo', 'nominal', 'fundamentada']).optional(),
});

/**
 * ExampleSchema — Ejemplo Resuelto
 *
 * Un ejemplo concreto que ilustra cómo aplicar un teorema o definición.
 * Incluye el enunciado y la solución desarrollada paso a paso.
 */
export const ExampleSchema = z.object({
  id: z.string(),
  type: z.literal('ejemplo'),
  title: z.string(),
  description: z.string().optional(),
  /** ID del teorema o definición principal que ilustra */
  relatedTheorem: z.string().optional(),
  difficulty: z.enum(['básico', 'intermedio', 'avanzado']).optional(),
});

/**
 * ExerciseSchema — Ejercicio Propuesto
 *
 * Un ejercicio con enunciado y solución oculta que el estudiante puede revelar.
 */
export const ExerciseSchema = z.object({
  id: z.string(),
  type: z.literal('ejercicio'),
  title: z.string(),
  description: z.string().optional(),
  /** ID del teorema o definición que pone en práctica */
  relatedTheorem: z.string().optional(),
  difficulty: z.enum(['básico', 'intermedio', 'avanzado']).optional(),
  /** Pista visible antes de revelar la solución */
  hint: z.string().optional(),
});

// Tipos Inferidos
export type MathematicianMeta = z.infer<typeof MathematicianSchema>;
export type TheoremMeta = z.infer<typeof TheoremSchema>;
export type LessonMeta = z.infer<typeof LessonSchema>;
export type DemoMeta = z.infer<typeof DemoSchema>;
export type DefinitionMeta = z.infer<typeof DefinitionSchema>;
export type ExampleMeta = z.infer<typeof ExampleSchema>;
export type ExerciseMeta = z.infer<typeof ExerciseSchema>;
export type AxiomMeta = z.infer<typeof AxiomSchema>;
export type ModelMeta = z.infer<typeof ModelSchema>;
export type AxiomaticSystemMeta = z.infer<typeof AxiomaticSystemSchema>;

/**
 * AxiomSchema - Esquema para Axiomas (Nodos Raíz lógicos)
 */
export const AxiomSchema = z.object({
  id: z.string(),
  type: z.literal('axioma'),
  title: z.string(),
  description: z.string(),
  statement: z.string().optional(),
  authors: z.array(z.string()).optional(),
});

/**
 * AxiomaticSystemSchema - Esquema para Sistemas Axiomáticos
 *
 * Define un conjunto de axiomas que constituyen una teoría formal.
 * Los modelos son estructuras concretas que satisfacen estos axiomas.
 */
export const AxiomaticSystemSchema = z.object({
  id: z.string(),
  type: z.literal('sistema-axiomatico'),
  title: z.string(),
  description: z.string(),
  /** IDs de los axiomas que forman parte de este sistema */
  axiomas: z.array(z.string()),
  /** IDs de los modelos que satisfacen este sistema */
  models: z.array(z.string()).optional(),
  /** IDs de matemáticos asociados a este sistema */
  authors: z.array(z.string()).optional(),
  hasSimulation: z.boolean().optional(),
});

/**
 * ModelSchema - Esquema para Modelos (Estructuras Concretas)
 *
 * Un modelo es una estructura matemática concreta que satisface
 * los axiomas de un sistema axiomático. Puede tener un diagrama asociado.
 */
export const ModelSchema = z.object({
  id: z.string(),
  type: z.literal('modelo'),
  title: z.string(),
  description: z.string().optional(),
  /** ID del sistema axiomático que este modelo satisface */
  satisfies: z.union([z.string(), z.array(z.string())]),
  /** IDs de los axiomas verificados en este modelo */
  axioms_verified: z.array(z.string()).optional(),
  /** Indica si este modelo tiene un diagrama interactivo asociado */
  hasDiagram: z.boolean().optional(),
  hasSimulation: z.boolean().optional(),
});

/**
 * UseCaseSchema — Caso de Uso en el Mundo Real
 *
 * Página propia que muestra cómo un concepto matemático aparece
 * en una disciplina o situación concreta del mundo real.
 * Ruta: /caso/:id
 */
export const UseCaseSchema = z.object({
  id: z.string(),
  type: z.literal('caso-de-uso'),
  title: z.string(),
  description: z.string().optional(),
  /** ID del teorema o concepto matemático que ilustra */
  concept: z.string().optional(),
  /** Ámbito real: 'ingeniería', 'medicina', 'economía', 'naturaleza', 'arte', etc. */
  domain: z.string().optional(),
  difficulty: z.enum(['básico', 'intermedio', 'avanzado']).optional(),
});

export type UseCaseMeta = z.infer<typeof UseCaseSchema>;



/**
 * StudyPlanSchema - Esquema para Planes de Estudio
 * 
 * Rutas de aprendizaje narrativas a través del grafo.
 */
export const StudyPlanSchema = z.object({
  id: z.string(),
  type: z.literal('plan-de-estudio'),
  title: z.string(),
  subtitle: z.string().optional(),
  description: z.string(),
  requiredNodes: z.array(z.string()).optional(),
});

export type StudyPlanMeta = z.infer<typeof StudyPlanSchema>;
