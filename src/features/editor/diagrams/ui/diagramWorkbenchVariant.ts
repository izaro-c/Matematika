/** True when URL query requests the legacy V1 diagram workbench. */
export function preferLegacyDiagramWorkbench(search: string): boolean {
  const q = search.startsWith('?') ? search.slice(1) : search;
  return new URLSearchParams(q).get('diagram') === 'v1';
}
