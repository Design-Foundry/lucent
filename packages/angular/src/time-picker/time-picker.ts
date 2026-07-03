import { ChangeDetectionStrategy, Component, computed, ElementRef, input, model, signal, viewChild } from '@angular/core';
import { ConnectedPosition, OverlayModule } from '@angular/cdk/overlay';
import { LucentIcon } from '../icon/icon';
import { ControlSize } from '../sizing';

export interface Time { hours: number; minutes: number; }

const to12h = (h: number): number => ((h + 11) % 12) + 1;
const periodOf = (h: number): 'AM' | 'PM' => (h < 12 ? 'AM' : 'PM');
const from12h = (h12: number, period: 'AM' | 'PM'): number => (period === 'PM' ? (h12 % 12) + 12 : h12 % 12);
const fmtTime = (t: Time): string => `${to12h(t.hours)}:${String(t.minutes).padStart(2, '0')} ${periodOf(t.hours)}`;

/**
 * Time Picker — a field that opens an hour / minute / period column popover to pick a time of day.
 * The chosen time is two-way bindable via `[(value)]`. Reuses the CDK connected overlay.
 */
@Component({
	selector: 'lucent-time-picker',
	standalone: true,
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [OverlayModule, LucentIcon],
	templateUrl: './time-picker.html',
	host: { '[class]': '"lucent-time-picker lucent-time-picker--" + size()' },
})
export class LucentTimePicker {
	readonly value = model<Time | null>(null);
	readonly label = input('');
	readonly placeholder = input('Select time');
	readonly size = input<ControlSize>('md');
	/** Minute granularity in the minute column. */
	readonly minuteStep = input(5);

	private readonly trigger = viewChild.required<ElementRef<HTMLElement>>('trigger');
	protected readonly isOpen = signal(false);

	protected readonly hours = Array.from({ length: 12 }, (_, i) => i + 1);
	protected readonly periods: ('AM' | 'PM')[] = ['AM', 'PM'];
	protected readonly minutes = computed(() => { const s = this.minuteStep() > 0 ? this.minuteStep() : 5; return Array.from({ length: Math.ceil(60 / s) }, (_, i) => i * s); });

	protected readonly display = computed(() => { const v = this.value(); return v ? fmtTime(v) : this.placeholder(); });
	protected readonly selH = computed(() => { const v = this.value(); return v ? to12h(v.hours) : null; });
	protected readonly selM = computed(() => this.value()?.minutes ?? null);
	protected readonly selP = computed(() => { const v = this.value(); return v ? periodOf(v.hours) : null; });

	readonly overlayPositions: ConnectedPosition[] = [
		{ originX: 'start', originY: 'bottom', overlayX: 'start', overlayY: 'top', offsetY: 4 },
		{ originX: 'start', originY: 'top', overlayX: 'start', overlayY: 'bottom', offsetY: -4 },
	];

	toggle(): void { this.isOpen() ? this.close() : this.isOpen.set(true); }
	close(): void { this.isOpen.set(false); }
	pad(m: number): string { return String(m).padStart(2, '0'); }

	pickHour(h12: number): void {
		const v = this.value();
		this.value.set({ hours: from12h(h12, v ? periodOf(v.hours) : 'AM'), minutes: v ? v.minutes : 0 });
	}
	pickMinute(m: number): void {
		const v = this.value();
		this.value.set({ hours: v ? v.hours : 9, minutes: m });
	}
	pickPeriod(p: 'AM' | 'PM'): void {
		const v = this.value();
		this.value.set({ hours: from12h(v ? to12h(v.hours) : 12, p), minutes: v ? v.minutes : 0 });
	}
}
