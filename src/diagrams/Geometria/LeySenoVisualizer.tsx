import { useRef, useEffect, useState } from 'react';
import JXG from 'jsxgraph';
import { useMathStore } from '../../store/MathStoreContext';

const C = '#333333', S = '#A2C2A2', T = '#C86446', P = '#5D7080', O = '#c49b4f';
const LABEL = { fontSize: 22, cssClass: 'font-serif font-bold italic' };
const R = 4.5, cx = 0, cy = 0;

function dist(ax: number, ay: number, bx: number, by: number) {
    return Math.sqrt((ax - bx) ** 2 + (ay - by) ** 2);
}
function angleBetween(ax: number, ay: number, bx: number, by: number) {
    const a = Math.atan2(ay - cy, ax - cx);
    const b = Math.atan2(by - cy, bx - cx);
    let d = Math.abs(a - b);
    if (d > Math.PI) d = 2 * Math.PI - d;
    return d;
}

export const LeySenoVisualizer = () => {
    const boardRef = useRef<HTMLDivElement>(null);
    const E = useRef<Record<string, unknown>>({});
    const highlight = useMathStore(s => s.variables['highlight']);
    const [barVisible, setBarVisible] = useState(false);
    const [ratios, setRatios] = useState({ a: '—', b: '—', c: '—', d: '—' });

    useEffect(() => {
        if (!boardRef.current) return;
        const board = JXG.JSXGraph.initBoard(boardRef.current, {
            boundingbox: [-6.5, 6.5, 6.5, -6.5],
            axis: false, showNavigation: false, showCopyright: false, keepaspectratio: true
        });

        const center = board.create('point', [cx, cy], { fixed: true, visible: false });
        const circ = board.create('circle', [center, R], { strokeColor: P, strokeWidth: 2, dash: 2 });

        const ang = { A: 1.2, B: -0.4, C: -2.8 };
        const gA = board.create('glider', [cx + R * Math.cos(ang.A), cy + R * Math.sin(ang.A), circ],
            { name: 'A', size: 4, strokeColor: T, fillColor: T });
        const gB = board.create('glider', [cx + R * Math.cos(ang.B), cy + R * Math.sin(ang.B), circ],
            { name: 'B', size: 4, strokeColor: T, fillColor: T });
        const gC = board.create('glider', [cx + R * Math.cos(ang.C), cy + R * Math.sin(ang.C), circ],
            { name: 'C', size: 4, strokeColor: T, fillColor: T });

        const sideA = board.create('segment', [gB, gC], {
            strokeColor: T, strokeWidth: 3,
            label: { ...LABEL, strokeColor: T, offset: [10, -15] }
        });
        const sideB = board.create('segment', [gC, gA], {
            strokeColor: T, strokeWidth: 3,
            label: { ...LABEL, strokeColor: T, offset: [-25, 5] }
        });
        const sideC = board.create('segment', [gA, gB], {
            strokeColor: S, strokeWidth: 3,
            label: { ...LABEL, strokeColor: S, offset: [10, 15] }
        });

        const dP = board.create('point', [
            () => 2 * center.X() - gB.X(), () => 2 * center.Y() - gB.Y()
        ], { name: 'D', size: 3, strokeColor: C, fillColor: C, fixed: true });

        const diam = board.create('segment', [gB, dP], {
            strokeColor: C, strokeWidth: 2, dash: 1,
            label: { fontSize: 16, strokeColor: C, offset: [15, 25] }
        });

        const segDC = board.create('segment', [dP, gC], { strokeColor: C, strokeWidth: 2, strokeOpacity: 0.5 });
        const segDA = board.create('segment', [dP, gA], { strokeColor: C, strokeWidth: 2, strokeOpacity: 0.5 });

        const rightAng = board.create('angle', [gB, gC, dP], {
            radius: 0.4, fillColor: P, fillOpacity: 0.3, strokeColor: P, strokeWidth: 2
        });
        const angA = board.create('angle', [gC, gA, gB], {
            radius: 0.6, fillColor: P, fillOpacity: 0.15, strokeColor: P,
            label: { fontSize: 16, cssClass: 'font-serif italic', strokeColor: P, offset: [15, 5] }
        });
        const angB_elem = board.create('angle', [gA, gB, gC], {
            radius: 0.6, fillColor: P, fillOpacity: 0.15, strokeColor: P,
            label: { fontSize: 16, cssClass: 'font-serif italic', strokeColor: P, offset: [-20, 10] }
        });
        const angC_elem = board.create('angle', [gB, gC, gA], {
            radius: 0.6, fillColor: P, fillOpacity: 0.15, strokeColor: P,
            label: { fontSize: 16, cssClass: 'font-serif italic', strokeColor: P, offset: [15, -15] }
        });
        const angAlt = board.create('angle', [gB, dP, gC], {
            radius: 0.6, fillColor: S, fillOpacity: 0.15, strokeColor: S,
            label: { fontSize: 16, cssClass: 'font-serif italic', strokeColor: S, offset: [-25, -10] }
        });

        board.create('text', [
            () => (center.X() + gB.X()) / 2 + 0.3,
            () => (center.Y() + gB.Y()) / 2 + 0.3,
            'R'
        ], { fontSize: 16, cssClass: 'font-serif italic', strokeColor: P });

        board.create('text', [cx - 0.25, cy - 0.35, 'O'], {
            fontSize: 14, cssClass: 'font-serif italic', strokeColor: C
        });

        const onDrag = () => {
            const a = dist(gB.X(), gB.Y(), gC.X(), gC.Y());
            const b = dist(gC.X(), gC.Y(), gA.X(), gA.Y());
            const c = dist(gA.X(), gA.Y(), gB.X(), gB.Y());
            const aAB = angleBetween(gA.X(), gA.Y(), gB.X(), gB.Y());
            const aBC = angleBetween(gB.X(), gB.Y(), gC.X(), gC.Y());
            const aCA = angleBetween(gC.X(), gC.Y(), gA.X(), gA.Y());
            const sinA = Math.sin(aBC), sinB = Math.sin(aCA), sinC = Math.sin(aAB);
            setRatios({
                a: sinA > 0.01 ? (a / sinA).toFixed(3) : '—',
                b: sinB > 0.01 ? (b / sinB).toFixed(3) : '—',
                c: sinC > 0.01 ? (c / sinC).toFixed(3) : '—',
                d: (2 * R).toFixed(3)
            });
        };
        gA.on('drag', onDrag);
        gB.on('drag', onDrag);
        gC.on('drag', onDrag);

        E.current = {
            board, circ, center, gA, gB, gC, dP,
            sideA, sideB, sideC, diam, segDC, segDA,
            rightAng, angA, angB: angB_elem, angC: angC_elem, angAlt
        };

        return () => { JXG.JSXGraph.freeBoard(board); E.current = {}; };
    }, []);

    useEffect(() => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const b = E.current as Record<string, any>;
        if (!b.board) return;

        const { sideA, sideB, sideC, gA, gB, gC, dP, diam, segDC, segDA, rightAng, angA, angB, angC, angAlt, circ } = b;

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const vis = (el: any, show: boolean) => { if (el) el.setAttribute({ visible: show }); };
        const reset = () => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            [sideA, sideB, sideC].forEach((s: any) => s?.setAttribute({ strokeWidth: 3, strokeOpacity: 1 }));
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            [gA, gB, gC].forEach((p: any) => p?.setAttribute({ size: 4, strokeColor: T, fillColor: T }));
            dP?.setAttribute({ size: 3, strokeColor: C, fillColor: C });
            diam?.setAttribute({ strokeWidth: 2, strokeOpacity: 1 });
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            [segDC, segDA].forEach((s: any) => s?.setAttribute({ strokeWidth: 2, strokeOpacity: 0.5 }));
            rightAng?.setAttribute({ fillOpacity: 0.3, strokeWidth: 2 });
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            [angA, angB, angC, angAlt].forEach((a: any) => a?.setAttribute({ fillOpacity: 0.15, strokeWidth: 1 }));
            vis(segDA, true); vis(segDC, true);
            vis(rightAng, true); vis(angA, true); vis(angB, true); vis(angC, true); vis(angAlt, true);
        };

        const hideAllAngles = () => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            [rightAng, angA, angB, angC, angAlt].forEach((a: any) => a?.setAttribute({ fillOpacity: 0 }));
        };

        const h = highlight as string;
        const isStep = h?.startsWith('step');

        setBarVisible(h === 'step4' || !isStep || !h);

        if (h === 'step1') {
            reset(); hideAllAngles();
            diam?.setAttribute({ strokeWidth: 4, strokeOpacity: 1 });
            vis(segDA, false); vis(segDC, false); vis(angC, true);
        } else if (h === 'step2') {
            reset(); hideAllAngles();
            sideA?.setAttribute({ strokeWidth: 6, strokeOpacity: 1 });
            diam?.setAttribute({ strokeWidth: 4, strokeOpacity: 1 });
            rightAng?.setAttribute({ fillOpacity: 0.6, strokeWidth: 3 });
            vis(segDA, false);
        } else if (h === 'step3') {
            reset();
            sideA?.setAttribute({ strokeWidth: 5, strokeOpacity: 1 });
            diam?.setAttribute({ strokeWidth: 3, strokeOpacity: 1 });
            angA?.setAttribute({ fillOpacity: 0.5, strokeWidth: 2 });
            angAlt?.setAttribute({ fillOpacity: 0.5, strokeWidth: 2 });
            vis(rightAng, false); vis(angB, false); vis(angC, false);
            vis(segDA, false);
        } else if (h === 'step4') {
            reset();
            vis(segDA, true); vis(segDC, true);
        } else if (!isStep && h) {
            reset();
            if (h === 'diametro') {
                diam?.setAttribute({ strokeWidth: 5, strokeOpacity: 1 });
            } else if (h === 'ladoA') {
                sideA?.setAttribute({ strokeWidth: 7, strokeOpacity: 1 });
            } else if (h === 'ladoB') {
                sideB?.setAttribute({ strokeWidth: 7, strokeOpacity: 1 });
            } else if (h === 'ladoC') {
                sideC?.setAttribute({ strokeWidth: 7, strokeOpacity: 1 });
            } else if (h === 'ladoDC') {
                segDC?.setAttribute({ strokeWidth: 6, strokeOpacity: 1 });
            } else if (h === 'ladoDA') {
                segDA?.setAttribute({ strokeWidth: 6, strokeOpacity: 1 });
            } else if (h === 'anguloA') {
                angA?.setAttribute({ fillOpacity: 0.5, strokeWidth: 2 });
            } else if (h === 'anguloB') {
                angB?.setAttribute({ fillOpacity: 0.5, strokeWidth: 2 });
            } else if (h === 'anguloC') {
                angC?.setAttribute({ fillOpacity: 0.5, strokeWidth: 2 });
            } else if (h === 'anguloD') {
                angAlt?.setAttribute({ fillOpacity: 0.5, strokeWidth: 2 });
            } else if (h === 'recto') {
                rightAng?.setAttribute({ fillOpacity: 0.6, strokeWidth: 3 });
            } else if (h === 'verticeA') {
                gA?.setAttribute({ size: 8, strokeColor: O });
            } else if (h === 'verticeB') {
                gB?.setAttribute({ size: 8, strokeColor: O });
            } else if (h === 'verticeC') {
                gC?.setAttribute({ size: 8, strokeColor: O });
            } else if (h === 'verticeD') {
                dP?.setAttribute({ size: 8, strokeColor: O });
            } else if (h === 'circunferencia') {
                circ?.setAttribute({ strokeWidth: 4, strokeOpacity: 1, dash: 0 });
            }
        } else {
            reset();
        }

        b.board.update();
    }, [highlight]);

    const { a, b, c, d } = ratios;

    return (
        <div className="w-full h-full min-h-[500px] relative overflow-hidden bg-lienzo">
            <div ref={boardRef} className="w-full h-full" />
            <div id="ley-seno-ratios"
                className={`absolute bottom-2 left-2 right-2 z-10 transition-opacity duration-300 ${barVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
            >
                {barVisible && (
                    <div className="bg-white/85 p-2 rounded text-sm font-mono text-carbon shadow-sm border border-carbon/10 flex flex-wrap justify-center gap-x-6 gap-y-1">
                        <span><span className="font-bold" style={{ color: T }}>a/sin(α)</span> = {a}</span>
                        <span><span className="font-bold" style={{ color: T }}>b/sin(β)</span> = {b}</span>
                        <span><span className="font-bold" style={{ color: S }}>c/sin(γ)</span> = {c}</span>
                        <span><span className="font-bold" style={{ color: C }}>2R</span> = {d}</span>
                    </div>
                )}
            </div>
        </div>
    );
};
