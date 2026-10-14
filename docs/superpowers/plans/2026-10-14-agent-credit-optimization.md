# Plan de Implementación: Optimización de Consumo de Créditos y Tokens para Agentes

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Configurar y sincronizar `AGENTS.md`, `CLAUDE.md`, `.claude/rules/`, `.agents/skills/` y `docs/` para minimizar el gasto de tokens/créditos de agentes manteniendo la máxima calidad técnica y rigor deductivo.

**Architecture:** Enfoque de tres capas: (1) Puntos de entrada raíz ultraligeros con punteros de contexto estrictos, (2) Reglas contextuales con filtro `paths` en `.claude/rules/` y skills sincronizadas en `.agents/skills/`, (3) Atlas de arquitectura de alta densidad (`docs/architecture/map.md`) y saneamiento integral de `docs/` con cabeceras TL;DR.

**Tech Stack:** Markdown, Claude Code rules (`paths:` globs), Antigravity/universal AGENTS.md, MCP codebase-memory, npm scripts (Vitest, TypeScript, Depcruise).

**Spec:** [`docs/superpowers/specs/2026-10-14-agent-credit-optimization-design.md`](../specs/2026-10-14-agent-credit-optimization-design.md)

## Global Constraints

- `AGENTS.md` debe tener menos de 45 líneas.
- No duplicar prosa entre `CLAUDE.md` y `AGENTS.md`.
- Toda regla en `.claude/rules/` debe declarar frontmatter `paths:` para carga condicional.
- No debe quedar ninguna referencia a rutas de borradores obsoletos en el repositorio.
- Todas las rutas en `docs/` deben ser relativas.
- Comandos rápidos priorizados: `npm run typecheck`, `npm run test:fast`, y vitest acotado.

---

### Task 1: Crear `AGENTS.md` y `CLAUDE.md` en la raíz

**Files:**
- Create: `AGENTS.md`
- Create: `CLAUDE.md`

**Interfaces:**
- Consumes: `docs/architecture/map.md` (pointer), MCP `codebase-memory` (`project: "home-izaro-Proiektuak-Matematika"`)
- Produces: Root agent entry points and routing directives.

- [ ] **Step 1: Crear `AGENTS.md`**
Crear `AGENTS.md` con menos de 45 líneas estableciendo punteros a la arquitectura, la prioridad del MCP `codebase-memory` para consultas TypeScript, la lectura quirúrgica de archivos y los comandos de test rápidos.

- [ ] **Step 2: Crear `CLAUDE.md`**
Crear `CLAUDE.md` apuntando a `AGENTS.md` y activando las reglas modulares por ruta en `.claude/rules/`.

- [ ] **Step 3: Verificar longitud y sintaxis**
Ejecutar `wc -l AGENTS.md CLAUDE.md` para verificar que `AGENTS.md` no excede las 45 líneas.

- [ ] **Step 4: Commit**
```bash
git add AGENTS.md CLAUDE.md
git commit -m "feat(agents): create root AGENTS.md and CLAUDE.md with token-saving guidelines"
```

---

### Task 2: Crear reglas contextuales condicionales en `.claude/rules/`

**Files:**
- Create: `.claude/rules/diagrams.md`
- Create: `.claude/rules/content-mdx.md`
- Create: `.claude/rules/editor-engine.md`
- Create: `.claude/rules/codebase-navigation.md`

**Interfaces:**
- Consumes: Claude Code conditional path filtering (`paths:`).
- Produces: Scoped rules that only enter context when matching files are edited.

- [ ] **Step 1: Crear `.claude/rules/diagrams.md`**
Regla para diagramas con `paths: ["src/diagrams/**", "content/diagrams/**", "tests/diagrams/**", "tests/features/editor/diagrams/**"]`: especificación v3 (`createDiagramSpec`), importación de `@/diagrams/public`, paleta de diseño oficial, persistencia de figuras base en steps y verificación con `npx tsx .agents/skills/matematika-diagram-generator/scripts/verify-diagram.ts`.

