import { ChangeDetectionStrategy, Component, computed, ElementRef, input, model, signal, viewChild } from '@angular/core';
import { ConnectedPosition, OverlayModule } from '@angular/cdk/overlay';
import { LucentIcon } from '../icon/icon';
import { LucentCalendar } from '../calendar/calendar';
import { ControlSize } from '../sizing';

const fmtDate = (d: Date): string =>
	d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

/**
 * Date Picker — a field that opens the Calendar in a floating popover (single date).
 * The chosen date is two-way bindable via `[(value)]`. Reuses the CDK connected overlay
 * (as lucent-select does) to float the Calendar.
 */
@Component({
	selector: 'lucent-date-picker',
	standalone: true,
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [OverlayModule, LucentIcon, LucentCalendar],
	templateUrl: './date-picker.html',
	// Styled by the shared base (styles/components/date-picker.css) via the lucent- contract.
	host: { '[class]': '"lucent-date-picker lucent-date-picker--" + size()' },
})
export class LucentDatePicker {
	readonly value = model<Date | null>(null);
	readonly label = input('');
	readonly placeholder = input('Select date');
	readonly size = input<ControlSize>('md');
	readonly min = input<Date | null>(null);
	readonly max = input<Date | null>(null);

	private readonly trigger = viewChild.required<ElementRef<HTMLElement>>('trigger');
	protected readonly isOpen = signal(false);

	protected readonly display = computed(() => { const v = this.value(); return v ? fmtDate(v) : this.placeholder(); });
	protected readonly month = computed(() => this.value() ?? new Date());

	readonly overlayPositions: ConnectedPosition[] = [
		{ originX: 'start', originY: 'bottom', overlayX: 'start', overlayY: 'top', offsetY: 4 },
		{ originX: 'start', originY: 'top', overlayX: 'start', overlayY: 'bottom', offsetY: -4 },
	];

	toggle(): void { this.isOpen() ? this.close() : this.isOpen.set(true); }

	close(): void { this.isOpen.set(false); }

	choose(date: Date): void {
		this.value.set(date);
		this.close();
		this.trigger().nativeElement.focus();
	}
}
