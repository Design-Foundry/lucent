import { ChangeDetectionStrategy, Component, booleanAttribute, input, output } from '@angular/core';
import { ControlSize } from '../sizing';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'on-glass' | 'danger' | 'text';

@Component({
	selector: 'lucent-button',
	standalone: true,
	changeDetection: ChangeDetectionStrategy.OnPush,
	templateUrl: './button.html',
	// Styles come from the shared base (styles/lucent.css) via the lucent- class contract;
	// no per-component SCSS. The host carries the base + variant + size classes.
	host: {
		'[class]': '"lucent-button lucent-button--" + variant() + " lucent-button--" + size()',
		'[class.is-loading]': 'loading()'
	}
})
export class LucentButton {
	readonly variant = input<ButtonVariant>('primary');
	readonly size = input<ControlSize>('md');
	readonly loading = input(false, { transform: booleanAttribute });
	readonly disabled = input(false, { transform: booleanAttribute });
	readonly type = input<'button' | 'submit' | 'reset'>('button');
	readonly clicked = output<MouseEvent>();
}
