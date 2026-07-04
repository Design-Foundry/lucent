import { nothing } from 'lit';
import { customElement } from 'lit/decorators.js';
import { LucentSurface } from './base';

/**
 * The Track lane and Piano Roll are drag/resize/add/delete surfaces. They build their DOM
 * imperatively and mutate the dragged element directly (re-rendering only on add/delete — a
 * full re-render mid-drag would replace the node the listeners are bound to). They extend
 * LucentSurface, which renders its Lit template into a throwaway root, so the imperatively-built
 * light-DOM children on the host are never clobbered.
 */

const el = (tag: string, cls: string): HTMLElement => { const n = document.createElement(tag); n.className = cls; return n; };
const accent = (node: Element): string => getComputedStyle(node).getPropertyValue('--color--semantic--accent-default').trim() || '#2f6f5b';

function peaks(n: number, seed: number): number[] {
  const p: number[] = [];
  for (let i = 0; i < n; i++) {
    const t = i / n;
    const env = 0.25 + 0.75 * Math.abs(Math.sin(t * Math.PI * 4 + seed));
    p.push(Math.min(1, env * (Math.abs(Math.sin(i * 0.4 + seed)) * 0.5 + Math.random() * 0.55)));
  }
  return p;
}
function drawWave(canvas: HTMLCanvasElement, w: number, h: number, seed: number): void {
  const dpr = window.devicePixelRatio || 1;
  canvas.width = w * dpr; canvas.height = h * dpr; canvas.style.width = `${w}px`; canvas.style.height = `${h}px`;
  const ctx = canvas.getContext('2d'); if (!ctx) return;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  const pk = peaks(Math.max(2, Math.floor(w / 2)), seed), n = pk.length, mid = h / 2;
  ctx.strokeStyle = accent(canvas);
  for (let x = 0; x < w; x++) { const amp = pk[Math.floor(x / w * n)] * (mid - 3); ctx.beginPath(); ctx.moveTo(x + 0.5, mid - amp); ctx.lineTo(x + 0.5, mid + amp); ctx.stroke(); }
}

export interface TrackDef { name: string; kind: 'audio' | 'midi'; }
export interface ClipDef { t: number; start: number; len: number; kind: 'audio' | 'midi'; seed?: number; }

const BW = 68, LANE = 58, HEAD = 132, SPACER = 26;

// ─── lucent-track ───────────────────────────────────────────────────────────
/** An arrangement lane: track headers (M/S/R) + a bar ruler and clips that snap-drag to bars. */
@customElement('lucent-track')
export class LucentTrack extends LucentSurface {
  bars = 8;
  tracks: TrackDef[] = [{ name: 'Drums', kind: 'audio' }, { name: 'Bass', kind: 'midi' }, { name: 'Vocals', kind: 'audio' }];
  clips: ClipDef[] = [{ t: 0, start: 0, len: 8, kind: 'audio', seed: 1 }, { t: 1, start: 0, len: 8, kind: 'midi' }, { t: 2, start: 2, len: 5, kind: 'audio', seed: 3 }];
  playhead = 1.5;
  private _built = false;

  protected hostClasses(): string { return 'lucent-track'; }
  protected render(): typeof nothing { return nothing; }

  connectedCallback(): void {
    super.connectedCallback();
    if (!this._built) { this._build(); this._built = true; }
  }

