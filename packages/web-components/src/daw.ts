import { html, type TemplateResult } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { LucentElement } from './base';

const clamp = (v: number, lo: number, hi: number): number => Math.min(hi, Math.max(lo, v));

// ─── lucent-knob ────────────────────────────────────────────────────────────
/** A rotary control (270° arc). Vertical drag / wheel / arrows adjust; dbl-click resets. */
@customElement('lucent-knob')
export class LucentKnob extends LucentElement {
  @property({ type: Number }) min = 0;
  @property({ type: Number }) max = 1;
  @property({ type: Number }) value = 0;
  @property({ type: Boolean }) bipolar = false;
  @property({ type: Boolean, reflect: true }) disabled = false;
  @property({ type: Number }) size = 72;

  private _default?: number;
  private _sy = 0;
  private _sv = 0;
  private _move?: (e: PointerEvent) => void;

  protected hostClasses(): string { return 'lucent-knob'; }

  connectedCallback(): void {
    super.connectedCallback();
    if (this._default === undefined) this._default = this.value;
    this.setAttribute('role', 'slider');
    this.addEventListener('pointerdown', this._onDown);
    this.addEventListener('wheel', this._onWheel, { passive: false });
    this.addEventListener('keydown', this._onKey);
    this.addEventListener('dblclick', this._onDbl);
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    this.removeEventListener('pointerdown', this._onDown);
    this.removeEventListener('wheel', this._onWheel);
    this.removeEventListener('keydown', this._onKey);
    this.removeEventListener('dblclick', this._onDbl);
  }

  private _set(v: number): void {
    const nv = clamp(v, this.min, this.max);
    if (nv === this.value) return;
    this.value = nv;
    this.dispatchEvent(new CustomEvent('input', { detail: { value: nv }, bubbles: true }));
  }

  private _onDown = (e: PointerEvent): void => {
    if (this.disabled) return;
    this._sy = e.clientY; this._sv = this.value;
    try { this.setPointerCapture(e.pointerId); } catch { /* capture optional (throws on synthetic pointers) */ }
    this._move = (ev: PointerEvent) => this._set(this._sv + (this._sy - ev.clientY) / 180 * (this.max - this.min));
    this.addEventListener('pointermove', this._move);
    this.addEventListener('pointerup', () => {
      if (this._move) this.removeEventListener('pointermove', this._move);
      this.dispatchEvent(new CustomEvent('change', { detail: { value: this.value }, bubbles: true }));
    }, { once: true });
    e.preventDefault();
  };

  private _onWheel = (e: WheelEvent): void => {
    if (this.disabled) return;
    e.preventDefault();
    const step = (this.max - this.min) / 100;
    this._set(this.value - Math.sign(e.deltaY) * step * (e.shiftKey ? 0.2 : 1));
  };

  private _onKey = (e: KeyboardEvent): void => {
    if (this.disabled) return;
    const step = (this.max - this.min) / (e.shiftKey ? 200 : 20);
    if (e.key === 'ArrowUp' || e.key === 'ArrowRight') { e.preventDefault(); this._set(this.value + step); }
    else if (e.key === 'ArrowDown' || e.key === 'ArrowLeft') { e.preventDefault(); this._set(this.value - step); }
  };

  private _onDbl = (): void => { if (!this.disabled && this._default !== undefined) this._set(this._default); };

