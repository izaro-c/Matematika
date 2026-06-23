import { useRef, useEffect } from 'react';
import JXG from 'jsxgraph';
import { useMathStore } from '@/app/providers/MathStoreContext';

function getCSSVar(name: string): string {
  if (typeof document !== 'undefined') {
    return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  }
  return '#000';
}

function collinearXY(x1: number, y1: number, x2: number, y2: number, x3: number, y3: number, tol = 0.01): boolean {
  const area = (x2 - x1) * (y3 - y1) - (x3 - x1) * (y2 - y1);
  return Math.abs(area) < tol;
}

function segmentsIntersect(p1: any, p2: any, q1: any, q2: any): boolean {
  const d1 = (q1.X() - p1.X()) * (q2.Y() - p1.Y()) - (q1.Y() - p1.Y()) * (q2.X() - p1.X());
  const d2 = (q1.X() - p2.X()) * (q2.Y() - p2.Y()) - (q1.Y() - p2.Y()) * (q2.X() - p2.X());
  const d3 = (p1.X() - q1.X()) * (p2.Y() - q1.Y()) - (p1.Y() - q1.Y()) * (p2.X() - q1.X());
  const d4 = (p1.X() - q2.X()) * (p2.Y() - q2.Y()) - (p1.Y() - q2.Y()) * (p2.X() - q2.X());
  return ((d1 > 0 && d2 < 0) || (d1 < 0 && d2 > 0)) && ((d3 > 0 && d4 < 0) || (d3 < 0 && d4 > 0));
}

const RIGHT_ANGLE_TOL = 0.1;
const SIDE_EQ_TOL = 0.15;
const PARALLEL_TOL = 0.06;
const SNAP = 0.5;

function isRightAngle(v: number): boolean {
  return Math.abs(v - Math.PI / 2) < RIGHT_ANGLE_TOL;
}

function isApproxEq(a: number, b: number): boolean {
  return Math.abs(a - b) < SIDE_EQ_TOL;
}

function nudgeOffLineFn(pt: any, others: any[], snap: number): boolean {
  const dirs = [[snap,0],[-snap,0],[0,snap],[0,-snap],[snap,snap],[-snap,snap],[snap,-snap],[-snap,-snap]];
  for (const [dx, dy] of dirs) {
    const nx = pt.X() + dx, ny = pt.Y() + dy;
    let ok = true;
    for (let i = 0; i < others.length && ok; i++)
      for (let j = i + 1; j < others.length && ok; j++)
        if (collinearXY(nx, ny, others[i].X(), others[i].Y(), others[j].X(), others[j].Y())) ok = false;
    if (ok) { pt.moveTo([nx, ny], 0); return true; }
  }
  return false;
}

function areParallelFn(p1: any, p2: any, q1: any, q2: any): boolean {
  const dx1 = p2.X() - p1.X(), dy1 = p2.Y() - p1.Y();
  const dx2 = q2.X() - q1.X(), dy2 = q2.Y() - q1.Y();
  const cross = Math.abs(dx1 * dy2 - dy1 * dx2);
  const len1 = Math.hypot(dx1, dy1) || 1;
  const len2 = Math.hypot(dx2, dy2) || 1;
  return cross / (len1 * len2) < PARALLEL_TOL;
}

function isInsideSegment(ax: number, bx: number, x: number): boolean {
  return x > Math.min(ax, bx) + 0.01 && x < Math.max(ax, bx) - 0.01;
}

function diagsCrossInside(A: any, B: any, C: any, D: any, diagX: number, diagY: number): boolean {
  return isInsideSegment(A.X(), C.X(), diagX) && isInsideSegment(A.Y(), C.Y(), diagY) &&
         isInsideSegment(B.X(), D.X(), diagX) && isInsideSegment(B.Y(), D.Y(), diagY);
}

type ClassificationResult = {
  clase: string;
  props: string;
  rightVisible: [boolean, boolean, boolean, boolean];
  angleVisible: [boolean, boolean];
  cong1Keys: string[];
  cong2Keys: string[];
  par1Keys: string[];
  par2Keys: string[];
  diagAcc: boolean;
};

