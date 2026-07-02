import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { LucentIcon } from '../icon/icon';
import { LucentBadge } from '../badge/badge';

/**
 * The floating action button that opens the chat — an accent circle with a lifted shadow and an
 * optional unread badge. (A sidebar entry-point reuses `nav-icon`; only this FAB is bespoke.)
 */
@Component({
	selector: 'lucent-chat-trigger',
	standalone: true,
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [LucentIcon, LucentBadge],
	templateUrl: './chat-trigger.html',
	// Styled by the shared base (styles/components/chat-trigger.css) via the lucent- contract.
	host: {
		'class': 'lucent-chat-trigger',
		'role': 'button',
		'tabindex': '0',
		'[attr.aria-label]': 'fullLabel()',
		'(click)': 'clicked.emit($event)',
		'(keydown.enter)': 'onKey($event)',
		'(keydown.space)': 'onKey($event)',
	},
})
export class LucentChatTrigger {
	readonly icon = input('forum');
	readonly unread = input(0);
	readonly ariaLabel = input('Open chat');
	readonly clicked = output<Event>();

	protected readonly unreadLabel = computed(() => (this.unread() > 99 ? '99+' : String(this.unread())));
	protected readonly fullLabel = computed(() =>
		this.unread() > 0 ? `${this.ariaLabel()}, ${this.unread()} unread` : this.ariaLabel());

	protected onKey(event: Event): void {
		event.preventDefault();
		this.clicked.emit(event);
	}
}
