# Estado actual de la infraestructura IA

**Actualizado:** 2026-07-10

**Fase:** estabilización del editor (Fase 3 completada - Motor MDX lossless y compatibilidad visual)

**Estado:** Fases 0, 1, 2 y 3 completadas; motor MDX AST (lossless) en producción e integrado con useEditorCore y EditorPage; auditor de compatibilidad lossless del corpus añadido con puerta de no-regresión en CI; persistencia visual remota sigue desactivada por contención de seguridad.

## Decisiones vigentes

- `AGENTS.md` es la entrada común y breve.
- `docs/ai/` gobierna; `ai/` opera; `.agents/skills/` especializa.
- `.opencode/` es el único adaptador oficial de OpenCode.
- Las skills se descubren y cargan bajo demanda.
- `.auxiliary/` permanece intacta y no se usa como autoridad.
- `npm run ai:index` regenera inventarios compactos de contexto en `ai/indexes/`.
- `npm run ai:review` clasifica el working tree y recomienda validaciones mínimas sin ejecutarlas.
- `npm run ai:debt` regenera un informe accionable de deuda sin modificar código de producto.
- `ai/agent-workflows.md` conecta tipos de trabajo con herramienta, pack y revisión proporcional.
- `ai/context-packs/` fija lecturas, permisos, validaciones y aceptación por tarea.
- `ai/prompts/` ofrece plantillas breves por herramienta con contrato de alcance obligatorio.

## Próximo paso

El próximo paso es la Fase 4 — Estabilización del workbench de diagramas y adaptabilidad de la UI en el editor.

## Deuda visible

- Regenerar `ai/indexes/` con `npm run ai:index` en una tarea que autorice modificar generados; esta fase añadió workflows, packs y prompts sin editarlos.
- Auditar `.auxiliary/TODO.md`, `.auxiliary/TODO_content.md` y `.auxiliary/opencode.json`; migrar solo información aún vigente y después decidir su retirada.
- Revisar las skills extensas para separar patrones canónicos de notas históricas y resolver contradicciones internas sin perder conocimiento útil.
- Crear adaptadores adicionales únicamente si una herramienta necesita configuración local real; los documentos de `ai/tools/` no sustituyen esos adaptadores.
