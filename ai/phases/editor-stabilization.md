# Épica: Estabilización del Editor de Matematika

## Información de la Fase

- **Fase actual:** Fase 2 — Diseño y prototipo de parser lossless (ADR)
- **Estado:** Completada (11 de julio de 2026)
- **Siguiente fase:** Fase 3 — Motor MDX lossless en producción

## Objetivos
1. Diseñar e implementar un auditor automático, reproducible y determinista para el corpus MDX (Fase 1).
2. Definir mediante ADR la arquitectura sin pérdidas (lossless) basada en parches locales de rango y bloques opacos (Fase 2).
3. Implementar un prototipo aislado con contratos formales para validar la viabilidad técnica de la edición parcial (Fase 2).
4. Validar el prototipo contra fixtures sintéticos complejos y muestras reales del corpus en modo lectura (Fase 2).

## Estado de las Métricas

| Métrica | Inicial (Fase 0) | Objetivo | Estado Actual (Fase 2) |
|---|---|---|---|
| Documentos del corpus clasificados | 0/120 | 120/120 | 120/120 (6 exact, 27 non-idempotent, 87 unknown) |
| Cambios en documentos no editados | - | 0 | 0 (Garantizado por parches de rango localizados) |
| Corrupciones silenciosas conocidas | - | 0 | Resueltas en el prototipo experimental |
| Autoguardado visual activo | Activo | Desactivado | Desactivado (Persistencia visual desactivada) |
| Advertencias de modo experimental | No visible | Visible | Visible (Banner ocre e indicador en UI) |
| Pruebas de contención y oráculo | No existen | Existentes | Existentes (40 tests editor + 8 tests lossless) |
| Errores de lint en editor | 102 | 0 | 102 warnings |
| Violaciones de depcruise | 170 | 0 | 170 warnings |

## Criterios de Aceptación de Fase 2
- [x] Decisión arquitectónica ADR formal redactada en `docs/adr/ADR-001-lossless-mdx-editor.md`.
- [x] Contratos tipados del motor documental aislados definidos en `src/features/editor/experimental/lossless-mdx/documentTypes.ts`.
- [x] Prototipo funcional implementado en `src/features/editor/experimental/lossless-mdx/losslessMdx.ts`.
- [x] Pruebas unitarias de parches locales, Unicode, CRLF y atomización en `tests/features/editor/experimental/losslessMdx.test.ts`.
- [x] Script de evaluación determinista sobre el corpus real en `scripts/editor/evaluate-lossless-prototype.ts`.
- [x] Reporte markdown con la matriz comparativa de alternativas guardada en `ai/reports/editor-lossless-mdx-prototype.md`.

## Deuda Técnica Registrada
- Acorn puede fallar al parsear expresiones matemáticas inline que usen llaves `{}` no sintácticas de JS (ej. `demo-angulos-alternos-internos.mdx` catalogado como `unsupported` sin diagnostics de parseo markdown puro).
- Implementación de la coordinación de parches en caso de ediciones concurrentes o secuenciales sin reparseo intermedio.
