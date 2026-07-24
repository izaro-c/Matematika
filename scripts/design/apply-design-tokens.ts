#!/usr/bin/env tsx
/**
 * Codemod: sustituye patrones tipográficos e interactivos hardcodeados
 * por clases del design system Arts & Crafts.
 */
import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

function walk(dir: string, acc: string[] = []): string[] {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      if (entry !== 'node_modules') walk(full, acc);
    } else if (/\.(tsx|ts|css)$/.test(entry) && !full.endsWith('uiClasses.ts')) {
      acc.push(full);
    }
  }
  return acc;
}

const REPLACEMENTS: [string, string][] = [
  // Viewport
  ['min-h-screen', 'min-h-viewport'],

  // Editor labels — más específicos primero
  ['text-[10px] font-bold uppercase tracking-widest text-carbon/35', 'ac-label ac-label--sm ac-label--muted'],
  ['text-[10px] font-bold uppercase tracking-widest text-carbon/45', 'ac-label ac-label--sm ac-label--soft'],
  ['text-[10px] font-bold uppercase tracking-widest text-carbon/50', 'ac-label ac-label--sm'],
  ['text-[10px] font-bold uppercase tracking-widest text-carbon/55', 'ac-label ac-label--sm ac-label--strong'],
  ['text-[10px] font-bold uppercase tracking-widest text-carbon/60', 'ac-label ac-label--sm ac-label--emphasis'],
  ['text-[10px] font-bold uppercase tracking-wider text-carbon/45', 'ac-label ac-label--sm ac-label--soft'],
  ['text-[10px] font-bold uppercase tracking-wider text-carbon/50', 'ac-label ac-label--sm'],
  ['text-[10px] font-bold uppercase tracking-wider text-carbon/55', 'ac-label ac-label--sm ac-label--strong'],
  ['text-[9px] font-bold uppercase tracking-widest text-carbon/45', 'ac-label ac-label--xs ac-label--soft'],
  ['text-[9px] font-bold uppercase tracking-wider text-carbon/45', 'ac-label ac-label--xs ac-label--soft'],
  ['text-[9px] font-bold uppercase tracking-wider text-carbon/55', 'ac-label ac-label--xs ac-label--strong'],
  ['text-[9px] font-bold uppercase tracking-widest text-carbon/50', 'ac-label ac-label--xs'],
  ['text-[8px] font-bold uppercase tracking-wider text-carbon/50', 'ac-label ac-label--2xs'],
  ['text-[8px] font-bold uppercase tracking-widest text-carbon/35', 'ac-label ac-label--2xs ac-label--muted'],
  ['text-[8px] font-bold text-carbon/40 uppercase tracking-widest', 'ac-label ac-label--2xs ac-label--faint'],
  ['text-[8px] font-bold text-carbon/40 uppercase tracking-wider', 'ac-label ac-label--2xs ac-label--faint'],
  ['text-[9px] font-bold text-carbon/40 uppercase tracking-widest', 'ac-label ac-label--xs ac-label--faint'],

  // Accent labels
  ['text-[10px] font-bold uppercase tracking-widest text-salvia', 'ac-label ac-label--sm ac-label--salvia'],
  ['text-[10px] font-bold uppercase tracking-widest text-pavo', 'ac-label ac-label--sm ac-label--pavo'],
  ['text-[10px] font-bold uppercase tracking-widest text-ocre', 'ac-label ac-label--sm ac-label--ocre'],
  ['text-[10px] font-bold uppercase tracking-widest text-pizarra', 'ac-label ac-label--sm ac-label--pizarra'],
  ['text-[10px] font-bold uppercase tracking-wider text-pavo', 'ac-label ac-label--sm ac-label--pavo'],
  ['text-[10px] font-bold uppercase tracking-wider text-ocre', 'ac-label ac-label--sm ac-label--ocre'],
  ['text-[9px] font-bold uppercase tracking-wider text-pavo', 'ac-label ac-label--xs ac-label--pavo'],
  ['text-[9px] font-bold uppercase tracking-widest text-salvia/80', 'ac-label ac-label--xs ac-label--salvia-soft'],
  ['text-xs font-bold uppercase tracking-widest text-carbon/55', 'ac-label ac-label--md ac-label--strong'],
  ['text-xs font-bold uppercase tracking-widest text-carbon/60', 'ac-label ac-label--md ac-label--emphasis'],

  // Fieldset legends
  ['px-1 text-[10px] font-bold uppercase tracking-wider text-carbon/45', 'ac-fieldset-legend'],
  ['px-1 text-[10px] font-bold uppercase tracking-wider text-ocre', 'ac-fieldset-legend ac-label--ocre'],
  ['px-1 text-[10px] font-bold uppercase tracking-wider text-pavo', 'ac-fieldset-legend ac-label--pavo'],

  // Public eyebrows
  ['text-xs font-sans tracking-widest uppercase', 'ac-eyebrow'],
  ['text-[10px] font-sans uppercase tracking-widest', 'ac-eyebrow ac-eyebrow--sm'],
  ['text-[10px] font-sans uppercase tracking-[0.2em]', 'ac-eyebrow ac-eyebrow--sm'],
  ['text-xs font-sans uppercase tracking-[0.3em]', 'ac-eyebrow ac-eyebrow--accent'],
  ['text-[9px] font-sans uppercase tracking-widest', 'ac-eyebrow ac-eyebrow--xs'],
  ['text-sm font-sans font-bold uppercase tracking-widest', 'ac-eyebrow ac-eyebrow--md'],
  ['text-sm font-bold font-sans uppercase tracking-widest', 'ac-eyebrow'],

  // Branch / section headings
  ['text-sm font-sans font-bold uppercase tracking-widest text-carbon/50', 'ac-eyebrow ac-eyebrow--muted'],

  // Hardcoded rgba shadows in editor tables
  ['shadow-[2px_0_0_0_rgba(0,0,0,0.04)]', 'ac-sticky-shadow-end'],

  // Error boundary buttons
  ['px-4 py-2 bg-carbon text-white text-sm tracking-widest uppercase hover:bg-carbon/80 transition-colors', 'ac-btn ac-btn-primary ac-interactive px-4 py-2 text-sm'],
  ['px-4 py-2 border border-carbon/30 text-carbon text-sm tracking-widest uppercase hover:bg-carbon/5 transition-colors', 'ac-btn ac-btn-ghost ac-interactive px-4 py-2 text-sm'],

  // Common back links
  ['inline-flex items-center gap-2 text-xs font-sans tracking-widest uppercase text-carbon/40 hover:text-carbon transition-colors', 'ac-link-back ac-interactive'],

  // Initial badge in diagram steps
  ['rounded bg-terracota/15 px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-wider text-terracota', 'ac-editor-badge ac-editor-badge--terracota'],

  // Layer badge
  ['rounded bg-carbon/10 px-1.5 py-0.5 font-mono text-[8px] font-bold uppercase tracking-wider text-carbon/45', 'ac-editor-badge ac-editor-badge--layer'],

  // Inline code in NotFoundState pattern (if any remain)
  ['bg-carbon/5 px-2 py-0.5 rounded font-mono', 'ac-code-inline'],

  // Round 2 — restantes
  ['text-[10px] uppercase tracking-widest font-bold text-salvia select-none', 'ac-label ac-label--sm ac-label--salvia select-none'],
  ['text-[9px] uppercase tracking-widest font-bold text-ocre/70', 'ac-label ac-label--xs ac-label--ocre-soft'],
  ['text-[9px] font-bold uppercase tracking-wide text-carbon/50', 'ac-label ac-label--xs'],
  ['text-xs font-sans font-bold uppercase tracking-widest text-carbon/40', 'ac-label ac-label--md ac-label--faint'],
  ['text-xs font-sans font-bold uppercase tracking-widest text-carbon/40 mb-6', 'ac-label ac-label--md ac-label--faint mb-6'],
  ['text-xs font-sans font-bold uppercase tracking-widest text-carbon/40 mb-4', 'ac-label ac-label--md ac-label--faint mb-4'],
  ['text-[10px] font-bold uppercase tracking-[0.18em] text-carbon/50', 'ac-label ac-label--sm'],
  ['text-[10px] font-bold uppercase tracking-[0.16em] text-carbon/40', 'ac-label ac-label--sm ac-label--faint'],
  ['text-[10px] font-bold uppercase tracking-[0.2em] text-terracota/80', 'ac-label ac-label--sm ac-label--terracota-soft'],
  ['text-[10px] uppercase tracking-widest text-carbon/30 font-sans', 'ac-eyebrow ac-eyebrow--sm ac-eyebrow--faint'],
  ['text-sm text-carbon/50 mb-10 font-sans tracking-widest uppercase', 'ac-eyebrow text-sm text-carbon/50 mb-10'],
  ['text-xs italic text-carbon/50 mt-6 font-sans tracking-widest uppercase', 'ac-eyebrow text-xs italic text-carbon/50 mt-6'],
  ['inline-block mt-4 text-xs font-sans uppercase tracking-widest text-carbon/50', 'ac-link-back ac-interactive mt-4 text-xs'],
  ['page-accent-text font-sans font-bold text-[10px] uppercase tracking-widest', 'page-accent-text ac-label ac-label--sm'],
  ['page-accent-text font-bold tracking-widest uppercase text-sm', 'page-accent-text ac-eyebrow text-sm'],
  ['text-sm font-bold mt-4 not-italic font-sans text-carbon/60 uppercase tracking-widest', 'ac-eyebrow text-sm text-carbon/60 mt-4 not-italic'],
  ['page-accent-text cursor-pointer select-none font-sans text-xs uppercase tracking-widest', 'page-accent-text ac-eyebrow ac-eyebrow--sm cursor-pointer select-none'],
  ['font-bold text-[10px] uppercase tracking-widest mb-4 text-carbon/50', 'ac-label ac-label--sm ac-label--soft mb-4'],
  ['font-sans text-[9px] uppercase tracking-widest text-carbon/50 mb-1', 'ac-label ac-label--xs ac-label--soft mb-1'],
  ['text-[9px] uppercase tracking-widest px-2.5 py-0.5 rounded-sm border font-sans font-bold', 'ac-editor-badge px-2.5 py-0.5 rounded-sm border'],
  ['text-carbon/45 text-[10px] tracking-widest uppercase', 'ac-eyebrow ac-eyebrow--sm text-carbon/45'],
  ['text-carbon/50 text-[10px] tracking-widest uppercase', 'ac-eyebrow ac-eyebrow--sm text-carbon/50'],
  ['text-[10px] font-sans font-bold uppercase tracking-widest text-terracota/70', 'ac-label ac-label--sm ac-label--terracota-soft'],
  ['font-sans font-bold text-[10px] uppercase tracking-widest text-salvia/80', 'ac-label ac-label--sm ac-label--salvia-soft'],
  ['text-xs font-bold font-sans uppercase tracking-widest text-salvia', 'ac-label ac-label--md ac-label--salvia'],
  ['page-accent-button px-6 py-3 text-xs font-sans uppercase tracking-widest', 'ac-btn ac-interactive page-accent-button px-6 py-3 text-xs'],
  ['page-accent-button px-6 py-2 text-xs font-sans uppercase tracking-widest', 'ac-btn ac-interactive page-accent-button px-6 py-2 text-xs'],
  ['page-accent-text text-[10px] opacity-0 group-hover:opacity-100 transition-opacity uppercase tracking-widest font-sans', 'page-accent-text ac-eyebrow ac-eyebrow--sm opacity-0 group-hover:opacity-100 transition-opacity'],
  ['flex items-center gap-2 text-carbon/50 hover:text-carbon/80 transition-colors cursor-pointer select-none font-sans uppercase tracking-widest text-[9px] font-bold', 'ac-eyebrow ac-eyebrow--xs text-carbon/50 hover:text-carbon/80 cursor-pointer select-none flex items-center gap-2'],
  ['w-full flex items-center justify-center gap-3 py-4 elegant-panel text-carbon/60 hover:text-carbon text-[11px] font-sans uppercase tracking-widest', 'w-full flex items-center justify-center gap-3 py-4 elegant-panel ac-eyebrow text-carbon/60 hover:text-carbon'],
  ['inline-block px-12 py-4 border-2 border-carbon text-carbon font-bold tracking-widest uppercase hover:bg-carbon hover:text-lienzo transition-all duration-300', 'ac-btn ac-interactive px-12 py-4 border-2 border-carbon text-carbon font-semibold hover:bg-carbon hover:text-lienzo'],
  ['mt-6 text-sm font-sans tracking-widest uppercase text-terracota hover:text-carbon transition-colors', 'ac-link ac-interactive mt-6 text-sm'],
  ['text-[8px] font-bold uppercase tracking-wider text-pavo/80', 'ac-label ac-label--2xs ac-label--pavo-soft'],
  ['shrink-0 rounded bg-pavo/15 px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-wide text-pavo', 'ac-editor-badge ac-editor-badge--pavo'],
  ['font-sans text-[9px] font-bold uppercase tracking-[0.18em] text-terracota', 'ac-label ac-label--xs ac-label--terracota'],
  ['font-sans text-[8px] font-bold uppercase tracking-[0.15em] text-carbon/50', 'ac-label ac-label--2xs'],
  ['mb-1.5 block font-sans text-[9px] font-bold uppercase tracking-[0.14em] text-carbon/55', 'ac-label ac-label--xs ac-label--strong mb-1.5 block'],
  ['px-2 pb-1 pt-2 font-sans text-[8px] font-bold uppercase tracking-[0.12em] text-carbon/45', 'ac-label ac-label--2xs ac-label--soft px-2 pb-1 pt-2 block'],

  // Theme token fixes (no raw white/zinc)
  ['bg-white/50', 'bg-lienzo/50'],
  ['text-white', 'text-lienzo'],
  ['bg-zinc-900', 'bg-carbon'],
  ['bg-white/5', 'bg-lienzo/5'],
  ['bg-white/10', 'bg-lienzo/10'],
  ['border-white/10', 'border-lienzo/10'],
  ['hover:bg-white/10', 'hover:bg-lienzo/10'],

  // Page shells
  ['min-h-viewport bg-lienzo text-carbon font-serif', 'ac-page'],
  ['min-h-viewport bg-lienzo font-serif text-carbon', 'ac-page'],
  ['min-h-viewport bg-lienzo flex items-center justify-center font-serif text-carbon', 'ac-page flex items-center justify-center'],
  ['min-h-viewport bg-lienzo flex flex-col items-center justify-center font-serif text-carbon', 'ac-page flex flex-col items-center justify-center'],
  ['min-h-viewport bg-lienzo flex flex-col items-center justify-center font-serif text-carbon px-6', 'ac-page flex flex-col items-center justify-center px-6'],
  ['min-h-viewport bg-arts-and-crafts text-carbon font-serif overflow-y-auto', 'ac-page bg-arts-and-crafts overflow-y-auto'],
  ['min-h-viewport bg-lienzo bg-arts-and-crafts text-carbon font-serif', 'ac-page bg-arts-and-crafts'],
  ['min-h-viewport bg-lienzo bg-arts-and-crafts flex flex-col items-center', 'ac-page bg-arts-and-crafts flex flex-col items-center'],

  // Round 3 — patrones residuales
  ['text-[10px] uppercase tracking-[0.2em] font-sans font-bold mb-1', 'ac-label ac-label--sm mb-1'],
  ['text-[10px] font-sans font-bold uppercase tracking-wider px-2 py-0.5 rounded border', 'ac-label ac-label--sm px-2 py-0.5 rounded border'],
  ['text-[9px] uppercase tracking-wider font-sans px-1.5 py-0.5 rounded', 'ac-label ac-label--xs px-1.5 py-0.5 rounded'],
  ['page-accent-text text-[10px] uppercase tracking-[0.3em] font-sans mb-3 font-bold', 'page-accent-text ac-eyebrow ac-eyebrow--sm ac-eyebrow--accent mb-3'],
  ['page-accent-text text-xs tracking-[0.3em] uppercase font-sans mb-4 font-bold', 'page-accent-text ac-eyebrow ac-eyebrow--accent mb-4'],
  ['page-accent-text font-bold uppercase tracking-wider mr-2 text-xs', 'page-accent-text ac-label ac-label--md mr-2'],
  ['inline-block text-[9px] font-sans tracking-[0.2em] uppercase text-carbon/40', 'ac-link-back ac-interactive text-[9px] text-carbon/40 mb-8 inline-block'],
  ['mb-4 font-sans text-xs font-semibold uppercase tracking-[0.18em] text-granada', 'ac-eyebrow ac-eyebrow--granada mb-4'],
  ['font-sans text-xs font-semibold uppercase tracking-[0.18em] text-carbon/55', 'ac-eyebrow text-carbon/55'],
  ['mt-8 inline-flex items-center gap-2 self-start font-sans text-xs font-semibold uppercase tracking-[0.14em] text-granada', 'ac-eyebrow ac-eyebrow--granada mt-8 inline-flex items-center gap-2 self-start'],
  ['text-[9px] font-sans uppercase tracking-[0.25em] font-bold text-carbon/40', 'ac-label ac-label--xs ac-label--faint'],
  ['text-[9px] font-sans uppercase tracking-[0.2em] text-salvia/80 font-bold mb-2', 'ac-label ac-label--xs ac-label--salvia-soft mb-2'],
  ['text-[9px] font-sans uppercase tracking-[0.2em] text-carbon/50 mb-1 font-bold', 'ac-label ac-label--xs ac-label--soft mb-1'],
  ['text-[9px] font-sans uppercase tracking-[0.2em] text-carbon/40 mb-1 font-bold', 'ac-label ac-label--xs ac-label--faint mb-1'],
  ['page-accent-text mt-4 text-[10px] uppercase font-sans tracking-widest underline', 'page-accent-text ac-eyebrow ac-eyebrow--sm mt-4 underline'],
  ['text-[10px] font-serif font-bold text-carbon/60 uppercase tracking-wider', 'ac-label ac-label--sm text-carbon/60 font-serif'],
  ['block text-[9px] uppercase font-bold text-carbon/50 font-sans', 'block ac-label ac-label--xs'],
  ['text-[10px] uppercase font-bold text-salvia tracking-widest mb-1 select-none', 'ac-label ac-label--sm ac-label--salvia mb-1 select-none'],
  ['text-xs font-bold text-lienzo/40 uppercase tracking-wider group-hover:text-lienzo transition-colors', 'ac-label ac-label--md text-lienzo/40 group-hover:text-lienzo transition-colors'],
  ['page-accent-button self-start mt-2 px-4 py-2 text-[10px] font-sans font-bold uppercase tracking-wider text-carbon/60 border border-carbon/20 hover:bg-carbon/5 transition-all cursor-pointer flex items-center gap-2', 'ac-btn ac-btn-ghost ac-interactive self-start mt-2 px-4 py-2 text-[10px] text-carbon/60 flex items-center gap-2'],
  ['page-accent-group-hover text-sm font-bold text-carbon font-sans uppercase tracking-wider transition-colors flex items-center gap-2', 'page-accent-group-hover text-sm font-semibold text-carbon font-sans transition-colors flex items-center gap-2'],
  ['text-[7px] text-granada font-bold uppercase animate-pulse', 'ac-label ac-label--2xs ac-label--granada animate-pulse'],
  ['text-[8px] font-sans text-carbon/40 uppercase mr-1', 'ac-label ac-label--2xs ac-label--faint mr-1'],
];

const files = walk(join(process.cwd(), 'src'));

let totalChanges = 0;

for (const file of files) {
  const original = readFileSync(file, 'utf8');
  let content = original;

  for (const [from, to] of REPLACEMENTS) {
    if (content.includes(from)) {
      content = content.split(from).join(to);
    }
  }

  if (content !== original) {
    writeFileSync(file, content);
    totalChanges += 1;
    console.log(`updated: ${relative(process.cwd(), file)}`);
  }
}

console.log(`\nDone. ${totalChanges} files updated.`);
