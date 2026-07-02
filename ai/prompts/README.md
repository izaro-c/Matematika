# Prompts reutilizables

Cada prompt es una plantilla breve: se sustituye lo que aparece entre corchetes y se adjunta un solo [`context pack`](../context-packs/) cuando ayude. `AGENTS.md`, `ai/current-state.md` y un objetivo relacionado siguen siendo la entrada mínima; el prompt no sustituye gobierno ni skills.

## Familias

| Familia | Uso |
|---|---|
| [`codex/`](codex/) | Crear o validar un diff local con tests y comandos |
| [`opencode/`](opencode/) | Autoría, diagramas y validación mediante agentes/skills del adaptador |
| [`antigravity/`](antigravity/) | Explorar UI y navegación antes de integrar |
| [`gemini/`](gemini/) | Crítica independiente, priorizada y de solo lectura |
| [`chatgpt/`](chatgpt/) | Planificar decisiones, fases, prompts y trade-offs |

## Uso de bajo coste

1. Elegir un workflow en [`agent-workflows.md`](../agent-workflows.md).
2. Adjuntar un prompt y su pack, no la carpeta completa.
3. Completar objetivo, rutas y comportamiento esperado.
4. Añadir una segunda herramienta solo para una duda concreta.
5. Conservar el relevo final; no conservar la conversación completa.

Todos los prompts exigen una ficha inicial con alcance, archivos permitidos, archivos prohibidos, validaciones y resultado esperado. Si la ficha contradice la petición, el agente debe detener la escritura.
