import { loadDiagramSpec, type DiagramSpec } from '@/diagrams';
import type { VisualDiagramModel } from '../types';

/** Normaliza JSON/desconocido a modelo de editor (DiagramSpec v3 validado). */
export function toEditorModel(value: unknown): VisualDiagramModel | null {
  if (!value || typeof value !== 'object') return null;
  try {
    return loadDiagramSpec(value);
  } catch {
    return null;
  }
}

export type { DiagramSpec };
