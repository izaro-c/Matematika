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
