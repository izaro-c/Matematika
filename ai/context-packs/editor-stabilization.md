# Context Pack: Estabilización del Editor

Este pack de contexto define las fronteras, los archivos críticos, los archivos prohibidos y las validaciones obligatorias para cualquier IA que trabaje en la estabilización del editor de Matematika.

## Archivos Críticos (Permitidos)

- `src/features/editor/core/useEditorCore.ts` (Orquestación del estado y persistencia)
- `src/features/editor/ui/EditorPage.tsx` (Componente de UI principal del editor)
- `tests/features/editor/useEditorCore.test.ts` (Pruebas unitarias de contención)
- `ai/phases/editor-stabilization.md` (Estado y métricas de la épica)
- `ai/context-packs/editor-stabilization.md` (Este documento)
- `ai/reports/editor-safety-baseline.md` (Reporte de baseline de Fase 0)

## Archivos Prohibidos (Fuera de Alcance)

- `src/database/content/**/*.mdx` (El corpus matemático es de solo lectura)
- `lean/` (No se modifica código Lean en esta épica)
- Grafo y JSON generados a mano
- Diagramas de producto (los diagramas existentes no se deben refactorizar)

## Reglas Operativas e Invariantes

1. **Contención Activa**: `VisualSavePolicy` debe ser `'disabled'` hasta que se implemente el motor de round-trip y parseo lossless (Fase 3).
2. **Edición Segura**: Toda edición de contenido solo se permite en modo código fuente manual y requiere verificación explícita de respuesta HTTP en la persistencia.
3. **No Regresión**: Ejecutar la suite `npm run test -- tests/features/editor` tras cualquier cambio.

## Lista de Verificación (Checklist)

- [ ] ¿El archivo modificado está en la lista de permitidos?
- [ ] ¿Se mantiene `VisualSavePolicy: 'disabled'`?
- [ ] ¿Pasan todas las pruebas de `tests/features/editor`?
- [ ] ¿`npm run typecheck` da cero errores?
- [ ] ¿`git diff --check` no reporta problemas de formato?
