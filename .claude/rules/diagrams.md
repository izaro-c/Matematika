---
paths:
  - "src/diagrams/**"
  - "content/diagrams/**"
  - "tests/diagrams/**"
  - "tests/features/editor/diagrams/**"
---

# Diagram Rules (v3 Specification)

All geometric and analytic diagrams in Matematika must follow these rules:

1. **Spec & Imports**: Use the v3 specification wrapped in `/* @matematika-diagram-spec:start */` and `/* @matematika-diagram-spec:end */` with `createDiagramSpec(...)`. Import canonically from `@/diagrams/public`.
2. **Official Palette**: Use only official design tokens: `carbon`, `terracota`, `canela`, `mora`, `ocre`, `pavo`, `granada`, `musgo`.
3. **Figure Persistence in Steps**: In multi-step demonstrations, NEVER hide the base figure. Keep elements visible in `visibleTargets` and guide cognitive focus via highlights (`objectStates: { [id]: { emphasis: 'primary' } }`).
4. **MDX Synchronization**: Every `<VisualBind element="ID">` in MDX must equal the target key (`targetId ?? id`) of an object or group with `"target": true`; target keys are unique per diagram. Every `<ProofStep diagramStep="…">` must name a step in `spec.steps`.
5. **Fast Verification**:
   ```bash
   npx tsx .agents/skills/matematika-diagram-generator/scripts/verify-diagram.ts <path-to-diagram.tsx>
   node .agents/skills/matematika-content-generator/scripts/validate-nodes.mjs <mdx-node-id>
   ```
