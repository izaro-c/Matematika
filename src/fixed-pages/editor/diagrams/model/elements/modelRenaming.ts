import { toEditorModel } from '../scene/editorModel';
import type { VisualDiagramModel } from '../types';

export function normalizeVisualModel(value: unknown, _metadataType: string): VisualDiagramModel | null {
  return toEditorModel(value);
}
