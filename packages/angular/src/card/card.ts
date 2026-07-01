import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
	selector: 'lucent-card',
	standalone: true,
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: '<ng-content />',
	// Styled by the shared base (styles/components/card.css) via the lucent- contract.
	host: { 'class': 'lucent-card' }
})
export class LucentCard {}
