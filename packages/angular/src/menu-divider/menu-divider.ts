import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
	selector: 'df-menu-divider',
	standalone: true,
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: '',
	// Styled by the shared base (styles/components/menu-divider.css) via the lucent- contract.
	host: { 'class': 'lucent-menu-divider', 'role': 'separator' }
})
export class DfMenuDivider {}