  private _build(): void {
    const BARS = this.bars;
    this.replaceChildren();

    const headers = el('div', 'lucent-track__headers'); headers.style.width = `${HEAD}px`;
    const spacer = el('div', 'lucent-track__hd-spacer'); spacer.style.height = `${SPACER}px`; headers.appendChild(spacer);
    this.tracks.forEach((tr) => {
      const hd = el('div', 'lucent-track__hd'); hd.style.height = `${LANE}px`;
      const nm = el('div', 'lucent-track__nm');
      const dot = el('span', 'lucent-track__dot'); dot.style.background = tr.kind === 'audio' ? 'var(--color--semantic--accent-default)' : 'var(--lucent-daw-midi)';
      nm.append(dot, document.createTextNode(tr.name));
      const btns = el('div', 'lucent-track__btns');
      (['M', 'S', 'R'] as const).forEach((k) => {
        const b = el('button', 'lucent-track__btn'); b.dataset.k = k; b.textContent = k;
        b.addEventListener('click', () => b.classList.toggle('is-on'));
        btns.appendChild(b);
      });
      hd.append(nm, btns); headers.appendChild(hd);
    });

    const timeline = el('div', 'lucent-track__timeline'); timeline.style.width = `${BARS * BW}px`;
    const ruler = el('div', 'lucent-track__ruler'); ruler.style.height = `${SPACER}px`;
    for (let b = 0; b < BARS; b++) { const bar = el('div', 'lucent-track__bar'); bar.style.left = `${b * BW}px`; bar.textContent = String(b + 1); ruler.appendChild(bar); }
    const lanes = el('div', 'lucent-track__lanes');
    const playheadEl = el('div', 'lucent-track__playhead');
    timeline.append(ruler, lanes, playheadEl);

    this.tracks.forEach(() => {
      const lane = el('div', 'lucent-track__lane'); lane.style.height = `${LANE}px`;
      for (let b = 1; b < BARS; b++) { const g = el('div', 'lucent-track__grid'); g.style.left = `${b * BW}px`; lane.appendChild(g); }
      lanes.appendChild(lane);
    });

    const positionClip = (clipEl: HTMLElement, clip: ClipDef) => { clipEl.style.left = `${clip.start * BW}px`; clipEl.style.width = `${clip.len * BW - 2}px`; };
    this.clips.forEach((clip, idx) => {
      const lane = lanes.children[clip.t] as HTMLElement;
      const clipEl = el('div', `lucent-track__clip lucent-track__clip--${clip.kind}`); clipEl.dataset.idx = String(idx);
      positionClip(clipEl, clip);
      lane.appendChild(clipEl);
      if (clip.kind === 'audio') {
        const cv = document.createElement('canvas'); clipEl.appendChild(cv);
        requestAnimationFrame(() => drawWave(cv, clip.len * BW - 4, LANE - 12, clip.seed ?? 1));
      } else {
        for (let s = 0; s < 22; s++) {
          const nt = el('div', 'lucent-track__note');
          const bar = (s * 0.36) % clip.len, pitch = (s * 3) % 7;
          nt.style.left = `${bar * BW + 3}px`; nt.style.width = `${BW * 0.28}px`; nt.style.top = `${8 + pitch * 5.5}px`;
          clipEl.appendChild(nt);
        }
      }
    });

    const setPlayhead = (bar: number) => { this.playhead = Math.min(BARS, Math.max(0, bar)); playheadEl.style.left = `${this.playhead * BW}px`; };
    setPlayhead(this.playhead);
    const seek = (e: PointerEvent) => { const r = ruler.getBoundingClientRect(); setPlayhead((e.clientX - r.left) / BW); };
    ruler.addEventListener('pointerdown', (e) => {
      seek(e); try { ruler.setPointerCapture(e.pointerId); } catch { /* optional */ }
      const mv = seek; ruler.addEventListener('pointermove', mv);
      ruler.addEventListener('pointerup', () => ruler.removeEventListener('pointermove', mv), { once: true });
    });

    lanes.addEventListener('pointerdown', (e) => {
      const clipEl = (e.target as HTMLElement).closest('.lucent-track__clip') as HTMLElement | null;
      if (!clipEl) return;
      const clip = this.clips[Number(clipEl.dataset.idx)]; const startX = e.clientX, orig = clip.start;
      clipEl.classList.add('is-dragging'); try { clipEl.setPointerCapture(e.pointerId); } catch { /* optional */ }
      const mv = (ev: PointerEvent) => { const dx = ev.clientX - startX; clipEl.style.left = `${Math.max(0, Math.min((BARS - clip.len) * BW, orig * BW + dx))}px`; };
      const up = () => {
        clipEl.removeEventListener('pointermove', mv); clipEl.classList.remove('is-dragging');
        const snapped = Math.round(parseFloat(clipEl.style.left) / BW);
        clip.start = Math.max(0, Math.min(BARS - clip.len, snapped)); positionClip(clipEl, clip);
      };
      clipEl.addEventListener('pointermove', mv); clipEl.addEventListener('pointerup', up, { once: true }); e.preventDefault();
    });

    this.append(headers, timeline);
  }
}

export interface PianoNote { p: number; s: number; l: number; }

