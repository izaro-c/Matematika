import { describe, it, expect } from 'vitest';
import { parseMDX, stringifyMDX } from '@/shared/lib/mdxParser';

describe('mdxParser', () => {
  it('parseMDX parses valid MDX with metadata, imports and body', () => {
    const raw = `export const metadata = {
  "id": "test",
  "title": "Test Title"
};

import { Demo } from '@/shared/diagrams/Demo';

# Hello World
This is the body.`;

    const result = parseMDX(raw);
    expect(result.metadata).toEqual({ id: 'test', title: 'Test Title' });
    expect(result.imports).toBe("import { Demo } from '@/shared/diagrams/Demo';");
    expect(result.body).toBe("# Hello World\nThis is the body.");
  });

  it('parseMDX handles missing metadata safely', () => {
    const raw = `import { Demo } from 'demo';\n\nBody content.`;
    const result = parseMDX(raw);
    expect(result.metadata).toEqual({});
    expect(result.imports).toBe("import { Demo } from 'demo';");
    expect(result.body).toBe("Body content.");
  });

  it('parseMDX handles malformed metadata without crashing', () => {
    const raw = `export const metadata = {
  id: "test",
  malformed
};

Body.`;
    const result = parseMDX(raw);
    // Should fallback to empty object or just catch error
    expect(result.metadata).toEqual({});
    expect(result.body).toBe("Body.");
  });

  it('stringifyMDX assembles the parts correctly', () => {
    const metadata = { id: 'test', title: 'Test Title' };
    const imports = "import { Demo } from 'demo';";
    const body = "# Hello World";

    const result = stringifyMDX(metadata, imports, body);
    expect(result).toContain(`export const metadata = {`);
    expect(result).toContain(`"id": "test"`);
    expect(result).toContain(imports);
    expect(result).toContain(body);
  });

  it('stringifyMDX assembles without imports', () => {
    const metadata = { id: 'test' };
    const result = stringifyMDX(metadata, "", "Body only.");
    expect(result).not.toContain("import ");
    expect(result).toContain("Body only.");
  });

  it('stringifyMDX separates ESM exports from the MDX body for Acorn', () => {
    const result = stringifyMDX(
      { id: 'altura', type: 'definicion', title: 'Altura', description: 'Altura' },
      "import { Altura } from '@/widgets/diagrams/Definiciones/Altura';",
      '<Capitular letra="L" />a altura.',
      'export const Simulation = Altura;',
    );

    expect(result).toContain('export const Simulation = Altura;\n\n<Capitular letra="L" />');
  });

  it('parseMDX keeps multiline Component exports out of the visual body', () => {
    const raw = `export const metadata = {
  "id": "demo",
  "type": "demostracion",
  "title": "Demo",
  "parentTheorem": "teorema"
};

import { DemonstrationSection } from '@/widgets/content/DemonstrationSection';

export const Component = () => {
  return (
    <DemonstrationSection>
      <p>Prueba</p>
    </DemonstrationSection>
  );
};

<Capitular letra="P" />rueba textual.`;

    const result = parseMDX(raw);

    expect(result.exports).toContain('export const Component');
    expect(result.exports).toContain('<DemonstrationSection>');
    expect(result.body).toBe('<Capitular letra="P" />rueba textual.');
  });
});
