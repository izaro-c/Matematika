import React from 'react';
import { useMathStore } from '@/shared/lib/MathStoreContext';
import type { EditLinkHandler } from './previewTypes';

interface InteractivePreviewTokenProps {
  blockId: string;
  raw: string;
  text: string;
  attrs: Record<string, unknown>;
  tag: string;
  target: string;
  colorClass: string;
  title: string;
  tooltip: string;
  children: React.ReactNode;
  onEditLink?: EditLinkHandler;
}

export const InteractivePreviewToken: React.FC<InteractivePreviewTokenProps> = ({ blockId, raw, text, attrs, tag, target, colorClass, title, tooltip, children, onEditLink }) => {
  const highlight = useMathStore(state => state.variables.highlight);
  const setVariable = useMathStore(state => state.setVariable);
  const active = target.length > 0 && (Array.isArray(highlight)
    ? highlight.some(item => item === target)
    : highlight === target || (typeof highlight === 'string' && highlight.endsWith(`:${target}`)));
  const activate = () => { if (target) setVariable('highlight', target); };
  return (
    <span
      onClick={event => onEditLink?.(blockId, raw, text, attrs, tag, event)}
      onMouseEnter={activate}
      onMouseLeave={() => target && setVariable('highlight', null)}
      onFocus={activate}
      onBlur={() => target && setVariable('highlight', null)}
      onKeyDown={event => {
        if ((event.key === 'Enter' || event.key === ' ') && onEditLink) {
          event.preventDefault();
          onEditLink(blockId, raw, text, attrs, tag, event as unknown as React.MouseEvent);
        }
      }}
      role={onEditLink ? 'button' : undefined}
      tabIndex={target || onEditLink ? 0 : undefined}
      aria-label={`${text}. ${tooltip}`}
      className={`${colorClass} ${active ? 'bg-ocre/15 ring-2 ring-ocre/25' : ''} relative cursor-pointer rounded px-0.5 font-bold transition-colors group/link`}
      title={title}
      data-diagram-reference={target || undefined}
    >
      {children}
      <span className="absolute bottom-full left-1/2 z-30 mb-1 hidden -translate-x-1/2 whitespace-nowrap rounded bg-carbon px-1.5 py-0.5 font-sans text-[9px] text-lienzo shadow-md group-hover/link:block">{tooltip}</span>
    </span>
  );
};
