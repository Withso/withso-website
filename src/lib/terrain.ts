import { contours } from 'd3-contour';

export interface ContourLine {
  d: string;
  index: boolean;
}

export interface TerrainOptions {
  width: number;
  height: number;
  cols?: number;
  rows?: number;
  levels?: number;
  seed?: number;
  hills?: number;
}

function random(seed: number) {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const round = (value: number) => Math.round(value);

function ringToPath(ring: number[][], toX: (x: number) => number, toY: (y: number) => number) {
  // GeoJSON rings repeat the first point at the end.
  const points = ring.slice(0, -1).map(([x, y]) => [toX(x), toY(y)] as const);
  if (points.length < 3) return '';
  const mid = (a: readonly [number, number], b: readonly [number, number]) =>
    `${round((a[0] + b[0]) / 2)} ${round((a[1] + b[1]) / 2)}`;
  const last = points[points.length - 1];
  let d = `M${mid(last, points[0])}`;
  for (let k = 0; k < points.length; k++) {
    const point = points[k];
    const next = points[(k + 1) % points.length];
    d += `Q${round(point[0])} ${round(point[1])} ${mid(point, next)}`;
  }
  return `${d}Z`;
}

/**
 * Generates smooth, deterministic contour lines for decorative terrain.
 * The sampled grid extends past the visible area so boundary-hugging contour edges are clipped away.
 */
export function terrain({ width, height, cols = 72, rows = 36, levels = 13, seed = 11, hills = 10 }: TerrainOptions) {
  const pad = 2;
  const gridCols = cols + pad * 2;
  const gridRows = rows + pad * 2;
  const rand = random(seed);

  const bumps = Array.from({ length: hills }, () => ({
    x: rand() * cols + pad,
    y: rand() * rows + pad,
    sx: (0.07 + rand() * 0.14) * cols,
    sy: (0.12 + rand() * 0.22) * rows,
    h: (rand() > 0.22 ? 1 : -0.55) * (0.45 + rand() * 0.75),
  }));

  const values = new Array<number>(gridCols * gridRows);
  for (let j = 0; j < gridRows; j++) {
    for (let i = 0; i < gridCols; i++) {
      let v = 0.14 * Math.sin((i / gridCols) * Math.PI * 2.1 + (j / gridRows) * 1.7);
      for (const b of bumps) {
        const dx = (i - b.x) / b.sx;
        const dy = (j - b.y) / b.sy;
        v += b.h * Math.exp(-(dx * dx + dy * dy) / 2);
      }
      values[j * gridCols + i] = v;
    }
  }

  let min = Infinity;
  let max = -Infinity;
  for (const v of values) {
    if (v < min) min = v;
    if (v > max) max = v;
  }
  const step = (max - min) / (levels + 1);
  const thresholds = Array.from({ length: levels }, (_, k) => min + step * (k + 1));

  const cellW = width / cols;
  const cellH = height / rows;
  const toX = (x: number) => (x - pad - 0.5) * cellW;
  const toY = (y: number) => (y - pad - 0.5) * cellH;

  const lines: ContourLine[] = contours().size([gridCols, gridRows]).thresholds(thresholds)(values).map((geometry, k) => ({
    d: geometry.coordinates
      .flat()
      .map((ring) => ringToPath(ring, toX, toY))
      .join(''),
    index: (k + 1) % 4 === 0,
  }));

  const peaks = bumps
    .filter((b) => b.h > 0.8 && b.x > pad + cols * 0.08 && b.x < pad + cols * 0.92 && b.y > pad + rows * 0.12 && b.y < pad + rows * 0.88)
    .map((b) => ({ x: round(toX(b.x + 0.5)), y: round(toY(b.y + 0.5)) }));

  return { lines, peaks };
}

export interface TerrainArtwork extends TerrainOptions {
  background?: string;
  stroke: string;
  strokeOpacity: number;
  indexOpacity: number;
  highlight?: { line: number; stroke: string };
  peakColor?: string;
}

export function terrainSvg({ background, stroke, strokeOpacity, indexOpacity, highlight, peakColor, ...options }: TerrainArtwork) {
  const { lines, peaks } = terrain(options);
  const { width, height } = options;
  const paths = lines
    .map((line, i) => {
      const isHighlight = highlight?.line === i;
      const color = isHighlight ? highlight.stroke : stroke;
      const opacity = isHighlight ? 1 : line.index ? indexOpacity : strokeOpacity;
      return `<path d="${line.d}" stroke="${color}" stroke-opacity="${opacity}"/>`;
    })
    .join('');
  const marks = peakColor
    ? peaks.map((p) => `<path d="M${p.x - 5} ${p.y}h10M${p.x} ${p.y - 5}v10" stroke="${peakColor}"/>`).join('')
    : '';
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" preserveAspectRatio="xMidYMid slice">` +
    (background ? `<rect width="${width}" height="${height}" fill="${background}"/>` : '') +
    `<style>path{vector-effect:non-scaling-stroke}</style>` +
    `<g fill="none" stroke-width="1">${paths}${marks}</g></svg>`
  );
}
