# Estado actual de la infraestructura IA

**Actualizado:** 2026-07-13

**Fase:** Fase 1 — Arquitectura visual y navegación, cerrada.

**Estado:** El editor dispone de una arquitectura de información centrada en recursos. Los 120 documentos MDX y los 85 diagramas finales del catálogo seguro de Fase 0 se presentan en secciones inequívocas, con búsqueda y filtros combinables por nombre, tipo, estado y capacidad. La interfaz no declara edición visual para los 85 diagramas actuales: todos siguen siendo código TSX autoritativo con vista previa real.

## Roadmap activo

La fuente canónica del estado y alcance de la épica es [`phases/editor-authoring/README.md`](phases/editor-authoring/README.md). Las Fases 0 y 1 están cerradas. La siguiente fase elegible es la [Fase 2 — `DiagramSpec v2` y renderer compartido](phases/editor-authoring/phase-2-diagram-spec-v2.md), todavía pendiente y no iniciada.

## Garantías cerradas en la Fase 1

- El explorador separa `Documentos` y `Diagramas` como entradas primarias, conserva la agrupación por tipo y muestra en cada recurso su capacidad real.
- La búsqueda y los filtros de tipo, estado y capacidad se combinan sin alterar el catálogo seguro. Los estados vacíos distinguen catálogo vacío de filtros sin resultados.
- Los ocho recursos recientes, los favoritos, el nivel de interfaz y los tamaños de panel se conservan en un contrato `localStorage` versionado, acotado y tolerante a datos corruptos. No se promete sincronización entre dispositivos.
- El shell contiene explorador/estructura, área de trabajo, inspector contextual y diagnósticos/actividad. Los tres paneles auxiliares se colapsan; los paneles laterales y el inferior se redimensionan por puntero o teclado.
- Los niveles básico y avanzado comparten las mismas operaciones. El avanzado añade rutas y detalles técnicos; no crea una segunda semántica de edición.
- Carga, error de catálogo, error de lectura, vacío, solo lectura, cambios pendientes, validación bloqueante, guardado, error de red y conflicto externo tienen presentaciones explícitas.
- La navegación admite foco visible, flechas entre recursos y atajos para buscar recursos, alternar modo de edición y abrir o cerrar explorador, inspector y diagnósticos.
- En móvil, explorador e inspector funcionan como paneles superpuestos; el área de trabajo y la barra de acciones se adaptan sin desbordamiento horizontal de página.
- Toda la nueva interfaz usa exclusivamente tokens de la paleta Arts & Crafts y mantiene la matemática como foco visual.

## Preservación de la Fase 0

- El catálogo real permanece en 120 documentos MDX y 85 diagramas finales; los recursos internos continúan excluidos.
- Los 85 diagramas siguen clasificados como edición de código con vista previa y no exponen regeneración visual parcial.
- El código fuente completo continúa siendo la autoridad, el roundtrip MDX sigue siendo lossless y los guardados conservan revisión, conflicto y copia de seguridad.
- No se añadieron objetos geométricos, un renderer alternativo, creación estructural ni enlaces visuales no lossless.

## Evidencia de aceptación

- Suite completa del editor: 30 archivos y 237 pruebas aprobadas; la Fase 1 añade 3 archivos y 9 pruebas dirigidas de navegación, filtros, persistencia, paneles, estados y teclado.
- E2E real del editor: 16/16 recorridos aprobados, incluidos autoridad MDX/TSX, red, conflictos, cambios pendientes, filtros, paneles, teclado y responsive.
- Evidencia visual reproducible: recorridos verificados a 1440 × 900 y 390 × 844; la captura móvil confirma el explorador superpuesto y el gate comprueba ausencia de desbordamiento horizontal.
- `editor:full-check`: artefactos generados deterministas, roundtrip 120/120, lint dirigido, 125 pruebas unitarias, 79 de integración, arquitectura, seguridad, TypeScript y build aprobados. El gate de artefactos se comprobó con un índice Git temporal sin modificar el staging real.
- `full-check`: 54 archivos y 581 pruebas, Dependency Cruiser, referencias, grafo, Lean, cobertura de 120 contenidos y auditoría bridge aprobados.
- `editor:lint`: 118 advertencias históricas dentro del presupuesto de 119; los componentes nuevos de Fase 1 no añaden advertencias. Dependency Cruiser conserva 56 advertencias históricas y 0 errores.
- `git diff --check`: aprobado.

## Decisiones de UX

- Se prioriza el tipo de recurso antes que la estructura física del repositorio.
- “Código + vista previa” explica una limitación real; no se presenta como una edición visual degradada.
- Recientes y favoritos son accesos rápidos, mientras el árbol agrupado sigue siendo la estructura canónica del catálogo.
- El inspector responde al recurso abierto: metadatos y conexiones para MDX; usos y autoridad del código para diagramas.
- El panel inferior concentra validación y estado de la sesión para no competir permanentemente con el documento.
- El nivel avanzado revela contexto técnico, pero todas las acciones siguen en los mismos controles y contratos.

## Deuda explícita fuera de la Fase 1

- Las preferencias de interfaz son locales al navegador; no existe sincronización de favoritos o recientes entre dispositivos.
- La actividad inferior describe la sesión actual, no un historial persistente de revisiones.
- Ningún diagrama existente tiene todavía modelo visual exacto. Ampliar el contrato y unificar renderer corresponde a la Fase 2.
- La vista previa de código continúa ejecutando la última versión guardada, garantía heredada de Fase 0.
- `EditorPage` concentra todavía la orquestación del editor y el chunk de producción del editor supera 500 kB; su partición es deuda de calidad, no autorización para adelantar Fase 2.
- Se mantienen las advertencias históricas de lint, arquitectura, referencias en construcción, Lean `sorry` declarado y tamaño de chunks; ninguna fue introducida como error bloqueante por esta fase.

## Criterios de aceptación

- **Abrir un documento:** se accede desde `Documentos`, se identifica como MDX y se muestran modo, estado e inspector correspondiente.
- **Abrir un diagrama:** se accede desde `Diagramas`, se identifica como TSX y se ofrece código con vista previa sin herramientas visuales ficticias.
- **Entender por qué es solo código:** la insignia, el motivo del catálogo, el resumen de seguridad, el inspector y el workbench declaran que el TSX completo es autoritativo.
- **Encontrar recursos:** búsqueda, filtros, recientes, favoritos y árbol agrupado están probados y son operables con teclado.
- **Adaptar el espacio:** explorador, inspector y diagnósticos se colapsan; sus separadores laterales e inferior admiten puntero y teclado.
- **Comprender el estado:** carga, vacío, error, solo lectura, cambios pendientes, conflicto y validación se muestran sin depender de explicación externa.
- **Preservar seguridad:** catálogo, roundtrip y guardado de Fase 0 superan sus gates sin pérdida de fidelidad.

## Veredicto

`FASE 1 CERRADA — ARQUITECTURA VISUAL Y NAVEGACIÓN OPERATIVAS SIN ADELANTAR FASE 2`
