import { MathBoard } from '@/shared/diagrams/core/MathBoard';
import {
  createPoint,
  createPolygon,
  createSlider,
} from '@/shared/diagrams/core/MathFactory';

export const DemoPitagorasAreas = () => {
  const onInit = (board: any, els: any, theme: any) => {
    const a = 3;
    const b = 4;
    const side = a + b;

    const pE1 = createPoint(board, [0, 0], { visible: false, target: false }, theme);
    const pE2 = createPoint(board, [side, 0], { visible: false, target: false }, theme);
    const pE3 = createPoint(board, [side, side], { visible: false, target: false }, theme);
    const pE4 = createPoint(board, [0, side], { visible: false, target: false }, theme);
    const outerSquare = createPolygon(board, [pE1, pE2, pE3, pE4], {
      fillOpacity: 0,
      borders: { strokeColor: theme.carbon, strokeWidth: 2 },
      vertices: { visible: false },
    }, theme);

    const slider = createSlider(board, [[1, -1], [6, -1]], [0, 0, 1], {
      name: 't',
      snapWidth: 0.01,
      fillColor: theme.terracota,
      strokeColor: theme.terracota,
      label: { strokeColor: theme.carbon, fontSize: 16 },
    }, theme);

    const movingTriangle = (
      id: string,
      color: string,
      p1Fn: () => [number, number],
      p2Fn: () => [number, number],
      p3Fn: () => [number, number],
    ) => {
      const p1 = createPoint(board, [() => p1Fn()[0], () => p1Fn()[1]], { visible: false, target: false, name: `${id}-a` }, theme);
      const p2 = createPoint(board, [() => p2Fn()[0], () => p2Fn()[1]], { visible: false, target: false, name: `${id}-b` }, theme);
      const p3 = createPoint(board, [() => p3Fn()[0], () => p3Fn()[1]], { visible: false, target: false, name: `${id}-c` }, theme);
      return createPolygon(board, [p1, p2, p3], {
        fillColor: color,
        fillOpacity: 0.3,
        borders: { strokeColor: color, strokeWidth: 2 },
        vertices: { visible: false },
      }, theme);
    };

    const t1 = movingTriangle('triangulo-1', theme.salvia, () => [0, 0], () => [a, 0], () => [0, b]);
    const t2 = movingTriangle(
      'triangulo-2',
      theme.salvia,
      () => [side, b * slider.Value()],
      () => [side, a + b * slider.Value()],
      () => [a, b * slider.Value()],
    );
    const t3 = movingTriangle(
      'triangulo-3',
      theme.salvia,
      () => [side - b * slider.Value(), side - a * slider.Value()],
      () => [b - b * slider.Value(), side - a * slider.Value()],
      () => [side - b * slider.Value(), a - a * slider.Value()],
    );
    const t4 = movingTriangle(
      'triangulo-4',
      theme.salvia,
      () => [a * slider.Value(), side],
      () => [a * slider.Value(), b],
      () => [b + a * slider.Value(), side],
    );

    const c1 = createPoint(board, [a, 0], { visible: false, target: false }, theme);
    const c2 = createPoint(board, [side, a], { visible: false, target: false }, theme);
    const c3 = createPoint(board, [b, side], { visible: false, target: false }, theme);
    const c4 = createPoint(board, [0, b], { visible: false, target: false }, theme);
    const emptyC = createPolygon(board, [c1, c2, c3, c4], {
      fillColor: theme.pizarra,
      fillOpacity: () => 0.5 * (1 - slider.Value()),
      borders: { strokeWidth: 0 },
      vertices: { visible: false },
    }, theme);

    const a1 = createPoint(board, [0, b], { visible: false, target: false }, theme);
    const a2 = createPoint(board, [a, b], { visible: false, target: false }, theme);
    const a3 = createPoint(board, [a, side], { visible: false, target: false }, theme);
    const a4 = createPoint(board, [0, side], { visible: false, target: false }, theme);
    const emptyA = createPolygon(board, [a1, a2, a3, a4], {
      fillColor: theme.terracota,
      fillOpacity: () => 0.5 * slider.Value(),
      borders: { strokeWidth: 0 },
      vertices: { visible: false },
    }, theme);

    const b1 = createPoint(board, [a, 0], { visible: false, target: false }, theme);
    const b2 = createPoint(board, [side, 0], { visible: false, target: false }, theme);
    const b3 = createPoint(board, [side, b], { visible: false, target: false }, theme);
    const b4 = createPoint(board, [a, b], { visible: false, target: false }, theme);
    const emptyB = createPolygon(board, [b1, b2, b3, b4], {
      fillColor: theme.terracota,
      fillOpacity: () => 0.5 * slider.Value(),
      borders: { strokeWidth: 0 },
      vertices: { visible: false },
    }, theme);

    Object.assign(els, { slider, t1, t2, t3, t4, outerSquare, emptyC, emptyA, emptyB });
  };

  const onUpdate = (_board: any, els: any, theme: any, _isStep: any, isHL: any) => {
    [els.t1, els.t2, els.t3, els.t4].forEach((triangle: any) => {
      triangle.setAttribute({ fillOpacity: 0.3 });
      triangle.borders.forEach((border: any) => border.setAttribute({ strokeWidth: 2 }));
    });
    els.outerSquare.borders.forEach((border: any) => border.setAttribute({ strokeWidth: 2 }));
    els.emptyC.setAttribute({ fillOpacity: () => 0.5 * (1 - els.slider.Value()) });
    els.emptyA.setAttribute({ fillOpacity: () => 0.5 * els.slider.Value() });
    els.emptyB.setAttribute({ fillOpacity: () => 0.5 * els.slider.Value() });

    if (isHL('triangulos')) {
      [els.t1, els.t2, els.t3, els.t4].forEach((triangle: any) => {
        triangle.setAttribute({ fillOpacity: 0.6 });
        triangle.borders.forEach((border: any) => border.setAttribute({ strokeWidth: 4 }));
      });
    }
    if (isHL('cuadrado-exterior')) els.outerSquare.borders.forEach((border: any) => border.setAttribute({ strokeWidth: 5 }));
    if (isHL('area-c')) els.emptyC.setAttribute({ fillOpacity: () => 0.8 * (1 - els.slider.Value()) });
    if (isHL('area-a')) els.emptyA.setAttribute({ fillOpacity: () => 0.8 * els.slider.Value() });
    if (isHL('area-b')) els.emptyB.setAttribute({ fillOpacity: () => 0.8 * els.slider.Value() });

    if (isHL('segmento-a')) {
      [els.t1, els.t2, els.t3, els.t4].forEach((triangle: any) => {
        triangle.borders[0].setAttribute({ strokeColor: theme.terracota, strokeWidth: 5 });
      });
    }
    if (isHL('segmento-b')) {
      [els.t1, els.t2, els.t3, els.t4].forEach((triangle: any) => {
        triangle.borders[2].setAttribute({ strokeColor: theme.salvia, strokeWidth: 5 });
      });
    }
    if (isHL('segmento-c')) {
      [els.t1, els.t2, els.t3, els.t4].forEach((triangle: any) => {
        triangle.borders[1].setAttribute({ strokeColor: theme.pizarra, strokeWidth: 5 });
      });
    }
  };

  return (
    <MathBoard
      boundingbox={[-1, 9, 8, -1.5]}
      className="relative min-h-[500px] w-full overflow-hidden"
      onInit={onInit}
      onUpdate={onUpdate}
    />
  );
};
