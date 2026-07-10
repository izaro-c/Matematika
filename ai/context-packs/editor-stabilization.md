# Context Pack: Estabilización del Editor

Este pack de contexto define las fronteras, los archivos críticos, los archivos prohibidos y las validaciones obligatorias para cualquier IA que trabaje en la estabilización del editor de Matematika.

## Archivos Críticos (Permitidos)

- `src/features/editor/core/useEditorCore.ts` (Orquestación del estado y persistencia)
- `src/features/editor/ui/EditorPage.tsx` (Componente de UI principal del editor)
- `tests/features/editor/useEditorCore.test.ts` (Pruebas unitarias de contención)
- `scripts/editor/audit-mdx-roundtrip.ts` (Oráculo y auditor determinista de round-trip)
- `tests/features/editor/roundtrip.test.ts` (Pruebas unitarias del auditor y fixtures)
- `tests/fixtures/editor/` (Fixtures de regresión sintéticos)
- `ai/phases/editor-stabilization.md` (Estado y métricas de la épica)
- `ai/context-packs/editor-stabilization.md` (Este documento)
- `ai/reports/editor-safety-baseline.md` (Reporte de baseline de Fase 0)
- `ai/reports/editor-roundtrip-baseline.json` (Reporte estructurado del round-trip)
- `ai/reports/editor-roundtrip-baseline.md` (Informe de diagnóstico del round-trip)

## Archivos Prohibidos (Fuera de Alcance)

- `src/database/content/**/*.mdx` (El corpus matemático es de solo lectura en esta épica)
- `lean/` (No se modifica código Lean en esta épica)
- Grafo y JSON generados a mano
- Diagramas de producto (los diagramas existentes no se deben refactorizar)

## Reglas Operativas e Invariantes

1. **Contención Activa**: `VisualSavePolicy` debe ser `'disabled'` hasta la Fase 3.
2. **Ejecución del Oráculo**: Para verificar que no se introducen regresiones, ejecutar `npm run editor:roundtrip:check`.
3. **No Regresión**: Ejecutar la suite `npm run test:editor` tras cualquier cambio.

## Lista de Verificación (Checklist)

- [ ] ¿El archivo modificado está en la lista de permitidos?
- [ ] ¿Se mantiene la contención de persistencia visual en useEditorCore?
- [ ] ¿Pasan todas las pruebas de `npm run test:editor`?
- [ ] ¿`npm run typecheck` da cero errores?
- [ ] ¿`npm run editor:roundtrip:check` se ejecuta y devuelve éxito?
- [ ] ¿`git diff --check` no reporta problemas de formato?
