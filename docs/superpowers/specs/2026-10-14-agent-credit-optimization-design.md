# Especificación de Diseño: Optimización de Consumo de Créditos y Tokens para Agentes

**Fecha:** 2026-10-14  
**Estado:** Aprobado para implementación  
**Objetivo:** Reducir al mínimo el consumo de créditos y tokens de agentes de IA (Claude Code, Antigravity) manteniendo una calidad y rigor técnico máximos en las respuestas.

---

## 1. Contexto y Diagnóstico

### 1.1 Problemas detectados en la estructura actual
1. **Ausencia de directivas raíz (`AGENTS.md` / `CLAUDE.md`)**: Los agentes inician cada sesión sin orientación de bajo nivel, recurriendo a escaneos exploratorios masivos de archivos y carpetas (`find`, `grep` recursivos, lecturas completas de directorios) que devoran tokens.
2. **Documentación técnica desactualizada con enlaces rotos**: Varios documentos en `docs/` (`fsd-design.md`, `diagram-engine.md`, `validation-pipelines.md`, etc.) contienen enlaces absolutos a un entorno antiguo (`file:///home/izaro/Proiektuak/Matematika_Drafts/...`) y describen capas que ya no existen en la raíz de `src/` (como `widgets/`, `features/`, `entities/`). Esto desorienta a los agentes, provocando alucinaciones y reintentos fallidos.
3. **Falta de aprovechamiento del grafo de código MCP**: Aunque `codebase-memory-mcp` está disponible e indexado, los agentes desconocen su existencia o el identificador del proyecto (`home-izaro-Proiektuak-Matematika`), recurriendo a `grep` y lecturas de archivos TypeScript para consultas que el grafo resuelve en una única llamada compacta.
4. **Ejecución indiscriminada de comandos de verificación pesados**: Invocación de `npm run test` (que incluye pruebas E2E/pesadas) en lugar de variantes rápidas (`npm run test:fast`, `npm run typecheck` o vitest focalizado).

---

## 2. Arquitectura de la Solución (3 Capas)

```
┌─────────────────────────────────────────────────────────────────┐
│ Capa 1: Puntos de entrada raíz ultraligeros                     │
│  - AGENTS.md (estándar universal, < 45 líneas, sin prosa extra) │
│  - CLAUDE.md (enlace directo a AGENTS.md + reglas modulares)     │
└────────────────────────────────┬────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────┐
│ Capa 2: Reglas contextuales condicionales y skills compartidas  │
│  - .claude/rules/diagrams.md (paths: diagrams/**)               │
│  - .claude/rules/content-mdx.md (paths: content/mdx/**)         │
│  - .claude/rules/editor-engine.md (paths: editor/**)            │
│  - .claude/rules/codebase-navigation.md (paths: src/**, etc.)   │
│  - .agents/skills/ (sincronizadas, punteros limpios y scripts)   │
└────────────────────────────────┬────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────┐
│ Capa 3: Atlas canónico y documentación saneada                  │
│  - docs/architecture/map.md (atlas de alta densidad, ~350 tokens)│
│  - docs/ saneado: enlaces relativos, TL;DR de 3 líneas por doc, │
│    corrección de la arquitectura real de src/ y motor v3         │
└─────────────────────────────────────────────────────────────────┘
```

---

## 3. Especificación Detallada de Componentes

### 3.1 Capa 1: `AGENTS.md` y `CLAUDE.md`

#### `AGENTS.md`
Archivo raíz de contexto permanente. Debe cumplir los principios de *writing-for-agents*:
- Máximo 45 líneas.
- **Puntero canónico de arquitectura**: remite a `docs/architecture/map.md` y `src/README.md`.
- **Regla de oro de búsqueda**: Prohibido el `grep` de símbolos o firmas TypeScript en `src/`. Usar MCP `codebase-memory` (`project: "home-izaro-Proiektuak-Matematika"`).
- **Regla de lectura quirúrgica**: Usar `get_code_snippet` o rangos específicos de `view_file`. Prohibido volcar archivos completos innecesariamente.
- **Protocolo de verificación rápida**:
  - Tipos: `npm run typecheck`
  - Tests rápidos: `npm run test:fast`
  - Test unitario específico: `npx vitest run <ruta-del-test>`
  - Prohibido correr `npm run test` completo o `npm run dev` en tareas acotadas.

#### `CLAUDE.md`
- Apunta a `AGENTS.md` como fuente de verdad y habilita el uso de las reglas específicas en `.claude/rules/`.

---

### 3.2 Capa 2: Reglas Contextuales y Skills

#### `.claude/rules/`
Archivos modulares con cabecera `paths` que Claude Code inyecta únicamente cuando se tocan archivos que cumplen el patrón:

