import { describe, expect, it } from 'vitest';
import { auditSource } from '../../../scripts/editor/corpusAuditCore';

describe('mode round-trip regressions', () => {
  it.each([
    ['metadata/import/export', `import X from './x';\n\nexport const metadata = { title: 'T' };\n\nTexto.\n\nexport const value = 1;`],
    ['comments and whitespace', `export const metadata = { title: 'T' };\n\n{/* comentario */}\n\nTexto con  espacios.\n`],
    ['inline and display math', `Sea $x$ real.\n\n$$\nx^2 + 1\n$$`],
    ['nested JSX and expressions', `<Caja options={{ list: [1, 2] }}>\n  {condition ? <A /> : <B />}\n</Caja>`],
    ['multiline ESM', `import {\n  A,\n  B\n} from './x';\n\nexport const metadata = {\n  title: 'T'\n};\n\nTexto.`]
  ])('preserves %s byte for byte', (_name, source) => {
    const result = auditSource(source, 'fixture.mdx');
    expect(result.finalHash).toBe(result.originalHash);
    expect(result.exact).toBe(true);
    expect(result.envelopePreserved).toBe(true);
    expect(result.bodyPreserved).toBe(true);
  });
});
