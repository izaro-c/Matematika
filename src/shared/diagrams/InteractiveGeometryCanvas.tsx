import React from 'react';

export interface GeoPoint {
  id: string;
  x: number; // porcentaje o coordenadas fijas 0-500
  y: number;
  label: string;
}

export interface GeoSegment {
  id: string;
  p1: string; // id del punto 1
  p2: string; // id del punto 2
  color?: string;
}

export interface GeoPolygon {
  id: string;
  points: string[]; // ids de puntos
  color?: string;
}

export interface InteractiveGeometryCanvasProps {
  points?: GeoPoint[] | string; // Permitir string si viene serializado de MDX
  segments?: GeoSegment[] | string;
  polygons?: GeoPolygon[] | string;
  width?: number;
  height?: number;
}

export const InteractiveGeometryCanvas: React.FC<InteractiveGeometryCanvasProps> = ({
  points = [],
  segments = [],
  polygons = [],
  width = 500,
  height = 350
}) => {
  // Parsear props si vienen como strings JSON de MDX
  const parsedPoints: GeoPoint[] = typeof points === 'string' ? JSON.parse(points) : points;
  const parsedSegments: GeoSegment[] = typeof segments === 'string' ? JSON.parse(segments) : segments;
  const parsedPolygons: GeoPolygon[] = typeof polygons === 'string' ? JSON.parse(polygons) : polygons;

  const findPoint = (id: string) => parsedPoints.find(p => p.id === id);

  // Paleta de colores Arts & Crafts oficiales mapeados a estilos SVG
  const getStrokeColor = (themeColor?: string) => {
    switch (themeColor) {
      case 'salvia': return '#7c9082';
      case 'terracota': return '#c86f5c';
      case 'ocre': return '#d1a153';
      case 'pizarra': return '#607274';
      case 'granada': return '#b04a4a';
      default: return '#2c2c2c'; // carbón
    }
  };

  const getFillColor = (themeColor?: string) => {
    switch (themeColor) {
      case 'salvia': return 'rgba(124, 144, 130, 0.15)';
      case 'terracota': return 'rgba(200, 111, 92, 0.15)';
      case 'ocre': return 'rgba(209, 161, 83, 0.15)';
      case 'pizarra': return 'rgba(96, 114, 116, 0.15)';
      default: return 'rgba(44, 44, 44, 0.05)';
    }
  };

  return (
    <div className="flex justify-center my-6">
      <div className="bg-[#fdfbfa] border border-carbon/10 rounded-lg p-4 shadow-md max-w-full">
        <svg
          width="100%"
          height="100%"
          viewBox={`0 0 ${width} ${height}`}
          className="w-full max-w-[500px] h-[350px] overflow-visible"
        >
          {/* Grilla sutil de fondo */}
          <defs>
            <pattern id="grid" width="25" height="25" patternUnits="userSpaceOnUse">
              <path d="M 25 0 L 0 0 0 25" fill="none" stroke="rgba(44, 44, 44, 0.03)" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" className="rounded" />

          {/* Renderizar Polígonos (capa de fondo) */}
          {parsedPolygons.map(poly => {
            const coords = poly.points
              .map(id => findPoint(id))
              .filter(Boolean)
              .map(p => `${p!.x},${p!.y}`)
              .join(' ');

            return (
              <polygon
                key={poly.id}
                points={coords}
                fill={getFillColor(poly.color)}
                stroke={getStrokeColor(poly.color)}
                strokeWidth="1.5"
                strokeDasharray="2 2"
              />
            );
          })}

          {/* Renderizar Segmentos (capa intermedia) */}
          {parsedSegments.map(seg => {
            const p1 = findPoint(seg.p1);
            const p2 = findPoint(seg.p2);
            if (!p1 || !p2) return null;

            return (
              <line
                key={seg.id}
                x1={p1.x}
                y1={p1.y}
                x2={p2.x}
                y2={p2.y}
                stroke={getStrokeColor(seg.color)}
                strokeWidth="2"
                strokeLinecap="round"
              />
            );
          })}

          {/* Renderizar Puntos y sus etiquetas (capa superior) */}
          {parsedPoints.map(p => (
            <g key={p.id} className="cursor-pointer">
              <circle
                cx={p.x}
                cy={p.y}
                r="5"
                fill="#2c2c2c" // carbón
                stroke="#fff"
                strokeWidth="1.5"
                className="shadow-sm"
              />
              <text
                x={p.x}
                y={p.y - 10}
                textAnchor="middle"
                className="text-[12px] font-serif italic font-bold fill-carbon select-none"
              >
                {p.label}
              </text>
            </g>
          ))}
        </svg>
      </div>
    </div>
  );
};
export default InteractiveGeometryCanvas;
