# Tutorial: el revisor diario

Esta guía cubre el uso del agente día a día: cómo lanzarlo, leer sus informes, fusionar sus correcciones y ajustar lo que gasta. El funcionamiento interno está en [README.md](README.md).

Todos los comandos se ejecutan desde la raíz del repositorio (`~/Proiektuak/Matematika`).

## 0. Requisitos

- `claude` instalado y con la sesión iniciada. Si `claude -p "hola"` responde, está listo.
- `node`, `jq` y `flock`. En este equipo ya están.
- Nada más que configurar: la primera ejecución crea sola el worktree `../Matematika-revision` y la rama `revision-diaria`.

## 1. Ver qué recibe el agente, sin gastar nada

```bash
REVIEW_DRY_RUN=1 scripts/daily-review/run.sh
```

Esto genera dos archivos en `docs/reports/revision-diaria/` sin llamar al modelo:

- `.dry-system.md`: las instrucciones y normas que recibe el agente. Son las mismas para todas las páginas.
- `.dry-packet-<id>.md`: el paquete de la página que toca: salida de `validate-nodes`, los tres MDX, dependencias y diagrama.

Ábrelos si quieres comprobar que el agente tiene lo que necesita, y bórralos después: `rm docs/reports/revision-diaria/.dry-*`.

## 2. La primera revisión

```bash
scripts/daily-review/run.sh
```

Tarda unos minutos por ronda. La página pasa por varias rondas, cada una con un agente nuevo, hasta que una no encuentra nada que cambiar. Al terminar imprime una línea como esta:

```text
✓ axioma → docs/reports/revision-diaria/2026-10-23-axioma.md (errores → ok · 3 rondas, converge · corregido · propuestas · corregido r2 → commit 1a2b3c4 en main, $2.40)
```

Esa línea dice cuatro cosas:

- **Veredicto** sobre la página antes de los cambios y en la última ronda: `ok`, `mejoras` o `errores`. Lo normal es terminar en `ok`.
- **Rondas** y cómo terminaron:
  - `converge`: la última ronda no encontró nada que cambiar. Es el final esperado.
  - `sin converger tras 4 rondas`: cada ronda siguió cambiando algo. Mira con más atención las últimas rondas del informe: o queda un problema de fondo, o dos revisores no se ponen de acuerdo.
  - `presupuesto agotado` o `ronda N incompleta`: se cortó antes de converger. Lo ya guardado se conserva.
- **Resultado**: qué guardó cada ronda (desde la ronda 2, con «rN») y el commit único de la página:
  - `corregido`: **correcciones**, errores objetivos o normas rotas.
  - `propuestas`: **propuestas**, mejoras ya aplicadas en las que cabría decidir otra cosa. Son lo que tienes que revisar; la página queda apuntada en `PROPUESTAS.md` (paso 4).
  - `→ commit <hash> en main`: todo lo de la página, en un solo commit que ya está en `main`. Si pone `en revision-diaria, no llegó a main: …`, se ha quedado en la rama (paso 4).
  - `sin cambios`: la página no necesitaba nada.
  - `cambios descartados`: algo no pasó la validación, los hooks o el control de archivos. Se ha borrado todo lo de esa ronda y el informe explica por qué.
- **Coste** de esa página.

Para revisar varias seguidas: `scripts/daily-review/run.sh 3`. Sale más barato por página que lanzarlas en días distintos, porque comparten la caché de las instrucciones.

## 3. Leer el informe

Los informes están en `docs/reports/revision-diaria/<fecha>-<id>.md`:

