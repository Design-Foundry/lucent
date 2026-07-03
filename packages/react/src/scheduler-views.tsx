import { useState } from 'react';
import { cx } from './cx';
import { IconButton } from './controls';
import { MonthCell, EventBlock, AgendaRow } from './scheduler';
import type { EventCategory, SchedulerEvent } from './scheduler';

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
const hourLabel = (h: number): string => `${((Math.floor(h) + 11) % 12) + 1}${h < 12 ? 'a' : 'p'}`;

const HOUR_H = 44;

export interface SchedulerMonthProps {
  month?: Date;
  defaultMonth?: Date;
  onMonthChange?: (month: Date) => void;
  events?: DatedEvent[];
  maxPerDay?: number;
  className?: string;
}

/** A month calendar: toolbar + weekday row + 6×7 grid of month cells with chips. */
export function SchedulerMonth({ month, defaultMonth, onMonthChange, events = [], maxPerDay = 2, className }: SchedulerMonthProps) {
  const [internal, setInternal] = useState(() => defaultMonth ?? month ?? new Date());
  const cur = month ?? internal;
  const shift = (delta: number) => {
    const next = new Date(cur.getFullYear(), cur.getMonth() + delta, 1);
    if (month === undefined) setInternal(next);
    onMonthChange?.(next);
  };

  const y = cur.getFullYear(), m = cur.getMonth();
  const off = (new Date(y, m, 1).getDay() + 6) % 7;
  const today = new Date();
  const byDay = new Map<string, SchedulerEvent[]>();
  for (const e of events) {
    const k = dayKey(e.date);
    const arr = byDay.get(k) ?? [];
    arr.push({ category: e.category, label: e.label, time: e.time });
    byDay.set(k, arr);
  }
  const cells = Array.from({ length: 42 }, (_, i) => new Date(y, m, i - off + 1));

  return (
    <div className={cx('lucent-scheduler-month', className)}>
      <div className="lucent-scheduler__header">
        <span className="lucent-scheduler__title">{MONTHS[m]} {y}</span>
        <div className="lucent-scheduler__nav">
          <IconButton icon="chevron_left" variant="ghost" size="sm" ariaLabel="Previous month" onClick={() => shift(-1)} />
          <IconButton icon="chevron_right" variant="ghost" size="sm" ariaLabel="Next month" onClick={() => shift(1)} />
        </div>
      </div>
      <div className="lucent-scheduler-month__weekdays">
        {WEEKDAYS.map((d) => <span key={d} className="lucent-scheduler-month__weekday">{d}</span>)}
      </div>
      <div className="lucent-scheduler-month__grid">
        {cells.map((date, i) => (
          <MonthCell
            key={i}
            day={date.getDate()}
            today={sameDay(date, today)}
            outside={date.getMonth() !== m}
            events={byDay.get(dayKey(date)) ?? []}
            maxVisible={maxPerDay}
          />
        ))}
      </div>
    </div>
  );
}

export interface SchedulerWeekProps {
  weekStart?: Date;
  defaultWeekStart?: Date;
  onWeekChange?: (weekStart: Date) => void;
  events?: TimedEvent[];
  startHour?: number;
  endHour?: number;
  showNow?: boolean;
  className?: string;
}

