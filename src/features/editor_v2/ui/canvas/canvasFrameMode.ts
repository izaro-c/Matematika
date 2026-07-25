import {
  SCREEN_PRESETS,
  publishedDiagramArea,
  publishedLayoutForPageType,
} from '@/features/editor/diagrams/model/publishedDiagramLayout';

export type V2CanvasFrameMode = 'editor' | 'desktop' | 'tablet' | 'mobile';

export function isPublicationMode(
  mode: V2CanvasFrameMode,
): mode is Exclude<V2CanvasFrameMode, 'editor'> {
  return mode !== 'editor';
}

export function publicationContentSize(
  mode: Exclude<V2CanvasFrameMode, 'editor'>,
  pageType?: string,
): { width: number; height: number } {
  const screen = SCREEN_PRESETS[mode];
  const area = publishedDiagramArea(
    { width: screen.width, height: screen.height },
    publishedLayoutForPageType(pageType),
  );
  return { width: area.width, height: area.height };
}
