import {
	Component,
	Injectable,
	InjectionToken,
	Injector,
	inject,
} from '@angular/core';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal, ComponentType } from '@angular/cdk/portal';
import { DfButton } from '../button/button';
import { DfIconButton } from '../icon-button/icon-button';

const FOCUSABLE =
	'a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])';

/** Injected into dialog content components to read the data passed to open(). */
export const DIALOG_DATA = new InjectionToken<unknown>('DIALOG_DATA');

/** Handle to an open dialog. Resolve a result via close(); await it via `closed`. */
export class DialogRef<R = unknown> {
	private resolve!: (result: R | undefined) => void;
	readonly closed = new Promise<R | undefined>(r => (this.resolve = r));

	constructor(private readonly overlayRef: OverlayRef, private readonly restoreFocus: HTMLElement | null) {}

	close(result?: R): void {
		this.overlayRef.dispose();
		this.restoreFocus?.focus();
		this.resolve(result);
	}
}

export interface ConfirmOptions {
	title?: string;
	message?: string;
	confirmLabel?: string;
	cancelLabel?: string;
	variant?: 'confirmation' | 'destructive';
}

@Injectable({ providedIn: 'root' })
export class DialogService {
	private readonly overlay = inject(Overlay);
	private readonly parentInjector = inject(Injector);

	/** Open an arbitrary component as a modal dialog. */
	open<R = unknown, D = unknown>(component: ComponentType<unknown>, config?: { data?: D }): DialogRef<R> {
		const restoreFocus = document.activeElement as HTMLElement | null;
		const overlayRef = this.overlay.create({
			hasBackdrop: true,
			backdropClass: 'df-modal__scrim',
			scrollStrategy: this.overlay.scrollStrategies.block(),
			positionStrategy: this.overlay.position().global().centerHorizontally().centerVertically(),
		});

		const dialogRef = new DialogRef<R>(overlayRef, restoreFocus);
		const injector = Injector.create({
			parent: this.parentInjector,
			providers: [
				{ provide: DialogRef, useValue: dialogRef },
				{ provide: DIALOG_DATA, useValue: config?.data ?? null },
			],
		});

		overlayRef.attach(new ComponentPortal(component, null, injector));
		overlayRef.backdropClick().subscribe(() => dialogRef.close());
		overlayRef.keydownEvents().subscribe(e => {
			if (e.key === 'Escape') { e.preventDefault(); dialogRef.close(); }
			else if (e.key === 'Tab') this.trapTab(e, overlayRef);
		});
		queueMicrotask(() => overlayRef.overlayElement.querySelector<HTMLElement>(FOCUSABLE)?.focus());

		return dialogRef;
	}

	/** Convenience confirmation dialog. Resolves true if confirmed, false otherwise. */
	confirm(options: ConfirmOptions): Promise<boolean> {
		const ref = this.open<boolean, ConfirmOptions>(DfConfirmDialog, { data: options });
		return ref.closed.then(result => result === true);
	}

	private trapTab(event: KeyboardEvent, overlayRef: OverlayRef): void {
		const items = Array.from(overlayRef.overlayElement.querySelectorAll<HTMLElement>(FOCUSABLE));
		if (!items.length) return;
		const first = items[0];
		const last = items[items.length - 1];
		const active = document.activeElement;
		if (event.shiftKey && active === first) { event.preventDefault(); last.focus(); }
		else if (!event.shiftKey && active === last) { event.preventDefault(); first.focus(); }
	}
}

let nextId = 0;

/** Default content for DialogService.confirm(). */
@Component({
	selector: 'df-confirm-dialog',
	standalone: true,
	imports: [DfButton, DfIconButton],
	styleUrl: '../modal/modal.scss',
	template: `
		<div class="df-modal" role="dialog" aria-modal="true" [attr.aria-labelledby]="data.title ? titleId : null">
			<div class="df-modal__header">
				<span class="df-modal__title" [id]="titleId">{{ data.title }}</span>
				<df-icon-button icon="close" variant="ghost" size="sm" ariaLabel="Close" (clicked)="ref.close(false)" />
			</div>
			<div class="df-modal__body">
				<p>{{ data.message }}</p>
			</div>
			<div class="df-modal__footer">
				<df-button variant="ghost" (clicked)="ref.close(false)">{{ data.cancelLabel ?? 'Cancel' }}</df-button>
				<df-button
					[variant]="data.variant === 'destructive' ? 'danger' : 'primary'"
					(clicked)="ref.close(true)">
					{{ data.confirmLabel ?? 'Confirm' }}
				</df-button>
			</div>
		</div>
	`,
})
export class DfConfirmDialog {
	readonly ref = inject<DialogRef<boolean>>(DialogRef);
	readonly data = inject<ConfirmOptions>(DIALOG_DATA);
	readonly titleId = `df-confirm-${nextId++}`;
}
