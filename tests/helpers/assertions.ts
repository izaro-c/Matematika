import { expect } from 'vitest';
import { diagramElementKinds } from '@/diagrams/model/schema/schema';
import { ELEMENT_INSPECTOR_CAPABILITIES } from '@/fixed-pages/editor/diagrams/model/elements/elementInspectorCapabilities';

export function expectDiagramKindsAlignedWithInspector() {
  const inspectorKinds = new Set(Object.keys(ELEMENT_INSPECTOR_CAPABILITIES));
  for (const kind of diagramElementKinds) {
    expect(inspectorKinds.has(kind), `kind ${kind} sin capacidades de inspector`).toBe(true);
  }
  expect(diagramElementKinds.length).toBeGreaterThanOrEqual(30);
}
