import { ChangeDetectionStrategy, Component, booleanAttribute, input, output } from '@angular/core';
import { DfIcon } from '../icon/icon';
import { DfButton } from '../button/button';

@Component({
	selector: 'df-snackbar',
	standalone: true,
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [DfIcon, DfButton],
	templateUrl: './snackbar.html',
	// Styled by the shared base (styles/components/snackbar.css) via the lucent- contract.
	host: { 'class': 'lucent-snackbar' }
})
export class DfSnackbar {
	readonly message = input('');
	readonly icon = input('widgets');
	readonly showIcon = input(true, { transform: booleanAttribute });
	readonly actionLabel = input('');
	readonly action = output<void>();
}
