import { html, nothing, type TemplateResult } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { autoUpdate, computePosition, flip, offset, shift } from '@floating-ui/dom';
import { LucentElement } from './base';
import { cx } from './cx';
import type { ControlSize } from './foundations';
import './controls'; // ensures <lucent-icon-button> is registered for the header nav

const fmtDate = (d: Date): string => d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

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

declare global {
  interface HTMLElementTagNameMap {
    'lucent-calendar': LucentCalendar;
    'lucent-date-picker': LucentDatePicker;
  }
}