const PITCHES = 24, ROWH = 15, BEATS = 16, BEATW = 40, KEYW = 48, SNAP = 0.25, BASE = 48;
const rowMidi = (r: number): number => BASE + (PITCHES - 1 - r);
const rowForMidi = (m: number): number => PITCHES - 1 - (m - BASE);
const isBlack = (m: number): boolean => [1, 3, 6, 8, 10].includes(((m % 12) + 12) % 12);
const NOTE_NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
const nameOf = (m: number): string => NOTE_NAMES[m % 12] + (Math.floor(m / 12) - 1);
const snap = (v: number): number => Math.round(v / SNAP) * SNAP;

// ─── lucent-piano-roll ──────────────────────────────────────────────────────
/** A pitch × time note grid: drag to move (pitch+time), drag the edge to resize, click to add,
 *  select + Delete to remove, drag the ruler for the playhead. Snaps to 1/4 beat. */
@customElement('lucent-piano-roll')
export class LucentPianoRoll extends LucentSurface {
  notes: PianoNote[] = [
    { p: 60, s: 0, l: 1 }, { p: 62, s: 1, l: 1 }, { p: 64, s: 2, l: 1 }, { p: 65, s: 3, l: 0.5 },
    { p: 67, s: 4, l: 2 }, { p: 64, s: 6, l: 1 }, { p: 60, s: 7, l: 1 }, { p: 69, s: 8, l: 2 },
    { p: 67, s: 10, l: 1 }, { p: 65, s: 11, l: 1 }, { p: 64, s: 12, l: 2 },
  ];
  playhead = 4;

  private _selected: PianoNote | null = null;
  private _notesLayer?: HTMLElement;
  private _built = false;
  private _onKey = (e: KeyboardEvent): void => {
    if ((e.key === 'Delete' || e.key === 'Backspace') && this._selected) {
      this.notes = this.notes.filter((x) => x !== this._selected); this._selected = null; this._renderNotes(); e.preventDefault();
    }
  };

  protected hostClasses(): string { return 'lucent-piano-roll'; }
  protected render(): typeof nothing { return nothing; }

  connectedCallback(): void {
    super.connectedCallback();
    if (!this._built) { this._build(); this._built = true; }
    document.addEventListener('keydown', this._onKey);
  }
  disconnectedCallback(): void { super.disconnectedCallback(); document.removeEventListener('keydown', this._onKey); }

