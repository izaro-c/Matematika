import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import {
  ARTS_AND_CRAFTS_COLORS,
  EDITOR_REFERENCE_COLORS,
  EDITOR_THEME_COLOR_OPTIONS,
  buildConceptLink,
  buildInteractiveReference,
  ensureProofStepJustifications,
  getBlockSnippet,
  normalizeContentId,
  normalizeWizardData,
  type WizardData,
} from '@/features/editor/lib/editorContracts';
import {
  buildDiagramPath,
  buildContentPath,
  getInternalLinkUrl,
} from '@/features/editor/lib/editorPaths';
import {
  applyTemplateReplacements,
  applyTypeSpecificMetadata,
} from '@/features/editor/lib/editorUtils';
import { generateMissingComponentImports } from '@/features/editor/lib/editorImports';
import { TheoremSchema } from '@/entities/content/schemas';

const wizardData: WizardData = {
  type: 'theorems',
  id: '  Teorema del Ángulo_Recto  ',
  title: 'Teorema del ángulo recto',
  description: 'Una descripción.',
  era: '',
  birth: '',
  death: '',
  color: 'dorado',
  authors: 'Euclides, David Hilbert',
  tags: 'geometría, ángulos',
  corollaries: 'Corolario Uno',
  demos: 'Demo Ángulo Recto',
  parentTheorem: '',
  proofMethod: '',
  lemmas: '',
  satisfies: '',
  axioms_verified: '',
  hasDiagram: false,
};

describe('editor identity and path contracts', () => {
  it('normalizes generated content IDs and paths to kebab-case', () => {
    expect(normalizeContentId('  Teorema del Ángulo_Recto  ')).toBe('teorema-del-angulo-recto');
    expect(buildContentPath('Theorems', 'Ángulo Recto_II.mdx')).toBe(
      'database/content/theorems/angulo-recto-ii.mdx',
    );
    expect(buildDiagramPath('Definiciones', 'Triángulo.tsx')).toBe(
      'widgets/diagrams/definiciones/triangulo.tsx',
    );
    expect(getInternalLinkUrl({
      path: 'database/content/theorems/Ángulo Recto.mdx',
      name: 'Ángulo Recto.mdx',
      type: 'theorems',
      kind: 'mdx-document',
      capability: 'visual-exact',
      capabilityLabel: 'Edición visual exacta',
      reason: 'fixture',
    })).toBe('/teorema/angulo-recto');
  });

  it('normalizes wizard IDs, related IDs and invalid colors at the generation boundary', () => {
    const normalized = normalizeWizardData(wizardData);

    expect(normalized).toMatchObject({
      id: 'teorema-del-angulo-recto',
      color: 'terracota',
      authors: 'euclides, david-hilbert',
      corollaries: 'corolario-uno',
      demos: 'demo-angulo-recto',
    });
  });
});

describe('editor MDX generation contracts', () => {
  it('generates semantic concept links instead of generic markdown links', () => {
    const link = buildConceptLink('Teorema de Tales', 'teorema de Tales');

    expect(link).toBe(
      '<ConceptLink targetId="teorema-de-tales" isDependency={false}>teorema de Tales</ConceptLink>',
    );
    expect(link).not.toContain('](');
  });

  it('always gives the ProofStep snippet an explicit justification', () => {
    const snippet = getBlockSnippet('medieval-step');

    expect(snippet).toContain('<ProofStep');
    expect(snippet).toContain('justificacion="Especificar justificación lógica"');
  });

  it('adds a justification to ProofSteps supplied by legacy editor templates', () => {
    const body = '<ProofStep number={1} title="Paso inicial" />\nTexto';

    expect(ensureProofStepJustifications(body)).toBe(
      '<ProofStep number={1} title="Paso inicial" justificacion="Especificar justificación lógica" />\nTexto',
    );
    expect(ensureProofStepJustifications(
      '<ProofStep number={1} title="Paso" justificacion="Por hipótesis" />',
    )).toContain('justificacion="Por hipótesis"');
  });

  it('only offers palette colors and guards generated interactive references', () => {
    const palette = new Set<string>(ARTS_AND_CRAFTS_COLORS);

    expect(EDITOR_THEME_COLOR_OPTIONS.every(option => palette.has(option.value))).toBe(true);
    expect(EDITOR_REFERENCE_COLORS.every(color => palette.has(color))).toBe(true);
    expect(EDITOR_THEME_COLOR_OPTIONS.some(option => option.value === 'dorado')).toBe(false);
    expect(buildInteractiveReference('lado-c', 'dorado', '$c$')).toBe(
      '<InteractiveElement target="lado-c" color="salvia">$c$</InteractiveElement>',
    );
  });
});

describe('editor metadata and import contracts', () => {
  it('builds schema-compatible theorem metadata without mutating parsed metadata', () => {
    const normalized = normalizeWizardData({ ...wizardData, color: 'ocre' });
    const parsedMetadata: Record<string, unknown> = {
      id: normalized.id,
      title: normalized.title,
      description: normalized.description,
    };
    const metadata = applyTypeSpecificMetadata(normalized, parsedMetadata);

    expect(metadata).not.toBe(parsedMetadata);
    expect(parsedMetadata).not.toHaveProperty('type');
    expect(metadata).toMatchObject({
      id: 'teorema-del-angulo-recto',
      type: 'teorema',
      color: 'ocre',
      authors: ['euclides', 'david-hilbert'],
    });
    expect(TheoremSchema.safeParse(metadata).success).toBe(true);
  });

  it('uses normalized values in template replacements', () => {
    const normalized = normalizeWizardData(wizardData);

    expect(applyTemplateReplacements('{{ID}}|{{COLOR}}', normalized)).toBe(
      'teorema-del-angulo-recto|terracota',
    );
  });

  it('generates missing component imports without duplicating existing imports', () => {
    const result = generateMissingComponentImports({
      body: '<DemoTales />\n<Formula />\n<DemoTales />',
      currentImports: "import { Formula } from '@/shared/ui/Formula';",
      currentFile: 'database/content/theorems/teorema-tales.mdx',
      files: [
        {
          path: 'widgets/diagrams/Teoremas/DemoTales.tsx',
          name: 'DemoTales.tsx',
          type: 'diagram-teoremas',
          kind: 'diagram',
          capability: 'code-preview',
          capabilityLabel: 'Edición de código con vista previa',
          reason: 'fixture',
        },
      ],
    });

    expect(result.added).toBe(1);
    expect(result.imports).toContain(
      "import { DemoTales } from '../../../widgets/diagrams/Teoremas/DemoTales';",
    );
    expect(result.imports.match(/DemoTales/g)).toHaveLength(2);
  });

  it('keeps pure editor modules free from React, Monaco and fetch', () => {
    const libDirectory = path.resolve(import.meta.dirname, '../../../src/features/editor/lib');
    const pureModules = [
      'editorContracts.ts',
      'editorImports.ts',
      'editorPaths.ts',
      'editorUtils.ts',
    ];

    for (const moduleName of pureModules) {
      const source = fs.readFileSync(path.join(libDirectory, moduleName), 'utf8');
      expect(source, moduleName).not.toMatch(/from\s+['"]react|@monaco-editor|\bfetch\s*\(/);
    }
  });
});
