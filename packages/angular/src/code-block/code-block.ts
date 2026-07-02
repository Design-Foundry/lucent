import { ChangeDetectionStrategy, Component, input, signal } from '@angular/core';
import { LucentIconButton } from '../icon-button/icon-button';

/**
 * A fenced code block with a language label and a copy button — for code the agent returns or a
 * user pastes. Monospace, scrollable, preserves whitespace.
 */
@Component({
	selector: 'lucent-code-block',
	standalone: true,
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [LucentIconButton],
	templateUrl: './code-block.html',
	// Styled by the shared base (styles/components/code-block.css) via the lucent- contract.
	host: { 'class': 'lucent-code-block' },
})
export class LucentCodeBlock {
	readonly language = input('');
	readonly code = input('');

	protected readonly copied = signal(false);

	protected copy(): void {
		void navigator.clipboard?.writeText(this.code());
		this.copied.set(true);
		setTimeout(() => this.copied.set(false), 1500);
	}
}
