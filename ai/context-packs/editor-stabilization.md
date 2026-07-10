# Context Pack: Estabilización del Editor

Este pack de contexto define las fronteras, los archivos críticos, los archivos prohibidos y las validaciones obligatorias para cualquier IA que trabaje en la estabilización del editor de Matematika.

## Archivos Críticos (Permitidos)

- `src/features/editor/core/useEditorCore.ts` (Orquestación del estado y persistencia)
- `src/features/editor/ui/EditorPage.tsx` (Componente de UI principal del editor)
- `tests/features/editor/useEditorCore.test.ts` (Pruebas unitarias de contención)
- `scripts/editor/audit-mdx-roundtrip.ts` (Oráculo y auditor determinista de round-trip)
- `tests/features/editor/roundtrip.test.ts` (Pruebas unitarias del oráculo y fixtures)
- `tests/fixtures/editor/` (Fixtures de regresión sintéticos)
- `docs/adr/ADR-001-lossless-mdx-editor.md` (ADR de la arquitectura sin pérdidas)
- `src/features/editor/experimental/lossless-mdx/documentTypes.ts` (Contratos de la nueva arquitectura)
- `src/features/editor/experimental/lossless-mdx/losslessMdx.ts` (Prototipo del parser lossless y parches)
- `tests/features/editor/experimental/losslessMdx.test.ts` (Pruebas unitarias del prototipo)
- `scripts/editor/evaluate-lossless-prototype.ts` (Evaluador del prototipo sobre el corpus real)
- `ai/reports/editor-lossless-mdx-prototype.md` (Reporte de evaluación del prototipo y matriz de alternativas)
- `ai/phases/editor-stabilization.md` (Estado y métricas de la épica)
- `ai/context-packs/editor-stabilization.md` (Este documento)
- `ai/reports/editor-safety-baseline.md` (Reporte de baseline de Fase 0)
- `ai/reports/editor-roundtrip-baseline.json` (Reporte estructurado del round-trip)
- `ai/reports/editor-roundtrip-baseline.md` (Informe de diagnóstico del round-trip)

## Archivos Prohibidos (Fuera de Alcance)

- `src/database/content/**/*.mdx` (El corpus matemático es de solo lectura en esta épica)
- `src/features/editor/core/parser.ts` (El parser legacy de producción no se modifica hasta la Fase 3)
- `src/features/editor/ui/` (No se integra ni altera la interfaz de usuario en esta fase)
- `lean/` (No se modifica código Lean en esta épica)
- Grafo y JSON generados a mano
- Diagramas de producto (los diagramas existentes no se deben refactorizar)

## Reglas Operativas e Invariantes

1. **Contención Activa**: `VisualSavePolicy` debe ser `'disabled'` hasta la Fase 3.
2. **Ejecución del Oráculo**: Para verificar que no se introducen regresiones, ejecutar `npm run editor:roundtrip:check`.
3. **Validación del Prototipo**: Ejecutar `npm run test:editor:lossless` y `npm run editor:lossless:prototype`.
4. **No Regresión**: Ejecutar la suite `npm run test:editor` tras cualquier cambio.

## Lista de Verificación (Checklist)

- [ ] ¿El archivo modificado está en la lista de permitidos?
- [ ] ¿Se mantiene la contención de persistencia visual en useEditorCore?
- [ ] ¿Pasan todas las pruebas de `npm run test:editor:lossless`?
- [ ] ¿`npm run typecheck` da cero errores?
- [ ] ¿`npm run editor:roundtrip:check` se ejecuta y devuelve éxito?
- [ ] ¿`git diff --check` no reporta problemas de formato?
