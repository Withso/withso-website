import { useEffect, useRef, useState } from 'react';
import './jurisfield-flow.css';

type Condition = 'Good' | 'Watch' | 'Repair';
type Status = 'draft' | 'queued' | 'syncing' | 'review' | 'returned' | 'approved';
type Capture = 'none' | 'working' | 'done';
type Tone = 'ok' | 'wait' | 'back' | 'muted';
type FocusTarget = 'sent' | 'reset' | 'form';

interface Site {
  id: string;
  condition: Condition;
  x: number;
  y: number;
}

const CONDITIONS: Condition[] = ['Good', 'Watch', 'Repair'];

const COLOR: Record<Condition, string> = {
  Good: '#3E9B61',
  Watch: '#D9A21B',
  Repair: '#D4572F',
};

// Sample records for the illustrative assignment. Not real sites.
const SITES: Site[] = [
  { id: 'SITE-0245', condition: 'Good', x: 214, y: 86 },
  { id: 'SITE-0246', condition: 'Good', x: 300, y: 150 },
  { id: 'SITE-0247', condition: 'Watch', x: 404, y: 80 },
  { id: 'SITE-0248', condition: 'Repair', x: 360, y: 198 },
];
const NEW_ID = 'SITE-0249';
const NEW_POINT = { x: 468, y: 150 };
const AREA = 'M150 64 204 32 300 24 352 46 440 40 506 76 532 136 500 200 424 232 322 238 238 222 172 196 136 132Z';
// Streets run far past the viewBox so letterboxed space around the area still reads as map.
const STREETS = [
  'M-640 146-10 122C120 128 230 104 330 112S520 130 650 104L1280 76',
  'M270 -400 262 -10C256 80 286 180 270 270L258 660',
  'M700 -400 560 -10 476 270 370 660',
  'M-640 -20 1280 -52',
];

const STEPS = ['Capture', 'Save on device', 'Sync', 'Review', 'Deliver'];
const STEP_INDEX: Record<Status, number> = { draft: 0, returned: 0, queued: 2, syncing: 2, review: 3, approved: 5 };

