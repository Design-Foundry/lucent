import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
	selector: 'df-list',
	standalone: true,
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: '<ng-content />',
	styleUrl: './list.scss'
})
export class DfList {}
