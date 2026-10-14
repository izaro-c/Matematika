---
paths:
  - "src/fixed-pages/editor/**"
  - "tests/features/editor/**"
  - "scripts/editor/**"
---

# Editor Engine Architecture Rules

Guidelines for modifying or extending the visual editor and roundtrip AST engines:

1. **Lossless AST Editing**: All code modifications to MDX or diagram specs must operate via character offsets on AST nodes (*lossless editing*). Never re-serialize or reformat untouched sections or wipe user formatting/comments.
2. **UI Purity & No Side-Effects**: UI components must never perform direct `fetch` calls, network side-effects, or uncoordinated file writes. State transitions must pass through dedicated pure engine actions or stores.
3. **Envelope Integrity**: Diagram specs must strictly preserve envelope markers (`/* @matematika-diagram-spec:start */` / `/* @matematika-diagram-spec:end */`).
4. **Fast Verification**:
   ```bash
   npm run editor:safety:check
   npm run editor:test:unit
   ```