/** A week time-grid: hour gutter + 7 day columns with time-positioned event blocks + now-line. */
export function SchedulerWeek({ weekStart, defaultWeekStart, onWeekChange, events = [], startHour = 8, endHour = 18, showNow = true, className }: SchedulerWeekProps) {
  const [internal, setInternal] = useState(() => mondayOf(defaultWeekStart ?? weekStart ?? new Date()));
  const monday = weekStart ? mondayOf(weekStart) : internal;
  const shift = (deltaWeeks: number) => {
    const next = new Date(monday.getFullYear(), monday.getMonth(), monday.getDate() + deltaWeeks * 7);
    if (weekStart === undefined) setInternal(next);
    onWeekChange?.(next);
  };

  const days = Array.from({ length: 7 }, (_, i) => new Date(monday.getFullYear(), monday.getMonth(), monday.getDate() + i));
  const hours = Array.from({ length: Math.max(0, endHour - startHour) }, (_, i) => startHour + i);
  const today = new Date();
  const now = new Date();
  const nowDec = decHour(now);
  const nowInRange = showNow && nowDec >= startHour && nowDec <= endHour;
  const nowTop = (nowDec - startHour) * HOUR_H;
  const title = `${fmtMd(days[0])} – ${fmtMd(days[6])}, ${days[6].getFullYear()}`;

  return (
    <div className={cx('lucent-scheduler-week', className)}>
      <div className="lucent-scheduler__header">
        <span className="lucent-scheduler__title">{title}</span>
        <div className="lucent-scheduler__nav">
          <IconButton icon="chevron_left" variant="ghost" size="sm" ariaLabel="Previous week" onClick={() => shift(-1)} />
          <IconButton icon="chevron_right" variant="ghost" size="sm" ariaLabel="Next week" onClick={() => shift(1)} />
        </div>
      </div>
      <div className="lucent-scheduler-week__head">
        <span />
        {days.map((d, i) => (
          <span key={i} className={cx('lucent-scheduler-week__day-head', sameDay(d, today) && 'is-today')}>{WEEKDAYS[(d.getDay() + 6) % 7]} {d.getDate()}</span>
        ))}
      </div>
      <div className="lucent-scheduler-week__body">
        <div className="lucent-scheduler-week__gutter">
          {hours.map((h) => <span key={h} className="lucent-scheduler-week__hour" style={{ height: HOUR_H }}>{hourLabel(h)}</span>)}
        </div>
        {days.map((day, di) => {
          const isToday = sameDay(day, today);
          const dayEvents = events.filter((e) => sameDay(e.date, day));
          return (
            <div key={di} className={cx('lucent-scheduler-week__col', isToday && 'is-today')} style={{ height: hours.length * HOUR_H }}>
              {hours.map((h) => <div key={h} className="lucent-scheduler-week__slot" />)}
              {dayEvents.map((e, ei) => (
                <div key={ei} className="lucent-scheduler-week__event" style={{ top: (e.startHour - startHour) * HOUR_H, height: (e.endHour - e.startHour) * HOUR_H }}>
                  <EventBlock category={e.category} title={e.title} time={hourLabel(e.startHour)} />
                </div>
              ))}
              {isToday && nowInRange && <div className="lucent-scheduler-week__now" style={{ top: nowTop }} />}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export interface SchedulerAgendaProps {
  events?: DatedEvent[];
  title?: string;
  emptyText?: string;
  className?: string;
}

/** A grouped list: events bucketed by day, each day a header + agenda rows. */
export function SchedulerAgenda({ events = [], title = 'Upcoming', emptyText = 'Nothing scheduled', className }: SchedulerAgendaProps) {
  const today = new Date();
  const sorted = [...events].sort((a, b) => a.date.getTime() - b.date.getTime());
  const groups = new Map<string, { date: Date; items: DatedEvent[] }>();
  for (const e of sorted) {
    const k = dayKey(e.date);
    const g = groups.get(k) ?? { date: e.date, items: [] };
    g.items.push(e);
    groups.set(k, g);
  }
  const dayLabel = (d: Date): string => sameDay(d, today) ? 'Today' : d.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });

  return (
    <div className={cx('lucent-scheduler-agenda', className)}>
      <div className="lucent-scheduler__header">
        <span className="lucent-scheduler__title">{title}</span>
      </div>
      {groups.size === 0 ? (
        <div className="lucent-scheduler-agenda__empty">{emptyText}</div>
      ) : (
        [...groups.values()].map((g, gi) => (
          <div key={gi} className="lucent-scheduler-agenda__group">
            <span className={cx('lucent-scheduler-agenda__day', sameDay(g.date, today) && 'is-today')}>{dayLabel(g.date)}</span>
            {g.items.map((e, ei) => <AgendaRow key={ei} category={e.category} time={e.time ?? ''} title={e.label} />)}
          </div>
        ))
      )}
    </div>
  );
}
