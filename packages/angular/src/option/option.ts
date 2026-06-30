import { ChangeDetectionStrategy, Component, booleanAttribute, input, output } from '@angular/core';

@Component({
	selector: 'lucent-option',
	standalone: true,
	changeDetection: ChangeDetectionStrategy.OnPush,
	templateUrl: './option.html',
	// Styled by the shared base (styles/components/option.css) via the lucent- contract.
	host: {
		'class': 'lucent-option',
		'role': 'option',
		'[attr.aria-selected]': 'selected()',
		'[attr.aria-disabled]': 'disabled() || null',
		'[class.is-selected]': 'selected()',
		'[class.is-active]': 'active()',
		'[class.is-disabled]': 'disabled()',
		'(click)': '!disabled() && optionSelect.emit(value())'
	}
})
export class LucentOption {
	readonly label = input('');
	readonly value = input<unknown>('');
	readonly selected = input(false, { transform: booleanAttribute });
	/** Keyboard-highlighted (aria-activedescendant target). Visual only — not focus. */
	readonly active = input(false, { transform: booleanAttribute });
	readonly disabled = input(false, { transform: booleanAttribute });
	readonly optionSelect = output<unknown>();
}
