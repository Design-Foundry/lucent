import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
	selector: 'df-menu',
	standalone: true,
	changeDetection: ChangeDetectionStrategy.OnPush,
	templateUrl: './menu.html',
	// Styled by the shared base (styles/components/menu.css) via the lucent- contract.
	host: { 'class': 'lucent-menu', 'role': 'menu' }
})
export class DfMenu {}
