import { MathBoard } from '@/shared/diagrams/core/MathBoard';
import {
  createGlider,
  createLine,
  createPoint,
  createPolygon,
  createRightAngleMarker,
  createSegment,
} from '@/shared/diagrams/core/MathFactory';

export const DemoPitagorasEuclides = () => {
  const onInit = (board: any, els: any, theme: any) => {
    const axisX = createLine(board, [
      createPoint(board, [0, 0], { visible: false, target: false }, theme),
      createPoint(board, [1, 0], { visible: false, target: false }, theme),
    ], { visible: false, target: false }, theme);
    const axisY = createLine(board, [
      createPoint(board, [0, 0], { visible: false, target: false }, theme),
      createPoint(board, [0, 1], { visible: false, target: false }, theme),
    ], { visible: false, target: false }, theme);

    const C = createPoint(board, [0, 0], {
      name: 'C',
      fixed: true,
      size: 4,
      fillColor: theme.carbon,
      strokeColor: theme.carbon,
    }, theme);
    const A = createGlider(board, [0, 4, axisY], {
      name: 'A',
      size: 5,
      fillColor: theme.carbon,
      strokeColor: theme.carbon,
    }, theme);
    const B = createGlider(board, [5, 0, axisX], {
      name: 'B',
      size: 5,
      fillColor: theme.carbon,
      strokeColor: theme.carbon,
    }, theme);

    A.on('drag', () => {
      if (A.Y() < 1) A.moveTo([0, 1], 0);
    });
    B.on('drag', () => {
      if (B.X() < 1) B.moveTo([1, 0], 0);
    });

    const polyABC = createPolygon(board, [C, B, A], {
      fillOpacity: 0.1,
      borders: { strokeWidth: 3 },
      vertices: { visible: false },
    }, theme);
    polyABC.borders[0].setAttribute({
      strokeColor: theme.terracota,
      name: 'a',
      withLabel: true,
      label: { strokeColor: theme.terracota, fontSize: 18, cssClass: 'font-serif italic', offset: [10, -15] },
    });
    polyABC.borders[1].setAttribute({
      strokeColor: theme.pizarra,
      name: 'c',
      withLabel: true,
      label: { strokeColor: theme.pizarra, fontSize: 18, cssClass: 'font-serif italic', offset: [15, 15] },
    });
    polyABC.borders[2].setAttribute({
      strokeColor: theme.salvia,
      name: 'b',
      withLabel: true,
      label: { strokeColor: theme.salvia, fontSize: 18, cssClass: 'font-serif italic', offset: [-20, 10] },
    });
    const rightAngle = createRightAngleMarker(board, [B, C, A], {}, theme);

    const K = createPoint(board, [() => -A.Y(), () => A.Y()], {
      name: 'K',
      visible: false,
      size: 3,
      fillColor: theme.carbon,
      strokeColor: theme.carbon,
    }, theme);
    const H = createPoint(board, [() => -A.Y(), 0], { name: 'H', visible: false, target: false }, theme);
    const sqB = createPolygon(board, [C, A, K, H], {
      fillColor: theme.salvia,
      fillOpacity: 0.2,
      borders: { strokeColor: theme.salvia, strokeWidth: 2 },
      vertices: { visible: false },
    }, theme);

    const F = createPoint(board, [() => B.X(), () => -B.X()], {
      name: 'F',
      visible: false,
      size: 3,
      fillColor: theme.carbon,
      strokeColor: theme.carbon,
    }, theme);
    const G = createPoint(board, [0, () => -B.X()], { name: 'G', visible: false, target: false }, theme);
    const sqA = createPolygon(board, [C, B, F, G], {
      fillColor: theme.terracota,
      fillOpacity: 0.2,
      borders: { strokeColor: theme.terracota, strokeWidth: 2 },
      vertices: { visible: false },
    }, theme);

    const E = createPoint(board, [() => B.X() + A.Y(), () => B.X()], {
      name: 'E',
      visible: false,
      size: 3,
      fillColor: theme.carbon,
      strokeColor: theme.carbon,
    }, theme);
    const D = createPoint(board, [() => A.Y(), () => A.Y() + B.X()], {
      name: 'D',
      visible: false,
      size: 3,
      fillColor: theme.carbon,
      strokeColor: theme.carbon,
    }, theme);
    const sqC = createPolygon(board, [A, B, E, D], {
      fillColor: theme.pizarra,
      fillOpacity: 0.2,
      borders: { strokeColor: theme.pizarra, strokeWidth: 2 },
      vertices: { visible: false },
    }, theme);

    const lineAB = createLine(board, [A, B], { visible: false, target: false }, theme);
    const altC = board.create('perpendicular', [lineAB, C], { visible: false });
    const lineDE = createLine(board, [D, E], { visible: false, target: false }, theme);
    const L = board.create('intersection', [altC, lineAB, 0], { name: 'L', visible: false });
    const M = board.create('intersection', [altC, lineDE, 0], { name: 'M', visible: false });
    const altSegment = createSegment(board, [C, M], {
      strokeColor: theme.carbon,
      strokeWidth: 2,
      dash: 2,
    }, theme);

    const rectADML = createPolygon(board, [A, D, M, L], {
      fillColor: theme.salvia,
      fillOpacity: 0,
      borders: { strokeColor: theme.salvia, strokeWidth: 2, visible: false },
      vertices: { visible: false },
    }, theme);
    const rectBEML = createPolygon(board, [B, E, M, L], {
      fillColor: theme.terracota,
      fillOpacity: 0,
      borders: { strokeColor: theme.terracota, strokeWidth: 2, visible: false },
      vertices: { visible: false },
    }, theme);

    const lineCD = createSegment(board, [C, D], { strokeColor: theme.carbon, strokeWidth: 2, dash: 1, visible: false }, theme);
    const lineKB = createSegment(board, [K, B], { strokeColor: theme.carbon, strokeWidth: 2, dash: 1, visible: false }, theme);
    const lineCE = createSegment(board, [C, E], { strokeColor: theme.carbon, strokeWidth: 2, dash: 1, visible: false }, theme);
    const lineAF = createSegment(board, [A, F], { strokeColor: theme.carbon, strokeWidth: 2, dash: 1, visible: false }, theme);

    const triACD = createPolygon(board, [A, C, D], {
      fillColor: theme.salvia,
      fillOpacity: 0,
      borders: { strokeWidth: 0 },
      vertices: { visible: false },
    }, theme);
    const triAKB = createPolygon(board, [A, K, B], {
      fillColor: theme.salvia,
      fillOpacity: 0,
      borders: { strokeWidth: 0 },
      vertices: { visible: false },
    }, theme);
    const triBCE = createPolygon(board, [B, C, E], {
      fillColor: theme.terracota,
      fillOpacity: 0,
      borders: { strokeWidth: 0 },
      vertices: { visible: false },
    }, theme);
    const triABF = createPolygon(board, [A, B, F], {
      fillColor: theme.terracota,
      fillOpacity: 0,
      borders: { strokeWidth: 0 },
      vertices: { visible: false },
    }, theme);

    Object.assign(els, {
      axisX,
      axisY,
      A,
      B,
      C,
      D,
      E,
      F,
      G,
      H,
      K,
      L,
      M,
      polyABC,
      rightAngle,
      sqA,
      sqB,
      sqC,
      lineAB,
      lineDE,
      altC,
      altSegment,
      rectADML,
      rectBEML,
      lineCD,
      lineKB,
      lineCE,
      lineAF,
      triACD,
      triAKB,
      triBCE,
      triABF,
    });
  };

  const onUpdate = (_board: any, els: any, _theme: any, isStep: any, isHL: any) => {
    els.polyABC.setAttribute({ fillOpacity: 0.1 });
    els.polyABC.borders.forEach((border: any) => border.setAttribute({ strokeWidth: 3 }));
    els.sqA.setAttribute({ fillOpacity: 0, borders: { strokeWidth: 1, strokeOpacity: 0.2 } });
    els.sqB.setAttribute({ fillOpacity: 0, borders: { strokeWidth: 1, strokeOpacity: 0.2 } });
    els.sqC.setAttribute({ fillOpacity: 0, borders: { strokeWidth: 1, strokeOpacity: 0.2 } });
    els.altSegment.setAttribute({ visible: false, strokeWidth: 2 });

    [els.rectADML, els.rectBEML].forEach((rect: any) => {
      rect.setAttribute({ fillOpacity: 0 });
      rect.borders.forEach((border: any) => border.setAttribute({ visible: false, strokeWidth: 2 }));
    });
    [els.lineCD, els.lineKB, els.lineCE, els.lineAF].forEach((line: any) => line.setAttribute({ visible: false, strokeWidth: 2 }));
    [els.triACD, els.triAKB, els.triBCE, els.triABF].forEach((triangle: any) => triangle.setAttribute({ fillOpacity: 0 }));
    [els.D, els.K, els.E, els.F].forEach((point: any) => point.setAttribute({ visible: false }));

    if (isStep('triangulo')) els.polyABC.setAttribute({ fillOpacity: 0.2 });

    const showSquares = ['cuadrados', 'altura', 'triangulos-izq', 'areas-izq', 'triangulos-der', 'areas-der', 'cuadrados-final'].some(isStep);
    if (showSquares) {
      els.sqA.setAttribute({ fillOpacity: 0.1, borders: { strokeWidth: 2, strokeOpacity: 1 } });
      els.sqB.setAttribute({ fillOpacity: 0.1, borders: { strokeWidth: 2, strokeOpacity: 1 } });
      els.sqC.setAttribute({ fillOpacity: 0.1, borders: { strokeWidth: 2, strokeOpacity: 1 } });
    }
    if (isStep('cuadrados')) {
      els.sqA.setAttribute({ fillOpacity: 0.2 });
      els.sqB.setAttribute({ fillOpacity: 0.2 });
      els.sqC.setAttribute({ fillOpacity: 0.2 });
    }
    if (['altura', 'triangulos-izq', 'areas-izq', 'triangulos-der', 'areas-der', 'cuadrados-final'].some(isStep)) {
      els.altSegment.setAttribute({ visible: true });
    }
    if (isStep('altura')) {
      els.rectADML.borders.forEach((border: any) => border.setAttribute({ visible: true }));
      els.rectBEML.borders.forEach((border: any) => border.setAttribute({ visible: true }));
      els.sqC.setAttribute({ fillOpacity: 0 });
    }
    if (isStep('triangulos-izq')) {
      els.lineCD.setAttribute({ visible: true });
      els.lineKB.setAttribute({ visible: true });
      els.triACD.setAttribute({ fillOpacity: 0.3 });
      els.triAKB.setAttribute({ fillOpacity: 0.3 });
      els.sqB.setAttribute({ fillOpacity: 0.2 });
      els.sqC.setAttribute({ fillOpacity: 0.2 });
      els.D.setAttribute({ visible: true });
      els.K.setAttribute({ visible: true });
    }
    if (isStep('areas-izq')) {
      els.sqB.setAttribute({ fillOpacity: 0.4 });
      els.rectADML.setAttribute({ fillOpacity: 0.4 });
      els.rectADML.borders.forEach((border: any) => border.setAttribute({ visible: true, strokeWidth: 2 }));
    }
    if (isStep('triangulos-der')) {
      els.lineCE.setAttribute({ visible: true });
      els.lineAF.setAttribute({ visible: true });
      els.triBCE.setAttribute({ fillOpacity: 0.3 });
      els.triABF.setAttribute({ fillOpacity: 0.3 });
      els.sqA.setAttribute({ fillOpacity: 0.2 });
      els.sqC.setAttribute({ fillOpacity: 0.2 });
      els.E.setAttribute({ visible: true });
      els.F.setAttribute({ visible: true });
    }
    if (isStep('areas-der')) {
      els.sqA.setAttribute({ fillOpacity: 0.4 });
      els.rectBEML.setAttribute({ fillOpacity: 0.4 });
      els.rectBEML.borders.forEach((border: any) => border.setAttribute({ visible: true, strokeWidth: 2 }));
    }
    if (isStep('cuadrados-final')) {
      els.sqA.setAttribute({ fillOpacity: 0.5 });
      els.sqB.setAttribute({ fillOpacity: 0.5 });
      els.rectADML.setAttribute({ fillOpacity: 0.5 });
      els.rectBEML.setAttribute({ fillOpacity: 0.5 });
      els.rectADML.borders.forEach((border: any) => border.setAttribute({ visible: true, strokeWidth: 3 }));
      els.rectBEML.borders.forEach((border: any) => border.setAttribute({ visible: true, strokeWidth: 3 }));
      els.sqC.setAttribute({ fillOpacity: 0 });
    }

    if (isHL('triangulo-base')) {
      els.polyABC.setAttribute({ fillOpacity: 0.5 });
      els.polyABC.borders.forEach((border: any) => border.setAttribute({ strokeWidth: 6 }));
    }
    if (isHL('cateto-a')) els.polyABC.borders[0].setAttribute({ strokeWidth: 6 });
    if (isHL('cateto-b')) els.polyABC.borders[2].setAttribute({ strokeWidth: 6 });
    if (isHL('hipotenusa-c')) els.polyABC.borders[1].setAttribute({ strokeWidth: 6 });
    if (isHL('cuadrado-a')) els.sqA.setAttribute({ fillOpacity: 0.5, borders: { strokeWidth: 4 } });
    if (isHL('cuadrado-b')) els.sqB.setAttribute({ fillOpacity: 0.5, borders: { strokeWidth: 4 } });
    if (isHL('cuadrado-c')) els.sqC.setAttribute({ fillOpacity: 0.5, borders: { strokeWidth: 4 } });
    if (isHL('recta-altura')) els.altSegment.setAttribute({ visible: true, strokeWidth: 5 });
    if (isHL('rectangulos-hipotenusa')) {
      els.rectADML.borders.forEach((border: any) => border.setAttribute({ visible: true, strokeWidth: 4 }));
      els.rectBEML.borders.forEach((border: any) => border.setAttribute({ visible: true, strokeWidth: 4 }));
    }
    if (isHL('triangulo-acd')) {
      els.triACD.setAttribute({ fillOpacity: 0.7 });
      els.lineCD.setAttribute({ visible: true, strokeWidth: 4 });
      els.D.setAttribute({ visible: true });
    }
    if (isHL('triangulo-akb')) {
      els.triAKB.setAttribute({ fillOpacity: 0.7 });
      els.lineKB.setAttribute({ visible: true, strokeWidth: 4 });
      els.K.setAttribute({ visible: true });
    }
    if (isHL('rectangulo-izq')) {
      els.rectADML.setAttribute({ fillOpacity: 0.7 });
      els.rectADML.borders.forEach((border: any) => border.setAttribute({ visible: true, strokeWidth: 5 }));
    }
    if (isHL('triangulo-bce')) {
      els.triBCE.setAttribute({ fillOpacity: 0.7 });
      els.lineCE.setAttribute({ visible: true, strokeWidth: 4 });
      els.E.setAttribute({ visible: true });
    }
    if (isHL('triangulo-abf')) {
      els.triABF.setAttribute({ fillOpacity: 0.7 });
      els.lineAF.setAttribute({ visible: true, strokeWidth: 4 });
      els.F.setAttribute({ visible: true });
    }
    if (isHL('rectangulo-der')) {
      els.rectBEML.setAttribute({ fillOpacity: 0.7 });
      els.rectBEML.borders.forEach((border: any) => border.setAttribute({ visible: true, strokeWidth: 5 }));
    }
  };

  return (
    <MathBoard
      boundingbox={[-8, 12, 13, -8]}
      className="relative min-h-[560px] w-full overflow-hidden"
      onInit={onInit}
      onUpdate={onUpdate}
    />
  );
};
