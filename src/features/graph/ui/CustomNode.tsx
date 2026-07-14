import { Handle, Position } from '@xyflow/react';
import type { NodeProps } from '@xyflow/react';
import { CONTENT_TYPE_CONFIG } from '@/shared/lib/constants';

/**
 * Definición de los datos que almacena cada nodo del grafo lógico interactivo.
 */
export interface MathNodeData {
  label: string;
  nodeType: 'axioma' | 'lema' | 'corolario' | 'teorema' | 'definicion' | 'concepto' | 'modelo';
  description: string;
  isActive: boolean;
  /** Escala visual pura (CSS transform); no afecta la posición dagre */
  scale: number;
  isHighlighted: boolean;
  isDimmed?: boolean;
  inChain?: boolean;
  axiomGroupColor?: string;
  axiomGroupLabel?: string;
}

/**
 * Componente de renderizado personalizado para los nodos de React Flow.
 * Adapta el diseño y colores dependiendo de si es un Axioma, Teorema, Lema, etc.
 * Muestra el estado activo/inactivo (validación lógica) manejando su opacidad.
 */
export function MathNode({ data }: NodeProps) {
  const { label, nodeType, isActive, scale, isHighlighted, isDimmed, inChain, axiomGroupColor } = (data as unknown) as MathNodeData;
  const nodeConfig = CONTENT_TYPE_CONFIG[nodeType] ?? CONTENT_TYPE_CONFIG.teorema;
  const nodeColor = nodeConfig.graphColor;
  const nodeBorder = `color-mix(in srgb, ${nodeColor} 68%, var(--theme-carbon))`;

  // Lógica de opacidad:
  // - nodo atenuado (fuera de cadena) → 0.18
  // - nodo activo → 1
  // - nodo en cadena o destacado (aunque inactivo) → 0.55
  // - resto (inactivo sin selección) → 0.28
  const effectiveOpacity = isDimmed ? 0.18
    : isActive ? 1
    : (isHighlighted || inChain) ? 0.7
    : 0.28;
  const groupColor = nodeType === 'axioma' ? axiomGroupColor : undefined;

  let borderWidth: number, borderColor: string;
  if (isHighlighted) {
    borderWidth = 4;
    borderColor = 'var(--theme-carbon)';
  } else if (groupColor) {
    borderWidth = 5;
    borderColor = groupColor;
  } else {
    borderWidth = 2;
    borderColor = nodeBorder;
  }

  let boxShadow: string;
  if (isHighlighted) {
    boxShadow = `0 0 0 2px var(--theme-lienzo), 0 0 22px color-mix(in srgb, ${nodeColor} 70%, transparent)`;
  } else if (groupColor) {
    boxShadow = `0 0 0 8px color-mix(in srgb, ${groupColor} 27%, transparent), 0 0 0 18px color-mix(in srgb, ${groupColor} 8%, transparent), 0 0 50px color-mix(in srgb, ${groupColor} 25%, transparent), var(--theme-shadow-classic)`;
  } else {
    boxShadow = 'var(--theme-shadow-classic)';
  }

  return (
    /**
     * Contenedor EXTERNO: tamaño fijo = huella en React Flow.
     * NUNCA cambia de tamaño → posiciones dagre estables en hover.
     */
    <div
      className="axiomatic-math-node"
      data-node-type={nodeType}
      style={{ width: '100%', height: '100%', position: 'relative' }}
    >
      {/**
       * Contenedor escalado: incluye los handles para que escalen
       * con el contenido y React Flow detecte sus posiciones correctas
       * mediante getBoundingClientRect().
       */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          transform: `scale(${scale})`,
          transformOrigin: 'center center',
          opacity: effectiveOpacity,
          transition: 'transform 0.22s ease, opacity 0.22s ease',
        }}
      >
        {/* Handle target: arista entrante en la parte superior */}
        <Handle
          type="target"
          position={Position.Top}
          style={{
            width: 12,
            height: 12,
            background: nodeColor,
            border: '2px solid var(--theme-lienzo)',
            borderRadius: '50%',
            opacity: 0.25,
          }}
        />

        <div
          style={{
            width: '100%',
            height: '100%',
            backgroundColor: nodeColor,
            border: `${borderWidth}px solid ${borderColor}`,
            borderRadius: '50%',
            outline: `2px solid ${nodeBorder}`,
            outlineOffset: isHighlighted ? 3 : 2,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '8px 12px',
            boxSizing: 'border-box',
            boxShadow,
            gap: 3,
          }}
        >
          {/* Badge de tipo */}
          <span
            style={{
              fontSize: 13,
              fontFamily: '"Inter", "system-ui", sans-serif',
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: 'var(--graph-node-text)',
              opacity: 0.65,
              lineHeight: 1,
              userSelect: 'none',
            }}
          >
            {nodeConfig.nodeStyle.badge}
          </span>

          {/* Título del nodo */}
          <span
            style={{
              fontSize: 15,
              fontFamily: '"Georgia", "Times New Roman", serif',
              fontWeight: 'bold',
              color: 'var(--graph-node-text)',
              textAlign: 'center',
              lineHeight: 1.25,
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              userSelect: 'none',
              textTransform: 'capitalize',
            }}
          >
            {label}
          </span>
        </div>

        {/* Handle source: arista saliente en la parte inferior */}
        <Handle
          type="source"
          position={Position.Bottom}
          style={{
            width: 12,
            height: 12,
            background: nodeColor,
            border: '2px solid var(--theme-lienzo)',
            borderRadius: '50%',
            opacity: 0.25,
          }}
        />
      </div>
    </div>
  );
}
