import React, { useState } from 'react';
import { useProgressStore } from '@/features/progress/UserProgressStore';
import { db } from '@/entities/content';

interface StudyPlanMinimapProps {
  requiredNodes: string[];
}

export const StudyPlanMinimap: React.FC<StudyPlanMinimapProps> = ({ requiredNodes }) => {
  const { isRead } = useProgressStore();
  const [hoveredNode, setHoveredNode] = useState<any | null>(null);

  const nodesData = requiredNodes.map((id) => {
    const meta = (
      db.getTheorem(id) ||
      db.getDefinition(id) ||
      db.axioms.get(id) ||
      db.models.get(id) ||
      db.getUseCase(id) ||
      db.getExample(id) ||
      db.getExercise(id)
      || db.getMethod(id)
    ) as any;

    return {
      id,
      title: meta?.title || id,
      type: meta?.type || 'contenido',
      completed: isRead(id),
    };
  });

  const handleNodeClick = (id: string) => {
    const el = document.querySelector(`[data-node-id="${id}"]`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      el.classList.add('ring-4', 'ring-accent/30');
      setTimeout(() => {
        el.classList.remove('ring-4', 'ring-accent/30');
      }, 1500);
    }
  };

  // Encontrar el primer nodo incompleto (Siguiente Paso)
  const nextStepNode = nodesData.find(node => !node.completed) || nodesData[nodesData.length - 1];

  // Configuración de la Barra Horizontal Compacta Curvada
  const width = 600;
  const height = 55;
  const paddingX = 20;
  const stepX = (width - paddingX * 2) / Math.max(requiredNodes.length - 1, 1);

  const points = nodesData.map((node, index) => {
    const x = paddingX + index * stepX;
    // Vaivén vertical orgánico y fluido
    const y = height / 2 + Math.sin(index * 1.5) * 8;
    return { ...node, x, y };
  });

  // Generar línea de conector curvada (Bézier suave)
  let pathD = '';
  if (points.length > 0) {
    pathD = `M ${points[0].x} ${points[0].y}`;
    for (let i = 0; i < points.length - 1; i++) {
      const p1 = points[i];
      const p2 = points[i + 1];
      const cpX1 = p1.x + stepX / 2;
      const cpY1 = p1.y;
      const cpX2 = p2.x - stepX / 2;
      const cpY2 = p2.y;
      pathD += ` C ${cpX1} ${cpY1}, ${cpX2} ${cpY2}, ${p2.x} ${p2.y}`;
    }
  }

  // Generar línea de progreso completado con curvas
  let progressPathD = '';
  const lastCompletedIdx = points.map(p => p.completed).lastIndexOf(true);
  if (lastCompletedIdx >= 0) {
    progressPathD = `M ${points[0].x} ${points[0].y}`;
    for (let i = 0; i < lastCompletedIdx; i++) {
      const p1 = points[i];
      const p2 = points[i + 1];
      const cpX1 = p1.x + stepX / 2;
      const cpY1 = p1.y;
      const cpX2 = p2.x - stepX / 2;
      const cpY2 = p2.y;
      progressPathD += ` C ${cpX1} ${cpY1}, ${cpX2} ${cpY2}, ${p2.x} ${p2.y}`;
    }
  }

  return (
    <div className="w-full bg-arts-and-crafts border border-carbon/15 px-6 py-4 my-6 rounded-[2px] shadow-sm select-none relative overflow-hidden flex flex-col items-center">
      {/* Cabecera compacta */}
      <div className="w-full flex items-center justify-between ac-label ac-label--xs ac-label--faint mb-3 border-b border-carbon/5 pb-2">
        <span>Mapa de la Ruta</span>
        <span className="text-[8px] tracking-normal font-normal normal-case italic text-carbon/50">Pulsa un hito para navegar</span>
      </div>

      {/* SVG Horizontal Adaptativo Curvado */}
      <div className="w-full max-w-2xl overflow-visible">
        <svg viewBox={`0 0 ${width} ${height}`} width="100%" height={height} className="overflow-visible">
          {/* Conector base */}
          <path
            d={pathD}
            fill="none"
            stroke="var(--theme-carbon)"
            strokeOpacity="0.1"
            strokeWidth="3.5"
            strokeLinecap="round"
          />

          {/* Conector de progreso (salvia) */}
          {progressPathD && (
            <path
              d={progressPathD}
              fill="none"
              stroke="var(--theme-salvia)"
              strokeWidth="3.5"
              strokeLinecap="round"
              className="transition-all duration-1000"
            />
          )}

          {/* Hitos/Nodos */}
          {points.map((p, index) => {
            const isCheckpoint = p.id.startsWith('checkpoint-');
            const radius = isCheckpoint ? 5 : (p.completed ? 8 : 7);
            const isCurrent = p.id === nextStepNode?.id;

            let strokeColor = 'var(--theme-carbon)';
            let strokeWidth = p.completed ? 1.8 : 1.2;
            const nodeColor = p.completed ? 'var(--theme-salvia)' : 'var(--theme-lienzo)';

            if (isCurrent) {
              strokeColor = 'var(--page-accent)';
              strokeWidth = 2;
            }

            return (
              <g
                key={p.id}
                className="cursor-pointer"
                onClick={() => handleNodeClick(p.id)}
                onMouseEnter={() => setHoveredNode(p)}
                onMouseLeave={() => setHoveredNode(null)}
              >
                {/* Zona de hover ampliada */}
                <circle
                  cx={p.x}
                  cy={p.y}
                  r="16"
                  fill="transparent"
                />

                {/* Halo pulsante para el hito actual */}
                {isCurrent && !p.completed && (
                  <circle
                    cx={p.x}
                    cy={p.y}
                    r={radius + 4}
                    fill="none"
                    stroke="var(--page-accent)"
                    strokeWidth="1"
                    strokeOpacity="0.5"
                    className="animate-ping"
                    style={{ transformOrigin: `${p.x}px ${p.y}px` }}
                  />
                )}

                {/* Círculo/Rombo del Nodo */}
                <circle
                  cx={p.x}
                  cy={p.y}
                  r={radius}
                  fill={nodeColor}
                  stroke={strokeColor}
                  strokeWidth={strokeWidth}
                  className={`transition-all duration-300 ${isCheckpoint ? 'rotate-45 transform origin-center' : ''}`}
                  style={isCheckpoint ? { transformOrigin: `${p.x}px ${p.y}px`, transform: 'rotate(45deg)' } : undefined}
                />

                {/* Detalle interno para completados */}
                {p.completed && !isCheckpoint && (
                  <circle cx={p.x} cy={p.y} r="2.5" fill="var(--theme-lienzo)" />
                )}

                {/* Número u etiqueta pequeña */}
                {!isCheckpoint && (
                  <text
                    x={p.x}
                    y={p.y + 2.5}
                    fontSize="6.5"
                    fontFamily="sans-serif"
                    fontWeight="bold"
                    textAnchor="middle"
                    fill={p.completed ? 'var(--theme-lienzo)' : 'var(--theme-carbon)'}
                    opacity={p.completed ? 0 : 0.6}
                  >
                    {index + 1}
                  </text>
                )}

                {isCheckpoint && (
                  <text
                    x={p.x}
                    y={p.y + 2}
                    fontSize="6.5"
                    fontFamily="sans-serif"
                    fontWeight="bold"
                    textAnchor="middle"
                    fill={p.completed ? 'var(--theme-salvia)' : 'var(--theme-carbon)'}
                    opacity={p.completed ? 0 : 0.6}
                  >
                    ?
                  </text>
                )}
              </g>
            );
          })}
        </svg>
      </div>

      {/* Panel dinámico de información / Tooltip de Hito */}
      <div className="w-full flex justify-center text-center mt-2 h-6 items-center">
        {hoveredNode ? (
          <div className="text-xs font-sans tracking-wide text-carbon animate-fade-in">
            <span className="ac-label ac-label--xs page-accent-text mr-1.5">
              {hoveredNode.type.split(':')[0]}:
            </span>
            <span className="font-serif italic text-carbon/80">{hoveredNode.title.split(':')[0]}</span>
            {hoveredNode.completed ? (
              <span className="ml-2 ac-label ac-label--2xs ac-label--salvia">✓ Asimilado</span>
            ) : (
              <span className="ml-2 ac-label ac-label--2xs ac-label--faint">Pendiente</span>
            )}
          </div>
        ) : nextStepNode ? (
          <div className="text-[11px] font-sans tracking-wide text-carbon/50">
            <span className="ac-label ac-label--2xs ac-label--faint mr-1.5">Siguiente objetivo:</span>
            <span className="font-serif italic">{nextStepNode.title.split(':')[0]}</span>
          </div>
        ) : (
          <div className="text-xs ac-label ac-label--md ac-label--salvia">
            🎉 ¡Ruta completada!
          </div>
        )}
      </div>
    </div>
  );
};
