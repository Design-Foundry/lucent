import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
	selector: 'lucent-menu-divider',
	standalone: true,
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: '',
	// Styled by the shared base (styles/components/menu-divider.css) via the lucent- contract.
	host: { 'class': 'lucent-menu-divider', 'role': 'separator' }
})
/** @deprecated Use `<lucent-divider variant="plain">` (the unified Divider) instead. */
export class LucentMenuDivider {}
