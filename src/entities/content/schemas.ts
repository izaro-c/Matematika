import { z } from 'zod';

export const VerificationStatusSchema = z.enum([
  'none',
  'human-proof',
  'lean-checked',
  'lean-audited',
]);

export const FoundationSchema = z.enum([
  'matematika-axioms',
  'bridge',
  'pending',
]);

const MathematicalSourceSchema = z.object({
  title: z.string(),
  author: z.string().optional(),
  locator: z.string().optional(),
  role: z.enum(['primary', 'secondary', 'formalization']).optional(),
});

const LeanMetadataSchema = {
  /** Identificador de la declaración formal en el core de Lean de Matematika. */
  leanId: z.string().optional(),
  /** SHA del entorno Lean usado para verificar esta página, o 'local-bridge'. */
  leanCommitSha: z.string().optional(),
  /** Campo generado por el índice: true si leanId aparece en lean_graph.json. */
  leanVerified: z.boolean().optional(),
  /** Campo generado por el índice: nivel de verificación de la prueba. */
  verificationStatus: VerificationStatusSchema.optional(),
  /** Campo generado por el índice: fundamento lógico de la prueba. */
  foundation: FoundationSchema.optional(),
  /** Referencias que fijan la definición, el enunciado o la formalización. */
  sources: z.array(MathematicalSourceSchema).optional(),
};

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
  requires: z.array(z.string()).optional(),
  /** IDs de ejemplos resueltos asociados */
  examples: z.array(z.string()).optional(),
  /** IDs de ejercicios propuestos asociados */
  exercises: z.array(z.string()).optional(),
  parentTheorem: z.string().optional(),
  difficulty: z.enum(['básico', 'intermedio', 'avanzado']).optional(),
  hasSimulation: z.boolean().optional(),
  ...LeanMetadataSchema,
});

/**
 * MethodSchema - Esquema para métodos matemáticos reutilizables.
 *
 * Describe conocimiento procedimental: cómo construir, calcular o demostrar.
 */
export const MethodSchema = z.object({
  id: z.string(),
  type: z.literal('metodo'),
  subtype: z.enum(['demostracion', 'construccion', 'calculo', 'algoritmo']),
  title: z.string(),
  description: z.string(),
  tags: z.array(z.string()).optional(),
  authors: z.array(z.string()).optional(),
  links: z.array(z.string()).optional(),
  seeAlso: z.array(z.string()).optional(),
  requires: z.array(z.string()).optional(),
  difficulty: z.enum(['básico', 'intermedio', 'avanzado']).optional(),
  hasSimulation: z.boolean().optional(),
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
  /** ID de la página de método que organiza esta demostración. */
  proofMethod: z.string().regex(/^metodo-[a-z0-9]+(?:-[a-z0-9]+)*$/).optional(),
  authors: z.array(z.string()).optional(),
  layout: z.enum(['split', 'text']).optional(),
  dependencias: z.array(z.string()).optional(),
  stepTacticMap: z.record(z.string(), z.array(z.string())).optional(),
  ...LeanMetadataSchema,
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
  hasSimulation: z.boolean().optional(),
  ...LeanMetadataSchema,
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
  hasSimulation: z.boolean().optional(),
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
  hasSimulation: z.boolean().optional(),
});

// Tipos Inferidos
export type MathematicianMeta = z.infer<typeof MathematicianSchema>;
export type TheoremMeta = z.infer<typeof TheoremSchema>;
export type MethodMeta = z.infer<typeof MethodSchema>;
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
  axiomSystem: z.string().optional(),
  /** Familia presentacional para organizar axiomas sin inferirla desde su ID. */
  axiomFamily: z.string().min(1).optional(),
  /** Grupo de alternativas mutuamente excluyentes dentro de una base lógica. */
  alternativeGroup: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).optional(),
  hasSimulation: z.boolean().optional(),
  ...LeanMetadataSchema,
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
