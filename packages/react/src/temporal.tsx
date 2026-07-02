import { useState } from 'react';
import { cx } from './cx';
import { IconButton } from './controls';

const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const sameDay = (a?: Date, b?: Date): boolean =>
  !!a && !!b && a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();

export interface CalendarProps {
  /** Month to display initially (any date within it). Uncontrolled after mount unless `month` is provided. */
  defaultMonth?: Date;
  /** Controlled displayed month. */
  month?: Date;
  onMonthChange?: (month: Date) => void;
  /** Selected date (single mode). */
  value?: Date;
  onChange?: (date: Date) => void;
  mode?: 'single' | 'range';
  rangeStart?: Date;
  rangeEnd?: Date;
  min?: Date;
  max?: Date;
  className?: string;
}

/** Month calendar — the date-picker atom. Monday-first grid with today / selected / range states. */
export function Calendar({
  defaultMonth, month, onMonthChange, value, onChange,
  mode = 'single', rangeStart, rangeEnd, min, max, className,
}: CalendarProps) {
  const [internal, setInternal] = useState(() => defaultMonth ?? month ?? new Date());
  const cur = month ?? internal;

  const shift = (delta: number) => {
    const next = new Date(cur.getFullYear(), cur.getMonth() + delta, 1);
    if (month === undefined) setInternal(next);
    onMonthChange?.(next);
  };

  const y = cur.getFullYear(), m = cur.getMonth();
  const firstOffset = (new Date(y, m, 1).getDay() + 6) % 7; // Monday-first
  const cells = Array.from({ length: 42 }, (_, i) => {
    const date = new Date(y, m, i - firstOffset + 1);
    return { date, outside: date.getMonth() !== m };
  });

  const cellClass = (date: Date, outside: boolean) => {
    const inRange = rangeStart && rangeEnd && date > rangeStart && date < rangeEnd;
    return cx(
      'lucent-day-cell',
      outside && 'lucent-day-cell--outside',
      sameDay(date, new Date()) && 'is-today',
      mode === 'single' && sameDay(date, value) && 'is-selected',
      mode === 'range' && sameDay(date, rangeStart) && 'is-range-start',
      mode === 'range' && sameDay(date, rangeEnd) && 'is-range-end',
      mode === 'range' && inRange && 'is-range-middle',
    );
  };

  return (
    <div className={cx('lucent-calendar', className)}>
      <div className="lucent-calendar__header">
        <span className="lucent-calendar__title">{MONTHS[m]} {y}</span>
        <div className="lucent-calendar__nav">
          <IconButton icon="chevron_left" variant="ghost" size="sm" ariaLabel="Previous month" onClick={() => shift(-1)} />
          <IconButton icon="chevron_right" variant="ghost" size="sm" ariaLabel="Next month" onClick={() => shift(1)} />
        </div>
      </div>
      <div className="lucent-calendar__weekdays">
        {WEEKDAYS.map((d) => <span key={d} className="lucent-calendar__weekday">{d}</span>)}
      </div>
      <div className="lucent-calendar__grid" role="grid">
        {cells.map(({ date, outside }, i) => (
          <button
            key={i}
            className={cellClass(date, outside)}
            role="gridcell"
            disabled={(!!min && date < min) || (!!max && date > max)}
            aria-selected={sameDay(date, value)}
            onClick={() => onChange?.(date)}
          >{date.getDate()}</button>
        ))}
      </div>
    </div>
  );
}
