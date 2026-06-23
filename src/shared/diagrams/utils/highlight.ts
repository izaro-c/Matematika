export function isHighlightById(highlight: unknown, id: string): boolean {
  return Array.isArray(highlight) ? (highlight as string[]).includes(id) : highlight === id;
}
