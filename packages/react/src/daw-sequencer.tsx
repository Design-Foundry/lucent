import { useEffect, useRef, useState } from 'react';
import { cx } from './cx';

/**
 * The Track lane and Piano Roll are drag/resize/add/delete surfaces. During a drag they mutate the
 * dragged DOM element's style directly (via a captured ref) and only commit to React state on
 * pointer-up — a setState per move would re-render and fight the drag. Window listeners hold the
 * element ref in a closure, so React re-renders (which reuse the keyed node) never break the drag.
 */

const peaksFor = (n: number, seed: number): number[] => {
  const p: number[] = [];
  for (let i = 0; i < n; i++) {
    const t = i / n;
    const env = 0.25 + 0.75 * Math.abs(Math.sin(t * Math.PI * 4 + seed));
    p.push(Math.min(1, env * (Math.abs(Math.sin(i * 0.4 + seed)) * 0.5 + Math.random() * 0.55)));
  }
  return p;
};
const drawWave = (canvas: HTMLCanvasElement, w: number, h: number, seed: number): void => {
  const dpr = window.devicePixelRatio || 1;
  canvas.width = w * dpr; canvas.height = h * dpr; canvas.style.width = `${w}px`; canvas.style.height = `${h}px`;
  const ctx = canvas.getContext('2d'); if (!ctx) return;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  const pk = peaksFor(Math.max(2, Math.floor(w / 2)), seed), n = pk.length, mid = h / 2;
  ctx.strokeStyle = getComputedStyle(canvas).getPropertyValue('--color--semantic--accent-default').trim() || '#2f6f5b';
  for (let x = 0; x < w; x++) { const amp = pk[Math.floor(x / w * n)] * (mid - 3); ctx.beginPath(); ctx.moveTo(x + 0.5, mid - amp); ctx.lineTo(x + 0.5, mid + amp); ctx.stroke(); }
};

// ─── Track ──────────────────────────────────────────────────────────────────
export interface TrackDef { name: string; kind: 'audio' | 'midi'; }
export interface ClipDef { t: number; start: number; len: number; kind: 'audio' | 'midi'; seed?: number; }

const BW = 68, LANE = 58, HEAD = 132, SPACER = 26;
const DEFAULT_TRACKS: TrackDef[] = [{ name: 'Drums', kind: 'audio' }, { name: 'Bass', kind: 'midi' }, { name: 'Vocals', kind: 'audio' }];
const DEFAULT_CLIPS: ClipDef[] = [{ t: 0, start: 0, len: 8, kind: 'audio', seed: 1 }, { t: 1, start: 0, len: 8, kind: 'midi' }, { t: 2, start: 2, len: 5, kind: 'audio', seed: 3 }];

export interface TrackProps {
  bars?: number;
  tracks?: TrackDef[];
  clips?: ClipDef[];
  className?: string;
}

function ClipWaveform({ len, seed }: { len: number; seed: number }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => { const cv = ref.current; if (cv) drawWave(cv, len * BW - 4, LANE - 12, seed); }, [len, seed]);
  return <canvas ref={ref} />;
}

