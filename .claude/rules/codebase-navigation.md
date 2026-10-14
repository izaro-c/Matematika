---
paths:
  - "src/**"
  - "tests/**"
  - "scripts/**"
---

# Codebase Navigation & Token Conservation

To minimize token burn and maintain surgical context efficiency:

1. **MCP Codebase-Memory Priority**: For TypeScript symbols, types, callers, and architectural relationships, always query MCP `codebase-memory` (`project: "home-izaro-Proiektuak-Matematika"`):
   - `search_graph`: find symbol declarations, definitions, and types.
   - `trace_path`: analyze call chains and dependencies.
   - `get_architecture`: inspect high-level module structure.
2. **Ban Recursive Grep for TS Symbols**: Do NOT run recursive `grep` or exploratory file tree scans across `src/` to find symbol definitions or signatures.
3. **Surgical Reads Only**: Read bounded line slices using `view_file` (`StartLine`/`EndLine`) or retrieve symbols via `get_code_snippet`. Never dump full source files into context.
4. **Targeted Verification**: Run `npm run typecheck` or targeted test commands (`npx vitest run <path>`) instead of full test suites on routine edits.
