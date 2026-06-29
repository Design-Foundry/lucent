import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
	selector: 'df-list',
	standalone: true,
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: '<ng-content />',
	// Styled by the shared base (styles/components/list.css) via the lucent- contract.
	host: { 'class': 'lucent-list' }
})
export class DfList {}
