import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { LucentIcon } from '../icon/icon';

export type ReferenceKind = 'mention' | 'component' | 'token' | 'resource';

const DEFAULT_ICON: Record<ReferenceKind, string> = {
	mention: 'alternate_email',
	component: 'widgets',
	resource: 'link',
	token: 'palette',
};

/**
 * A small inline chip that references an entity inside prose — an @mention, a component, a
 * design token (with a colour swatch + mono name), or a resource (PR, doc). Type-aware leading;
 * flows inline with wrapping text (chat/discussion message bodies).
 */
@Component({
	selector: 'lucent-reference-tag',
	standalone: true,
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [LucentIcon],
	templateUrl: './reference-tag.html',
	// Styled by the shared base (styles/components/reference-tag.css) via the lucent- contract.
	host: { '[class]': '"lucent-reference-tag lucent-reference-tag--" + kind()' },
})
export class LucentReferenceTag {
	readonly kind = input<ReferenceKind>('mention');
	readonly label = input('');
	/** Override the default per-kind glyph. */
	readonly icon = input('');
	/** For `token`: a CSS colour shown as a swatch (e.g. the resolved token value). */
	readonly swatch = input('');

	protected readonly iconName = computed(() => this.icon() || DEFAULT_ICON[this.kind()]);
	protected readonly showSwatch = computed(() => this.kind() === 'token' && !!this.swatch());
}
