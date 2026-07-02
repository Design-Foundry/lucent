import { useState } from 'react';
import { autoUpdate, flip, FloatingPortal, offset, shift, useClick, useDismiss, useFloating, useInteractions, useRole } from '@floating-ui/react';
import { cx } from './cx';
import { Icon } from './primitives';
import { IconButton } from './controls';
import type { ControlSize } from './foundations';

const fmtDate = (d: Date): string => d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

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

export interface DatePickerProps {
  value?: Date;
  onChange?: (date: Date) => void;
  label?: string;
  placeholder?: string;
  size?: ControlSize;
  min?: Date;
  max?: Date;
  className?: string;
}

/** A field that opens the Calendar in a floating popover (single date). */
export function DatePicker({ value, onChange, label, placeholder = 'Select date', size = 'md', min, max, className }: DatePickerProps) {
  const [open, setOpen] = useState(false);
  const { refs, floatingStyles, context } = useFloating({
    open, onOpenChange: setOpen, placement: 'bottom-start',
    middleware: [offset(4), flip({ padding: 8 }), shift({ padding: 8 })],
    whileElementsMounted: autoUpdate,
  });
  const { getReferenceProps, getFloatingProps } = useInteractions([
    useClick(context), useDismiss(context), useRole(context, { role: 'dialog' }),
  ]);
  const choose = (date: Date) => { onChange?.(date); setOpen(false); };

  return (
    <div className={cx('lucent-date-picker', `lucent-date-picker--${size}`, className)}>
      {label && <span className="lucent-date-picker__label">{label}</span>}
      <button
        ref={refs.setReference} {...getReferenceProps()}
        type="button"
        className={cx('lucent-date-picker__trigger', open && 'lucent-date-picker__trigger--focus')}
        aria-haspopup="dialog" aria-expanded={open}
      >
        <Icon className="lucent-date-picker__icon" name="calendar_today" size="sm" />
        <span className={cx('lucent-date-picker__value', !value && 'is-placeholder')}>{value ? fmtDate(value) : placeholder}</span>
        <Icon className="lucent-date-picker__caret" name="arrow_drop_down" size="sm" />
      </button>
      {open && (
        <FloatingPortal>
          <div ref={refs.setFloating} className="lucent-date-picker__popover" style={floatingStyles} {...getFloatingProps()}>
            <Calendar value={value} defaultMonth={value ?? new Date()} min={min} max={max} onChange={choose} />
          </div>
        </FloatingPortal>
      )}
    </div>
  );
}
