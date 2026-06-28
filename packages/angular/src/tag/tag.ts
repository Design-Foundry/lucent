import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
	selector: 'df-tag',
	standalone: true,
	changeDetection: ChangeDetectionStrategy.OnPush,
	templateUrl: './tag.html',
	styleUrl: './tag.scss'
})
export class DfTag {}
