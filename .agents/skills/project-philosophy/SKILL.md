---
name: project-philosophy
description: Filosofía, principios no negociables y reglas de auto-actualización del proyecto Matematika. Cárgame cuando necesites verificar que una contribución respeta la esencia del proyecto o cuando la estructura del proyecto haya cambiado y necesites saber cómo actualizar las demás skills.
---

# Skill: project-philosophy — Guardián de la Filosofía de Matematika

> **Propósito:** Esta skill es la autoridad máxima sobre QUÉ es Matematika y CÓMO debe comportarse cualquier contribución. No contiene detalles de implementación (eso está en `page-creator` y `diagrama`), sino los principios que gobiernan todas las decisiones.

**Skills hermanas:** Cuando necesites detalles de implementación, carga:
- `page-creator` — para crear páginas MDX, metadatos Zod, estructura de contenido
- `diagrama` — para crear diagramas interactivos, JSXGraph, SVG, Canvas

---

## 1. Principios No Negociables

Estos 7 principios son la constitución del proyecto. Cualquier contribución que viole uno de ellos debe ser rechazada o corregida.

---

### 1.1 Jardín Digital, no PDF interactivo

Cada concepto es un nodo navegable en una red de conocimiento. La lectura puede ser lineal o exploratoria. Las páginas no son capítulos secuenciales; son entidades independientes interconectadas.

**Implicaciones prácticas:**
- Toda página debe poder leerse de forma autónoma (sin asumir que el usuario viene de otra página)
- Los enlaces entre conceptos usan `<ConceptLink>` y abren Marginalia, no navegación completa
- El grafo de conocimiento (`GraphPage`) refleja fielmente las dependencias lógicas. Cuando una página tiene `leanId`, Lean aporta la traza mecánica; `formalizationStatus` distingue un axioma, un puente y una prueba completa. MDX sigue siendo la capa pedagógica y semántica. **MDX siempre mantendrá ConceptLink, incluso cuando Lean ya haya verificado la dependencia.**

**Ejemplos de violación:**
- ❌ "Como vimos en el capítulo anterior..." (asume lectura secuencial)
- ❌ Usar `<a href="/teorema/pitagoras">` en lugar de `<ConceptLink targetId="teorema-pitagoras" />`
- ❌ Agrupar varios conceptos no relacionados en una sola página "tutorial"
- ❌ Eliminar un `<ConceptLink>` asumiendo que "Lean ya valida la dependencia".

**Cómo detectar:** Buscar `<a href=` en archivos MDX. Buscar frases que asuman orden de lectura. Verificar que todo `targetId` en `<ConceptLink>` abre el MarginaliaPanel.

---

### 1.2 Universalidad absoluta

El contenido matemático no tiene país, currículo ni sistema educativo. Es atemporal.

**Implicaciones prácticas:**
- No referencias a cursos, exámenes, niveles educativos (ESO, Bachillerato, etc.)
- No usar frases como "como vimos en el capítulo anterior"
- Los matemáticos se presentan por su contribución universal, no por su nacionalidad

**Ejemplos de violación:**
- ❌ "Este teorema se estudia en 2º de Bachillerato"
- ❌ "Como hemos visto en la lección anterior..."
- ❌ "Pitágoras, matemático griego..." (la nacionalidad es accesoria; lo esencial es el teorema)
- ❌ "Ejercicio típico de selectividad"

**Cómo detectar:** Buscar nombres de cursos, exámenes, nacionalidades como dato principal. El metadata `branch` usa MSC2020, no currículos.

---

### 1.3 Interactividad como norma

Si un concepto puede visualizarse, se visualiza. Si un ejercicio puede ser interactivo, lo es.

**Implicaciones prácticas:**
- Todo teorema con contenido geométrico debe tener al menos un diagrama interactivo
- Las definiciones de objetos geométricos (punto, recta, ángulo...) tienen simulación asociada
- Los ejercicios usan componentes interactivos (`<Hueco>`, `<Emparejar>`, `<Clasificador>`...)

**Ejemplos de violación:**
- ❌ Un teorema sobre triángulos sin diagrama interactivo
- ❌ Una definición de "ángulo" con solo texto, sin simulación
- ❌ Un ejercicio de tipo test con radio buttons HTML en lugar de `<Hueco>` interactivo

**Cómo detectar:** Verificar que cada página de tipo `teorema`, `definicion`, `ejercicio` tiene `hasSimulation: true` o un diagrama asociado. Los componentes publicados viven en `src/widgets/diagrams/`; su contrato y renderer comunes viven en `src/shared/diagrams/`.

**Delegación:** Para crear el diagrama, carga la skill `diagrama`.

---

### 1.4 Elegante y limpio

El diseño sirve a las matemáticas, no compite con ellas.

