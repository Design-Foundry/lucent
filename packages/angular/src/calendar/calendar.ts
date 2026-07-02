import { ChangeDetectionStrategy, Component, computed, input, output, signal } from '@angular/core';
import { LucentIconButton } from '../icon-button/icon-button';

const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const sameDay = (a?: Date | null, b?: Date | null): boolean =>
	!!a && !!b && a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();

export type CalendarMode = 'single' | 'range';

interface Cell { date: Date; day: number; disabled: boolean; cls: string; }

/**
 * Month calendar — the date-picker atom. Monday-first 6×7 grid with today / selected / range
 * states. `month` sets the initial view; prev/next navigate internally and emit `monthChanged`.
 */
@Component({
	selector: 'lucent-calendar',
	standalone: true,
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [LucentIconButton],
	templateUrl: './calendar.html',
	host: { 'class': 'lucent-calendar' },
})
export class LucentCalendar {
	readonly month = input<Date>(new Date());
	readonly value = input<Date | null>(null);
	readonly mode = input<CalendarMode>('single');
	readonly rangeStart = input<Date | null>(null);
	readonly rangeEnd = input<Date | null>(null);
	readonly min = input<Date | null>(null);
	readonly max = input<Date | null>(null);
	readonly changed = output<Date>();
	readonly monthChanged = output<Date>();

	protected readonly weekdays = WEEKDAYS;
	private readonly _month = signal<Date | null>(null);
	protected readonly displayed = computed(() => this._month() ?? this.month());
	protected readonly title = computed(() => { const d = this.displayed(); return `${MONTHS[d.getMonth()]} ${d.getFullYear()}`; });

	protected readonly cells = computed<Cell[]>(() => {
		const cur = this.displayed(), y = cur.getFullYear(), m = cur.getMonth();
		const off = (new Date(y, m, 1).getDay() + 6) % 7;
		return Array.from({ length: 42 }, (_, i) => {
			const date = new Date(y, m, i - off + 1);
			return { date, day: date.getDate(), disabled: this.isDisabled(date), cls: this.cellClass(date, date.getMonth() !== m) };
		});
	});

	protected shift(delta: number): void {
		const cur = this.displayed();
		const next = new Date(cur.getFullYear(), cur.getMonth() + delta, 1);
		this._month.set(next);
		this.monthChanged.emit(next);
	}

	protected select(cell: Cell): void {
		if (cell.disabled) return;
		this.changed.emit(cell.date);
	}

	private isDisabled(date: Date): boolean {
		const mn = this.min(), mx = this.max();
		return (!!mn && date < mn) || (!!mx && date > mx);
	}

	private cellClass(date: Date, outside: boolean): string {
		const md = this.mode(), rs = this.rangeStart(), re = this.rangeEnd();
		const inRange = rs && re && date > rs && date < re;
		return [
			'lucent-day-cell',
			outside && 'lucent-day-cell--outside',
			sameDay(date, new Date()) && 'is-today',
			md === 'single' && sameDay(date, this.value()) && 'is-selected',
			md === 'range' && sameDay(date, rs) && 'is-range-start',
			md === 'range' && sameDay(date, re) && 'is-range-end',
			md === 'range' && inRange && 'is-range-middle',
		].filter(Boolean).join(' ');
	}
}
