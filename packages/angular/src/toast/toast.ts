import { ChangeDetectionStrategy, Component, booleanAttribute, input, output } from '@angular/core';
import { LucentIconButton } from '../icon-button/icon-button';

export type ToastVariant = 'informative' | 'success' | 'warning' | 'error';

@Component({
	selector: 'lucent-toast',
	standalone: true,
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [LucentIconButton],
	templateUrl: './toast.html',
	// Styled by the shared base (styles/components/toast.css) via the lucent- contract.
	host: {
		'class': 'lucent-toast',
		'role': 'status',
		'aria-live': 'polite',
		'[class.lucent-toast--informative]': 'variant() === "informative"',
		'[class.lucent-toast--success]':     'variant() === "success"',
		'[class.lucent-toast--warning]':     'variant() === "warning"',
		'[class.lucent-toast--error]':       'variant() === "error"',
	}
})
export class LucentToast {
	readonly title = input('');
	readonly message = input('');
	readonly variant = input<ToastVariant>('informative');
	readonly closable = input(true, { transform: booleanAttribute });
	readonly closed = output<void>();
}
