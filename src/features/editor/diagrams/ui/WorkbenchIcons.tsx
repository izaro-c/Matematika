import React from 'react';
import type { CanvasTool } from '../model/types';

export const IconEye: React.FC<{ className?: string }> = ({ className = "w-3.5 h-3.5" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
  </svg>
);

export const IconEyeOff: React.FC<{ className?: string }> = ({ className = "w-3.5 h-3.5" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858-5.908a10.025 10.025 0 014.122-.963c4.478 0 8.268 2.943 9.542 7a10.025 10.025 0 01-2.146 3.882M3 3l18 18" />
  </svg>
);

export const IconLock: React.FC<{ className?: string }> = ({ className = "w-3.5 h-3.5" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
  </svg>
);

export const IconUnlock: React.FC<{ className?: string }> = ({ className = "w-3.5 h-3.5" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
  </svg>
);

export const IconTrash: React.FC<{ className?: string }> = ({ className = "w-3.5 h-3.5" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
);

export const IconClose: React.FC<{ className?: string }> = ({ className = "w-3.5 h-3.5" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

export const IconPlus: React.FC<{ className?: string }> = ({ className = "w-3.5 h-3.5" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
  </svg>
);

export const IconChevronDown: React.FC<{ className?: string }> = ({ className = "w-3 h-3" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
  </svg>
);

export const IconChevronRight: React.FC<{ className?: string }> = ({ className = "w-3 h-3" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
  </svg>
);

export const IconChevronLeft: React.FC<{ className?: string }> = ({ className = "w-3 h-3" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
  </svg>
);

export const IconChevronUp: React.FC<{ className?: string }> = ({ className = "w-3 h-3" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
  </svg>
);

export const IconSun: React.FC<{ className?: string }> = ({ className = "w-4 h-4" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="4" fill="currentColor" fillOpacity="0.3" strokeWidth="1.5" />
    <path strokeLinecap="round" strokeWidth="1.5" d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32l1.41 1.41M2 12h2m16 0h2M6.34 17.66l-1.41 1.41m14.14-14.14l-1.41 1.41" />
  </svg>
);

export const IconMoon: React.FC<{ className?: string }> = ({ className = "w-4 h-4" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" fill="currentColor" fillOpacity="0.3" d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
  </svg>
);

export const IconCopy: React.FC<{ className?: string }> = ({ className = "w-3.5 h-3.5" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
  </svg>
);

export const IconSparkles: React.FC<{ className?: string }> = ({ className = "w-3.5 h-3.5" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
  </svg>
);

type ToolDrawingRenderer = (className: string) => React.ReactElement;

const TOOL_DRAWINGS: Record<string, ToolDrawingRenderer> = {
  select: className => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5" />
    </svg>
  ),
  point: className => (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="5" fill="currentColor" />
      <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="1.5" strokeDasharray="2 2" />
    </svg>
  ),
  midpoint: className => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <line x1="3" y1="12" x2="21" y2="12" strokeDasharray="1 1" />
      <circle cx="4" cy="12" r="2" fill="currentColor" />
      <circle cx="20" cy="12" r="2" fill="currentColor" />
      <circle cx="12" cy="12" r="3" fill="currentColor" />
    </svg>
  ),
  intersection: className => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <line x1="3" y1="21" x2="21" y2="3" />
      <line x1="3" y1="3" x2="21" y2="21" />
      <circle cx="12" cy="12" r="3.5" fill="currentColor" />
    </svg>
  ),
  perpendicularFoot: className => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <line x1="3" y1="18" x2="21" y2="18" />
      <line x1="12" y1="4" x2="12" y2="18" />
      <path d="M12 14h4v4" />
      <circle cx="12" cy="18" r="2.5" fill="currentColor" />
    </svg>
  ),
  add_slider: className => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <line x1="4" y1="12" x2="20" y2="12" />
      <circle cx="12" cy="12" r="3.5" fill="currentColor" />
      <path d="M4 8v8M20 8v8" strokeWidth="1.5" />
    </svg>
  ),
  segment: className => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="5" y1="19" x2="19" y2="5" />
      <circle cx="5" cy="19" r="3" fill="currentColor" />
      <circle cx="19" cy="5" r="3" fill="currentColor" />
    </svg>
  ),
  line: className => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <line x1="2" y1="22" x2="22" y2="2" />
      <circle cx="8" cy="16" r="2" fill="currentColor" />
      <circle cx="16" cy="8" r="2" fill="currentColor" />
    </svg>
  ),
  ray: className => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <line x1="4" y1="18" x2="21" y2="5" />
      <path d="M17 5h4v4" />
      <circle cx="4" cy="18" r="2.5" fill="currentColor" />
    </svg>
  ),
  circle: className => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="12" cy="12" r="8" />
      <circle cx="12" cy="12" r="2" fill="currentColor" />
      <circle cx="20" cy="12" r="2" fill="currentColor" />
    </svg>
  ),
  arc: className => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M5 16A9 9 0 0119 16" />
      <circle cx="12" cy="19" r="2" fill="currentColor" />
      <circle cx="5" cy="16" r="2" fill="currentColor" />
      <circle cx="19" cy="16" r="2" fill="currentColor" />
    </svg>
  ),
  polygon: className => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <polygon points="12,3 21,19 3,19" fill="currentColor" fillOpacity="0.15" />
      <circle cx="12" cy="3" r="2" fill="currentColor" />
      <circle cx="21" cy="19" r="2" fill="currentColor" />
      <circle cx="3" cy="19" r="2" fill="currentColor" />
    </svg>
  ),
  baseExtension: className => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <line x1="3" y1="16" x2="13" y2="16" strokeWidth="2.2" />
      <line x1="13" y1="16" x2="22" y2="16" strokeDasharray="2 2" />
      <circle cx="3" cy="16" r="2" fill="currentColor" />
      <circle cx="13" cy="16" r="2" fill="currentColor" />
    </svg>
  ),
  perpendicular: className => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <line x1="3" y1="18" x2="21" y2="18" />
      <line x1="12" y1="3" x2="12" y2="21" />
      <path d="M12 14h4v4" />
    </svg>
  ),
  parallel: className => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <line x1="3" y1="8" x2="21" y2="8" />
      <line x1="3" y1="16" x2="21" y2="16" />
      <path d="M11 6l3 2-3 2M11 14l3 2-3 2" strokeWidth="1.5" />
    </svg>
  ),
  angleBisector: className => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M4 20L20 20M4 20L16 4" />
      <line x1="4" y1="20" x2="21" y2="10" strokeDasharray="2 2" strokeWidth="2" />
    </svg>
  ),
  angle: className => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M20 20H4L14 4" />
      <path d="M8 20a6 6 0 014.24-10.24" strokeWidth="1.5" fill="currentColor" fillOpacity="0.2" />
    </svg>
  ),
  rightAngle: className => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M20 20H4V4" />
      <path d="M4 14h6v6" strokeWidth="1.5" fill="currentColor" fillOpacity="0.2" />
    </svg>
  ),
  congruenceMark: className => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <line x1="4" y1="18" x2="20" y2="6" strokeWidth="2" />
      <line x1="10" y1="10" x2="14" y2="14" strokeWidth="2" />
      <line x1="12" y1="8" x2="16" y2="12" strokeWidth="2" />
    </svg>
  ),
  parallelMark: className => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <line x1="4" y1="12" x2="20" y2="12" strokeWidth="2" />
      <path d="M10 8l4 4-4 4" strokeWidth="2" />
    </svg>
  ),
  perpendicularMark: className => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <line x1="4" y1="20" x2="20" y2="20" />
      <line x1="8" y1="4" x2="8" y2="20" />
      <rect x="8" y="14" width="6" height="6" fill="currentColor" fillOpacity="0.2" strokeWidth="1.5" />
    </svg>
  ),
  measureTicks: className => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <line x1="2" y1="12" x2="22" y2="12" strokeWidth="2" />
      <line x1="6" y1="8" x2="6" y2="12" />
      <line x1="10" y1="9" x2="10" y2="12" />
      <line x1="14" y1="8" x2="14" y2="12" />
      <line x1="18" y1="9" x2="18" y2="12" />
    </svg>
  ),
  dimensionLine: className => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <line x1="4" y1="12" x2="20" y2="12" />
      <path d="M7 9l-4 3 4 3M17 9l4 3-4 3" strokeWidth="1.5" />
      <line x1="3" y1="5" x2="3" y2="19" strokeWidth="1.2" />
      <line x1="21" y1="5" x2="21" y2="19" strokeWidth="1.2" />
    </svg>
  ),
  measurement: className => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="4" y="6" width="16" height="12" rx="2" />
      <path d="M7 10h10M7 14h6" strokeWidth="1.5" />
    </svg>
  ),
  halfPlane: className => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <line x1="3" y1="18" x2="21" y2="6" strokeWidth="2" />
      <polygon points="3,18 21,6 21,18" fill="currentColor" fillOpacity="0.2" stroke="none" />
    </svg>
  ),
  areaDecomposition: className => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="9" cy="12" r="6" fill="currentColor" fillOpacity="0.15" />
      <circle cx="15" cy="12" r="6" fill="currentColor" fillOpacity="0.15" />
    </svg>
  ),
  grid: className => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <line x1="9" y1="3" x2="9" y2="21" />
      <line x1="15" y1="3" x2="15" y2="21" />
      <line x1="3" y1="9" x2="21" y2="9" />
      <line x1="3" y1="15" x2="21" y2="15" />
    </svg>
  ),
  functionCurve: className => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M3 17C7 17 8 7 12 7C16 7 17 17 21 17" />
    </svg>
  ),
  poincareGeodesic: className => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="12" cy="12" r="9" strokeDasharray="2 2" />
      <path d="M6 17A9 9 0 0117 6" strokeWidth="2" />
    </svg>
  ),
  text: className => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M5 6h14M12 6v13M9 19h6" />
    </svg>
  ),
  formula: className => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <text x="3" y="17" fontSize="13" fontWeight="bold" fontFamily="serif" fill="currentColor" stroke="none">f(x)</text>
    </svg>
  ),
  infoPanel: className => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="3" y="4" width="18" height="16" rx="3" fill="currentColor" fillOpacity="0.1" />
      <line x1="7" y1="9" x2="17" y2="9" strokeWidth="2" />
      <line x1="7" y1="13" x2="14" y2="13" />
      <line x1="7" y1="17" x2="11" y2="17" />
    </svg>
  ),
  add_step: className => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="4" y="4" width="16" height="16" rx="2" />
      <path d="M12 8v8M8 12h8" strokeWidth="2" />
    </svg>
  ),
  guided: className => <IconSparkles className={className} />,
};

// Alias de herramientas que comparten el mismo dibujo que otra ya definida.
const TOOL_DRAWING_ALIASES: Record<string, string> = {
  nonReflexAngle: 'angle',
  areaIntersection: 'areaDecomposition',
  parametricCurve: 'functionCurve',
  poincareArc: 'poincareGeodesic',
  label: 'text',
};

const DEFAULT_TOOL_DRAWING: ToolDrawingRenderer = className => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="4" fill="currentColor" />
  </svg>
);

/**
 * Dibujos vectoriales interactivos para cada herramienta matemática en la barra
 */
export const ToolDrawingIcon: React.FC<{ tool: CanvasTool | 'add_slider' | 'add_step' | 'guided' | 'add_glider' | string; className?: string }> = ({ tool, className = "w-4 h-4" }) => {
  const resolvedKey = TOOL_DRAWING_ALIASES[tool] ?? tool;
  const renderer = TOOL_DRAWINGS[resolvedKey] ?? DEFAULT_TOOL_DRAWING;
  return renderer(className);
};
