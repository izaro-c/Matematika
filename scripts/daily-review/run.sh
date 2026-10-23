#!/usr/bin/env bash
# Daily review agent: reviews, fixes and commits the next page(s) of
# docs/reports/revision-diaria/COLA.md.
# Usage: scripts/daily-review/run.sh [n]      (n pages, default REVIEW_PAGES or 1)
#        REVIEW_DRY_RUN=1 scripts/daily-review/run.sh   build prompt + packet, skip the model
#
# The agent works in its own worktree (REVIEW_WORKTREE, default ../Matematika-revision) on
# branch REVIEW_BRANCH (revision-diaria), rebased on main before each run: your checkout is
# never touched except for the queue and the reports. Per page, up to two commits made by
# the agent through checkpoint.sh: «correcciones» (certain fixes) and «propuestas (revisar)»
# (judgment calls, also listed in PROPUESTAS.md). Afterwards this script re-checks the whole
# page diff and discards it if it fails validate-nodes or touches files outside content/.
#
# Cost levers (env): REVIEW_MODEL (opus), REVIEW_EFFORT (high), REVIEW_MAX_TURNS (50),
# REVIEW_MAX_USD (8, per page). Several pages in one run share the cached system prompt,
# each in its own fresh session, so one page never pays for another page's context.
set -euo pipefail

TOOLS="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT="$(cd "$TOOLS/../.." && pwd)"
export PATH="$HOME/.local/bin:$PATH"

N="${1:-${REVIEW_PAGES:-1}}"
CLAUDE_BIN="${REVIEW_CLAUDE:-claude}"
MODEL="${REVIEW_MODEL:-opus}"
EFFORT="${REVIEW_EFFORT:-high}"
MAX_TURNS="${REVIEW_MAX_TURNS:-50}"
MAX_USD="${REVIEW_MAX_USD:-8}"
WT="${REVIEW_WORKTREE:-$(dirname "$ROOT")/Matematika-revision}"
BRANCH="${REVIEW_BRANCH:-revision-diaria}"
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

node "$TOOLS/queue.mjs" sync
node "$TOOLS/system-prompt.mjs" > "$WORK/system.md"
mkdir -p "$OUT_DIR"
[[ -f "$OUT_DIR/costes.tsv" ]] || printf "fecha\tid\tmodelo\tusd\tturnos\tinput\tcache_read\tcache_write\toutput\n" > "$OUT_DIR/costes.tsv"
[[ -f "$PROPOSALS" ]] || printf '# Propuestas aplicadas por revisar\n\nCada línea es un commit «propuestas (revisar)» de la rama `%s`. Marca la casilla cuando lo hayas revisado y fusionado (o descartado).\n\n' "$BRANCH" > "$PROPOSALS"

