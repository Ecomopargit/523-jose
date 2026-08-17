type Point = { x: number; y: number };

type Cubic = {
  p0: Point;
  p1: Point;
  p2: Point;
  p3: Point;
};

/** Path: M25 166 C 62 95, 126 75, 175 96 S 270 143, 365 38 */
const SEGMENT_A: Cubic = {
  p0: { x: 25, y: 166 },
  p1: { x: 62, y: 95 },
  p2: { x: 126, y: 75 },
  p3: { x: 175, y: 96 },
};

// Smooth cubic (S): reflect previous CP2 across P3 → (224, 117)
const SEGMENT_B: Cubic = {
  p0: { x: 175, y: 96 },
  p1: { x: 224, y: 117 },
  p2: { x: 270, y: 143 },
  p3: { x: 365, y: 38 },
};

const SAMPLE_COUNT = 64;

function cubicPoint(c: Cubic, t: number): Point {
  const mt = 1 - t;
  const mt2 = mt * mt;
  const t2 = t * t;
  return {
    x: mt2 * mt * c.p0.x + 3 * mt2 * t * c.p1.x + 3 * mt * t2 * c.p2.x + t2 * t * c.p3.x,
    y: mt2 * mt * c.p0.y + 3 * mt2 * t * c.p1.y + 3 * mt * t2 * c.p2.y + t2 * t * c.p3.y,
  };
}

function cubicDerivative(c: Cubic, t: number): Point {
  const mt = 1 - t;
  return {
    x: 3 * mt * mt * (c.p1.x - c.p0.x) + 6 * mt * t * (c.p2.x - c.p1.x) + 3 * t * t * (c.p3.x - c.p2.x),
    y: 3 * mt * mt * (c.p1.y - c.p0.y) + 6 * mt * t * (c.p2.y - c.p1.y) + 3 * t * t * (c.p3.y - c.p2.y),
  };
}

function buildLengthTable(c: Cubic): { lengths: number[]; total: number } {
  const lengths: number[] = [0];
  let total = 0;
  let prev = cubicPoint(c, 0);
  for (let i = 1; i <= SAMPLE_COUNT; i += 1) {
    const point = cubicPoint(c, i / SAMPLE_COUNT);
    const dx = point.x - prev.x;
    const dy = point.y - prev.y;
    total += Math.sqrt(dx * dx + dy * dy);
    lengths.push(total);
    prev = point;
  }
  return { lengths, total };
}

const TABLE_A = buildLengthTable(SEGMENT_A);
const TABLE_B = buildLengthTable(SEGMENT_B);
const TOTAL_LENGTH = TABLE_A.total + TABLE_B.total;

function tAtDistance(table: { lengths: number[]; total: number }, distance: number): number {
  const target = Math.max(0, Math.min(table.total, distance));
  if (target <= 0) return 0;
  if (target >= table.total) return 1;

  let lo = 0;
  let hi = SAMPLE_COUNT;
  while (lo < hi) {
    const mid = Math.floor((lo + hi) / 2);
    if (table.lengths[mid] < target) lo = mid + 1;
    else hi = mid;
  }

  const i = Math.max(1, lo);
  const len0 = table.lengths[i - 1];
  const len1 = table.lengths[i];
  const segment = Math.max(0.0001, len1 - len0);
  const local = (target - len0) / segment;
  return (i - 1 + local) / SAMPLE_COUNT;
}

export function easeInOutSine(t: number): number {
  return -(Math.cos(Math.PI * t) - 1) / 2;
}

export function getRoutePose(progress01: number, goingForward: boolean): {
  x: number;
  y: number;
  angle: number;
} {
  const distance = TOTAL_LENGTH * Math.max(0, Math.min(1, progress01));
  let point: Point;
  let tangent: Point;

  if (distance <= TABLE_A.total) {
    const t = tAtDistance(TABLE_A, distance);
    point = cubicPoint(SEGMENT_A, t);
    tangent = cubicDerivative(SEGMENT_A, t);
  } else {
    const t = tAtDistance(TABLE_B, distance - TABLE_A.total);
    point = cubicPoint(SEGMENT_B, t);
    tangent = cubicDerivative(SEGMENT_B, t);
  }

  let angle = (Math.atan2(tangent.y, tangent.x) * 180) / Math.PI;
  if (!goingForward) angle += 180;

  return { x: point.x, y: point.y, angle };
}

export { TOTAL_LENGTH };