function applyCuadrado(result: ClassificationResult) {
  result.clase = "Cuadrado";
  result.props = "4 lados \u2261 \u00b7 4 \u2220 rectos \u00b7 2 pares \u2225 \u00b7 diags \u22a5 y \u2261";
  result.rightVisible = [true, true, true, true];
  result.cong1Keys = ['AB', 'BC', 'CD', 'DA'];
  result.par1Keys = ['AB', 'CD']; result.par2Keys = ['BC', 'DA'];
  result.diagAcc = true;
}

function applyRectangulo(result: ClassificationResult, eqAB_CD: boolean, eqBC_DA: boolean, eqDiags: boolean, dAB: number, dBC: number) {
  result.clase = "Rect\u00e1ngulo";
  result.props = "4 \u2220 rectos \u00b7 2 pares \u2225 \u00b7 diags \u2261";
  result.rightVisible = [true, true, true, true];
  if (eqAB_CD && eqBC_DA && !isApproxEq(dAB, dBC)) {
    result.cong1Keys = ['AB', 'CD']; result.cong2Keys = ['BC', 'DA'];
  } else if (eqAB_CD) { result.cong1Keys.push('AB', 'CD'); }
  if (eqBC_DA) { result.cong1Keys.push('BC', 'DA'); }
  result.par1Keys = ['AB', 'CD']; result.par2Keys = ['BC', 'DA'];
  if (eqDiags) { result.diagAcc = true; }
}

function applyRombo(result: ClassificationResult) {
  result.clase = "Rombo";
  result.props = "4 lados \u2261 \u00b7 2 pares \u2225 \u00b7 diags \u22a5";
  result.cong1Keys = ['AB', 'BC', 'CD', 'DA'];
  result.par1Keys = ['AB', 'CD']; result.par2Keys = ['BC', 'DA'];
}

function applyParalelogramo(result: ClassificationResult, eqAB_CD: boolean, eqBC_DA: boolean, dAB: number, dBC: number) {
  result.clase = "Paralelogramo";
  result.props = "2 pares \u2225 \u00b7 lados opuestos \u2261 \u00b7 \u2220 opuestos \u2261";
  if (eqAB_CD && eqBC_DA && !isApproxEq(dAB, dBC)) {
    result.cong1Keys = ['AB', 'CD']; result.cong2Keys = ['BC', 'DA'];
  } else if (eqAB_CD) { result.cong1Keys.push('AB', 'CD'); }
  if (eqBC_DA) { result.cong1Keys.push('BC', 'DA'); }
  result.par1Keys = ['AB', 'CD']; result.par2Keys = ['BC', 'DA'];
  result.angleVisible = [true, true];
}

function applyTrapecio(result: ClassificationResult, parAB_CD: boolean, parBC_DA: boolean) {
  result.clase = "Trapecio";
  result.props = "1 par \u2225";
  if (parAB_CD) result.par1Keys = ['AB', 'CD'];
  if (parBC_DA) result.par2Keys = ['BC', 'DA'];
}

function applyCometa(result: ClassificationResult, eqDA_AB: boolean, eqBC_CD: boolean, eqAB_BC: boolean, eqCD_DA: boolean, dDA: number, dBC: number, dAB: number, dCD: number) {
  result.clase = "Cometa";
  result.props = "2 pares lados consecutivos \u2261 \u00b7 diags \u22a5";
  if (eqDA_AB && eqBC_CD) {
    if (isApproxEq(dDA, dBC)) result.cong1Keys = ['AB', 'DA', 'BC', 'CD'];
    else { result.cong1Keys = ['AB', 'DA']; result.cong2Keys = ['BC', 'CD']; }
  }
  if (eqAB_BC && eqCD_DA) {
    if (isApproxEq(dAB, dCD)) result.cong1Keys = ['AB', 'BC', 'CD', 'DA'];
    else { result.cong1Keys.push('AB', 'BC'); result.cong2Keys = ['CD', 'DA']; }
  }
}

