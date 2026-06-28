import { ChangeDetectionStrategy, Component, booleanAttribute, input } from '@angular/core';
import { DfIcon } from '../icon/icon';

@Component({
	selector: 'df-nav-icon',
	standalone: true,
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [DfIcon],
	templateUrl: './nav-icon.html',
	styleUrl: './nav-icon.scss',
	host: {
		'[class.is-active]': 'active()',
		'[class.is-disabled]': 'disabled()',
		'[attr.aria-disabled]': 'disabled() || null',
		'[attr.aria-label]': 'ariaLabel() || null',
		'[attr.title]': 'ariaLabel() || null'
	}
})
export class DfNavIcon {
	readonly name = input('widgets');
	readonly active = input(false, { transform: booleanAttribute });
	readonly disabled = input(false, { transform: booleanAttribute });
	/** Accessible name for this icon-only nav item (required for AT). */
	readonly ariaLabel = input('');
}
