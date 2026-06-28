import { ChangeDetectionStrategy, Component, booleanAttribute, input, output } from '@angular/core';
import { DfIconButton } from '../icon-button/icon-button';

export type ToastVariant = 'informative' | 'success' | 'warning' | 'error';

@Component({
	selector: 'df-toast',
	standalone: true,
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [DfIconButton],
	templateUrl: './toast.html',
	styleUrl: './toast.scss',
	host: {
		'role': 'status',
		'aria-live': 'polite',
		'[class.df-toast--informative]': 'variant() === "informative"',
		'[class.df-toast--success]':     'variant() === "success"',
		'[class.df-toast--warning]':     'variant() === "warning"',
		'[class.df-toast--error]':       'variant() === "error"',
	}
})
export class DfToast {
	readonly title = input('');
	readonly message = input('');
	readonly variant = input<ToastVariant>('informative');
	readonly closable = input(true, { transform: booleanAttribute });
	readonly closed = output<void>();
}
