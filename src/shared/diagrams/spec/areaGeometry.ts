export interface Coordinates {
  x: number;
  y: number;
}

export function signedCross(
  origin: Coordinates,
  direction: Coordinates,
  point: Coordinates,
): number {
  const dx = direction.x - origin.x;
  const dy = direction.y - origin.y;
  return dx * (point.y - origin.y) - dy * (point.x - origin.x);
}

export function pointInHalfPlane(
  lineA: Coordinates,
  lineB: Coordinates,
  sidePoint: Coordinates,
  point: Coordinates,
  tolerance = 1e-8,
): boolean {
  const side = Math.sign(signedCross(lineA, lineB, sidePoint)) || 1;
  const cross = signedCross(lineA, lineB, point);
  return cross * side >= -tolerance;
}

export function constrainToHalfPlane(
  lineA: Coordinates,
  lineB: Coordinates,
  sidePoint: Coordinates,
  point: Coordinates,
): Coordinates {
  const side = Math.sign(signedCross(lineA, lineB, sidePoint)) || 1;
  const cross = signedCross(lineA, lineB, point);
  if (cross * side >= 0) return point;
  const dx = lineB.x - lineA.x;
  const dy = lineB.y - lineA.y;
  const length = Math.hypot(dx, dy) || 1;
  const projection = ((point.x - lineA.x) * dx + (point.y - lineA.y) * dy) / (length * length);
  return {
    x: lineA.x + projection * dx - (dy / length) * side * 0.05,
    y: lineA.y + projection * dy + (dx / length) * side * 0.05,
  };
}

export function pointInPolygon(polygon: Coordinates[], point: Coordinates): boolean {
  if (polygon.length < 3) return false;
  let inside = false;
  for (let index = 0, previous = polygon.length - 1; index < polygon.length; previous = index, index += 1) {
    const current = polygon[index];
    const prior = polygon[previous];
    const intersects = (
      (current.y > point.y) !== (prior.y > point.y)
      && point.x < ((prior.x - current.x) * (point.y - current.y)) / ((prior.y - current.y) || 1e-12) + current.x
    );
    if (intersects) inside = !inside;
  }
  return inside;
}

function distanceToSegment(point: Coordinates, start: Coordinates, end: Coordinates): number {
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  const lengthSquared = dx * dx + dy * dy;
  if (lengthSquared < 1e-12) return Math.hypot(point.x - start.x, point.y - start.y);
  const amount = Math.max(0, Math.min(1, ((point.x - start.x) * dx + (point.y - start.y) * dy) / lengthSquared));
  const projectedX = start.x + amount * dx;
  const projectedY = start.y + amount * dy;
  return Math.hypot(point.x - projectedX, point.y - projectedY);
}

export function constrainToPolygon(polygon: Coordinates[], point: Coordinates): Coordinates {
  if (polygon.length < 3 || pointInPolygon(polygon, point)) return point;
  let best = point;
  let bestDistance = Number.POSITIVE_INFINITY;
  for (let index = 0, previous = polygon.length - 1; index < polygon.length; previous = index, index += 1) {
    const current = polygon[index];
    const prior = polygon[previous];
    const dx = current.x - prior.x;
    const dy = current.y - prior.y;
    const lengthSquared = dx * dx + dy * dy || 1;
    const amount = Math.max(0, Math.min(1, ((point.x - prior.x) * dx + (point.y - prior.y) * dy) / lengthSquared));
    const candidate = { x: prior.x + amount * dx, y: prior.y + amount * dy };
    const distance = Math.hypot(point.x - candidate.x, point.y - candidate.y);
    if (distance < bestDistance) {
      bestDistance = distance;
      best = candidate;
    }
  }
  const centroid = polygon.reduce((accumulator, vertex) => ({
    x: accumulator.x + vertex.x / polygon.length,
    y: accumulator.y + vertex.y / polygon.length,
  }), { x: 0, y: 0 });
  const inwardX = centroid.x - best.x;
  const inwardY = centroid.y - best.y;
  const inwardLength = Math.hypot(inwardX, inwardY) || 1;
  return {
    x: best.x + (inwardX / inwardLength) * 0.05,
    y: best.y + (inwardY / inwardLength) * 0.05,
  };
}

export function pointInDisk(center: Coordinates, boundary: Coordinates, point: Coordinates, tolerance = 1e-8): boolean {
  const radius = Math.hypot(boundary.x - center.x, boundary.y - center.y);
  return Math.hypot(point.x - center.x, point.y - center.y) <= radius + tolerance;
}

