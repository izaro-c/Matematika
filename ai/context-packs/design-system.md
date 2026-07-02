# Context pack: sistema de diseño

## Cuándo usarlo

Para migrar tokens, consolidar patrones visuales o revisar consistencia transversal.

## Herramienta recomendada

Codex; Gemini puede contrastar una hipótesis visual concreta.

## Archivos que debe leer

- `AGENTS.md`, `ai/current-state.md` y `ai/goals/ui-product.md`.
- `ai/indexes/design-token-map.json` y `component-map.json`.
- Fuentes canónicas de tokens y consumidores incluidos en el alcance.

## Archivos que puede modificar

Tokens, estilos, componentes y tests expresamente enumerados.

## Archivos prohibidos

MDX, Lean, generados, dependencias y consumidores no inventariados.

## Comandos mínimos de validación

```bash
npm run typecheck
npm run lint
npm run test -- <test-relacionado>
npm run ai:review
```

## Criterios de aceptación

- No aparecen colores o tokens paralelos.
- Modo oscuro, contraste y estados interactivos conservan su semántica.
- La migración enumera consumidores cubiertos y remanentes.

## Riesgos típicos

Reemplazos léxicos incorrectos, cambios visuales silenciosos, fallbacks arbitrarios y alcance masivo.

## Prompt corto recomendado

> Declara objetivo, alcance, archivos permitidos/prohibidos, validaciones y resultado esperado. Migra `[token/patrón]` en `[rutas]` hacia la fuente canónica Arts & Crafts. Inventaría consumidores, aplica el cambio mínimo y reporta cobertura, validaciones y remanentes.
