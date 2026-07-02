import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { LucentIcon } from '../icon/icon';

/**
 * A floating pill that appears when the message list is scrolled up — click to jump to the
 * newest message. Shows a count of unseen messages when there are any.
 */
@Component({
	selector: 'lucent-jump-to-latest',
	standalone: true,
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [LucentIcon],
	templateUrl: './jump-to-latest.html',
	// Styled by the shared base (styles/components/jump-to-latest.css) via the lucent- contract.
	host: {
		'class': 'lucent-jump-to-latest',
		'role': 'button',
		'tabindex': '0',
		'[attr.aria-label]': 'fullLabel()',
		'(click)': 'clicked.emit()',
		'(keydown.enter)': 'onKey($event)',
		'(keydown.space)': 'onKey($event)',
	},
})
export class LucentJumpToLatest {
	readonly count = input(0);
	readonly label = input('Jump to latest');
	readonly clicked = output<void>();

	protected readonly fullLabel = computed(() =>
		this.count() > 0 ? `${this.label()}, ${this.count()} new` : this.label());

	protected onKey(event: Event): void {
		event.preventDefault();
		this.clicked.emit();
	}
}
