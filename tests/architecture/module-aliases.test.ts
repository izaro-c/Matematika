import { describe, expect, it } from 'vitest';
import { existsSync, readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadConfigFromFile } from 'vite';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');

/** Alias targets that must keep resolving for app + editor boot. */
const CRITICAL_ALIAS_MODULES = [
  '@/diagrams/spec',
  '@/diagrams/spec/v3Compatibility',
  '@/diagrams/constants',
  '@/data/content/schemas',
] as const;

const CRITICAL_FILES = [
  'src/diagrams/spec/index.ts',
  'src/diagrams/spec/v3Compatibility.ts',
  'src/diagrams/constants.ts',
  'src/data/content/schemas.ts',
  'src/app/main.tsx',
  'index.html',
  'vite.config.ts',
] as const;

describe('module aliases and vite boot contracts', () => {
  it('keeps critical alias target files on disk', () => {
    for (const rel of CRITICAL_FILES) {
      expect(existsSync(path.join(root, rel)), rel).toBe(true);
    }
  });

  it('resolves critical @/ modules through the vitest/vite alias', async () => {
    for (const id of CRITICAL_ALIAS_MODULES) {
      await expect(import(id), id).resolves.toBeTypeOf('object');
    }
  });

  it('loads vite.config without leaking unresolved @/ package imports', async () => {
    const loaded = await loadConfigFromFile(
      { command: 'serve', mode: 'development' },
      path.join(root, 'vite.config.ts'),
    );
    expect(loaded?.config).toBeTruthy();
    expect(loaded?.path).toMatch(/vite\.config\.ts$/);
  });

  it('keeps vite.config static bundle free of bare @/ imports', () => {
    // Run esbuild in a real Node process: jsdom breaks esbuild's Uint8Array invariant.
    const script = [
      "const { build } = require('esbuild');",
      `build({ absWorkingDir: ${JSON.stringify(root)}, entryPoints: ['vite.config.ts'], bundle: true, write: false, platform: 'node', format: 'esm', packages: 'external', logLevel: 'silent' })`,
      '.then((result) => {',
      "  const code = result.outputFiles.map((f) => f.text).join('\\n');",
      "  if (code.includes(\"from '@/\") || code.includes('from \"@/')) {",
      "    console.error('leaked @/ import in vite config bundle');",
      '    process.exit(1);',
      '  }',
      '});',
    ].join('\n');
    expect(() =>
      execFileSync(process.execPath, ['-e', script], { cwd: root, encoding: 'utf8' }),
    ).not.toThrow();
  });
  it('does not statically import scripts/editor into vite.config', () => {
    const source = readFileSync(path.join(root, 'vite.config.ts'), 'utf8');
    expect(source).not.toMatch(/from\s+['"]\.\/scripts\/editor\//);
    expect(source).toMatch(/createJiti/);
  });

  it('points index.html at src/app/main.tsx', () => {
    const html = readFileSync(path.join(root, 'index.html'), 'utf8');
    expect(html).toMatch(/src=["']\/src\/app\/main\.tsx["']/);
  });
});
