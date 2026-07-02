import { ChangeDetectionStrategy, Component, booleanAttribute, computed, inject, input, signal } from '@angular/core';
import { ControlSize } from '../sizing';
import { LucentRadioGroup } from './radio-group';

/**
 * A single radio button. Lives inside a `<lucent-radio-group>` — it reads its checked state
 * from the group (its `value` matches the group's) and asks the group to select it on click.
 */
@Component({
	selector: 'lucent-radio',
	standalone: true,
	changeDetection: ChangeDetectionStrategy.OnPush,
	templateUrl: './radio.html',
	// Styled by the shared base (styles/components/radio.css) via the lucent- contract.
	host: {
		'role': 'radio',
		'[class]': '"lucent-radio lucent-radio--" + effectiveSize()',
		'[class.is-checked]': 'checked()',
		'[class.is-disabled]': 'isDisabled()',
		'[class.is-focused]': 'isFocused()',
		'[attr.aria-checked]': 'checked()',
		'[attr.aria-disabled]': 'isDisabled() || null',
		'[attr.aria-label]': 'label() || null',
		// Roving-ish: the chosen radio (or the first, when none chosen) is the tab stop.
		'[attr.tabindex]': 'isDisabled() ? -1 : (checked() || !groupHasSelection() ? 0 : -1)',
		'(click)': 'select()',
		'(keydown.space)': '_onSpace($event)',
		'(keydown.enter)': '_onSpace($event)',
		'(focus)': 'isFocused.set(true)',
		'(blur)': 'isFocused.set(false)',
	},
})
export class LucentRadio<T = unknown> {
	private readonly group = inject<LucentRadioGroup<T>>(LucentRadioGroup, { optional: true });

	/** The identity this radio contributes to the group's value. */
	readonly value = input<T>();
	readonly label = input('');
	/** Optional per-radio density override; otherwise inherits the group's `size`. */
	readonly size = input<ControlSize>();
	readonly disabled = input(false, { transform: booleanAttribute });

	protected readonly isFocused = signal(false);

	readonly effectiveSize = computed<ControlSize>(() => this.size() ?? this.group?.size() ?? 'md');
	readonly checked = computed(() => !!this.group && this.group.value() === this.value());
	readonly isDisabled = computed(() => this.disabled() || !!this.group?.isDisabled());
	readonly groupHasSelection = computed(() => this.group != null && this.group.value() != null);

	select(): void {
		if (this.isDisabled() || !this.group) return;
		this.group.select(this.value() as T);
	}

	_onSpace(event: Event): void {
		event.preventDefault();
		this.select();
	}
}