**Implicaciones prácticas:**
- Paleta Arts & Crafts exclusivamente (`lienzo`, `carbon`, `salvia`, `terracota`, `pizarra`, `ocre`, `pavo`, `granada`, `musgo`)
- Cero hex arbitrarios en cualquier parte del código
- Tipografía: serif para cuerpo matemático, monoespaciada para código
- Espacio en blanco generoso, densidad visual controlada

**Ejemplos de violación:**
- ❌ `color: "#FF5733"` en cualquier archivo TSX
- ❌ `strokeColor: '#00ff00'` en un diagrama JSXGraph
- ❌ `className="bg-blue-500"` en lugar de `className="bg-pavo"`
- ❌ Fuentes decorativas para contenido matemático

**Cómo detectar:** `rg '#[0-9a-fA-F]{3,8}' src/` busca hex locales; las únicas definiciones hex admitidas son los nueve tokens de `src/app/theme.css` y sus valores tipados para APIs canvas. Verificar que Tailwind usa tokens Arts & Crafts y que los diagramas consumen `theme.*`, `getCSSVar('--theme-*')` o `var(--theme-*)`.

### 1.4.1 Autoría segura y accesible

El editor no puede anunciar una capacidad por la mera presencia de un control. El source completo sigue siendo la autoridad, toda mutación amplia requiere diff verificable y un estado parcial o no soportado se declara de forma conservadora. Teclado, foco visible, lectores de pantalla, responsive, temas, errores, carga y protección de cambios pendientes son parte de la capacidad, no mejoras opcionales.

---

### 1.5 Rigor sobre accesibilidad

Todo enunciado está justificado. Toda definición es precisa. Toda demostración es completa y obedece estrictamente a la axiomática de Greenberg/Hilbert.

**Las 6 Justificaciones Lógicas de Greenberg:**
1. Por hipótesis
2. Por axioma (especificar cuál: "Por Ax. I.1")
3. Por definición (especificar cuál: "Por def. de ángulo recto")
4. Por teorema previo (especificar cuál: "Por el Teorema de Pitágoras")
5. Por regla lógica (modus ponens, modus tollens, silogismo, reducción al absurdo...)
6. Por construcción geométrica válida (con regla y compás, o coordenadas)

**Implicaciones prácticas:**
- Cada paso de una demostración (`<ProofStep>`) debe incluir su justificación explícita
- Si la demostración tiene `leanId`, la verificación Lean complementa pero no sustituye el rigor Greenberg: cada paso pedagógico sigue necesitando justificación textual con `<ConceptLink>`.
- **Independencia Estricta:** Matematika Core es independiente de Mathlib. Toda formalización debe partir de axiomas propios.
- `leanVerified` solo confirma que compila; una prueba completa exige `formalizationStatus: "proved"`. **Ningún teorema que contenga `sorry` o `admit` puede considerarse `"proved"` ni generar certificado "lean-checked".**
- Toda declaración Lean incompleta debe tener `formalizationStatus: "bridge"` y registrar su deuda en `docs/lean/bridge-debt.json`.
- Todo contenido formal debe conservar procedencia: fuente primaria o secundaria, sistema axiomático cuando corresponda y declaración Lean exacta si existe.
- En demostraciones geométricas con diagrama, las hipótesis se expresan fuera de `<Formula>` en prosa enlazable e interactiva; la fórmula de enunciado contiene solo la conclusión. No esconder `Sean`, `tales que` ni `Entonces` dentro de LaTeX.
- Las definiciones deben cubrir casos límite explícitamente (ej: ¿un segmento de longitud cero es un segmento?)
- Nunca usar "es obvio", "claramente", "evidentemente" sin justificación

**Ejemplos de violación:**
- ❌ Un `<ProofStep>` sin el atributo `justificacion`
- ❌ "Es obvio que el triángulo es rectángulo" sin citar el teorema que lo demuestra
- ❌ Definir "triángulo" sin especificar si 3 puntos colineales forman un triángulo degenerado
- ❌ "Como se ve en la figura, los ángulos son iguales" (argumento visual, no lógico)

**Cómo detectar:** Leer cada demostración. Verificar que cada `<ProofStep>` tiene `justificacion`. Verificar que las definiciones mencionan casos límite. Buscar "es obvio", "claramente", "evidentemente", "como se ve".

---

### 1.6 Orden topológico

El contenido se construye de abajo arriba, desde los axiomas. Un concepto no puede referenciar algo que depende lógicamente de él.

**Implicaciones prácticas:**
- Los `requires` en metadatos deben listar TODAS las dependencias lógicas directas
- El script `validate-graph` verifica que no haya ciclos ni dependencias invertidas
- Un teorema no puede referenciar su propio corolario como dependencia

