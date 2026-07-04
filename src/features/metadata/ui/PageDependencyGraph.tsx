import React, { useMemo, useCallback, useEffect, useRef, useState } from 'react';
import ForceGraph2D from 'react-force-graph-2d';
import { useLocation } from 'wouter';
import { db } from '@/entities/content';
import { dictionary } from '@/features/glossary/GlossaryStore';
import { useThemeColors } from '@/shared/hooks/useThemeColors';




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

function resolveGroup(id: string): string {
  const thm = db.getTheorem(id);
  if (thm)                    return thm.type || 'teorema';
  if (db.getDefinition(id))   return 'definicion';
  if (db.axioms.get(id))      return 'axioma';
  if (db.models.get(id))      return 'modelo';
  if (db.demos.get(id))       return 'demostracion';
  if (db.getMathematicianById(id)) return 'matematico';
  if (dictionary[id])         return 'glosario';
  return 'definicion';
}

function resolveTitle(id: string): string {
  return (
    db.getTheorem(id)?.title ||
    db.getDefinition(id)?.title ||
    db.axioms.get(id)?.title ||
    db.models.get(id)?.title ||
    db.getMathematicianById(id)?.name ||
    db.demos.get(id)?.title ||
    dictionary[id]?.title ||
    id
  );
}

/** Wouter-relative routes (base is prepended automatically by the Router). */
function resolveRoute(id: string, group: string): string {
  switch (group) {
    case 'demostracion': return `/demo/${id}`;
    case 'definicion':   return `/definicion/${id}`;
    case 'concepto':     return `/definicion/${id}`;
    case 'modelo':       return `/modelo/${id}`;
    case 'axioma':       return `/axioma/${id}`;
    case 'glosario':     return `/definicion/${id}`;
    case 'matematico':   return `/bio/${id}`;
    default:             return `/teorema/${id}`;
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
  const [, setLocation] = useLocation();
  const containerRef = useRef<HTMLDivElement>(null);
  const theme = useThemeColors();
  const [dimensions, setDimensions] = useState({ width: 0, height: 200 });
  const [domIds, setDomIds] = useState<string[]>([]);


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

  // Staggered DOM scans to capture lazy-loaded MDX ConceptLinks
  // MDX components load asynchronously, so a single timeout is unreliable.
  useEffect(() => {
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

      // 1. data-target-id attributes (ConceptLink / RefLink — valid entities)
      document
        .querySelectorAll(
          '.triptych-reading [data-target-id], .triptych-secondary [data-target-id]'
        )
        .forEach((el) => {
          const attr = el.getAttribute('data-target-id') || '';
          attr.split(',').forEach(addId);
        });

      // 2. href-based <a> links to known routes (RefLink, construction links, etc.)
      document
        .querySelectorAll('.triptych-reading a[href], .triptych-secondary a[href]')
        .forEach((el) => {
          const href = el.getAttribute('href') || '';
          const clean = href.replace(basePrefix, '').replace(/^\//, '');
          const parts = clean.split('/');
          if (parts.length >= 2 && routePrefixes[parts[0]]) {
            addId(parts[1]);
          }
        });

      // Merge with existing domIds — only update state if new IDs were found
      setDomIds(prev => {
        const merged = [...prev];
        const existingSet = new Set(prev);
        found.forEach(id => {
          if (!existingSet.has(id)) merged.push(id);
        });
        return merged.length > prev.length ? merged : prev;
      });
    };

    // Three scans: fast, medium, slow — covers most MDX lazy-load scenarios
    const t1 = setTimeout(runScan, 600);
    const t2 = setTimeout(runScan, 1500);
    const t3 = setTimeout(runScan, 3500);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [currentId]);

  const graphData = useMemo(() => {
    const nodeMap = new Map<string, GraphNode>();
    const links: GraphLink[] = [];
    const linkSet = new Set<string>();

    const addNode = (id: string, name: string, group: string, val: number, isCenter: boolean) => {
      if (!nodeMap.has(id)) {
        nodeMap.set(id, {
          id, name, group, val, isCenter,
          url: resolveRoute(id, group),
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
      db.getTheorem(currentId) ||
      db.getDefinition(currentId) ||
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
        const grp = resolveGroup(id);
        addNode(id, resolveTitle(id), grp, 5, false);
        addLink(currentId, id);
      }
    });

    return { nodes: Array.from(nodeMap.values()), links };
  }, [currentId, currentTitle, currentType, lemmas, corollaries, demos, domIds]);

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


  const handleNodeClick = useCallback((node: GraphNode) => {
    if (node.id === currentId) return;
    setLocation(node.url);
  }, [currentId, setLocation]);

  return (
    <div
      ref={containerRef}
      className="w-full overflow-hidden"
      style={{
        height: 200,
        background: theme.lienzo,
        border: `1px solid ${theme.carbon}14`,
      }}
    >
      {dimensions.width > 0 && (
        <ForceGraph2D
          width={dimensions.width}
          height={200}
          graphData={graphData}
          nodeLabel={() => ''}
          nodeCanvasObject={drawNode}
          onNodeClick={handleNodeClick}
          linkColor={() => theme.carbon + '26'}
          linkWidth={1}
          linkDirectionalArrowLength={4}
          linkDirectionalArrowRelPos={1}
          enableNodeDrag
          enableZoomInteraction={false}
          enablePanInteraction={false}
          cooldownTicks={100}
        />
      )}
    </div>
  );
};
