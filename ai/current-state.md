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

## Próximo paso

Definir la primera fase operativa en `ai/phases/` cuando exista un objetivo aprobado, con alcance, archivos permitidos, validación y criterio de cierre.

## Deuda visible

- Auditar `.auxiliary/TODO.md`, `.auxiliary/TODO_content.md` y `.auxiliary/opencode.json`; migrar solo información aún vigente y después decidir su retirada.
- Revisar las skills extensas para separar patrones canónicos de notas históricas y resolver contradicciones internas sin perder conocimiento útil.
- Crear adaptadores adicionales únicamente si una herramienta necesita configuración local real; los documentos de `ai/tools/` no sustituyen esos adaptadores.