**Ejemplos de violación:**
- ❌ `teorema-pitagoras` tiene `requires: ["teorema-coseno"]` (el coseno depende de Pitágoras, no al revés)
- ❌ Un ciclo: A → B → C → A
- ❌ `corolario-rectas-coincidentes` listado como `requires` de `teorema-dos-rectas-un-punto`

**Cómo detectar:** Ejecutar `npm run validate-graph` y, para páginas con `leanId`, `npm run validate-lean`. Verificar `graph_structure.json` para el orden topológico MDX y `lean_graph.json` para la verdad mecánica enlazada.

---

### 1.7 Educativo, fácil de comprender, matemáticamente riguroso

Claridad expositiva sin sacrificar precisión. Tercera persona impersonal. Nunca argumentos topológicos basados en apariencia visual.

**Implicaciones prácticas:**
- Tercera persona: "se demuestra", "se observa", nunca "demostramos", "vemos"
- Sin argumentos visuales: "como se ve en la figura" NO es una justificación válida
- Las demostraciones geométricas usan coordenadas/álgebra, no "arrastrando el punto se ve que..."
- Cada concepto introducido con motivación: ¿por qué existe? ¿qué problema resuelve?

**Ejemplos de violación:**
- ❌ "Demostramos que..." en lugar de "Se demuestra que..."
- ❌ "Si arrastramos el punto B, vemos que el ángulo se mantiene constante"
- ❌ Una definición sin motivación: "Un grupo es un conjunto con una operación..." sin explicar para qué sirve
- ❌ "Claramente, esto implica que..." sin justificar la implicación

**Cómo detectar:** Buscar primera persona plural ("demostramos", "vemos", "observamos"). Buscar argumentos basados en interacción visual. Verificar que cada concepto nuevo tiene un párrafo de motivación antes de la definición formal.

---

## 2. Regla de Auto-Actualización de Skills

Las skills son documentos vivos. Cuando la estructura del proyecto cambia, las skills DEBEN actualizarse.

### 2.1 Disparadores de actualización

El agente DEBE proponer actualizar una skill cuando:

| Disparador | Skill afectada | Ejemplo |
|---|---|---|
| Nuevo tipo de contenido en `schemas.ts` | `page-creator` | Se añade `tipo: "conjetura"` al schema |
| Cambio en estructura FSD | `project-philosophy`, `page-creator`, `diagrama` | Se mueve `shared/diagrams/` a `features/diagrams/` |
| Nueva convención de código | `project-philosophy` | Se decide usar `type` en lugar de `interface` |
| Modificación de Zod schema | `page-creator` | Se añade campo `deprecated` a TheoremSchema |
| Inconsistencia skill↔código | La skill desactualizada | `page-creator` dice que las demos van en `src/demos/` pero están en `src/database/content/demonstrations/` |
| Nuevo patrón de diagrama | `diagrama` | Se descubre un patrón mejor para ángulos en polígonos |

### 2.2 Procedimiento de actualización

1. **Detectar:** El agente identifica que la skill está desactualizada respecto al código
2. **Proponer:** El agente informa al usuario: "La skill `X` está desactualizada en la sección Y. El código ahora usa Z. ¿Quieres que la actualice?"
3. **Actualizar:** Si el usuario aprueba, el agente modifica `SKILL.md` manteniendo el frontmatter intacto
4. **Verificar:** El agente revisa que el contenido existente siga cumpliendo la skill actualizada

### 2.3 Formato de skills

Toda skill DEBE:
- Tener frontmatter YAML con `name` y `description`
- Estar en `.agents/skills/<nombre>/SKILL.md` (compatible con OpenCode y Antigravity)
- Usar kebab-case para el nombre del directorio (ej: `page-creator`, no `page_creator`)
- Tener un `name` que coincida con el nombre del directorio

---

## 3. Verificación de Consistencia Global

Cuando se carga esta skill, el agente DEBE verificar:

### 3.1 Consistencia arquitectura
1. ¿Coincide la estructura descrita en AGENTS.md con `src/`?
2. ¿Hay directorios vacíos o huérfanos?
3. ¿Los imports respetan las reglas FSD? → ejecutar `npm run depcruise`

### 3.2 Consistencia de contenido
4. ¿Están todos los tipos de `schemas.ts` documentados en `page-creator`?
5. ¿Cada tipo de contenido tiene un template en `src/shared/templates/`?
6. ¿El `contentIndex.json` está actualizado? → ejecutar `npm run generate-index`

### 3.3 Consistencia de estilo
7. ¿Hay hex colors arbitrarios? → `rg '#[0-9a-fA-F]{3,8}' src/` y distinguir únicamente las definiciones canónicas de tema
8. ¿Hay imports de capas incorrectas? → ejecutar `npm run depcruise`
9. ¿Los IDs usan kebab-case? → verificar `contentIndex.json`

