# Revisión diaria de contenido

Agente que cada día revisa a fondo una página de `content/mdx` (es/en/eu) y su diagrama, la corrige y mejora, y deja un informe. Si la página no tiene diagrama y lo necesita, lo crea.

Para usarlo paso a paso, ve al [TUTORIAL.md](TUTORIAL.md).

## Dónde trabaja

- **En su propio worktree** (`../Matematika-revision`, rama `revision-diaria`). Se crea en la primera ejecución y se rebasa sobre `main` antes de cada una. Tu copia de trabajo no se toca, salvo la cola y los informes.
- **Un commit por página** (`revisión diaria: <id>`), que pasa por los hooks de siempre. Revisas la rama y fusionas lo que te convenza: `git log main..revision-diaria`, `git cherry-pick <hash>` o `git merge revision-diaria`.
- **Descarta los cambios** si `validate-nodes` falla, si los hooks rechazan el commit o si el agente toca algo fuera de `content/mdx` y `content/diagrams`. El informe se guarda igualmente, con el motivo.
- **Límites del agente:** solo puede editar `content/mdx/**` y `content/diagrams/**` y ejecutar `validate-nodes` y `verify-diagram`. No crea nodos MDX nuevos ni commits. En páginas con visto bueno de la autora, solo corrige errores (`✗`) y deja las mejoras de estilo como propuestas.

| Archivo | Qué hace |
| --- | --- |
| `run.sh [n]` | Prepara el worktree, revisa las `n` primeras páginas pendientes, valida, hace commit o descarta, y guarda el informe. |
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

Variables: `REVIEW_PAGES` (1), `REVIEW_MODEL` (opus), `REVIEW_EFFORT` (high), `REVIEW_MAX_TURNS` (40), `REVIEW_MAX_USD` (8 por página), `REVIEW_WORKTREE`, `REVIEW_BRANCH`, `REVIEW_CLAUDE` (binario, para pruebas). Si una sesión falla o se queda sin turnos, se descartan sus cambios y la página sigue pendiente.

Si la rama no se puede rebasar sobre `main` (por ejemplo, editaste en `main` la misma página que corrigió el agente), el script se detiene y lo dice. Resuélvelo en el worktree o descarta la rama: `git -C ../Matematika-revision reset --hard main`.

## Activar el timer

```bash
mkdir -p ~/.config/systemd/user
ln -sf "$PWD"/scripts/daily-review/systemd/matematika-revision.{service,timer} ~/.config/systemd/user/
systemctl --user daemon-reload && systemctl --user enable --now matematika-revision.timer
journalctl --user -u matematika-revision -e   # registro de la última ejecución
```