function classifyQuadrilateral(params: {
  allSidesEq: boolean, allRight: boolean,
  rtA: boolean, rtB: boolean, rtC: boolean, rtD: boolean,
  eqAB_CD: boolean, eqBC_DA: boolean, eqDiags: boolean,
  parBoth: boolean, parAB_CD: boolean, parBC_DA: boolean,
  eqDA_AB: boolean, eqBC_CD: boolean, eqAB_BC: boolean, eqCD_DA: boolean,
  dAB: number, dBC: number, dDA: number, dCD: number,
}): ClassificationResult {
  const { allSidesEq, allRight, rtA, rtB, rtC, rtD, eqAB_CD, eqBC_DA, eqDiags,
          parBoth, parAB_CD, parBC_DA, eqDA_AB, eqBC_CD, eqAB_BC, eqCD_DA,
          dAB, dBC, dDA, dCD } = params;

  const result: ClassificationResult = {
    clase: "Trapezoide", props: "",
    rightVisible: [rtA, rtB, rtC, rtD],
    angleVisible: [false, false],
    cong1Keys: [], cong2Keys: [], par1Keys: [], par2Keys: [],
    diagAcc: false,
  };

  if (allSidesEq && allRight) {
    applyCuadrado(result);
  } else if (allRight) {
    applyRectangulo(result, eqAB_CD, eqBC_DA, eqDiags, dAB, dBC);
  } else if (allSidesEq) {
    applyRombo(result);
  } else if (parBoth) {
    applyParalelogramo(result, eqAB_CD, eqBC_DA, dAB, dBC);
  } else if (parAB_CD || parBC_DA) {
    applyTrapecio(result, parAB_CD, parBC_DA);
  } else if ((eqDA_AB && eqBC_CD) || (eqAB_BC && eqCD_DA)) {
    applyCometa(result, eqDA_AB, eqBC_CD, eqAB_BC, eqCD_DA, dDA, dBC, dAB, dCD);
  }

  return result;
}

function resetVisuals(deps: {
  sides: Record<string, any>, cong1s: Record<string, any>, cong2s: Record<string, any[]>,
  rightA: any, rightB: any, rightC: any, rightD: any,
  angleA: any, angleB: any, angleC: any, angleD: any,
  diagAC: any, diagBD: any,
  C_PRIM: string, C_DIAG: string,
}) {
  const { sides, cong1s, cong2s, rightA, rightB, rightC, rightD,
          angleA, angleB, angleC, angleD, diagAC, diagBD, C_PRIM, C_DIAG } = deps;
  sides.AB.setAttribute({ strokeColor: C_PRIM, strokeWidth: 2.5, dash: 0 });
  sides.BC.setAttribute({ strokeColor: C_PRIM, strokeWidth: 2.5, dash: 0 });
  sides.CD.setAttribute({ strokeColor: C_PRIM, strokeWidth: 2.5, dash: 0 });
  sides.DA.setAttribute({ strokeColor: C_PRIM, strokeWidth: 2.5, dash: 0 });
  for (const k of ['AB', 'BC', 'CD', 'DA']) {
    cong1s[k].setAttribute({ visible: false });
    cong2s[k].forEach((s: any) => s.setAttribute({ visible: false }));
  }
  rightA.setAttribute({ visible: false }); rightB.setAttribute({ visible: false });
  rightC.setAttribute({ visible: false }); rightD.setAttribute({ visible: false });
  angleA.setAttribute({ visible: false }); angleB.setAttribute({ visible: false });
  angleC.setAttribute({ visible: false }); angleD.setAttribute({ visible: false });
  diagAC.setAttribute({ dash: 3, strokeColor: C_DIAG, strokeWidth: 1.2 });
  diagBD.setAttribute({ dash: 3, strokeColor: C_DIAG, strokeWidth: 1.2 });
}

