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
| `links` | `array` | ✅ | - |

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
| `mathematicians` | `array` | ✅ | - |
| `lemmas` | `array` | ✅ | - |
| `corollaries` | `array` | ✅ | - |
| `demos` | `array` | ✅ | - |
| `demostraciones` | `array` | ✅ | - |
| `requires` | `array` | ✅ | IDs de definiciones que este teorema usa formalmente (grafo de dependencia) |
| `examples` | `array` | ✅ | IDs de ejemplos resueltos asociados |
| `exercises` | `array` | ✅ | IDs de ejercicios propuestos asociados |
| `parentTheorem` | `string` | ❌ | - |
| `tags` | `array` | ✅ | - |
| `difficulty` | `enum([básico, intermedio, avanzado])` | ❌ | - |
| `links` | `array` | ✅ | - |

---

## LessonSchema - Esquema para Lecciones o Ramas

Agrupa múltiples teoremas y definiciones bajo una misma categoría de aprendizaje.

| Campo | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| `id` | `string` | ❌ | - |
| `type` | `literal` | ✅ | - |
| `title` | `string` | ✅ | - |
| `description` | `string` | ❌ | - |
| `tags` | `array` | ✅ | - |
| `difficulty` | `enum([básico, intermedio, avanzado])` | ❌ | - |
| `links` | `array` | ✅ | - |

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
| `tags` | `array` | ✅ | - |
| `links` | `array` | ✅ | - |
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
| `tags` | `array` | ✅ | - |
| `authors` | `array` | ✅ | - |
| `color` | `string` | ❌ | - |
| `usedBy` | `array` | ✅ | IDs de teoremas que usan esta definición |
| `links` | `array` | ✅ | - |

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
| `requires` | `array` | ✅ | IDs de definiciones que usa |
| `tags` | `array` | ✅ | - |
| `difficulty` | `enum([básico, intermedio, avanzado])` | ❌ | - |
| `links` | `array` | ✅ | - |

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
| `requires` | `array` | ✅ | - |
| `tags` | `array` | ✅ | - |
| `difficulty` | `enum([básico, intermedio, avanzado])` | ❌ | - |
| `hint` | `string` | ❌ | Pista visible antes de revelar la solución |
| `links` | `array` | ✅ | - |

---

## AxiomSchema - Esquema para Axiomas (Nodos Raíz lógicos)

| Campo | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| `id` | `string` | ❌ | - |
| `type` | `literal` | ✅ | - |
| `title` | `string` | ✅ | - |
| `description` | `string` | ✅ | - |
| `statement` | `string` | ❌ | - |
| `tags` | `array` | ✅ | - |
| `authors` | `array` | ✅ | - |
| `links` | `array` | ✅ | - |

---

## ModelSchema - Esquema para Modelos (Axiom Sets)

| Campo | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| `id` | `string` | ❌ | - |
| `type` | `literal` | ✅ | - |
| `title` | `string` | ✅ | - |
| `description` | `string` | ❌ | - |
| `axiomas` | `array` | ✅ | - |
| `tags` | `array` | ✅ | - |

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
| `tags` | `array` | ✅ | - |
| `difficulty` | `enum([básico, intermedio, avanzado])` | ❌ | - |
| `links` | `array` | ✅ | - |

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
| `links` | `array` | ✅ | - |

---

