# ReadingButton: label estable sin salto de layout

## Problema

Al marcar como leído, `ReadingButton` cambia el texto de «Marcar como Leído» a otro label más corto. El ancho del botón se reduce y el layout circundante salta. El hover del rombo es correcto; el fallo es de geometría del label.

## Objetivo

- Estado no leído: «Marcar como Leído»
- Estado leído: «Leído» (concordancia semántica con la acción)
- Ancho del botón constante entre estados
- Sin mover elementos vecinos; solo color, rombo y fade de texto
- Diff mínimo, un solo archivo

## Alcance

**In:** `src/content-pages/study-plan/ui/ReadingButton.tsx`  
**Out:** store, CSS global nuevo, props nuevas, tests (cambio trivial de presentación)

## Solución

Slot de texto fijo con dos labels en la misma celda CSS Grid:

1. Contenedor del label: `grid` con una sola celda; ambos textos en esa celda (`col-start-1 row-start-1`).
2. El texto más largo («Marcar como Leído») define el ancho intrínseco del slot en ambos estados.
3. Visibilidad: activo `opacity-100`; inactivo `opacity-0` + `pointer-events-none` (y `aria-hidden` en el inactivo).
4. Transición de opacity ~300–500ms, coherente con las transitions existentes del botón.
5. Rombo, hover, colores (`salvia` / `page-accent`) y `toggleRead` sin cambios de comportamiento.

## Criterio de éxito

Marcar y desmarcar no desplaza el botón ni el contenido alrededor; solo cambian color, rombo y el fade del label.

## No hacer

- `min-width` hardcodeado (frágil con breakpoints/fuentes)
- Cambiar el label a «Completado» u omitir el cambio de texto
- Extraer componente nuevo o utilidades globales sin necesidad