  protected render(): TemplateResult {
    const s = this.size, r = s * 0.34, cx = s / 2, cy = s / 2, w = s * 0.08;
    const t = (this.value - this.min) / (this.max - this.min);
    const A0 = 135, A1 = 405, cur = A0 + t * 270;
    const pol = (deg: number, rr: number): [number, number] => { const a = deg * Math.PI / 180; return [cx + rr * Math.cos(a), cy + rr * Math.sin(a)]; };
    const arc = (a: number, b: number, rr: number): string => {
      const [x0, y0] = pol(a, rr), [x1, y1] = pol(b, rr);
      const lg = (b - a) > 180 ? 1 : 0;
      return `M${x0.toFixed(2)} ${y0.toFixed(2)} A${rr} ${rr} 0 ${lg} 1 ${x1.toFixed(2)} ${y1.toFixed(2)}`;
    };
    const from = this.bipolar ? 270 : A0;
    const [ix, iy] = pol(cur, r), [ix0, iy0] = pol(cur, r * 0.42);
    this.tabIndex = this.disabled ? -1 : 0;
    this.setAttribute('aria-valuenow', this.value.toFixed(2));
    this.setAttribute('aria-valuemin', String(this.min));
    this.setAttribute('aria-valuemax', String(this.max));
    return html`<svg width=${s} height=${s} viewBox="0 0 ${s} ${s}" aria-hidden="true">
      <path d=${arc(A0, A1, r)} fill="none" stroke="var(--color--semantic--border-default)" stroke-width=${w} stroke-linecap="round"></path>
      <path d=${arc(Math.min(from, cur), Math.max(from, cur), r)} fill="none" stroke="var(--color--semantic--accent-default)" stroke-width=${w} stroke-linecap="round"></path>
      <circle cx=${cx} cy=${cy} r=${r * 0.6} fill="var(--color--semantic--surface-raised)" stroke="var(--color--semantic--border-subtle)"></circle>
      <line x1=${ix0.toFixed(2)} y1=${iy0.toFixed(2)} x2=${ix.toFixed(2)} y2=${iy.toFixed(2)} stroke="var(--color--semantic--text-default)" stroke-width="2" stroke-linecap="round"></line>
    </svg>`;
  }
}

// ─── lucent-fader ───────────────────────────────────────────────────────────
/** A channel fader with a tapered dB scale (unity at 75% travel). Click/drag/wheel/arrows. */
@customElement('lucent-fader')
export class LucentFader extends LucentElement {
  @property({ type: Number }) min = -60;
  @property({ type: Number }) max = 6;
  @property({ type: Number }) value = 0;
  @property({ type: Number }) size = 200;
  @property({ type: Boolean, reflect: true }) disabled = false;

  private _move?: (e: PointerEvent) => void;

  protected hostClasses(): string { return 'lucent-fader'; }

  // Fader taper: unity (0 dB) sits at 75% of travel, like a real channel fader.
  private _dbToP(db: number): number { return db >= 0 ? 0.75 + (db / this.max) * 0.25 : 0.75 * (1 + db / (-this.min)); }
  private _pToDb(p: number): number { return p >= 0.75 ? (p - 0.75) / 0.25 * this.max : (p / 0.75 - 1) * (-this.min); }

  connectedCallback(): void {
    super.connectedCallback();
    this.setAttribute('role', 'slider');
    this.addEventListener('pointerdown', this._onDown);
    this.addEventListener('wheel', this._onWheel, { passive: false });
    this.addEventListener('keydown', this._onKey);
    this.addEventListener('dblclick', this._onDbl);
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    this.removeEventListener('pointerdown', this._onDown);
    this.removeEventListener('wheel', this._onWheel);
    this.removeEventListener('keydown', this._onKey);
    this.removeEventListener('dblclick', this._onDbl);
  }

  private _set(v: number): void {
    const nv = clamp(v, this.min, this.max);
    if (nv === this.value) return;
    this.value = nv;
    this.dispatchEvent(new CustomEvent('input', { detail: { value: nv }, bubbles: true }));
  }

  private _posFromEvent(e: PointerEvent): number {
    const track = this.querySelector<HTMLElement>('.lucent-fader__track');
    if (!track) return 0;
    const r = track.getBoundingClientRect();
    return clamp((r.bottom - e.clientY) / r.height, 0, 1);
  }

  private _onDown = (e: PointerEvent): void => {
    if (this.disabled) return;
    this._set(this._pToDb(this._posFromEvent(e)));
    try { this.setPointerCapture(e.pointerId); } catch { /* capture optional */ }
    this._move = (ev: PointerEvent) => this._set(this._pToDb(this._posFromEvent(ev)));
    this.addEventListener('pointermove', this._move);
    this.addEventListener('pointerup', () => {
      if (this._move) this.removeEventListener('pointermove', this._move);
      this.dispatchEvent(new CustomEvent('change', { detail: { value: this.value }, bubbles: true }));
    }, { once: true });
    e.preventDefault();
  };

