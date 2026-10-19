/** Clases del contenedor de `UiLanguageSwitch` y `DocumentVersions`; cada chip es un `Chip`. Piel en `editor-primitives.css`. */

export type LanguageChipSize = 'default' | 'compact';

export function languageChipStyles(size: LanguageChipSize) {
  return {
    container: size === 'compact' ? 'ed-chips ed-chips--compact' : 'ed-chips',
    outdatedMark: 'ed-chip__mark',
  };
}
