# Épica: editor completo de documentos y diagramas

## Propósito

Convertir el editor estabilizado en una herramienta de autoría intuitiva, visual y segura para documentos MDX y diagramas matemáticos complejos. La interfaz debe ayudar a encontrar, comprender y modificar contenido sin ocultar pérdidas de fidelidad ni rebajar el rigor matemático.

Esta épica sucede a [`../editor-stabilization.md`](../editor-stabilization.md), pero tiene numeración propia. La estabilización anterior es la línea base técnica; no implica que las capacidades de autoría descritas aquí ya existan.

## Fuente canónica de estado

Esta tabla es la única fuente de verdad del estado de la épica. Las fichas de fase definen el trabajo, pero no duplican el estado para evitar divergencias.

| Fase | Resultado | Estado | Evidencia o siguiente condición |
| --- | --- | --- | --- |
| [0](phase-0-capability-truth.md) | Catálogo seguro y capacidades reales | **Cerrada** | Cierre y gates registrados en [`../../current-state.md`](../../current-state.md), 2026-07-13 |
| [1](phase-1-information-architecture.md) | Arquitectura visual y navegación | **Cerrada** | Cierre, decisiones, deuda y gates registrados en [`../../current-state.md`](../../current-state.md), 2026-07-13 |
| [2](phase-2-diagram-spec-v2.md) | `DiagramSpec v2` y renderer compartido | **Cerrada** | Cierre, decisiones, deuda y gates registrados en [`../../current-state.md`](../../current-state.md), 2026-07-13 |
| [3](phase-3-geometry-language.md) | Lenguaje geométrico completo | **Pendiente** | Fase 2 cerrada; siguiente fase elegible, todavía no iniciada |
| [4](phase-4-steps-and-interaction.md) | Pasos, interacción y demostraciones | **Pendiente** | Requiere Fase 3 cerrada |
| [5](phase-5-acceptance-migrations.md) | Migración de casos matemáticos complejos | **Pendiente** | Requiere Fase 4 cerrada |
| [6](phase-6-lossless-mdx-engine.md) | Motor MDX estructural y lossless | **Pendiente** | Requiere Fase 5 cerrada y preservar la línea base lossless |
| [7](phase-7-mdx-authoring-ux.md) | Experiencia visual del editor MDX | **Pendiente** | Requiere Fase 6 cerrada |
| [8](phase-8-quality-and-governance.md) | Calidad, accesibilidad y cierre | **Pendiente** | Requiere Fases 0–7 cerradas |

Estados permitidos: `pendiente`, `en progreso`, `en validación`, `bloqueada` y `cerrada`.

## Orden y conversaciones

Se utiliza una conversación nueva por fase y se trabaja sobre el mismo repositorio. Una conversación puede contener tantos turnos de implementación y corrección como sean necesarios. La fase siguiente no comienza hasta que la anterior esté cerrada en esta matriz.

Al iniciar una fase, el agente debe:

1. Leer `AGENTS.md`, `ai/current-state.md`, `ai/goals/ui-product.md`, esta página y únicamente la ficha de la fase activa.
2. Cargar las skills indicadas en la ficha.
3. Inspeccionar `git status` y el código real; preservar trabajo ajeno y no editar artefactos generados.
4. Declarar alcance, rutas permitidas y prohibidas, validaciones y resultado esperado.
5. Cambiar el estado a `en progreso` solo cuando comience trabajo real.

Al cerrar una fase, el agente debe:

1. Demostrar todos sus criterios de aceptación con código, pruebas o evidencia visual reproducible.
2. Registrar comandos y resultados; una afirmación histórica no sustituye una ejecución necesaria.
3. Actualizar esta matriz y `ai/current-state.md` en el mismo cambio.
4. Dejar deuda explícita sin convertirla en un cierre ficticio.
5. No abrir ni adelantar trabajo de la fase siguiente.

## Invariantes de toda la épica

- El source completo sigue siendo la autoridad y ninguna edición puede perder contenido silenciosamente.
- La compatibilidad se declara de forma conservadora: visual exacta, código con preview, interna o inválida.
- Editor, preview y publicación deben converger en una sola semántica de renderizado.
- Los diagramas respetan `MathBoard`, `MathFactory`, stores, FSD y la paleta Arts & Crafts.
- Los documentos respetan schemas, enlaces semánticos, orden topológico y rigor Greenberg/Hilbert.
- Los IDs públicos y `targetId` se conservan durante migraciones salvo decisión documentada.
- Las capacidades imposibles se ocultan o se presentan como solo lectura; no se simula funcionalidad.
- Accesibilidad, teclado, estados de error y responsive forman parte del resultado, no una corrección opcional final.

## Validación transversal

Cada ficha define pruebas dirigidas. Al cerrar una fase de producto se sigue además el orden de `npm run full-check`. Los comandos costosos pueden ejecutarse al final, pero los fallos relacionados bloquean el cierre. `git diff --check` es obligatorio para cambios documentales.
