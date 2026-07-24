# Geometría inspector UX — design

**Date:** 2026-07-24  
**Status:** Approved for planning  
**Scope:** Pestaña Geometría del inspector de **puntos** (Relaciones geométricas, Snap y magnetismo, Posición calculada)

## Goal

Hacer la pestaña Geometría limpia, cohesiva e intuitiva, y **impedir opciones imposibles** (no ofrecer y luego mostrar error). Incluye elegir referencias en el lienzo además del desplegable filtrado.

## Decisions

| Tema | Decisión |
|------|----------|
| Prioridad | Prevención de inválidos **y** cohesión visual en la misma pasada |
| Opciones inválidas | **Híbrido:** ocultar entidades incompatibles; si falta prerequisito de escena o hay conflicto, mostrar la relación **disabled** con motivo |
| Referencias | Select filtrado + **clic en lienzo** |
| Enfoque | Catálogo de compatibilidad + campos unificados (no parches sueltos ni wizard) |

## Architecture

### Compatibility catalog (`relationSlots.ts`)

Módulo junto a `constraintOptions` / `relationCompatibility` que es la única fuente de verdad para slots y candidatos:

- Por cada `kind`: slots (`index`, label, `allowedKinds`: point | segment | line | circle | …).
- APIs:
  - `slotsFor(kind)` → labels y estructura UI
  - `candidatesForSlot(model, kind, index, refs)` → solo entidades válidas (**sin** fallback a “todos los puntos y elementos”)
  - `relationAvailability(model, kind, targetId, activeKinds)` → `{ status: 'ready' | 'disabled', reason? }`
- Sustituye el catch-all de `referenceCandidates` en `DiagramConstraintEditor`.
- Ejemplo: `distance` → slot de referencia = solo puntos (excluye el propio).

### `RelationSlotField`

Campo reutilizable al añadir y editar:

- Label del slot + `<select>` solo con candidatos válidos.
- Botón «Elegir en lienzo» → modo temporal (hint en status bar); clic en entidad compatible asigna; incompatibles no mutan el modelo (feedback suave).
- Escape / segundo clic en el botón cancela.
- Sin candidatos: select vacío + mensaje accionable (p. ej. «Añade otro punto primero»).

### Visual shell

Patrón único vía `DiagramPanel` (Arts & Crafts: carbon / pavo / ocre / lienzo):

1. Coordenadas + modo de movimiento  
2. Bloque del modo (Relaciones **o** Posición calculada)  
3. Snap y magnetismo (colapsable; solo Libre / Relaciones) al final  

Menos cajas anidadas; badges solo de estado. Snap: fieldsets cuadrícula | magnetismo; parámetros de atracción solo con atractores.

## Hybrid prevention rules

1. Entidades incompatibles: no en select ni aceptables en lienzo.  
2. Relación sin prerequisito de escena: visible en picker, **disabled** + motivo; «Añadir» disabled.  
3. Conflicto con relaciones activas: igual (reusa `getConstraintConflictReason`).  
4. Nunca flujo “elige → error rojo después”. Legacy corrupto → recuperación («Quitar» / «Elegir otra referencia»).

## Testing

- Unit: `candidatesForSlot` por kind (p. ej. `distance` sin elementos).  
- Unit: `relationAvailability` ready vs disabled.  
- UI: no añadir relación disabled; select de distancia sin rectas.  
- Lienzo: clic válido asigna; inválido no cambia modelo.

## Out of scope

- Rediseño Geometría de segmentos/ángulos (el catálogo debe ser reutilizable después).  
- Wizard multi-paso al añadir relación.  
- Cambios del motor de resolución geométrica.

## Success criteria

- No se pueden seleccionar referencias de tipo incorrecto para una relación.  
- No se puede añadir una relación que el sistema ya sabe que fallará por prerequisitos o conflictos.  
- Los tres bloques de Geometría se sienten del mismo sistema visual.  
- El usuario puede asignar referencias por clic en lienzo.
