import { ChangeDetectionStrategy, Component, booleanAttribute, contentChild, input, output } from '@angular/core';
import { LucentIcon } from '../icon/icon';
import { LucentLeading, LucentSupporting } from '../slots/slots';
import { Tone } from '../tone';

/**
 * Reference row primitive (CONVENTIONS §5). An interactive, content-rich
 * list row that the rest of the kit's row components (`lucent-option`, `lucent-menu-item`)
 * specialize from. Demonstrates the kit conventions in one place:
 *
 * - **Rule 1 — content:** primary text projects via the default slot; `label` is a
 *   shorthand the projection overrides.
 * - **Rule 2 — adornments:** `lucentLeading` / `lucentTrailing` slots; `icon` is a leading
 *   shorthand the `lucentLeading` slot overrides.
 * - **Rule 4 — two-line:** `lucentSupporting` adds a secondary line.
 * - **Rule 5 — state:** `selected` (chosen, not keyboard-highlight), a standalone
 *   `disabled` input, and an `activated` output carrying the typed `value`.
 *
 * Selection is rendered visually on the base row; semantic selection ARIA
 * (`aria-selected`) is owned by listbox specializations such as `lucent-option`. For a
 * single-select navigation list, set `aria-current` at the usage site.
 */
@Component({
	selector: 'lucent-list-item',
	standalone: true,
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [LucentIcon],
	templateUrl: './list-item.html',
	// Styled by the shared base (styles/components/list-item.css) via the lucent- contract.
	host: {
		'class': 'lucent-list-item',
		'[class.is-selected]': 'selected()',
		'[class.is-disabled]': 'disabled()',
		'[class.is-interactive]': 'interactive()',
		'[class.is-danger]': 'tone() === "danger"',
		'[attr.role]': 'interactive() ? "button" : null',
		'[attr.tabindex]': 'interactive() && !disabled() ? 0 : null',
		'[attr.aria-disabled]': 'disabled() || null',
		'(click)': 'activate()',
		'(keydown.enter)': 'onKeyActivate($event)',
		'(keydown.space)': 'onKeyActivate($event)',
	}
})
export class LucentListItem<T = unknown> {
	/** Identity carried by `(activated)`; also the row's selection value. */
	readonly value = input<T>();

	/** Rule 1 shorthand — overridden by projected default content. */
	readonly label = input('');

	/** Rule 2 shorthand — a leading icon, overridden by projected `[lucentLeading]`. */
	readonly icon = input('');

	/** Chosen state (the `aria-selected` sense, owned by specializations). */
	readonly selected = input(false, { transform: booleanAttribute });

	readonly disabled = input(false, { transform: booleanAttribute });

	/** Adds `role="button"` + keyboard activation. Set false for a static row. */
	readonly interactive = input(true, { transform: booleanAttribute });

	/** Action intent — `danger` marks a destructive row (delete/remove) in red. */
	readonly tone = input<Tone>('default');

	readonly activated = output<T | undefined>();

	// Projected-slot presence: the icon shorthand only renders when no leading
	// slot is projected; the supporting line only renders when used.
	protected readonly leadingRef = contentChild(LucentLeading);
	protected readonly supportingRef = contentChild(LucentSupporting);

	protected activate(): void {
		if (this.interactive() && !this.disabled()) this.activated.emit(this.value());
	}

	protected onKeyActivate(event: Event): void {
		if (!this.interactive() || this.disabled()) return;
		event.preventDefault();
		this.activate();
	}
}