export function constrainToDisk(center: Coordinates, boundary: Coordinates, point: Coordinates): Coordinates {
  const radius = Math.hypot(boundary.x - center.x, boundary.y - center.y) * 0.999;
  const dx = point.x - center.x;
  const dy = point.y - center.y;
  const length = Math.hypot(dx, dy);
  if (length <= radius) return point;
  return length > 0
    ? { x: center.x + dx / length * radius, y: center.y + dy / length * radius }
    : { x: center.x + radius, y: center.y };
}

export function diskRadius(center: Coordinates, boundary: Coordinates): number {
  return Math.hypot(boundary.x - center.x, boundary.y - center.y);
}

export function nearestPointOnLine(lineA: Coordinates, lineB: Coordinates, point: Coordinates): Coordinates {
  const dx = lineB.x - lineA.x;
  const dy = lineB.y - lineA.y;
  const lengthSquared = dx * dx + dy * dy || 1;
  const amount = ((point.x - lineA.x) * dx + (point.y - lineA.y) * dy) / lengthSquared;
  return { x: lineA.x + amount * dx, y: lineA.y + amount * dy };
}

export function pointOnLine(
  lineA: Coordinates,
  lineB: Coordinates,
  point: Coordinates,
  tolerance = 1e-6,
): boolean {
  const nearest = nearestPointOnLine(lineA, lineB, point);
  return Math.hypot(point.x - nearest.x, point.y - nearest.y) <= tolerance;
}

export function constrainToLine(lineA: Coordinates, lineB: Coordinates, point: Coordinates): Coordinates {
  return nearestPointOnLine(lineA, lineB, point);
}

export function pointOnDiskBoundary(
  center: Coordinates,
  boundary: Coordinates,
  point: Coordinates,
  tolerance = 1e-6,
): boolean {
  const radius = diskRadius(center, boundary);
  return Math.abs(Math.hypot(point.x - center.x, point.y - center.y) - radius) <= tolerance;
}

export function constrainToDiskBoundary(center: Coordinates, boundary: Coordinates, point: Coordinates): Coordinates {
  const radius = diskRadius(center, boundary);
  const dx = point.x - center.x;
  const dy = point.y - center.y;
  const length = Math.hypot(dx, dy);
  if (length < 1e-12) return { x: center.x + radius, y: center.y };
  return { x: center.x + (dx / length) * radius, y: center.y + (dy / length) * radius };
}

export function halfPlaneViewportPolygon(
  lineA: Coordinates,
  lineB: Coordinates,
  sidePoint: Coordinates,
  bounds: [number, number, number, number],
): Coordinates[] {
  const [xMin, yMax, xMax, yMin] = bounds;
  const viewport = [
    { x: xMin, y: yMax },
    { x: xMax, y: yMax },
    { x: xMax, y: yMin },
    { x: xMin, y: yMin },
  ];
  return clipPolygonByHalfPlane(viewport, lineA, lineB, sidePoint);
}

export function nearestPointOnSegment(point: Coordinates, start: Coordinates, end: Coordinates): Coordinates {
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  const lengthSquared = dx * dx + dy * dy || 1;
  const amount = Math.max(0, Math.min(1, ((point.x - start.x) * dx + (point.y - start.y) * dy) / lengthSquared));
  return { x: start.x + amount * dx, y: start.y + amount * dy };
}

export function polygonSignedArea(polygon: Coordinates[]): number {
  let area = 0;
  for (let index = 0, previous = polygon.length - 1; index < polygon.length; previous = index, index += 1) {
    area += polygon[previous].x * polygon[index].y - polygon[index].x * polygon[previous].y;
  }
  return area / 2;
}

export function polygonIsConvex(polygon: readonly Coordinates[]): boolean {
  if (polygon.length < 3) return false;
  let sign = 0;
  for (let index = 0; index < polygon.length; index += 1) {
    const cross = signedCross(
      polygon[index],
      polygon[(index + 1) % polygon.length],
      polygon[(index + 2) % polygon.length],
    );
    if (Math.abs(cross) < 1e-10) continue;
    const current = Math.sign(cross);
    if (sign === 0) sign = current;
    else if (current !== sign) return false;
  }
  return sign !== 0;
}

