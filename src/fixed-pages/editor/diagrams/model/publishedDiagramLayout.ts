export type PublishedDiagramLayout = 'standard' | 'theorem' | 'balanced' | 'demonstration';
export type ScreenPreset = 'desktop' | 'laptop' | 'tablet' | 'mobile' | 'custom';

export interface ScreenDimensions {
  width: number;
  height: number;
}

export interface PublishedDiagramArea extends ScreenDimensions {
  layout: PublishedDiagramLayout;
}

export interface ScreenPresetDefinition extends ScreenDimensions {
  label: string;
}

export const SCREEN_PRESETS: Record<Exclude<ScreenPreset, 'custom'>, ScreenPresetDefinition> = {
  desktop: { label: 'Ordenador', width: 1440, height: 900 },
  laptop: { label: 'Portátil', width: 1024, height: 768 },
  tablet: { label: 'Tableta', width: 834, height: 1112 },
  mobile: { label: 'Móvil', width: 390, height: 844 },
};

export const PUBLISHED_LAYOUT_LABELS: Record<PublishedDiagramLayout, string> = {
  standard: 'Página estándar',
  theorem: 'Teorema con índice',
  balanced: 'Página equilibrada',
  demonstration: 'Demostración dividida',
};

const ROOT_FONT_SIZE = 16;
const EDITORIAL_CH_WIDTH = 7.68;
const DESKTOP_BREAKPOINT = 1024;
const METADATA_BREAKPOINT = 1280;
const WIDE_BREAKPOINT = 1440;

function clamp(minimum: number, value: number, maximum: number): number {
  return Math.min(maximum, Math.max(minimum, value));
}

/** Contexto editorial que ContentLayout/CodexLayout aplica a cada tipo de página. */
export function publishedLayoutForPageType(pageType?: string): PublishedDiagramLayout {
  if (pageType === 'teorema') return 'theorem';
  if (pageType === 'definicion' || pageType === 'metodo') return 'balanced';
  if (pageType === 'demostracion') return 'demonstration';
  return 'standard';
}

/** Deduce el tipo de página a partir de una entrada del índice de usos. */
export function pageTypeFromContentPath(contentPath?: string): string {
  const normalized = contentPath?.replace(/\\/g, '/') ?? '';
  if (normalized.includes('/theorems/')) return 'teorema';
  if (normalized.includes('/definitions/')) return 'definicion';
  if (normalized.includes('/methods/')) return 'metodo';
  if (normalized.includes('/demonstrations/')) return 'demostracion';
  if (normalized.includes('/models/')) return 'modelo';
  if (normalized.includes('/axioms/')) return 'axioma';
  if (normalized.includes('/axiomatic-systems/')) return 'sistema-axiomatico';
  if (normalized.includes('/exercises/')) return 'ejercicio';
  if (normalized.includes('/examples/')) return 'ejemplo';
  if (normalized.includes('/usecases/')) return 'caso-de-uso';
  return '';
}

/**
 * Reproduce las reglas dimensionales de content-layout.css y codex-layout.css.
 * Devuelve el rectángulo que recibe DiagramRenderer, no el viewport completo.
 */
export function publishedDiagramArea(
  screen: ScreenDimensions,
  layout: PublishedDiagramLayout,
): PublishedDiagramArea {
  const screenWidth = Math.max(320, screen.width);
  const screenHeight = Math.max(480, screen.height);

  if (screenWidth < DESKTOP_BREAKPOINT) {
    const inlinePadding = clamp(0.5 * ROOT_FONT_SIZE, screenWidth * 0.02, 0.75 * ROOT_FONT_SIZE);
    const diagramRegionHeight = clamp(14 * ROOT_FONT_SIZE, screenHeight * 0.36, 20 * ROOT_FONT_SIZE);
    return {
      layout,
      width: Math.round(screenWidth - inlinePadding * 2),
      height: Math.round(diagramRegionHeight - 2 * ROOT_FONT_SIZE),
    };
  }

  if (layout === 'demonstration') {
    const leftPadding = clamp(2 * ROOT_FONT_SIZE, screenWidth * 0.08, 12 * ROOT_FONT_SIZE);
    const columnGap = clamp(2 * ROOT_FONT_SIZE, screenWidth * 0.04, 4 * ROOT_FONT_SIZE);
    const availableWidth = screenWidth - leftPadding - columnGap;
    const readingWidth = Math.min(65 * EDITORIAL_CH_WIDTH, Math.max(0, availableWidth - 32 * ROOT_FONT_SIZE));
    return {
      layout,
      width: Math.round(availableWidth - readingWidth),
      height: Math.round(screenHeight - 8 * ROOT_FONT_SIZE),
    };
  }

  if (layout === 'balanced') {
    return { layout, width: Math.round(screenWidth / 2), height: Math.round(screenHeight) };
  }

  const hasTheoremMetadata = layout === 'theorem' && screenWidth >= METADATA_BREAKPOINT;
  const contentWidth = screenWidth - (hasTheoremMetadata ? 19 * ROOT_FONT_SIZE : 0);
  if (screenWidth >= WIDE_BREAKPOINT) {
    const readingMeasure = (layout === 'theorem' ? 80 : 85) * EDITORIAL_CH_WIDTH;
    return { layout, width: Math.round(contentWidth - readingMeasure), height: Math.round(screenHeight) };
  }

  const readingRatio = layout === 'theorem' ? 1.1 : 1.2;
  return {
    layout,
    width: Math.round(contentWidth / (readingRatio + 1)),
    height: Math.round(screenHeight),
  };
}
