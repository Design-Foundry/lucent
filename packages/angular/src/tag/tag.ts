import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
	selector: 'df-tag',
	standalone: true,
	changeDetection: ChangeDetectionStrategy.OnPush,
	templateUrl: './tag.html',
	// Styled by the shared base (styles/components/tag.css) via the lucent- class contract.
	host: { 'class': 'lucent-tag' }
})
export class DfTag {}
