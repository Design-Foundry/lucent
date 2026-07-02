import { ChangeDetectionStrategy, Component, booleanAttribute, computed, input, output } from '@angular/core';
import { LucentIcon } from '../icon/icon';
import { LucentIconButton } from '../icon-button/icon-button';

export type InlineNoticeVariant = 'info' | 'success' | 'warning' | 'error';

const DEFAULT_ICON: Record<InlineNoticeVariant, string> = {
	info: 'info',
	success: 'check_circle',
	warning: 'warning',
	error: 'error',
};

/**
 * An in-flow banner tied to a region (a form section, a chat stream) — unlike a toast/snackbar
 * which floats and auto-dismisses. Carries a severity, an icon, a message (projected), and an
 * optional title and dismiss button.
 */
@Component({
	selector: 'lucent-inline-notice',
	standalone: true,
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [LucentIcon, LucentIconButton],
	templateUrl: './inline-notice.html',
	// Styled by the shared base (styles/components/inline-notice.css) via the lucent- contract.
	host: {
		'[class]': '"lucent-inline-notice lucent-inline-notice--" + variant()',
		'[attr.role]': 'role()',
	},
})
export class LucentInlineNotice {
	readonly variant = input<InlineNoticeVariant>('info');
	readonly title = input('');
	/** Override the default per-variant glyph. */
	readonly icon = input('');
	readonly dismissible = input(false, { transform: booleanAttribute });
	readonly dismissed = output<void>();

	protected readonly iconName = computed(() => this.icon() || DEFAULT_ICON[this.variant()]);
	protected readonly role = computed(() => (this.variant() === 'error' || this.variant() === 'warning') ? 'alert' : 'status');
}
