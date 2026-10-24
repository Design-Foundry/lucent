import { ChangeDetectionStrategy, Component, booleanAttribute, input, output } from '@angular/core';
import { ControlSize } from '../sizing';

/**
 * Emphasis. `primary` completes the view's task, `secondary` is the alternative (filled like a
 * field), `text` is the transparent action for rows, toolbars and inline use. `danger` alone is
 * the solid destructive confirm.
 */
export type ButtonVariant = 'primary' | 'secondary' | 'text' | 'danger';

/** Tone layered on the variant. `danger` with `secondary` is the entry point into a destructive flow. */
export type ButtonTone = 'neutral' | 'danger';

@Component({
	selector: 'lucent-button',
	standalone: true,
	changeDetection: ChangeDetectionStrategy.OnPush,
	templateUrl: './button.html',
	// Styles come from the shared base (styles/core.css) via the lucent- class contract;
	// no per-component SCSS. The host carries the base + variant + size classes.
	host: {
		'[class]': '"lucent-button lucent-button--" + variant() + (tone() === "danger" ? " lucent-button--danger" : "") + " lucent-button--" + size()',
		'[class.is-loading]': 'loading()'
	}
})
export class LucentButton {
	readonly variant = input<ButtonVariant>('primary');
	readonly tone = input<ButtonTone>('neutral');
	readonly size = input<ControlSize>('md');
	readonly loading = input(false, { transform: booleanAttribute });
	readonly disabled = input(false, { transform: booleanAttribute });
	readonly type = input<'button' | 'submit' | 'reset'>('button');
	readonly clicked = output<MouseEvent>();
}
