import { ChangeDetectionStrategy, Component, booleanAttribute, computed, input, model, output } from '@angular/core';
import { LucentIconButton, IconButtonSize } from '../icon-button/icon-button';
import { ControlSize } from '../sizing';

const BTN_SIZE: Record<ControlSize, IconButtonSize> = { xs: 'sm', sm: 'sm', md: 'md', lg: 'lg' };

/**
 * The message input for chat & messaging. A borderless textarea + a send button that morphs:
 * send → loading (`sending`) → stop ■ (while the agent `streaming`s). Enter sends, Shift+Enter
 * is a newline. Composes textarea + icon-button.
 */
@Component({
	selector: 'lucent-composer',
	standalone: true,
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [LucentIconButton],
	templateUrl: './composer.html',
	// Styled by the shared base (styles/components/composer.css) via the lucent- contract.
	host: {
		'[class]': '"lucent-composer lucent-composer--" + size() + (disabled() ? " lucent-composer--disabled" : "")',
	},
})
export class LucentComposer {
	readonly value = model('');
	readonly placeholder = input('Message…');
	readonly size = input<ControlSize>('md');
	readonly disabled = input(false, { transform: booleanAttribute });
	/** The message is being submitted (send shows a spinner). */
	readonly sending = input(false, { transform: booleanAttribute });
	/** The agent is streaming a reply (send morphs to Stop). */
	readonly streaming = input(false, { transform: booleanAttribute });

	readonly send = output<string>();
	readonly stop = output<void>();

	protected readonly btnSize = computed(() => BTN_SIZE[this.size()]);
	protected readonly canSend = computed(() =>
		!this.disabled() && !this.sending() && !this.streaming() && this.value().trim().length > 0);

	protected onInput(event: Event): void {
		this.value.set((event.target as HTMLTextAreaElement).value);
	}

	protected onEnter(event: Event): void {
		const e = event as KeyboardEvent;
		if (e.shiftKey) return; // newline
		e.preventDefault();
		this.doSend();
	}

	protected doSend(): void {
		if (!this.canSend()) return;
		const text = this.value().trim();
		this.value.set('');
		this.send.emit(text);
	}
}
