import type { APIRoute, GetStaticPaths } from 'astro';
import { terrainSvg, type TerrainArtwork } from '../../lib/terrain';

const variants: Record<string, TerrainArtwork> = {
  panel: {
    width: 1200,
    height: 680,
    cols: 64,
    rows: 36,
    levels: 14,
    seed: 11,
    hills: 11,
    stroke: '#b9b3a8',
    strokeOpacity: 0.5,
    indexOpacity: 0.85,
    peakColor: '#8a867f',
  },
  story: {
    width: 400,
    height: 250,
    cols: 36,
    rows: 22,
    levels: 11,
    seed: 5,
    hills: 7,
    background: '#1a1918',
    stroke: '#ffffff',
    strokeOpacity: 0.26,
    indexOpacity: 0.6,
    highlight: { line: 6, stroke: '#8c95ff' },
    peakColor: '#ffffff',
  },
};

export const getStaticPaths = (() => Object.keys(variants).map((variant) => ({ params: { variant } }))) satisfies GetStaticPaths;

export const GET: APIRoute = ({ params }) => {
  const artwork = variants[params.variant ?? ''];
  if (!artwork) return new Response('Not found', { status: 404 });
  return new Response(terrainSvg(artwork), {
    headers: { 'Content-Type': 'image/svg+xml; charset=utf-8' },
  });
};
