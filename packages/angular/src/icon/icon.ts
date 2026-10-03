import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { LUCENT_GLYPHS, LUCENT_GLYPH_ALIASES } from './glyphs';

export type IconSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

@Component({
	selector: 'lucent-icon',
	standalone: true,
	changeDetection: ChangeDetectionStrategy.OnPush,
	templateUrl: './icon.html',
	// Styles come from the shared base (styles/components/icon.css) via the lucent- class
	// contract; size is the --lucent-icon--{size} class (no inline font-size).
	host: {
		'[class]': '"lucent-icon lucent-icon--" + size()',
		// Decorative by default (hidden from AT); when ariaLabel is set the icon is
		// meaningful, so expose it as a labelled image instead.
		'[attr.aria-hidden]': 'ariaLabel() ? null : "true"',
		'[attr.role]': 'ariaLabel() ? "img" : null',
		'[attr.aria-label]': 'ariaLabel() || null',
	}
})
export class LucentIcon {
	/** A Lucent glyph name or a Material Icons name. Material names Lucent draws resolve to the Lucent glyph; the rest render from the Material Icons font. */
	readonly name = input('widgets');
	readonly size = input<IconSize>('md');
	/** Set when the icon conveys meaning on its own. Leave empty for decorative icons. */
	readonly ariaLabel = input('');

	protected readonly shapes = computed(() => LUCENT_GLYPHS[LUCENT_GLYPH_ALIASES[this.name()] ?? this.name()] ?? null);
}
