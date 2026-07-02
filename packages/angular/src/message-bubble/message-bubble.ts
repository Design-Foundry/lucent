import { ChangeDetectionStrategy, Component, input } from '@angular/core';

export type MessageRole = 'user' | 'assistant' | 'system' | 'other';
export type MessageGroup = 'standalone' | 'continuation';

/**
 * A chat/message bubble serving AI chat and human messaging. `user` is accent-tinted with a
 * tail; `assistant`/`other` are surface bubbles; `system` is a quiet centered note. The body
 * projects rich content (text, reference-tags, code-block). Left/right row alignment is done
 * by the container at the usage site.
 */
@Component({
	selector: 'lucent-message-bubble',
	standalone: true,
	changeDetection: ChangeDetectionStrategy.OnPush,
	templateUrl: './message-bubble.html',
	// Styled by the shared base (styles/components/message-bubble.css) via the lucent- contract.
	host: {
		'[class]': '"lucent-message-bubble lucent-message-bubble--" + role() + " lucent-message-bubble--" + group()',
	},
})
export class LucentMessageBubble {
	readonly role = input<MessageRole>('assistant');
	readonly group = input<MessageGroup>('standalone');
	/** Optional author name shown in the meta line. */
	readonly author = input('');
	/** Optional timestamp string shown in the meta line. */
	readonly timestamp = input('');
}
