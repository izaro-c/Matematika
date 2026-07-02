# Estado actual de la infraestructura IA

**Actualizado:** 2026-07-02

**Fase:** consolidación documental multi-IA

**Estado:** capa común establecida; sin cambios de producto en esta fase.

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

Usar un único workflow, pack y prompt por tarea; ejecutar `ai:review` antes del relevo, consultar `ai:debt` para priorizar refactors y mantener `ai/indexes/` sincronizado al cambiar la estructura. La primera fase operativa se definirá en `ai/phases/` cuando exista un objetivo aprobado.

## Deuda visible

- Regenerar `ai/indexes/` con `npm run ai:index` en una tarea que autorice modificar generados; esta fase añadió workflows, packs y prompts sin editarlos.
- Auditar `.auxiliary/TODO.md`, `.auxiliary/TODO_content.md` y `.auxiliary/opencode.json`; migrar solo información aún vigente y después decidir su retirada.
- Revisar las skills extensas para separar patrones canónicos de notas históricas y resolver contradicciones internas sin perder conocimiento útil.
- Crear adaptadores adicionales únicamente si una herramienta necesita configuración local real; los documentos de `ai/tools/` no sustituyen esos adaptadores.