function applyClassificationVisuals(
  result: ClassificationResult,
  deps: {
    rightA: any, rightB: any, rightC: any, rightD: any,
    angleA: any, angleC: any,
    cong1s: Record<string, any>, cong2s: Record<string, any[]>,
    sides: Record<string, any>,
    diagAC: any, diagBD: any,
    C_ACC: string, C_ACC2: string,
  }
) {
  const { rightA, rightB, rightC, rightD, angleA, angleC,
          cong1s, cong2s, sides, diagAC, diagBD, C_ACC, C_ACC2 } = deps;
  const { rightVisible, angleVisible, cong1Keys, cong2Keys, par1Keys, par2Keys, diagAcc } = result;

  rightA.setAttribute({ visible: rightVisible[0] }); rightB.setAttribute({ visible: rightVisible[1] });
  rightC.setAttribute({ visible: rightVisible[2] }); rightD.setAttribute({ visible: rightVisible[3] });

  angleA.setAttribute({ visible: angleVisible[0] }); angleC.setAttribute({ visible: angleVisible[1] });

  cong1Keys.forEach(k => cong1s[k].setAttribute({ visible: true }));
  cong2Keys.forEach(k => cong2s[k].forEach((s: any) => s.setAttribute({ visible: true })));
  par1Keys.forEach(k => sides[k].setAttribute({ strokeColor: C_ACC, strokeWidth: 3 }));
  par2Keys.forEach(k => sides[k].setAttribute({ strokeColor: C_ACC2, strokeWidth: 3 }));

  if (diagAcc) {
    diagAC.setAttribute({ strokeColor: C_ACC, dash: 0 });
    diagBD.setAttribute({ strokeColor: C_ACC, dash: 0 });
  }
}

function buildInfoHtml(clase: string, cvxTag: string, props: string, isSimple: boolean): string {
  return `<div style="font-family: var(--font-serif); color: ${getCSSVar('--theme-carbon')}; line-height:1.4;">
    <strong style="font-size: 1.25rem; color:${clase==='Trapezoide' ? getCSSVar('--theme-carbon') : getCSSVar('--theme-terracota')};">${clase}</strong><br/>
    <i style="font-size: 0.85rem;">${cvxTag}</i><br/>
    <small style="color:${getCSSVar('--theme-pizarra')};">${props}</small><br/>
    <small>&sum; &aacute;ng. = ${isSimple ? "360\u00b0" : "N/A"}</small>
  </div>`;
}

function computeCvxTag(isSimple: boolean, diagsCross: boolean): string {
  if (!isSimple) return "";
  if (diagsCross) return "convexo";
  return "c\u00f3ncavo";
}

function buildOthersList(vertices: any[], excludeIdx: number): any[] {
  const others: any[] = [];
  for (let k = 0; k < vertices.length; k++) {
    if (k !== excludeIdx) others.push(vertices[k]);
  }
  return others;
}

