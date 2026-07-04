import { html, nothing, type TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { LucentElement } from './base';
import type { EventCategory, SchedulerEvent } from './scheduler';
import './scheduler'; // registers <lucent-month-cell>, <lucent-event-block>, <lucent-agenda-row>
import './controls'; // registers <lucent-icon-button> for the toolbars

/** A dated event (Month / Agenda views bucket these by day). */
export interface DatedEvent { date: Date; category: EventCategory; label: string; time?: string; }
/** A timed event (Week view positions these on the hour grid). `startHour`/`endHour` are decimal hours. */
export interface TimedEvent { date: Date; startHour: number; endHour: number; category: EventCategory; title: string; }

const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const sameDay = (a: Date, b: Date): boolean => a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
const dayKey = (d: Date): string => `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
const mondayOf = (d: Date): Date => { const off = (d.getDay() + 6) % 7; return new Date(d.getFullYear(), d.getMonth(), d.getDate() - off); };
const fmtMd = (d: Date): string => d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
const decHour = (d: Date): number => d.getHours() + d.getMinutes() / 60;

// ─── lucent-scheduler-month ─────────────────────────────────────────────────
/** A month calendar: toolbar + weekday row + 6×7 grid of month cells with chips. */
@customElement('lucent-scheduler-month')
export class LucentSchedulerMonth extends LucentElement {
  @property({ attribute: false }) month: Date = new Date();
  @property({ attribute: false }) events: DatedEvent[] = [];
  @property({ type: Number }) maxPerDay = 2;

  protected hostClasses(): string { return 'lucent-scheduler-month'; }

  private _shift(delta: number): void {
    this.month = new Date(this.month.getFullYear(), this.month.getMonth() + delta, 1);
    this.dispatchEvent(new CustomEvent('monthchange', { detail: { month: this.month }, bubbles: true }));
  }

  protected render(): TemplateResult {
    const y = this.month.getFullYear(), m = this.month.getMonth();
    const off = (new Date(y, m, 1).getDay() + 6) % 7;
    const byDay = new Map<string, SchedulerEvent[]>();
    for (const e of this.events) {
      const k = dayKey(e.date);
      let arr = byDay.get(k);
      if (!arr) { arr = []; byDay.set(k, arr); }
      arr.push({ category: e.category, label: e.label, time: e.time });
    }
    const today = new Date();
    const cells = Array.from({ length: 42 }, (_, i) => new Date(y, m, i - off + 1));
    return html`
      <div class="lucent-scheduler__header">
        <span class="lucent-scheduler__title">${MONTHS[m]} ${y}</span>
        <div class="lucent-scheduler__nav">
          <lucent-icon-button icon="chevron_left" variant="ghost" size="sm" label="Previous month" @click=${() => this._shift(-1)}></lucent-icon-button>
          <lucent-icon-button icon="chevron_right" variant="ghost" size="sm" label="Next month" @click=${() => this._shift(1)}></lucent-icon-button>
        </div>
      </div>
      <div class="lucent-scheduler-month__weekdays">
        ${WEEKDAYS.map((d) => html`<span class="lucent-scheduler-month__weekday">${d}</span>`)}
      </div>
      <div class="lucent-scheduler-month__grid">
        ${cells.map((date) => html`<lucent-month-cell
          .day=${date.getDate()}
          ?today=${sameDay(date, today)}
          ?outside=${date.getMonth() !== m}
          .events=${byDay.get(dayKey(date)) ?? []}
          .maxVisible=${this.maxPerDay}></lucent-month-cell>`)}
      </div>`;
  }
}

// ─── lucent-scheduler-week ──────────────────────────────────────────────────
/** A week time-grid: hour gutter + 7 day columns with time-positioned event blocks + now-line. */
@customElement('lucent-scheduler-week')
export class LucentSchedulerWeek extends LucentElement {
  @property({ attribute: false }) weekStart?: Date;
  @property({ attribute: false }) events: TimedEvent[] = [];
  @property({ type: Number }) startHour = 8;
  @property({ type: Number }) endHour = 18;
  @property({ type: Boolean }) showNow = true;

  private readonly _hourH = 44;

  protected hostClasses(): string { return 'lucent-scheduler-week'; }

  private _shift(deltaWeeks: number): void {
    const m = mondayOf(this.weekStart ?? new Date());
    this.weekStart = new Date(m.getFullYear(), m.getMonth(), m.getDate() + deltaWeeks * 7);
    this.dispatchEvent(new CustomEvent('weekchange', { detail: { weekStart: this.weekStart }, bubbles: true }));
  }

  protected render(): TemplateResult {
    const monday = mondayOf(this.weekStart ?? new Date());
    const days = Array.from({ length: 7 }, (_, i) => new Date(monday.getFullYear(), monday.getMonth(), monday.getDate() + i));
    const hours: number[] = [];
    for (let h = this.startHour; h < this.endHour; h++) hours.push(h);
    const today = new Date();
    const now = new Date();
    const nowDec = decHour(now);
    const nowTop = (nowDec - this.startHour) * this._hourH;
    const nowInRange = this.showNow && nowDec >= this.startHour && nowDec <= this.endHour;
    const title = `${fmtMd(days[0])} – ${fmtMd(days[6])}, ${days[6].getFullYear()}`;

    return html`
      <div class="lucent-scheduler__header">
        <span class="lucent-scheduler__title">${title}</span>
        <div class="lucent-scheduler__nav">
          <lucent-icon-button icon="chevron_left" variant="ghost" size="sm" label="Previous week" @click=${() => this._shift(-1)}></lucent-icon-button>
          <lucent-icon-button icon="chevron_right" variant="ghost" size="sm" label="Next week" @click=${() => this._shift(1)}></lucent-icon-button>
        </div>
      </div>
      <div class="lucent-scheduler-week__head">
        <span></span>
        ${days.map((d) => html`<span class="lucent-scheduler-week__day-head ${sameDay(d, today) ? 'is-today' : ''}">${WEEKDAYS[(d.getDay() + 6) % 7]} ${d.getDate()}</span>`)}
      </div>
      <div class="lucent-scheduler-week__body">
        <div class="lucent-scheduler-week__gutter">
          ${hours.map((h) => html`<span class="lucent-scheduler-week__hour" style="height:${this._hourH}px">${((h + 11) % 12) + 1}${h < 12 ? 'a' : 'p'}</span>`)}
        </div>
        ${days.map((day) => {
          const isToday = sameDay(day, today);
          const dayEvents = this.events.filter((e) => sameDay(e.date, day));
          return html`<div class="lucent-scheduler-week__col ${isToday ? 'is-today' : ''}" style="height:${hours.length * this._hourH}px">
            ${hours.map(() => html`<div class="lucent-scheduler-week__slot"></div>`)}
            ${dayEvents.map((e) => {
              const top = (e.startHour - this.startHour) * this._hourH;
              const height = (e.endHour - e.startHour) * this._hourH;
              const time = `${((Math.floor(e.startHour) + 11) % 12) + 1}${e.startHour < 12 ? 'a' : 'p'}`;
              return html`<div class="lucent-scheduler-week__event" style="top:${top}px;height:${height}px">
                <lucent-event-block category=${e.category} .title=${e.title} .time=${time}></lucent-event-block>
              </div>`;
            })}
            ${isToday && nowInRange ? html`<div class="lucent-scheduler-week__now" style="top:${nowTop}px"></div>` : nothing}
          </div>`;
        })}
      </div>`;
  }
}

// ─── lucent-scheduler-agenda ────────────────────────────────────────────────
/** A grouped list: events bucketed by day, each day a header + agenda rows. */
@customElement('lucent-scheduler-agenda')
export class LucentSchedulerAgenda extends LucentElement {
  @property({ attribute: false }) events: DatedEvent[] = [];
  @property() title = 'Upcoming';
  @property() emptyText = 'Nothing scheduled';

  protected hostClasses(): string { return 'lucent-scheduler-agenda'; }

  protected render(): TemplateResult {
    const today = new Date();
    const groups = new Map<string, { date: Date; items: DatedEvent[] }>();
    const sorted = [...this.events].sort((a, b) => a.date.getTime() - b.date.getTime());
    for (const e of sorted) {
      const k = dayKey(e.date);
      let g = groups.get(k);
      if (!g) { g = { date: e.date, items: [] }; groups.set(k, g); }
      g.items.push(e);
    }
    const dayLabel = (d: Date): string => sameDay(d, today) ? 'Today' : d.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });

    return html`
      <div class="lucent-scheduler__header">
        <span class="lucent-scheduler__title">${this.title}</span>
      </div>
      ${groups.size === 0
        ? html`<div class="lucent-scheduler-agenda__empty">${this.emptyText}</div>`
        : [...groups.values()].map((g) => html`
          <div class="lucent-scheduler-agenda__group">
            <span class="lucent-scheduler-agenda__day ${sameDay(g.date, today) ? 'is-today' : ''}">${dayLabel(g.date)}</span>
            ${g.items.map((e) => html`<lucent-agenda-row category=${e.category} .time=${e.time ?? ''} .title=${e.label}></lucent-agenda-row>`)}
          </div>`)}`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'lucent-scheduler-month': LucentSchedulerMonth;
    'lucent-scheduler-week': LucentSchedulerWeek;
    'lucent-scheduler-agenda': LucentSchedulerAgenda;
  }
}
