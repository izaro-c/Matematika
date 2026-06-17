import { Handle, Position } from '@xyflow/react';
import type { NodeProps } from '@xyflow/react';

export interface MathNodeData {
  label: string;
  nodeType: 'axioma' | 'lema' | 'corolario' | 'teorema' | 'definicion';
  description: string;
  isActive: boolean;
  /** Escala visual pura (CSS transform); no afecta la posición dagre */
  scale: number;
  isHighlighted: boolean;
}

interface TypeStyle {
  bg: string;
  border: string;
  text: string;
  badge: string;
  ringColor: string;
}

const TYPE_STYLES: Record<string, TypeStyle> = {
  axioma: { bg: '#1c1917', border: '#1c1917', text: '#f8f6f1', badge: 'AXIOMA', ringColor: '#f5c542' },
  lema: { bg: '#4a6070', border: '#4a6070', text: '#ffffff', badge: 'LEMA', ringColor: '#a0c4d8' },
  corolario: { bg: '#b85c38', border: '#b85c38', text: '#ffffff', badge: 'COROLARIO', ringColor: '#f5a07a' },
  teorema: { bg: '#6b9e6b', border: '#6b9e6b', text: '#ffffff', badge: 'TEOREMA', ringColor: '#a8d5a8' },
  definicion: { bg: '#8b7355', border: '#8b7355', text: '#ffffff', badge: 'DEFINICION', ringColor: '#d2b48c' },
};

export function MathNode({ data }: NodeProps) {
  const { label, nodeType, isActive, scale, isHighlighted } = (data as unknown) as MathNodeData;
  const s = TYPE_STYLES[nodeType] || TYPE_STYLES.teorema;

  // Opacidad base según estado activo
  const contentOpacity = isActive ? 1 : 0.28;

  return (
    /**
     * Contenedor EXTERNO: tamaño fijo = huella en React Flow.
     * NUNCA cambia de tamaño → posiciones dagre estables en hover.
     */
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
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
          opacity: contentOpacity,
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
            background: s.ringColor,
            border: `2px solid ${s.bg}`,
            borderRadius: '50%',
            opacity: 0.25,
          }}
        />

        <div
          style={{
            width: '100%',
            height: '100%',
            backgroundColor: s.bg,
            border: `${isHighlighted ? 4 : 2}px solid ${isHighlighted ? s.ringColor : s.border}`,
            borderRadius: '50%',
            outline: isHighlighted ? `3px solid ${s.ringColor}` : 'none',
            outlineOffset: isHighlighted ? 3 : 2,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '8px 12px',
            boxSizing: 'border-box',
            boxShadow: isHighlighted
              ? `0 0 0 2px ${s.bg}, 0 0 18px ${s.ringColor}80`
              : '0 2px 8px rgba(0,0,0,0.18)',
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
              color: s.text,
              opacity: 0.65,
              lineHeight: 1,
              userSelect: 'none',
            }}
          >
            {s.badge}
          </span>

          {/* Título del nodo */}
          <span
            style={{
              fontSize: 15,
              fontFamily: '"Georgia", "Times New Roman", serif',
              fontWeight: 'bold',
              color: s.text,
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
            background: s.ringColor,
            border: `2px solid ${s.bg}`,
            borderRadius: '50%',
            opacity: 0.25,
          }}
        />
      </div>
    </div>
  );
}
