import { ChangeDetectionStrategy, Component, booleanAttribute, input } from '@angular/core';
import { LucentIcon } from '../icon/icon';

export type MenuItemVariant = 'default' | 'danger';

@Component({
	selector: 'lucent-menu-item',
	standalone: true,
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [LucentIcon],
	templateUrl: './menu-item.html',
	// Styled by the shared base (styles/components/menu-item.css) via the lucent- contract.
	host: {
		'class': 'lucent-menu-item',
		'[class.is-active]': 'active()',
		'[class.is-danger]': 'variant() === "danger"',
		'role': 'menuitem',
		'tabindex': '0',
		'(keydown.enter)': '_onKeyActivate($event)',
		'(keydown.space)': '_onKeyActivate($event)',
	}
})
export class LucentMenuItem {
	readonly label = input('');
	readonly icon = input('');
	readonly active = input(false, { transform: booleanAttribute });
	readonly variant = input<MenuItemVariant>('default');

	_onKeyActivate(event: Event): void {
		event.preventDefault();
		(event.target as HTMLElement).click();
	}
}