/** An arrangement lane: track headers (M/S/R) + a bar ruler and clips that snap-drag to bars. */
export function Track({ bars = 8, tracks = DEFAULT_TRACKS, clips: clipsProp = DEFAULT_CLIPS, className }: TrackProps) {
  const [clips, setClips] = useState<ClipDef[]>(() => clipsProp.map((c) => ({ ...c })));
  const [toggles, setToggles] = useState<Record<string, boolean>>({});
  const [playhead, setPlayhead] = useState(1.5);
  const rulerRef = useRef<HTMLDivElement>(null);

  const seek = (clientX: number) => {
    const r = rulerRef.current?.getBoundingClientRect();
    if (r) setPlayhead(Math.min(bars, Math.max(0, (clientX - r.left) / BW)));
  };
  const onRulerDown = (e: React.PointerEvent) => {
    seek(e.clientX);
    const move = (ev: PointerEvent) => seek(ev.clientX);
    const up = () => { window.removeEventListener('pointermove', move); window.removeEventListener('pointerup', up); };
    window.addEventListener('pointermove', move); window.addEventListener('pointerup', up);
  };

  const onClipDown = (e: React.PointerEvent, idx: number) => {
    const el = e.currentTarget as HTMLElement;
    const clip = clips[idx]; const startX = e.clientX, orig = clip.start;
    el.classList.add('is-dragging');
    try { el.setPointerCapture(e.pointerId); } catch { /* capture optional */ }
    const move = (ev: PointerEvent) => { const dx = ev.clientX - startX; el.style.left = `${Math.max(0, Math.min((bars - clip.len) * BW, orig * BW + dx))}px`; };
    const up = () => {
      window.removeEventListener('pointermove', move); window.removeEventListener('pointerup', up);
      el.classList.remove('is-dragging');
      const snapped = Math.max(0, Math.min(bars - clip.len, Math.round(parseFloat(el.style.left) / BW)));
      setClips((cs) => cs.map((c, i) => (i === idx ? { ...c, start: snapped } : c)));
    };
    window.addEventListener('pointermove', move); window.addEventListener('pointerup', up);
    e.preventDefault();
  };

  return (
    <div className={cx('lucent-track', className)}>
      <div className="lucent-track__headers" style={{ width: HEAD }}>
        <div className="lucent-track__hd-spacer" style={{ height: SPACER }} />
        {tracks.map((tr, i) => (
          <div key={i} className="lucent-track__hd" style={{ height: LANE }}>
            <div className="lucent-track__nm">
              <span className="lucent-track__dot" style={{ background: tr.kind === 'audio' ? 'var(--color--semantic--accent-default)' : 'var(--lucent-daw-midi)' }} />
              {tr.name}
            </div>
            <div className="lucent-track__btns">
              {(['M', 'S', 'R'] as const).map((k) => {
                const key = `${i}-${k}`;
                return <button key={k} type="button" data-k={k} className={cx('lucent-track__btn', toggles[key] && 'is-on')} onClick={() => setToggles((t) => ({ ...t, [key]: !t[key] }))}>{k}</button>;
              })}
            </div>
          </div>
        ))}
      </div>
      <div className="lucent-track__timeline" style={{ width: bars * BW }}>
        <div ref={rulerRef} className="lucent-track__ruler" style={{ height: SPACER }} onPointerDown={onRulerDown}>
          {Array.from({ length: bars }, (_, b) => <div key={b} className="lucent-track__bar" style={{ left: b * BW }}>{b + 1}</div>)}
        </div>
        <div className="lucent-track__lanes">
          {tracks.map((_, ti) => (
            <div key={ti} className="lucent-track__lane" style={{ height: LANE }}>
              {Array.from({ length: bars - 1 }, (_, b) => <div key={b} className="lucent-track__grid" style={{ left: (b + 1) * BW }} />)}
              {clips.map((clip, idx) => clip.t === ti && (
                <div
                  key={idx}
                  className={`lucent-track__clip lucent-track__clip--${clip.kind}`}
                  style={{ left: clip.start * BW, width: clip.len * BW - 2 }}
                  onPointerDown={(e) => onClipDown(e, idx)}
                >
                  {clip.kind === 'audio'
                    ? <ClipWaveform len={clip.len} seed={clip.seed ?? 1} />
                    : Array.from({ length: 22 }, (_, s) => {
                        const bar = (s * 0.36) % clip.len, pitch = (s * 3) % 7;
                        return <div key={s} className="lucent-track__note" style={{ left: bar * BW + 3, width: BW * 0.28, top: 8 + pitch * 5.5 }} />;
                      })}
                </div>
              ))}
            </div>
          ))}
        </div>
        <div className="lucent-track__playhead" style={{ left: playhead * BW }} />
      </div>
    </div>
  );
}

// ─── Piano Roll ───────────────────────────────────────────────────────────────
export interface PianoNote { p: number; s: number; l: number; }

