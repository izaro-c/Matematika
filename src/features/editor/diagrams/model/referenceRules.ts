import { legacyElementCapabilities, referenceSlotsForLegacyKind } from '../../../../shared/diagrams/spec';
import type { CanvasTool, ElementKind } from './types';

export function isGliderSupportKind(kind: ElementKind): boolean {
  return legacyElementCapabilities(kind).has('support');
}

export function gliderSupportElements<T extends { kind: ElementKind }>(elements: readonly T[]): T[] {
  return elements.filter(item => isGliderSupportKind(item.kind));
}

export function minimumRefsForKind(kind: ElementKind): number {
  const slots = referenceSlotsForLegacyKind(kind) ?? [];
  if (slots.length === 0) return 0;
  if (slots.every(slot => slot.optional)) return 0;
  if (slots.some(slot => slot.repeatable)) {
    const fixedCount = slots.filter(slot => !slot.repeatable && !slot.optional).length;
    const repeatableSlot = slots.find(slot => slot.repeatable);
    const minRepeatable = repeatableSlot?.minimumRepeatable ?? 2;
    return fixedCount + minRepeatable;
  }
  return slots.filter(slot => !slot.optional).length;
}

export function refsForKind(kind: ElementKind, refs: string[]): string[] {
  const slots = referenceSlotsForLegacyKind(kind) ?? [];
  if (slots.length === 0) return [];
  if (slots.some(slot => slot.repeatable)) return refs;
  const requiredCount = slots.filter(slot => !slot.optional).length;
  if (requiredCount === 0) return refs.filter(Boolean).slice(0, slots.length);
  return refs.slice(0, requiredCount);
}

export function refsNeededForTool(tool: CanvasTool): number {
  if (tool === 'select' || tool === 'point') return 0;
  return minimumRefsForKind(tool);
}
