import { DIAGRAM_RENDERER_ID, DIAGRAM_SPEC_VERSION, type DiagramSpecV2 } from './types';
import { parseDiagramSpecV2 } from './schema';

export type DiagramSpecMigrationCode =
  | 'invalid-root'
  | 'unsupported-version'
  | 'future-version'
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
  spec: DiagramSpecV2;
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

function migrateV1(record: Record<string, unknown>): DiagramSpecV2 {
  const rawBounds = Array.isArray(record.boundingBox) ? record.boundingBox : undefined;
  const bounds = rawBounds?.length === 4 ? rawBounds : [-5, 5, 5, -5];
  const points = legacyArray(record, 'points').map((item, index) => legacySceneItem({
    ...item,
    fixed: item.fixed === true,
    constraint: typeof item.constraint === 'string' ? item.constraint : item.fixed === true ? 'fixed' : 'free',
  }, index * 10));
  const elements = legacyArray(record, 'elements').map((item, index) => legacySceneItem(item, 1000 + index * 10));
  const sliders = legacyArray(record, 'sliders').map((item, index) => legacySceneItem(item, 2000 + index * 10));

  const candidate = {
    version: DIAGRAM_SPEC_VERSION,
    renderer: DIAGRAM_RENDERER_ID,
    title: record.title,
    componentId: record.componentId,
    category: record.category,
    mode: record.mode,
    axis: record.axis === true,
    grid: record.grid === true,
    viewport: {
      bounds,
      home: bounds,
      minZoom: 0.2,
      maxZoom: 12,
      padding: 0.16,
    },
    layers: [{ id: DEFAULT_LAYER_ID, label: 'Geometría', order: 0, visible: true, locked: false }],
    groups: [],
    points,
    elements,
    sliders,
    steps: legacyArray(record, 'steps'),
    note: typeof record.note === 'string' ? record.note : '',
    extensions: {},
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
    const parsed = parseDiagramSpecV2(record);
    if (!parsed.success) throw new DiagramSpecMigrationError('invalid-v2', 'DiagramSpec v2 no es válido.', parsed.error.message.split('\n'));
    return { spec: parsed.data, migratedFrom: null, warnings: [] };
  }

  if (version === undefined || version === 1) {
    return {
      spec: migrateV1(record),
      migratedFrom: 1,
      warnings: ['DiagramSpec v1 se migró en memoria a v2. La fuente original no se reescribe hasta que se elija explícitamente la autoridad visual.'],
    };
  }

  if (typeof version === 'number' && version > DIAGRAM_SPEC_VERSION) {
    throw new DiagramSpecMigrationError('future-version', `DiagramSpec v${version} es más reciente que la versión soportada (v${DIAGRAM_SPEC_VERSION}). Actualice Matematika antes de editarlo.`);
  }
  throw new DiagramSpecMigrationError('unsupported-version', `DiagramSpec v${String(version)} no tiene una ruta de migración registrada.`);
}
