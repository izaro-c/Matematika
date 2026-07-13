# Fase 7 — Experiencia visual del editor MDX

## Resultado

La autoría de documentos complejos es visual, navegable y segura, con vista de código coordinada y conexiones bidireccionales con diagramas y conceptos.

El estado vigente se consulta en la [matriz canónica](README.md#fuente-canónica-de-estado).

## Skills y contexto

- `project-philosophy`
- `page-creator`
- `diagrama`
- Motor lossless cerrado en la Fase 6

## Entregables

- Vista visual y código coordinados sobre una sola fuente.
- Outline navegable, paleta de bloques y comando rápido de inserción.
- Reordenación con controles visibles y teclado.
- Formularios de metadatos por tipo de página.
- Editores para definiciones, teoremas, ejemplos, advertencias y demostraciones.
- Búsqueda y validación de `ConceptLink` y `RefLink`.
- Navegador de diagramas y targets con resaltado bidireccional.
- Informe de enlaces rotos, IDs duplicados y dependencias inválidas.
- Preview con el runtime final compartido.
- Estados de guardado, conflicto, error y cambios pendientes.
- Diff previo para modificaciones estructurales amplias.

## Criterios de aceptación

- Una página compleja se crea, enlaza, guarda y reabre sin pérdida.
- Los bloques desconocidos siguen disponibles en modo código.
- Las demostraciones exigen justificaciones y no rebajan el rigor a texto libre.
- La interfaz funciona con teclado y en tamaños de pantalla representativos.

## Validación

- E2E de creación y edición de una página compleja.
- Tests de metadatos, bloques, enlaces, targets, preview y reapertura.
- Auditoría de accesibilidad y responsive de los flujos principales.
- Roundtrip del corpus, schemas, referencias, grafo y gates del editor.

## Fuera de alcance

La fase no declara estabilidad global; la auditoría transversal y cierre pertenecen a la Fase 8.
