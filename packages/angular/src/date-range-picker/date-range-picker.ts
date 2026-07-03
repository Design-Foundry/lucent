import { ChangeDetectionStrategy, Component, computed, ElementRef, input, model, signal, viewChild } from '@angular/core';
import { ConnectedPosition, OverlayModule } from '@angular/cdk/overlay';
import { LucentIcon } from '../icon/icon';
import { LucentCalendar } from '../calendar/calendar';
import { ControlSize } from '../sizing';

export interface DateRange { start: Date; end: Date; }

const fmtDate = (d: Date): string => d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
const fmtMd = (d: Date): string => d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
/** "Jul 9 – 12, 2026" (same month) · "Sep 28 – Oct 3, 2026" (same year) · full both otherwise. */
const fmtRange = (s: Date, e?: Date | null): string => {
	if (!e) return fmtDate(s);
	if (s.getFullYear() === e.getFullYear() && s.getMonth() === e.getMonth()) return `${fmtMd(s)} – ${e.getDate()}, ${e.getFullYear()}`;
	return `${s.getFullYear() === e.getFullYear() ? fmtMd(s) : fmtDate(s)} – ${fmtDate(e)}`;
};

/**
 * Date Range Picker — a field that opens the Calendar (range mode) in a floating popover.
 * The chosen start–end pair is two-way bindable via `[(value)]`. Reuses the `.lucent-date-picker`
 * shell (field + popover) and the CDK connected overlay.
 */
@Component({
	selector: 'lucent-date-range-picker',
	standalone: true,
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [OverlayModule, LucentIcon, LucentCalendar],
	templateUrl: './date-range-picker.html',
	host: { '[class]': '"lucent-date-picker lucent-date-picker--" + size()' },
})
export class LucentDateRangePicker {
	readonly value = model<DateRange | null>(null);
	readonly label = input('');
	readonly placeholder = input('Select dates');
	readonly size = input<ControlSize>('md');
	readonly min = input<Date | null>(null);
	readonly max = input<Date | null>(null);

	private readonly trigger = viewChild.required<ElementRef<HTMLElement>>('trigger');
	protected readonly isOpen = signal(false);
	// Working selection while the popover is open (committed to `value` once both ends are set).
	protected readonly start = signal<Date | null>(null);
	protected readonly end = signal<Date | null>(null);

	// Show the working range while open, the committed range when closed.
	protected readonly effStart = computed(() => this.isOpen() ? this.start() : (this.value()?.start ?? null));
	protected readonly effEnd = computed(() => this.isOpen() ? this.end() : (this.value()?.end ?? null));
	protected readonly display = computed(() => { const s = this.effStart(); return s ? fmtRange(s, this.effEnd()) : this.placeholder(); });
	protected readonly month = computed(() => this.start() ?? this.value()?.start ?? new Date());

	readonly overlayPositions: ConnectedPosition[] = [
		{ originX: 'start', originY: 'bottom', overlayX: 'start', overlayY: 'top', offsetY: 4 },
		{ originX: 'start', originY: 'top', overlayX: 'start', overlayY: 'bottom', offsetY: -4 },
	];

	toggle(): void {
		if (this.isOpen()) { this.close(); return; }
		const v = this.value();
		this.start.set(v?.start ?? null);
		this.end.set(v?.end ?? null);
		this.isOpen.set(true);
	}

	close(): void { this.isOpen.set(false); }

	choose(date: Date): void {
		const s = this.start(), e = this.end();
		let ns = s, ne = e;
		if (!s || e) { ns = date; ne = null; }       // begin a fresh range
		else if (date < s) { ne = s; ns = date; }    // normalize start ≤ end
		else { ne = date; }
		this.start.set(ns); this.end.set(ne);
		if (ns && ne) {
			this.value.set({ start: ns, end: ne });
			this.close();
			this.trigger().nativeElement.focus();
		}
	}
}
