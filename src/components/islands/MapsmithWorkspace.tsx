import { useEffect, useMemo, useRef, useState, type KeyboardEvent } from 'react';
import './mapsmith-workspace.css';

type View = 'map' | 'analysis' | 'dashboard';
type LayerId = 'wards' | 'facilities' | 'river' | 'roads';
type Operation = 'buffer' | 'summary';
type FacilityType = 'Clinic' | 'School' | 'Library' | 'Office' | 'Market' | 'Transport';
type Point = [number, number];

interface Ward {
  id: string;
  name: string;
  poly: Point[];
  label: Point;
}

interface Facility {
  id: string;
  name: string;
  type: FacilityType;
  x: number;
  y: number;
}

const W = 640;
const H = 400;

// Sample data for the illustrative workspace. Not a real place.
// Outer vertices sit past the canvas edge so ward boundaries are not drawn along the frame.
const WARDS: Ward[] = [
  { id: 'north', name: 'North ward', poly: [[-12, -12], [252, -12], [230, 95], [290, 160], [240, 230], [120, 245], [-12, 208]], label: [112, 128] },
  { id: 'central', name: 'Central ward', poly: [[252, -12], [462, -12], [440, 70], [470, 165], [380, 205], [290, 160], [230, 95]], label: [352, 96] },
  { id: 'east', name: 'East ward', poly: [[462, -12], [652, -12], [652, 186], [560, 220], [470, 165], [440, 70]], label: [556, 112] },
  { id: 'south', name: 'South ward', poly: [[-12, 208], [120, 245], [240, 230], [290, 160], [380, 205], [401, 412], [-12, 412]], label: [220, 352] },
  { id: 'harbour', name: 'Harbour ward', poly: [[380, 205], [470, 165], [560, 220], [652, 186], [652, 412], [401, 412]], label: [520, 252] },
];

const FACILITIES: Facility[] = [
  { id: 'f1', name: 'North clinic', type: 'Clinic', x: 118, y: 74 },
  { id: 'f2', name: 'Ward office', type: 'Office', x: 282, y: 100 },
  { id: 'f3', name: 'City library', type: 'Library', x: 330, y: 44 },
  { id: 'f4', name: 'Central clinic', type: 'Clinic', x: 392, y: 128 },
  { id: 'f5', name: 'East school', type: 'School', x: 528, y: 70 },
  { id: 'f6', name: 'Riverside school', type: 'School', x: 592, y: 160 },
  { id: 'f7', name: 'South market', type: 'Market', x: 150, y: 318 },
  { id: 'f8', name: 'South clinic', type: 'Clinic', x: 298, y: 292 },
  { id: 'f9', name: 'Ferry point', type: 'Transport', x: 524, y: 300 },
  { id: 'f10', name: 'Bus stand', type: 'Transport', x: 64, y: 262 },
];

const TYPE_COLOR: Record<FacilityType, string> = {
  Clinic: '#20A39A',
  School: '#4B5FD3',
  Library: '#C9822F',
  Office: '#10231F',
  Market: '#D3613D',
  Transport: '#7C6CD6',
};

const LAYERS: { id: LayerId; label: string; swatch: string }[] = [
  { id: 'wards', label: 'Ward boundaries', swatch: '#BFE3DD' },
  { id: 'facilities', label: 'Public facilities', swatch: '#10231F' },
  { id: 'river', label: 'River', swatch: '#9FB4F0' },
  { id: 'roads', label: 'Main roads', swatch: '#C9D5D2' },
];

const DISTANCES = [
  { label: '250 m', metres: 250 },
  { label: '500 m', metres: 500 },
  { label: '1 km', metres: 1000 },
];