- [ ] **Step 2: Crear `.claude/rules/content-mdx.md`**
Regla para artículos MDX con `paths: ["content/mdx/**"]`: paridad trilingüe estricta (`es/`, `en/`, `eu/`), causalidad DAG (`isDependency`), `targetId` inmutable y verificación con `node .agents/skills/matematika-content-generator/scripts/check-parity.mjs`.

- [ ] **Step 3: Crear `.claude/rules/editor-engine.md`**
Regla para el editor con `paths: ["src/fixed-pages/editor/**", "tests/features/editor/**", "scripts/editor/**"]`: principio de edición sin pérdidas (lossless AST por offsets), prohibición de efectos colaterales/fetch en UI, y comandos `npm run editor:safety:check` y `npm run editor:test:unit`.

- [ ] **Step 4: Crear `.claude/rules/codebase-navigation.md`**
Regla general con `paths: ["src/**", "tests/**", "scripts/**"]`: mandato de uso de MCP `codebase-memory` (`project: "home-izaro-Proiektuak-Matematika"`) antes de grep/find.

- [ ] **Step 5: Verificar sintaxis de frontmatter YAML en todas las reglas**
Comprobar que todas tienen `paths:` bien formateado con listas válidas.

- [ ] **Step 6: Commit**
```bash
git add .claude/rules/
git commit -m "feat(claude): add path-scoped rules to minimize context load"
```

---

### Task 3: Actualizar y alinear `.agents/skills/` y `.codebase-memory/stamp.json`

**Files:**
- Modify: `.codebase-memory/stamp.json`
- Modify: `.agents/skills/code-graph/SKILL.md`
- Modify: `.agents/skills/matematika-diagram-generator/SKILL.md`
- Modify: `.agents/skills/matematika-content-generator/SKILL.md`

**Interfaces:**
- Consumes: MCP codebase-memory indexing name `home-izaro-Proiektuak-Matematika`.
- Produces: Corrected script paths and progressive disclosure in skills.

- [ ] **Step 1: Actualizar `.codebase-memory/stamp.json`**
Corregir el identificador del proyecto a `home-izaro-Proiektuak-Matematika`.

- [ ] **Step 2: Actualizar `.agents/skills/code-graph/SKILL.md`**
Documentar el identificador canónico `home-izaro-Proiektuak-Matematika` y los atajos más económicos en tokens (`get_code_snippet`, `search_graph`).

- [ ] **Step 3: Actualizar `.agents/skills/matematika-diagram-generator/SKILL.md`**
Corregir rutas de invocación de scripts a `.agents/skills/...` y confirmar importación canónica `@/diagrams/public`.

- [ ] **Step 4: Actualizar `.agents/skills/matematika-content-generator/SKILL.md`**
Corregir rutas de comandos a `.agents/skills/...` y alinear instrucciones de verificación.

- [ ] **Step 5: Comprobar symlink `.claude/skills`**
Verificar que `ls -la .claude/skills` sigue apuntando válidamente a `../.agents/skills`.

- [ ] **Step 6: Commit**
```bash
git add .codebase-memory/stamp.json .agents/skills/
git commit -m "chore(skills): sync codebase-memory project id and normalize skill script paths"
```

---

### Task 4: Crear el Atlas de Arquitectura `docs/architecture/map.md`

**Files:**
- Create: `docs/architecture/map.md`

**Interfaces:**
- Consumes: Estructura real de `src/`, `content/`, y scripts de `package.json`.
- Produces: Mapa de alta densidad de señal (~350 tokens) consumible por agentes en 1 lectura.

