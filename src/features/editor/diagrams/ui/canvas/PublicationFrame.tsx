import React from 'react';
import { publicationContentSize } from '@/features/editor/diagrams/ui/canvas/canvasFrameMode';

export interface PublicationFrameProps {
  mode: 'desktop' | 'tablet' | 'mobile';
  title?: string;
  pageType?: string;
  children: React.ReactNode;
}

const MODE_LABELS: Record<PublicationFrameProps['mode'], string> = {
  desktop: 'Escritorio',
  tablet: 'Tableta',
  mobile: 'Móvil',
};

function bezelClassName(mode: PublicationFrameProps['mode']): string {
  switch (mode) {
    case 'mobile':
      return 'rounded-[2.25rem] border-[10px] border-carbon/80 bg-carbon/90 p-2 shadow-xl';
    case 'tablet':
      return 'rounded-3xl border-[8px] border-carbon/70 bg-carbon/80 p-3 shadow-lg';
    case 'desktop':
      return 'rounded-lg border border-carbon/20 bg-lienzo shadow-2xl';
  }
}

export const PublicationFrame: React.FC<PublicationFrameProps> = ({
  mode,
  title,
  pageType,
  children,
}) => {
  const content = publicationContentSize(mode, pageType);

  return (
    <div className={`flex flex-col overflow-hidden ${bezelClassName(mode)}`}>
      <div className="flex items-center gap-2 border-b border-carbon/10 bg-carbon/5 px-3 py-1.5">
        {mode === 'desktop' && (
          <div className="flex gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-terracota/70" />
            <span className="h-2.5 w-2.5 rounded-full bg-salvia/70" />
            <span className="h-2.5 w-2.5 rounded-full bg-carbon/30" />
          </div>
        )}
        <span className="ml-auto rounded border border-carbon/15 bg-lienzo px-2 py-0.5 text-[10px] font-mono uppercase tracking-wide text-carbon/60">
          {MODE_LABELS[mode]}
        </span>
      </div>

      <div className="flex flex-col bg-lienzo p-4">
        <header className="mb-4 space-y-2">
          <h1 className="font-serif text-xl font-bold text-carbon">{title ?? 'Sin título'}</h1>
          <div className="space-y-1.5">
            <div className="h-2 w-full rounded bg-carbon/10" />
            <div className="h-2 w-11/12 rounded bg-carbon/8" />
            <div className="h-2 w-4/5 rounded bg-carbon/6" />
          </div>
        </header>

        <div
          data-testid="publication-diagram-slot"
          className="overflow-hidden rounded border border-carbon/10 bg-lienzo"
          style={{ width: content.width, height: content.height }}
        >
          <div className="h-full w-full">{children}</div>
        </div>
      </div>
    </div>
  );
};
