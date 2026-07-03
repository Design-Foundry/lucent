import { html, nothing, render, type TemplateResult } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { autoUpdate, computePosition, flip, offset, shift } from '@floating-ui/dom';
import { LucentElement } from './base';
import { cx } from './cx';
import type { ControlSize } from './foundations';
import './controls'; // ensures <lucent-icon-button> is registered for the header nav

const fmtDate = (d: Date): string => d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
const fmtMd = (d: Date): string => d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
/** "Jul 9 – 12, 2026" (same month) · "Sep 28 – Oct 3, 2026" (same year) · full both otherwise. */
const fmtRange = (s: Date, e?: Date): string => {
  if (!e) return fmtDate(s);
  if (s.getFullYear() === e.getFullYear() && s.getMonth() === e.getMonth()) return `${fmtMd(s)} – ${e.getDate()}, ${e.getFullYear()}`;
  return `${s.getFullYear() === e.getFullYear() ? fmtMd(s) : fmtDate(s)} – ${fmtDate(e)}`;
};

/** A time of day, 24-hour internally. */
export interface Time { hours: number; minutes: number; }
const to12h = (h: number): number => ((h + 11) % 12) + 1;
const periodOf = (h: number): 'AM' | 'PM' => (h < 12 ? 'AM' : 'PM');
const from12h = (h12: number, period: 'AM' | 'PM'): number => (period === 'PM' ? (h12 % 12) + 12 : h12 % 12);
const fmtTime = (t: Time): string => `${to12h(t.hours)}:${String(t.minutes).padStart(2, '0')} ${periodOf(t.hours)}`;

const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const sameDay = (a?: Date, b?: Date): boolean =>
  !!a && !!b && a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();

// ─── lucent-calendar ────────────────────────────────────────────────────────
/**
 * Month calendar — the date-picker atom the Date / Range / Time pickers compose.
 * Renders a Monday-first 6×7 grid of day cells with today / selected / range states.
 * Dates are set as properties (not attributes). Emits `change` (day click) and
 * `monthchange` (prev/next).
 */
@customElement('lucent-calendar')
export class LucentCalendar extends LucentElement {
  /** Any date within the month to display. */
  @property({ attribute: false }) month: Date = new Date();
  /** Selected date (single mode). */
  @property({ attribute: false }) value?: Date;
  @property() mode: 'single' | 'range' = 'single';
  @property({ attribute: false }) rangeStart?: Date;
  @property({ attribute: false }) rangeEnd?: Date;
  @property({ attribute: false }) min?: Date;
  @property({ attribute: false }) max?: Date;

  protected hostClasses(): string { return 'lucent-calendar'; }

  private _shift(delta: number): void {
    this.month = new Date(this.month.getFullYear(), this.month.getMonth() + delta, 1);
    this.dispatchEvent(new CustomEvent('monthchange', { detail: { month: this.month }, bubbles: true }));
  }

  private _select(date: Date): void {
    this.value = date;
    this.dispatchEvent(new CustomEvent('change', { detail: { value: date }, bubbles: true }));
  }

  private _disabled(date: Date): boolean {
    return (!!this.min && date < this.min) || (!!this.max && date > this.max);
  }

  private _cellClass(date: Date, outside: boolean): string {
    const inRange = this.rangeStart && this.rangeEnd && date > this.rangeStart && date < this.rangeEnd;
    return cx(
      'lucent-day-cell',
      outside && 'lucent-day-cell--outside',
      sameDay(date, new Date()) && 'is-today',
      this.mode === 'single' && sameDay(date, this.value) && 'is-selected',
      this.mode === 'range' && sameDay(date, this.rangeStart) && 'is-range-start',
      this.mode === 'range' && sameDay(date, this.rangeEnd) && 'is-range-end',
      this.mode === 'range' && inRange && 'is-range-middle',
    );
  }