const PITCHES = 24, ROWH = 15, BEATS = 16, BEATW = 40, KEYW = 48, SNAP = 0.25, BASE = 48;
const rowMidi = (r: number): number => BASE + (PITCHES - 1 - r);
const rowForMidi = (m: number): number => PITCHES - 1 - (m - BASE);
const isBlack = (m: number): boolean => [1, 3, 6, 8, 10].includes(((m % 12) + 12) % 12);
const NOTE_NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
const nameOf = (m: number): string => NOTE_NAMES[m % 12] + (Math.floor(m / 12) - 1);
const snap = (v: number): number => Math.round(v / SNAP) * SNAP;

const DEFAULT_NOTES: PianoNote[] = [
  { p: 60, s: 0, l: 1 }, { p: 62, s: 1, l: 1 }, { p: 64, s: 2, l: 1 }, { p: 65, s: 3, l: 0.5 },
  { p: 67, s: 4, l: 2 }, { p: 64, s: 6, l: 1 }, { p: 60, s: 7, l: 1 }, { p: 69, s: 8, l: 2 },
  { p: 67, s: 10, l: 1 }, { p: 65, s: 11, l: 1 }, { p: 64, s: 12, l: 2 },
];

export interface PianoRollProps {
  notes?: PianoNote[];
  className?: string;
}

/** A pitch × time note grid: drag to move, drag the edge to resize, click to add, select + Delete
 *  to remove, drag the ruler for the playhead. Snaps to 1/4 beat. */
