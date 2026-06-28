import { ChangeDetectionStrategy, Component, booleanAttribute, computed, input, output } from '@angular/core';
import { DfIcon, IconSize } from '../icon/icon';
import { ButtonVariant } from '../button/button';

export type IconButtonSize = 'sm' | 'md' | 'lg';

const ICON_SIZE: Record<IconButtonSize, IconSize> = {
	sm: 'sm',
	md: 'md',
	lg: 'lg',
};

const SPINNER_DIAMETER: Record<IconButtonSize, number> = {
	sm: 12,
	md: 16,
	lg: 20,
};

@Component({
	selector: 'df-icon-button',
	standalone: true,
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [DfIcon],
	templateUrl: './icon-button.html',
	styleUrl: './icon-button.scss',
	host: {
		'[class]': '"df-icon-button--" + variant() + " df-icon-button--" + size()',
		'[class.is-loading]': 'loading()'
	}
})
export class DfIconButton {
	readonly icon = input('');
	readonly variant = input<ButtonVariant>('primary');
	readonly size = input<IconButtonSize>('md');
	readonly loading = input(false, { transform: booleanAttribute });
	readonly disabled = input(false, { transform: booleanAttribute });
	readonly type = input<'button' | 'submit' | 'reset'>('button');
	readonly ariaLabel = input('');
	readonly clicked = output<MouseEvent>();

	readonly iconSize = computed<IconSize>(() => ICON_SIZE[this.size()]);
	readonly spinnerDiameter = computed(() => SPINNER_DIAMETER[this.size()]);
}
