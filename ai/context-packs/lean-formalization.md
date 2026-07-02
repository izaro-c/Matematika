# Context pack: formalización Lean

## Cuándo usarlo

Para crear o modificar Lean, enlazar `leanId` o revisar divergencias Lean–MDX.

## Herramienta recomendada

Codex con Lean disponible.

## Archivos que debe leer

- `AGENTS.md`, `ai/current-state.md` y `ai/goals/pedagogy.md`.
- Skills `lean-formalizer` y, si cambia MDX, `page-creator`.
- `ai/indexes/lean-map.json`, `graph-map.json`, declaración y página objetivo.

## Archivos que puede modificar

Declaraciones bajo `lean/Matematika/`, metadata MDX enlazada y deuda bridge autorizada.

## Archivos prohibidos

Mathlib, pruebas ajenas, generados editados a mano, diagramas y estados visuales de la traza.

## Comandos mínimos de validación

```bash
npm run validate-no-mathlib
npm run validate-lean
npm run content:coverage
npm run bridge:audit
```

## Criterios de aceptación

- Compila desde axiomas propios y el enunciado coincide con MDX.
- Anotaciones, dependencias y bloques de táctica son trazables.
- `sorry` o `admit` no se presentan como `proved`; la deuda bridge queda explícita.

## Riesgos típicos

Certificados falsos, `leanId` inventado, dependencia de Mathlib y pérdida de pedagogía MDX.

## Prompt corto recomendado

> Declara objetivo, alcance, archivos permitidos/prohibidos, validaciones y resultado esperado. Carga `lean-formalizer` y formaliza `[declaración]` desde Matematika Core, sin Mathlib. Mantén alineados Lean y MDX, regenera solo con comandos oficiales y reporta estado real y deuda.
