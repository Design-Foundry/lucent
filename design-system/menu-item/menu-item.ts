import { ChangeDetectionStrategy, Component, booleanAttribute, input } from '@angular/core';
import { DfIcon } from '../icon/icon';

export type MenuItemVariant = 'default' | 'danger';

@Component({
	selector: 'df-menu-item',
	standalone: true,
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [DfIcon],
	templateUrl: './menu-item.html',
	styleUrl: './menu-item.scss',
	host: {
		'[class.is-active]': 'active()',
		'[class.is-danger]': 'variant() === "danger"',
		'role': 'menuitem',
		'tabindex': '0',
		'(keydown.enter)': '_onKeyActivate($event)',
		'(keydown.space)': '_onKeyActivate($event)',
	}
})
export class DfMenuItem {
	readonly label = input('');
	readonly icon = input('');
	readonly active = input(false, { transform: booleanAttribute });
	readonly variant = input<MenuItemVariant>('default');

	_onKeyActivate(event: Event): void {
		event.preventDefault();
		(event.target as HTMLElement).click();
	}
}
