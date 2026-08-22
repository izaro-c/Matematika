# docs

Living sources of truth and generated artefacts. Prefer regenerating over writing prose.

| Path | Role | Keep current with |
|------|------|-------------------|
| `architecture/` | CODEMAP — dónde editar X | Tras reorg / nuevos dominios |
| `adr/` | Architecture decisions | Append; don't rewrite history |
| `editor/` | Editor stability / ops | After release gates |
| `lean/bridge-debt.json` | Lean bridge debt | `npm run bridge:audit` |
| `reports/` | Baselines lossless y roundtrip del editor | `npm run editor:roundtrip:audit` |
| `testing/` | Test taxonomy + partition report | `npm run test:report` |
| `api/` | TypeDoc (gitignored) | `npm run docs:build` |
| `dependency_graph.svg` | Depcruise graph (gitignored) | `npm run depcruise:graph` |
