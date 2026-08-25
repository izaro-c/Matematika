import React, { useMemo, useCallback, useEffect, useRef, useState } from 'react';
import ForceGraph2D from 'react-force-graph-2d';
import { useLocation } from 'wouter';
import { db } from '@/data/content';
import { getGlossaryDictionary } from '@/lib/stores/GlossaryStore';
import { useThemeColors } from '@/lib/theme/useThemeColors';
import { GraphSkeleton } from '@/components/ui/skeletons';
import { useI18n } from '@/i18n';

interface GraphNode {
  id: string;
  name: string;
  group: string;
  val: number;
  isCenter: boolean;
  url: string;
  x?: number;
  y?: number;
}

interface GraphLink {
  source: string;
  target: string;
}

interface PageDependencyGraphProps {
  currentId: string;
  currentTitle: string;
  currentType: string;
  lemmas?: { id: string; title: string }[];
  corollaries?: { id: string; title: string }[];
  demos?: { id: string; title: string }[];
}

function resolveGroup(id: string, lang: string): string {
  const thm = db.getTheorem(id, lang);
  if (thm)                    return thm.type || 'teorema';
  if (db.getDefinition(id, lang))   return 'definicion';
  if (db.getAxiom(id, lang))        return 'axioma';
  if (db.getModel(id, lang))        return 'modelo';
  if (db.getDemo(id, lang))         return 'demostracion';
  if (db.getMathematicianById(id, lang)) return 'matematico';
  if (getGlossaryDictionary(lang)[id])   return 'glosario';
  return 'definicion';
}

function resolveTitle(id: string, lang: string): string {
  return (
    db.getTheorem(id, lang)?.title ||
    db.getDefinition(id, lang)?.title ||
    db.getAxiom(id, lang)?.title ||
    db.getModel(id, lang)?.title ||
    db.getMathematicianById(id, lang)?.name ||
    db.getDemo(id, lang)?.title ||
    getGlossaryDictionary(lang)[id]?.title ||
    id
  );
}

function resolveRoute(id: string, group: string, getLocalizedPath: (p: string) => string): string {
  switch (group) {
    case 'demostracion': return getLocalizedPath(`/demo/${id}`);
    case 'definicion':   return getLocalizedPath(`/definicion/${id}`);
    case 'concepto':     return getLocalizedPath(`/definicion/${id}`);
    case 'modelo':       return getLocalizedPath(`/modelo/${id}`);
    case 'axioma':       return getLocalizedPath(`/axioma/${id}`);
    case 'glosario':     return getLocalizedPath(`/definicion/${id}`);
    case 'matematico':   return getLocalizedPath(`/bio/${id}`);
    default:             return getLocalizedPath(`/teorema/${id}`);
  }
}

