import { toEditorModel } from '../scene/editorModel';
import type { VisualDiagramModel } from '../types';
import { renameDiagramId } from '../tools/graphCommands';

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
  return toEditorModel(value);
}