1. **`diagrams.md`**
   - **`paths`**: `["src/diagrams/**", "content/diagrams/**", "tests/diagrams/**", "tests/features/editor/diagrams/**"]`
   - **Directivas**:
     - Esquema v3 obligatorio (`createDiagramSpec`).
     - Importación canónica desde `@/diagrams/public`.
     - Paleta de tokens oficial (`carbon`, `terracota`, `canela`, `mora`, `ocre`, `pavo`, `granada`, `musgo`).
     - Nunca ocultar la figura base en `steps` (usar resaltes de énfasis).
     - Verificación rápida: `npx tsx .agents/skills/matematika-diagram-generator/scripts/verify-diagram.ts <archivo>`.

2. **`content-mdx.md`**
   - **`paths`**: `["content/mdx/**"]`
   - **Directivas**:
     - Paridad trilingüe estricta 1:1 (`es/`, `en/`, `eu/`). Mismos `<ConceptLink>`, mismos `isDependency`.
     - `targetId` inmutable en kebab-case neutro/castellano.
     - Causalidad DAG estricta (no dependencias circulares, no dependencia desde teorema hacia su demostración).
     - Verificación rápida: `node .agents/skills/matematika-content-generator/scripts/check-parity.mjs <id>`.

3. **`editor-engine.md`**
   - **`paths`**: `["src/fixed-pages/editor/**", "tests/features/editor/**", "scripts/editor/**"]`
   - **Directivas**:
     - Edición sin pérdidas (*lossless* AST por offsets de caracteres).
     - Prohibición de efectos secundarios no autorizados y llamadas `fetch` en UI.
     - Verificación: `npm run editor:safety:check` y `npm run editor:test:unit`.

4. **`codebase-navigation.md`**
   - **`paths`**: `["src/**", "tests/**", "scripts/**"]`
   - **Directivas**:
     - Prioridad de MCP `codebase-memory`: `search_graph` → `trace_path` → `get_code_snippet`.
     - No usar escaneo recursivo ni `grep` para análisis de tipos o imports en TypeScript.

#### `.agents/skills/`
- Enlace `.claude/skills -> ../.agents/skills` mantenido como fuente única.
- Sincronizar referencias internas de scripts hacia `.agents/skills/...`.
- Actualizar `.codebase-memory/stamp.json` con el nombre de proyecto correcto `home-izaro-Proiektuak-Matematika`.

---

### 3.3 Capa 3: Atlas Canónico y Saneamiento de `docs/`

#### 1. `docs/architecture/map.md` (Nuevo Atlas)
Documento ultra-compacto (< 80 líneas, ~350 tokens) que describe:
- Estructura real de `src/`:
  - `app/`: Entrada, providers, rutas (`wouter`), estilos globales.
  - `design/`: Tokens de diseño "Arts and Crafts", variables CSS, KaTeX.
  - `components/`: UI reutilizable.
  - `lib/`: Stores Zustand (`MathStore`, `GlossaryStore`), hooks, contextos.
  - `data/`: `ContentStore`, esquemas Zod.
  - `diagrams/`: Motor de diagramas (v3 spec, geometry, jsxgraph runtime, render).
  - `fixed-pages/`: Páginas fijas (`home`, `graph`, `glossary`, `mathematicians`, `editor`).
  - `content-pages/`: Renderizado de tipos de contenido MDX.
  - `i18n/`: Diccionarios y utilidades de idioma.
- Límites arquitectónicos duros: `fixed-pages` y `content-pages` no se importan mutuamente.
- Cheat-sheet de verificación rápida por contexto.

#### 2. Saneamiento de documentos existentes en `docs/`
- Eliminar todas las URLs absolutas `file:///home/izaro/Proiektuak/Matematika_Drafts/...` y sustituirlas por rutas relativas limpias.
- Actualizar `docs/architecture/fsd-design.md`: reflejar la estructura real de carpetas en `src/`.
- Actualizar `docs/architecture/diagram-engine.md`: reflejar la arquitectura v3 modularizada y el punto de exportación `@/diagrams/public`.
- Añadir en la cabecera de cada documento de `docs/` un bloque **TL;DR (3 líneas)** con el resumen y los archivos clave para evaluación ultrarrápida.
- Actualizar `docs/README.md` como índice central limpio.

---

## 4. Plan de Verificación

1. **Verificación de archivos y enlaces**:
   - `grep -rn "Matematika_Drafts" docs/ .agents/ .claude/` debe devolver 0 resultados.
   - Comprobar que no existen enlaces rotos entre `AGENTS.md`, `CLAUDE.md`, `.claude/rules/` y `docs/`.
2. **Validación de tipos y linting**:
   - `npm run typecheck`
   - `npm run lint`
3. **Validación de tests rápidos del repositorio**:
   - `npm run test:fast`
4. **Verificación del Grafo de Código**:
   - Consulta de prueba mediante MCP `codebase-memory` (`get_architecture` o `search_graph`) confirmando que responde adecuadamente con el identificador `home-izaro-Proiektuak-Matematika`.
