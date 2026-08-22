import { parseInlineNodes, type InlineNode } from '@/fixed-pages/editor/session/parser';
import katex from 'katex';

const LATEX_CLASS = 'mdx-latex relative inline-flex items-center rounded bg-ocre/10 px-1 py-0.5 text-[0.95em] text-carbon transition-all group/latex';
const FORMULA_CLASS = 'mdx-formula my-3 block rounded-lg border border-ocre/30 bg-ocre/5 px-3 py-2';
const CHIP_BASE = 'mdx-chip relative cursor-pointer rounded px-1 font-bold border-b border-dashed';

export function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function renderKatex(code: string, displayMode: boolean): string {
  try {
    return katex.renderToString(code, { throwOnError: false, displayMode, trust: false });
  } catch {
    return escapeHtml(code);
  }
}

function stringifyAttrs(attrs: Record<string, unknown>): string {
  return Object.entries(attrs)
    .map(([key, val]) => {
      if (typeof val === 'boolean') return `${key}={${val}}`;
      if (typeof val === 'number') return `${key}={${val}}`;
      if (val !== null && typeof val === 'object') return `${key}={${JSON.stringify(val)}}`;
      const s = String(val ?? '');
      if (/^[A-Za-z0-9_.:-]+$/.test(s)) return `${key}=${s}`;
      return `${key}="${s.replace(/"/g, '&quot;')}"`;
    })
    .join(' ');
}

function chipClass(tag: string, attrs: Record<string, unknown>): string {
  if (tag === 'ConceptLink') return `${CHIP_BASE} mdx-chip--concept text-canela border-canela/30 bg-canela/5`;
  if (tag === 'RefLink') return `${CHIP_BASE} mdx-chip--ref text-pavo border-pavo/30 bg-pavo/5`;
  if (tag === 'ProofStepLink') return `${CHIP_BASE} mdx-chip--step text-pavo border-pavo/40 bg-pavo/10`;
  const color = String(attrs.color || 'canela');
  return `${CHIP_BASE} mdx-chip--interactive text-${color} border-${color}/30 bg-${color}/5`;
}

/** Editable inline LaTeX: renders KaTeX when not active/focused, reveals $code$ when editing caret is inside. */
export function latexSpanHtml(code: string): string {
  const cleanCode = code.trim();
  const rendered = renderKatex(cleanCode, false);
  return `<span data-mdx="latex" data-latex="${escapeHtml(cleanCode)}" class="${LATEX_CLASS}" title="Fórmula inline: $${escapeHtml(cleanCode)}$">`
    + `<span data-latex-preview="1" contenteditable="false" class="mdx-latex-preview pointer-events-none group-[.is-editing]/latex:hidden">${rendered}</span>`
    + `<span data-latex-source="1" class="mdx-latex-source hidden font-mono text-xs text-carbon outline-none focus:ring-1 focus:ring-canela rounded px-0.5 group-[.is-editing]/latex:inline-block">$${escapeHtml(cleanCode)}$</span>`
    + `</span>`;
}

/** Chip Badge para ProofStepLink cohesivo con la estética Arts & Crafts */
export function proofStepLinkHtml(step: number): string {
  return `<span data-mdx="ProofStepLink" data-step="${step}" contenteditable="false" class="proof-step-link-chip inline-flex items-center gap-1.5 align-middle mx-1 my-0.5 rounded border border-pavo/30 bg-pavo/10 px-2 py-0.5 font-mono text-xs font-bold text-pavo shadow-2xs cursor-pointer select-none hover:bg-pavo/20 hover:border-pavo/50 transition-all" title="Ir al paso ${step}">`
    + `<span class="flex h-4 w-4 items-center justify-center rounded bg-pavo text-[9px] font-bold text-lienzo">${step}</span>`
    + `<span>Paso ${step}</span>`
    + `</span>`;
}

