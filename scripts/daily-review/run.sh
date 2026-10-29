#!/usr/bin/env bash
# Daily review agent: reviews, fixes and commits the next page(s) of
# docs/reports/revision-diaria/COLA.md.
# Usage: scripts/daily-review/run.sh [n]      (n pages, default REVIEW_PAGES or 1)
#        REVIEW_DRY_RUN=1 scripts/daily-review/run.sh   build prompt + packet, skip the model
#
# The agent works in its own worktree (REVIEW_WORKTREE, default ../Matematika-revision) on
# branch REVIEW_BRANCH (revision-diaria), rebased on main before each run: your checkout is
# never touched except for the queue and the reports. Each page goes through rounds: round 1
# reviews and fixes it; every later round is a new agent that verifies the result with fresh
# eyes and fixes what is still wrong, until one round changes nothing (REVIEW_MAX_ROUNDS
# caps it). Per round, up to two checkpoint commits made by the agent through checkpoint.sh:
# «correcciones» (certain fixes) and «propuestas (revisar)» (judgment calls). After each round
# this script re-checks that round's diff and discards it if it fails validate-nodes or
# touches files outside content/. When the page is done its checkpoints are squashed into
# one commit, which is fast-forwarded onto main (REVIEW_TO_MAIN=0 leaves it on the branch).
# If main cannot take it (diverged, or your checkout has local changes in those files), it
# stays on the branch and the next run retries before reviewing anything.
#
# Cost levers (env): REVIEW_MODEL (opus), REVIEW_VERIFY_MODEL (same), REVIEW_EFFORT (high),
# REVIEW_MAX_ROUNDS (4), REVIEW_MAX_TURNS (50, per round), REVIEW_MAX_USD (15, per page,
# all rounds together). Several pages in one run share the cached system prompt, each round
# in its own fresh session, so no session pays for another one's context.
set -euo pipefail

TOOLS="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT="$(cd "$TOOLS/../.." && pwd)"
export PATH="$HOME/.local/bin:$PATH"

N="${1:-${REVIEW_PAGES:-1}}"
CLAUDE_BIN="${REVIEW_CLAUDE:-claude}"
MODEL="${REVIEW_MODEL:-opus}"
EFFORT="${REVIEW_EFFORT:-high}"
MAX_TURNS="${REVIEW_MAX_TURNS:-50}"
MAX_USD="${REVIEW_MAX_USD:-15}"
MAX_ROUNDS="${REVIEW_MAX_ROUNDS:-4}"
VERIFY_MODEL="${REVIEW_VERIFY_MODEL:-$MODEL}"
WT="${REVIEW_WORKTREE:-$(dirname "$ROOT")/Matematika-revision}"
BRANCH="${REVIEW_BRANCH:-revision-diaria}"
TO_MAIN="${REVIEW_TO_MAIN:-1}"
OUT_DIR="$ROOT/docs/reports/revision-diaria"
PROPOSALS="$OUT_DIR/PROPUESTAS.md"
WORK="$(mktemp -d)"
trap 'rm -rf "$WORK"' EXIT
source "$TOOLS/common.sh"

die() { echo "$*" >&2; exit 1; }

exec 9>"${XDG_RUNTIME_DIR:-/tmp}/matematika-daily-review.lock"
flock -n 9 || { echo "Ya hay una revisión en curso." >&2; exit 0; }

# ── Worktree del agente
if [[ ! -d "$WT" ]]; then
  if git -C "$ROOT" show-ref --quiet "refs/heads/$BRANCH"; then
    git -C "$ROOT" worktree add "$WT" "$BRANCH"
  else
    git -C "$ROOT" worktree add -b "$BRANCH" "$WT" main
  fi
  ln -s "$ROOT/node_modules" "$WT/node_modules"
  exclude="$(git -C "$ROOT" rev-parse --git-common-dir)/info/exclude"
  grep -qx '/node_modules' "$exclude" 2>/dev/null || echo '/node_modules' >> "$exclude"
fi
cd "$WT"
[[ -z "$(git status --porcelain)" ]] || die "El worktree $WT tiene cambios sin commitear; revísalos antes de seguir."
git rebase --quiet main || { git rebase --abort; die "La rama $BRANCH no se puede rebasar sobre main sin conflictos; resuélvelo a mano en $WT."; }

