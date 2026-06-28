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
import { DfSnackbar } from '../snackbar/snackbar';

export interface SnackbarOptions {
	message: string;
	icon?: string;
	showIcon?: boolean;
	actionLabel?: string;
	/** Auto-dismiss after N ms. 0 keeps it until dismissed. Default 5000. */
	duration?: number;
	onAction?: () => void;
}

interface ActiveSnackbar extends SnackbarOptions {
	id: number;
}

/** A single snackbar shown bottom-center; opening a new one replaces the current. */
@Injectable({ providedIn: 'root' })
export class SnackbarService {
	private readonly overlay = inject(Overlay);
	private readonly injector = inject(Injector);
	private overlayRef?: OverlayRef;
	private outletRef?: ComponentRef<DfSnackbarOutlet>;
	private timer?: ReturnType<typeof setTimeout>;
	private seq = 0;

	readonly current = signal<ActiveSnackbar | null>(null);

	open(options: SnackbarOptions): void {
		this.ensureHost();
		clearTimeout(this.timer);
		const id = ++this.seq;
		this.current.set({ ...options, id });
		this.refresh();

		const duration = options.duration ?? 5000;
		if (duration > 0) {
			this.timer = setTimeout(() => {
				if (this.current()?.id === id) this.dismiss();
			}, duration);
		}
	}

	action(): void {
		const current = this.current();
		current?.onAction?.();
		this.dismiss();
	}

	dismiss(): void {
		clearTimeout(this.timer);
		this.current.set(null);
		this.refresh();
	}

	private ensureHost(): void {
		if (this.overlayRef) return;
		this.overlayRef = this.overlay.create({
			positionStrategy: this.overlay.position().global().bottom('16px').centerHorizontally(),
		});
		this.outletRef = this.overlayRef.attach(new ComponentPortal(DfSnackbarOutlet, null, this.injector));
	}

	// Dynamically-attached overlay views don't pick up signal CD under zoneless.
	private refresh(): void {
		this.outletRef?.changeDetectorRef.detectChanges();
	}
}

/** Renders the current snackbar from the service. Attached once into the overlay. */
@Component({
	selector: 'df-snackbar-outlet',
	standalone: true,
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [DfSnackbar],
	template: `
		@if (snackbar.current(); as s) {
			<df-snackbar
				[message]="s.message"
				[icon]="s.icon ?? 'widgets'"
				[showIcon]="s.showIcon ?? true"
				[actionLabel]="s.actionLabel ?? ''"
				(action)="snackbar.action()" />
		}
	`,
})
export class DfSnackbarOutlet {
	readonly snackbar = inject(SnackbarService);
}
