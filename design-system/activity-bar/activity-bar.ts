import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
	selector: 'df-activity-bar',
	standalone: true,
	changeDetection: ChangeDetectionStrategy.OnPush,
	templateUrl: './activity-bar.html',
	styleUrl: './activity-bar.scss'
})
export class DfActivityBar {}