for id in $(node "$TOOLS/queue.mjs" next "$N"); do
  date="$(date +%F)"
  report="$date-$id.md"
  node "$TOOLS/packet.mjs" "$id" > "$WORK/packet.md"

  if [[ -n "${REVIEW_DRY_RUN:-}" ]]; then
    cp "$WORK/system.md" "$OUT_DIR/.dry-system.md"
    cp "$WORK/packet.md" "$OUT_DIR/.dry-packet-$id.md"
    echo "Dry run: $OUT_DIR/.dry-system.md y $OUT_DIR/.dry-packet-$id.md"
    continue
  fi

  start="$(git rev-parse HEAD)"
  echo "Revisando $id…"
  if ! "$CLAUDE_BIN" -p \
      --model "$MODEL" --effort "$EFFORT" \
      --system-prompt-file "$WORK/system.md" \
      --tools Read,Grep,Glob,Edit,Write,Bash \
      --allowedTools Read Grep Glob \
        "Edit(content/mdx/**)" "Edit(content/diagrams/**)" \
        "Write(content/mdx/**)" "Write(content/diagrams/**)" \
        "Bash(node $VALIDATE:*)" \
        "Bash(npx tsx .agents/skills/matematika-diagram-generator/scripts/verify-diagram.ts:*)" \
        "Bash($TOOLS/checkpoint.sh:*)" \
      --permission-mode dontAsk \
      --strict-mcp-config --no-session-persistence \
      --max-turns "$MAX_TURNS" --max-budget-usd "$MAX_USD" \
      --output-format json < "$WORK/packet.md" > "$WORK/result.json" \
    || [[ "$(jq -r '.is_error' "$WORK/result.json" 2>/dev/null)" == "true" ]]; then
    git reset --quiet --hard "$start"
    git clean -fdq
    echo "Revisión de $id incompleta ($(jq -r '.subtype // "fallo"' "$WORK/result.json" 2>/dev/null)); cambios descartados, queda pendiente." >&2
    exit 1
  fi

  cost="$(jq -r '.total_cost_usd // 0 | . * 100 | round / 100' "$WORK/result.json")"
  body="$(jq -r '.result' "$WORK/result.json")"
  verdict="$(grep -oP '^VEREDICTO:\s*\K\w+' <<<"$body" | tail -1 || true)"
  verdict="${verdict:-sin-veredicto}"
  notes=()

  # Anything not saved through checkpoint.sh did not pass its checks: drop it.
  if [[ -n "$(git status --porcelain --untracked-files=all)" ]]; then
    notes+=("El agente dejó cambios sin guardar con checkpoint.sh; se han descartado:"$'\n'"$(git status --porcelain --untracked-files=all)")
    git reset --quiet --hard HEAD
    git clean -fdq
  fi

  # Re-check the page's whole diff: the agent's own checks are not trusted.
  outcome="sin cambios"
  if [[ "$(git rev-parse HEAD)" != "$start" ]]; then
    files="$(git diff --name-only "$start" HEAD)"
    outside="$(grep -vE "$ALLOWED_DIFF" <<<"$files" || true)"
    mapfile -t ids < <(affected_ids "$files")
    discard=""
    if [[ -n "$outside" ]]; then
      discard="Los commits tocaban archivos fuera de content/:"$'\n'"$outside"
    elif ! node "$VALIDATE" "${ids[@]}" > "$WORK/validate.txt" 2>&1; then
      discard="validate-nodes falla sobre el resultado final:"$'\n'"$(tail -40 "$WORK/validate.txt")"
    fi
    if [[ -n "$discard" ]]; then
      notes+=("$discard")
      git reset --quiet --hard "$start"
      outcome="cambios descartados"
    else
      parts=()
      while read -r hash subject; do
        case "$subject" in
          *"— correcciones") parts+=("corregido $hash") ;;
          *"— propuestas (revisar)") parts+=("propuestas $hash")
            echo "- [ ] \`$id\` · $date · \`$hash\` · [informe]($report)" >> "$PROPOSALS" ;;
          *) parts+=("commit $hash") ;;
        esac
      done < <(git log --reverse --format='%h %s' "$start..HEAD")
      outcome="$(IFS=,; echo "${parts[*]}" | sed 's/,/ · /g')"
    fi
  fi

  {
    echo "<!-- $date · $MODEL/$EFFORT · \$$cost · $(jq -r '.num_turns' "$WORK/result.json") turnos · $outcome -->"
    echo
    echo "$body"
    for note in "${notes[@]}"; do
      printf '\n### Aviso del script\n\n```text\n%s\n```\n' "$note"
    done
  } > "$OUT_DIR/$report"

  node "$TOOLS/queue.mjs" done "$id" "$report" "$verdict · $outcome" "$cost"
  jq -r --arg d "$date" --arg id "$id" --arg m "$MODEL/$EFFORT" \
    '[$d, $id, $m, .total_cost_usd, .num_turns, .usage.input_tokens, .usage.cache_read_input_tokens, .usage.cache_creation_input_tokens, .usage.output_tokens] | @tsv' \
    "$WORK/result.json" >> "$OUT_DIR/costes.tsv"
  echo "✓ $id → $OUT_DIR/$report ($verdict · $outcome, \$$cost)"
done

node "$TOOLS/queue.mjs" status
