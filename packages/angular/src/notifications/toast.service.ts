import {
	ChangeDetectionStrategy,
	Component,
	ComponentRef,
	Injectable,
	Injector,
	inject,
	signal,
} from '@angular/core';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { DfToast, ToastVariant } from '../toast/toast';

export interface ToastOptions {
	title?: string;
	message?: string;
	variant?: ToastVariant;
	/** Auto-dismiss after N ms. 0 keeps it until dismissed. Default 5000. */
	duration?: number;
}

interface ActiveToast {
	id: number;
	title: string;
	message: string;
	variant: ToastVariant;
}

/** Stacked transient notifications, rendered top-right in a single CDK overlay. */
@Injectable({ providedIn: 'root' })
export class ToastService {
	private readonly overlay = inject(Overlay);
	private readonly injector = inject(Injector);
	private overlayRef?: OverlayRef;
	private outletRef?: ComponentRef<DfToastOutlet>;
	private seq = 0;

	readonly toasts = signal<ActiveToast[]>([]);

	show(options: ToastOptions): number {
		this.ensureHost();
		const id = ++this.seq;
		this.toasts.update(list => [...list, {
			id,
			title: options.title ?? '',
			message: options.message ?? '',
			variant: options.variant ?? 'informative',
		}]);
		this.refresh();

		const duration = options.duration ?? 5000;
		if (duration > 0) setTimeout(() => this.dismiss(id), duration);
		return id;
	}

	success(message: string, options?: Omit<ToastOptions, 'message' | 'variant'>): number {
		return this.show({ ...options, message, variant: 'success' });
	}
	info(message: string, options?: Omit<ToastOptions, 'message' | 'variant'>): number {
		return this.show({ ...options, message, variant: 'informative' });
	}
	warning(message: string, options?: Omit<ToastOptions, 'message' | 'variant'>): number {
		return this.show({ ...options, message, variant: 'warning' });
	}
	error(message: string, options?: Omit<ToastOptions, 'message' | 'variant'>): number {
		return this.show({ ...options, message, variant: 'error' });
	}

	dismiss(id: number): void {
		this.toasts.update(list => list.filter(t => t.id !== id));
		this.refresh();
	}

	private ensureHost(): void {
		if (this.overlayRef) return;
		this.overlayRef = this.overlay.create({
			positionStrategy: this.overlay.position().global().top('16px').right('16px'),
		});
		this.outletRef = this.overlayRef.attach(new ComponentPortal(DfToastOutlet, null, this.injector));
	}

	// A dynamically-attached overlay view doesn't pick up signal-driven CD under
	// zoneless, so refresh it explicitly after each change.
	private refresh(): void {
		this.outletRef?.changeDetectorRef.detectChanges();
	}
}

/** Renders the toast stack from the service's signal. Attached once into the overlay. */
@Component({
	selector: 'df-toast-outlet',
	standalone: true,
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [DfToast],
	template: `
		<div class="lucent-toast-stack" aria-live="polite" aria-atomic="false">
			@for (t of toasts.toasts(); track t.id) {
				<df-toast
					[title]="t.title"
					[message]="t.message"
					[variant]="t.variant"
					(closed)="toasts.dismiss(t.id)" />
			}
		</div>
	`,
	styles: `
		.lucent-toast-stack {
			display: flex;
			flex-direction: column;
			gap: var(--dimension--primitive--spacing-2);
			width: 360px;
			max-width: 90vw;
		}
	`,
})
export class DfToastOutlet {
	readonly toasts = inject(ToastService);
}
