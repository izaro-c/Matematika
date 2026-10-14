---
paths:
  - "content/mdx/**"
---

# MDX Content Rules

All knowledge graph nodes under `content/mdx/` must obey these constraints:

1. **Trilingual Parity (1:1)**: Every node must exist in all three languages (`es/`, `en/`, `eu/`) with identical structure, same `<ConceptLink>` targets, same `isDependency` attributes, and matching formulas. Write `es` first, then derive `en` and `eu`.
2. **Immutable `targetId`**: Concept links use neutral/Spanish kebab-case `targetId` (e.g. `targetId="recta-secante"`). NEVER translate `targetId` across languages.
3. **Strict DAG Causality**: Set `isDependency={true}` ONLY on constitutive antecedents (axioms, definitions, prior lemmas/theorems). NEVER set a dependency from a theorem to its proof (`demostracion`), nor create cycles.
4. **KaTeX & Typography**: KaTeX follows ISO 80000-2. Never embed JSX inside `$`. First sentence must be direct definition or statement without meta-preamble.
5. **Fast Verification**:
   ```bash
   node .agents/skills/matematika-content-generator/scripts/check-parity.mjs <id>
   npm run validate-references && npm run validate-graph
   ```
