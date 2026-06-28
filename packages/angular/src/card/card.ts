import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
	selector: 'df-card',
	standalone: true,
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: '<ng-content />',
	styleUrl: './card.scss'
})
export class DfCard {}
