# Estado actual de la infraestructura IA

**Actualizado:** 2026-07-11

**Fase:** estabilización del editor — fases 0–3 corregidas y contenidas

**Estado:** el source MDX completo es la autoridad del editor; envelope y body son rangos literales. El corpus de 120 documentos pasa el gate de apertura, proyección, cambios de modo y tres ciclos sin cambios de bytes. La persistencia visual continúa deshabilitada.

## Decisiones vigentes

- `AGENTS.md` es la entrada común; `docs/ai/` gobierna, `ai/` opera y `.agents/skills/` especializa.
- `EditorDocument.source` es la única autoridad del MDX abierto.
- El parser del editor usa el subconjunto sintáctico del build: MDX, GFM y matemáticas, sin ejecutar metadata.
- Metadata, imports y exports no son bloques del body y se preservan como slices del source.
- Solo párrafos y headings simples admiten parches localizados; los demás nodos son opacos.
- El guardado visual, la edición visual de metadata y las operaciones estructurales permanecen bloqueados.
- El guardado manual en código envía exactamente el source actual y comprueba la respuesta HTTP.

## Próximo paso

Fase 4 — persistencia transaccional del source candidato con control de revisión y conflicto. No corresponde iniciar todavía la modularización de `EditorPage` ni el workbench de diagramas.

## Deuda visible

- Retirar físicamente el parser legacy y los hooks `useEditorState`/`useEditorActions`, actualmente sin consumidores productivos, en una tarea con alcance sobre `src/features/editor/hooks/` y sus flujos de creación de archivos.
- Mantener bloqueadas las operaciones de insertar, mover, eliminar y editar metadata hasta que dispongan de parches localizados y contratos de persistencia transaccional.
- Resolver las 170 advertencias preexistentes de Dependency Cruiser fuera de esta corrección; el ciclo dentro de `editor/document` ya se eliminó.