```markdown
<!-- 2026-10-23 · opus/high · $2.40 · 31 turnos · errores → ok · 3 rondas, converge · corregido → commit 1a2b3c4 en main -->

<!-- ronda 1 · opus/high · $1.40 · 18 turnos · corregido -->

## axioma — rigor ✓ · simpleza △ · modularidad ✓ · enlaces △ · paridad ✗ · diagrama no necesita

### Correcciones                  ← errores, con la cita de antes y después
### Propuestas aplicadas — revisar ← mejoras discutibles, con su razón y la alternativa descartada
### Pendiente para la autora      ← solo lo que exige un dato que no está en el repositorio
### Avisos de los scripts         ← cada WARN, corregido o descartado con su razón
### Diagrama                      ← estado del diagrama, o por qué debería (o no) tenerlo
### Resumen
```

Lee **Propuestas aplicadas — revisar** junto al diff del commit de la página: cada punto explica un cambio que ya está hecho. Entre las propuestas puede haber párrafos simplificados, secciones reducidas, afirmaciones matizadas, IDs canónicos nuevos, un diagrama creado o un concepto extraído a su propio nodo.

Después vienen las rondas de verificación (`# Ronda 2: verificación`, …), con el mismo formato. Cada una lista lo que se le escapó a las anteriores; la última suele decir «Nada.» en todo.

**Pendiente para la autora** queda casi vacía. Recoge lo que el agente no puede resolver sin inventar, como una atribución, fecha o fuente que no se comprueba desde el repositorio. También lo que solo tú puedes decidir: un término en euskera en el que Elhuyar o Wikipedia contradicen el glosario (con sus URLs), o una propuesta de una ronda anterior con la que un verificador no está de acuerdo.

Cuando un término en euskera no está en el glosario o el agente duda de él, lo consulta en Elhuyar, la ZTH y Wikipedia, y cita la URL en el informe. Puedes hacer la misma consulta: `node scripts/daily-review/euskara.mjs es "asociativo"`.

## 4. Revisar lo que ha llegado a `main`

Cada página revisada deja **un solo commit en `main`**, con todo lo que cambiaron sus rondas. El asunto dice qué lleva (`— correcciones`, `— propuestas (revisar)` o `— correcciones y propuestas (revisar)`) y el cuerpo, una línea por nivel y ronda con su resumen.

El script lo lleva a `main` por fast-forward. Si tienes `main` abierta en tu copia, actualiza también sus archivos; si tienes cambios sin guardar en alguno de los archivos que toca el commit, no los pisa: el commit se queda en la rama `revision-diaria` y la siguiente ejecución lo reintenta antes de revisar nada. Para traerlo tú: guarda o descarta tus cambios en esos archivos y haz `git merge --ff-only revision-diaria`.

**Ver qué ha hecho:**

```bash
git log --oneline --grep='^revisión diaria' -10
git show 1a2b3c4 -- content          # solo el contenido, sin los índices regenerados
git show 1a2b3c4 -- content/mdx/es   # solo en castellano
```

**Ver las propuestas pendientes de revisar:** están en `docs/reports/revision-diaria/PROPUESTAS.md`, una casilla por página con su commit y su informe. Márcala cuando las hayas revisado.

**Deshacer lo que no te convenza:**

```bash
git revert 1a2b3c4              # la página entera
git revert -n 1a2b3c4 && git restore -p --staged --worktree .   # solo parte: quédate con lo que quieras deshacer y haz tú el commit
```

O simplemente edita encima en `main`, como cualquier otro cambio. Si `contentIndex.json` da conflicto, regenéralo en vez de resolverlo a mano: `npm run generate-index && git add src/data/content/contentIndex.json`.

**Preferir revisar antes de fusionar:** lanza con `REVIEW_TO_MAIN=0` y los commits se quedan en la rama (`git log --oneline main..revision-diaria`), uno por página, para fusionarlos tú con `git cherry-pick <hash>`. Si después vuelves al modo normal, la primera ejecución lleva a `main` todo lo que quede en la rama: antes, fusiona lo que quieras y deja la rama limpia con `git -C ../Matematika-revision reset --hard main` (sin una revisión en marcha).

**Aprobar.** El agente nunca toca `docs/progreso-reescritura.md`: el visto bueno sigue siendo tuyo. Si una corrección del agente te convence para aprobar la página, actualiza ese registro como siempre.

