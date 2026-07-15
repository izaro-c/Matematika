import React, { useMemo } from 'react';
import { useLocation } from 'wouter';
import graphStructureData from '@/entities/graph/graph_structure.json';
import type { GraphStructure, GraphNodeMeta } from '@/entities/graph/graphTypes';
import { db } from '@/entities/content';
import { TYPE_STYLES } from '@/shared/lib/constants';

interface LocalDependencyGraphProps {
  nodeId: string;
  className?: string;
}

interface NodePosition {
  id: string;
  label: string;
  type: string;
  x: number;
  y: number;
  radius: number;
}

interface EdgeConnection {
  id: string;
  sourceX: number;
  sourceY: number;
  targetX: number;
  targetY: number;
}

interface SubgraphInfo {
  edges: { source: string; target: string }[];
  levels: Record<string, number>;
  visited: Set<string>;
}

// 1. Recolectar el subgrafo local de dependencias usando BFS (máx 2 niveles de profundidad)
function getLocalSubgraph(nodeId: string, nodesMap: Record<string, GraphNodeMeta>): SubgraphInfo {
  const visited = new Set<string>();
  const levels: Record<string, number> = {};
  const edges: { source: string; target: string }[] = [];

  const queue: { id: string; depth: number }[] = [{ id: nodeId, depth: 0 }];
  visited.add(nodeId);
  levels[nodeId] = 0;

  while (queue.length > 0) {
    const { id, depth } = queue.shift()!;
    if (depth >= 2) continue;

    const nodeMeta = nodesMap[id];
    if (!nodeMeta) continue;

    const deps = nodeMeta.directDependencies ?? [];
    for (const depId of deps) {
      if (!nodesMap[depId]) continue;
      
      edges.push({ source: depId, target: id });

      if (!visited.has(depId)) {
        visited.add(depId);
        levels[depId] = depth + 1;
        queue.push({ id: depId, depth: depth + 1 });
      } else {
        levels[depId] = Math.max(levels[depId], depth + 1);
      }
    }
  }

  return { edges, levels, visited };
}

// 2. Obtener el título simplificado de un nodo y truncarlo de forma elegante
function getNodeLabel(id: string, nodesMap: Record<string, GraphNodeMeta>): string {
  const theorem = db.getTheorem(id);
  const definition = db.getDefinition(id);
  
  let label = id;
  if (theorem) {
    label = theorem.title;
  } else if (definition) {
    label = definition.title;
  } else {
    const metaNode = nodesMap[id] as { title?: string } | undefined;
    if (metaNode?.title) {
      label = metaNode.title;
    }
  }

  if (label.length > 15) {
    return label.substring(0, 13) + '…';
  }
  return label;
}

