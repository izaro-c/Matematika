# Developer Guide: Estructura de Datos (Frontmatter MDX)

Este archivo es generado automáticamente por `npm run docs:generate`. Documenta los esquemas de metadatos requeridos para cada tipo de contenido en Matematika.

## MathematicianSchema - Esquema de metadatos para Biografías de Matemáticos

Valida los datos históricos y biográficos de las figuras matemáticas.

| Campo | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| `id` | `string` | ❌ | - |
| `type` | `literal` | ✅ | - |
| `name` | `string` | ✅ | - |
| `birthYear` | `number` | ❌ | - |
| `deathYear` | `number` | ❌ | - |
| `country` | `string` | ❌ | - |
| `description` | `string` | ✅ | - |
| `image` | `string` | ❌ | - |

---

## TheoremSchema - Esquema de metadatos para Teoremas

Estructura principal de la enciclopedia. Valida el enunciado formal, dependencias (requires), demostraciones (demos) y corolarios.

| Campo | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| `id` | `string` | ❌ | - |
| `type` | `enum([teorema, lema, corolario])` | ✅ | - |
| `title` | `string` | ✅ | - |
| `description` | `string` | ✅ | - |
| `statement` | `string` | ❌ | - |
| `color` | `string` | ❌ | - |
| `branch` | `string` | ❌ | - |
| `branches` | `array` | ✅ | - |
| `authors` | `array` | ✅ | - |
| `lemmas` | `array` | ✅ | - |
| `corollaries` | `array` | ✅ | - |
| `demos` | `array` | ✅ | - |
| `examples` | `array` | ✅ | IDs de ejemplos resueltos asociados |
| `exercises` | `array` | ✅ | IDs de ejercicios propuestos asociados |
| `parentTheorem` | `string` | ❌ | - |
| `difficulty` | `enum([básico, intermedio, avanzado])` | ❌ | - |

---

## LessonSchema - Esquema para Lecciones o Ramas

Agrupa múltiples teoremas y definiciones bajo una misma categoría de aprendizaje.

| Campo | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| `id` | `string` | ❌ | - |
| `type` | `literal` | ✅ | - |
| `title` | `string` | ✅ | - |
| `description` | `string` | ❌ | - |
| `difficulty` | `enum([básico, intermedio, avanzado])` | ❌ | - |

---

## DemoSchema - Esquema para Demostraciones

Valida la estructura de una demostración formal de un teorema,  incluyendo el método de demostración utilizado.

| Campo | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| `id` | `string` | ❌ | - |
| `type` | `literal` | ✅ | - |
| `title` | `string` | ✅ | - |
| `description` | `string` | ❌ | - |
| `parentTheorem` | `string` | ❌ | - |
| `lemmas` | `array` | ✅ | - |
| `proofMethod` | `enum([directo, contradiccion, induccion, contraposicion, constructivo, geometrico, exhaustivo, reduccion])` | ❌ | - |
| `authors` | `array` | ✅ | - |
| `layout` | `enum([split, text])` | ❌ | - |
| `dependencias` | `array` | ✅ | - |

---

## DefinitionSchema - Esquema para Definiciones Formales

Valida axiomas y definiciones base. Incluye el enunciado matemático (`statement`).

| Campo | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| `id` | `string` | ❌ | - |
| `type` | `literal` | ✅ | - |
| `title` | `string` | ✅ | - |
| `description` | `string` | ✅ | - |
| `statement` | `string` | ❌ | - |
| `authors` | `array` | ✅ | - |
| `color` | `string` | ❌ | - |

---

## ExampleSchema — Ejemplo Resuelto

Un ejemplo concreto que ilustra cómo aplicar un teorema o definición. Incluye el enunciado y la solución desarrollada paso a paso.

| Campo | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| `id` | `string` | ❌ | - |
| `type` | `literal` | ✅ | - |
| `title` | `string` | ✅ | - |
| `description` | `string` | ❌ | - |
| `relatedTheorem` | `string` | ❌ | ID del teorema o definición principal que ilustra |
| `difficulty` | `enum([básico, intermedio, avanzado])` | ❌ | - |

---

## ExerciseSchema — Ejercicio Propuesto

Un ejercicio con enunciado y solución oculta que el estudiante puede revelar.

| Campo | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| `id` | `string` | ❌ | - |
| `type` | `literal` | ✅ | - |
| `title` | `string` | ✅ | - |
| `description` | `string` | ❌ | - |
| `relatedTheorem` | `string` | ❌ | ID del teorema o definición que pone en práctica |
| `difficulty` | `enum([básico, intermedio, avanzado])` | ❌ | - |
| `hint` | `string` | ❌ | Pista visible antes de revelar la solución |

---

## AxiomSchema - Esquema para Axiomas (Nodos Raíz lógicos)

| Campo | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| `id` | `string` | ❌ | - |
| `type` | `literal` | ✅ | - |
| `title` | `string` | ✅ | - |
| `description` | `string` | ✅ | - |
| `statement` | `string` | ❌ | - |
| `authors` | `array` | ✅ | - |

---

## AxiomaticSystemSchema - Esquema para Sistemas Axiomáticos

Define un conjunto de axiomas que constituyen una teoría formal. Los modelos son estructuras concretas que satisfacen estos axiomas.

| Campo | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| `id` | `string` | ❌ | - |
| `type` | `literal` | ✅ | - |
| `title` | `string` | ✅ | - |
| `description` | `string` | ✅ | - |
| `axiomas` | `array` | ✅ | IDs de los axiomas que forman parte de este sistema |
| `models` | `array` | ✅ | IDs de los modelos que satisfacen este sistema |
| `authors` | `array` | ✅ | IDs de matemáticos asociados a este sistema |
| `hasSimulation` | `boolean` | ❌ | - |

---

## ModelSchema - Esquema para Modelos (Estructuras Concretas)

Un modelo es una estructura matemática concreta que satisface los axiomas de un sistema axiomático. Puede tener un diagrama asociado.

| Campo | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| `id` | `string` | ❌ | - |
| `type` | `literal` | ✅ | - |
| `title` | `string` | ✅ | - |
| `description` | `string` | ❌ | - |
| `satisfies` | `string` | ✅ | ID del sistema axiomático que este modelo satisface |
| `axioms_verified` | `array` | ✅ | IDs de los axiomas verificados en este modelo |
| `hasDiagram` | `boolean` | ❌ | Indica si este modelo tiene un diagrama interactivo asociado |
| `hasSimulation` | `boolean` | ❌ | - |

---

## UseCaseSchema — Caso de Uso en el Mundo Real

Página propia que muestra cómo un concepto matemático aparece en una disciplina o situación concreta del mundo real. Ruta: /caso/:id

| Campo | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| `id` | `string` | ❌ | - |
| `type` | `literal` | ✅ | - |
| `title` | `string` | ✅ | - |
| `description` | `string` | ❌ | - |
| `concept` | `string` | ❌ | ID del teorema o concepto matemático que ilustra |
| `domain` | `string` | ❌ | Ámbito real: 'ingeniería', 'medicina', 'economía', 'naturaleza', 'arte', etc. |
| `difficulty` | `enum([básico, intermedio, avanzado])` | ❌ | - |

---

## StudyPlanSchema - Esquema para Planes de Estudio

Rutas de aprendizaje narrativas a través del grafo.

| Campo | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| `id` | `string` | ✅ | - |
| `type` | `literal` | ✅ | - |
| `title` | `string` | ✅ | - |
| `subtitle` | `string` | ❌ | - |
| `description` | `string` | ✅ | - |
| `requiredNodes` | `array` | ✅ | - |

---