# Fast-forwards main to this branch. Prints the reason it could not, or nothing.
land() {
  local wt
  git rebase --quiet main > /dev/null 2>&1 || { git rebase --abort 2> /dev/null; echo "conflicto al rebasar sobre main"; return; }
  # Where main is checked out, merge there so that checkout's files follow; merge refuses
  # rather than overwrite local changes. If it is checked out nowhere, move the ref.
  wt="$(git worktree list --porcelain | awk '/^worktree /{p=substr($0,10)} $0=="branch refs/heads/main"{print p}')"
  if [[ -n "$wt" ]]; then
    git -C "$wt" merge --ff-only --quiet "$BRANCH" > "$WORK/land.txt" 2>&1 \
      || echo "main no admite el fast-forward en $wt: $(head -3 "$WORK/land.txt" | tr '\n' ' ')"
  else
    git update-ref refs/heads/main HEAD "$(git rev-parse main)" 2> /dev/null || echo "no se pudo mover main"
  fi
}

# Commits left by a run that could not land them: each is already one validated page.
if [[ "$TO_MAIN" == 1 && -z "${REVIEW_DRY_RUN:-}" && -n "$(git rev-list main..HEAD)" ]]; then
  why="$(land)"
  [[ -z "$why" ]] || die "La rama $BRANCH tiene commits que no llegan a main ($why). Resuélvelo antes de revisar más páginas."
  echo "Llevados a main los commits pendientes de $BRANCH."
fi

# Squashes the page's checkpoint commits since <from> into one, keeping each checkpoint's
# tier and summary in the message.
squash_page() { # <from> <id> <report>
  local hash subject label body lines="" tiers=""
  while read -r hash; do
    subject="$(git log -1 --format=%s "$hash")"
    label="${subject#*— }"
    body="$(git log -1 --format=%b "$hash" | grep -v '^Informe: ' | sed '/^$/d' || true)"
    lines+="- ${label}: ${body:-sin resumen}"$'\n'
    case "$label" in
      propuestas*) tiers+=" propuestas" ;;
      *) tiers+=" correcciones" ;;
    esac
  done < <(git rev-list --reverse "$1..HEAD")
  if [[ "$tiers" != *propuestas* ]]; then subject="revisión diaria: $2 — correcciones"
  elif [[ "$tiers" != *correcciones* ]]; then subject="revisión diaria: $2 — propuestas (revisar)"
  else subject="revisión diaria: $2 — correcciones y propuestas (revisar)"
  fi
  git reset --quiet --soft "$1"
  # Every checkpoint already passed the hooks and recheck; the squashed tree is the same.
  git commit --quiet --no-verify -m "$subject" -m "${lines%$'\n'}" -m "Informe: docs/reports/revision-diaria/$3"
}

node "$TOOLS/queue.mjs" sync
node "$TOOLS/system-prompt.mjs" > "$WORK/system.md"
mkdir -p "$OUT_DIR"
[[ -f "$OUT_DIR/costes.tsv" ]] || printf "fecha\tid\tmodelo\tusd\tturnos\tinput\tcache_read\tcache_write\toutput\tronda\n" > "$OUT_DIR/costes.tsv"
head -1 "$OUT_DIR/costes.tsv" | grep -q 'ronda' || sed -i '1s/$/\tronda/' "$OUT_DIR/costes.tsv"
[[ -f "$PROPOSALS" ]] || printf '# Propuestas aplicadas por revisar\n\nCada línea es el commit de una página que incluye propuestas, ya aplicadas (en `main`, salvo que diga otra cosa el informe). Marca la casilla cuando las hayas revisado; deshaz a mano las que no te convenzan.\n\n' > "$PROPOSALS"

# Runs one review session on $WORK/packet.md. Every round is a fresh agent with no memory
# of the others: the only thing it learns from earlier rounds is what the packet says.
review_session() { # <round> <model> <budget>
  REVIEW_ROUND="$1" "$CLAUDE_BIN" -p \
    --model "$2" --effort "$EFFORT" \
    --system-prompt-file "$WORK/system.md" \
    --tools Read,Grep,Glob,Edit,Write,Bash,WebFetch \
    --allowedTools Read Grep Glob \
      "Edit(content/mdx/**)" "Edit(content/diagrams/**)" \
      "Write(content/mdx/**)" "Write(content/diagrams/**)" \
      "Bash(node $VALIDATE:*)" \
      "Bash(npx tsx .agents/skills/matematika-diagram-generator/scripts/verify-diagram.ts:*)" \
      "Bash($TOOLS/checkpoint.sh:*)" \
      "Bash(node $TOOLS/euskara.mjs:*)" \
      "WebFetch(domain:hiztegiak.elhuyar.eus)" "WebFetch(domain:zthiztegia.elhuyar.eus)" \
      "WebFetch(domain:eu.wikipedia.org)" "WebFetch(domain:es.wikipedia.org)" "WebFetch(domain:en.wikipedia.org)" \
    --permission-mode dontAsk \
    --strict-mcp-config --no-session-persistence \
    --max-turns "$MAX_TURNS" --max-budget-usd "$3" \
    --output-format json < "$WORK/packet.md" > "$WORK/result.json" \
  && [[ "$(jq -r '.is_error' "$WORK/result.json" 2>/dev/null)" != "true" ]]
}

