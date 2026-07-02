import { ChangeDetectionStrategy, Component, booleanAttribute, input, model } from '@angular/core';
import { LucentIcon } from '../icon/icon';

let nextId = 0;

/**
 * A single disclosure — a header that toggles a content region. Stack several to build a
 * classic accordion (one-open coordination is left to the usage site).
 */
@Component({
	selector: 'lucent-accordion',
	standalone: true,
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [LucentIcon],
	templateUrl: './accordion.html',
	// Styled by the shared base (styles/components/accordion.css) via the lucent- contract.
	host: {
		'[class]': '"lucent-accordion" + (expanded() ? " is-expanded" : "") + (disabled() ? " is-disabled" : "")',
	},
})
export class LucentAccordion {
	readonly title = input('');
	readonly expanded = model(false);
	readonly disabled = input(false, { transform: booleanAttribute });

	readonly headerId = `lucent-accordion-h-${nextId}`;
	readonly contentId = `lucent-accordion-c-${nextId++}`;

	protected toggle(): void {
		if (this.disabled()) return;
		this.expanded.set(!this.expanded());
	}
}
