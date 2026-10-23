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

Tarda unos minutos. Al terminar imprime una línea como esta:

```text
✓ axioma → docs/reports/revision-diaria/2026-10-23-axioma.md (mejoras · corregido 1a2b3c4, $0.85)
```

Esa línea dice tres cosas:

- **Veredicto** sobre la página antes de los cambios: `ok`, `mejoras` o `errores`.
- **Resultado**, que puede ser uno de estos:
  - `corregido <hash>`: hay un commit nuevo en la rama `revision-diaria`.
  - `sin cambios`: la página no necesitaba nada que el agente pudiera aplicar.
  - `cambios descartados`: el agente cambió algo, pero no pasó la validación, los hooks o el control de archivos. Sus cambios se han borrado y el informe explica por qué.
- **Coste** de esa página.

Para revisar varias seguidas: `scripts/daily-review/run.sh 3`. Sale más barato por página que lanzarlas en días distintos, porque comparten la caché de las instrucciones.

## 3. Leer el informe

Los informes están en `docs/reports/revision-diaria/<fecha>-<id>.md`:

```markdown
<!-- 2026-10-23 · opus/high · $0.85 · 14 turnos · corregido 1a2b3c4 -->

## axioma — rigor ✓ · simpleza △ · modularidad ✓ · enlaces △ · paridad ✗ · diagrama no necesita

### Cambios aplicados          ← lo que ya está en el commit, con la cita de antes y después
### Pendiente para la autora   ← lo que el agente no se atreve a decidir: esto es tu tarea
### Avisos de los scripts      ← cada WARN, corregido o descartado con su razón
### Diagrama                   ← estado del diagrama, o por qué debería (o no) tenerlo
### Resumen
```

La sección **Pendiente para la autora** es la importante. Recoge atribuciones históricas sin verificar, conceptos que necesitan nodo propio, decisiones de enfoque y, en páginas ya aprobadas, las mejoras de estilo que el agente propone pero no aplica.

## 4. Revisar y fusionar las correcciones

Las correcciones nunca llegan solas a `main`: esperan en la rama `revision-diaria`.

**Ver qué hay pendiente de fusionar:**

```bash
git log --oneline main..revision-diaria
```

**Ver un commit concreto:**

```bash
git show 1a2b3c4 -- content          # solo el contenido, sin los índices regenerados
git diff main...revision-diaria -- content/mdx/es   # todo lo pendiente, solo en castellano
```

**Fusionar.** Elige una de estas dos vías:

```bash
git cherry-pick 1a2b3c4      # solo los commits que te convencen
git merge revision-diaria    # todo lo pendiente de una vez
```

Si `contentIndex.json` da conflicto al fusionar, regenéralo en vez de resolverlo a mano: `npm run generate-index && git add src/data/content/contentIndex.json`.

**Rechazar un commit:** basta con no fusionarlo. Cuando hayas fusionado lo que quieras, deja la rama limpia para que lo rechazado no reaparezca:

```bash
git -C ../Matematika-revision reset --hard main
```

Hazlo solo cuando no haya una revisión en marcha. Los commits que ya fusionaste con `cherry-pick` no se pierden: ya están en `main`.

**Retocar una corrección antes de fusionarla:** fusiónala y edita encima en `main`, como cualquier otro cambio.

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

1. `git log --oneline main..revision-diaria`: qué ha corregido hoy.
2. Lee el informe del día, sobre todo «Pendiente para la autora».
3. Fusiona lo que te convenza y deja la rama limpia (paso 4).

Si un día no puedes, no pasa nada. Los commits se acumulan en la rama, y la siguiente ejecución la pone al día sobre `main` antes de trabajar.

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
awk -F'\t' 'NR>1 {s+=$4} END {printf "Total: $%.2f en %d páginas\n", s, NR-1}' docs/reports/revision-diaria/costes.tsv
```

Los ajustes van como variables de entorno. Si una variable no se indica, se usa el valor entre paréntesis.

| Variable | Qué cambia |
| --- | --- |
| `REVIEW_EFFORT` (`high`) | Cuánto razona el modelo. Es lo que más pesa en el coste. Prueba `medium` unos días y compara los informes. |
| `REVIEW_MODEL` (`opus`) | El modelo. Para rigor matemático, mejor no bajarlo. |
| `REVIEW_PAGES` (`1`) | Páginas por ejecución. Con 2 o 3 cada pocos días se aprovecha la caché. |
| `REVIEW_MAX_USD` (`8`) | Tope de gasto por página. Si se alcanza, la página se descarta y queda pendiente. |
| `REVIEW_MAX_TURNS` (`40`) | Tope de turnos por página. Funciona igual. |

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
- **Cambiar el comportamiento del revisor:** edita `prompt.md`. Por ejemplo, para que también mejore el estilo de las páginas ya aprobadas, cambia el punto «Página aprobada por la autora» del «Paso 2: corregir».
- **Cambiar cuándo debe haber diagrama:** sección «Criterio de diagrama» de `prompt.md`.

## 9. Problemas frecuentes

| Mensaje | Qué hacer |
| --- | --- |
| `Ya hay una revisión en curso.` | Otra ejecución sigue en marcha. Espera a que termine. |
| `El worktree … tiene cambios sin commitear` | Alguien editó en `../Matematika-revision`, o una ejecución se cortó a medias. Mira `git -C ../Matematika-revision status` y descarta con `git -C ../Matematika-revision reset --hard && git -C ../Matematika-revision clean -fd`. |
| `La rama revision-diaria no se puede rebasar sobre main` | Editaste en `main` una página que el agente también corrigió y aún no has fusionado. Fusiona o descarta sus commits (paso 4) y vuelve a lanzarlo. |
| `Revisión de <id> incompleta (error_max_turns)` o `(error_max_budget_usd)` | La página agotó el tope de turnos o de gasto. No se ha guardado nada y sigue pendiente. Relánzala con más margen: `REVIEW_MAX_TURNS=60 scripts/daily-review/run.sh`. |
| Resultado `cambios descartados` | El motivo está al final del informe, en «Cambios descartados por el script». Las correcciones que el agente propuso siguen en el informe y puedes aplicarlas a mano. |
| El timer no se ejecuta | `systemctl --user list-timers` y `journalctl --user -u matematika-revision -e`. Si no has iniciado sesión, revisa `enable-linger` (paso 5). |

## 10. Guardar los informes en git (opcional)

La cola, los informes y `costes.tsv` viven en tu copia principal y, de momento, git no los sigue. Tienes dos opciones:

- **Guardarlos en el repositorio:** haz commit de `docs/reports/revision-diaria/` cuando quieras, para tener el histórico.
- **Mantenerlos solo en local:** añade `docs/reports/revision-diaria/` a `.gitignore`.

Los scripts (`scripts/daily-review/`) sí conviene guardarlos en el repositorio.
