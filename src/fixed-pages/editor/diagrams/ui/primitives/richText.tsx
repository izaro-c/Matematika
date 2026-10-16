import React from 'react';

export type RichTextTags = Record<string, (content: string) => React.ReactNode>;

const TAG_PATTERN = /<(\w+)>([\s\S]*?)<\/\1>/g;

/**
 * Renders a translated message that marks inline emphasis with `<tag>…</tag>`
 * (e.g. `Use <code>{value}</code> to insert the value`). Parameters must be
 * interpolated first (`t(key, params)`); unknown tags are kept as plain text.
 * Keeping the whole sentence in one translation lets each language reorder it.
 */
export function renderRichText(text: string, tags: RichTextTags): React.ReactNode[] {
  const nodes: React.ReactNode[] = [];
  let cursor = 0;
  for (const match of text.matchAll(TAG_PATTERN)) {
    const [whole, tag, content] = match;
    const index = match.index ?? 0;
    if (index > cursor) nodes.push(text.slice(cursor, index));
    const render = tags[tag];
    nodes.push(render ? <React.Fragment key={index}>{render(content)}</React.Fragment> : whole);
    cursor = index + whole.length;
  }
  if (cursor < text.length) nodes.push(text.slice(cursor));
  return nodes;
}
