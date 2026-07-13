import { MathBoard } from '@/shared/diagrams/core/MathBoard';
import {
  createCircle,
  createGlider,
  createPoint,
  createText,
} from '@/shared/diagrams/core/MathFactory';

export const ModeloPoincare = () => {
  const onInit = (board: any, els: any, theme: any) => {
    const O = createPoint(board, [0, 0], {
      visible: false,
      fixed: true,
      target: false,
    }, theme);
    const unitCircle = createCircle(board, [O, 1], {
      strokeColor: theme.carbon,
      strokeWidth: 2.5,
      fillColor: theme.pavo,
      fillOpacity: 0.04,
      fixed: true,
    }, theme);

    const L1 = createGlider(board, [0.866, 0.5, unitCircle], {
      name: '',
      size: 5,
      fillColor: theme.terracota,
      strokeColor: theme.terracota,
      showInfobox: false,
    }, theme);
    const L2 = createGlider(board, [-0.866, 0.5, unitCircle], {
      name: '',
      size: 5,
      fillColor: theme.terracota,
      strokeColor: theme.terracota,
      showInfobox: false,
    }, theme);
    const P = createPoint(board, [0.4, -0.25], {
      name: 'P',
      size: 6,
      fillColor: theme.terracota,
      strokeColor: theme.terracota,
      showInfobox: false,
    }, theme);
    P.on('drag', () => {
      if (P.Dist(O) <= 0.95) return;
      const angle = Math.atan2(P.Y(), P.X());
      P.moveTo([0.9 * Math.cos(angle), 0.9 * Math.sin(angle)], 0);
    });

    const calcOtherEndpoint = (bp: any, id: string) => createPoint(board, [
      () => {
        const p1 = P.X();
        const p2 = P.Y();
        const u1 = bp.X();
        const u2 = bp.Y();
        const det = u1 * p2 - u2 * p1;
        if (Math.abs(det) < 1e-10) return -bp.X();
        const s = (p1 * p1 + p2 * p2 + 1) / 2;
        const cx = (p2 - u2 * s) / det;
        const cy = (u1 * s - p1) / det;
        const phi = Math.atan2(cy, cx);
        const uAng = Math.atan2(u2, u1);
        return Math.cos(2 * phi - uAng);
      },
      () => {
        const p1 = P.X();
        const p2 = P.Y();
        const u1 = bp.X();
        const u2 = bp.Y();
        const det = u1 * p2 - u2 * p1;
        if (Math.abs(det) < 1e-10) return -bp.Y();
        const s = (p1 * p1 + p2 * p2 + 1) / 2;
        const cx = (p2 - u2 * s) / det;
        const cy = (u1 * s - p1) / det;
        const phi = Math.atan2(cy, cx);
        const uAng = Math.atan2(u2, u1);
        return Math.sin(2 * phi - uAng);
      },
    ], {
      visible: false,
      target: false,
      name: id,
    }, theme);

    const createHyperbolicLine = (pA: any, pB: any, color: string, width: number, dash = 0) => board.create('curve', [
      (t: number) => {
        const ax = pA.X();
        const ay = pA.Y();
        const bx = pB.X();
        const by = pB.Y();
        const det = ax * by - ay * bx;
        if (Math.abs(det) < 1e-4) return ax + t * (bx - ax);
        const cx = (by - ay) / det;
        const cy = (ax - bx) / det;
        const radius = Math.sqrt(Math.max(0, cx * cx + cy * cy - 1));
        let angleA = Math.atan2(ay - cy, ax - cx);
        let angleB = Math.atan2(by - cy, bx - cx);
        if ((ax - cx) * (by - cy) - (ay - cy) * (bx - cx) > 0) {
          if (angleB < angleA) angleB += 2 * Math.PI;
        } else if (angleA < angleB) {
          angleA += 2 * Math.PI;
        }
        return cx + radius * Math.cos(angleA + t * (angleB - angleA));
      },
      (t: number) => {
        const ax = pA.X();
        const ay = pA.Y();
        const bx = pB.X();
        const by = pB.Y();
        const det = ax * by - ay * bx;
        if (Math.abs(det) < 1e-4) return ay + t * (by - ay);
        const cx = (by - ay) / det;
        const cy = (ax - bx) / det;
        const radius = Math.sqrt(Math.max(0, cx * cx + cy * cy - 1));
        let angleA = Math.atan2(ay - cy, ax - cx);
        let angleB = Math.atan2(by - cy, bx - cx);
        if ((ax - cx) * (by - cy) - (ay - cy) * (bx - cx) > 0) {
          if (angleB < angleA) angleB += 2 * Math.PI;
        } else if (angleA < angleB) {
          angleA += 2 * Math.PI;
        }
        return cy + radius * Math.sin(angleA + t * (angleB - angleA));
      },
      0,
      1,
    ], {
      strokeColor: color,
      strokeWidth: width,
      dash,
    });

    const lineL = createHyperbolicLine(L1, L2, theme.terracota, 3);
    const E1 = calcOtherEndpoint(L1, 'E1');
    const E2 = calcOtherEndpoint(L2, 'E2');
    const limit1 = createHyperbolicLine(L1, E1, theme.ocre, 2.5, 2);
    const limit2 = createHyperbolicLine(L2, E2, theme.ocre, 2.5, 2);

    const getUltraAngle = (i: number) => {
      const pts = [
        { type: 'L', angle: Math.atan2(L1.Y(), L1.X()) },
        { type: 'L', angle: Math.atan2(L2.Y(), L2.X()) },
        { type: 'E', angle: Math.atan2(E1.Y(), E1.X()) },
        { type: 'E', angle: Math.atan2(E2.Y(), E2.X()) },
      ];
      pts.forEach((point) => {
        if (point.angle < 0) point.angle += 2 * Math.PI;
      });
      pts.sort((a, b) => a.angle - b.angle);

      let startAngle = 0;
      let span = 0;
      for (let index = 0; index < 4; index++) {
        const pointA = pts[index];
        const pointB = pts[(index + 1) % 4];
        if (pointA.type === pointB.type) continue;
        startAngle = pointA.angle;
        let endAngle = pointB.angle;
        if (endAngle < startAngle) endAngle += 2 * Math.PI;
        span = endAngle - startAngle;
        break;
      }
      return startAngle + (span * i) / 5;
    };

    const ultras: any[] = [];
    for (let i = 1; i <= 4; i++) {
      const endpoint = createPoint(board, [
        () => Math.cos(getUltraAngle(i)),
        () => Math.sin(getUltraAngle(i)),
      ], {
        visible: false,
        target: false,
        name: `U${i}`,
      }, theme);
      const opposite = calcOtherEndpoint(endpoint, `V${i}`);
      ultras.push(createHyperbolicLine(endpoint, opposite, theme.salvia, 2, 2));
    }

    const info = createText(board, [-1.0, 1.0, () => {
      const angle1 = Math.round((Math.atan2(L1.Y(), L1.X()) * 180) / Math.PI);
      const angle2 = Math.round((Math.atan2(L2.Y(), L2.X()) * 180) / Math.PI);
      return `<div style="font-family: var(--font-serif); color:${theme.carbon}; font-size:12px;">
        l: ${angle1}° – ${angle2}° &nbsp;|P|=${P.Dist(O).toFixed(2)}
      </div>`;
    }], {
      fixed: true,
      anchorX: 'left',
      anchorY: 'bottom',
    }, theme);

    Object.assign(els, {
      O,
      unitCircle,
      L1,
      L2,
      P,
      E1,
      E2,
      lineL,
      limit1,
      limit2,
      info,
      ultras,
    });
  };

  return (
    <MathBoard
      boundingbox={[-1.1, 1.1, 1.1, -1.1]}
      className="relative min-h-[420px] w-full overflow-hidden"
      onInit={onInit}
    >
      <div className="absolute top-2 left-3 z-10 text-xs font-serif italic text-pizarra/50">
        Disco de Poincar&eacute; &middot; Arrastra L&#8321;, L&#8322; y P
      </div>
      <div className="absolute bottom-3 right-4 z-10 flex flex-col gap-1.5 text-xs font-sans text-carbon/80 bg-lienzo/95 p-3 rounded-md shadow-sm border border-pizarra/20 backdrop-blur-md pointer-events-none">
        <h4 className="font-bold text-[10px] uppercase tracking-widest text-carbon/60 mb-0.5">Leyenda</h4>
        <div className="flex items-center gap-2"><div className="w-4 h-[2px] rounded-full bg-terracota" /> Recta principal (l)</div>
        <div className="flex items-center gap-2"><div className="w-4 h-[2px] border-t-2 border-dashed border-ocre" /> Paralelas l&iacute;mite</div>
        <div className="flex items-center gap-2"><div className="w-4 h-[2px] border-t-2 border-dashed border-salvia" /> Ultraparalelas</div>
      </div>
    </MathBoard>
  );
};
