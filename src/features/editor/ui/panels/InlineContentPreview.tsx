import React from 'react';
import { KatexText } from '@/shared/ui/KatexText';
import { parseInlineNodes } from '../../core/parser';
import { InteractivePreviewToken } from './InteractivePreviewToken';

import type { EditLinkHandler } from './previewTypes';
export type { EditLinkHandler };

export function insertSymbol(textareaId: string, symbol: string) {
  const textarea = document.getElementById(textareaId) as HTMLTextAreaElement | null;
  if (!textarea) return;
  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;
  textarea.value = textarea.value.substring(0, start) + symbol + textarea.value.substring(end);
  textarea.focus();
  textarea.setSelectionRange(start + symbol.length, start + symbol.length);
  textarea.dispatchEvent(new Event('input', { bubbles: true }));
}

export function parseMarkdownTable(content: string): string[][] {
  return content.split('\n').map(line => line.trim()).filter(line => line.startsWith('|'))
    .filter(line => !/^\|?\s*:?-{3,}:?\s*(\|\s*:?-{3,}:?\s*)+\|?$/.test(line))
    .map(line => line.replace(/^\|/, '').replace(/\|$/, '').split('|').map(cell => cell.trim()));
}

export function renderFormattedText(text: string, blockId: string, onEditLink?: EditLinkHandler): React.ReactNode[] | string {
  const parts = parseInlineNodes(text).map((node, index) => {
    const key = `${blockId}-${index}`;
    if (node.type === 'text') return node.value;
    if (node.type === 'bold') return <strong key={key} className="font-bold text-carbon">{node.value}</strong>;
    if (node.type === 'italic') return <em key={key} className="italic text-carbon/85">{node.value}</em>;
    if (node.type === 'inlineLatex') return <KatexText key={key} text={`$${node.value}$`} className="rounded bg-ocre/5 px-1 py-0.5 text-carbon" />;

    if (node.type === 'conceptLink' || node.type === 'refLink') {
      const tag = node.type === 'conceptLink' ? 'ConceptLink' : 'RefLink';
      const colorClass = node.type === 'conceptLink' ? 'text-salvia border-b border-dashed border-salvia/30' : 'text-pavo border-b border-dashed border-pavo/30';
      const targetLabel = Array.isArray(node.attrs.targetId) ? node.attrs.targetId.join(', ') : node.attrs.targetId || '';
      return <InteractivePreviewToken key={key} blockId={blockId} raw={node.raw} text={node.value} attrs={node.attrs} tag={tag}
        target={String(node.attrs.highlightTarget || '')} colorClass={colorClass} title={`Vínculo a: ${targetLabel} (Click para editar)`}
        onEditLink={onEditLink} tooltip={`Concepto: ${targetLabel || 'sin destino'}`}>
        {renderFormattedText(node.value, blockId, onEditLink)}
      </InteractivePreviewToken>;
    }

    const color = node.attrs.color || 'salvia';
    return <InteractivePreviewToken key={key} blockId={blockId} raw={node.raw} text={node.value} attrs={node.attrs} tag="InteractiveElement"
      target={String(node.attrs.target || '')} colorClass={`text-${color} border-b border-dashed border-${color}/30`}
      title={`Resalta en gráfico: ${node.attrs.target || ''} (Click para editar)`} onEditLink={onEditLink}
      tooltip={`Resalta: ${node.attrs.target || ''} (${color})`}>
      {renderFormattedText(node.value, blockId, onEditLink)}
    </InteractivePreviewToken>;
  });
  return parts.length > 0 ? parts : text;
}
