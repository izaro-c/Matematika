# Context pack: exploración de UI

## Cuándo usarlo

Para explorar un flujo o interacción antes de integrar código de producto.

## Herramienta recomendada

Antigravity para la propuesta; Codex para una integración aprobada.

## Archivos que debe leer

- `AGENTS.md`, `ai/current-state.md` y `ai/goals/ui-product.md`.
- `ai/indexes/component-map.json` y `design-token-map.json`.
- Componentes, estados y tokens directamente relacionados.

## Archivos que puede modificar

Solo el prototipo o las rutas UI aprobadas y, al integrar, sus tests.

## Archivos prohibidos

Contenido MDX, Lean, generados, schemas, datos y rutas ajenas al flujo.

## Comandos mínimos de validación

```bash
npm run typecheck
npm run test -- <test-ui-relacionado>
npm run ai:review
```

## Criterios de aceptación

- Cubre estado normal, carga, vacío, error, foco, teclado, móvil y modo oscuro aplicables.
- Reutiliza componentes y tokens Arts & Crafts.
- La propuesta identifica qué es exploratorio y qué está listo para integrar.

## Riesgos típicos

Confundir maqueta con implementación, inventar tokens, ignorar estados y añadir movimiento sin función.

## Prompt corto recomendado

> Declara objetivo, alcance, archivos permitidos/prohibidos, validaciones y resultado esperado. Explora `[flujo]` usando patrones existentes; entrega una propuesta acotada con estados, accesibilidad y tokens. No integres fuera de `[rutas]` ni presentes el prototipo como código final.
