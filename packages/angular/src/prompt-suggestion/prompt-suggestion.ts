import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { LucentIcon } from '../icon/icon';

export type PromptSuggestionVariant = 'card' | 'chip';

/**
 * A clickable starter for an empty chat — "Summarise this doc", "Write a test". `card` is roomy
 * (icon + title + optional description); `chip` is a compact pill. Emits its prompt on activation.
 */
@Component({
	selector: 'lucent-prompt-suggestion',
	standalone: true,
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [LucentIcon],
	templateUrl: './prompt-suggestion.html',
	// Styled by the shared base (styles/components/prompt-suggestion.css) via the lucent- contract.
	host: {
		'[class]': '"lucent-prompt-suggestion lucent-prompt-suggestion--" + variant()',
		'role': 'button',
		'tabindex': '0',
		'(click)': 'activate()',
		'(keydown.enter)': 'onKey($event)',
		'(keydown.space)': 'onKey($event)',
	},
})
export class LucentPromptSuggestion {
	readonly variant = input<PromptSuggestionVariant>('card');
	readonly label = input('');
	/** Second line (card variant only). */
	readonly description = input('');
	readonly icon = input('');
	/** Emitted with the prompt label when chosen. */
	readonly selected = output<string>();

	protected readonly showIcon = computed(() => !!this.icon());

	protected activate(): void {
		this.selected.emit(this.label());
	}

	protected onKey(event: Event): void {
		event.preventDefault();
		this.activate();
	}
}