export const Cuadrilatero = () => {
  const boardRef = useRef<HTMLDivElement>(null);
  const elementsRef = useRef<Record<string, unknown>>({});

  const highlight = useMathStore((state) => state.variables['highlight']);
  const isHighlight = (id: string) => Array.isArray(highlight) ? (highlight as unknown as string[]).includes(id) : highlight === id;

  useEffect(() => {
    if (!boardRef.current) return;

    if (!boardRef.current.id) boardRef.current.id = "jxgbox_" + Math.random().toString(36).substring(2, 9);
    const board = JXG.JSXGraph.initBoard(boardRef.current.id, {
      boundingbox: [-6, 6, 6, -5],
      axis: false,
      showCopyright: false,
      keepaspectratio: true,
      grid: false,
    });

    const C_PRIM  = getCSSVar('--theme-carbon');
    const C_ACC   = getCSSVar('--theme-terracota');
    const C_ACC2  = getCSSVar('--theme-pavo');
    const C_ANG   = getCSSVar('--theme-salvia');
    const C_POL   = getCSSVar('--theme-pavo');
    const C_RIGHT = getCSSVar('--theme-ocre');
    const C_DIAG  = getCSSVar('--theme-pizarra');

    const A = board.create('point', [-2.5, -2], { name: 'A', size: 5, fillColor: C_PRIM, strokeColor: C_PRIM, showInfobox: false, snapToGrid: true, snapSizeX: SNAP, snapSizeY: SNAP });
    const B = board.create('point', [2.5, -2],  { name: 'B', size: 5, fillColor: C_PRIM, strokeColor: C_PRIM, showInfobox: false, snapToGrid: true, snapSizeX: SNAP, snapSizeY: SNAP });
    const C = board.create('point', [2, 3],     { name: 'C', size: 5, fillColor: C_PRIM, strokeColor: C_PRIM, showInfobox: false, snapToGrid: true, snapSizeX: SNAP, snapSizeY: SNAP });
    const D = board.create('point', [-2, 2.5],  { name: 'D', size: 5, fillColor: C_PRIM, strokeColor: C_PRIM, showInfobox: false, snapToGrid: true, snapSizeX: SNAP, snapSizeY: SNAP });

    const poly = board.create('polygon', [A, B, C, D], {
      fillColor: C_POL, fillOpacity: 0.08,
      borders: { strokeWidth: 2.5, strokeColor: C_PRIM },
      vertices: { visible: false }
    });

    const diagAC = board.create('segment', [A, C], { strokeColor: C_DIAG, strokeWidth: 1.2, dash: 3, fixed: true });
    const diagBD = board.create('segment', [B, D], { strokeColor: C_DIAG, strokeWidth: 1.2, dash: 3, fixed: true });

    const angleA = board.create('angle', [B, A, D], { name: '&alpha;', radius: 0.85, fillColor: C_ANG, strokeColor: C_ANG, fillOpacity: 0.22, type: 'sector', visible: false }) as any;
    const angleB = board.create('angle', [C, B, A], { name: '&beta;',  radius: 0.85, fillColor: C_ANG, strokeColor: C_ANG, fillOpacity: 0.22, type: 'sector', visible: false }) as any;
    const angleC = board.create('angle', [D, C, B], { name: '&gamma;', radius: 0.85, fillColor: C_ANG, strokeColor: C_ANG, fillOpacity: 0.22, type: 'sector', visible: false }) as any;
    const angleD = board.create('angle', [A, D, C], { name: '&delta;', radius: 0.85, fillColor: C_ANG, strokeColor: C_ANG, fillOpacity: 0.22, type: 'sector', visible: false }) as any;

    const rightA = board.create('angle', [B, A, D], { radius: 0.55, type: 'sector', orthotype: 'square', fillColor: C_RIGHT, strokeColor: C_RIGHT, fillOpacity: 0.4, visible: false }) as any;
    const rightB = board.create('angle', [C, B, A], { radius: 0.55, type: 'sector', orthotype: 'square', fillColor: C_RIGHT, strokeColor: C_RIGHT, fillOpacity: 0.4, visible: false }) as any;
    const rightC = board.create('angle', [D, C, B], { radius: 0.55, type: 'sector', orthotype: 'square', fillColor: C_RIGHT, strokeColor: C_RIGHT, fillOpacity: 0.4, visible: false }) as any;
    const rightD = board.create('angle', [A, D, C], { radius: 0.55, type: 'sector', orthotype: 'square', fillColor: C_RIGHT, strokeColor: C_RIGHT, fillOpacity: 0.4, visible: false }) as any;

    board.update();

    const sides: Record<string, any> = {
      AB: (poly as any).borders[0],
      BC: (poly as any).borders[1],
      CD: (poly as any).borders[2],
      DA: (poly as any).borders[3]
    };

    const mkTick = (p: any, q: any, centerOffset = 0) => {
      const mA = board.create('point', [() => (p.X() + q.X()) / 2, () => (p.Y() + q.Y()) / 2], { visible: false });
      const dNorm = () => { const dx = q.X()-p.X(), dy = q.Y()-p.Y(); const len = Math.hypot(dx, dy) || 1; return { dx: dx/len, dy: dy/len }; };
      const cx = () => { const dn = dNorm(); return mA.X() + dn.dx * centerOffset; };
      const cy = () => { const dn = dNorm(); return mA.Y() + dn.dy * centerOffset; };
      const t0 = board.create('point', [
        () => { const dn = dNorm(); return cx() + dn.dy * 0.3; },
        () => { const dn = dNorm(); return cy() - dn.dx * 0.3; }
      ], { visible: false });
      const t1 = board.create('point', [
        () => { const dn = dNorm(); return cx() - dn.dy * 0.3; },
        () => { const dn = dNorm(); return cy() + dn.dx * 0.3; }
      ], { visible: false });
      return board.create('segment', [t0, t1], { strokeColor: C_PRIM, strokeWidth: 2.4, visible: false }) as any;
    };

    const cong1s: Record<string, any> = {};
    const cong2s: Record<string, any[]> = {};
    for (const [k, [p, q]] of Object.entries({ AB: [A, B], BC: [B, C], CD: [C, D], DA: [D, A] })) {
      cong1s[k] = mkTick(p, q);
      cong2s[k] = [mkTick(p, q, -0.18), mkTick(p, q, 0.18)];
    }

    const lastValid: Record<string, [number, number]> = { A: [A.X(), A.Y()], B: [B.X(), B.Y()], C: [C.X(), C.Y()], D: [D.X(), D.Y()] };
    const vertices = [A, B, C, D] as any[];
    const vertexNames = ['A', 'B', 'C', 'D'] as const;

    const onVertexDrag = (p: any, idx: number) => {
      const name = vertexNames[idx];
      const others = buildOthersList(vertices, idx);
      let anyC = false;
      for (let i = 0; i < others.length; i++)
        for (let j = i + 1; j < others.length; j++)
          if (collinearXY(p.X(), p.Y(), others[i].X(), others[i].Y(), others[j].X(), others[j].Y())) anyC = true;
      if (anyC && !nudgeOffLineFn(p, others, SNAP)) {
        p.moveTo([lastValid[name][0], lastValid[name][1]], 0);
        return;
      }
      if (segmentsIntersect(A, B, C, D) || segmentsIntersect(B, C, D, A)) {
        p.moveTo([lastValid[name][0], lastValid[name][1]], 0);
      } else {
        lastValid[name][0] = p.X();
        lastValid[name][1] = p.Y();
      }
    };

    vertices.forEach((p, idx) => {
      p.on('drag', () => onVertexDrag(p, idx));
    });

    const diagIntersect = board.create('intersection', [
      board.create('line', [A, C], { visible: false }),
      board.create('line', [B, D], { visible: false }), 0
    ], { visible: false, size: 2 });

    const infoText = board.create('text', [
      -5.5, 5.5,
      () => {
        const vA = angleA.Value(), vB = angleB.Value(), vC = angleC.Value(), vD = angleD.Value();
        const dAB = A.Dist(B), dBC = B.Dist(C), dCD = C.Dist(D), dDA = D.Dist(A);
        const dAC = A.Dist(C), dBD = B.Dist(D);

        const rtA = isRightAngle(vA), rtB = isRightAngle(vB), rtC = isRightAngle(vC), rtD = isRightAngle(vD);
        const allRight = rtA && rtB && rtC && rtD;

        const eqAB_BC = isApproxEq(dAB, dBC), eqBC_CD = isApproxEq(dBC, dCD), eqCD_DA = isApproxEq(dCD, dDA), eqDA_AB = isApproxEq(dDA, dAB);
        const eqAB_CD  = isApproxEq(dAB, dCD), eqBC_DA  = isApproxEq(dBC, dDA);
        const allSidesEq = eqAB_BC && eqBC_CD && eqCD_DA;
        const eqDiags = isApproxEq(dAC, dBD);

        const parAB_CD = areParallelFn(A, B, C, D);
        const parBC_DA = areParallelFn(B, C, D, A);
        const parBoth = parAB_CD && parBC_DA;

        const diagX = diagIntersect.X(), diagY = diagIntersect.Y();
        const diagsCross = diagsCrossInside(A, B, C, D, diagX, diagY);

        resetVisuals({ sides, cong1s, cong2s, rightA, rightB, rightC, rightD, angleA, angleB, angleC, angleD, diagAC, diagBD, C_PRIM, C_DIAG });

        const classification = classifyQuadrilateral({
          allSidesEq, allRight, rtA, rtB, rtC, rtD,
          eqAB_CD, eqBC_DA, eqDiags,
          parBoth, parAB_CD, parBC_DA,
          eqDA_AB, eqBC_CD, eqAB_BC, eqCD_DA,
          dAB, dBC, dDA, dCD,
        });

        const { clase } = classification;
        applyClassificationVisuals(classification, {
          rightA, rightB, rightC, rightD,
          angleA, angleC,
          cong1s, cong2s, sides, diagAC, diagBD,
          C_ACC, C_ACC2,
        });

        if (rtA && clase !== "Cuadrado" && clase !== "Rect\u00e1ngulo") rightA.setAttribute({ visible: true });
        if (rtB && clase !== "Cuadrado" && clase !== "Rect\u00e1ngulo") rightB.setAttribute({ visible: true });
        if (rtC && clase !== "Cuadrado" && clase !== "Rect\u00e1ngulo") rightC.setAttribute({ visible: true });
        if (rtD && clase !== "Cuadrado" && clase !== "Rect\u00e1ngulo") rightD.setAttribute({ visible: true });

        const sumDeg = Math.round((vA + vB + vC + vD) * 180 / Math.PI);
        const isSimple = (sumDeg >= 358 && sumDeg <= 362);
        const cvxTag = computeCvxTag(isSimple, diagsCross);

        return buildInfoHtml(clase, cvxTag, classification.props, isSimple);
      }
    ], { fixed: true, anchorX: 'left', anchorY: 'top' });

    elementsRef.current = { A, B, C, D, poly, angleA, angleB, angleC, angleD, rightA, rightB, rightC, rightD, sides, cong1s, cong2s, diagAC, diagBD, infoText, board };

    board.update();
    (board.renderer as any).container.style.backgroundColor = getCSSVar('--theme-lienzo');

    const observer = new MutationObserver(() => {
      if (board) {
        (board.renderer as any).container.style.backgroundColor = getCSSVar('--theme-lienzo');
        board.update();
      }
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

    return () => {
      observer.disconnect();
      JXG.JSXGraph.freeBoard(board);
      elementsRef.current = {};
    };
  }, []);

  useEffect(() => {
    const { A, B, C, D, poly, angleA, angleB, angleC, angleD, board } = elementsRef.current as Record<string, any>;
    if (!board) return;

    const C_PRIM = getCSSVar('--theme-carbon');
    const C_ACC = getCSSVar('--theme-terracota');
    const C_ANG = getCSSVar('--theme-salvia');

    const isVertice = isHighlight('vertices') || isHighlight('vertice');
    const isLados = isHighlight('lados');
    const isAngulos = isHighlight('angulos');
    const isPoli = isHighlight('poligono');
    const showAll = !isVertice && !isLados && !isAngulos && !isPoli;

    [A, B, C, D].forEach((p: any) => p.setAttribute({
      strokeColor: isVertice ? C_ACC : C_PRIM,
      fillColor: isVertice ? C_ACC : C_PRIM,
      size: isVertice ? 7 : 5,
      strokeOpacity: isVertice || showAll ? 1 : 0.3,
      fillOpacity: isVertice || showAll ? 1 : 0.3
    }));

    ((poly as any).borders as any[]).forEach((b: any) => b.setAttribute({
      strokeOpacity: isLados || showAll ? 1 : 0.3,
      strokeWidth: isLados ? 5 : 2.5
    }));

    if (isAngulos || showAll) {
      [angleA, angleB, angleC, angleD].forEach((ang: any) => {
        if (ang) ang.setAttribute({
          fillColor: isAngulos ? C_ACC : C_ANG,
          strokeColor: isAngulos ? C_ACC : C_ANG,
          fillOpacity: isAngulos ? 0.45 : 0.22,
          strokeOpacity: 1,
          visible: true
        });
      });
    }

    poly.setAttribute({ fillOpacity: isPoli ? 0.22 : 0.08 });

    board.update();
  }, [highlight, isHighlight]);

  return (
    <div className="w-full h-full min-h-[350px] relative bg-lienzo/40 border border-pizarra/10 rounded-sm overflow-hidden">
      <div className="absolute top-2 right-3 z-10 text-xs font-serif italic text-pizarra/50">
        Arrastra los v&eacute;rtices para descubrir distintas clases
      </div>
      <div ref={boardRef} className="w-full h-full touch-none" />
    </div>
  );
};