- [ ] **Step 1: Redactar `docs/architecture/map.md`**
Escribir el atlas de alta densidad conteniendo:
  - FSD Real en `src/`: responsabilidades exactas de cada subcarpeta (`app`, `design`, `components`, `lib`, `data`, `diagrams`, `fixed-pages`, `content-pages`, `i18n`).
  - Ubicación de contenidos (`content/mdx/`, `content/diagrams/`).
  - Fronteras prohibidas (`fixed-pages` vs `content-pages`).
  - Cheat-sheet de comandos rápidos vs de release.

- [ ] **Step 2: Validar longitud**
Asegurar que no exceda las 80 líneas para mantener el objetivo de ~350 tokens.

- [ ] **Step 3: Commit**
```bash
git add docs/architecture/map.md
git commit -m "docs(architecture): create high-density architecture atlas map.md"
```

---

### Task 5: Sanear documentos existentes en `docs/`

**Files:**
- Modify: `docs/README.md`
- Modify: `docs/architecture/fsd-design.md`
- Modify: `docs/architecture/diagram-engine.md`
- Modify: `docs/architecture/editor-engine.md`
- Modify: `docs/architecture/knowledge-graph.md`
- Modify: `docs/content/mdx-authoring-guide.md`
- Modify: `docs/quality-and-ci/validation-pipelines.md`
- Modify: `docs/testing/testing-strategy.md`

**Interfaces:**
- Consumes: Nueva estructura real del repositorio.
- Produces: Documentación con enlaces relativos 100% funcionales, cabeceras TL;DR y descripciones fácticas exactas.

- [ ] **Step 1: Reemplazar todas las URLs absolutas obsoletas**
Sustituir cada instancia de URLs absolutas a borradores antiguos por enlaces relativos (`../`, `./` o enlaces markdown relativos estándar).

- [ ] **Step 2: Reescribir `docs/architecture/fsd-design.md`**
Alinear el documento con la estructura real de `src/` (eliminando `widgets/`, `features/`, `entities/` de la raíz) y añadir bloque TL;DR al inicio.

- [ ] **Step 3: Actualizar `docs/architecture/diagram-engine.md`**
Reflejar la modularización v3 y `@/diagrams/public`, añadiendo bloque TL;DR.

- [ ] **Step 4: Añadir cabeceras TL;DR al resto de documentos de `docs/`**
Insertar en `editor-engine.md`, `knowledge-graph.md`, `mdx-authoring-guide.md`, `validation-pipelines.md`, `testing-strategy.md` un bloque de 3 líneas resumen indicando propósito y archivos clave.

- [ ] **Step 5: Actualizar `docs/README.md`**
Vincular el nuevo `docs/architecture/map.md` y verificar la tabla de contenidos.

- [ ] **Step 6: Commit**
```bash
git add docs/
git commit -m "docs: sanitize documentation, fix broken links, update FSD design and add TL;DR headers"
```

---

### Task 6: Verificación integral del sistema

**Files:**
- N/A (Verification suite)

**Interfaces:**
- Consumes: Todo el árbol de archivos modificado.
- Produces: Confirmación de cero regresiones, cero enlaces rotos y verificación rápida operativa.

- [ ] **Step 1: Verificar erradicación de URLs absolutas obsoletas**
Ejecutar:
```bash
grep -rn "Matematika_[D]rafts" docs/ .agents/ .claude/ AGENTS.md CLAUDE.md
```
Resultado esperado: 0 coincidencias.

- [ ] **Step 2: Verificar chequeo de tipos del repositorio**
Ejecutar:
```bash
npm run typecheck
```
Resultado esperado: Código 0 (sin errores de tipos).

- [ ] **Step 3: Ejecutar pruebas rápidas**
Ejecutar:
```bash
npm run test:fast
```
Resultado esperado: Todas las pruebas rápidas pasan.

- [ ] **Step 4: Verificar consulta de prueba en MCP `codebase-memory`**
Llamar a `get_architecture` o `search_graph` sobre `home-izaro-Proiektuak-Matematika` para verificar que la indexación y resolución de símbolos responden instantáneamente.
