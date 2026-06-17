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
  axioma:    { bg: '#1c1917', border: '#1c1917', text: '#f8f6f1', badge: 'AXIOMA',    ringColor: '#f5c542' },
  lema:      { bg: '#4a6070', border: '#4a6070', text: '#ffffff', badge: 'LEMA',      ringColor: '#a0c4d8' },
  corolario: { bg: '#b85c38', border: '#b85c38', text: '#ffffff', badge: 'COROLARIO', ringColor: '#f5a07a' },
  teorema:   { bg: '#6b9e6b', border: '#6b9e6b', text: '#ffffff', badge: 'TEOREMA',   ringColor: '#a8d5a8' },
  definicion:{ bg: '#8b7355', border: '#8b7355', text: '#ffffff', badge: 'DEFINICION',ringColor: '#d2b48c' },
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
      {/* Handle target: arista entrante en la parte superior */}
      <Handle
        type="target"
        position={Position.Top}
        style={{
          background: 'transparent',
          width: 1,
          height: 1,
          border: 'none',
          opacity: 0,
          zIndex: -1,
        }}
      />

      {/**
       * Contenedor INTERNO: escala visual pura con CSS transform.
       * `transformOrigin: center center` + `pointer-events: none`
       * garantiza que los handles siguen en la posición correcta
       * mientras el contenido visual se encoge/agranda suavemente.
       */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          transform: `scale(${scale})`,
          transformOrigin: 'center center',
          opacity: contentOpacity,
          transition: 'transform 0.22s ease, opacity 0.22s ease',
          pointerEvents: 'none',
        }}
      >
        <div
          style={{
            width: '100%',
            height: '100%',
            backgroundColor: s.bg,
            border: `2px solid ${isHighlighted ? s.ringColor : s.border}`,
            borderRadius: 7,
            outline: isHighlighted ? `3px solid ${s.ringColor}` : 'none',
            outlineOffset: 2,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '5px 10px',
            boxSizing: 'border-box',
            boxShadow: '0 2px 8px rgba(0,0,0,0.18)',
            gap: 3,
          }}
        >
          {/* Badge de tipo */}
          <span
            style={{
              fontSize: 7.5,
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
              fontSize: 11,
              fontFamily: '"Georgia", "Times New Roman", serif',
              fontWeight: 'bold',
              color: s.text,
              textAlign: 'center',
              lineHeight: 1.25,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              userSelect: 'none',
              textTransform: 'capitalize',
            }}
          >
            {label}
          </span>
        </div>
      </div>

      {/* Handle source: arista saliente en la parte inferior */}
      <Handle
        type="source"
        position={Position.Bottom}
        style={{
          background: 'transparent',
          width: 1,
          height: 1,
          border: 'none',
          opacity: 0,
          zIndex: -1,
        }}
      />
    </div>
  );
}
