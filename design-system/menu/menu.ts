import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
	selector: 'df-menu',
	standalone: true,
	changeDetection: ChangeDetectionStrategy.OnPush,
	templateUrl: './menu.html',
	styleUrl: './menu.scss'
})
export class DfMenu {}
