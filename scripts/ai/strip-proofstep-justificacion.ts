#!/usr/bin/env tsx
/**
 * Strip legacy ProofStep justification attrs from MDX corpus.
 * Usage: npx tsx scripts/ai/strip-proofstep-justificacion.ts [--write]
 */
import { readdirSync, readFileSync, writeFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { stripProofStepLegacyJustificationAttrs } from '../../src/fixed-pages/editor/types/editorContracts';

const write = process.argv.includes('--write');
const roots = ['content/mdx', 'src/content-pages', 'tests/fixtures'];

function walk(dir: string, out: string[] = []): string[] {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    const st = statSync(p);
    if (st.isDirectory()) walk(p, out);
    else if (name.endsWith('.mdx')) out.push(p);
  }
  return out;
}

let changed = 0;
for (const root of roots) {
  try {
    const files = walk(root);
    for (const file of files) {
      const src = readFileSync(file, 'utf8');
      if (!/justificacion=|justificationType=|dependencyId=/.test(src)) continue;
      const next = stripProofStepLegacyJustificationAttrs(src);
      if (next === src) continue;
      changed += 1;
      console.log(`${write ? 'WRITE' : 'DRY'} ${file}`);
      if (write) writeFileSync(file, next);
    }
  } catch {
    continue;
  }
}
console.log(`${changed} file(s) ${write ? 'updated' : 'would change'}`);
