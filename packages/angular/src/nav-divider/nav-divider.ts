import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
	selector: 'lucent-nav-divider',
	standalone: true,
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: '',
	// Styled by the shared base (styles/components/nav-divider.css) via the lucent- contract.
	host: { 'class': 'lucent-nav-divider' }
})
export class LucentNavDivider {}