const PX_PER_KM = 92;
const RIVER = 'M-10 128C70 112 130 176 214 168S340 116 410 146 548 238 650 220';
const ROADS = ['M40 -10L80 120 200 180 300 300 330 410', 'M-10 262L140 232 300 160 470 120 650 70', 'M430 -10L470 165 520 300 560 410'];
const CHOROPLETH = ['#EDF7F5', '#D2ECE8', '#A9DCD5', '#7CC7BD', '#4FB0A4'];

const toPath = (poly: Point[]) => `M${poly.map(([x, y]) => `${x} ${y}`).join('L')}Z`;

function inside([x, y]: Point, poly: Point[]) {
  let hit = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const [xi, yi] = poly[i];
    const [xj, yj] = poly[j];
    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) hit = !hit;
  }
  return hit;
}

const wardOf = (facility: Facility) => WARDS.find((ward) => inside([facility.x, facility.y], ward.poly)) ?? WARDS[0];

const COUNTS = Object.fromEntries(WARDS.map((ward) => [ward.id, FACILITIES.filter((f) => wardOf(f).id === ward.id).length]));

function coverage(radius: number) {
  const step = 8;
  const byWard: Record<string, { total: number; covered: number }> = Object.fromEntries(WARDS.map((w) => [w.id, { total: 0, covered: 0 }]));
  let total = 0;
  let covered = 0;
  for (let y = step / 2; y < H; y += step) {
    for (let x = step / 2; x < W; x += step) {
      const hit = FACILITIES.some((f) => (f.x - x) ** 2 + (f.y - y) ** 2 <= radius ** 2);
      const ward = WARDS.find((w) => inside([x, y], w.poly));
      total += 1;
      if (hit) covered += 1;
      if (ward) {
        byWard[ward.id].total += 1;
        if (hit) byWard[ward.id].covered += 1;
      }
    }
  }
  return {
    share: Math.round((covered / total) * 100),
    byWard: Object.fromEntries(WARDS.map((w) => [w.id, Math.round((byWard[w.id].covered / Math.max(1, byWard[w.id].total)) * 100)])),
  };
}

const VIEWS: { id: View; label: string }[] = [
  { id: 'map', label: 'Map' },
  { id: 'analysis', label: 'Analysis' },
  { id: 'dashboard', label: 'Dashboard' },
];

