# Fase 6 — Motor MDX estructural y lossless

## Resultado

El editor modifica metadatos y bloques conocidos mediante operaciones localizadas, preservando imports, exports, comentarios, expresiones y sintaxis desconocida no relacionada.

El estado vigente se consulta en la [matriz canónica](README.md#fuente-canónica-de-estado).

## Skills y contexto

- `project-philosophy`
- `page-creator`
- `diagrama` únicamente si se modifican contratos de bloques de diagramas
- `src/entities/content/schemas.ts` como autoridad de metadatos

## Entregables

- Modelo CST/AST o mecanismo equivalente de parches localizados.
- Lectura y edición de metadatos reales, no modelos vacíos.
- Registro explícito de bloques soportados.
- Inserción, borrado, duplicado y reordenación de bloques conocidos.
- Regiones opacas para sintaxis realmente desconocida.
- Preservación de imports, exports, comentarios, JSX, espacios e IDs.
- Errores de parseo y schema recuperables, sin escritura destructiva.
- Diff previo para operaciones amplias.

## Criterios de aceptación

- Abrir y guardar sin cambios conserva el corpus byte a byte.
- Editar una región no reescribe contenido ajeno.
- Los 120 documentos actuales tienen metadatos legibles y una compatibilidad documentada.
- La sintaxis desconocida se conserva y puede editarse en código.
- No se habilita una mutación si no existe operación lossless demostrada.

## Validación

- Corpus de roundtrip y pruebas de parches localizados.
- Casos de metadatos, imports, bloques, JSX desconocido y errores.
- `npm run editor:roundtrip:check` y gates de seguridad.
- Schemas, referencias, grafo y validadores de contenido aplicables.

## Fuera de alcance

El acabado WYSIWYG se construye en la Fase 7 sobre este motor único; no se crea otra vía de persistencia.
