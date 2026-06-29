import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
	selector: 'df-card',
	standalone: true,
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: '<ng-content />',
	// Styled by the shared base (styles/components/card.css) via the lucent- contract.
	host: { 'class': 'lucent-card' }
})
export class DfCard {}