  private _build(): void {
    this.replaceChildren();
    const GW = BEATS * BEATW, GH = PITCHES * ROWH;

    const top = el('div', 'lucent-piano-roll__top');
    const corner = el('div', 'lucent-piano-roll__corner'); corner.style.width = `${KEYW}px`; corner.style.height = '22px';
    const ruler = el('div', 'lucent-piano-roll__ruler'); ruler.style.width = `${GW}px`; ruler.style.height = '22px';
    top.append(corner, ruler);

    const body = el('div', 'lucent-piano-roll__body');
    const keys = el('div', 'lucent-piano-roll__keys'); keys.style.width = `${KEYW}px`; keys.style.height = `${GH}px`;
    const grid = el('div', 'lucent-piano-roll__grid'); grid.style.width = `${GW}px`; grid.style.height = `${GH}px`;
    body.append(keys, grid);

    for (let b = 0; b < BEATS / 4; b++) { const bar = el('div', 'lucent-piano-roll__bar'); bar.style.left = `${b * 4 * BEATW}px`; bar.textContent = String(b + 1); ruler.appendChild(bar); }
    for (let r = 0; r < PITCHES; r++) {
      const m = rowMidi(r), black = isBlack(m);
      const k = el('div', `lucent-piano-roll__key lucent-piano-roll__key--${black ? 'black' : 'white'}`); k.style.height = `${ROWH}px`;
      k.textContent = (m % 12 === 0) ? nameOf(m) : '';
      keys.appendChild(k);
      const row = el('div', `lucent-piano-roll__row lucent-piano-roll__row--${black ? 'black' : 'white'}`);
      row.style.top = `${r * ROWH}px`; row.style.height = `${ROWH}px`;
      grid.appendChild(row);
    }
    for (let bt = 1; bt < BEATS; bt++) {
      const v = el('div', 'lucent-piano-roll__vline'); v.style.left = `${bt * BEATW}px`;
      v.style.borderLeft = `1px solid ${bt % 4 === 0 ? 'var(--color--semantic--border-default)' : 'var(--color--semantic--border-subtle)'}`;
      grid.appendChild(v);
    }
    const notesLayer = el('div', 'lucent-piano-roll__notes'); notesLayer.style.cssText = 'position:absolute;inset:0;';
    grid.appendChild(notesLayer); this._notesLayer = notesLayer;
    const ph = el('div', 'lucent-piano-roll__playhead'); grid.appendChild(ph);

    this._renderNotes();
    const setPlayhead = (b: number) => { this.playhead = Math.min(BEATS, Math.max(0, b)); ph.style.left = `${this.playhead * BEATW}px`; };
    setPlayhead(this.playhead);

    ruler.addEventListener('pointerdown', (e) => {
      const seek = (ev: PointerEvent) => { const r = ruler.getBoundingClientRect(); setPlayhead(snap((ev.clientX - r.left) / BEATW)); };
      seek(e); try { ruler.setPointerCapture(e.pointerId); } catch { /* optional */ }
      const mv = seek; ruler.addEventListener('pointermove', mv);
      ruler.addEventListener('pointerup', () => ruler.removeEventListener('pointermove', mv), { once: true });
    });

    grid.addEventListener('pointerdown', (e) => {
      const gr = grid.getBoundingClientRect();
      const handle = (e.target as HTMLElement).closest('.lucent-piano-roll__handle');
      const noteEl = (e.target as HTMLElement).closest('.lucent-piano-roll__note') as HTMLElement | null;
      if (handle && noteEl) {
        const n = this.notes[Number(noteEl.dataset.i)]; this._select(n, noteEl);
        const sx = e.clientX, ol = n.l;
        try { noteEl.setPointerCapture(e.pointerId); } catch { /* optional */ }
        const mv = (ev: PointerEvent) => { n.l = Math.max(SNAP, Math.min(BEATS - n.s, snap(ol + (ev.clientX - sx) / BEATW))); noteEl.style.width = `${n.l * BEATW - 1}px`; };
        noteEl.addEventListener('pointermove', mv); noteEl.addEventListener('pointerup', () => noteEl.removeEventListener('pointermove', mv), { once: true });
        e.preventDefault(); return;
      }
      if (noteEl) {
        const n = this.notes[Number(noteEl.dataset.i)]; this._select(n, noteEl);
        const sx = e.clientX, sy = e.clientY, os = n.s, op = n.p;
        try { noteEl.setPointerCapture(e.pointerId); } catch { /* optional */ }
        const mv = (ev: PointerEvent) => {
          n.s = Math.max(0, Math.min(BEATS - n.l, snap(os + (ev.clientX - sx) / BEATW)));
          n.p = Math.max(BASE, Math.min(BASE + PITCHES - 1, op - Math.round((ev.clientY - sy) / ROWH)));
          noteEl.style.left = `${n.s * BEATW}px`; noteEl.style.top = `${rowForMidi(n.p) * ROWH + 1}px`;
        };
        noteEl.addEventListener('pointermove', mv); noteEl.addEventListener('pointerup', () => noteEl.removeEventListener('pointermove', mv), { once: true });
        e.preventDefault(); return;
      }
      // empty grid → add a note
      const s = Math.max(0, Math.min(BEATS - 1, snap((e.clientX - gr.left) / BEATW)));
      const p = rowMidi(Math.max(0, Math.min(PITCHES - 1, Math.floor((e.clientY - gr.top) / ROWH))));
      const n: PianoNote = { p, s, l: 1 }; this.notes.push(n); this._selected = n; this._renderNotes();
    });

    this.append(top, body);
  }

  private _select(n: PianoNote, noteEl: HTMLElement): void {
    this._selected = n;
    this._notesLayer?.querySelectorAll('.lucent-piano-roll__note.is-selected').forEach((x) => x.classList.remove('is-selected'));
    noteEl.classList.add('is-selected');
  }

  private _renderNotes(): void {
    const layer = this._notesLayer; if (!layer) return;
    layer.replaceChildren();
    this.notes.forEach((n, i) => {
      const note = el('div', `lucent-piano-roll__note${n === this._selected ? ' is-selected' : ''}`); note.dataset.i = String(i);
      note.style.left = `${n.s * BEATW}px`; note.style.top = `${rowForMidi(n.p) * ROWH + 1}px`;
      note.style.width = `${n.l * BEATW - 1}px`; note.style.height = `${ROWH - 2}px`;
      note.appendChild(el('div', 'lucent-piano-roll__handle'));
      layer.appendChild(note);
    });
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'lucent-track': LucentTrack;
    'lucent-piano-roll': LucentPianoRoll;
  }
}
