import type { DiagramWorkbenchMode } from './diagrams/DiagramWorkbench';
import type { DiagramTargetRegistry } from '../core/editorTypes';
import { parseAttributes, type Block } from '../core/parser';
import type { FileNode } from '../lib/editorContracts';

export interface PageDiagramLink {
  componentName: string;
  importSource?: string;
  path?: string;
  role: 'Simulation' | 'Diagram' | 'Inline' | 'Imported';
  targets?: DiagramTargetRegistry;
}

function normalizeDiagramImportPath(source: string): string | undefined {
  const withoutExtension = source.replace(/\.tsx$/, '');
  if (withoutExtension.startsWith('@/')) return `${withoutExtension.slice(2)}.tsx`;
  const sharedIndex = withoutExtension.indexOf('shared/diagrams/');
  if (sharedIndex >= 0) return `${withoutExtension.slice(sharedIndex)}.tsx`;
  const widgetsIndex = withoutExtension.indexOf('widgets/diagrams/');
  if (widgetsIndex >= 0) return `${withoutExtension.slice(widgetsIndex)}.tsx`;
  return undefined;
}

function findDiagramFile(files: FileNode[], componentName: string, importSource?: string): FileNode | undefined {
  const normalizedPath = importSource ? normalizeDiagramImportPath(importSource) : undefined;
  return files.find(file => file.path === normalizedPath || file.path.endsWith(`/${componentName}.tsx`) || file.name === `${componentName}.tsx`);
}

export function getInlineDiagramTargets(blocks: Block[]): DiagramTargetRegistry {
  return blocks.flatMap(block => block.type === 'diagram' && Array.isArray(block.metadata?.targets) ? block.metadata.targets : []);
}

export function getDiagramWorkbenchMode(currentFile: string | null, activeDiagramBlock?: Block | null): DiagramWorkbenchMode {
  if (currentFile?.endsWith('.tsx')) return { kind: 'file', path: currentFile };
  if (activeDiagramBlock) {
    return {
      kind: 'inline',
      source: typeof activeDiagramBlock.metadata?.source === 'string' ? activeDiagramBlock.metadata.source : '',
      componentName: activeDiagramBlock.content || 'DiagramaInteractivo',
      model: activeDiagramBlock.metadata?.visualModel as Record<string, unknown> | undefined,
    };
  }
  return { kind: 'new', componentName: 'DiagramaInteractivo' };
}

export function buildPageDiagramLinks(currentFile: string | null, imports: string, exportsSource: string, files: FileNode[], blocks: Block[]): PageDiagramLink[] {
  if (!currentFile?.endsWith('.mdx')) return [];
  const links = new Map<string, PageDiagramLink>();
  const importRegex = /import\s+\{\s*([^}]+)\s*\}\s+from\s+['"]([^'"]+)['"]/g;
  let match: RegExpExecArray | null;
  while ((match = importRegex.exec(imports)) !== null) {
    const names = match[1].split(',').map(name => name.trim()).filter(Boolean);
    const importSource = match[2];
    for (const name of names) {
      const componentName = name.split(/\s+as\s+/i)[0].trim();
      if (!componentName) continue;
      const role = exportsSource.includes(`Simulation = ${componentName}`) ? 'Simulation'
        : exportsSource.includes(`Diagram = ${componentName}`) ? 'Diagram' : 'Imported';
      const diagramFile = findDiagramFile(files, componentName, importSource);
      links.set(componentName, { componentName, importSource, path: diagramFile?.path ?? normalizeDiagramImportPath(importSource), role });
    }
  }
  for (const block of blocks) {
    if (block.type !== 'diagram') continue;
    const existing = links.get(block.content);
    links.set(block.content, {
      componentName: block.content,
      importSource: typeof block.metadata?.importPath === 'string' ? block.metadata.importPath : existing?.importSource,
      path: typeof block.metadata?.path === 'string' ? block.metadata.path : existing?.path,
      role: existing?.role === 'Simulation' || existing?.role === 'Diagram' ? existing.role : 'Inline',
      targets: Array.isArray(block.metadata?.targets) ? block.metadata.targets : existing?.targets,
    });
  }
  return [...links.values()].filter(link => link.path?.includes('diagrams') || link.role !== 'Imported');
}

export function mergeDiagramTargets(inlineTargets: DiagramTargetRegistry, loadedTargets: DiagramTargetRegistry): DiagramTargetRegistry {
  const byId = new Map([...inlineTargets, ...loadedTargets].map(target => [target.qualifiedId ?? target.id, target]));
  return [...byId.values()];
}

export function getPreviewPath(metadata: Record<string, unknown>): string | null {
  const id = String(metadata.id || '').trim();
  if (!id) return null;
  const prefixes: Record<string, string> = {
    definicion: 'definicion', teorema: 'teorema', lema: 'teorema', corolario: 'teorema',
    demostracion: 'demo', axioma: 'axioma', modelo: 'modelo', ejemplo: 'ejemplo', ejercicio: 'ejercicio',
    'caso-de-uso': 'caso', 'plan-de-estudio': 'plan',
  };
  return prefixes[String(metadata.type || '')] ? `/${prefixes[String(metadata.type || '')]}/${id}` : null;
}

function proofStepTargetIds(target: string | string[] | undefined): string[] {
  if (!target) return [];
  return Array.isArray(target) ? target : [target];
}

export function buildPageConnectionSummary(blocks: Block[], diagramTargets: DiagramTargetRegistry) {
  const text = blocks.map(block => block.content).join('\n');
  const conceptHighlights = [...text.matchAll(/<ConceptLink\b([^>]*?)>([\s\S]*?)<\/ConceptLink>/g)]
    .map(match => ({ attrs: parseAttributes(match[1] || ''), label: match[2].replace(/<[^>]+>/g, '').trim() }))
    .filter(item => item.attrs.highlightTarget);
  const interactiveTargets = [...text.matchAll(/<InteractiveElement\b([^>]*?)>([\s\S]*?)<\/InteractiveElement>/g)]
    .map(match => ({ attrs: parseAttributes(match[1] || ''), label: match[2].replace(/<[^>]+>/g, '').trim() }))
    .filter(item => item.attrs.target);
  const proofTargets = blocks.filter(block => block.type === 'demonstration')
    .flatMap(block => ((block.metadata?.steps ?? []) as Array<{ target?: string | string[] }>).flatMap(item => proofStepTargetIds(item.target)))
    .map(target => ({ attrs: { target }, label: 'Paso de demostración' }));
  const connected = [
    ...conceptHighlights.map(item => ({ target: String(item.attrs.highlightTarget), label: item.label, kind: 'concepto + diagrama' })),
    ...interactiveTargets.map(item => ({ target: String(item.attrs.target), label: item.label, kind: 'diagrama' })),
    ...proofTargets.map(item => ({ target: String(item.attrs.target), label: item.label, kind: 'paso de demostración' })),
  ];
  const connectedTargetIds = new Set(connected.map(item => item.target));
  return {
    connected,
    missingTargets: diagramTargets.filter(target => !connectedTargetIds.has(target.id) && !connectedTargetIds.has(target.qualifiedId ?? '')),
    invalidConnections: connected.filter(reference => !diagramTargets.some(target => target.id === reference.target || target.qualifiedId === reference.target)),
    ambiguousConnections: connected.filter(reference => !reference.target.includes(':') && diagramTargets.filter(target => target.id === reference.target).length > 1),
  };
}
