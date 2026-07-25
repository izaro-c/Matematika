# Editor V2 canvas stage — design

**Date:** 2026-07-25  
**Status:** Approved for planning  
**Scope:** Área de lienzo del editor nuevo (`editor_v2`): sizing/viewport correcto y chrome UI/UX propio. No reutilizar código ni diseño visual del editor viejo (`DiagramCanvas`, `DiagramResponsivePreview`, docks del workbench v1).

## Goal

Sustituir el lienzo actual (wrapper del canvas v1) por un **stage V2 desde cero** que:

1. Monte el board con caja medible y estable (sin vacío, corte o resize roto).
2. Ofrezca chrome flotante coherente con el resto del editor V2.
3. Separe **modo editor** (sin marcos de dispositivo) de **modos publication** (desktop/tablet/móvil) donde el viewport del diagrama coincide con el **tamaño de contenido** en ese dispositivo — no con el chasis entero.

## Decisions

| Tema | Decisión |
|------|----------|
| Enfoque | Shell V2 + `DiagramRenderer` compartido directo (sin `DiagramCanvas`) |
| Desktop publication | También tiene publication frame (mock de página), no artboard desnudo |
| Tamaño en publication | Content CSS box del breakpoint; bezel es adorno fuera del content |
| Editabilidad | Editable en editor y en todos los publication frames |
| Controles nativos del renderer | Apagados (`viewportControls` / `stepControls` false); manda chrome V2 |
| Header frame selector | `editor` \| `desktop` \| `tablet` \| `mobile` |

## Architecture

### Piezas (todas bajo `src/features/editor_v2/ui/`)

| Pieza | Rol |
|-------|-----|
| `V2CanvasStage` | Orquesta surface, modo, frame, chrome y board; reemplaza `V2CanvasArea` |
| `V2WorkshopSurface` | Fondo de taller del área central (textura/rejilla sutil Arts & Crafts) |
| `V2PublicationFrame` | Solo en `publication:*`: bezel + mock MDX; content box = tamaño real del contenido en dispositivo |
| `V2BoardHost` | Contenedor con `ResizeObserver`; monta `DiagramRenderer` (`mode: 'editor'`) solo con tamaño > 0 |
| `V2CanvasChrome` | Docks flotantes: herramienta, pasos, vista (rejilla/ejes/centrar/filtro) |

### Modos del stage

- **`editor`** — Sin marcos de dispositivo. Fondo de taller + hoja de trabajo centrada; board editable al tamaño útil del hueco (márgenes ~24–32px).
- **`publication:desktop|tablet|mobile`** — Mock de publicación. Viewport del diagrama = content box del breakpoint. Si el stage es más estrecho, se escala el **frame entero** (no un resize a medias del board). Diagrama embebido y editable.

### Flujo de datos

```
EditorV2Main
  → V2CanvasStage (model, tool, selection, step, frameMode)
    → V2BoardHost (model → spec vía adaptador de datos existente)
      → DiagramRenderer (callbacks V2: select, point/annotation move, point create, viewport)
    → V2CanvasChrome (slots de herramienta / pasos / vista)
```

- Adaptadores de **datos** model↔spec pueden vivir en módulos compartidos o `editor/diagrams/model`; la **UI y el host** son 100% V2.
- Prohibido importar: `DiagramCanvas`, `DiagramResponsivePreview`, y chrome/UI del workbench v1.
- Lógica de refs/slots de herramienta (`refsNeededForTool`, candidatos, complete/cancel) se cablea en stage/chrome.

### Layout y sizing

**Editor**

- Stage = 100% del hueco central.
- Hoja centrada: `min(100% − márgenes, maxWidth)` × altura disponible.
- `V2BoardHost` observa el rect del área de diagrama; no monta board con altura 0.

**Publication**

- Content widths de referencia (orientativos, fijar en implementación): desktop ~720–880px útil; tablet ~768; móvil ~390.
- Mock MDX (título + líneas placeholder) dentro del content box; el host del diagrama tiene altura explícita (ratio o `min(42vh, 22rem)`).
- Bezel/notch/chrome del dispositivo **no** entran en el tamaño del renderer.

**Viewport geométrico**

- `bounds` / `home` del modelo mandan.
- “Centrar” restaura `home`.
- Resize del stage → `ResizeObserver` → actualizar tamaño del board **sin** resetear bounds (salvo Centrar).

### Chrome UI/UX

| Dock | Posición | Contenido |
|------|----------|-----------|
| Herramienta | top-left | Icono, instrucción, progreso de refs, cancelar; picker de candidatos |
| Pasos | top-right | Prev / label / next + “Todos”; solo si hay steps |
| Vista | bottom-left | Rejilla · Ejes · Centrar · Filtrar paso (si aplica) |
| Modo | header V2 | Editor / Desktop / Tablet / Móvil |

Estilo: lienzo translúcido, borde carbon suave, tipografía serif/mono V2, hit-targets ≥32px, `pointer-events` solo en docks. En publication, etiqueta discreta del modo en la barra del mock.

### Errores

- Sin model → empty state V2.
- Host sin tamaño medible → no montar board; skeleton en la caja.
- Fallo de render → mensaje en el content box; el stage no cae.

## Out of scope

- Rediseñar toolbar, inspector, scene tree o header más allá del selector de modo de frame.
- Cambiar el pipeline de geometría / `DiagramRenderer` / `useBoardLifecycle` salvo lo necesario para sizing y callbacks.
- Portar o copiar layouts del editor v1.

## Testing

- Host: caja no-cero; remount/update tras resize.
- Modos: `editor` sin frame de dispositivo; `publication:*` content-size (assert anchos de content, no de chasis).
- Chrome: docks según tool/steps.
- Interacción: select + crear punto en `editor` y en al menos un publication frame.

## Success criteria

1. El board se ve y reacciona al resize en modo editor sin vacío ni corte.
2. Publication frames muestran el diagrama al tamaño de contenido del dispositivo; editables.
3. Chrome V2 coherente con el resto del editor; cero dependencia UI del canvas v1.
