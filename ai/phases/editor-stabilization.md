# Épica: Estabilización del Editor de Matematika

## Información de la Fase

- **Fase actual:** Fase 1 — Oráculo de round-trip y regresiones del corpus
- **Estado:** Completada (11 de julio de 2026)
- **Siguiente fase:** Fase 2 — Diseño y prototipo de parser lossless (ADR)

## Objetivos
1. Diseñar e implementar un auditor automático, reproducible y determinista para el corpus MDX.
2. Analizar y catalogar los 120 archivos de contenido real mediante 3 ciclos de parseo/serialización.
3. Crear fixtures sintéticos mínimos para reproducir y diagnosticar errores de round-trip conocidos.
4. Establecer puertas automáticas de no-regresión (temporal y estricta).

## Estado de las Métricas

| Métrica | Inicial (Fase 0) | Objetivo | Estado Actual (Fase 1) |
|---|---|---|---|
| Documentos del corpus clasificados | 0/120 | 120/120 | 120/120 (6 exact, 27 non-idempotent, 87 unknown) |
| Cambios en documentos no editados | - | 0 | 0 (Garantizado por oráculo e inmutabilidad) |
| Corrupciones silenciosas conocidas | - | 0 | Clasificadas y aisladas en fixtures sintéticos |
| Autoguardado visual activo | Activo | Desactivado | Desactivado (Persistencia visual desactivada) |
| Advertencias de modo experimental | No visible | Visible | Visible (Banner ocre e indicador en UI) |
| Pruebas de contención y oráculo | No existen | Existentes | Existentes (36 tests editor + 4 tests oráculo) |
| Errores de lint en editor | 102 | 0 | 102 warnings |
| Violaciones de depcruise | 170 | 0 | 170 warnings |

## Criterios de Aceptación de Fase 1
- [x] Script auditor en `scripts/editor/audit-mdx-roundtrip.ts` implementado.
- [x] Ejecución de 3 ciclos deterministas de round-trip por archivo.
- [x] Clasificación precisa (`exact`, `format-only`, `semantic-risk`, `non-idempotent`, `parse-error`, `unknown`).
- [x] Generación de informes estables JSON y Markdown (`ai/reports/editor-roundtrip-baseline.*`).
- [x] Fixtures sintéticos en `tests/fixtures/editor/` para reproducir comportamientos anidados y derivas de formato.
- [x] Puerta temporal de no-regresión activa (`--check`) y modalidad estricta para Fase 3 (`--strict`).

## Deuda Técnica Registrada
- Deriva de sangrado (indentation drift) identificada en bloques `<ProofStep>` de demostraciones interactivas (27 archivos catalogados como `non-idempotent`).
- 87 archivos clasificados como `unknown` debido a normalizaciones estéticas/espaciados que no se consideran de mero formato.
