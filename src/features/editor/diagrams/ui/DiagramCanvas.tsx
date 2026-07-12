import React, { useState } from 'react';
import type { VisualDiagramModel, VisualElement, CanvasTool } from '../model/types';
import {
  visualPointCoords, baseExtensionCoords, projectPointToSupport,
  updatePoint, point
} from '../model/commands';

interface DiagramCanvasProps {
  model: VisualDiagramModel;
  selectedId: string;
  canvasTool: CanvasTool;
  pendingRefs: string[];
  previewHighlightId: string;
  previewStepId: string;
  onSelect: (id: string) => void;
  onModelEdit: (model: VisualDiagramModel) => void;
  onChoosePointForTool: (pointId: string) => boolean;
}

export const DiagramCanvas: React.FC<DiagramCanvasProps> = ({
  model,
  selectedId,
  canvasTool,
  pendingRefs,
  previewHighlightId,
  previewStepId,
  onSelect,
  onModelEdit,
  onChoosePointForTool,
}) => {
  const [draggingPointId, setDraggingPointId] = useState<string | null>(null);

  const [minX, maxY, maxX, minY] = model.boundingBox;

  const toSvg = (x: number, y: number) => {
    return {
      x: ((x - minX) / (maxX - minX)) * 720,
      y: ((maxY - y) / (maxY - minY)) * 480,
    };
  };

  const fromSvgEvent = (event: React.PointerEvent<SVGSVGElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const localX = ((event.clientX - rect.left) / rect.width) * 720;
    const localY = ((event.clientY - rect.top) / rect.height) * 480;
    const rawX = minX + (localX / 720) * (maxX - minX);
    const rawY = maxY - (localY / 480) * (maxY - minY);
    // Snap to grid (0.5 steps) if enabled, else raw coordinates
    const snap = true; // Let's keep snap active
    const x = snap ? Math.round(rawX * 2) / 2 : rawX;
    const y = snap ? Math.round(rawY * 2) / 2 : rawY;
    return { x: Number(x.toFixed(2)), y: Number(y.toFixed(2)) };
  };

  const isVisibleInPreview = (id: string): boolean => {
    if (!previewStepId) return true;
    const step = model.steps.find(s => s.id === previewStepId);
    return !step || step.visibleTargets.includes(id);
  };

  const previewEmphasis = (id: string): number => {
    if (previewHighlightId && previewHighlightId !== id) return 0.28;
    return 1;
  };

  const renderElementPreview = (item: VisualElement) => {
    if (!isVisibleInPreview(item.id)) return null;
    const selected = selectedId === item.id;
    const highlighted = previewHighlightId === item.id;
    const emphasis = previewEmphasis(item.id);
    const color = `var(--theme-${selected || highlighted ? 'ocre' : item.color})`;

    if (item.kind === 'segment') {
      const a = visualPointCoords(model, item.refs[0]);
      const b = visualPointCoords(model, item.refs[1]);
      if (!a || !b) return null;
      const svgA = toSvg(a.x, a.y);
      const svgB = toSvg(b.x, b.y);
      return (
        <line
          key={item.id}
          x1={svgA.x}
          y1={svgA.y}
          x2={svgB.x}
          y2={svgB.y}
          stroke={color}
          strokeWidth={selected || highlighted ? 5 : 2.5}
          strokeDasharray={item.dashed ? '5,5' : undefined}
          opacity={emphasis}
          className="cursor-pointer transition-all"
          onPointerDown={(event) => {
            event.stopPropagation();
            onSelect(item.id);
          }}
        />
      );
    }

    if (item.kind === 'line' || item.kind === 'ray' || item.kind === 'perpendicular' || item.kind === 'parallel' || item.kind === 'angleBisector') {
      const a = visualPointCoords(model, item.refs[0]);
      const b = visualPointCoords(model, item.refs[1]);
      const through = visualPointCoords(model, item.refs[2]);
      const lineA = item.kind === 'perpendicular' || item.kind === 'parallel' ? through : a;
      const baseA = a;
      const baseB = b;
      if (!lineA || !baseA || !baseB) return null;

      const dx = baseB.x - baseA.x;
      const dy = baseB.y - baseA.y;
      
      const angleLeg = item.kind === 'angleBisector' ? visualPointCoords(model, item.refs[0]) : undefined;
      const angleVertex = item.kind === 'angleBisector' ? visualPointCoords(model, item.refs[1]) : undefined;
      const angleOtherLeg = item.kind === 'angleBisector' ? visualPointCoords(model, item.refs[2]) : undefined;
      
      const angleDirection = angleLeg && angleVertex && angleOtherLeg
        ? (() => {
          const ux = angleLeg.x - angleVertex.x;
          const uy = angleLeg.y - angleVertex.y;
          const wx = angleOtherLeg.x - angleVertex.x;
          const wy = angleOtherLeg.y - angleVertex.y;
          const uLen = Math.hypot(ux, uy) || 1;
          const wLen = Math.hypot(wx, wy) || 1;
          const sumX = ux / uLen + wx / wLen;
          const sumY = uy / uLen + wy / wLen;
          const sumLen = Math.hypot(sumX, sumY);
          return sumLen < 1e-6 ? { x: -uy / uLen, y: ux / uLen } : { x: sumX / sumLen, y: sumY / sumLen };
        })()
        : undefined;

      const vx = item.kind === 'angleBisector' && angleDirection ? angleDirection.x : item.kind === 'perpendicular' ? -dy : dx;
      const vy = item.kind === 'angleBisector' && angleDirection ? angleDirection.y : item.kind === 'perpendicular' ? dx : dy;
      const origin = item.kind === 'angleBisector' && angleVertex ? angleVertex : lineA;


      const isClamped = item.kind === 'ray' || item.kind === 'angleBisector';

      // Draw infinite line
      const t1 = isClamped ? 0 : -25;
      const t2 = 25;
      const svgP1 = toSvg(origin.x + vx * t1, origin.y + vy * t1);
      const svgP2 = toSvg(origin.x + vx * t2, origin.y + vy * t2);

      return (
        <line
          key={item.id}
          x1={svgP1.x}
          y1={svgP1.y}
          x2={svgP2.x}
          y2={svgP2.y}
          stroke={color}
          strokeWidth={selected || highlighted ? 4.5 : 2.2}
          strokeDasharray={item.dashed ? '4,4' : undefined}
          opacity={emphasis}
          className="cursor-pointer transition-all"
          onPointerDown={(event) => {
            event.stopPropagation();
            onSelect(item.id);
          }}
        />
      );
    }

    if (item.kind === 'polygon') {
      const coordsList = item.refs.map(ref => visualPointCoords(model, ref)).filter(Boolean) as { x: number; y: number }[];
      if (coordsList.length < 3) return null;
      const pointsStr = coordsList.map(c => {
        const svg = toSvg(c.x, c.y);
        return `${svg.x},${svg.y}`;
      }).join(' ');
      return (
        <polygon
          key={item.id}
          points={pointsStr}
          fill={color}
          fillOpacity={selected || highlighted ? 0.34 : 0.16}
          stroke={color}
          strokeWidth={1.5}
          opacity={emphasis}
          className="cursor-pointer transition-all"
          onPointerDown={(event) => {
            event.stopPropagation();
            onSelect(item.id);
          }}
        />
      );
    }

    if (item.kind === 'circle') {
      const center = visualPointCoords(model, item.refs[0]);
      const edge = visualPointCoords(model, item.refs[1]);
      if (!center || !edge) return null;

      const svgCenter = toSvg(center.x, center.y);
      const svgEdge = toSvg(edge.x, edge.y);
      const svgRadius = Math.hypot(svgEdge.x - svgCenter.x, svgEdge.y - svgCenter.y);
      return (
        <circle
          key={item.id}
          cx={svgCenter.x}
          cy={svgCenter.y}
          r={svgRadius}
          fill="none"
          stroke={color}
          strokeWidth={selected || highlighted ? 4.8 : 2.4}
          opacity={emphasis}
          className="cursor-pointer transition-all"
          onPointerDown={(event) => {
            event.stopPropagation();
            onSelect(item.id);
          }}
        />
      );
    }

    if (item.kind === 'midpoint' || item.kind === 'perpendicularFoot') {
      const c = visualPointCoords(model, item.id);
      if (!c) return null;
      const svgC = toSvg(c.x, c.y);
      return (
        <g
          key={item.id}
          className="cursor-pointer"
          opacity={emphasis}
          onPointerDown={(event) => {
            event.stopPropagation();
            onSelect(item.id);
          }}
        >
          <rect
            x={svgC.x - 6}
            y={svgC.y - 6}
            width={12}
            height={12}
            fill={color}
            stroke="var(--theme-lienzo)"
            strokeWidth={2}
          />
          <text x={svgC.x + 10} y={svgC.y - 10} fill="var(--theme-carbon)" className="select-none font-serif text-[11px] font-bold italic">{item.label}</text>
        </g>
      );
    }

    if (item.kind === 'baseExtension') {
      const ext = baseExtensionCoords(model, item);
      if (!ext) return null;
      const svgStart = toSvg(ext.start.x, ext.start.y);
      const svgEnd = toSvg(ext.end.x, ext.end.y);
      return (
        <line
          key={item.id}
          x1={svgStart.x}
          y1={svgStart.y}
          x2={svgEnd.x}
          y2={svgEnd.y}
          stroke={color}
          strokeWidth={selected || highlighted ? 3.5 : 1.7}
          strokeDasharray="3,3"
          opacity={emphasis}
          className="cursor-pointer transition-all"
          onPointerDown={(event) => {
            event.stopPropagation();
            onSelect(item.id);
          }}
        />
      );
    }

    if (item.kind === 'angle' || item.kind === 'rightAngle') {
      const p1 = visualPointCoords(model, item.refs[0]);
      const vertex = visualPointCoords(model, item.refs[1]);
      const p2 = visualPointCoords(model, item.refs[2]);
      if (!p1 || !vertex || !p2) return null;
      
      const v = toSvg(vertex.x, vertex.y);
      const a1 = Math.atan2(p1.y - vertex.y, p1.x - vertex.x);
      const a2 = Math.atan2(p2.y - vertex.y, p2.x - vertex.x);
      let diff = a2 - a1;
      if (diff < 0) diff += 2 * Math.PI;
      
      const r = item.kind === 'rightAngle' ? 18 : 28;
      const x1 = v.x + r * Math.cos(-a1);
      const y1 = v.y + r * Math.sin(-a1);
      const x2 = v.x + r * Math.cos(-a2);
      const y2 = v.y + r * Math.sin(-a2);
      
      const largeArc = diff > Math.PI ? 1 : 0;
      const sweep = diff > 0 ? 0 : 1; // Y is inverted in SVG

      if (item.kind === 'rightAngle') {
        const u1 = { x: Math.cos(-a1), y: Math.sin(-a1) };
        const u2 = { x: Math.cos(-a2), y: Math.sin(-a2) };
        const cornerX = v.x + r * (u1.x + u2.x);
        const cornerY = v.y + r * (u1.y + u2.y);
        const pointsStr = `${v.x + r * u1.x},${v.y + r * u1.y} ${cornerX},${cornerY} ${v.x + r * u2.x},${v.y + r * u2.y}`;
        return (
          <polyline
            key={item.id}
            points={pointsStr}
            fill={color}
            fillOpacity={selected || highlighted ? 0.45 : 0.18}
            stroke={color}
            strokeWidth={selected || highlighted ? 3 : 1.5}
            opacity={emphasis}
            className="cursor-pointer transition-all"
            onPointerDown={(event) => {
              event.stopPropagation();
              onSelect(item.id);
            }}
          />
        );
      }

      const pathStr = `M ${v.x} ${v.y} L ${x1} ${y1} A ${r} ${r} 0 ${largeArc} ${sweep} ${x2} ${y2} Z`;

      return (
        <path
          key={item.id}
          d={pathStr}
          fill={color}
          fillOpacity={selected || highlighted ? 0.45 : 0.18}
          stroke={color}
          strokeWidth={selected || highlighted ? 3 : 1.5}
          opacity={emphasis}
          className="cursor-pointer transition-all"
          onPointerDown={(event) => {
            event.stopPropagation();
            onSelect(item.id);
          }}
        />
      );
    }

    // Text & Measurement labels
    const anchor = visualPointCoords(model, item.refs[0] || model.points[0]?.id);
    if (!anchor) return null;
    const svgAnchor = toSvg(anchor.x, anchor.y);
    return (
      <g
        key={item.id}
        className="cursor-pointer select-none"
        opacity={emphasis}
        onPointerDown={(event) => {
          event.stopPropagation();
          onSelect(item.id);
        }}
      >
        <text
          x={svgAnchor.x + 15}
          y={svgAnchor.y + 15}
          fill={color}
          className={`font-serif text-[13px] font-bold ${selected || highlighted ? 'underline' : ''}`}
        >
          {item.text || item.label}
        </text>
      </g>
    );
  };

  const handlePointerDownCanvas = (event: React.PointerEvent<SVGSVGElement>) => {
    if (canvasTool === 'point') {
      const coords = fromSvgEvent(event);
      const id = `p${model.points.length + 1}`;
      const newPoint = point(id, id.replace(/^p/, ''), coords.x, coords.y);
      onModelEdit({
        ...model,
        points: [...model.points, newPoint],
      });
      onSelect(id);
      return;
    }
    onSelect('');
  };

  const choosePointForCanvasTool = (pointId: string) => {
    return onChoosePointForTool(pointId);
  };

  return (
    <div className="overflow-hidden rounded border border-carbon/15 bg-lienzo">
      <div className="flex items-center justify-between border-b border-carbon/10 bg-carbon/5 px-3 py-2">
        <p className="text-[10px] font-bold uppercase tracking-widest text-carbon/45">Lienzo visual</p>
        <p className="text-[10px] text-carbon/45">Arrastre puntos · clic para seleccionar</p>
      </div>
      <svg
        viewBox="0 0 720 480"
        className="block aspect-[3/2] w-full touch-none bg-lienzo"
        role="img"
        aria-label={`Editor visual del diagrama ${model.title}`}
        onPointerMove={(event) => {
          if (!draggingPointId) return;
          const next = fromSvgEvent(event);
          const current = model.points.find(item => item.id === draggingPointId);
          if (!current) return;
          const constrained = current.constraint === 'horizontal'
            ? { x: next.x, y: current.y }
            : current.constraint === 'vertical'
              ? { x: current.x, y: next.y }
              : current.constraint === 'glider'
                ? projectPointToSupport(model, current, next)
                : next;
          onModelEdit(updatePoint(model, draggingPointId, constrained));
        }}
        onPointerUp={() => setDraggingPointId(null)}
        onPointerLeave={() => setDraggingPointId(null)}
        onPointerDown={handlePointerDownCanvas}
      >
        {/* Render grid */}
        {model.grid && Array.from({ length: 11 }, (_, index) => index - 5).map(value => {
          const a = toSvg(value, -5);
          const b = toSvg(value, 5);
          const c = toSvg(-5, value);
          const d = toSvg(5, value);
          return (
            <g key={value} opacity={0.22}>
              <line x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke="var(--theme-carbon)" strokeWidth={1} />
              <line x1={c.x} y1={c.y} x2={d.x} y2={d.y} stroke="var(--theme-carbon)" strokeWidth={1} />
            </g>
          );
        })}
        {/* Render axis */}
        {model.axis && (
          <g opacity={0.45}>
            <line x1={toSvg(-5, 0).x} y1={toSvg(-5, 0).y} x2={toSvg(5, 0).x} y2={toSvg(5, 0).y} stroke="var(--theme-carbon)" strokeWidth={1.5} />
            <line x1={toSvg(0, -5).x} y1={toSvg(0, -5).y} x2={toSvg(0, 5).x} y2={toSvg(0, 5).y} stroke="var(--theme-carbon)" strokeWidth={1.5} />
          </g>
        )}

        {/* Elements */}
        {model.elements.map(renderElementPreview)}

        {/* Sliders */}
        {model.sliders.map(item => {
          const p = toSvg(item.x, item.y);
          const selected = selectedId === item.id;
          const highlighted = previewHighlightId === item.id;
          if (!isVisibleInPreview(item.id)) return null;
          return (
            <g
              key={item.id}
              className="cursor-pointer"
              opacity={previewEmphasis(item.id)}
              onPointerDown={(event) => {
                event.stopPropagation();
                onSelect(item.id);
              }}
            >
              <line
                x1={p.x}
                y1={p.y}
                x2={p.x + 150}
                y2={p.y}
                stroke={`var(--theme-${item.color})`}
                strokeWidth={selected || highlighted ? 5 : 3}
                strokeLinecap="round"
              />
              <circle
                cx={p.x + 150 * ((item.value - item.min) / Math.max(0.01, item.max - item.min))}
                cy={p.y}
                r={selected || highlighted ? 9 : 7}
                fill={`var(--theme-${selected || highlighted ? 'ocre' : item.color})`}
                stroke="var(--theme-lienzo)"
                strokeWidth={3}
              />
              <text x={p.x} y={p.y - 13} fill="var(--theme-carbon)" className="select-none font-serif text-xs font-bold">
                {item.label}: {item.value}
              </text>
            </g>
          );
        })}

        {/* Points */}
        {model.points.map(item => {
          if (!isVisibleInPreview(item.id)) return null;
          const p = toSvg(item.x, item.y);
          const selected = selectedId === item.id;
          const highlighted = previewHighlightId === item.id;
          const pending = pendingRefs.includes(item.id);
          return (
            <g
              key={item.id}
              className="cursor-grab"
              onPointerDown={(event) => {
                event.stopPropagation();
                // Check if selecting point for a creation tool
                if (canvasTool !== 'select' && canvasTool !== 'point') {
                  choosePointForCanvasTool(item.id);
                  onSelect(item.id);
                  return;
                }
                onSelect(item.id);
                if (!item.fixed) {
                  setDraggingPointId(item.id);
                  event.currentTarget.setPointerCapture(event.pointerId);
                }
              }}
            >
              <circle
                cx={p.x}
                cy={p.y}
                r={selected || highlighted || pending ? 10 : 7}
                fill={`var(--theme-${selected || highlighted || pending ? 'ocre' : item.color})`}
                stroke="var(--theme-lienzo)"
                strokeWidth={3}
                opacity={previewEmphasis(item.id)}
                className="transition-all"
              />
              <text x={p.x + 12} y={p.y - 12} fill="var(--theme-carbon)" className="select-none font-serif text-lg font-bold italic">
                {item.label}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
};
export default DiagramCanvas;