export const LocalDependencyGraph: React.FC<LocalDependencyGraphProps> = ({ nodeId, className = '' }) => {
  const [, setLocation] = useLocation();

  const graphData = useMemo(() => {
    const typedGraphData = graphStructureData as unknown as GraphStructure;
    const nodesMap = typedGraphData.nodes ?? {};
    if (!nodesMap[nodeId]) return null;

    const { edges, levels } = getLocalSubgraph(nodeId, nodesMap);

    // Agrupar nodos por nivel
    const nodesByLevel: Record<number, string[]> = {};
    let maxLevel = 0;
    for (const [id, level] of Object.entries(levels)) {
      if (!nodesByLevel[level]) nodesByLevel[level] = [];
      nodesByLevel[level].push(id);
      maxLevel = Math.max(maxLevel, level);
    }

    // Configuración del layout
    const positions: Record<string, NodePosition> = {};
    const svgWidth = 240;
    const levelHeight = 85; // Más altura para acomodar etiquetas de texto bajo los círculos
    
    // Colocar nodos
    for (let lvl = maxLevel; lvl >= 0; lvl--) {
      const levelNodes = nodesByLevel[lvl] ?? [];
      const numNodes = levelNodes.length;
      const visualLvl = maxLevel - lvl;
      const y = 30 + visualLvl * levelHeight;

      levelNodes.forEach((id, idx) => {
        const x = (svgWidth / (numNodes + 1)) * (idx + 1);
        const label = getNodeLabel(id, nodesMap);
        const isCurrent = id === nodeId;
        const radius = isCurrent ? 11 : 9;

        positions[id] = {
          id,
          label,
          type: nodesMap[id]?.type ?? 'concepto',
          x,
          y,
          radius,
        };
      });
    }

    // Crear aristas alineadas con los bordes de los círculos
    const connections: EdgeConnection[] = [];
    edges.forEach((edge, idx) => {
      const src = positions[edge.source];
      const tgt = positions[edge.target];
      if (src && tgt) {
        // La arista va del borde inferior de la fuente al borde superior del destino
        connections.push({
          id: `edge-${edge.source}-${edge.target}-${idx}`,
          sourceX: src.x,
          sourceY: src.y + src.radius,
          targetX: tgt.x,
          targetY: tgt.y - tgt.radius,
        });
      }
    });

    const svgHeight = 45 + (maxLevel + 1) * levelHeight;

    return {
      nodes: Object.values(positions),
      edges: connections,
      height: svgHeight,
      width: svgWidth,
    };
  }, [nodeId]);

  if (!graphData) return null;

  const handleNodeClick = (id: string, type: string) => {
    if (id === nodeId) return;
    const config = TYPE_STYLES[type];
    
    let prefix = 'teorema';
    if (config) {
      if (type === 'concepto' || type === 'definicion') {
        prefix = 'definicion';
      }
    }
    
    setLocation(`/${prefix}/${id}`);
  };

  return (
    <div className={`local-dependency-graph-container ${className}`}>
      <h3>Dependencias Lógicas</h3>
      <svg
        width="100%"
        height={graphData.height}
        viewBox={`0 0 ${graphData.width} ${graphData.height}`}
        className="overflow-visible"
        aria-label="Árbol lógico de justificaciones"
      >
        <defs>
          <marker
            id="arrow-classic"
            viewBox="0 0 10 10"
            refX="6"
            refY="5"
            markerWidth="5"
            markerHeight="5"
            orient="auto-start-reverse"
          >
            <path d="M 0 2.5 L 7 5 L 0 7.5 z" fill="var(--theme-carbon)" opacity="0.75" />
          </marker>
        </defs>

        {/* Dibujar Enlaces Discontinuos de Tinta */}
        {graphData.edges.map((edge) => {
          const dx = edge.targetX - edge.sourceX;
          const dy = edge.targetY - edge.sourceY;
          const controlY1 = edge.sourceY + dy * 0.45;
          const controlY2 = edge.targetY - dy * 0.45;
          
          const pathData = `M ${edge.sourceX} ${edge.sourceY} 
                            C ${edge.sourceX + dx * 0.05} ${controlY1}, 
                              ${edge.targetX - dx * 0.05} ${controlY2}, 
                              ${edge.targetX} ${edge.targetY}`;

          return (
            <path
              key={edge.id}
              d={pathData}
              fill="none"
              stroke="var(--theme-carbon)"
              strokeWidth={1}
              strokeOpacity={0.65}
              strokeDasharray="4 3"
              markerEnd="url(#arrow-classic)"
            />
          );
        })}

        {/* Dibujar Nodos (Círculos clásicos) */}
        {graphData.nodes.map((node) => {
          const isCurrent = node.id === nodeId;
          const typeStyle = TYPE_STYLES[node.type];
          const nodeColor = typeStyle?.bg ?? 'var(--theme-pizarra)';

          return (
            <g
              key={node.id}
              transform={`translate(0, 0)`}
              className={`local-dependency-node ${isCurrent ? 'pointer-events-none' : ''}`}
              onClick={() => handleNodeClick(node.id, node.type)}
            >
              {/* Anillo exterior de completado (estilo astrolabio) para el nodo actual */}
              {isCurrent && (
                <circle
                  cx={node.x}
                  cy={node.y}
                  r={node.radius + 3}
                  fill="none"
                  stroke="var(--theme-terracota)"
                  strokeWidth={0.8}
                  strokeDasharray="2 1.5"
                />
              )}

              {/* Círculo Principal de Tinta */}
              <circle
                cx={node.x}
                cy={node.y}
                r={node.radius}
                fill={nodeColor}
                stroke="var(--theme-carbon)"
                strokeWidth={isCurrent ? 2 : 1}
              />
              
              {/* Pequeño punto interior para dar relieve de diagrama antiguo */}
              <circle
                cx={node.x}
                cy={node.y}
                r={1.5}
                fill="var(--theme-lienzo)"
                opacity={0.8}
              />

              {/* Etiqueta de texto debajo del círculo (Georgia Cursiva Serif) */}
              <text
                x={node.x}
                y={node.y + node.radius + 14}
                textAnchor="middle"
                fontSize="10"
                fontFamily="Georgia, ui-serif, serif"
                fontStyle="italic"
                fontWeight={isCurrent ? 'bold' : 'normal'}
                fill="var(--theme-carbon)"
                opacity={isCurrent ? 1 : 0.8}
                style={{ userSelect: 'none' }}
              >
                {node.label}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
};
