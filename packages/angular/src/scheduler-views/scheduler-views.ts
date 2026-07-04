import { ChangeDetectionStrategy, Component, computed, input, model } from '@angular/core';
import { LucentIconButton } from '../icon-button/icon-button';
import { LucentMonthCell, LucentEventBlock, LucentAgendaRow, type EventCategory, type SchedulerEvent } from '../scheduler/scheduler';

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

interface MonthCellVM { day: number; today: boolean; outside: boolean; events: SchedulerEvent[]; }

/** A month calendar: toolbar + weekday row + 6×7 grid of month cells with chips. */
@Component({
	selector: 'lucent-scheduler-month',
	standalone: true,
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [LucentIconButton, LucentMonthCell],
	host: { class: 'lucent-scheduler-month' },
	template: `
		<div class="lucent-scheduler__header">
			<span class="lucent-scheduler__title">{{ title() }}</span>
			<div class="lucent-scheduler__nav">
				<lucent-icon-button icon="chevron_left" variant="ghost" size="sm" ariaLabel="Previous month" (clicked)="shift(-1)" />
				<lucent-icon-button icon="chevron_right" variant="ghost" size="sm" ariaLabel="Next month" (clicked)="shift(1)" />
			</div>
		</div>
		<div class="lucent-scheduler-month__weekdays">
			@for (d of weekdays; track d) { <span class="lucent-scheduler-month__weekday">{{ d }}</span> }
		</div>
		<div class="lucent-scheduler-month__grid">
			@for (c of cells(); track $index) {
				<lucent-month-cell [day]="c.day" [today]="c.today" [outside]="c.outside" [events]="c.events" [maxVisible]="maxPerDay()" />
			}
		</div>
	`,
})
export class LucentSchedulerMonth {
	readonly month = model<Date>(new Date());
	readonly events = input<DatedEvent[]>([]);
	readonly maxPerDay = input(2);

	protected readonly weekdays = WEEKDAYS;
	protected readonly title = computed(() => { const d = this.month(); return `${MONTHS[d.getMonth()]} ${d.getFullYear()}`; });

	protected readonly cells = computed<MonthCellVM[]>(() => {
		const cur = this.month(), y = cur.getFullYear(), m = cur.getMonth();
		const off = (new Date(y, m, 1).getDay() + 6) % 7;
		const today = new Date();
		const byDay = new Map<string, SchedulerEvent[]>();
		for (const e of this.events()) {
			const k = dayKey(e.date);
			const arr = byDay.get(k) ?? [];
			arr.push({ category: e.category, label: e.label, time: e.time });
			byDay.set(k, arr);
		}
		return Array.from({ length: 42 }, (_, i) => {
			const date = new Date(y, m, i - off + 1);
			return { day: date.getDate(), today: sameDay(date, today), outside: date.getMonth() !== m, events: byDay.get(dayKey(date)) ?? [] };
		});
	});

	shift(delta: number): void {
		const cur = this.month();
		this.month.set(new Date(cur.getFullYear(), cur.getMonth() + delta, 1));
	}
}

interface WeekHeadVM { label: string; today: boolean; }
interface WeekEventVM { top: number; height: number; category: EventCategory; title: string; time: string; }
interface WeekColVM { today: boolean; showNow: boolean; events: WeekEventVM[]; }

/** A week time-grid: hour gutter + 7 day columns with time-positioned event blocks + now-line. */
@Component({
	selector: 'lucent-scheduler-week',
	standalone: true,
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [LucentIconButton, LucentEventBlock],
	host: { class: 'lucent-scheduler-week' },
	template: `
		<div class="lucent-scheduler__header">
			<span class="lucent-scheduler__title">{{ title() }}</span>
			<div class="lucent-scheduler__nav">
				<lucent-icon-button icon="chevron_left" variant="ghost" size="sm" ariaLabel="Previous week" (clicked)="shift(-1)" />
				<lucent-icon-button icon="chevron_right" variant="ghost" size="sm" ariaLabel="Next week" (clicked)="shift(1)" />
			</div>
		</div>
		<div class="lucent-scheduler-week__head">
			<span></span>
			@for (d of heads(); track $index) {
				<span class="lucent-scheduler-week__day-head" [class.is-today]="d.today">{{ d.label }}</span>
			}
		</div>
		<div class="lucent-scheduler-week__body">
			<div class="lucent-scheduler-week__gutter">
				@for (h of hours(); track h) { <span class="lucent-scheduler-week__hour" [style.height.px]="hourH">{{ label(h) }}</span> }
			</div>
			@for (col of columns(); track $index) {
				<div class="lucent-scheduler-week__col" [class.is-today]="col.today" [style.height.px]="bodyHeight()">
					@for (h of hours(); track h) { <div class="lucent-scheduler-week__slot"></div> }
					@for (e of col.events; track $index) {
						<div class="lucent-scheduler-week__event" [style.top.px]="e.top" [style.height.px]="e.height">
							<lucent-event-block [category]="e.category" [title]="e.title" [time]="e.time" />
						</div>
					}
					@if (col.showNow) { <div class="lucent-scheduler-week__now" [style.top.px]="nowTop()"></div> }
				</div>
			}
		</div>
	`,
})
export class LucentSchedulerWeek {
	readonly weekStart = model<Date | null>(null);
	readonly events = input<TimedEvent[]>([]);
	readonly startHour = input(8);
	readonly endHour = input(18);
	readonly showNow = input(true);

