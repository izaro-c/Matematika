import React from 'react';

export type EditLinkHandler = (
  blockId: string,
  rawMarkup: string,
  text: string,
  attrs: Record<string, unknown>,
  tag: string,
  event: React.MouseEvent
) => void;
