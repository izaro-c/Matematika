import fs from 'node:fs';
import crypto from 'node:crypto';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const ROOT = process.cwd();
const CONTENT_DIR = path.join(ROOT, 'src/database/content');
const WIDGETS_DIAGRAMS_DIR = path.join(ROOT, 'src/widgets/diagrams');
const SHARED_DIAGRAMS_DIR = path.join(ROOT, 'src/shared/diagrams');
const OUTPUT_PATH = path.join(ROOT, 'src/entities/content/diagramUsageIndex.json');

export interface Usage {
  contentId: string;
  contentPath: string;
  referenceKind: string;
  sourceRange?: { start: number; end: number };
  blockId?: string;
}

export interface DiagramUsageIndex {
  schemaVersion: number;
  generatedBy: string;
  corpusHash: string;
  usages: Record<string, Usage[]>;
  paths: Record<string, string>;
}

function getMdxFiles(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];
  const files: string[] = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...getMdxFiles(full));
    } else if (entry.name.endsWith('.mdx')) {
      files.push(full);
    }
  }
  return files;
}

function relativePath(absolutePath: string): string {
  return path.relative(ROOT, absolutePath).split(path.sep).join('/');
}

function stableHash(input: string): string {
  return crypto.createHash('sha256').update(input, 'utf8').digest('hex');
}

function parseMetadata(content: string): Record<string, unknown> | null {
  const metadataRegex = /export\s+const\s+metadata\s*=\s*(\{[\s\S]*?\n\});?/;
  const match = content.match(metadataRegex);
  if (!match) return null;
  try {
    // eslint-disable-next-line sonarjs/code-eval
    const fn = new Function(`return ${match[1]}`);
    return fn();
  } catch {
    return null;
  }
}

function computeCorpusHash(files: string[]): string {
  const chunks = files.map(file => {
    const relative = relativePath(file);
    const content = fs.readFileSync(file, 'utf-8');
    return `${relative}\0${stableHash(content)}`;
  });
  return stableHash(chunks.join('\n'));
}

function sourceRangeForImport(content: string, componentName: string): { start: number; end: number } | undefined {
  const jsx = new RegExp(`<${componentName}(\\s|>|/)`);
  const simulation = new RegExp(`export\\s+const\\s+Simulation\\s*=\\s*${componentName}\\b`);
  const diagram = new RegExp(`export\\s+const\\s+Diagram\\s*=\\s*${componentName}\\b`);
  const candidates = [jsx.exec(content), simulation.exec(content), diagram.exec(content)]
    .filter((match): match is RegExpExecArray => match !== null)
    .sort((a, b) => a.index - b.index);
  const first = candidates[0];
  if (!first) return undefined;
  return { start: first.index, end: first.index + first[0].length };
}