  protected render(): TemplateResult {
    const y = this.month.getFullYear(), m = this.month.getMonth();
    const firstOffset = (new Date(y, m, 1).getDay() + 6) % 7; // Monday-first
    const cells: { date: Date; outside: boolean }[] = [];
    for (let i = 0; i < 42; i++) {
      const date = new Date(y, m, i - firstOffset + 1);
      cells.push({ date, outside: date.getMonth() !== m });
    }
    return html`
      <div class="lucent-calendar__header">
        <span class="lucent-calendar__title">${MONTHS[m]} ${y}</span>
        <div class="lucent-calendar__nav">
          <lucent-icon-button icon="chevron_left" variant="ghost" size="sm" label="Previous month" @click=${() => this._shift(-1)}></lucent-icon-button>
          <lucent-icon-button icon="chevron_right" variant="ghost" size="sm" label="Next month" @click=${() => this._shift(1)}></lucent-icon-button>
        </div>
      </div>
      <div class="lucent-calendar__weekdays">
        ${WEEKDAYS.map((d) => html`<span class="lucent-calendar__weekday">${d}</span>`)}
      </div>
      <div class="lucent-calendar__grid" role="grid">
        ${cells.map((c) => html`<button
          class=${this._cellClass(c.date, c.outside)}
          role="gridcell"
          ?disabled=${this._disabled(c.date)}
          aria-selected=${sameDay(c.date, this.value) ? 'true' : 'false'}
          @click=${() => this._select(c.date)}>${c.date.getDate()}</button>`)}
      </div>`;
  }
}

// ─── lucent-date-picker ─────────────────────────────────────────────────────
/** A field that opens the Calendar in a floating popover (single date). */
@customElement('lucent-date-picker')
export class LucentDatePicker extends LucentElement {
  @property({ attribute: false }) value?: Date;
  @property() label = '';
  @property() placeholder = 'Select date';
  @property() size: ControlSize = 'md';
  @property({ attribute: false }) min?: Date;
  @property({ attribute: false }) max?: Date;

  @state() private open = false;
  private _popover?: HTMLElement;
  private cleanup?: () => void;

  protected hostClasses(): string { return cx('lucent-date-picker', `lucent-date-picker--${this.size}`); }

  disconnectedCallback(): void { super.disconnectedCallback(); this._close(); }

  private _toggle(): void { this.open ? this._close() : this._open(); }

  private _open(): void {
    const trigger = this.querySelector<HTMLElement>('.lucent-date-picker__trigger');
    if (!trigger) return;
    this.open = true;
    const pop = document.createElement('div');
    pop.className = 'lucent-date-picker__popover';
    const cal = document.createElement('lucent-calendar') as LucentCalendar;
    cal.value = this.value;
    cal.month = this.value ?? new Date();
    if (this.min) cal.min = this.min;
    if (this.max) cal.max = this.max;
    cal.addEventListener('change', (e: Event) => this._choose((e as CustomEvent<{ value: Date }>).detail.value));
    pop.appendChild(cal);
    document.body.appendChild(pop);
    this._popover = pop;
    this.cleanup = autoUpdate(trigger, pop, () => {
      computePosition(trigger, pop, { placement: 'bottom-start', middleware: [offset(4), flip({ padding: 8 }), shift({ padding: 8 })] })
        .then(({ x, y }) => Object.assign(pop.style, { position: 'absolute', left: `${x}px`, top: `${y}px` }));
    });
    setTimeout(() => document.addEventListener('click', this._onOutside), 0);
  }

  private _close = (): void => {
    this.open = false;
    this.cleanup?.(); this.cleanup = undefined;
    this._popover?.remove(); this._popover = undefined;
    document.removeEventListener('click', this._onOutside);
  };

  private _onOutside = (e: Event): void => {
    const t = e.target as Node;
    if (!this.contains(t) && !this._popover?.contains(t)) this._close();
  };

  private _choose(date: Date): void {
    this.value = date;
    this.dispatchEvent(new CustomEvent('change', { detail: { value: date }, bubbles: true }));
    this._close();
  }

  protected render(): TemplateResult {
    return html`
      ${this.label ? html`<span class="lucent-date-picker__label">${this.label}</span>` : nothing}
      <button type="button" class=${cx('lucent-date-picker__trigger', this.open && 'lucent-date-picker__trigger--focus')}
        aria-haspopup="dialog" aria-expanded=${this.open} @click=${() => this._toggle()}>
        <lucent-icon class="lucent-date-picker__icon" name="calendar_today" size="sm"></lucent-icon>
        <span class=${cx('lucent-date-picker__value', !this.value && 'is-placeholder')}>${this.value ? fmtDate(this.value) : this.placeholder}</span>
        <lucent-icon class="lucent-date-picker__caret" name="arrow_drop_down" size="sm"></lucent-icon>
      </button>`;
  }
}