export const PageDependencyGraph: React.FC<PageDependencyGraphProps> = ({
  currentId,
  currentTitle,
  currentType,
  lemmas = [],
  corollaries = [],
  demos = [],
}) => {
  const { lang, getLocalizedPath } = useI18n();
  const [, setLocation] = useLocation();
  const containerRef = useRef<HTMLDivElement>(null);
  const theme = useThemeColors();
  const linkColor = `${theme.carbon}8C`;
  const [dimensions, setDimensions] = useState({ width: 0, height: 200 });
  const [domIds, setDomIds] = useState<string[]>([]);
  const [scanDone, setScanDone] = useState(false);
  const [settled, setSettled] = useState(false);


  // Measure container — same pattern as TaxonomyGraph
  useEffect(() => {
    if (containerRef.current) {
      setDimensions({
        width: containerRef.current.offsetWidth,
        height: 200,
      });
    }
    const handleResize = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.offsetWidth,
          height: 200,
        });
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Un solo scan tras montar: el MDX ya está en el DOM (Suspense de ruta).
  useEffect(() => {
    setScanDone(false);
    setSettled(false);
    setDomIds([]);

    const rawBase = import.meta.env.BASE_URL || '/';
    const basePrefix = rawBase === '/' ? '' : rawBase.replace(/\/$/, '');
    const routePrefixes: Record<string, true> = {
      teorema: true, definicion: true, axioma: true, modelo: true, demo: true,
    };

    const runScan = () => {
      const found: string[] = [];
      const seen = new Set<string>([currentId]);

      const addId = (id: string) => {
        const trimmed = id.trim();
        if (trimmed && !seen.has(trimmed)) {
          seen.add(trimmed);
          found.push(trimmed);
        }
      };

      document
        .querySelectorAll(
          '.content-reading [data-target-id], .content-secondary [data-target-id]'
        )
        .forEach((el) => {
          const attr = el.getAttribute('data-target-id') || '';
          attr.split(',').forEach(addId);
        });

      document
        .querySelectorAll('.content-reading a[href], .content-secondary a[href]')
        .forEach((el) => {
          const href = el.getAttribute('href') || '';
          const clean = href.replace(basePrefix, '').replace(/^\//, '');
          const parts = clean.split('/');
          if (parts.length >= 2 && routePrefixes[parts[0]]) {
            addId(parts[1]);
          }
        });

      setDomIds(found);
      setScanDone(true);
    };

    const id = requestAnimationFrame(() => runScan());
    return () => cancelAnimationFrame(id);
  }, [currentId]);

  const graphData = useMemo(() => {
    const nodeMap = new Map<string, GraphNode>();
    const links: GraphLink[] = [];
    const linkSet = new Set<string>();

    const addNode = (id: string, name: string, group: string, val: number, isCenter: boolean) => {
      if (!nodeMap.has(id)) {
        nodeMap.set(id, {
          id, name, group, val, isCenter,
          url: resolveRoute(id, group, getLocalizedPath),
        });
      }
    };

    const addLink = (source: string, target: string) => {
      const key = `${source}→${target}`;
      if (!linkSet.has(key)) {
        linkSet.add(key);
        links.push({ source, target });
      }
    };

    // Centre
    const centerGroup = currentType
      ? currentType.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      : 'teorema';
    addNode(currentId, currentTitle, centerGroup, 10, true);

    // Lemmas → centre
    lemmas.forEach(({ id, title }) => {
      addNode(id, title, 'lema', 6, false);
      addLink(id, currentId);
    });

    // Centre → corollaries
    corollaries.forEach(({ id, title }) => {
      addNode(id, title, 'corolario', 6, false);
      addLink(currentId, id);
    });

    // Centre → demos
    demos.forEach(({ id, title }) => {
      addNode(id, title, 'demostracion', 6, false);
      addLink(currentId, id);
    });

    // links[] and seeAlso[] from the DB entity
    const entity =
      db.getTheorem(currentId, lang) ||
      db.getDefinition(currentId, lang) ||
      db.axioms.get(currentId) ||
      db.models.get(currentId);

    const extra = new Set<string>();
    if (entity) {
      (entity.links  || []).forEach(id => extra.add(id));
      (entity.seeAlso || []).forEach(id => extra.add(id));
    }

    // DOM-scanned ConceptLink targets
    domIds.forEach(id => extra.add(id));

    extra.forEach(id => {
      if (id && id !== currentId && !nodeMap.has(id)) {
        const grp = resolveGroup(id, lang);
        addNode(id, resolveTitle(id, lang), grp, 5, false);
        addLink(currentId, id);
      }
    });

    return { nodes: Array.from(nodeMap.values()), links };
  }, [currentId, currentTitle, currentType, lemmas, corollaries, demos, domIds, lang, getLocalizedPath]);

  const drawNode = useCallback((node: GraphNode, ctx: CanvasRenderingContext2D, globalScale: number) => {
    if (node.x == null || node.y == null || !Number.isFinite(node.x) || !Number.isFinite(node.y)) return;

    const r = node.val / 2;
    const color = theme.getHex(node.group);

    // Filled circle
    ctx.beginPath();
    ctx.arc(node.x, node.y, r, 0, 2 * Math.PI);
    ctx.fillStyle = color;
    ctx.fill();

    // Ink border
    ctx.strokeStyle = theme.carbon;
    ctx.lineWidth = 0.8 / globalScale;
    ctx.stroke();

    // Extra ring for centre node
    if (node.isCenter) {
      ctx.beginPath();
      ctx.arc(node.x, node.y, r + 2.5 / globalScale, 0, 2 * Math.PI);
      ctx.strokeStyle = color;
      ctx.lineWidth = 0.6 / globalScale;
      ctx.stroke();
    }

    // Label — always visible (small panel, always zoomed out)
    const fs = 9 / globalScale;
    ctx.font = `${node.isCenter ? 'bold ' : ''}${fs}px Georgia, serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    const ty = node.y + r + 2 / globalScale;

    // Halo
    ctx.strokeStyle = theme.lienzo;
    ctx.lineWidth = 2.5 / globalScale;
    ctx.strokeText(node.name, node.x, ty);

    ctx.fillStyle = node.isCenter ? color : theme.carbon;
    ctx.fillText(node.name, node.x, ty);
  }, [theme]);


  useEffect(() => {
    setSettled(false);
  }, [currentId]);

  const handleNodeClick = useCallback((node: GraphNode) => {
    if (node.id === currentId) return;
    setLocation(node.url);
  }, [currentId, setLocation]);

  const showGraph = dimensions.width > 0 && scanDone;

  return (
    <div
      ref={containerRef}
      className="relative w-full overflow-hidden"
      style={{
        height: 200,
        background: theme.lienzo,
        border: `1px solid ${theme.carbon}14`,
      }}
    >
      {showGraph && (
        <div className={settled ? undefined : 'invisible'} aria-hidden={settled ? undefined : true}>
          <ForceGraph2D
            width={dimensions.width}
            height={200}
            graphData={graphData}
            nodeLabel={() => ''}
            nodeCanvasObject={drawNode}
            onNodeClick={handleNodeClick}
            onEngineStop={() => setSettled(true)}
            linkColor={() => linkColor}
            linkWidth={1.25}
            linkDirectionalArrowColor={() => linkColor}
            linkDirectionalArrowLength={5}
            linkDirectionalArrowRelPos={0.82}
            enableNodeDrag
            enableZoomInteraction={false}
            enablePanInteraction={false}
            cooldownTicks={80}
          />
        </div>
      )}
      {(!showGraph || !settled) && (
        <div className="absolute inset-0 z-10">
          <GraphSkeleton height={200} />
        </div>
      )}
    </div>
  );
};
