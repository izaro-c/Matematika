# Fase 5 — Migración de casos matemáticos complejos

## Resultado

Cuatro diagramas reales demuestran que el nuevo lenguaje cubre geometría, medidas, curvas, pasos y reactividad sin perder fidelidad ni conexiones MDX.

El estado vigente se consulta en la [matriz canónica](README.md#fuente-canónica-de-estado).

## Skills y contexto

- `project-philosophy`
- `diagrama`
- `page-creator` cuando cambie cualquier MDX

## Casos de aceptación

1. Pitágoras: cuadrados o cuadrículas, áreas, textos dinámicos, pasos y resaltados.
2. Disco de Poincaré: geodésicas curvas, restricciones y encuadre completo.
3. Congruencia: líneas de medida, marcas de igualdad, ángulos, cotas y texto reactivo.
4. Cuadrilátero complejo: puntos derivados, dependencias, capas y varios pasos.

## Criterios de aceptación

- Se preservan IDs públicos, `targetId`, interacción y semántica matemática.
- Cada caso se edita, guarda y reabre sin pérdida.
- El viewport muestra el contenido completo y permite recuperarlo.
- Si aparece una carencia del modelo se corrige en la capa común; no se introduce un parche exclusivo engañoso.
- Un caso no representable permanece explícitamente en código con preview.

## Validación

- Pruebas visuales o snapshots estables.
- Tests de interacción, restricciones, pasos, targets y roundtrip.
- Comprobación de todas las páginas MDX consumidoras.
- Validadores de referencias, grafo y contenido si se modifica MDX.
- Gates completos del editor y `git diff --check`.

## Fuera de alcance

No se migran en masa los 85 diagramas sin una estrategia separada y evidencia de fidelidad.
