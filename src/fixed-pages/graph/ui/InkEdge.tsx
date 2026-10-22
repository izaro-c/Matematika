import type { CSSProperties } from 'react';
import type { EdgeProps } from '@xyflow/react';
import { AXIOMATIC_NODE_SIZE } from '../constants';

export interface InkEdgeData {
  points?: Array<{ x: number; y: number }>;
  implied?: boolean;
  /** Sube hacia la fila de axiomas: sale por arriba del consecuente y entra por debajo del axioma. */
  back?: boolean;
  fromPrimitive?: boolean;
  /** Si existe, la arista se escribe con pluma tras este retardo (ms). */
  drawDelay?: number;
  /** Lo que tarda en escribirse (ms). */
  drawDuration?: number;
  /** Se escribe desde el destino hacia el origen (la ola de una selección sube por la cadena). */
  drawReverse?: boolean;
  /** Cambia para volver a escribir la arista (p. ej. el nodo seleccionado). */
  drawKey?: string;
  /** Propagación tras un cambio de axiomas: la tinta recorre la línea o la abandona de origen a destino. */
  flow?: { kind: 'on' | 'off'; start: number; duration: number; stroke: string; key: number };
}

/** Curva por los puntos de paso, con tangentes verticales en cada uno. */
export function inkPath(points: Array<{ x: number; y: number }>): string {
  let d = `M ${points[0].x},${points[0].y}`;
  for (let i = 1; i < points.length; i++) {
    const a = points[i - 1];
    const b = points[i];
    const half = (b.y - a.y) / 2;
    d += ` C ${a.x},${a.y + half} ${b.x},${b.y - half} ${b.x},${b.y}`;
  }
  return d;
}

/** Arista de dependencia trazada como tinta. */
export function InkEdge({ id, sourceX, sourceY, targetX, targetY, data, style, markerEnd }: EdgeProps) {
  const edge = (data ?? {}) as InkEdgeData;
  const start = edge.back ? { x: sourceX, y: sourceY - AXIOMATIC_NODE_SIZE } : { x: sourceX, y: sourceY };
  const end = edge.back ? { x: targetX, y: targetY + AXIOMATIC_NODE_SIZE } : { x: targetX, y: targetY };
  const d = inkPath([start, ...(edge.back ? [] : edge.points ?? []), end]);
  const drawing = edge.drawDelay !== undefined;

  const flow = edge.flow;
  const baseWidth = Number((style as CSSProperties | undefined)?.strokeWidth ?? 1.5);

  return (
    <>
      <path
        key={drawing ? `${id}:${edge.drawKey ?? ''}` : id}
        id={id}
        d={d}
        fill="none"
        className={`react-flow__edge-path ink-edge${drawing ? ' ink-edge--draw' : ''}${drawing && edge.drawReverse ? ' ink-edge--draw-reverse' : ''}${edge.back ? ' ink-edge--back' : ''}`}
        style={{ ...style, ...(drawing ? { '--ink-delay': `${edge.drawDelay}ms`, '--ink-duration': `${edge.drawDuration ?? 520}ms` } : {}) } as CSSProperties}
        pathLength={drawing ? 1 : undefined}
        markerEnd={markerEnd}
      />
      {flow && (
        <path
          key={`${id}:flow:${flow.key}`}
          d={d}
          fill="none"
          pathLength={1}
          className={`ink-edge-flow ink-edge-flow--${flow.kind}`}
          style={{
            stroke: flow.stroke,
            strokeWidth: baseWidth + 0.75,
            '--flow-start': `${flow.start}ms`,
            '--flow-duration': `${flow.duration}ms`,
          } as CSSProperties}
        />
      )}
    </>
  );
}