function Check() {
  return (
    <svg viewBox="0 0 12 12" aria-hidden="true">
      <path d="m2.5 6.2 2.3 2.3 4.7-5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

interface MapProps {
  label: string;
  layers: Record<LayerId, boolean>;
  radius?: number | null;
  choropleth?: boolean;
  /** Facilities are only focusable and selectable when a selection handler is provided. */
  selected?: string | null;
  onSelect?: (id: string | null) => void;
  compact?: boolean;
}

function MapCanvas({ label, layers, radius = null, choropleth = false, selected = null, onSelect, compact = false }: MapProps) {
  const interactive = onSelect !== undefined;
  const active = interactive ? (FACILITIES.find((f) => f.id === selected) ?? null) : null;
  const clear = interactive ? () => onSelect(null) : undefined;
  const onKey = (event: KeyboardEvent<SVGGElement>, id: string) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onSelect?.(selected === id ? null : id);
    }
    if (event.key === 'Escape') onSelect?.(null);
  };

  // The popup has a fixed pixel size while the map scales, so the flip point depends on the rendered height.
  const mapRef = useRef<HTMLDivElement>(null);
  const [mapHeight, setMapHeight] = useState(H);
  useEffect(() => {
    const element = mapRef.current;
    if (!interactive || !element || typeof ResizeObserver === 'undefined') return;
    const observer = new ResizeObserver(([entry]) => setMapHeight(entry.contentRect.height));
    observer.observe(element);
    return () => observer.disconnect();
  }, [interactive]);

  return (
    <div className="msw-map" ref={mapRef}>
      <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid slice" role={interactive ? 'group' : 'img'} aria-label={label}>
        <rect width={W} height={H} fill="#EEF3F2" onClick={clear} />
        {layers.wards && (
          <g className="msw-wards">
            {WARDS.map((ward) => (
              <path
                key={ward.id}
                d={toPath(ward.poly)}
                fill={choropleth ? CHOROPLETH[Math.min(COUNTS[ward.id], CHOROPLETH.length - 1)] : '#E3F0EE'}
                onClick={clear}
              />
            ))}
          </g>
        )}
        {layers.river && (
          <g aria-hidden="true">
            <path d={RIVER} fill="none" stroke="#B9C8F3" strokeWidth="16" strokeLinecap="round" />
            <path d={RIVER} fill="none" stroke="#8EA3EC" strokeWidth="1.2" />
          </g>
        )}
        {layers.roads && (
          <g fill="none" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            {ROADS.map((d) => (
              <path key={d} d={d} stroke="#C9D5D2" strokeWidth="6.5" />
            ))}
            {ROADS.map((d) => (
              <path key={`${d}-fill`} d={d} stroke="#fff" strokeWidth="4" />
            ))}
          </g>
        )}
        {layers.wards && (
          <g fill="none" stroke="#3F8077" strokeOpacity="0.55" strokeWidth="1.4" strokeDasharray="7 4" aria-hidden="true">
            {WARDS.map((ward) => (
              <path key={ward.id} d={toPath(ward.poly)} />
            ))}
          </g>
        )}
        {layers.facilities && radius !== null && (
          <g aria-hidden="true">
            {/* Solid fills under one group opacity read as a dissolved union instead of stacked circles. */}
            <g className="msw-buffers">
              {FACILITIES.map((f) => (
                <circle key={f.id} cx={f.x} cy={f.y} r={radius} />
              ))}
            </g>
            <g className="msw-buffers-edge">
              {FACILITIES.map((f) => (
                <circle key={f.id} cx={f.x} cy={f.y} r={radius} />
              ))}
            </g>
          </g>
        )}
        {layers.wards && choropleth && !compact && (
          <g className="msw-counts" aria-hidden="true">
            {WARDS.map((ward) => (
              <g key={ward.id} transform={`translate(${ward.label[0]} ${ward.label[1]})`}>
                <rect x="-38" y="-13" width="76" height="26" rx="13" />
                <text textAnchor="middle" dy="4">
                  {COUNTS[ward.id]} {COUNTS[ward.id] === 1 ? 'facility' : 'facilities'}
                </text>
              </g>
            ))}
          </g>
        )}
        {layers.facilities && (
          <g aria-hidden={interactive ? undefined : true}>
            {FACILITIES.map((f) => (
              <g
                key={f.id}
                className="msw-point"
                data-selected={(interactive && selected === f.id) || undefined}
                transform={`translate(${f.x} ${f.y})`}
                role={interactive ? 'button' : undefined}
                tabIndex={interactive ? 0 : undefined}
                aria-label={interactive ? `${f.name}, ${f.type}` : undefined}
                aria-pressed={interactive ? selected === f.id : undefined}
                onClick={interactive ? () => onSelect(selected === f.id ? null : f.id) : undefined}
                onKeyDown={interactive ? (event) => onKey(event, f.id) : undefined}
              >
                <circle className="msw-point__halo" r="13" />
                <circle className="msw-point__dot" r="6" fill={TYPE_COLOR[f.type]} />
              </g>
            ))}
          </g>
        )}
      </svg>
      {!compact && radius !== null && (
        <div className="msw-scale" style={{ width: `${(PX_PER_KM / 2 / W) * 100}%` }} aria-hidden="true">
          <span>500 m</span>
        </div>
      )}
      {active && layers.facilities && (
        <div
          key={active.id}
          className="msw-popup"
          style={{ left: `clamp(88px, ${(active.x / W) * 100}%, calc(100% - 88px))`, top: `${(active.y / H) * 100}%` }}
          data-below={(active.y / H) * mapHeight < 118 || undefined}
          data-dock={active.y > H / 2 ? 'top' : 'bottom'}
        >
          <strong>{active.name}</strong>
          <dl>
            <div>
              <dt>Type</dt>
              <dd>{active.type}</dd>
            </div>
            <div>
              <dt>Ward</dt>
              <dd>{wardOf(active).name}</dd>
            </div>
          </dl>
        </div>
      )}
    </div>
  );
}

