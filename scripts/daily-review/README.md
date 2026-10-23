# Revisión diaria de contenido

Agente que cada día revisa a fondo una página de `content/mdx` (es/en/eu) y su diagrama, la corrige y mejora, y deja un informe. Si la página no tiene diagrama y lo necesita, lo crea.

Para usarlo paso a paso, ve al [TUTORIAL.md](TUTORIAL.md).

## Dónde trabaja

- **En su propio worktree** (`../Matematika-revision`, rama `revision-diaria`). Se crea en la primera ejecución y se rebasa sobre `main` antes de cada una. Tu copia de trabajo no se toca, salvo la cola y los informes.
- **Dos commits por página**, hechos por el propio agente con `checkpoint.sh`, que valida antes de guardar:
  - `revisión diaria: <id> — correcciones`: errores objetivos y normas rotas.
  - `revisión diaria: <id> — propuestas (revisar)`: mejoras discutibles, ya aplicadas. Se apuntan además en `docs/reports/revision-diaria/PROPUESTAS.md` para revisarlas.
  Revisas la rama y fusionas lo que te convenza (ver [TUTORIAL.md](TUTORIAL.md), paso 4).
- **Descarta la página entera** si, al terminar, `validate-nodes` falla o algún commit toca algo fuera de `content/mdx`, `content/diagrams` y los índices que regeneran `prebuild` y `validate-nodes` (incluido `graph_structure.json`). El informe se guarda igualmente, con el motivo.
- **Límites del agente:** solo puede editar `content/mdx/**` y `content/diagrams/**`, y ejecutar `validate-nodes`, `verify-diagram` y `checkpoint.sh`. No puede hacer commits por su cuenta. Crea como mucho un nodo nuevo por revisión, y solo para extraer un concepto definido inline. Lo que exige un dato que no está en el repositorio (fuentes, fechas, atribuciones) no lo aplica: lo deja en «Pendiente para la autora».

| Archivo | Qué hace |
| --- | --- |
| `run.sh [n]` | Prepara el worktree, revisa las `n` primeras páginas pendientes, vuelve a validar el resultado, descarta si falla y guarda el informe. |
| `checkpoint.sh` | Lo usa el agente para guardar cada nivel (`correcciones`, `propuestas`) como commit, o descartar lo no guardado. |
| `common.sh` | Funciones compartidas por `run.sh` y `checkpoint.sh`. |
| `queue.mjs` | Cola en `docs/reports/revision-diaria/COLA.md` (`sync`, `next`, `done`, `reopen <id>`, `status`). |
| `packet.mjs <id>` | Paquete de contexto de una página: validate-nodes, los tres MDX, una línea por dependencia, resumen del diagrama. |
| `prompt.md` | Instrucciones del agente: revisar, corregir, validar, formato del informe. |
| `system-prompt.mjs` | `prompt.md` + normas de la skill de contenido, leídas en cada ejecución. |
| `systemd/` | Timer de usuario para las 09:00 (se recupera si el equipo estaba apagado). |

Salida: `docs/reports/revision-diaria/<fecha>-<id>.md` (cambios aplicados, pendientes para la autora, avisos, diagrama) y `costes.tsv` (coste, turnos y tokens de caché por página).

## Cómo ahorra

- Todo el contexto se prepara con scripts antes de llamar al modelo, así que el agente no gasta turnos explorando. Sin servidores MCP y con el prompt de sistema de Claude Code sustituido por el suyo.
- Cada página va en una sesión nueva: ninguna arrastra el contexto de la anterior.
- Las dependencias llegan como una línea (tipo, título, enunciado) y no como archivos completos. Los diagramas llegan resumidos, y sus normas solo cuando la página tiene diagrama. La documentación completa de diagramas solo se lee cuando hay que crear uno.
- El prompt de sistema es idéntico para todas las páginas. Con `run.sh 3`, la segunda y la tercera leen de caché sus ~22k tokens. Agrupar páginas solo ahorra en eso, y el contexto de cada página sigue separado.

## Uso

```bash
scripts/daily-review/run.sh                    # una página
scripts/daily-review/run.sh 3                  # tres seguidas, compartiendo caché
REVIEW_DRY_RUN=1 scripts/daily-review/run.sh   # genera prompt y paquete sin llamar al modelo
node scripts/daily-review/queue.mjs reopen teorema-pitagoras   # volver a revisar una página
```

Variables: `REVIEW_PAGES` (1), `REVIEW_MODEL` (opus), `REVIEW_EFFORT` (high), `REVIEW_MAX_TURNS` (50), `REVIEW_MAX_USD` (8 por página), `REVIEW_WORKTREE`, `REVIEW_BRANCH`, `REVIEW_CLAUDE` (binario, para pruebas). Si una sesión falla o se queda sin turnos, se descartan sus cambios y la página sigue pendiente.

Si la rama no se puede rebasar sobre `main` (por ejemplo, editaste en `main` la misma página que corrigió el agente), el script se detiene y lo dice. Resuélvelo en el worktree o descarta la rama: `git -C ../Matematika-revision reset --hard main`.

## Activar el timer

```bash
mkdir -p ~/.config/systemd/user
ln -sf "$PWD"/scripts/daily-review/systemd/matematika-revision.{service,timer} ~/.config/systemd/user/
systemctl --user daemon-reload && systemctl --user enable --now matematika-revision.timer
journalctl --user -u matematika-revision -e   # registro de la última ejecución
```