# One costes.tsv row per round, including rounds that failed (they cost too).
log_cost() {
  jq -r --arg d "$date" --arg id "$id" --arg m "$model/$EFFORT" --arg r "$round" \
    '[$d, $id, $m, .total_cost_usd, .num_turns, .usage.input_tokens, .usage.cache_read_input_tokens, .usage.cache_creation_input_tokens, .usage.output_tokens, $r] | @tsv' \
    "$WORK/result.json" >> "$OUT_DIR/costes.tsv" 2>/dev/null || true
}

# Re-checks the commits since <from>: the agent's own checks are not trusted. Prints the
# reason to discard them, or nothing if they are fine.
recheck() { # <from>
  local files outside ids
  files="$(git diff --name-only "$1" HEAD)"
  outside="$(grep -vE "$ALLOWED_DIFF" <<<"$files" || true)"
  mapfile -t ids < <(affected_ids "$files")
  if [[ -n "$outside" ]]; then
    echo "Los commits tocaban archivos fuera de content/:"$'\n'"$outside"
  elif ! node "$VALIDATE" "${ids[@]}" > "$WORK/validate.txt" 2>&1; then
    echo "validate-nodes falla sobre el resultado:"$'\n'"$(tail -40 "$WORK/validate.txt")"
  fi
}

