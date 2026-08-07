/** Helpers for DemonstrationSection diagram= / diagrams= attribute strings. */

export interface DemoDiagramSlot {
  key: string;
  component: string;
}

/** Parse `diagram={<Foo />}` or `diagrams={{ "a": Foo, "b": <Bar /> }}` from attributesStr. */
export function parseDemoDiagramSlots(attributesStr: string | undefined): DemoDiagramSlot[] {
  if (!attributesStr?.trim()) return [];

  const diagramsMatch = attributesStr.match(/diagrams=\{\{([\s\S]*?)\}\}/);
  if (diagramsMatch) {
    const slots: DemoDiagramSlot[] = [];
    const entryRe = /["']?([\w-]+)["']?\s*:\s*(?:<(\w+)\s*\/>|(\w+))/g;
    let m: RegExpExecArray | null;
    while ((m = entryRe.exec(diagramsMatch[1])) !== null) {
      slots.push({ key: m[1], component: m[2] || m[3] });
    }
    return slots;
  }

  const single = attributesStr.match(/diagram=\{\s*<(\w+)\s*\/>\s*\}/)
    || attributesStr.match(/diagram=\{\s*(\w+)\s*\}/);
  if (single) return [{ key: 'default', component: single[1] }];
  return [];
}

export function serializeDemoDiagramSlots(slots: DemoDiagramSlot[]): string {
  if (slots.length === 0) return '';
  if (slots.length === 1 && slots[0].key === 'default') {
    return `diagram={<${slots[0].component} />}`;
  }
  const body = slots.map(s => `"${s.key}": <${s.component} />`).join(', ');
  return `diagrams={{ ${body} }}`;
}

/** Replace diagram/diagrams attrs in attributesStr; preserves other attrs. */
export function withDemoDiagramSlots(attributesStr: string | undefined, slots: DemoDiagramSlot[]): string {
  const cleaned = (attributesStr || '')
    .replace(/\s*diagrams=\{\{[\s\S]*?\}\}/g, '')
    .replace(/\s*diagram=\{\s*<\w+\s*\/>\s*\}/g, '')
    .replace(/\s*diagram=\{\s*\w+\s*\}/g, '')
    .trim();
  const serialized = serializeDemoDiagramSlots(slots);
  return [serialized, cleaned].filter(Boolean).join(' ');
}

export function bodyHasLogicalJustification(body: string): boolean {
  if (/<(?:ConceptLink|RefLink)\b/i.test(body)) return true;
  return /\b(?:por (?:hipótesis|axioma|teorema|definición|el paso|regla (?:de )?lógica|construcción)|hipótesis)\b/i.test(body);
}

export function extractJustificationIdsFromBody(body: string): string[] {
  const ids: string[] = [];
  const re = /<(?:ConceptLink|RefLink)\b([^>]*)>/gi;
  let m: RegExpExecArray | null;
  while ((m = re.exec(body)) !== null) {
    const idMatch = m[1].match(/targetId=\{?\s*(?:["']([^"']+)["']|\[([^\]]+)\])/);
    if (idMatch?.[1]) ids.push(idMatch[1]);
    else if (idMatch?.[2]) {
      for (const part of idMatch[2].match(/["']([^"']+)["']/g) ?? []) {
        ids.push(part.replace(/['"]/g, ''));
      }
    }
  }
  return [...new Set(ids)];
}
