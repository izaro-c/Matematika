import { MathBoard } from '@/shared/diagrams/core/MathBoard';
import {
  createPoint,
  createPolygon,
  createSegment,
  createText,
} from '@/shared/diagrams/core/MathFactory';

export const DesigualdadTriangular = () => {
  const onInit = (board: any, els: any, theme: any) => {
    const pointOptions = {
      size: 5,
      fillColor: theme.carbon,
      strokeColor: theme.carbon,
      showInfobox: false,
      snapToGrid: true,
      snapSizeX: 0.5,
      snapSizeY: 0.5,
    };
    const A = createPoint(board, [-2.5, -2], { name: 'A', ...pointOptions }, theme);
    const B = createPoint(board, [2.5, -2], { name: 'B', ...pointOptions }, theme);
    const C = createPoint(board, [0, 2.5], { name: 'C', ...pointOptions }, theme);

    const segAB = createSegment(board, [A, B], { strokeColor: theme.carbon, strokeWidth: 2.5 }, theme);
    const segBC = createSegment(board, [B, C], { strokeColor: theme.carbon, strokeWidth: 2.5 }, theme);
    const segCA = createSegment(board, [C, A], { strokeColor: theme.carbon, strokeWidth: 2.5 }, theme);
    const poly = createPolygon(board, [A, B, C], {
      fillColor: theme.pavo,
      fillOpacity: 0.06,
      borders: { visible: false },
      vertices: { visible: false },
    }, theme);

    const mkLabel = (p: any, q: any, offX: number, offY: number) => createText(board, [
      () => (p.X() + q.X()) / 2 + offX,
      () => (p.Y() + q.Y()) / 2 + offY,
      () => p.Dist(q).toFixed(1),
    ], {
      fixed: true,
      fontSize: 15,
      cssClass: 'font-serif font-bold',
      color: theme.carbon,
      anchorX: 'middle',
      anchorY: 'middle',
    }, theme);

    const labAB = mkLabel(A, B, 0, -0.55);
    const labBC = mkLabel(B, C, 0.55, 0);
    const labCA = mkLabel(C, A, -0.55, 0);

    const orientation = () => (B.X() - A.X()) * (C.Y() - A.Y()) - (B.Y() - A.Y()) * (C.X() - A.X());
    const initialOrientation = orientation();
    const lastValid: Record<string, [number, number]> = { A: [A.X(), A.Y()], B: [B.X(), B.Y()], C: [C.X(), C.Y()] };
    [A, B, C].forEach((point: any, index: number) => {
      const name = String.fromCharCode(65 + index);
      point.on('drag', () => {
        const current = orientation();
        const changedSign = (initialOrientation > 0.01 && current < -0.01) || (initialOrientation < -0.01 && current > 0.01);
        if (Math.abs(current) < 0.01 || changedSign) {
          point.moveTo(lastValid[name], 0);
        } else {
          lastValid[name] = [point.X(), point.Y()];
        }
      });
    });

    const infoText = createText(board, [-4.5, 4.5, () => {
      const c = A.Dist(B);
      const a = B.Dist(C);
      const b = C.Dist(A);
      const ok1 = a + b > c + 0.001;
      const ok2 = a + c > b + 0.001;
      const ok3 = b + c > a + 0.001;
      const allOk = ok1 && ok2 && ok3;
      return `<div style="font-family: var(--font-serif); color:${theme.carbon}; font-size:13px; line-height:1.5;">
        <strong style="font-size: 1.15rem;">Desigualdad Triangular</strong><br/>
        <span style="color:${ok1 ? theme.musgo : theme.granada};">a + b = ${(a + b).toFixed(1)} ${ok1 ? '>' : '≤'} c = ${c.toFixed(1)}</span><br/>
        <span style="color:${ok2 ? theme.musgo : theme.granada};">a + c = ${(a + c).toFixed(1)} ${ok2 ? '>' : '≤'} b = ${b.toFixed(1)}</span><br/>
        <span style="color:${ok3 ? theme.musgo : theme.granada};">b + c = ${(b + c).toFixed(1)} ${ok3 ? '>' : '≤'} a = ${a.toFixed(1)}</span><br/>
        <strong style="color:${allOk ? theme.musgo : theme.granada};">${allOk ? 'Triángulo válido' : 'Triángulo degenerado'}</strong>
      </div>`;
    }], {
      fixed: true,
      anchorX: 'left',
      anchorY: 'top',
    }, theme);

    Object.assign(els, { A, B, C, poly, segAB, segBC, segCA, labAB, labBC, labCA, infoText });
  };

  const onUpdate = (_board: any, els: any, theme: any, _isStep: any, isHL: any) => {
    const hTri = isHL('triangulo');
    const hLados = isHL('lados');
    const hDesig = isHL('desigualdad');
    const hLadoA = isHL('lado-a');
    const hLadoB = isHL('lado-b');
    const hLadoC = isHL('lado-c');
    const anyH = hTri || hLados || hDesig || hLadoA || hLadoB || hLadoC;
    const showAll = !anyH;
    const muted = anyH ? 0.12 : 1;

    const sideStyle = (seg: any, lab: any, active: boolean) => {
      seg.setAttribute({
        strokeOpacity: showAll ? 1 : muted,
        strokeColor: active ? theme.terracota : theme.carbon,
        strokeWidth: active ? 4 : 2.5,
      });
      lab.setAttribute({ visible: showAll || active, color: active ? theme.terracota : theme.carbon });
    };

    sideStyle(els.segAB, els.labAB, hLadoC || hLados || hDesig);
    sideStyle(els.segBC, els.labBC, hLadoA || hLados || hDesig);
    sideStyle(els.segCA, els.labCA, hLadoB || hLados || hDesig);

    [els.A, els.B, els.C].forEach((point: any) => point.setAttribute({
      strokeOpacity: showAll ? 1 : muted,
      fillOpacity: showAll ? 1 : muted,
      size: hTri ? 7 : 5,
      fillColor: hTri ? theme.terracota : theme.carbon,
      strokeColor: hTri ? theme.terracota : theme.carbon,
    }));

    els.poly.setAttribute({ fillOpacity: hTri ? 0.18 : 0.06 });
  };

  return (
    <MathBoard boundingbox={[-5, 5, 5, -5]} onInit={onInit} onUpdate={onUpdate}>
      <div className="absolute top-2 left-3 z-10 text-xs font-serif italic text-pizarra/50">
        La suma de dos lados siempre supera al tercero
      </div>
    </MathBoard>
  );
};
