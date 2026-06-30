import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
	selector: 'df-activity-bar',
	standalone: true,
	changeDetection: ChangeDetectionStrategy.OnPush,
	templateUrl: './activity-bar.html',
	// Styled by the shared base (styles/components/activity-bar.css) via the lucent- contract.
	host: { 'class': 'lucent-activity-bar' }
})
export class DfActivityBar {}
