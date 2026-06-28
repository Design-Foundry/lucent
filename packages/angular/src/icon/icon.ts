import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

export type IconSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

@Component({
	selector: 'df-icon',
	standalone: true,
	changeDetection: ChangeDetectionStrategy.OnPush,
	templateUrl: './icon.html',
	styleUrl: './icon.scss',
	host: {
		// Decorative by default (hidden from AT); when ariaLabel is set the icon is
		// meaningful, so expose it as a labelled image instead.
		'[attr.aria-hidden]': 'ariaLabel() ? null : "true"',
		'[attr.role]': 'ariaLabel() ? "img" : null',
		'[attr.aria-label]': 'ariaLabel() || null',
	}
})
export class DfIcon {
	readonly name = input('widgets');
	readonly size = input<IconSize>('md');
	/** Set when the icon conveys meaning on its own. Leave empty for decorative icons. */
	readonly ariaLabel = input('');

	readonly px = computed(() => `var(--dimension--primitive--icon-${this.size()})`);
}
