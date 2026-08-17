import React, { useEffect, useMemo, useRef, useState } from 'react';
import type { FileNode } from '@/fixed-pages/editor/types/editorContracts';
import { getCategoryDisplayName, resourceDisplayName } from '@/fixed-pages/editor/session/editorNavigationModel';
import { getTypeCssVar } from '@/design/contentTypeColors';
import { editorApiClient } from '@/fixed-pages/editor/save/editorApiClient';
import { getDiagramUsages } from '@/fixed-pages/editor/diagrams/references/usageIndex';
import {
  classifyEmbeddedDiagramSource,
  parseDiagramSourceLocally,
  parseDiagramSourceOnServer,
} from '@/fixed-pages/editor/diagrams/source/parser';
import type { VisualDiagramModel } from '@/fixed-pages/editor/diagrams/model/types';
import { DiagramRenderer } from '@/diagrams/public';
import { DiagramSkeleton } from '@/components/ui/skeletons';

interface EditorLandingCardProps {
  file: FileNode;
  isFavorite?: boolean;
  onOpenFile: (path: string) => void;
  onToggleFavorite?: (path: string) => void;
}

export const EditorLandingCard: React.FC<EditorLandingCardProps> = ({
  file,
  isFavorite = false,
  onOpenFile,
  onToggleFavorite,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [diagramModel, setDiagramModel] = useState<VisualDiagramModel | null>(null);
  const [isLoadingContent, setIsLoadingContent] = useState(false);
  const [realTitle, setRealTitle] = useState<string>(() => resourceDisplayName(file));

  // Para diagramas: calcular distintivos y colores de las páginas a las que está añadido
  const badges = useMemo(() => {
    if (file.kind !== 'diagram') {
      const label = getCategoryDisplayName(file.type, 'singular');
      const colorVar = getTypeCssVar(file.type);
      return [{ type: file.type, label, colorVar }];
    }

    const usages = getDiagramUsages(file.path);
    if (!usages.length) {
      const label = getCategoryDisplayName(file.type, 'singular');
      const colorVar = getTypeCssVar(file.type);
      return [{ type: file.type, label, colorVar }];
    }

    // Extraer tipos únicos de páginas MDX donde se usa el diagrama
    const seen = new Set<string>();
    const result: Array<{ type: string; label: string; colorVar: string }> = [];

    for (const usage of usages) {
      const match = usage.contentPath.match(/content\/mdx\/([^/]+)\//);
      const rawType = match?.[1] || 'general';
      if (!seen.has(rawType)) {
        seen.add(rawType);
        result.push({
          type: rawType,
          label: getCategoryDisplayName(rawType, 'singular'),
          colorVar: getTypeCssVar(rawType),
        });
      }
    }

    return result.length > 0
      ? result
      : [{
          type: file.type,
          label: getCategoryDisplayName(file.type, 'singular'),
          colorVar: getTypeCssVar(file.type),
        }];
  }, [file.kind, file.path, file.type]);

  const primaryColorVar = badges[0]?.colorVar ?? getTypeCssVar(file.type);
  const accentBackground = badges.length > 1
    ? `linear-gradient(to right, ${badges.map(b => b.colorVar).join(', ')})`
    : primaryColorVar;

  // Lazy loading observer
  useEffect(() => {
    const el = cardRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') {
      setIsVisible(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: '100px' }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Cargar contenido del archivo cuando la tarjeta entra en el viewport
  useEffect(() => {
    if (!isVisible || isLoadingContent) return;

    let active = true;
    setIsLoadingContent(true);

    editorApiClient
      .readContent({ path: file.path })
      .then(async res => {
        if (!active) return;

        // Extraer título real del metadata MDX si existe
        const mdxTitleMatch = res.source.match(/"title"\s*:\s*"([^"]+)"/);
        if (mdxTitleMatch?.[1]) {
          setRealTitle(mdxTitleMatch[1]);
        }

        if (file.kind !== 'diagram') return;

        // 1. Intento parseo local directo del JSON embebido
        const localModel = parseDiagramSourceLocally(res.source);
        if (localModel) {
          if (localModel.title) setRealTitle(localModel.title);
          setDiagramModel(localModel);
          return;
        }

        // 2. Intento de clasificación embebida
        const embedded = classifyEmbeddedDiagramSource(res.source);
        const model = embedded?.status === 'visual-exact'
          ? embedded.model
          : embedded?.status === 'code-preview' ? embedded.previewModel : undefined;
        if (model) {
          if (model.title) setRealTitle(model.title);
          setDiagramModel(model);
          return;
        }

        // 3. Fallback vía AST en servidor
        const serverRes = await parseDiagramSourceOnServer(res.source);
        if (!active) return;
        const serverModel = serverRes.status === 'visual-exact'
          ? serverRes.model
          : serverRes.status === 'code-preview' ? serverRes.previewModel : undefined;
        if (serverModel) {
          if (serverModel.title) setRealTitle(serverModel.title);
          setDiagramModel(serverModel);
        }
      })
      .catch(() => {
        // Preservar título por defecto ante error
      })
      .finally(() => {
        if (active) setIsLoadingContent(false);
      });

    return () => {
      active = false;
    };
  // ponytail: isLoadingContent excluded from deps — it's a guard, not a trigger.
  // Including it causes infinite retry loops when loading errors out.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isVisible, file.kind, file.path]);

  const capabilityBadge = file.capability === 'visual-exact'
    ? { label: 'Editable', style: 'border-salvia/30 bg-salvia/10 text-salvia' }
    : file.capability === 'code-preview'
      ? { label: 'Fuente', style: 'border-pavo/30 bg-pavo/10 text-pavo' }
      : { label: 'Atención', style: 'border-granada/30 bg-granada/10 text-granada' };

  return (
    <div
      ref={cardRef}
      onClick={() => onOpenFile(file.path)}
      className="group relative flex flex-col justify-between rounded-xl border p-4 shadow-2xs hover:shadow-md transition-all cursor-pointer overflow-hidden"
      style={{
        borderColor: `color-mix(in srgb, ${primaryColorVar} 45%, transparent)`,
        backgroundColor: `color-mix(in srgb, ${primaryColorVar} 8%, var(--color-lienzo, transparent))`,
      }}
    >
      {/* Accent Top Border Line (Color único o Degradado multicolor) */}
      <div
        className="absolute top-0 left-0 right-0 h-1 transition-all group-hover:h-1.5 opacity-90"
        style={{ background: accentBackground }}
      />

      <div className="pt-1">
        {/* Badges & Actions row */}
        <div className="flex items-center justify-between gap-2">
          {/* Tags con el nombre real de categoría / tipo de página en español */}
          <div className="flex flex-wrap items-center gap-1.5 min-w-0">
            {badges.map((badge, idx) => (
              <span
                key={`${badge.type}-${idx}`}
                className="ac-pill ac-pill-accent font-serif font-semibold text-xs shrink-0"
                style={{ ['--pill-accent' as string]: badge.colorVar }}
              >
                <span className="ac-pill-ornament" aria-hidden>◆</span>
                {badge.label}
              </span>
            ))}
          </div>

          <div className="flex items-center space-x-1.5 shrink-0">
            <span className={`rounded border px-1.5 py-0.5 text-[9px] font-bold ${capabilityBadge.style}`}>
              {capabilityBadge.label}
            </span>
            {onToggleFavorite && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleFavorite(file.path);
                }}
                title={isFavorite ? 'Quitar de favoritos' : 'Añadir a favoritos'}
                className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold transition-all cursor-pointer active:scale-90 ${
                  isFavorite
                    ? 'bg-ocre text-lienzo shadow-sm ring-2 ring-ocre/30 scale-105'
                    : 'bg-lienzo/90 text-carbon/40 hover:text-ocre hover:bg-ocre/10 border border-carbon/20'
                }`}
              >
                ★
              </button>
            )}
          </div>
        </div>

        {/* Real Title */}
        <h3
          className="mt-3 font-serif text-sm font-bold text-carbon transition-colors line-clamp-2"
          style={{ ['--hover-color' as string]: primaryColorVar }}
        >
          <span className="group-hover:[color:var(--hover-color)] transition-colors">{file.title || realTitle || resourceDisplayName(file)}</span>
        </h3>

        {/* Path / Identifier */}
        <p className="mt-1 font-mono text-[10px] text-carbon/45 truncate" title={file.path}>
          {file.path}
        </p>

        {/* Diagram Lazy-Loaded Preview */}
        {file.kind === 'diagram' && (
          <div className="mt-3 relative h-36 w-full overflow-hidden rounded-lg border border-carbon/10 bg-lienzo/60 pointer-events-none">
            {isLoadingContent && !diagramModel ? (
              <DiagramSkeleton label="Cargando vista previa..." />
            ) : diagramModel ? (
              <DiagramRenderer
                spec={diagramModel}
                mode="preview"
                hideHeader
                viewportControls={false}
                stepControls={false}
                className="!min-h-0 h-full w-full"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-[10px] text-carbon/40 italic font-mono">
                {isVisible ? 'Diagrama TSX' : 'Esperando a scroll...'}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer / Action */}
      <div className="mt-4 flex items-center justify-between border-t border-carbon/10 pt-2.5 text-xs">
        <span className="text-[11px] font-medium text-carbon/60 group-hover:text-carbon transition-colors">
          {file.kind === 'diagram' ? 'Diagrama Interactivo' : 'Documento MDX'}
        </span>
        <span
          className="flex items-center gap-1 font-semibold group-hover:translate-x-0.5 transition-transform text-xs"
          style={{ color: primaryColorVar }}
        >
          Abrir
          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </span>
      </div>
    </div>
  );
};