  private _onWheel = (e: WheelEvent): void => { if (this.disabled) return; e.preventDefault(); this._set(this.value - Math.sign(e.deltaY) * (e.shiftKey ? 0.2 : 1)); };

  private _onKey = (e: KeyboardEvent): void => {
    if (this.disabled) return;
    const s = e.shiftKey ? 0.2 : 1;
    if (e.key === 'ArrowUp' || e.key === 'ArrowRight') { e.preventDefault(); this._set(this.value + s); }
    else if (e.key === 'ArrowDown' || e.key === 'ArrowLeft') { e.preventDefault(); this._set(this.value - s); }
  };

  private _onDbl = (): void => { if (!this.disabled) this._set(0); };

  protected render(): TemplateResult {
    const W = 40, H = this.size;
    const y = this._dbToP(this.value) * H;
    const ticks = [6, -6, -12, -24, -48];
    this.style.width = `${W}px`; this.style.height = `${H}px`;
    this.tabIndex = this.disabled ? -1 : 0;
    this.setAttribute('aria-valuenow', this.value.toFixed(1));
    this.setAttribute('aria-valuemin', String(this.min));
    this.setAttribute('aria-valuemax', String(this.max));
    return html`
      <div class="lucent-fader__track" style="left:${W / 2 - 3}px;top:0;width:6px;height:${H}px"></div>
      <div class="lucent-fader__fill" style="left:${W / 2 - 3}px;width:6px;bottom:0;height:${y}px"></div>
      ${ticks.map((db) => html`<div class="lucent-fader__tick" style="left:${W / 2 + 6}px;width:5px;height:1px;bottom:${this._dbToP(db) * H - 0.5}px"></div>`)}
      <div class="lucent-fader__unity" style="left:${W / 2 - 9}px;width:18px;height:2px;bottom:${this._dbToP(0) * H - 1}px"></div>
      <div class="lucent-fader__thumb" style="left:${W / 2 - 14}px;width:28px;height:12px;bottom:${y - 6}px"></div>`;
  }
}

// ─── lucent-meter ───────────────────────────────────────────────────────────
/** A segmented level meter (mono or stereo) with green→amber→red zones and peak-hold.
 *  Drive it each animation frame by assigning the `level` property (dB per channel). */
@customElement('lucent-meter')
export class LucentMeter extends LucentElement {
  @property({ type: Number }) segments = 14;
  @property({ type: Boolean }) stereo = false;
  @property({ type: Number }) min = -60;
  @property({ type: Number }) max = 0;

  @state() private _cur: number[] = [];
  @state() private _peak: number[] = [];

  protected hostClasses(): string { return 'lucent-meter'; }

  private get _chans(): number { return this.stereo ? 2 : 1; }

  connectedCallback(): void {
    super.connectedCallback();
    this.setAttribute('role', 'meter');
    if (this._cur.length === 0) { this._cur = new Array(this._chans).fill(this.min); this._peak = new Array(this._chans).fill(this.min); }
  }

  /** Current level in dB per channel (e.g. `[-12]` mono or `[-12, -9]` stereo). */
  set level(arr: number[]) {
    this._cur = arr;
    this._peak = arr.map((v, i) => Math.max(v, (this._peak[i] ?? this.min) - 0.7));
    this.setAttribute('aria-valuenow', arr.map((v) => v.toFixed(0)).join('/'));
  }
  get level(): number[] { return this._cur; }

  private _zone(i: number, n: number): 'red' | 'amber' | 'green' { return i >= n - 2 ? 'red' : i >= n - 5 ? 'amber' : 'green'; }

  protected render(): TemplateResult {
    const n = this.segments, range = this.max - this.min;
    const cur = this._cur.length ? this._cur : new Array(this._chans).fill(this.min);
    const peak = this._peak.length ? this._peak : new Array(this._chans).fill(this.min);
    return html`${cur.map((cv, c) => {
      const lit = Math.round(((cv - this.min) / range) * n);
      const peakIdx = Math.min(n - 1, Math.floor(((peak[c] - this.min) / range) * n));
      return html`<div class="lucent-meter__col">${Array.from({ length: n }, (_, i) => {
        const on = i < lit || (i === peakIdx && peak[c] > this.min);
        return html`<div class=${on ? `lucent-meter__seg is-on lucent-meter__seg--${this._zone(i, n)}` : 'lucent-meter__seg'}></div>`;
      })}</div>`;
    })}`;
  }
}

