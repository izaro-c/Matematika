# Épica: estabilización del editor de Matematika

## Estado

- Fases 0–4: completadas, endurecidas y validadas.
- Fase 5: modularización de `EditorPage` y retirada de legado estructural completada y validada con éxito.
- Fase 6: estabilización y modularización del workbench de diagramas completada, validada y cerrada definitivamente.
- Persistencia transaccional completamente implementada con locking canónico de rutas y política multi-sesión de borradores.
- Siguiente fase recomendada: Fase 7 — UX segura, accesibilidad y rendimiento del editor.

## Garantías de Fases 0–6

- **Editor modular:** `EditorPage` y `DiagramWorkbench` reducidos a composición, paneles con contratos limpios y responsabilidades aisladas.
- **Retirada de legado:** Eliminación definitiva de hooks, wizard y mutaciones ad-hoc sin consumidores.
- **Cliente API único:** Con Zod, errores tipados (`content-conflict`, `draft-conflict`, etc.) y soporte para cancelación.
- **Repocristografía robusta:** `DraftRepository` y `ContentRepository` validando path, revisión y hash.
- **Coordinación de persistencia:** Debounce y operaciones en vuelo mediante latest-wins cancelable.
- **Atomicidad y backups:** Backups atómicos con UUID previo a escrituras en `.matematika/editor/backups/`.
- **Integridad del corpus:** Los 120 documentos MDX del corpus son exactos, idempotentes y superan el gate lossless.
- **Parser y generador de diagramas independientes de React:** Parser AST TSX basado en TypeScript Compiler API y generador determinista.
- **Índice inverso de usos:** Generación determinista del índice inverso de usos de diagramas para abrir sin escaneo O(N).

## Métricas

| Métrica | Resultado |
| --- | ---: |
| MDX del corpus | 120 |
| Cambios accidentales | 0 |
| Ciclos no idempotentes | 0 |
| Pruebas del editor | 158 aprobadas |
| Warnings Dependency Cruiser preexistentes | 171 |