for id in $(node "$TOOLS/queue.mjs" next "$N"); do
  date="$(date +%F)"
  report="$date-$id.md"

  if [[ -n "${REVIEW_DRY_RUN:-}" ]]; then
    node "$TOOLS/packet.mjs" "$id" > "$WORK/packet.md"
    cp "$WORK/system.md" "$OUT_DIR/.dry-system.md"
    cp "$WORK/packet.md" "$OUT_DIR/.dry-packet-$id.md"
    echo "Dry run: $OUT_DIR/.dry-system.md y $OUT_DIR/.dry-packet-$id.md"
    continue
  fi

  # Round 1 reviews and fixes; each later round is a new agent that verifies the result
  # and fixes what is still wrong. The page is done when a round finds nothing to change.
  spent=0; turns=0; parts=(); first_verdict=""; verdict=""; stop=""; proposal_rounds=()
  page_start="$(git rev-parse HEAD)"
  : > "$WORK/report.md"
  : > "$WORK/previous.md"
  for (( round = 1; round <= MAX_ROUNDS; round++ )); do
    budget="$(awk -v m="$MAX_USD" -v s="$spent" 'BEGIN { printf "%.2f", m - s }')"
    if (( round > 1 )) && awk -v b="$budget" 'BEGIN { exit !(b < 1) }'; then
      stop="presupuesto agotado tras $((round - 1)) rondas"; break
    fi
    model="$MODEL"; (( round == 1 )) || model="$VERIFY_MODEL"
    node "$TOOLS/packet.mjs" "$id" > "$WORK/packet.md"
    if (( round > 1 )); then
      printf '\n## Ronda %d: verificación\n\nOtros revisores ya han revisado y corregido esta página en las rondas anteriores; los MDX y el diagrama de arriba son el resultado. Sus informes van a continuación. Sigue «Rondas de verificación» de tus instrucciones.\n\n%s\n' \
        "$round" "$(cat "$WORK/previous.md")" >> "$WORK/packet.md"
    fi

    round_start="$(git rev-parse HEAD)"
    echo "Revisando $id, ronda $round ($model, hasta \$$budget)…"
    if ! review_session "$round" "$model" "$budget"; then
      reason="$(jq -r '.subtype // "fallo"' "$WORK/result.json" 2>/dev/null || echo fallo)"
      git reset --quiet --hard "$round_start"
      git clean -fdq
      log_cost
      if (( round == 1 )); then
        echo "Revisión de $id incompleta ($reason); cambios descartados, queda pendiente." >&2
        exit 1
      fi
      spent="$(jq -r --argjson s "$spent" '(.total_cost_usd // 0) + $s' "$WORK/result.json" 2>/dev/null || echo "$spent")"
      stop="ronda $round incompleta ($reason): descartada; se conservan las anteriores"; break
    fi

    log_cost
    cost="$(jq -r '.total_cost_usd // 0 | . * 100 | round / 100' "$WORK/result.json")"
    spent="$(jq -r --argjson s "$spent" '(.total_cost_usd // 0) + $s' "$WORK/result.json")"
    turns=$(( turns + $(jq -r '.num_turns // 0' "$WORK/result.json") ))
    body="$(jq -r '.result' "$WORK/result.json")"
    verdict="$(grep -oP '^VEREDICTO:\s*\K\w+' <<<"$body" | tail -1 || true)"
    verdict="${verdict:-sin-veredicto}"
    first_verdict="${first_verdict:-$verdict}"
    notes=()

    # Anything not saved through checkpoint.sh did not pass its checks: drop it.
    if [[ -n "$(git status --porcelain --untracked-files=all)" ]]; then
      notes+=("El agente dejó cambios sin guardar con checkpoint.sh; se han descartado:"$'\n'"$(git status --porcelain --untracked-files=all)")
      git reset --quiet --hard HEAD
      git clean -fdq
    fi

    outcome="sin cambios"
    if [[ "$(git rev-parse HEAD)" == "$round_start" ]]; then
      stop="converge"
    else
      discard="$(recheck "$round_start")"
      if [[ -n "$discard" ]]; then
        notes+=("$discard")
        git reset --quiet --hard "$round_start"
        outcome="cambios descartados"
        stop="ronda $round descartada por el script"
      else
        round_parts=()
        suffix=""; (( round == 1 )) || suffix=" r$round"
        while read -r subject; do
          case "$subject" in
            *"— correcciones"*) round_parts+=("corregido$suffix") ;;
            *"— propuestas (revisar)"*) round_parts+=("propuestas$suffix"); proposal_rounds+=("$round") ;;
            *) round_parts+=("commit$suffix") ;;
          esac
        done < <(git log --reverse --format='%s' "$round_start..HEAD")
        outcome="$(IFS=,; echo "${round_parts[*]}" | sed 's/,/ · /g')"
        parts+=("${round_parts[@]}")
      fi
    fi

    {
      (( round == 1 )) || printf '\n---\n\n# Ronda %d: verificación\n\n' "$round"
      echo "<!-- ronda $round · $model/$EFFORT · \$$cost · $(jq -r '.num_turns' "$WORK/result.json") turnos · $outcome -->"
      echo
      echo "$body"
      for note in "${notes[@]}"; do
        printf '\n### Aviso del script\n\n```text\n%s\n```\n' "$note"
      done
    } >> "$WORK/report.md"
    printf '### Informe de la ronda %d (%s)\n\n%s\n\n' "$round" "$outcome" "$body" >> "$WORK/previous.md"
    [[ -z "$stop" ]] || break
  done
  rounds=$(( round > MAX_ROUNDS ? MAX_ROUNDS : round ))
  stop="${stop:-sin converger tras $MAX_ROUNDS rondas}"

  total="$(awk -v s="$spent" 'BEGIN { printf "%.2f", s }')"
  outcome="$( ((${#parts[@]})) && (IFS=,; echo "${parts[*]}" | sed 's/,/ · /g') || echo "sin cambios")"
  if [[ "$(git rev-parse HEAD)" != "$page_start" ]]; then
    squash_page "$page_start" "$id" "$report"
    where="en $BRANCH"
    if [[ "$TO_MAIN" == 1 ]]; then
      why="$(land)"
      if [[ -z "$why" ]]; then where="en main"; else where="en $BRANCH, no llegó a main: $why"; echo "$why" >&2; fi
    fi
    hash="$(git rev-parse --short HEAD)"
    outcome="$outcome → commit $hash $where"
    if ((${#proposal_rounds[@]})); then
      echo "- [ ] \`$id\` · $date · ronda $(IFS=,; echo "${proposal_rounds[*]}") · \`$hash\` · [informe]($report)" >> "$PROPOSALS"
    fi
  fi
  summary="$first_verdict → $verdict · $rounds rondas, $stop · $outcome"
  {
    echo "<!-- $date · $MODEL/$EFFORT · \$$total · $turns turnos · $summary -->"
    echo
    cat "$WORK/report.md"
  } > "$OUT_DIR/$report"

  node "$TOOLS/queue.mjs" done "$id" "$report" "$summary" "$total"
  echo "✓ $id → $OUT_DIR/$report ($summary, \$$total)"
done

node "$TOOLS/queue.mjs" status
