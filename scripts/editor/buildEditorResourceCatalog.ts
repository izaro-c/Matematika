import fs from 'node:fs';
import path from 'node:path';
import { parseEditorDocument } from '../../src/features/editor/document/parseEditorDocument';
import {
  RESOURCE_CAPABILITY_LABELS,
  isEditableCatalogResource,
  type EditorResourceCapability,
  type EditorResourceCatalogEntry,
} from '../../src/features/editor/catalog/resourceCatalogTypes';
import { parseDiagramSourceAST } from './parseDiagramSourceAST';

function walkFiles(root: string): string[] {
  if (!fs.existsSync(root)) return [];
  return fs.readdirSync(root, { withFileTypes: true }).flatMap(entry => {
    const absolute = path.join(root, entry.name);
    return entry.isDirectory() ? walkFiles(absolute) : [absolute];
  });
}

function normalizedRelative(srcRoot: string, absolutePath: string): string {
  return path.relative(srcRoot, absolutePath).split(path.sep).join('/');
}

function entry(
  srcRoot: string,
  absolutePath: string,
  type: string,
  kind: EditorResourceCatalogEntry['kind'],
  capability: EditorResourceCapability,
  reason: string,
): EditorResourceCatalogEntry {
  return {
    path: normalizedRelative(srcRoot, absolutePath),
    name: path.basename(absolutePath),
    type,
    kind,
    capability,
    capabilityLabel: RESOURCE_CAPABILITY_LABELS[capability],
    reason,
  };
}

function mdxCapability(source: string): { capability: EditorResourceCapability; reason: string } {
  const document = parseEditorDocument(source);
  if (document.compatibility === 'unsupported') {
    return {
      capability: 'invalid',
      reason: document.compatibilityReasons.join(' ') || 'El documento MDX no se puede analizar con seguridad.',
    };
  }
  if (document.compatibility === 'read-only') {
    return {
      capability: 'code-preview',
      reason: 'El documento es real y renderizable, pero no contiene rangos visuales editables con exactitud.',
    };
  }
  return {
    capability: 'visual-exact',
    reason: document.compatibility === 'partially-editable'
      ? 'Los rangos visuales representados se editan de forma localizada; el resto se preserva literalmente.'
      : 'Todos los rangos visuales representados se editan de forma localizada y exacta.',
  };
}

function diagramCapability(source: string): { capability: EditorResourceCapability; reason: string } {
  const parsed = parseDiagramSourceAST(source);
  if (parsed.status === 'visual-exact') {
    return {
      capability: 'visual-exact',
      reason: 'El modelo visual regenera el archivo TSX completo de forma idéntica.',
    };
  }
  if (parsed.status === 'code-preview') {
    return {
      capability: 'code-preview',
      reason: 'El TSX es válido y dispone de vista previa real, pero no admite regeneración visual completa.',
    };
  }
  return {
    capability: 'invalid',
    reason: parsed.diagnostics.map(item => item.message).join(' ') || 'El recurso TSX no es válido.',
  };
}

export interface BuildEditorResourceCatalogOptions {
  srcRoot: string;
  includeInternal?: boolean;
}

export function buildEditorResourceCatalog({
  srcRoot,
  includeInternal = true,
}: BuildEditorResourceCatalogOptions): EditorResourceCatalogEntry[] {
  const catalog: EditorResourceCatalogEntry[] = [];
  const contentRoot = path.join(srcRoot, 'database', 'content');
  const diagramsRoot = path.join(srcRoot, 'widgets', 'diagrams');
  const internalRoots = [
    path.join(srcRoot, 'shared', 'diagrams'),
    path.join(srcRoot, 'shared', 'templates'),
  ];

  for (const absolutePath of walkFiles(contentRoot)) {
    if (path.extname(absolutePath) !== '.mdx') continue;
    const source = fs.readFileSync(absolutePath, 'utf8');
    const classified = mdxCapability(source);
    const relativeDirectory = path.relative(contentRoot, path.dirname(absolutePath)).split(path.sep)[0] || 'content';
    catalog.push(entry(srcRoot, absolutePath, relativeDirectory, 'mdx-document', classified.capability, classified.reason));
  }

  for (const absolutePath of walkFiles(diagramsRoot)) {
    const extension = path.extname(absolutePath);
    if (extension !== '.tsx') {
      if (includeInternal) {
        catalog.push(entry(srcRoot, absolutePath, 'internal', 'internal', 'internal', 'Archivo auxiliar del módulo de diagramas.'));
      }
      continue;
    }
    const source = fs.readFileSync(absolutePath, 'utf8');
    const classified = diagramCapability(source);
    const category = path.relative(diagramsRoot, path.dirname(absolutePath)).split(path.sep)[0] || 'general';
    catalog.push(entry(srcRoot, absolutePath, `diagram-${category.toLowerCase()}`, 'diagram', classified.capability, classified.reason));
  }

  if (includeInternal) {
    for (const internalRoot of internalRoots) {
      for (const absolutePath of walkFiles(internalRoot)) {
        catalog.push(entry(
          srcRoot,
          absolutePath,
          'internal',
          'internal',
          'internal',
          'Infraestructura o plantilla del sistema; no es un diagrama final editable.',
        ));
      }
    }
  }

  return catalog.sort((left, right) => left.path.localeCompare(right.path));
}

export function listEditableCatalogResources(srcRoot: string): EditorResourceCatalogEntry[] {
  return buildEditorResourceCatalog({ srcRoot, includeInternal: false }).filter(isEditableCatalogResource);
}