export function generateDiagramUsageIndex(): DiagramUsageIndex {
  const mdxFiles = getMdxFiles(CONTENT_DIR);
  const diagramUsages = new Map<string, { diagramId: string; path: string; usages: Usage[] }>();

  // Helper to resolve diagram absolute path from import path inside an MDX
  const resolveDiagramPath = (mdxFile: string, importPath: string): string | null => {
    let resolved: string | null = null;
    if (importPath.startsWith('@/widgets/diagrams/')) {
      const sub = importPath.substring('@/widgets/diagrams/'.length);
      resolved = path.join(WIDGETS_DIAGRAMS_DIR, sub + (sub.endsWith('.tsx') ? '' : '.tsx'));
    } else if (importPath.startsWith('@/shared/diagrams/')) {
      const sub = importPath.substring('@/shared/diagrams/'.length);
      resolved = path.join(SHARED_DIAGRAMS_DIR, sub + (sub.endsWith('.tsx') ? '' : '.tsx'));
    } else if (importPath.startsWith('.') || importPath.startsWith('..')) {
      // Relative import
      const dir = path.dirname(mdxFile);
      const abs = path.resolve(dir, importPath);
      // It could match src/widgets/diagrams or src/shared/diagrams
      const ext = abs.endsWith('.tsx') ? '' : '.tsx';
      if (fs.existsSync(abs + ext) || abs.includes('/diagrams/')) {
        resolved = abs + ext;
      }
    }
    return resolved && fs.existsSync(resolved) ? resolved : null;
  };

  for (const mdxFile of mdxFiles.sort((a, b) => relativePath(a).localeCompare(relativePath(b)))) {
    const content = fs.readFileSync(mdxFile, 'utf-8');
    const metadata = parseMetadata(content);
    const contentId = metadata?.id || path.basename(mdxFile, '.mdx');
    const relMdxPath = relativePath(mdxFile);

    // Find import lines matching diagrams
    // e.g. import { Pitagoras } from '@/widgets/diagrams/Teoremas/Pitagoras';
    const importRegex = /import\s+(?:(\w+)|\{\s*(\w+)\s*\})\s+from\s+['"]([^'"]+)['"]/g;
    let match;
    const importedComponents = new Map<string, { componentName: string; diagramFile: string }>();

    while ((match = importRegex.exec(content)) !== null) {
      const componentName = match[1] || match[2];
      const importPath = match[3];
      if (importPath.includes('diagrams')) {
        const diagramFile = resolveDiagramPath(mdxFile, importPath);
        if (diagramFile) {
          importedComponents.set(componentName, {
            componentName,
            diagramFile: relativePath(diagramFile),
          });
        }
      }
    }

    // Now look for how they are referenced
    for (const [componentName, info] of importedComponents.entries()) {
      // Determine reference kind: Simulation, Diagram, or Component
      let referenceKind = 'Component';
      const simRegex = new RegExp(`export\\s+const\\s+Simulation\\s*=\\s*${componentName}\\b`);
      const diagRegex = new RegExp(`export\\s+const\\s+Diagram\\s*=\\s*${componentName}\\b`);

      if (simRegex.test(content)) {
        referenceKind = 'Simulation';
      } else if (diagRegex.test(content)) {
        referenceKind = 'Diagram';
      }

      const key = info.diagramFile;
      if (!diagramUsages.has(key)) {
        diagramUsages.set(key, {
          diagramId: path.basename(key, '.tsx'),
          path: info.diagramFile,
          usages: [],
        });
      }

      diagramUsages.get(key)!.usages.push({
        contentId,
        contentPath: relMdxPath,
        referenceKind,
        sourceRange: sourceRangeForImport(content, componentName),
        blockId: metadata?.id ? `${metadata.id}:diagram:${componentName}` : undefined,
      });
    }
  }

  const usages: Record<string, Usage[]> = {};
  const paths: Record<string, string> = {};

  for (const data of [...diagramUsages.values()].sort((a, b) => a.path.localeCompare(b.path))) {
    paths[data.diagramId] = data.path;
    usages[data.diagramId] = data.usages
      .sort((a, b) => a.contentPath.localeCompare(b.contentPath)
        || a.referenceKind.localeCompare(b.referenceKind)
        || a.contentId.localeCompare(b.contentId))
      .map(usage => Object.fromEntries(
        Object.entries(usage).filter(([, value]) => value !== undefined)
      ) as Usage);
  }

  return {
    schemaVersion: 1,
    generatedBy: 'scripts/editor/generate-diagram-usages.ts',
    corpusHash: computeCorpusHash(mdxFiles),
    paths,
    usages,
  };
}

function run() {
  const isCheck = process.argv.includes('--check');
  const indexData = generateDiagramUsageIndex();

  if (isCheck) {
    if (!fs.existsSync(OUTPUT_PATH)) {
      console.error(`❌ El archivo de índice no existe: ${relativePath(OUTPUT_PATH)}`);
      process.exit(1);
    }
    const existingText = fs.readFileSync(OUTPUT_PATH, 'utf-8').trim();
    const generatedText = JSON.stringify(indexData, null, 2).trim();
    if (existingText !== generatedText) {
      console.error('❌ El índice de usos de diagramas está desactualizado.');
      console.error('Por favor, ejecute "npm run diagram-usages:index" para regenerarlo.');
      process.exit(1);
    }
    console.log('✅ El índice de usos de diagramas está al día.');
  } else {
    fs.mkdirSync(path.dirname(OUTPUT_PATH), { recursive: true });
    fs.writeFileSync(OUTPUT_PATH, JSON.stringify(indexData, null, 2), 'utf-8');
    console.log(`✅ Índice de usos de diagramas generado con éxito: ${Object.keys(indexData.usages).length} diagramas indexados.`);
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  run();
}
