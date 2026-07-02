import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

export type TypingVariant = 'typing' | 'generating';

/**
 * A live indicator that sits in the stream where the next message will appear. `typing` = a
 * person is composing (bouncing dots); `generating` = the agent is producing (accent dots + an
 * optional label).
 */
@Component({
	selector: 'lucent-typing-indicator',
	standalone: true,
	changeDetection: ChangeDetectionStrategy.OnPush,
	templateUrl: './typing-indicator.html',
	// Styled by the shared base (styles/components/typing-indicator.css) via the lucent- contract.
	host: {
		'[class]': '"lucent-typing-indicator lucent-typing-indicator--" + variant()',
		'role': 'status',
		'aria-live': 'polite',
		'[attr.aria-label]': 'ariaLabel()',
	},
})
export class LucentTypingIndicator {
	readonly variant = input<TypingVariant>('typing');
	/** Optional label (defaults to "Generating…" for the generating variant). */
	readonly label = input('');

	protected readonly labelText = computed(() => this.label() || (this.variant() === 'generating' ? 'Generating…' : ''));
	protected readonly ariaLabel = computed(() => this.label() || (this.variant() === 'generating' ? 'Generating' : 'Typing'));
}
