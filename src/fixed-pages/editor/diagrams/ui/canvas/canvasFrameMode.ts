import {
  SCREEN_PRESETS,
  publishedDiagramArea,
  publishedLayoutForPageType,
} from '@/fixed-pages/editor/diagrams/model/publishedDiagramLayout';

export type CanvasFrameMode = 'editor' | 'desktop' | 'tablet' | 'mobile';

export function isPublicationMode(
  mode: CanvasFrameMode,
): mode is Exclude<CanvasFrameMode, 'editor'> {
  return mode !== 'editor';
}

export function publicationContentSize(
  mode: Exclude<CanvasFrameMode, 'editor'>,
  pageType?: string,
): { width: number; height: number } {
  const screen = SCREEN_PRESETS[mode];
  const area = publishedDiagramArea(
    { width: screen.width, height: screen.height },
    publishedLayoutForPageType(pageType),
  );
  return { width: area.width, height: area.height };
}
