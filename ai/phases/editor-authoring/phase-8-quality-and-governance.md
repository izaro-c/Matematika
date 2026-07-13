# Fase 8 — Calidad, accesibilidad y gobierno

## Resultado

El editor de documentos y diagramas tiene flujos verificables, accesibilidad, rendimiento, documentación y gates capaces de impedir regresiones o declaraciones falsas de compatibilidad.

El estado vigente se consulta en la [matriz canónica](README.md#fuente-canónica-de-estado).

## Skills y contexto

- `project-philosophy`
- `diagrama`
- `page-creator`
- Todas las fichas y evidencias de Fases 0–7

## Auditoría y corrección

- Flujos principales de autoría y recuperación de errores.
- Navegación por teclado, foco, ARIA, contraste y lectores de pantalla.
- Responsive, temas, estados vacíos, carga, conflicto y cambios pendientes.
- Rendimiento con documentos y escenas complejas.
- Regresión visual del renderer compartido.
- Protección ante cierre, navegación o conflicto con cambios sin guardar.
- Métricas conservadoras de compatibilidad, sin falsos positivos.
- Eliminación de legado únicamente tras verificar consumidores.

## Gobierno y documentación

- Actualizar documentación del editor y `ai/current-state.md`.
- Mantener la matriz de esta épica y publicar un informe de cierre.
- Actualizar skills cuando la arquitectura real haya cambiado, reconciliando reglas obsoletas o contradictorias.
- Regenerar índices solo mediante comandos oficiales.
- Registrar deuda residual con impacto, evidencia y siguiente acción.

## Criterios de aceptación

- Todos los criterios de Fases 0–7 siguen pasando conjuntamente.
- Los E2E cubren selección, edición, preview, guardado, reapertura, conflicto y recuperación.
- No existe pérdida silenciosa conocida ni capacidad anunciada sin prueba.
- Accesibilidad y rendimiento tienen evidencia reproducible.
- La deuda residual no contradice el veredicto de estabilidad.

## Validación de cierre

- `npm run editor:release-check`
- `npm run full-check`
- Regresión visual y E2E completos.
- `npm run ai:review`
- `git diff --check`

Un fallo relacionado bloquea el cierre. Los fallos preexistentes no relacionados se documentan con evidencia; no se ocultan ni se corrigen ampliando el alcance sin autorización.
