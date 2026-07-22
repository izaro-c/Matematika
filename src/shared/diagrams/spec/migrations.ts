import { parseDiagramSpecV2 } from './schema';
import { parseDiagramSpecV3 } from './schemaV3';
import {
  DIAGRAM_RENDERER_V2_ID,
  DIAGRAM_SPEC_V2_VERSION,
  DIAGRAM_SPEC_VERSION,
  type DiagramSpecV2,
} from './types';
import type { DiagramSpec } from './v3';
import { attachDiagramSpecLegacyViews, migrateDiagramSpecV2ToV3 } from './v3Compatibility';

export type DiagramSpecMigrationCode =
  | 'invalid-root'
  | 'unsupported-version'
  | 'future-version'
  | 'invalid-v3'
  | 'invalid-v2'
  | 'invalid-legacy';

export class DiagramSpecMigrationError extends Error {
  readonly code: DiagramSpecMigrationCode;
  readonly details: string[];

  constructor(code: DiagramSpecMigrationCode, message: string, details: string[] = []) {
    super([message, ...details].join('\n'));
    this.name = 'DiagramSpecMigrationError';
    this.code = code;
    this.details = details;
  }
}

export interface DiagramSpecMigrationResult {
  spec: DiagramSpec;
  migratedFrom: number | null;
  warnings: string[];
}

const DEFAULT_LAYER_ID = 'geometry';

function recordOf(value: unknown): Record<string, unknown> | null {
  return value && typeof value === 'object' && !Array.isArray(value) ? value as Record<string, unknown> : null;
}

function legacyArray(record: Record<string, unknown>, key: string): Array<Record<string, unknown>> {
  return Array.isArray(record[key])
    ? (record[key] as unknown[]).map(recordOf).filter((item): item is Record<string, unknown> => Boolean(item))
    : [];
}

function legacySelection(value: unknown) {
  const selection = recordOf(value);
  return {
    selectable: selection?.selectable !== false,
    ...(typeof selection?.highlightable === 'boolean' ? { highlightable: selection.highlightable } : {}),
    ...(typeof selection?.dimOthersOnHighlight === 'boolean' ? { dimOthersOnHighlight: selection.dimOthersOnHighlight } : {}),
    ...(typeof selection?.ariaLabel === 'string' ? { ariaLabel: selection.ariaLabel } : {}),
    ...(selection?.role === 'primary' || selection?.role === 'secondary' || selection?.role === 'construction' || selection?.role === 'annotation'
      ? { role: selection.role }
      : {}),
  };
}

function legacySceneItem(item: Record<string, unknown>, order: number) {
  const target = item.target !== false;
  return {
    ...item,
    layerId: typeof item.layerId === 'string' ? item.layerId : DEFAULT_LAYER_ID,
    order: typeof item.order === 'number' && Number.isInteger(item.order) ? item.order : order,
    visible: item.visible !== false,
    locked: item.locked === true,
    groupIds: Array.isArray(item.groupIds) ? item.groupIds.filter((id): id is string => typeof id === 'string') : [],
    selection: legacySelection(item.selection),
    target,
  };
}

function migrateV1ToV2(record: Record<string, unknown>): DiagramSpecV2 {
  const rawBounds = Array.isArray(record.boundingBox) ? record.boundingBox : undefined;
  const bounds = rawBounds?.length === 4 ? rawBounds : [-5, 5, 5, -5];
  const points = legacyArray(record, 'points').map((item, index) => {
    let constraint = item.fixed === true ? 'fixed' : 'free';
    if (typeof item.constraint === 'string') constraint = item.constraint;
    return legacySceneItem({ ...item, fixed: item.fixed === true, constraint }, index * 10);
  });
  const elements = legacyArray(record, 'elements').map((item, index) => legacySceneItem(item, 1000 + index * 10));
  const sliders = legacyArray(record, 'sliders').map((item, index) => legacySceneItem(item, 2000 + index * 10));
  const candidate = {
    version: DIAGRAM_SPEC_V2_VERSION,
    renderer: DIAGRAM_RENDERER_V2_ID,
    title: record.title,
    componentId: record.componentId,
    category: record.category,
    mode: record.mode,
    axis: record.axis === true,
    grid: record.grid === true,
    viewport: { bounds, home: bounds, minZoom: 0.2, maxZoom: 12, padding: 0.16 },
    layers: [{ id: DEFAULT_LAYER_ID, label: 'Geometría', order: 0, visible: true, locked: false }],
    groups: [], points, elements, sliders, steps: legacyArray(record, 'steps'),
    note: typeof record.note === 'string' ? record.note : '', extensions: {},
  };
  const parsed = parseDiagramSpecV2(candidate);
  if (!parsed.success) throw new DiagramSpecMigrationError('invalid-legacy', 'DiagramSpec v1 no se puede migrar sin pérdida.', parsed.error.message.split('\n'));
  return parsed.data;
}

export function migrateDiagramSpec(value: unknown): DiagramSpecMigrationResult {
  const record = recordOf(value);
  if (!record) throw new DiagramSpecMigrationError('invalid-root', 'La especificación debe ser un objeto JSON.');
  const version = record.version ?? record.schemaVersion;
  if (version === DIAGRAM_SPEC_VERSION) {
    const parsed = parseDiagramSpecV3(record);
    if (!parsed.success) throw new DiagramSpecMigrationError('invalid-v3', 'DiagramSpec v3 no es válido.', parsed.error.message.split('\n'));
    return { spec: attachDiagramSpecLegacyViews(parsed.data), migratedFrom: null, warnings: [] };
  }
  if (version === DIAGRAM_SPEC_V2_VERSION) {
    const parsed = parseDiagramSpecV2(record);
    if (!parsed.success) throw new DiagramSpecMigrationError('invalid-v2', 'DiagramSpec v2 no es válido.', parsed.error.message.split('\n'));
    const spec = migrateDiagramSpecV2ToV3(parsed.data);
    const checked = parseDiagramSpecV3(spec);
    if (!checked.success) throw new DiagramSpecMigrationError('invalid-v3', 'La migración v2 → v3 produjo una especificación no válida.', checked.error.message.split('\n'));
    return { spec: attachDiagramSpecLegacyViews(checked.data), migratedFrom: 2, warnings: ['DiagramSpec v2 se migró de forma determinista a v3.'] };
  }
  if (version === undefined || version === 1) {
    const spec = migrateDiagramSpecV2ToV3(migrateV1ToV2(record));
    const checked = parseDiagramSpecV3(spec);
    if (!checked.success) throw new DiagramSpecMigrationError('invalid-v3', 'La migración v1 → v3 produjo una especificación no válida.', checked.error.message.split('\n'));
    return { spec: attachDiagramSpecLegacyViews(checked.data), migratedFrom: 1, warnings: ['DiagramSpec v1 se migró de forma determinista a v3.'] };
  }
  if (typeof version === 'number' && version > DIAGRAM_SPEC_VERSION) {
    throw new DiagramSpecMigrationError('future-version', `DiagramSpec v${version} es más reciente que la versión soportada (v${DIAGRAM_SPEC_VERSION}). Actualice Matematika antes de editarlo.`);
  }
  throw new DiagramSpecMigrationError('unsupported-version', `DiagramSpec v${String(version)} no tiene una ruta de migración registrada.`);
}

export function createDiagramSpec(value: unknown): DiagramSpec {
  return migrateDiagramSpec(value).spec;
}
