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

## Próximo paso

Usar `ai:review` antes del relevo, mantener `ai/indexes/` sincronizado al cambiar la estructura y definir la primera fase operativa en `ai/phases/` cuando exista un objetivo aprobado.

## Deuda visible

- Auditar `.auxiliary/TODO.md`, `.auxiliary/TODO_content.md` y `.auxiliary/opencode.json`; migrar solo información aún vigente y después decidir su retirada.
- Revisar las skills extensas para separar patrones canónicos de notas históricas y resolver contradicciones internas sin perder conocimiento útil.
- Crear adaptadores adicionales únicamente si una herramienta necesita configuración local real; los documentos de `ai/tools/` no sustituyen esos adaptadores.
