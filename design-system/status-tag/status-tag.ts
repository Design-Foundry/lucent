import { ChangeDetectionStrategy, Component, input } from '@angular/core';

export type StatusTagVariant = 'success' | 'neutral' | 'warning' | 'error';

@Component({
	selector: 'df-status-tag',
	standalone: true,
	changeDetection: ChangeDetectionStrategy.OnPush,
	templateUrl: './status-tag.html',
	styleUrl: './status-tag.scss',
	host: { '[class]': '"df-status-tag--" + variant()' }
})
export class DfStatusTag {
	readonly variant = input<StatusTagVariant>('success');
	readonly label = input('');
}
