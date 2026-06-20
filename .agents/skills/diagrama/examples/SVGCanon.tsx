import React, { useState } from 'react';
import { useMathStore } from '../../../store/MathStoreContext';

export const SVGCanon: React.FC = () => {
    const [offset, setOffset] = useState(0);
    const highlight = useMathStore(state => state.variables['highlight']);

    const isActive = (id: string) =>
        Array.isArray(highlight)
            ? (highlight as string[]).includes(id)
            : highlight === id;

    const W = 400, H = 400;
    const cx = W / 2, cy = H / 2;
    const r = 80 + offset;

    return (
        <div className="w-full h-full min-h-[400px] flex items-center justify-center">
            <svg
                viewBox={`0 0 ${W} ${H}`}
                className="w-full max-w-[400px] h-auto touch-none"
                role="img"
                aria-label="Diagrama SVG canónico: circunferencia con centro y radio ajustable."
            >
                {/* Grid sutil */}
                {[100, 200, 300].map(p => (
                    <React.Fragment key={p}>
                        <line x1={p} y1={0} x2={p} y2={H} stroke="var(--theme-carbon)" strokeWidth="0.5" opacity="0.1" />
                        <line x1={0} y1={p} x2={W} y2={p} stroke="var(--theme-carbon)" strokeWidth="0.5" opacity="0.1" />
                    </React.Fragment>
                ))}

                {/* Ejes */}
                <line x1={0} y1={cy} x2={W} y2={cy} stroke="var(--theme-carbon)" strokeWidth="1" opacity="0.3" />
                <line x1={cx} y1={0} x2={cx} y2={H} stroke="var(--theme-carbon)" strokeWidth="1" opacity="0.3" />

                {/* Circunferencia */}
                <circle
                    cx={cx}
                    cy={cy}
                    r={r}
                    fill="var(--theme-terracota)"
                    fillOpacity={isActive('circunferencia') ? 0.3 : 0.15}
                    stroke="var(--theme-terracota)"
                    strokeWidth={isActive('circunferencia') ? 5 : 2}
                    style={{ transition: 'all 0.3s ease' }}
                />

                {/* Centro */}
                <circle
                    cx={cx}
                    cy={cy}
                    r={isActive('centro') ? 8 : 5}
                    fill="var(--theme-carbon)"
                    style={{ transition: 'all 0.3s ease' }}
                />
                <text
                    x={cx + 10}
                    y={cy - 10}
                    fill="var(--theme-carbon)"
                    className="font-serif font-bold italic"
                    fontSize="18"
                >
                    O
                </text>

                {/* Radio */}
                <line
                    x1={cx}
                    y1={cy}
                    x2={cx + r}
                    y2={cy}
                    stroke="var(--theme-pizarra)"
                    strokeWidth={isActive('radio') ? 5 : 2}
                    strokeDasharray="6 3"
                    style={{ transition: 'all 0.3s ease' }}
                />
                <text
                    x={cx + r / 2}
                    y={cy - 10}
                    fill="var(--theme-pizarra)"
                    className="font-serif italic"
                    fontSize="16"
                >
                    r
                </text>

                {/* Punto en la circunferencia */}
                <circle
                    cx={cx + r}
                    cy={cy}
                    r={isActive('punto-p') ? 8 : 5}
                    fill="var(--theme-terracota)"
                    style={{ transition: 'all 0.3s ease' }}
                />
                <text
                    x={cx + r + 10}
                    y={cy + 5}
                    fill="var(--theme-terracota)"
                    className="font-serif font-bold italic"
                    fontSize="18"
                >
                    P
                </text>
            </svg>
        </div>
    );
};