// ─── lucent-waveform ────────────────────────────────────────────────────────
/** A canvas peak-rendered waveform. Click/drag to seek; played portion is solid, rest faded. */
@customElement('lucent-waveform')
export class LucentWaveform extends LucentElement {
  @property({ type: Number }) height = 96;
  @property({ type: Number }) progress = 0;
  @property({ attribute: false }) peaks: number[] = [];

  private _canvas?: HTMLCanvasElement;
  private _ctx?: CanvasRenderingContext2D | null;
  private _ro?: ResizeObserver;
  private _move?: (e: PointerEvent) => void;

  protected hostClasses(): string { return 'lucent-waveform'; }

  protected firstUpdated(): void {
    this._canvas = this.querySelector('canvas') ?? undefined;
    this._ctx = this._canvas?.getContext('2d');
    this.setAttribute('role', 'slider');
    this.addEventListener('pointerdown', this._onDown);
    this._ro = new ResizeObserver(() => this._draw());
    this._ro.observe(this);
    this._draw();
  }

  protected updated(): void { this._draw(); }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    this._ro?.disconnect();
    this.removeEventListener('pointerdown', this._onDown);
  }

  private _seek(clientX: number): void {
    if (!this._canvas) return;
    const r = this._canvas.getBoundingClientRect();
    this.progress = clamp((clientX - r.left) / r.width, 0, 1);
    this.dispatchEvent(new CustomEvent('input', { detail: { progress: this.progress }, bubbles: true }));
  }

  private _onDown = (e: PointerEvent): void => {
    this._seek(e.clientX);
    try { this.setPointerCapture(e.pointerId); } catch { /* capture optional */ }
    this._move = (ev: PointerEvent) => this._seek(ev.clientX);
    this.addEventListener('pointermove', this._move);
    this.addEventListener('pointerup', () => {
      if (this._move) this.removeEventListener('pointermove', this._move);
      this.dispatchEvent(new CustomEvent('change', { detail: { progress: this.progress }, bubbles: true }));
    }, { once: true });
    e.preventDefault();
  };

  private _draw(): void {
    if (!this._ctx || !this._canvas) return;
    const dpr = window.devicePixelRatio || 1;
    const w = this.clientWidth || 520, h = this.height;
    this._canvas.width = w * dpr; this._canvas.height = h * dpr;
    this._canvas.style.width = `${w}px`; this._canvas.style.height = `${h}px`;
    const ctx = this._ctx; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, w, h);
    const mid = h / 2, peaks = this.peaks, n = peaks.length;
    if (!n) return;
    const playedX = this.progress * w;
    const cs = getComputedStyle(this);
    const solid = cs.getPropertyValue('--lucent-waveform-played').trim() || '#2f6f5b';
    const weak = cs.getPropertyValue('--lucent-waveform-unplayed').trim() || 'rgba(47,111,91,0.32)';
    const ph = cs.getPropertyValue('--lucent-waveform-playhead').trim() || '#143b30';
    for (let x = 0; x < w; x++) {
      const amp = peaks[Math.floor(x / w * n)] * (mid - 2);
      ctx.strokeStyle = x <= playedX ? solid : weak;
      ctx.beginPath(); ctx.moveTo(x + 0.5, mid - amp); ctx.lineTo(x + 0.5, mid + amp); ctx.stroke();
    }
    ctx.strokeStyle = ph; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(playedX, 0); ctx.lineTo(playedX, h); ctx.stroke();
    this.setAttribute('aria-valuenow', String(Math.round(this.progress * 100)));
  }

  protected render(): TemplateResult { return html`<canvas class="lucent-waveform__canvas"></canvas>`; }
}

declare global {
  interface HTMLElementTagNameMap {
    'lucent-knob': LucentKnob;
    'lucent-fader': LucentFader;
    'lucent-meter': LucentMeter;
    'lucent-waveform': LucentWaveform;
  }
}
