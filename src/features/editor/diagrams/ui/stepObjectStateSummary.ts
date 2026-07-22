import type { DiagramStepObjectState } from '@/shared/diagrams/spec';

export function summarizeStepObjectState(state?: DiagramStepObjectState): string[] {
  if (!state) return [];
  const extras: string[] = [];
  if (state.label) extras.push('etiqueta');
  if (state.showLabel === false) extras.push('sin etiqueta');
  if (state.color) extras.push('color');
  if (state.dashed !== undefined) extras.push('trazo');
  if (state.style && Object.keys(state.style).length > 0) extras.push('estilo');
  if (state.overlay?.visible) extras.push('panel');
  if (state.interactive === false) extras.push('bloqueado');
  return extras;
}
