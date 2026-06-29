import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { DfIcon } from '../icon/icon';
import { ControlSize } from '../sizing';

export type ChipType = 'tag' | 'default' | 'active' | 'action';

@Component({
	selector: 'df-chip',
	standalone: true,
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [DfIcon],
	templateUrl: './chip.html',
	// Styled by the shared base (styles/components/chip.css) via the lucent- contract.
	host: { '[class]': '"lucent-chip lucent-chip--" + type() + " lucent-chip--" + size()' }
})
export class DfChip {
	readonly type = input<ChipType>('default');
	readonly size = input<ControlSize>('md');
	readonly label = input('');
	readonly closed = output<void>();
}
