import { migrateDiagramSpec, projectDiagramSpecV3ToV2 } from '../../../../shared/diagrams/spec';
import type { VisualDiagramModel } from './types';
import { renameDiagramId } from './graphCommands';

export function renamePoint(model: VisualDiagramModel, oldId: string, newId: string): VisualDiagramModel {
  return renameDiagramId(model, oldId, newId);
}

export function renameElement(model: VisualDiagramModel, oldId: string, newId: string): VisualDiagramModel {
  return renameDiagramId(model, oldId, newId);
}

export function renameSlider(model: VisualDiagramModel, oldId: string, newId: string): VisualDiagramModel {
  return renameDiagramId(model, oldId, newId);
}

export function normalizeVisualModel(value: unknown, _metadataType: string): VisualDiagramModel | null {
  try { return projectDiagramSpecV3ToV2(migrateDiagramSpec(value).spec); }
  catch { return null; }
}
