import { ChangeDetectionStrategy, Component, input } from '@angular/core';

export type StatusTagVariant = 'success' | 'neutral' | 'warning' | 'error';

@Component({
	selector: 'df-status-tag',
	standalone: true,
	changeDetection: ChangeDetectionStrategy.OnPush,
	templateUrl: './status-tag.html',
	// Styled by the shared base (styles/components/status-tag.css) via the lucent- contract.
	host: { '[class]': '"lucent-status-tag lucent-status-tag--" + variant()' }
})
export class DfStatusTag {
	readonly variant = input<StatusTagVariant>('success');
	readonly label = input('');
}
