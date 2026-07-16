import contentIndex from '@/entities/content/contentIndex.json';
import type { Block, BlockType } from '../core/parser';
import { parseAttributes } from '../core/parser';
import type { DiagramTargetRegistry, EditorValidationIssue } from '../core/editorTypes';

export interface OutlineItem {
  id: string;
  label: string;
  kind: BlockType;
  level: number;
  sourceStart?: number;
}

const BLOCK_LABELS: Partial<Record<BlockType, string>> = {
  paragraph: 'Párrafo', heading: 'Sección', list: 'Lista', table: 'Tabla', formula: 'Fórmula',
  definition_box: 'Definición', note: 'Advertencia o nota', citation: 'Cita',
  demonstration: 'Paso de demostración', exercise: 'Ejercicio', diagram: 'Diagrama',
  advancedMdx: 'MDX preservado', separator: 'Separador',
};

export function buildDocumentOutline(blocks: Block[]): OutlineItem[] {
  return blocks.map((block, index) => ({
    id: block.id,
    label: block.type === 'heading'
      ? block.content.trim() || `Sección ${index + 1}`
      : `${BLOCK_LABELS[block.type] ?? block.type} ${index + 1}`,
    kind: block.type,
    level: block.type === 'heading' ? Number(block.metadata?.level) || 3 : 4,
    sourceStart: block.metadata?.location?.range?.start,
  }));
}

interface IndexedEntry {
  id: string;
  filePath: string;
  contentType: string;
  metadata: Record<string, unknown>;
}

const INDEX_ENTRIES = Object.values(contentIndex as Record<string, IndexedEntry>);

export interface SemanticReference {
  tag: 'ConceptLink' | 'RefLink';
  targetId: string;
  isDependency: boolean;
  start: number;
  end: number;
}

export function extractSemanticReferences(source: string): SemanticReference[] {
  return [...source.matchAll(/<(ConceptLink|RefLink)\b([^>]*)>/g)].flatMap(match => {
    const attrs = parseAttributes(match[2] || '');
    const rawTargets = Array.isArray(attrs.targetId) ? attrs.targetId : [attrs.targetId];
    return rawTargets
      .filter((target): target is string => typeof target === 'string' && target.length > 0)
      .map(targetId => ({
        tag: match[1] as SemanticReference['tag'],
        targetId,
        isDependency: match[1] === 'ConceptLink' && attrs.isDependency !== false && attrs.isDependency !== 'false',
        start: match.index ?? 0,
        end: (match.index ?? 0) + match[0].length,
      }));
  });
}

function referencesFromMetadata(metadata: Record<string, unknown>): string[] {
  const keys = [
    'authors', 'lemmas', 'corollaries', 'demos', 'requires', 'examples', 'exercises',
    'parentTheorem', 'axiomas', 'models', 'relatedTheorem', 'satisfies', 'axioms_verified',
    'concept', 'requiredNodes', 'dependencias', 'proofMethod', 'axiomSystem', 'links',
  ];
  return keys.flatMap(key => {
    const value = metadata[key];
    return (Array.isArray(value) ? value : [value]).filter((item): item is string => (
      typeof item === 'string' && item.length > 0 && !item.startsWith('checkpoint-')
    ));
  });
}

function dependenciesFromMetadata(metadata: Record<string, unknown>): string[] {
  const keys = [
    'lemmas', 'corollaries', 'demos', 'requires', 'parentTheorem', 'axiomas',
    'axioms_verified', 'dependencias', 'links',
  ];
  return keys.flatMap(key => {
    const value = metadata[key];
    return (Array.isArray(value) ? value : [value]).filter((item): item is string => (
      typeof item === 'string' && item.length > 0
    ));
  });
}

function semanticAssociationsFromMetadata(metadata: Record<string, unknown>): Set<string> {
  const associations = new Set<string>();
  if (metadata.type === 'axioma' && typeof metadata.axiomSystem === 'string') {
    associations.add(metadata.axiomSystem);
  }
  return associations;
}