/** Block formula card; body stays editable as plain TeX / $$. */
export function formulaBlockHtml(inner: string): string {
  const trimmed = inner.trim();
  const display = trimmed.replace(/^\$\$|\$\$$/g, '').trim();
  const preview = display ? renderKatex(display, true) : '';
  return `<div data-mdx="formula" class="${FORMULA_CLASS}" contenteditable="false">`
    + `<div class="mb-1 text-[9px] font-bold uppercase tracking-wider text-ocre/80">Fórmula</div>`
    + (preview ? `<div class="mb-2 overflow-x-auto text-center pointer-events-none" data-formula-preview="1">${preview}</div>` : '')
    + `<div data-formula-source="1" contenteditable="true" class="font-mono text-sm text-carbon outline-none focus:ring-1 focus:ring-canela rounded px-1">${escapeHtml(trimmed || '$$ x $$')}</div>`
    + `</div>`;
}

function chipHtml(tag: string, attrs: Record<string, unknown>, value: string, raw: string): string {
  const encoded = encodeURIComponent(JSON.stringify(attrs));
  const encodedRaw = encodeURIComponent(raw);
  return `<span role="button" tabindex="0" data-mdx="${tag}" data-attrs="${encoded}" data-raw="${encodedRaw}" contenteditable="false" class="${chipClass(tag, attrs)}">${mdxToEditableHtml(value)}</span>`;
}

function nodeToHtml(node: InlineNode): string {
  switch (node.type) {
    case 'text':
      return escapeHtml(node.value);
    case 'bold':
      return `<strong data-mdx="bold">${escapeHtml(node.value)}</strong>`;
    case 'italic':
      return `<em data-mdx="italic">${escapeHtml(node.value)}</em>`;
    case 'inlineLatex':
      return latexSpanHtml(node.value);
    case 'proofStepLink':
      return proofStepLinkHtml(node.step);
    case 'conceptLink':
      return chipHtml('ConceptLink', node.attrs, node.value, node.raw);
    case 'refLink':
      return chipHtml('RefLink', node.attrs, node.value, node.raw);
    case 'interactiveElement':
      return chipHtml('InteractiveElement', node.attrs, node.value, node.raw);
    default:
      return '';
  }
}

/** Split MDX into prose segments + Formula / $$ blocks for the visual surface. */
export function mdxToEditableHtml(mdx: string): string {
  const parts: string[] = [];
  const blockRe = /<Formula>([\s\S]*?)<\/Formula>|\$\$([\s\S]+?)\$\$/g;
  let cursor = 0;
  let match: RegExpExecArray | null;
  while ((match = blockRe.exec(mdx)) !== null) {
    if (match.index > cursor) {
      parts.push(parseInlineNodes(mdx.slice(cursor, match.index)).map(nodeToHtml).join(''));
    }
    if (match[1] !== undefined) {
      parts.push(formulaBlockHtml(match[1].trim()));
    } else {
      parts.push(formulaBlockHtml(`$$${match[2]}$$`));
    }
    cursor = match.index + match[0].length;
  }
  if (cursor < mdx.length) {
    parts.push(parseInlineNodes(mdx.slice(cursor)).map(nodeToHtml).join(''));
  }
  return parts.join('');
}

function childrenToMdx(el: HTMLElement): string {
  return Array.from(el.childNodes).map(nodeToMdx).join('');
}

