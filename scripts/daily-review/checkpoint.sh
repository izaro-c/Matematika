#!/usr/bin/env bash
# Run by the review agent inside its worktree to save one tier of changes as one commit.
# Usage: checkpoint.sh <id> correcciones "<resumen>"   certain fixes (errors, rules broken)
#        checkpoint.sh <id> propuestas "<resumen>"     judgment calls, marked for the author
#        checkpoint.sh discard                         drop every change not yet saved
# Refuses to save anything outside content/mdx and content/diagrams or that fails
# validate-nodes; the agent then fixes it or discards it.
set -euo pipefail

TOOLS="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
here="$(git rev-parse --show-toplevel)"
[[ "$here" != "$(cd "$TOOLS/../.." && pwd)" ]] || { echo "checkpoint.sh solo se ejecuta en el worktree del agente, no en la copia principal." >&2; exit 2; }
cd "$here"
source "$TOOLS/common.sh"

if [[ "${1:-}" == discard ]]; then
  git reset --quiet --hard HEAD
  git clean -fdq
  echo "Descartados los cambios sin guardar. Lo ya guardado sigue en su commit."
  exit 0
fi

id="${1:?Falta el id}"
tier="${2:?Falta el nivel: correcciones o propuestas}"
summary="${3:-}"
case "$tier" in
  correcciones) subject="revisión diaria: $id — correcciones" ;;
  propuestas) subject="revisión diaria: $id — propuestas (revisar)" ;;
  *) echo "Nivel desconocido «$tier»: usa correcciones o propuestas." >&2; exit 2 ;;
esac
# run.sh sets REVIEW_ROUND for every session; rounds after the first are verifications.
round="${REVIEW_ROUND:-1}"
(( round == 1 )) || subject="$subject · ronda $round"

changed="$(git status --porcelain --untracked-files=all | cut -c4-)"
[[ -n "$changed" ]] || { echo "Nada que guardar en $tier."; exit 0; }

outside="$(grep -vE "$ALLOWED_EDITS" <<<"$changed" || true)"
if [[ -n "$outside" ]]; then
  printf 'No guardado: hay cambios fuera de content/mdx y content/diagrams:\n%s\nDeshazlos (o ejecuta checkpoint.sh discard) y vuelve a intentarlo.\n' "$outside" >&2
  exit 1
fi

mapfile -t ids < <(affected_ids "$changed")
if ! node "$VALIDATE" "${ids[@]}"; then
  echo "No guardado: validate-nodes falla. Corrige los ERROR o deshaz el cambio que los causa." >&2
  exit 1
fi

npm run --silent prebuild > /dev/null 2>&1 || true
git add -A
if ! git commit --quiet -m "$subject" -m "$summary" -m "Informe: docs/reports/revision-diaria/$(date +%F)-$id.md"; then
  git reset --quiet
  echo "No guardado: los hooks de commit rechazaron los cambios (salida arriba). Corrígelos o descártalos." >&2
  exit 1
fi
echo "Guardado $tier en $(git rev-parse --short HEAD)."