function dependsTransitively(start: string, target: string, graph: Map<string, string[]>): boolean {
  const pending = [start];
  const seen = new Set<string>();
  while (pending.length > 0) {
    const current = pending.pop() as string;
    if (current === target) return true;
    if (seen.has(current)) continue;
    seen.add(current);
    pending.push(...(graph.get(current) ?? []));
  }
  return false;
}

function normalizedContentPath(path: string): string {
  return path.replace(/^src\//, '').replace(/^database\/content\//, '');
}

export interface AuthoringIntegrityInput {
  source: string;
  metadata: Record<string, unknown>;
  currentFile: string | null;
  diagramTargets: DiagramTargetRegistry;
  entries?: IndexedEntry[];
}

/** Current-document report; global validators remain the release authority. */
// The report deliberately keeps every current-document integrity rule in one deterministic pass.
// eslint-disable-next-line sonarjs/cognitive-complexity
export function buildAuthoringIntegrityReport(input: AuthoringIntegrityInput): EditorValidationIssue[] {
  const entries = input.entries ?? INDEX_ENTRIES;
  const currentId = typeof input.metadata.id === 'string' ? input.metadata.id : '';
  const knownIds = new Set(entries.map(entry => entry.id));
  if (currentId) knownIds.add(currentId);
  const issues: EditorValidationIssue[] = [];
  const refs = extractSemanticReferences(input.source);

  for (const reference of refs) {
    if (!knownIds.has(reference.targetId)) {
      issues.push({
        id: `broken-${reference.tag}-${reference.targetId}-${reference.start}`,
        severity: 'warning', area: 'body',
        message: `${reference.tag} apunta a un ID aún no resuelto: ${reference.targetId}.`,
        sourceRange: { start: reference.start, end: reference.end },
      });
    }
  }
  for (const target of referencesFromMetadata(input.metadata)) {
    if (!knownIds.has(target)) issues.push({
      id: `broken-metadata-${target}`, severity: 'warning', area: 'metadata',
      message: `La referencia de metadatos ${target} no existe en el índice actual.`,
    });
  }

  if (currentId) {
    const currentPath = normalizedContentPath(input.currentFile ?? '');
    const duplicates = entries.filter(entry => entry.id === currentId && normalizedContentPath(entry.filePath) !== currentPath);
    if (duplicates.length > 0) issues.push({
      id: `duplicate-content-id-${currentId}`, severity: 'error', area: 'metadata',
      message: `El ID público ${currentId} ya pertenece a ${duplicates.map(item => item.filePath).join(', ')}.`,
    });
  }

  const publicIds = [...input.source.matchAll(/\bid\s*=\s*(?:"([^"]+)"|'([^']+)')/g)]
    .map(match => match[1] || match[2]);
  const duplicatePublicIds = [...new Set(publicIds.filter((id, index) => publicIds.indexOf(id) !== index))];
  if (duplicatePublicIds.length > 0) issues.push({
    id: 'duplicate-jsx-public-ids', severity: 'error', area: 'body',
    message: `IDs JSX duplicados en el documento: ${duplicatePublicIds.join(', ')}.`,
  });

  const duplicateDiagramTargets = input.diagramTargets.filter((target, index, all) => (
    all.findIndex(candidate => (candidate.qualifiedId ?? candidate.id) === (target.qualifiedId ?? target.id)) !== index
  ));
  if (duplicateDiagramTargets.length > 0) issues.push({
    id: 'duplicate-diagram-targets', severity: 'error', area: 'diagram',
    message: `Targets duplicados: ${[...new Set(duplicateDiagramTargets.map(item => item.qualifiedId ?? item.id))].join(', ')}.`,
  });

  const knownDiagramTargets = new Set(input.diagramTargets.flatMap(target => [target.id, target.qualifiedId].filter(Boolean) as string[]));
  const diagramRefs = [...input.source.matchAll(/\b(?:target|highlightTarget)\s*=\s*"([^"]+)"/g)];
  for (const match of diagramRefs) {
    const target = match[1];
    if (input.diagramTargets.length > 0 && !knownDiagramTargets.has(target) && !/^step\d+$/i.test(target)) {
      issues.push({
        id: `broken-diagram-target-${target}-${match.index}`, severity: 'error', area: 'diagram',
        message: `La referencia MDX apunta a un target de diagrama inexistente: ${target}.`,
        sourceRange: { start: match.index ?? 0, end: (match.index ?? 0) + match[0].length },
      });
    }
  }

  const graph = new Map(entries.map(entry => [entry.id, dependenciesFromMetadata(entry.metadata)]));
  const semanticAssociations = semanticAssociationsFromMetadata(input.metadata);
  const dependencies = new Set([
    ...dependenciesFromMetadata(input.metadata),
    ...refs
      .filter(reference => reference.isDependency && !semanticAssociations.has(reference.targetId))
      .map(reference => reference.targetId),
  ]);
  for (const dependency of dependencies) {
    if (dependency === currentId) issues.push({
      id: `self-dependency-${dependency}`, severity: 'error', area: 'metadata',
      message: `La página no puede depender de sí misma (${dependency}).`,
    });
    else if (currentId && dependsTransitively(dependency, currentId, graph)) issues.push({
      id: `cyclic-dependency-${dependency}`, severity: 'error', area: 'metadata',
      message: `La dependencia ${dependency} introduce un ciclo topológico con ${currentId}.`,
    });
  }
  return issues;
}

export const PAGE_TYPE_DIRECTORIES: Record<string, string> = {
  axioma: 'axioms', 'sistema-axiomatico': 'axiomatic-systems', definicion: 'definitions',
  teorema: 'theorems', lema: 'theorems', corolario: 'theorems', demostracion: 'demonstrations',
  ejemplo: 'examples', ejercicio: 'exercises', metodo: 'methods', matematico: 'mathematicians',
  modelo: 'models', 'caso-de-uso': 'usecases', 'plan-de-estudio': 'plans',
};

export interface CreatePageInput {
  id: string;
  type: string;
  title: string;
  description: string;
  relatedId?: string;
}

export function createPagePath(input: CreatePageInput): string {
  const directory = PAGE_TYPE_DIRECTORIES[input.type];
  if (!directory) throw new Error(`Tipo no soportado: ${input.type}`);
  return `database/content/${directory}/${input.id}.mdx`;
}

function metadataForNewPage(input: CreatePageInput): Record<string, unknown> {
  const metadata: Record<string, unknown> = {
    id: input.id, type: input.type, title: input.title, description: input.description,
  };
  if (input.type === 'definicion') metadata.subtype = 'nominal';
  if (input.type === 'metodo') metadata.subtype = 'demostracion';
  if (['lema', 'corolario', 'demostracion'].includes(input.type)) metadata.parentTheorem = input.relatedId || 'teorema-pendiente';
  if (['ejemplo', 'ejercicio'].includes(input.type)) metadata.relatedTheorem = input.relatedId || undefined;
  if (input.type === 'modelo') metadata.satisfies = input.relatedId || 'sistema-pendiente';
  if (input.type === 'sistema-axiomatico') metadata.axiomas = [];
  if (input.type === 'matematico') {
    delete metadata.title;
    metadata.name = input.title;
  }
  return Object.fromEntries(Object.entries(metadata).filter(([, value]) => value !== undefined));
}

export function createPageSource(input: CreatePageInput): string {
  const metadata = JSON.stringify(metadataForNewPage(input), null, 2);
  const first = input.description.trim() || `Se introduce ${input.title} con precisión matemática.`;
  const initial = first.charAt(0).toUpperCase();
  const rest = first.slice(1);
  const body = input.type === 'demostracion'
    ? `<Capitular letra="${initial}" />${rest}\n\n<Separador />\n\n<ProofStep number={1} title="Hipótesis" target="step1">\nPor hipótesis, se fijan los objetos y relaciones declarados en el enunciado. La justificación pedagógica se completa antes de publicar.\n</ProofStep>`
    : `<Capitular letra="${initial}" />${rest}\n\n<Separador />\n\n### Desarrollo\n\nSe desarrolla el contenido mediante definiciones, enlaces semánticos y justificaciones explícitas.`;
  return `export const metadata = ${metadata};\n\n${body}\n`;
}