	protected readonly hourH = HOUR_H;
	protected label = hourLabel;

	private readonly monday = computed(() => mondayOf(this.weekStart() ?? new Date()));
	private readonly days = computed(() => { const m = this.monday(); return Array.from({ length: 7 }, (_, i) => new Date(m.getFullYear(), m.getMonth(), m.getDate() + i)); });
	protected readonly hours = computed(() => Array.from({ length: Math.max(0, this.endHour() - this.startHour()) }, (_, i) => this.startHour() + i));
	protected readonly bodyHeight = computed(() => this.hours().length * HOUR_H);
	protected readonly nowTop = computed(() => (decHour(new Date()) - this.startHour()) * HOUR_H);
	protected readonly title = computed(() => { const d = this.days(); return `${fmtMd(d[0])} – ${fmtMd(d[6])}, ${d[6].getFullYear()}`; });

	protected readonly heads = computed<WeekHeadVM[]>(() => {
		const today = new Date();
		return this.days().map((d) => ({ label: `${WEEKDAYS[(d.getDay() + 6) % 7]} ${d.getDate()}`, today: sameDay(d, today) }));
	});

	protected readonly columns = computed<WeekColVM[]>(() => {
		const today = new Date();
		const nowDec = decHour(today);
		const nowInRange = this.showNow() && nowDec >= this.startHour() && nowDec <= this.endHour();
		return this.days().map((day) => {
			const isToday = sameDay(day, today);
			const events = this.events().filter((e) => sameDay(e.date, day)).map<WeekEventVM>((e) => ({
				top: (e.startHour - this.startHour()) * HOUR_H,
				height: (e.endHour - e.startHour) * HOUR_H,
				category: e.category, title: e.title, time: hourLabel(e.startHour),
			}));
			return { today: isToday, showNow: isToday && nowInRange, events };
		});
	});

	shift(deltaWeeks: number): void {
		const m = this.monday();
		this.weekStart.set(new Date(m.getFullYear(), m.getMonth(), m.getDate() + deltaWeeks * 7));
	}
}

interface AgendaGroupVM { key: string; label: string; today: boolean; items: DatedEvent[]; }

/** A grouped list: events bucketed by day, each day a header + agenda rows. */
@Component({
	selector: 'lucent-scheduler-agenda',
	standalone: true,
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [LucentAgendaRow],
	host: { class: 'lucent-scheduler-agenda' },
	template: `
		<div class="lucent-scheduler__header"><span class="lucent-scheduler__title">{{ title() }}</span></div>
		@if (groups().length === 0) {
			<div class="lucent-scheduler-agenda__empty">{{ emptyText() }}</div>
		} @else {
			@for (g of groups(); track g.key) {
				<div class="lucent-scheduler-agenda__group">
					<span class="lucent-scheduler-agenda__day" [class.is-today]="g.today">{{ g.label }}</span>
					@for (e of g.items; track $index) {
						<lucent-agenda-row [category]="e.category" [time]="e.time ?? ''" [title]="e.label" />
					}
				</div>
			}
		}
	`,
})
export class LucentSchedulerAgenda {
	readonly events = input<DatedEvent[]>([]);
	readonly title = input('Upcoming');
	readonly emptyText = input('Nothing scheduled');

	protected readonly groups = computed<AgendaGroupVM[]>(() => {
		const today = new Date();
		const sorted = [...this.events()].sort((a, b) => a.date.getTime() - b.date.getTime());
		const map = new Map<string, AgendaGroupVM>();
		for (const e of sorted) {
			const k = dayKey(e.date);
			let g = map.get(k);
			if (!g) {
				g = { key: k, label: sameDay(e.date, today) ? 'Today' : e.date.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' }), today: sameDay(e.date, today), items: [] };
				map.set(k, g);
			}
			g.items.push(e);
		}
		return [...map.values()];
	});
}
