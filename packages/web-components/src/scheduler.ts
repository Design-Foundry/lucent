import { html, nothing, type TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { LucentElement } from './base';
import { cx } from './cx';

/** The kind of a scheduled event — drives its category color. */
export type EventCategory = 'work' | 'meeting' | 'personal' | 'deadline';

/** A single event, as consumed by the Month day cell. */
export interface SchedulerEvent { category: EventCategory; label: string; time?: string; }

// ─── lucent-event-chip ──────────────────────────────────────────────────────
/** Compact event pill shown inside month-view day cells. */
@customElement('lucent-event-chip')
export class LucentEventChip extends LucentElement {
  @property() category: EventCategory = 'work';
  @property() label = '';
  @property() time = '';

  protected hostClasses(): string { return cx('lucent-event-chip', `lucent-event-chip--${this.category}`); }

  protected render(): TemplateResult {
    return html`${this.time ? html`<span class="lucent-event-chip__time">${this.time}</span>` : nothing}<span class="lucent-event-chip__label">${this.label}</span>`;
  }
}

// ─── lucent-month-cell ──────────────────────────────────────────────────────
/** A tall month-grid day cell: a date badge + stacked event chips with overflow. */
@customElement('lucent-month-cell')
export class LucentMonthCell extends LucentElement {
  @property({ type: Number }) day = 1;
  @property({ type: Boolean }) today = false;
  @property({ type: Boolean }) outside = false;
  @property({ attribute: false }) events: SchedulerEvent[] = [];
  @property({ type: Number }) maxVisible = 2;

  protected hostClasses(): string {
    return cx('lucent-month-cell', this.today && 'lucent-month-cell--today', this.outside && 'lucent-month-cell--outside');
  }

  protected render(): TemplateResult {
    const shown = this.events.slice(0, this.maxVisible);
    const overflow = this.events.length - shown.length;
    return html`
      <span class="lucent-month-cell__date">${this.day}</span>
      <div class="lucent-month-cell__events">
        ${shown.map((e) => html`<lucent-event-chip category=${e.category} .label=${e.label} .time=${e.time ?? ''}></lucent-event-chip>`)}
        ${overflow > 0 ? html`<span class="lucent-month-cell__more">+${overflow} more</span>` : nothing}
      </div>`;
  }
}

// ─── lucent-event-block ─────────────────────────────────────────────────────
/** A week time-grid block. Sized (top/height) by its parent column; here it just fills. */
@customElement('lucent-event-block')
export class LucentEventBlock extends LucentElement {
  @property() category: EventCategory = 'work';
  @property() title = '';
  @property() time = '';

  protected hostClasses(): string { return cx('lucent-event-block', `lucent-event-block--${this.category}`); }

  protected render(): TemplateResult {
    return html`<span class="lucent-event-block__title">${this.title}</span>${this.time ? html`<span class="lucent-event-block__time">${this.time}</span>` : nothing}`;
  }
}

// ─── lucent-agenda-row ──────────────────────────────────────────────────────
/** A single row in the agenda (list) view. */
@customElement('lucent-agenda-row')
export class LucentAgendaRow extends LucentElement {
  @property() category: EventCategory = 'work';
  @property() time = '';
  @property() title = '';
  @property() subtitle = '';

  protected hostClasses(): string { return cx('lucent-agenda-row', `lucent-agenda-row--${this.category}`); }

  protected render(): TemplateResult {
    return html`
      <span class="lucent-agenda-row__time">${this.time}</span>
      <span class="lucent-agenda-row__bar"></span>
      <div class="lucent-agenda-row__content">
        <span class="lucent-agenda-row__title">${this.title}</span>
        ${this.subtitle ? html`<span class="lucent-agenda-row__subtitle">${this.subtitle}</span>` : nothing}
      </div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'lucent-event-chip': LucentEventChip;
    'lucent-month-cell': LucentMonthCell;
    'lucent-event-block': LucentEventBlock;
    'lucent-agenda-row': LucentAgendaRow;
  }
}