export function PianoRoll({ notes: notesProp = DEFAULT_NOTES, className }: PianoRollProps) {
  const [notes, setNotes] = useState<PianoNote[]>(() => notesProp.map((n) => ({ ...n })));
  const [selected, setSelected] = useState<number | null>(null);
  const [playhead, setPlayhead] = useState(4);
  const gridRef = useRef<HTMLDivElement>(null);
  const rulerRef = useRef<HTMLDivElement>(null);
  const notesRef = useRef(notes);
  notesRef.current = notes;
  const selRef = useRef(selected);
  selRef.current = selected;

  const GW = BEATS * BEATW, GH = PITCHES * ROWH;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.key === 'Delete' || e.key === 'Backspace') && selRef.current !== null) {
        const sel = selRef.current;
        setNotes((ns) => ns.filter((_, i) => i !== sel));
        setSelected(null);
        e.preventDefault();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  const onRulerDown = (e: React.PointerEvent) => {
    const seek = (clientX: number) => { const r = rulerRef.current?.getBoundingClientRect(); if (r) setPlayhead(Math.min(BEATS, Math.max(0, snap((clientX - r.left) / BEATW)))); };
    seek(e.clientX);
    const move = (ev: PointerEvent) => seek(ev.clientX);
    const up = () => { window.removeEventListener('pointermove', move); window.removeEventListener('pointerup', up); };
    window.addEventListener('pointermove', move); window.addEventListener('pointerup', up);
  };

  const onGridDown = (e: React.PointerEvent) => {
    const target = e.target as HTMLElement;
    const handle = target.closest('.lucent-piano-roll__handle');
    const noteEl = target.closest('.lucent-piano-roll__note') as HTMLElement | null;

    if (handle && noteEl) {
      const idx = Number(noteEl.dataset.i); const n = { ...notesRef.current[idx] };
      setSelected(idx);
      const sx = e.clientX, ol = n.l;
      const move = (ev: PointerEvent) => { n.l = Math.max(SNAP, Math.min(BEATS - n.s, snap(ol + (ev.clientX - sx) / BEATW))); noteEl.style.width = `${n.l * BEATW - 1}px`; };
      const up = () => { window.removeEventListener('pointermove', move); window.removeEventListener('pointerup', up); setNotes((ns) => ns.map((x, i) => (i === idx ? n : x))); };
      window.addEventListener('pointermove', move); window.addEventListener('pointerup', up);
      e.preventDefault(); return;
    }
    if (noteEl) {
      const idx = Number(noteEl.dataset.i); const n = { ...notesRef.current[idx] };
      setSelected(idx);
      const sx = e.clientX, sy = e.clientY, os = n.s, op = n.p;
      const move = (ev: PointerEvent) => {
        n.s = Math.max(0, Math.min(BEATS - n.l, snap(os + (ev.clientX - sx) / BEATW)));
        n.p = Math.max(BASE, Math.min(BASE + PITCHES - 1, op - Math.round((ev.clientY - sy) / ROWH)));
        noteEl.style.left = `${n.s * BEATW}px`; noteEl.style.top = `${rowForMidi(n.p) * ROWH + 1}px`;
      };
      const up = () => { window.removeEventListener('pointermove', move); window.removeEventListener('pointerup', up); setNotes((ns) => ns.map((x, i) => (i === idx ? n : x))); };
      window.addEventListener('pointermove', move); window.addEventListener('pointerup', up);
      e.preventDefault(); return;
    }
    // empty grid → add a note
    const gr = gridRef.current?.getBoundingClientRect(); if (!gr) return;
    const s = Math.max(0, Math.min(BEATS - 1, snap((e.clientX - gr.left) / BEATW)));
    const p = rowMidi(Math.max(0, Math.min(PITCHES - 1, Math.floor((e.clientY - gr.top) / ROWH))));
    setNotes((ns) => { setSelected(ns.length); return [...ns, { p, s, l: 1 }]; });
  };

  return (
    <div className={cx('lucent-piano-roll', className)}>
      <div className="lucent-piano-roll__top">
        <div className="lucent-piano-roll__corner" style={{ width: KEYW, height: 22 }} />
        <div ref={rulerRef} className="lucent-piano-roll__ruler" style={{ width: GW, height: 22 }} onPointerDown={onRulerDown}>
          {Array.from({ length: BEATS / 4 }, (_, b) => <div key={b} className="lucent-piano-roll__bar" style={{ left: b * 4 * BEATW }}>{b + 1}</div>)}
        </div>
      </div>
      <div className="lucent-piano-roll__body">
        <div className="lucent-piano-roll__keys" style={{ width: KEYW, height: GH }}>
          {Array.from({ length: PITCHES }, (_, r) => {
            const m = rowMidi(r), black = isBlack(m);
            return <div key={r} className={`lucent-piano-roll__key lucent-piano-roll__key--${black ? 'black' : 'white'}`} style={{ height: ROWH }}>{m % 12 === 0 ? nameOf(m) : ''}</div>;
          })}
        </div>
        <div ref={gridRef} className="lucent-piano-roll__grid" style={{ width: GW, height: GH }} onPointerDown={onGridDown}>
          {Array.from({ length: PITCHES }, (_, r) => {
            const black = isBlack(rowMidi(r));
            return <div key={r} className={`lucent-piano-roll__row lucent-piano-roll__row--${black ? 'black' : 'white'}`} style={{ top: r * ROWH, height: ROWH }} />;
          })}
          {Array.from({ length: BEATS - 1 }, (_, i) => {
            const bt = i + 1;
            return <div key={bt} className="lucent-piano-roll__vline" style={{ left: bt * BEATW, borderLeft: `1px solid ${bt % 4 === 0 ? 'var(--color--semantic--border-default)' : 'var(--color--semantic--border-subtle)'}` }} />;
          })}
          <div style={{ position: 'absolute', inset: 0 }}>
            {notes.map((n, i) => (
              <div
                key={i}
                data-i={i}
                className={cx('lucent-piano-roll__note', selected === i && 'is-selected')}
                style={{ left: n.s * BEATW, top: rowForMidi(n.p) * ROWH + 1, width: n.l * BEATW - 1, height: ROWH - 2 }}
              >
                <div className="lucent-piano-roll__handle" />
              </div>
            ))}
          </div>
          <div className="lucent-piano-roll__playhead" style={{ left: playhead * BEATW }} />
        </div>
      </div>
    </div>
  );
}