export default function MapsmithWorkspace() {
  const [view, setView] = useState<View>('map');
  const [layers, setLayers] = useState<Record<LayerId, boolean>>({ wards: true, facilities: true, river: true, roads: true });
  const [operation, setOperation] = useState<Operation>('buffer');
  const [distance, setDistance] = useState(500);
  const [selected, setSelected] = useState<string | null>('f4');
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const radius = (distance / 1000) * PX_PER_KM;
  const covered = useMemo(() => coverage(radius), [radius]);
  const halfKm = useMemo(() => coverage(PX_PER_KM / 2), []);
  const maxCount = Math.max(...Object.values(COUNTS));

  const onTabKey = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const delta = event.key === 'ArrowRight' ? 1 : event.key === 'ArrowLeft' ? -1 : 0;
    if (!delta) return;
    event.preventDefault();
    const next = (index + delta + VIEWS.length) % VIEWS.length;
    setView(VIEWS[next].id);
    tabRefs.current[next]?.focus();
  };

  const toggle = (id: LayerId) => setLayers((current) => ({ ...current, [id]: !current[id] }));

  const result =
    operation === 'buffer'
      ? `facilities_within_${distance >= 1000 ? '1km' : `${distance}m`} · ${FACILITIES.length} features · ${covered.share}% of the area covered`
      : `ward_facility_count · ${WARDS.length} features · max ${maxCount} per ward`;

  return (
    <div className="msw">
      <div className="msw-chrome">
        <span className="msw-dots" aria-hidden="true">
          <i />
          <i />
          <i />
        </span>
        <span className="msw-crumb">
          Service coverage <span>· Sample workspace</span>
        </span>
        <div className="msw-tabs" role="tablist" aria-label="Workspace view">
          {VIEWS.map((item, index) => (
            <button
              key={item.id}
              ref={(node) => {
                tabRefs.current[index] = node;
              }}
              className="msw-tab"
              type="button"
              role="tab"
              id={`msw-tab-${item.id}`}
              aria-selected={view === item.id}
              aria-controls={`msw-panel-${item.id}`}
              tabIndex={view === item.id ? 0 : -1}
              onClick={() => setView(item.id)}
              onKeyDown={(event) => onTabKey(event, index)}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      <div className="msw-panel" role="tabpanel" id="msw-panel-map" aria-labelledby="msw-tab-map" hidden={view !== 'map'}>
        {view === 'map' && (
          <div className="msw-body">
            <div className="msw-side">
              <div>
                <p className="msw-label">Layers</p>
                {LAYERS.map((layer) => (
                  <button key={layer.id} type="button" className="msw-layer" aria-pressed={layers[layer.id]} onClick={() => toggle(layer.id)}>
                    <span className="msw-check">
                      <Check />
                    </span>
                    {layer.label}
                    <span className="msw-swatch" style={{ background: layer.swatch }} aria-hidden="true" />
                  </button>
                ))}
              </div>
              <div>
                <p className="msw-label">Facility types</p>
                <ul className="msw-legend">
                  {(Object.keys(TYPE_COLOR) as FacilityType[]).map((type) => (
                    <li key={type}>
                      <i style={{ background: TYPE_COLOR[type] }} aria-hidden="true" />
                      {type}
                    </li>
                  ))}
                </ul>
              </div>
              <p className="msw-hint">Select a facility on the map to inspect it.</p>
            </div>
            <MapCanvas
              label="Sample map of five wards and ten public facilities"
              layers={layers}
              selected={selected}
              onSelect={setSelected}
            />
          </div>
        )}
      </div>

      <div className="msw-panel" role="tabpanel" id="msw-panel-analysis" aria-labelledby="msw-tab-analysis" hidden={view !== 'analysis'}>
        {view === 'analysis' && (
          <div className="msw-body">
            <div className="msw-side">
              <div>
                <p className="msw-label">Operation</p>
                <div className="msw-ops">
                  <button type="button" className="msw-op" aria-pressed={operation === 'buffer'} onClick={() => setOperation('buffer')}>
                    <strong>Buffer</strong>
                    <span>Distance around each facility</span>
                  </button>
                  <button type="button" className="msw-op" aria-pressed={operation === 'summary'} onClick={() => setOperation('summary')}>
                    <strong>Summarize within</strong>
                    <span>Count facilities in each ward</span>
                  </button>
                </div>
              </div>
              {operation === 'buffer' && (
                <div>
                  <p className="msw-label">Distance</p>
                  <div className="msw-seg">
                    {DISTANCES.map((item) => (
                      <button key={item.metres} type="button" aria-pressed={distance === item.metres} onClick={() => setDistance(item.metres)}>
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              <div className="msw-result" aria-live="polite">
                <p className="msw-label">New layer</p>
                <p>{result}</p>
              </div>
            </div>
            <MapCanvas
              label={
                operation === 'buffer'
                  ? `Sample map with ${DISTANCES.find((item) => item.metres === distance)?.label} buffers around ten facilities`
                  : 'Sample map shading each ward by its number of facilities'
              }
              layers={{ ...layers, wards: true, facilities: true }}
              radius={operation === 'buffer' ? radius : null}
              choropleth={operation === 'summary'}
            />
          </div>
        )}
      </div>

      <div className="msw-panel" role="tabpanel" id="msw-panel-dashboard" aria-labelledby="msw-tab-dashboard" hidden={view !== 'dashboard'}>
        {view === 'dashboard' && (
          <div className="msw-dash">
            <div className="msw-kpi">
              <span>Public facilities</span>
              <b>{FACILITIES.length}</b>
            </div>
            <div className="msw-kpi">
              <span>Wards</span>
              <b>{WARDS.length}</b>
            </div>
            <div className="msw-kpi">
              <span>Area within 500 m</span>
              <b>{halfKm.share}%</b>
            </div>
            <div className="msw-card msw-card--map">
              <p className="msw-label">Facilities by ward</p>
              <MapCanvas
                label="Sample map shading each ward by its number of facilities"
                layers={{ wards: true, facilities: true, river: true, roads: false }}
                choropleth
                compact
              />
            </div>
            <div className="msw-card msw-card--bars">
              <p className="msw-label">Facilities per ward</p>
              <ul className="msw-bars">
                {WARDS.map((ward) => (
                  <li key={ward.id}>
                    <span>{ward.name}</span>
                    <i style={{ width: `${(COUNTS[ward.id] / maxCount) * 100}%` }} aria-hidden="true" />
                    <b>{COUNTS[ward.id]}</b>
                  </li>
                ))}
              </ul>
            </div>
            <div className="msw-card msw-card--table">
              <p className="msw-label">Coverage within 500 m</p>
              <table>
                <thead>
                  <tr>
                    <th scope="col">Ward</th>
                    <th scope="col">Facilities</th>
                    <th scope="col">Covered</th>
                  </tr>
                </thead>
                <tbody>
                  {WARDS.map((ward) => (
                    <tr key={ward.id}>
                      <th scope="row">{ward.name}</th>
                      <td>{COUNTS[ward.id]}</td>
                      <td>{halfKm.byWard[ward.id]}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      <div className="msw-status">
        <span>Sample data · illustrative workspace</span>
        <span>
          {layers.facilities ? FACILITIES.length : 0} features · {WARDS.length} wards
        </span>
      </div>
    </div>
  );
}
