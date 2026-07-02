import { ChangeDetectionStrategy, Component, booleanAttribute, computed, input, output } from '@angular/core';
import { LucentBadge } from '../badge/badge';

/**
 * A row in a conversation/inbox list — a leading avatar (projected via `lucentLeading`), the
 * title + last-message preview, a time, and an unread badge. Rest / hover / active (the open
 * thread). Composes avatar + badge.
 */
@Component({
	selector: 'lucent-conversation-row',
	standalone: true,
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [LucentBadge],
	templateUrl: './conversation-row.html',
	// Styled by the shared base (styles/components/conversation-row.css) via the lucent- contract.
	host: {
		'[class]': '"lucent-conversation-row" + (active() ? " is-active" : "")',
		'role': 'button',
		'tabindex': '0',
		'[attr.aria-current]': 'active() ? "true" : null',
		'[attr.aria-label]': 'fullLabel()',
		'(click)': 'selected.emit()',
		'(keydown.enter)': 'onKey($event)',
		'(keydown.space)': 'onKey($event)',
	},
})
export class LucentConversationRow {
	readonly title = input('');
	readonly preview = input('');
	readonly time = input('');
	readonly unread = input(0);
	readonly active = input(false, { transform: booleanAttribute });

	readonly selected = output<void>();

	protected readonly unreadLabel = computed(() => (this.unread() > 99 ? '99+' : String(this.unread())));
	protected readonly fullLabel = computed(() =>
		this.unread() > 0 ? `${this.title()}, ${this.unread()} unread` : this.title());

	protected onKey(event: Event): void {
		event.preventDefault();
		this.selected.emit();
	}
}
