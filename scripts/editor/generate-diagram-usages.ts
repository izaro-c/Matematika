import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const ROOT = process.cwd();
const CONTENT_DIR = path.join(ROOT, 'src/database/content');
const WIDGETS_DIAGRAMS_DIR = path.join(ROOT, 'src/widgets/diagrams');
const SHARED_DIAGRAMS_DIR = path.join(ROOT, 'src/shared/diagrams');
const OUTPUT_PATH = path.join(ROOT, 'src/entities/content/diagramUsageIndex.json');

interface Usage {
  contentId?: string;
  contentPath: string;
  referenceKind: string;
}

interface DiagramUsageEntry {
  diagramId: string;
  diagramPath: string;
  usages: Usage[];
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

function parseMetadata(content: string): Record<string, any> | null {
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

export function generateDiagramUsageIndex(): DiagramUsageEntry[] {
  const mdxFiles = getMdxFiles(CONTENT_DIR);
  const diagramUsages = new Map<string, { path: string; usages: Usage[] }>();

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

  for (const mdxFile of mdxFiles) {
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
          path: info.diagramFile,
          usages: [],
        });
      }

      diagramUsages.get(key)!.usages.push({
        contentId,
        contentPath: relMdxPath,
        referenceKind,
      });
    }
  }

  // Sort and build final array
  const entries: DiagramUsageEntry[] = [];
  for (const [diagPath, data] of diagramUsages.entries()) {
    const diagramId = path.basename(diagPath, '.tsx');
    // Sort usages stably by contentPath
    const sortedUsages = data.usages.sort((a, b) => a.contentPath.localeCompare(b.contentPath));
    entries.push({
      diagramId,
      diagramPath: diagPath,
      usages: sortedUsages,
    });
  }

  // Sort entries stably by diagramPath
  return entries.sort((a, b) => a.diagramPath.localeCompare(b.diagramPath));
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
    console.log(`✅ Índice de usos de diagramas generado con éxito: ${indexData.length} diagramas indexados.`);
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  run();
}
