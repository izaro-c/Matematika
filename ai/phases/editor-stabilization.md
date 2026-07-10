# Épica: Estabilización del Editor de Matematika

## Información de la Fase

- **Fase actual:** Fase 0 — Contención, baseline y gobierno
- **Estado:** Completada (10 de julio de 2026)
- **Siguiente fase:** Fase 1 — Oráculo de round-trip y regresiones del corpus

## Objetivos
1. Evitar corrupciones en el corpus MDX desactivando el autosave visual y el guardado directo a `/api/content` desde el modo visual.
2. Registrar un baseline técnico reproducible de validaciones (typecheck, tests, lint, depcruise).
3. Documentar y organizar el gobierno de la IA para las siguientes fases de la épica.

## Estado de las Métricas

| Métrica | Inicial (Fase 0) | Objetivo | Estado Actual |
|---|---|---|---|
| Documentos del corpus clasificados | 0/120 | 120/120 | 0/120 (Pendiente Fase 1/3) |
| Cambios en documentos no editados | - | 0 | 0 (Garantizado por contención) |
| Corrupciones silenciosas conocidas | - | 0 | 0 (Garantizado por contención) |
| Autoguardado visual activo | Activo | Desactivado | Desactivado |
| Advertencias de modo experimental | No visible | Visible | Visible |
| Pruebas de contención en CI | No existen | Existentes | Existentes (3 tests unitarios) |
| Errores de lint en editor | 102 | 0 | 102 warnings |
| Violaciones de depcruise | 170 | 0 | 170 warnings |

## Criterios de Aceptación de Fase 0
- [x] Ninguna edición visual puede iniciar una escritura de contenido o borrador (`VisualSavePolicy = 'disabled'`).
- [x] El usuario ve el estado experimental y los cambios permanecen locales.
- [x] El baseline y la fase están documentados.
- [x] El working tree queda limpio tras el commit de la fase.

## Deuda Técnica Registrada
- 102 advertencias de ESLint en los archivos del editor (complejidad cognitiva en `parser.ts` y condicionales anidados en `EditorPage.tsx`/`DiagramWorkbench.tsx`).
- 170 violaciones de Dependency Cruiser en la frontera FSD general (widgets cruzando a features, shared cargando entities).
