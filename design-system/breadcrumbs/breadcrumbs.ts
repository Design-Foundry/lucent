import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

export interface BreadcrumbItem {
	label: string;
	path?: string;
	data?: unknown;
}

@Component({
	selector: 'df-breadcrumbs',
	standalone: true,
	changeDetection: ChangeDetectionStrategy.OnPush,
	templateUrl: './breadcrumbs.html',
	styleUrl: './breadcrumbs.scss'
})
export class DfBreadcrumbs {
	readonly items = input<BreadcrumbItem[]>([]);
	readonly itemClick = output<BreadcrumbItem>();
}
