import type { DiagramSpecV3 } from '@/diagrams';
import { EjercicioClasificacionTriangulosSpec } from '@content/diagrams/Ejercicios/EjercicioClasificacionTriangulos';

/**
 * Mapa de especificaciones iniciales por ID de ejercicio/pregunta
 */
export const CANVAS_INITIAL_SPECS: Record<string, DiagramSpecV3> = {
  'ejercicio-clasificacion-triangulos': EjercicioClasificacionTriangulosSpec,
  'p3_q1': EjercicioClasificacionTriangulosSpec,
};

/**
 * Calcula los 3 ángulos internos (en grados) de un triángulo dados sus vértices.
 */
function getTriangleAngles(
  p1: [number, number],
  p2: [number, number],
  p3: [number, number]
): [number, number, number] {
  const side = (a: [number, number], b: [number, number]) =>
    Math.hypot(a[0] - b[0], a[1] - b[1]);

  const a = side(p2, p3);
  const b = side(p1, p3);
  const c = side(p1, p2);

  if (a < 1e-4 || b < 1e-4 || c < 1e-4) return [0, 0, 0];

  const cosA = Math.max(-1, Math.min(1, (b * b + c * c - a * a) / (2 * b * c)));
  const cosB = Math.max(-1, Math.min(1, (a * a + c * c - b * b) / (2 * a * c)));
  const cosC = Math.max(-1, Math.min(1, (a * a + b * b - c * c) / (2 * a * b)));

  const radToDeg = 180 / Math.PI;
  return [
    Math.acos(cosA) * radToDeg,
    Math.acos(cosB) * radToDeg,
    Math.acos(cosC) * radToDeg,
  ];
}

/**
 * Validador modular para el ejercicio de Clasificación de Triángulos.
 * Verifica rigurosamente las propiedades angulares de los 3 triángulos.
 */
export function validateClasificacionTriangulos(spec?: DiagramSpecV3): boolean {
  if (!spec) return false;
  const pointsMap = new Map(spec.objects.filter((o) => o.objectType === 'point').map((p) => [p.id, p]));
  const pR3 = pointsMap.get('pR3');
  const pA3 = pointsMap.get('pA3');
  const pO3 = pointsMap.get('pO3');

  const getCoord = (p: any): [number, number] => {
    if (p && p.definition && p.definition.type === 'coordinates') {
      return [p.definition.x, p.definition.y];
    }
    return [0, 0];
  };

  const [rX, rY] = getCoord(pR3);
  const [aX, aY] = getCoord(pA3);
  const [oX, oY] = getCoord(pO3);

  // 1. Triángulo Rectángulo (Base R1(0,0) - R2(4,0) con C1(rX, rY))
  const anglesR = getTriangleAngles([0, 0], [4, 0], [rX, rY]);
  const isRCorrect =
    Math.abs(rY) > 0.5 &&
    (anglesR.some((deg) => Math.abs(deg - 90) <= 7) ||
      Math.abs(rX - 0) < 0.5 ||
      Math.abs(rX - 4) < 0.5 ||
      Math.abs(Math.hypot(rX - 2, rY) - 2) < 0.4);

  // 2. Triángulo Acutángulo (Base A1(6,0) - A2(10,0) con C2(aX, aY))
  const anglesA = getTriangleAngles([6, 0], [10, 0], [aX, aY]);
  const isACorrect =
    Math.abs(aY) > 0.5 &&
    (anglesA.every((deg) => deg < 89.5 && deg > 5) ||
      (aX > 6.1 && aX < 9.9 && (aX - 8) ** 2 + aY ** 2 > 3.8));

  // 3. Triángulo Obtusángulo (Base O1(13,0) - O2(17,0) con C3(oX, oY))
  const anglesO = getTriangleAngles([13, 0], [17, 0], [oX, oY]);
  const isOCorrect =
    Math.abs(oY) > 0.5 &&
    (anglesO.some((deg) => deg > 90.5) ||
      oX < 12.9 ||
      oX > 17.1 ||
      (oX - 15) ** 2 + oY ** 2 < 4.2);

  return isRCorrect && isACorrect && isOCorrect;
}

export const CANVAS_VALIDATORS: Record<string, (spec?: DiagramSpecV3) => boolean> = {
  'ejercicio-clasificacion-triangulos': validateClasificacionTriangulos,
  'p3_q1': validateClasificacionTriangulos,
};


