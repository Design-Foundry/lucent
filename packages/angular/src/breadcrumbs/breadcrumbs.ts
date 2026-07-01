import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

export interface BreadcrumbItem {
	label: string;
	path?: string;
	data?: unknown;
}

@Component({
	selector: 'lucent-breadcrumbs',
	standalone: true,
	changeDetection: ChangeDetectionStrategy.OnPush,
	templateUrl: './breadcrumbs.html',
	// Styled by the shared base (styles/components/breadcrumbs.css) via the lucent- contract.
	host: { 'class': 'lucent-breadcrumbs' }
})
export class LucentBreadcrumbs {
	readonly items = input<BreadcrumbItem[]>([]);
	readonly itemClick = output<BreadcrumbItem>();
}
