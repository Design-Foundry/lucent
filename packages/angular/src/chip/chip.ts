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
	styleUrl: './chip.scss',
	host: { '[class]': '"df-chip--" + type() + " df-chip--" + size()' }
})
export class DfChip {
	readonly type = input<ChipType>('default');
	readonly size = input<ControlSize>('md');
	readonly label = input('');
	readonly closed = output<void>();
}