function Tick() {
  return (
    <svg viewBox="0 0 12 12" aria-hidden="true">
      <path d="m2.5 6.2 2.3 2.3 4.7-5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function JurisFieldFlow() {
  const [online, setOnline] = useState(false);
  const [condition, setCondition] = useState<Condition | null>(null);
  const [gps, setGps] = useState<Capture>('none');
  const [photo, setPhoto] = useState<Capture>('none');
  const [status, setStatus] = useState<Status>('draft');
  // What Operations last received; it lags the device until a sync completes.
  const [received, setReceived] = useState<Condition | null>(null);
  const [error, setError] = useState('');
  const [announcement, setAnnouncement] = useState('');
  const [focusTarget, setFocusTarget] = useState<FocusTarget | null>(null);
  const sentRef = useRef<HTMLDivElement>(null);
  const resetRef = useRef<HTMLButtonElement>(null);
  const choiceRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (gps !== 'working') return;
    const timer = window.setTimeout(() => setGps('done'), 800);
    return () => window.clearTimeout(timer);
  }, [gps]);

  useEffect(() => {
    if (photo !== 'working') return;
    const timer = window.setTimeout(() => setPhoto('done'), 500);
    return () => window.clearTimeout(timer);
  }, [photo]);

  useEffect(() => {
    if (status !== 'syncing') return;
    const timer = window.setTimeout(() => {
      setStatus('review');
      setReceived(condition);
      setAnnouncement(`${NEW_ID} synced. It is waiting for review in Operations.`);
    }, 1100);
    return () => window.clearTimeout(timer);
  }, [status, condition]);

  // The control that triggered a step is often replaced by the next state, so focus moves on explicitly.
  useEffect(() => {
    if (!focusTarget) return;
    const target = { sent: sentRef, reset: resetRef, form: choiceRef }[focusTarget].current;
    setFocusTarget(null);
    if (!target) return;
    target.focus({ preventScroll: true });
    const box = target.getBoundingClientRect();
    if (box.top < 0 || box.bottom > window.innerHeight) target.scrollIntoView({ block: 'center' });
  }, [focusTarget]);

  const editable = status === 'draft' || status === 'returned';
  const missing = [!condition, gps !== 'done', photo !== 'done'].filter(Boolean).length;
  const step = STEP_INDEX[status];

  const save = () => {
    if (missing) {
      setError(`Complete ${missing} required ${missing === 1 ? 'field' : 'fields'} to save.`);
      return;
    }
    setError('');
    setFocusTarget('sent');
    if (online) {
      setStatus('syncing');
      setAnnouncement('Record saved on the device. Sending it now.');
    } else {
      setStatus('queued');
      setAnnouncement('Record saved on the device. It will send when the connection returns.');
    }
  };

  const connect = (next: boolean) => {
    setOnline(next);
    if (next && status === 'queued') {
      setStatus('syncing');
      setAnnouncement('Connection restored. Sending the queued record.');
    } else if (!next && status === 'syncing') {
      setStatus('queued');
      setAnnouncement('Connection lost. The record stays queued on the device.');
    }
  };

  const decide = (decision: 'approved' | 'returned') => {
    setStatus(decision);
    setFocusTarget(decision === 'approved' ? 'reset' : 'form');
    setAnnouncement(
      decision === 'approved' ? `${NEW_ID} approved and ready to deliver.` : `${NEW_ID} returned to the field for correction.`,
    );
  };

  const reset = () => {
    setOnline(false);
    setCondition(null);
    setGps('none');
    setPhoto('none');
    setStatus('draft');
    setReceived(null);
    setError('');
    setFocusTarget('form');
    setAnnouncement('Started a new sample record.');
  };

  const captions = [
    status === 'draft' ? 'In progress' : status === 'returned' ? 'Correcting' : 'Captured 12:42:08',
    step >= 2 ? 'Stored locally' : '',
    status === 'queued' ? 'Waiting for connection' : status === 'syncing' ? 'Sending…' : step >= 3 ? 'Synced 12:42:11' : '',
    status === 'review' ? 'Waiting for a reviewer' : status === 'approved' ? 'Approved' : status === 'returned' ? 'Returned' : '',
    status === 'approved' ? 'Ready to export' : '',
  ];

  const row: { label: string; tone: Tone } =
    status === 'approved'
      ? { label: 'Approved', tone: 'ok' }
      : status === 'review'
        ? { label: 'Pending review', tone: 'wait' }
        : status === 'syncing'
          ? { label: 'Receiving…', tone: 'muted' }
          : received
            ? { label: 'Returned', tone: 'back' }
            : { label: 'Assigned', tone: 'muted' };

  const queue =
    status === 'syncing'
      ? `Receiving ${NEW_ID} from the field…`
      : status === 'approved'
        ? `${NEW_ID} approved and ready to export.`
        : received
          ? `${NEW_ID} is back in the field for correction.`
          : 'No records waiting for review.';

  const approved = SITES.length + (status === 'approved' ? 1 : 0);
  const total = SITES.length + 1;

  return (
    <div className="jff">
      <div className="jff-bar">
        <span className="jff-bar__title">
          Site condition inspection <span>· Sample assignment</span>
        </span>
        <div className="jff-net" role="group" aria-label="Simulated field connection">
          <span className="jff-net__label" aria-hidden="true">
            Field connection
          </span>
          <button type="button" aria-pressed={!online} onClick={() => connect(false)}>
            Offline
          </button>
          <button type="button" aria-pressed={online} onClick={() => connect(true)}>
            Online
          </button>
        </div>
      </div>

      <div className="jff-grid">
        <div className="jff-device">
          <div className="jff-phone" aria-label="Field app (sample)" role="region">
            <div className="jff-status">
              <span>12:42</span>
              <span className="jff-status__net" data-online={online || undefined}>
                <i aria-hidden="true" />
                {online ? 'Online' : 'Offline'}
                {status === 'queued' && <b>1 queued</b>}
              </span>
            </div>
            <div className="jff-screen">
              <p className="jff-kicker">Inspection area B · Assignment 5 of 5</p>
              <p className="jff-record">{NEW_ID}</p>
              <p className="jff-form-name">Site condition inspection</p>

              {status === 'returned' && (
                <p className="jff-returned">
                  <strong>Returned by reviewer</strong>
                  Check the condition and save the record again.
                </p>
              )}

              {editable ? (
                <div className="jff-form">
                  <fieldset className="jff-field">
                    <legend>
                      Condition <span aria-hidden="true">*</span>
                    </legend>
                    <div className="jff-choices">
                      {CONDITIONS.map((item, i) => (
                        <label key={item} className="jff-choice">
                          <input
                            ref={(condition ? condition === item : i === 0) ? choiceRef : undefined}
                            type="radio"
                            name="jff-condition"
                            value={item}
                            required
                            checked={condition === item}
                            onChange={() => {
                              setCondition(item);
                              setError('');
                            }}
                          />
                          <span>
                            <i style={{ background: COLOR[item] }} aria-hidden="true" />
                            {item}
                          </span>
                        </label>
                      ))}
                    </div>
                  </fieldset>

                  <div className="jff-field">
                    <p className="jff-field__label" aria-hidden="true">
                      Location <span>*</span>
                    </p>
                    <button
                      type="button"
                      className="jff-capture"
                      data-state={gps}
                      aria-disabled={gps === 'working' || undefined}
                      aria-label={
                        gps === 'done'
                          ? 'Location 13.0831° N, 80.2712° E, accurate to 1.8 metres. Capture again'
                          : gps === 'working'
                            ? 'Acquiring GPS point'
                            : 'Capture GPS point, required'
                      }
                      onClick={() => {
                        if (gps === 'working') return;
                        setGps('working');
                        setError('');
                      }}
                    >
                      {gps === 'done' ? (
                        <>
                          <span className="jff-done">
                            <Tick />
                          </span>
                          <span className="jff-capture__text">
                            <b>13.0831° N, 80.2712° E</b>
                            <small>± 1.8 m · inside the work area</small>
                          </span>
                          <span className="jff-capture__again">Update</span>
                        </>
                      ) : (
                        <>
                          <svg viewBox="0 0 16 16" aria-hidden="true">
                            <circle cx="8" cy="8" r="3" fill="none" stroke="currentColor" strokeWidth="1.3" />
                            <path d="M8 1.5v3M8 11.5v3M1.5 8h3M11.5 8h3" stroke="currentColor" strokeWidth="1.3" />
                          </svg>
                          <span className="jff-capture__text">{gps === 'working' ? 'Acquiring GPS…' : 'Capture GPS point'}</span>
                        </>
                      )}
                    </button>
                  </div>

                  <div className="jff-field">
                    <p className="jff-field__label" aria-hidden="true">
                      Site photo <span>*</span>
                    </p>
                    <button
                      type="button"
                      className="jff-capture"
                      data-state={photo}
                      aria-disabled={photo === 'working' || undefined}
                      aria-label={
                        photo === 'done'
                          ? 'Site photo attached. Retake photo'
                          : photo === 'working'
                            ? 'Attaching site photo'
                            : 'Attach site photo, required'
                      }
                      onClick={() => {
                        if (photo === 'working') return;
                        setPhoto('working');
                        setError('');
                      }}
                    >
                      {photo === 'done' ? (
                        <>
                          <span className="jff-thumb" />
                          <span className="jff-capture__text">
                            <b>1 photo attached</b>
                            <small>Stored with the record</small>
                          </span>
                          <span className="jff-capture__again">Retake</span>
                        </>
                      ) : (
                        <>
                          <svg viewBox="0 0 16 16" aria-hidden="true">
                            <path d="M2 5h2.5L6 3h4l1.5 2H14v8H2Z" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
                            <circle cx="8" cy="8.5" r="2.3" fill="none" stroke="currentColor" strokeWidth="1.3" />
                          </svg>
                          <span className="jff-capture__text">{photo === 'working' ? 'Attaching photo…' : 'Attach photo'}</span>
                        </>
                      )}
                    </button>
                  </div>

                  <button type="button" className="jff-save" onClick={save}>
                    Save record
                  </button>
                  <p className="jff-error" role="alert">
                    {error}
                  </p>
                </div>
              ) : (
                <div className="jff-sent" data-status={status} ref={sentRef} tabIndex={-1}>
                  <span className="jff-sent__icon" aria-hidden="true">
                    {status === 'syncing' ? <i className="jff-spinner" /> : <Tick />}
                  </span>
                  <strong>
                    {status === 'queued'
                      ? 'Saved on this device'
                      : status === 'syncing'
                        ? 'Sending record…'
                        : status === 'review'
                          ? 'Synced · waiting for review'
                          : 'Approved by reviewer'}
                  </strong>
                  <p>
                    {status === 'queued'
                      ? 'It sends automatically when the connection returns. Switch the field connection to Online.'
                      : status === 'syncing'
                        ? 'Queued work is sent once, so a retry never creates a duplicate.'
                        : status === 'review'
                          ? 'Review it in Operations: approve the record or return it for correction.'
                          : 'The record is complete, with its location, photo and history intact.'}
                  </p>
                  {status === 'approved' && (
                    <button type="button" className="jff-reset" ref={resetRef} onClick={reset}>
                      Start a new sample record
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="jff-ops" role="region" aria-label="Operations (sample)">
          <div className="jff-ops__head">
            <span>
              Operations <span>· Inspection area B</span>
            </span>
            <span className="jff-ops__count">
              {approved} of {total} approved
            </span>
          </div>
          <div className="jff-map">
            <svg
              viewBox="116 10 436 242"
              preserveAspectRatio="xMidYMid meet"
              role="img"
              aria-label={`Sample map of inspection area B with ${total} sites. ${NEW_ID} is ${received ? `marked ${received}` : 'assigned and not yet received'}.`}
            >
              <defs>
                <pattern id="jff-blocks" width="64" height="46" patternUnits="userSpaceOnUse" patternTransform="rotate(-6)">
                  <rect x="4" y="4" width="56" height="38" rx="3" fill="#F7F9F4" />
                </pattern>
              </defs>
              <rect x="-640" y="-400" width="1920" height="1060" fill="url(#jff-blocks)" />
              <rect x="572" y="-90" width="170" height="146" rx="10" fill="#DCEAD2" />
              <g fill="none" strokeLinecap="round">
                {STREETS.map((d) => (
                  <path key={d} d={d} stroke="#D3DCCD" strokeWidth="10" />
                ))}
                {STREETS.map((d) => (
                  <path key={`${d}-in`} d={d} stroke="#fff" strokeWidth="7" />
                ))}
              </g>
              <path d={AREA} fill="#D7F24A" fillOpacity="0.24" stroke="#113B2B" strokeWidth="1.6" strokeLinejoin="round" />
              <text x="174" y="68" className="jff-map__label">
                INSPECTION AREA B
              </text>
              {SITES.map((site) => (
                <circle key={site.id} cx={site.x} cy={site.y} r="7" fill={COLOR[site.condition]} stroke="#fff" strokeWidth="2" />
              ))}
              <g transform={`translate(${NEW_POINT.x} ${NEW_POINT.y})`}>
                {received ? (
                  <g className="jff-new" key={received}>
                    {status === 'review' && (
                      <circle className="jff-new__ring" r="16" fill="none" stroke={COLOR[received]} strokeWidth="1.5" />
                    )}
                    <circle r="8" fill={COLOR[received]} stroke="#fff" strokeWidth="2.5" />
                  </g>
                ) : (
                  <circle r="7" fill="#fff" stroke="#113B2B" strokeWidth="1.5" strokeDasharray="3 2.5" />
                )}
                <g transform="translate(-34 -38)">
                  <rect width="68" height="20" rx="4" fill="#113B2B" />
                  <text x="34" y="13.5" textAnchor="middle" className="jff-map__tag">
                    {NEW_ID}
                  </text>
                </g>
              </g>
            </svg>
            <ul className="jff-legend" aria-hidden="true">
              {CONDITIONS.map((item) => (
                <li key={item}>
                  <i style={{ background: COLOR[item] }} />
                  {item}
                </li>
              ))}
              <li>
                <i className="jff-legend__assigned" />
                Assigned
              </li>
            </ul>
          </div>
          <div className="jff-table">
            <table>
              <caption className="visually-hidden">Sample records in inspection area B</caption>
              <thead>
                <tr>
                  <th scope="col">Record</th>
                  <th scope="col">Condition</th>
                  <th scope="col">Status</th>
                </tr>
              </thead>
              <tbody>
                <tr className="jff-row-new" data-active={status === 'review' || undefined}>
                  <th scope="row">{NEW_ID}</th>
                  <td>
                    {received ? (
                      <>
                        <i className="jff-dot" style={{ background: COLOR[received] }} aria-hidden="true" />
                        {received}
                      </>
                    ) : (
                      <span className="jff-none">Not received</span>
                    )}
                  </td>
                  <td>
                    <span className="jff-chip" data-tone={row.tone} key={row.label}>
                      {row.label}
                    </span>
                  </td>
                </tr>
                {SITES.map((site) => (
                  <tr key={site.id}>
                    <th scope="row">{site.id}</th>
                    <td>
                      <i className="jff-dot" style={{ background: COLOR[site.condition] }} aria-hidden="true" />
                      {site.condition}
                    </td>
                    <td>
                      <span className="jff-chip" data-tone="ok">
                        Approved
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="jff-review" data-active={status === 'review' || undefined}>
            {status === 'review' ? (
              <>
                <span>
                  <b>{NEW_ID}</b> is waiting for review
                </span>
                <span className="jff-review__actions">
                  <button type="button" className="jff-return" onClick={() => decide('returned')}>
                    Return to field
                  </button>
                  <button type="button" className="jff-approve" onClick={() => decide('approved')}>
                    Approve
                  </button>
                </span>
              </>
            ) : (
              <span>{queue}</span>
            )}
          </div>
        </div>
      </div>

      <ol className="jff-steps" aria-label="Record lifecycle">
        {STEPS.map((label, i) => {
          const state = i < step ? 'done' : i === step ? 'current' : 'todo';
          return (
            <li key={label} data-state={state} aria-current={state === 'current' ? 'step' : undefined}>
              <span className="jff-steps__dot" aria-hidden="true">
                {state === 'done' && <Tick />}
              </span>
              <span className="jff-steps__text">
                <b>{label}</b>
                {captions[i] && <small>{captions[i]}</small>}
              </span>
            </li>
          );
        })}
      </ol>
      <p className="visually-hidden" aria-live="polite">
        {announcement}
      </p>
    </div>
  );
}
