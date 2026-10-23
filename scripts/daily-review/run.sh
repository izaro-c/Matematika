#!/usr/bin/env bash
# Daily review agent: reviews, fixes and commits the next page(s) of
# docs/reports/revision-diaria/COLA.md.
# Usage: scripts/daily-review/run.sh [n]      (n pages, default REVIEW_PAGES or 1)
#        REVIEW_DRY_RUN=1 scripts/daily-review/run.sh   build prompt + packet, skip the model
#
# The agent works in its own worktree (REVIEW_WORKTREE, default ../Matematika-revision) on
# branch REVIEW_BRANCH (revision-diaria), rebased on main before each run: your checkout is
# never touched except for the queue and the reports. One commit per page; changes that fail
# validate-nodes, the commit hooks or touch files outside content/ are discarded.
#
# Cost levers (env): REVIEW_MODEL (opus), REVIEW_EFFORT (high), REVIEW_MAX_TURNS (40),
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
MAX_TURNS="${REVIEW_MAX_TURNS:-40}"
MAX_USD="${REVIEW_MAX_USD:-8}"
WT="${REVIEW_WORKTREE:-$(dirname "$ROOT")/Matematika-revision}"
BRANCH="${REVIEW_BRANCH:-revision-diaria}"
OUT_DIR="$ROOT/docs/reports/revision-diaria"
VALIDATE=.agents/skills/matematika-content-generator/scripts/validate-nodes.mjs
WORK="$(mktemp -d)"
trap 'rm -rf "$WORK"' EXIT

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

revert() {
  git reset --quiet --hard HEAD
  git clean -fdq
}

# Every node the agent's changes can affect: edited MDX files plus nodes importing an edited diagram.
affected_ids() {
  local paths="$1" ids=() p
  while read -r p; do
    case "$p" in
      content/mdx/*.mdx) ids+=("$(basename "$p" .mdx)") ;;
      content/diagrams/*.tsx)
        local mod="${p#content/diagrams/}"; mod="${mod%.tsx}"
        while read -r f; do ids+=("$(basename "$f" .mdx)"); done \
          < <(grep -rl "@content/diagrams/$mod'" content/mdx/es || true) ;;
    esac
  done <<<"$paths"
  printf '%s\n' "${ids[@]}" | sort -u
}

node "$TOOLS/queue.mjs" sync
node "$TOOLS/system-prompt.mjs" > "$WORK/system.md"
mkdir -p "$OUT_DIR"
[[ -f "$OUT_DIR/costes.tsv" ]] || printf "fecha\tid\tmodelo\tusd\tturnos\tinput\tcache_read\tcache_write\toutput\n" > "$OUT_DIR/costes.tsv"

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

  echo "Revisando $id…"
  if ! "$CLAUDE_BIN" -p \
      --model "$MODEL" --effort "$EFFORT" \
      --system-prompt-file "$WORK/system.md" \
      --tools Read,Grep,Glob,Edit,Write,Bash \
      --allowedTools Read Grep Glob \
        "Edit(content/mdx/**)" "Edit(content/diagrams/**)" "Write(content/diagrams/**)" \
        "Bash(node $VALIDATE:*)" \
        "Bash(npx tsx .agents/skills/matematika-diagram-generator/scripts/verify-diagram.ts:*)" \
      --permission-mode dontAsk \
      --strict-mcp-config --no-session-persistence \
      --max-turns "$MAX_TURNS" --max-budget-usd "$MAX_USD" \
      --output-format json < "$WORK/packet.md" > "$WORK/result.json" \
    || [[ "$(jq -r '.is_error' "$WORK/result.json" 2>/dev/null)" == "true" ]]; then
    revert
    echo "Revisión de $id incompleta ($(jq -r '.subtype // "fallo"' "$WORK/result.json" 2>/dev/null)); cambios descartados, queda pendiente." >&2
    exit 1
  fi

  cost="$(jq -r '.total_cost_usd // 0 | . * 100 | round / 100' "$WORK/result.json")"
  body="$(jq -r '.result' "$WORK/result.json")"
  verdict="$(grep -oP '^VEREDICTO:\s*\K\w+' <<<"$body" | tail -1 || true)"
  verdict="${verdict:-sin-veredicto}"
  changed="$(git status --porcelain --untracked-files=all | cut -c4-)"
  outcome="sin cambios"
  gate=""

  if [[ -n "$changed" ]]; then
    if grep -qvE '^content/(mdx|diagrams)/' <<<"$changed"; then
      gate="El agente tocó archivos fuera de content/mdx y content/diagrams:"$'\n'"$changed"
    else
      mapfile -t ids < <(affected_ids "$changed")
      if ! node "$VALIDATE" "${ids[@]}" > "$WORK/validate.txt" 2>&1; then
        gate="validate-nodes falla tras los cambios:"$'\n'"$(tail -40 "$WORK/validate.txt")"
      else
        summary="$(awk '/^### Resumen/{f=1;next} /^(###|══|VEREDICTO)/{f=0} f' <<<"$body" | sed '/^\s*$/d')"
        npm run --silent prebuild > "$WORK/prebuild.txt" 2>&1 || true
        git add -A
        if git commit --quiet -m "revisión diaria: $id" -m "$summary" -m "Informe: docs/reports/revision-diaria/$report" > "$WORK/commit.txt" 2>&1; then
          outcome="corregido $(git rev-parse --short HEAD)"
        else
          gate="Los hooks de commit rechazaron los cambios:"$'\n'"$(tail -40 "$WORK/commit.txt")"
        fi
      fi
    fi
    if [[ -n "$gate" ]]; then
      revert
      outcome="cambios descartados"
    fi
  fi

  {
    echo "<!-- $date · $MODEL/$EFFORT · \$$cost · $(jq -r '.num_turns' "$WORK/result.json") turnos · $outcome -->"
    echo
    echo "$body"
    if [[ -n "$gate" ]]; then
      printf '\n### Cambios descartados por el script\n\n```text\n%s\n```\n' "$gate"
    fi
  } > "$OUT_DIR/$report"

  node "$TOOLS/queue.mjs" done "$id" "$report" "$verdict · $outcome" "$cost"
  jq -r --arg d "$date" --arg id "$id" --arg m "$MODEL/$EFFORT" \
    '[$d, $id, $m, .total_cost_usd, .num_turns, .usage.input_tokens, .usage.cache_read_input_tokens, .usage.cache_creation_input_tokens, .usage.output_tokens] | @tsv' \
    "$WORK/result.json" >> "$OUT_DIR/costes.tsv"
  echo "✓ $id → $OUT_DIR/$report ($verdict · $outcome, \$$cost)"
done

node "$TOOLS/queue.mjs" status
