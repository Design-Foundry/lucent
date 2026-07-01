import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
	selector: 'lucent-nav-rail',
	standalone: true,
	changeDetection: ChangeDetectionStrategy.OnPush,
	templateUrl: './nav-rail.html',
	// Styled by the shared base (styles/components/nav-rail.css) via the lucent- contract.
	host: { 'class': 'lucent-nav-rail' }
})
export class LucentNavRail {}
