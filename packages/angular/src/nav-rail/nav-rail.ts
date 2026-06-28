import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
	selector: 'df-nav-rail',
	standalone: true,
	changeDetection: ChangeDetectionStrategy.OnPush,
	templateUrl: './nav-rail.html',
	styleUrl: './nav-rail.scss'
})
export class DfNavRail {}
