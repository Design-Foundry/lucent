import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { LucentIcon } from '../icon/icon';
import { ControlSize } from '../sizing';

export type ChipType = 'tag' | 'default' | 'active' | 'action';

@Component({
	selector: 'lucent-chip',
	standalone: true,
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [LucentIcon],
	templateUrl: './chip.html',
	// Styled by the shared base (styles/components/chip.css) via the lucent- contract.
	host: { '[class]': '"lucent-chip lucent-chip--" + type() + " lucent-chip--" + size()' }
})
export class LucentChip {
	readonly type = input<ChipType>('default');
	readonly size = input<ControlSize>('md');
	readonly label = input('');
	readonly closed = output<void>();
}
