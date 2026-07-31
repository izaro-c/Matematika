# docs

Living sources of truth and generated artefacts. Prefer regenerating over writing prose.

| Path | Role | Keep current with |
|------|------|-------------------|
| `ai/` | Multi-AI governance | Edit when protocol changes |
| `adr/` | Architecture decisions | Append; don't rewrite history |
| `editor/` | Editor stability / ops | After release gates |
| `lean/bridge-debt.json` | Lean bridge debt | `npm run bridge:audit` |
| `testing/` | Test taxonomy + partition report | `npm run test:report` |
| `uml/` | PlantUML sources (+ rendered PNGs) | `npm run docs:uml` |
| `api/` | TypeDoc (gitignored) | `npm run docs:build` |
| `uml/dependency_graph.svg` | Depcruise graph (gitignored) | `npm run depcruise:graph` |