### 3.4 Consistencia del grafo
10. ¿El DAG es válido? → ejecutar `npm run validate-graph`
11. ¿Las referencias cruzadas son íntegras? → ejecutar `npm run validate-references`
12. ¿Las páginas con `leanId` coinciden con Lean? → ejecutar `npm run validate-lean`
13. ¿El inventario de cobertura de contenido esta actualizado? → ejecutar `npm run content:coverage`
14. ¿La deuda bridge esta explicitada? → ejecutar `npm run bridge:audit`

Si alguna verificación falla, el agente DEBE informar al usuario con el problema específico y sugerir corrección.

---

## 4. Checklist de Revisión

Para usar durante una revisión de código/contenido (ej: con el agente `@reviewer`).

### 4.1 Checklist rápido (5 min)

- [ ] ¿IDs en kebab-case? (buscar `_` en `metadata.id`)
- [ ] ¿`<Capitular>` al inicio de cada MDX?
- [ ] ¿`<ConceptLink>` en lugar de `<a href>`?
- [ ] ¿Cero colores locales fuera de las definiciones canónicas de tema?
- [ ] ¿Tercera persona impersonal? (buscar "demostramos", "vemos")
- [ ] ¿`npm run depcruise` pasa sin errores?

### 4.2 Checklist completo (15 min)

- [ ] ¿Tipos de `schemas.ts` coinciden con `page-creator`?
- [ ] ¿Cada teorema tiene su demostración en página separada?
- [ ] ¿Las dependencias (`requires`) respetan el orden topológico?
- [ ] ¿Los diagramas usan el renderer/spec común o, para fuente manual, `MathBoard` + `MathFactory` y tokens del tema?
- [ ] ¿Controles y objetos móviles tienen teclado, nombre accesible y foco visible?
- [ ] ¿Cada `<ProofStep>` tiene `justificacion`?
- [ ] ¿Las definiciones cubren casos límite?
- [ ] ¿Cada concepto nuevo tiene motivación?
- [ ] ¿`npm run validate-graph && npm run validate-references && npm run validate-lean && npm run content:coverage && npm run bridge:audit` pasan?
- [ ] Para cerrar la fase puente: ¿`npm run bridge:closed` pasa?

---

## 5. Integración con la Arquitectura FSD

Cada principio se refleja en la arquitectura de carpetas:

| Principio | Regla FSD | Verificación |
|---|---|---|
| Jardín Digital | Páginas independientes en `pages/` | Cada página es autocontenida |
| Universalidad | Contenido en `entities/content/` sin referencias externas | Schemas sin campos educativos |
| Interactividad | Diagramas en `widgets/diagrams/`, ejercicios en `features/exercises/` | `hasSimulation` en metadata |
| Elegante | Tema en `app/theme.css`, tokens en `shared/design/`, componentes en `shared/ui/` | `depcruise` + auditoría de color |
| Rigor | Demostraciones en `database/content/demonstrations/` | `validate-references` |
| Orden topológico | Grafo en `entities/graph/` | `validate-graph` |
| Educativo | Templates en `shared/templates/`, lecciones en `features/lessons/` | Revisión manual |

---

## 6. Referencias Cruzadas

### 6.1 Cuándo cargar otras skills

| Situación | Skill a cargar |
|---|---|
| Crear o modificar una página MDX | `page-creator` |
| Crear o modificar un diagrama | `diagrama` |
| Validar integridad del proyecto | Esta skill (`project-philosophy`) + ejecutar `/full-check` |
| Revisar una contribución | Esta skill + `@reviewer` |
| Detectar skills desactualizadas | Esta skill (sección 2) |

### 6.2 Archivos clave del proyecto

| Archivo | Propósito |
|---|---|
| `AGENTS.md` | Instrucciones globales y orden de carga para toda IA |
| `docs/ai/` | Gobierno multi-IA y protocolo formal |
| `ai/` | Estado, objetivos y operación diaria con IA |
| `.agents/skills/` | Procedimientos reutilizables cargados bajo demanda |
| `.opencode/` y `opencode.json` | Adaptador y configuración oficial de OpenCode |
| `src/entities/content/schemas.ts` | Zod schemas — fuente única de verdad para metadata |
| `src/entities/graph/graphTypes.ts` | Tipos del grafo |
| `src/entities/graph/lean_graph.json` | Grafo Lean generado para páginas con `leanId` |
| `src/entities/graph/proof_blocks.json` | Bloques de táctica Lean para `ProofStepExpander` |
| `src/entities/content/ContentStore.ts` | API de consulta de contenido |
| `src/app/theme.css` y `src/shared/design/` | Paleta Arts & Crafts y roles semánticos |
| `src/shared/templates/` | Plantillas MDX por tipo de contenido |
| `src/widgets/diagrams/` | Diagramas interactivos |
| `.dependency-cruiser.js` | Reglas de arquitectura FSD |