## 5. Activarlo cada día

```bash
mkdir -p ~/.config/systemd/user
ln -sf "$PWD"/scripts/daily-review/systemd/matematika-revision.{service,timer} ~/.config/systemd/user/
systemctl --user daemon-reload
systemctl --user enable --now matematika-revision.timer
```

Se ejecuta a las 09:00, con hasta 10 minutos de margen aleatorio. Si el ordenador estaba apagado a esa hora, la revisión se lanza al encenderlo.

| Quiero… | Comando |
| --- | --- |
| Ver cuándo toca la próxima | `systemctl --user list-timers matematika-revision.timer` |
| Ver qué pasó en la última | `journalctl --user -u matematika-revision -e` |
| Lanzarla ahora, fuera de hora | `systemctl --user start matematika-revision.service` |
| Pausarla | `systemctl --user disable --now matematika-revision.timer` |
| Cambiar la hora | edita `OnCalendar=` en `scripts/daily-review/systemd/matematika-revision.timer` y repite `daemon-reload` |

Los timers de usuario solo funcionan mientras tienes la sesión abierta. Para que funcionen aunque no hayas iniciado sesión: `loginctl enable-linger $USER`.

### Tu rutina diaria

1. `git log --oneline -3`: qué ha llegado hoy a `main`.
2. Revisa las propuestas con su informe, deshaz lo que no te convenza y marca su casilla en `PROPUESTAS.md` (paso 4).

Si un día no puedes, no pasa nada: las correcciones ya están en `main` y las propuestas esperan en `PROPUESTAS.md`.

## 6. Manejar la cola

La cola es `docs/reports/revision-diaria/COLA.md`, una lista de casillas: `[ ]` pendiente, `[x]` revisada (con fecha, veredicto, resultado, enlace al informe y coste). Va en orden de dependencias: cada página se revisa después de las que usa, y cada demostración justo después de su teorema.

```bash
node scripts/daily-review/queue.mjs status            # cuántas van y cuál es la siguiente
node scripts/daily-review/queue.mjs next 5            # las cinco siguientes
node scripts/daily-review/queue.mjs reopen pitagoras  # vuelve a ponerla en cola, al final
```

- **Adelantar una página:** mueve su línea al principio de «Pendientes» en `COLA.md`. El agente siempre toma la primera.
- **Saltarte una página:** muévela al final de la lista.
- **Páginas nuevas:** se añaden solas a la cola en la siguiente ejecución. Las borradas desaparecen de ella.
- **Volver a revisar** una página que has reescrito a mano: `reopen`, y después mueve la línea arriba si corre prisa.

## 7. Controlar el gasto

Cada página deja una fila en `docs/reports/revision-diaria/costes.tsv`. Para verlo como tabla:

```bash
column -t -s$'\t' docs/reports/revision-diaria/costes.tsv
awk -F'\t' 'NR>1 {s+=$4; p[$1 $2]=1} END {printf "Total: $%.2f en %d páginas (%d rondas)\n", s, length(p), NR-1}' docs/reports/revision-diaria/costes.tsv
```

Los ajustes van como variables de entorno. Si una variable no se indica, se usa el valor entre paréntesis.

| Variable | Qué cambia |
| --- | --- |
| `REVIEW_EFFORT` (`high`) | Cuánto razona el modelo. Es lo que más pesa en el coste. Prueba `medium` unos días y compara los informes. |
| `REVIEW_MODEL` (`opus`) | El modelo. Para rigor matemático, mejor no bajarlo. |
| `REVIEW_VERIFY_MODEL` (el mismo) | El modelo de las rondas de verificación. Uno distinto aporta otra mirada, pero mejor no bajar de `opus`. |
| `REVIEW_MAX_ROUNDS` (`4`) | Máximo de rondas por página. Con `1`, el agente funciona como antes, sin verificación. |
| `REVIEW_PAGES` (`1`) | Páginas por ejecución. Con 2 o 3 cada pocos días se aprovecha la caché. |
| `REVIEW_MAX_USD` (`15`) | Tope de gasto por página, sumando todas las rondas. Si la ronda 1 lo alcanza, la página se descarta y queda pendiente; si lo alcanza una ronda posterior, se descarta solo esa ronda. |
| `REVIEW_MAX_TURNS` (`50`) | Tope de turnos por ronda. Funciona igual. |

