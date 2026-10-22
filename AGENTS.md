# Matematika Agent Guidelines

Matematika is an interactive mathematics encyclopedia. Follow these core efficiency rules to minimize token burn and prevent hallucinations.

## Architecture Pointers
- Map & Layers: [docs/architecture/map.md](docs/architecture/map.md)
- Source Index: [src/README.md](src/README.md)
- Domain Rules: Consult `.claude/rules/` for path-specific constraints (diagrams, MDX content, editor).

## Code Navigation & Search (Token Optimization)
- **TypeScript symbols & signatures**: Use MCP `codebase-memory` (`project: "home-izaro-Proiektuak-Matematika"`) via `search_graph`, `trace_path`, or `get_architecture`.
- **Do NOT** run recursive `grep` or exploratory file tree scans on `src/` for TS symbols or types.
- **Surgical reads only**: Use `get_code_snippet` or read bounded line slices (`view_file` with `StartLine`/`EndLine`). Never dump large files in full.

## Verification Protocol
Run fast, targeted checks only. Never run full `npm run test` or `npm run dev` on routine edits:
- Type check: `npm run typecheck`
- Fast test suite: `npm run test:fast`
- Targeted unit test: `npx vitest run <path-to-test>`

## Content & Diagram Work (all agents, including Gemini in Antigravity)
Writing encyclopedia content or diagrams is governed by two skills. Load the matching one **before** touching files; they are the source of truth, not this summary. They live in `.agents/skills/` (also reachable as `.agent/skills/` for Antigravity and `.claude/skills/` for Claude Code).
- `matematika-content-generator`: any MDX node under `content/mdx/` (definitions, axioms, theorems, proofs, models, axiomatic systems, biographies), filling gaps in the graph, translating es → en/eu.
- `matematika-diagram-generator`: any diagram under `content/diagrams/` and every `<VisualBind>` / `<ProofStep diagramStep>` binding.

Non-negotiables that also apply when the skill is not loaded:
- Every node exists in `es/`, `en/`, `eu/` with identical `targetId`s, `isDependency` flags, components and formulas. Write `es` first; `targetId`s are never translated.
- Never JSX inside `$…$` or `$$…$$`. No invented components, sources or locators. Write whole files, never `...` placeholders.
- Cross-theory relations go in metadata (`extends` on systems, `builtIn` on models), never as `isDependency`.
- Done means `node .agents/skills/matematika-content-generator/scripts/validate-nodes.mjs <id>...` printed `══ TODO OK`; quote that line in your report.