// ─── lucent-date-range-picker ───────────────────────────────────────────────
/** A field that opens a range Calendar in a floating popover (start–end dates). */
@customElement('lucent-date-range-picker')
export class LucentDateRangePicker extends LucentElement {
  @property({ attribute: false }) start?: Date;
  @property({ attribute: false }) end?: Date;
  @property() label = '';
  @property() placeholder = 'Select dates';
  @property() size: ControlSize = 'md';
  @property({ attribute: false }) min?: Date;
  @property({ attribute: false }) max?: Date;

  @state() private open = false;
  private _popover?: HTMLElement;
  private _cal?: LucentCalendar;
  private cleanup?: () => void;

  protected hostClasses(): string { return cx('lucent-date-picker', `lucent-date-picker--${this.size}`); }

  disconnectedCallback(): void { super.disconnectedCallback(); this._close(); }

  private _toggle(): void { this.open ? this._close() : this._open(); }

  private _open(): void {
    const trigger = this.querySelector<HTMLElement>('.lucent-date-picker__trigger');
    if (!trigger) return;
    this.open = true;
    const pop = document.createElement('div');
    pop.className = 'lucent-date-picker__popover';
    const cal = document.createElement('lucent-calendar') as LucentCalendar;
    cal.mode = 'range';
    cal.month = this.start ?? new Date();
    cal.rangeStart = this.start;
    cal.rangeEnd = this.end;
    if (this.min) cal.min = this.min;
    if (this.max) cal.max = this.max;
    cal.addEventListener('change', (e: Event) => this._choose((e as CustomEvent<{ value: Date }>).detail.value));
    pop.appendChild(cal);
    document.body.appendChild(pop);
    this._popover = pop;
    this._cal = cal;
    this.cleanup = autoUpdate(trigger, pop, () => {
      computePosition(trigger, pop, { placement: 'bottom-start', middleware: [offset(4), flip({ padding: 8 }), shift({ padding: 8 })] })
        .then(({ x, y }) => Object.assign(pop.style, { position: 'absolute', left: `${x}px`, top: `${y}px` }));
    });
    setTimeout(() => document.addEventListener('click', this._onOutside), 0);
  }

  private _close = (): void => {
    this.open = false;
    this.cleanup?.(); this.cleanup = undefined;
    this._popover?.remove(); this._popover = undefined;
    this._cal = undefined;
    document.removeEventListener('click', this._onOutside);
  };

  private _onOutside = (e: Event): void => {
    const t = e.target as Node;
    if (!this.contains(t) && !this._popover?.contains(t)) this._close();
  };

  private _choose(date: Date): void {
    if (!this.start || this.end) {
      this.start = date; this.end = undefined; // begin a fresh range
    } else if (date < this.start) {
      this.end = this.start; this.start = date; // normalize start ≤ end
    } else {
      this.end = date;
    }
    if (this._cal) { this._cal.rangeStart = this.start; this._cal.rangeEnd = this.end; }
    if (this.start && this.end) {
      this.dispatchEvent(new CustomEvent('change', { detail: { start: this.start, end: this.end }, bubbles: true }));
      this._close();
    }
  }

  protected render(): TemplateResult {
    return html`
      ${this.label ? html`<span class="lucent-date-picker__label">${this.label}</span>` : nothing}
      <button type="button" class=${cx('lucent-date-picker__trigger', this.open && 'lucent-date-picker__trigger--focus')}
        aria-haspopup="dialog" aria-expanded=${this.open} @click=${() => this._toggle()}>
        <lucent-icon class="lucent-date-picker__icon" name="date_range" size="sm"></lucent-icon>
        <span class=${cx('lucent-date-picker__value', !this.start && 'is-placeholder')}>${this.start ? fmtRange(this.start, this.end) : this.placeholder}</span>
        <lucent-icon class="lucent-date-picker__caret" name="arrow_drop_down" size="sm"></lucent-icon>
      </button>`;
  }
}

// ─── lucent-time-picker ─────────────────────────────────────────────────────
/** A field that opens an hour / minute / period column popover to pick a time of day. */
@customElement('lucent-time-picker')
export class LucentTimePicker extends LucentElement {
  @property({ attribute: false }) value?: Time;
  @property() label = '';
  @property() placeholder = 'Select time';
  @property() size: ControlSize = 'md';
  @property({ type: Number }) minuteStep = 5;

  @state() private open = false;
  private _popover?: HTMLElement;
  private cleanup?: () => void;

  protected hostClasses(): string { return cx('lucent-time-picker', `lucent-time-picker--${this.size}`); }

  disconnectedCallback(): void { super.disconnectedCallback(); this._close(); }