**En una ejecución manual:**

```bash
REVIEW_EFFORT=medium scripts/daily-review/run.sh 2
```

**En el timer:**

```bash
systemctl --user edit matematika-revision.service
```

Escribe en el editor:

```ini
[Service]
Environment=REVIEW_PAGES=3
Environment=REVIEW_EFFORT=medium
```

Con 3 páginas, conviene que el timer pase a días alternos: `OnCalendar=Mon,Wed,Fri 09:00`.

## 8. Ajustar el criterio del agente

Las instrucciones del agente están en `scripts/daily-review/prompt.md`, y las normas se leen en cada ejecución de las skills de `.agents/skills/`. Por tanto:

- **Mejorar una norma del proyecto:** edita la skill. El agente la aplica desde la siguiente revisión.
- **Cambiar el comportamiento del revisor:** edita `prompt.md`. Por ejemplo, para mover un tipo de cambio de un nivel a otro, cambia las listas de «Nivel 1» y «Nivel 2» del «Paso 2».
- **Cambiar cuándo debe haber diagrama:** sección «Criterio de diagrama» de `prompt.md`.

## 9. Problemas frecuentes

| Mensaje | Qué hacer |
| --- | --- |
| `Ya hay una revisión en curso.` | Otra ejecución sigue en marcha. Espera a que termine. |
| `El worktree … tiene cambios sin commitear` | Alguien editó en `../Matematika-revision`, o una ejecución se cortó a medias. Mira `git -C ../Matematika-revision status` y descarta con `git -C ../Matematika-revision reset --hard && git -C ../Matematika-revision clean -fd`. |
| `La rama revision-diaria no se puede rebasar sobre main` | Editaste en `main` una página que el agente también corrigió y su commit no llegó a `main`. Fusiónalo a mano o descártalo (`git -C ../Matematika-revision reset --hard main`) y vuelve a lanzarlo. |
| `La rama revision-diaria tiene commits que no llegan a main` | Un commit de una ejecución anterior no pudo llegar a `main`, normalmente por cambios sin guardar en tu copia en los mismos archivos. Guárdalos o descártalos y vuelve a lanzarlo, o tráelo tú con `git merge --ff-only revision-diaria`. |
| `Revisión de <id> incompleta (error_max_turns)` o `(error_max_budget_usd)` | La ronda 1 agotó el tope de turnos o de gasto. No se ha guardado nada y sigue pendiente. Relánzala con más margen: `REVIEW_MAX_TURNS=60 scripts/daily-review/run.sh`. |
| Resultado `cambios descartados` | El motivo está al final del informe, en «Cambios descartados por el script». Las correcciones que el agente propuso siguen en el informe y puedes aplicarlas a mano. |
| El timer no se ejecuta | `systemctl --user list-timers` y `journalctl --user -u matematika-revision -e`. Si no has iniciado sesión, revisa `enable-linger` (paso 5). |

## 10. Guardar los informes en git (opcional)

La cola, los informes y `costes.tsv` viven en tu copia principal y, de momento, git no los sigue. Tienes dos opciones:

- **Guardarlos en el repositorio:** haz commit de `docs/reports/revision-diaria/` cuando quieras, para tener el histórico.
- **Mantenerlos solo en local:** añade `docs/reports/revision-diaria/` a `.gitignore`.

Los scripts (`scripts/daily-review/`) sí conviene guardarlos en el repositorio.
