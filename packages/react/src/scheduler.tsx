import type { CSSProperties } from 'react';
import { cx } from './cx';

/** The kind of a scheduled event — drives its category color. */
export type EventCategory = 'work' | 'meeting' | 'personal' | 'deadline';

/** A single event, as consumed by the Month day cell. */
export interface SchedulerEvent { category: EventCategory; label: string; time?: string; }

export interface EventChipProps {
  category?: EventCategory;
  label: string;
  time?: string;
  className?: string;
}

/** Compact event pill shown inside month-view day cells. */
export function EventChip({ category = 'work', label, time, className }: EventChipProps) {
  return (
    <span className={cx('lucent-event-chip', `lucent-event-chip--${category}`, className)}>
      {time && <span className="lucent-event-chip__time">{time}</span>}
      <span className="lucent-event-chip__label">{label}</span>
    </span>
  );
}

export interface MonthCellProps {
  day: number;
  today?: boolean;
  outside?: boolean;
  events?: SchedulerEvent[];
  maxVisible?: number;
  className?: string;
}

/** A tall month-grid day cell: a date badge + stacked event chips with overflow. */
export function MonthCell({ day, today = false, outside = false, events = [], maxVisible = 2, className }: MonthCellProps) {
  const shown = events.slice(0, maxVisible);
  const overflow = events.length - shown.length;
  return (
    <div className={cx('lucent-month-cell', today && 'lucent-month-cell--today', outside && 'lucent-month-cell--outside', className)}>
      <span className="lucent-month-cell__date">{day}</span>
      <div className="lucent-month-cell__events">
        {shown.map((e, i) => <EventChip key={i} category={e.category} label={e.label} time={e.time} />)}
        {overflow > 0 && <span className="lucent-month-cell__more">+{overflow} more</span>}
      </div>
    </div>
  );
}

export interface EventBlockProps {
  category?: EventCategory;
  title: string;
  time?: string;
  /** Positioning (top/height) is set by the parent time-grid column. */
  style?: CSSProperties;
  className?: string;
}

/** A week time-grid block. Sized (top/height) by its parent column via `style`. */
export function EventBlock({ category = 'work', title, time, style, className }: EventBlockProps) {
  return (
    <div className={cx('lucent-event-block', `lucent-event-block--${category}`, className)} style={style}>
      <span className="lucent-event-block__title">{title}</span>
      {time && <span className="lucent-event-block__time">{time}</span>}
    </div>
  );
}

export interface AgendaRowProps {
  category?: EventCategory;
  time: string;
  title: string;
  subtitle?: string;
  className?: string;
}

/** A single row in the agenda (list) view. */
export function AgendaRow({ category = 'work', time, title, subtitle, className }: AgendaRowProps) {
  return (
    <div className={cx('lucent-agenda-row', `lucent-agenda-row--${category}`, className)}>
      <span className="lucent-agenda-row__time">{time}</span>
      <span className="lucent-agenda-row__bar" />
      <div className="lucent-agenda-row__content">
        <span className="lucent-agenda-row__title">{title}</span>
        {subtitle && <span className="lucent-agenda-row__subtitle">{subtitle}</span>}
      </div>
    </div>
  );
}
