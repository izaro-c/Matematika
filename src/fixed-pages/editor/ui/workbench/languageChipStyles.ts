/** Clases comunes de `UiLanguageSwitch` y `DocumentVersions` (mismo aspecto, distinto significado). */

export type LanguageChipSize = 'default' | 'compact';

export function languageChipStyles(size: LanguageChipSize) {
  const isCompact = size === 'compact';
  return {
    container: isCompact
      ? 'inline-flex h-6 items-center gap-0.5 rounded-md border border-carbon/15 bg-carbon/5 p-0.5'
      : 'inline-flex h-8 items-center gap-1 rounded-lg border border-carbon/15 bg-carbon/5 p-1 max-w-[260px] overflow-x-auto',
    active: isCompact
      ? 'inline-flex h-5 items-center justify-center gap-0.5 rounded px-1.5 text-[8px] font-bold bg-canela text-lienzo uppercase tracking-wider shrink-0 select-none shadow-2xs'
      : 'inline-flex h-6 items-center justify-center gap-1 rounded-md bg-canela px-2 text-[10px] font-bold text-lienzo uppercase tracking-wider shrink-0 select-none shadow-2xs',
    option: isCompact
      ? 'inline-flex h-5 items-center justify-center gap-0.5 rounded px-1.5 text-[8px] font-bold uppercase tracking-wider text-carbon/70 hover:bg-canela/15 hover:text-canela transition-colors cursor-pointer shrink-0 select-none'
      : 'inline-flex h-6 items-center justify-center gap-1 rounded-md px-2 text-[10px] font-bold uppercase tracking-wider text-carbon/65 hover:bg-canela/15 hover:text-canela transition-colors cursor-pointer shrink-0 select-none',
    missing: isCompact
      ? 'inline-flex h-5 items-center justify-center rounded border border-dashed border-carbon/25 px-1 text-[8px] font-mono text-carbon/40 hover:border-canela hover:bg-canela/10 hover:text-canela cursor-pointer shrink-0 select-none transition-colors'
      : 'inline-flex h-6 items-center justify-center rounded-md border border-dashed border-carbon/30 px-1.5 text-[10px] font-mono font-medium text-carbon/50 hover:border-canela hover:bg-canela/10 hover:text-canela cursor-pointer shrink-0 select-none transition-colors',
    outdatedMark: isCompact
      ? 'inline-block h-1 w-1 rounded-full bg-ocre'
      : 'inline-block h-1.5 w-1.5 rounded-full bg-ocre',
  };
}
