import { ChangeDetectionStrategy, Component, booleanAttribute, input, output } from '@angular/core';
import { LucentIcon } from '../icon/icon';
import { LucentButton } from '../button/button';

@Component({
	selector: 'lucent-snackbar',
	standalone: true,
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [LucentIcon, LucentButton],
	templateUrl: './snackbar.html',
	// Styled by the shared base (styles/components/snackbar.css) via the lucent- contract.
	host: { 'class': 'lucent-snackbar' }
})
export class LucentSnackbar {
	readonly message = input('');
	readonly icon = input('widgets');
	readonly showIcon = input(true, { transform: booleanAttribute });
	readonly actionLabel = input('');
	readonly action = output<void>();
}
