/** Joins the truthy class names of a primitive and its caller. */
export function cx(...names: Array<string | false | null | undefined>): string {
  return names.filter(Boolean).join(' ');
}
