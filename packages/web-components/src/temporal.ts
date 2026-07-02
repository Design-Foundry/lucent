import { html, type TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { LucentElement } from './base';
import { cx } from './cx';
import './controls'; // ensures <lucent-icon-button> is registered for the header nav

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

declare global {
  interface HTMLElementTagNameMap {
    'lucent-calendar': LucentCalendar;
  }
}
