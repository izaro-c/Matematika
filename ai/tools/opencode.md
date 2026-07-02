# OpenCode

## Papel recomendado

Trabajo local mediante agentes, comandos y plugins versionados en el adaptador oficial `.opencode/`.

## Uso

- `opencode.json` conserva solo configuración global de OpenCode.
- `.opencode/agents/` define roles; `.opencode/commands/` encapsula flujos repetibles; `.opencode/plugins/` añade guardas.
- `AGENTS.md` aporta reglas comunes y `.agents/skills/` se carga bajo demanda.
- Las políticas nuevas se escriben primero en la capa común, no en el adaptador.

Si un agente o comando duplica una skill o `AGENTS.md`, se reduce a una referencia operativa.
