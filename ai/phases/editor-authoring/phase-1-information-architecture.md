# Fase 1 — Arquitectura visual y navegación

## Resultado

Una persona puede localizar un documento o diagrama, comprender su estado y acceder a la herramienta adecuada sin conocer la arquitectura del repositorio.

El estado vigente se consulta en la [matriz canónica](README.md#fuente-canónica-de-estado).

## Skills y contexto

- `project-philosophy`
- Resultado preservado de la Fase 0
- `ai/goals/ui-product.md`

## Entregables

- Separación inequívoca entre documentos y diagramas.
- Búsqueda y filtros por nombre, tipo, estado y capacidad.
- Recursos recientes y favoritos solo con persistencia bien definida.
- Shell con paneles redimensionables y colapsables: estructura, área de trabajo, inspector y diagnósticos.
- Modos básico y avanzado sin duplicar semántica.
- Estados de carga, vacío, error, solo lectura, conflicto y cambios pendientes.
- Terminología coherente en español.
- Navegación por teclado, foco visible y adaptación a varios tamaños.

## Criterios de aceptación

- Las tareas “abrir un documento”, “abrir un diagrama” y “entender por qué es solo código” son evidentes sin explicación externa.
- Ningún control promete una capacidad ausente.
- La jerarquía visual sirve a las matemáticas y usa tokens Arts & Crafts.
- La Fase 0 no pierde sus garantías de catálogo y guardado.

## Validación

- Pruebas de navegación, búsqueda, filtros, paneles y estados.
- Recorridos con teclado y anchos de pantalla representativos.
- Evidencia visual reproducible y revisión de regresiones.
- TypeScript, lint dirigido, tests del editor, arquitectura y `git diff --check`.

## Fuera de alcance

No se implementan aún nuevos objetos geométricos ni un segundo renderer provisional.