export function intersectPolygons(subject: Coordinates[], clip: Coordinates[]): Coordinates[] {
  if (subject.length < 3 || clip.length < 3) return [];
  const subjectConvex = polygonIsConvex(subject);
  const clipConvex = polygonIsConvex(clip);
  if (clipConvex) return clipPolygonToPolygon(subject, clip);
  if (subjectConvex) {
    const swappedSubject = clip;
    const swappedClip = subject;
    return clipPolygonToPolygon(swappedSubject, swappedClip);
  }
  const forward = clipPolygonToPolygon(subject, clip);
  const reverseSubject = clip;
  const reverseClip = subject;
  const reverse = clipPolygonToPolygon(reverseSubject, reverseClip);
  if (forward.length < 3) return reverse.length >= 3 ? reverse : [];
  if (reverse.length < 3) return forward;
  const forwardArea = Math.abs(polygonSignedArea(forward));
  const reverseArea = Math.abs(polygonSignedArea(reverse));
  return forwardArea >= reverseArea ? forward : reverse;
}

function segmentLineIntersection(
  start: Coordinates,
  end: Coordinates,
  lineA: Coordinates,
  lineB: Coordinates,
): Coordinates | undefined {
  const x1 = start.x;
  const y1 = start.y;
  const x2 = end.x;
  const y2 = end.y;
  const x3 = lineA.x;
  const y3 = lineA.y;
  const x4 = lineB.x;
  const y4 = lineB.y;
  const denominator = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);
  if (Math.abs(denominator) < 1e-10) return undefined;
  const amount = ((x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4)) / denominator;
  return { x: x1 + amount * (x2 - x1), y: y1 + amount * (y2 - y1) };
}

export function clipPolygonToPolygon(subject: Coordinates[], clip: Coordinates[]): Coordinates[] {
  if (subject.length === 0 || clip.length < 3) return subject;
  const centroid = clip.reduce((accumulator, vertex) => ({
    x: accumulator.x + vertex.x / clip.length,
    y: accumulator.y + vertex.y / clip.length,
  }), { x: 0, y: 0 });
  let result = subject;
  for (let index = 0; index < clip.length; index += 1) {
    result = clipPolygonByHalfPlane(
      result,
      clip[index],
      clip[(index + 1) % clip.length],
      centroid,
    );
    if (result.length === 0) return [];
  }
  return result;
}

export function clipPolygonByHalfPlane(
  polygon: Coordinates[],
  lineA: Coordinates,
  lineB: Coordinates,
  sidePoint: Coordinates,
): Coordinates[] {
  if (polygon.length === 0) return [];
  const side = Math.sign(signedCross(lineA, lineB, sidePoint)) || 1;
  const inside = (point: Coordinates) => signedCross(lineA, lineB, point) * side >= -1e-8;
  const output: Coordinates[] = [];
  for (let index = 0; index < polygon.length; index += 1) {
    const current = polygon[index];
    const previous = polygon[(index + polygon.length - 1) % polygon.length];
    const currentInside = inside(current);
    const previousInside = inside(previous);
    if (currentInside) {
      if (!previousInside) {
        const intersection = segmentLineIntersection(previous, current, lineA, lineB);
        if (intersection) output.push(intersection);
      }
      output.push(current);
    } else if (previousInside) {
      const intersection = segmentLineIntersection(previous, current, lineA, lineB);
      if (intersection) output.push(intersection);
    }
  }
  return output;
}

export function distanceToPolygonBoundary(polygon: Coordinates[], point: Coordinates): number {
  if (polygon.length < 2) return Number.POSITIVE_INFINITY;
  let best = Number.POSITIVE_INFINITY;
  for (let index = 0, previous = polygon.length - 1; index < polygon.length; previous = index, index += 1) {
    best = Math.min(best, distanceToSegment(point, polygon[previous], polygon[index]));
  }
  return best;
}

export function pointOnPolygonBoundary(
  polygon: Coordinates[],
  point: Coordinates,
  tolerance = 1e-6,
): boolean {
  return distanceToPolygonBoundary(polygon, point) <= tolerance;
}

export function constrainToPolygonBoundary(polygon: Coordinates[], point: Coordinates): Coordinates {
  if (polygon.length < 2) return point;
  let best = point;
  let bestDistance = Number.POSITIVE_INFINITY;
  for (let index = 0, previous = polygon.length - 1; index < polygon.length; previous = index, index += 1) {
    const candidate = nearestPointOnSegment(point, polygon[previous], polygon[index]);
    const distance = Math.hypot(point.x - candidate.x, point.y - candidate.y);
    if (distance < bestDistance) {
      bestDistance = distance;
      best = candidate;
    }
  }
  return best;
}
