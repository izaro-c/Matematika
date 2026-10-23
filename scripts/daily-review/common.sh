# Shared by run.sh and checkpoint.sh. Expects to be sourced with the agent's worktree as cwd.

VALIDATE=.agents/skills/matematika-content-generator/scripts/validate-nodes.mjs

# Files the agent may change directly; prebuild regenerates the rest of ALLOWED_DIFF.
ALLOWED_EDITS='^content/(mdx|diagrams)/'
ALLOWED_DIFF='^(content/(mdx|diagrams)/|src/data/content/|src/data/graph/graph_structure\.json$|public/(sitemap\.xml|robots\.txt)$)'

# Every existing node a list of changed paths can affect: edited MDX files plus the nodes
# importing an edited diagram. Deleted files are skipped (validate-nodes needs the node).
affected_ids() {
  local paths="$1" p mod f
  {
    while read -r p; do
      case "$p" in
        content/mdx/*.mdx) basename "$p" .mdx ;;
        content/diagrams/*.tsx)
          mod="${p#content/diagrams/}"; mod="${mod%.tsx}"
          grep -rl "@content/diagrams/$mod'" content/mdx/es 2>/dev/null | while read -r f; do basename "$f" .mdx; done ;;
      esac
    done <<<"$paths"
  } | sort -u | while read -r id; do
    compgen -G "content/mdx/es/*/$id.mdx" > /dev/null && echo "$id"
  done
}