function nodeToMdx(node: Node): string {
  if (node.nodeType === Node.TEXT_NODE) return node.textContent ?? '';
  if (node.nodeType !== Node.ELEMENT_NODE) return '';

  const el = node as HTMLElement;
  const tag = el.tagName.toLowerCase();
  const mdx = el.dataset.mdx;

  if (mdx === 'bold' || (tag === 'strong' && !mdx)) return `**${childrenToMdx(el)}**`;
  if (mdx === 'italic' || (tag === 'em' && !mdx)) return `*${childrenToMdx(el)}*`;
  if (mdx === 'latex') {
    const sourceEl = el.querySelector('[data-latex-source]');
    const raw = sourceEl ? sourceEl.textContent ?? '' : (el.textContent ?? '');
    const code = el.dataset.latex || raw.replace(/^\$/, '').replace(/\$$/, '');
    return `$${code.trim()}$`;
  }
  if (mdx === 'ProofStepLink') {
    const step = el.dataset.step || '1';
    return `<ProofStepLink step={${step}} />`;
  }
  if (mdx === 'formula') {
    const source = el.querySelector('[data-formula-source]') as HTMLElement | null;
    const body = (source?.textContent ?? el.dataset.formula ?? '$$ x $$').trim();
    if (body.startsWith('<Formula') || body.includes('</Formula>')) return body;
    if (body.startsWith('$$')) return `<Formula>\n  ${body}\n</Formula>`;
    return `<Formula>\n  $$${body}$$\n</Formula>`;
  }
  if (mdx === 'ConceptLink' || mdx === 'RefLink' || mdx === 'InteractiveElement') {
    if (el.dataset.raw) return decodeURIComponent(el.dataset.raw);
    const attrs = JSON.parse(decodeURIComponent(el.dataset.attrs || '{}')) as Record<string, unknown>;
    const inner = childrenToMdx(el);
    const attrsStr = stringifyAttrs(attrs);
    const spaceAttrs = attrsStr ? ` ${attrsStr}` : '';
    return `<${mdx}${spaceAttrs}>${inner}</${mdx}>`;
  }
  if (tag === 'ul') {
    const items = Array.from(el.children)
      .map(child => `- ${childrenToMdx(child as HTMLElement).trim()}`)
      .join('\n');
    return `\n${items}\n`;
  }
  if (tag === 'ol') {
    const items = Array.from(el.children)
      .map((child, i) => `${i + 1}. ${childrenToMdx(child as HTMLElement).trim()}`)
      .join('\n');
    return `\n${items}\n`;
  }
  if (tag === 'li') return childrenToMdx(el);
  if (tag === 'table') {
    const rows = Array.from(el.querySelectorAll('tr'));
    if (rows.length === 0) return '';
    const tableMd = rows.map((tr, rIdx) => {
      const cells = Array.from(tr.children).map(td => childrenToMdx(td as HTMLElement).trim());
      const line = `| ${cells.join(' | ')} |`;
      if (rIdx === 0) {
        const sep = `| ${cells.map(() => '---').join(' | ')} |`;
        return `${line}\n${sep}`;
      }
      return line;
    }).join('\n');
    return `\n${tableMd}\n`;
  }
  if (tag === 'br') return '\n';
  if (tag === 'div' || tag === 'p') {
    const inner = childrenToMdx(el);
    return inner.endsWith('\n') ? inner : `${inner}\n`;
  }
  return childrenToMdx(el);
}

export function editableHtmlToMdx(root: HTMLElement): string {
  if (root.dataset.mdx) return nodeToMdx(root);
  return Array.from(root.childNodes).map(nodeToMdx).join('').replace(/\n$/, '');
}

/** Toggles bold or italic wrapping on the active text selection natively. */
export function wrapSelectionWithTag(tag: 'strong' | 'em'): boolean {
  const command = tag === 'strong' ? 'bold' : 'italic';
  return document.execCommand(command, false);
}

export function insertHtmlAtSelection(html: string): boolean {
  const sel = window.getSelection();
  if (!sel || sel.rangeCount === 0) return false;
  const anchor = sel.anchorNode;
  const editable = (anchor instanceof Element ? anchor : anchor?.parentElement)?.closest('[contenteditable="true"]');
  if (!editable) return false;

  const range = sel.getRangeAt(0);
  range.deleteContents();
  const fragment = range.createContextualFragment(html);
  const last = fragment.lastChild;
  range.insertNode(fragment);
  if (last) {
    const next = document.createRange();
    next.setStartAfter(last);
    next.collapse(true);
    sel.removeAllRanges();
    sel.addRange(next);
  }
  return true;
}

export function getSelectedPlainText(): string {
  return window.getSelection()?.toString() ?? '';
}

export function selectionIsInProseSurface(): boolean {
  const sel = window.getSelection();
  if (!sel || sel.rangeCount === 0) return false;
  const node = sel.anchorNode;
  const el = node instanceof Element ? node : node?.parentElement;
  return Boolean(el?.closest('[data-prose-surface="true"]'));
}
