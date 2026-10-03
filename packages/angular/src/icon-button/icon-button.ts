import { ChangeDetectionStrategy, Component, booleanAttribute, computed, input, output } from '@angular/core';
import { LucentIcon, IconSize } from '../icon/icon';
import { ButtonVariant } from '../button/button';
import { ControlSize } from '../sizing';

export type IconButtonSize = ControlSize;

const ICON_SIZE: Record<IconButtonSize, IconSize> = {
	xs: 'sm',
	sm: 'md',
	md: 'md',
	lg: 'lg',
};

const SPINNER_DIAMETER: Record<IconButtonSize, number> = {
	xs: 12,
	sm: 14,
	md: 16,
	lg: 20,
};

@Component({
	selector: 'lucent-icon-button',
	standalone: true,
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [LucentIcon],
	templateUrl: './icon-button.html',
	// Styled by the shared base (styles/components/icon-button.css) via the lucent- contract.
	host: {
		'[class]': '"lucent-icon-button lucent-icon-button--" + variant() + " lucent-icon-button--" + size()',
		'[class.is-loading]': 'loading()'
	}
})
export class LucentIconButton {
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