  private get _hours(): number[] { return Array.from({ length: 12 }, (_, i) => i + 1); }
  private get _minutes(): number[] {
    const step = this.minuteStep > 0 ? this.minuteStep : 5;
    const out: number[] = [];
    for (let m = 0; m < 60; m += step) out.push(m);
    return out;
  }

  private _toggle(): void { this.open ? this._close() : this._open(); }

  private _open(): void {
    const trigger = this.querySelector<HTMLElement>('.lucent-time-picker__trigger');
    if (!trigger) return;
    this.open = true;
    const pop = document.createElement('div');
    pop.className = 'lucent-time-picker__popover';
    document.body.appendChild(pop);
    this._popover = pop;
    this._renderPopover();
    this.cleanup = autoUpdate(trigger, pop, () => {
      computePosition(trigger, pop, { placement: 'bottom-start', middleware: [offset(4), flip({ padding: 8 }), shift({ padding: 8 })] })
        .then(({ x, y }) => Object.assign(pop.style, { position: 'absolute', left: `${x}px`, top: `${y}px` }));
    });
    setTimeout(() => document.addEventListener('click', this._onOutside), 0);
  }

  private _renderPopover(): void {
    if (!this._popover) return;
    const v = this.value;
    const selH = v ? to12h(v.hours) : null, selM = v ? v.minutes : null, selP = v ? periodOf(v.hours) : null;
    render(html`
      <div class="lucent-time-picker__col" role="listbox" aria-label="Hour">
        ${this._hours.map((h) => html`<button type="button" class=${cx('lucent-time-picker__cell', selH === h && 'is-selected')} @click=${() => this._pickHour(h)}>${h}</button>`)}
      </div>
      <div class="lucent-time-picker__col" role="listbox" aria-label="Minute">
        ${this._minutes.map((m) => html`<button type="button" class=${cx('lucent-time-picker__cell', selM === m && 'is-selected')} @click=${() => this._pickMinute(m)}>${String(m).padStart(2, '0')}</button>`)}
      </div>
      <div class="lucent-time-picker__col" role="listbox" aria-label="Period">
        ${(['AM', 'PM'] as const).map((p) => html`<button type="button" class=${cx('lucent-time-picker__cell', selP === p && 'is-selected')} @click=${() => this._pickPeriod(p)}>${p}</button>`)}
      </div>`, this._popover);
  }

  private _commit(t: Time): void {
    this.value = t;
    this.dispatchEvent(new CustomEvent('change', { detail: { value: t }, bubbles: true }));
    this._renderPopover();
  }

  private _pickHour(h12: number): void {
    const v = this.value;
    this._commit({ hours: from12h(h12, v ? periodOf(v.hours) : 'AM'), minutes: v ? v.minutes : 0 });
  }
  private _pickMinute(m: number): void {
    const v = this.value;
    this._commit({ hours: v ? v.hours : 9, minutes: m });
  }
  private _pickPeriod(p: 'AM' | 'PM'): void {
    const v = this.value;
    this._commit({ hours: from12h(v ? to12h(v.hours) : 12, p), minutes: v ? v.minutes : 0 });
  }

  private _close = (): void => {
    this.open = false;
    this.cleanup?.(); this.cleanup = undefined;
    this._popover?.remove(); this._popover = undefined;
    document.removeEventListener('click', this._onOutside);
  };

  private _onOutside = (e: Event): void => {
    const t = e.target as Node;
    if (!this.contains(t) && !this._popover?.contains(t)) this._close();
  };

  protected render(): TemplateResult {
    return html`
      ${this.label ? html`<span class="lucent-time-picker__label">${this.label}</span>` : nothing}
      <button type="button" class=${cx('lucent-time-picker__trigger', this.open && 'lucent-time-picker__trigger--focus')}
        aria-haspopup="dialog" aria-expanded=${this.open} @click=${() => this._toggle()}>
        <lucent-icon class="lucent-time-picker__icon" name="schedule" size="sm"></lucent-icon>
        <span class=${cx('lucent-time-picker__value', !this.value && 'is-placeholder')}>${this.value ? fmtTime(this.value) : this.placeholder}</span>
        <lucent-icon class="lucent-time-picker__caret" name="arrow_drop_down" size="sm"></lucent-icon>
      </button>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'lucent-calendar': LucentCalendar;
    'lucent-date-picker': LucentDatePicker;
    'lucent-date-range-picker': LucentDateRangePicker;
    'lucent-time-picker': LucentTimePicker;
  }
}
