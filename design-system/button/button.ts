import { ChangeDetectionStrategy, Component, booleanAttribute, input, output } from '@angular/core';
import { ControlSize } from '../sizing';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'on-glass' | 'danger' | 'text';

@Component({
	selector: 'df-button',
	standalone: true,
	changeDetection: ChangeDetectionStrategy.OnPush,
	templateUrl: './button.html',
	styleUrl: './button.scss',
	host: {
		'[class]': '"df-button--" + variant() + " df-button--" + size()',
		'[class.is-loading]': 'loading()'
	}
})
export class DfButton {
	readonly variant = input<ButtonVariant>('primary');
	readonly size = input<ControlSize>('md');
	readonly loading = input(false, { transform: booleanAttribute });
	readonly disabled = input(false, { transform: booleanAttribute });
	readonly type = input<'button' | 'submit' | 'reset'>('button');
	readonly clicked = output<MouseEvent>();
}
