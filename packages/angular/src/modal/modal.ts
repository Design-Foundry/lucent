import {
	ChangeDetectionStrategy,
	Component,
	OnDestroy,
	TemplateRef,
	ViewContainerRef,
	computed,
	contentChild,
	effect,
	inject,
	input,
	model,
	output,
	viewChild,
} from '@angular/core';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import { DfButton } from '../button/button';
import { DfIconButton } from '../icon-button/icon-button';
import { DfModalActions, DfModalHeader } from '../slots/slots';

const FOCUSABLE =
	'a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])';

export type ModalVariant = 'informative' | 'confirmation' | 'interactive' | 'destructive';

let nextId = 0;

/**
 * Declarative dialog. Toggle with two-way `open`; renders into a centered CDK overlay
 * with a scrim, scroll-block, focus trap (auto-capture + return-focus), Escape and
 * backdrop dismissal, and role=dialog / aria-modal.
 */
@Component({
	selector: 'df-modal',
	standalone: true,
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [DfButton, DfIconButton],
	templateUrl: './modal.html'
	// Styled by the shared base (styles/components/modal.css) via the lucent- contract.
	// The panel + scrim render in a CDK overlay; the scrim class is set as backdropClass below.
})
export class DfModal implements OnDestroy {
	private readonly overlay = inject(Overlay);
	private readonly vcr = inject(ViewContainerRef);

	readonly open = model(false);
	readonly title = input('');
	readonly subtitle = input('');
	readonly variant = input<ModalVariant>('informative');
	readonly confirmLabel = input('Confirm');
	readonly cancelLabel = input('Cancel');

	readonly closed = output<void>();
	readonly confirmed = output<void>();
	readonly cancelled = output<void>();

	readonly titleId = `df-modal-${nextId++}-title`;

	// Projected-slot presence (header/actions override the title/subtitle inputs and
	// the variant-driven default footer, respectively).
	readonly headerRef = contentChild(DfModalHeader);
	readonly actionsRef = contentChild(DfModalActions);

	private readonly panel = viewChild.required<TemplateRef<unknown>>('panel');
	private overlayRef?: OverlayRef;
	private previousFocus: HTMLElement | null = null;

	readonly hasFooter = computed(() => !!this.actionsRef() || this.variant() !== 'informative');
	readonly isDestructive = computed(() => this.variant() === 'destructive');

	constructor() {
		effect(() => {
			this.open() ? this.attach() : this.detach();
		});
	}

	private attach(): void {
		if (this.overlayRef) return;
		this.previousFocus = document.activeElement as HTMLElement | null;
		this.overlayRef = this.overlay.create({
			hasBackdrop: true,
			backdropClass: 'lucent-modal__scrim',
			scrollStrategy: this.overlay.scrollStrategies.block(),
			positionStrategy: this.overlay.position().global().centerHorizontally().centerVertically(),
		});
		this.overlayRef.backdropClick().subscribe(() => this.close());
		this.overlayRef.keydownEvents().subscribe(e => {
			if (e.key === 'Escape') { e.preventDefault(); this.close(); }
			else if (e.key === 'Tab') this.trapTab(e);
		});
		this.overlayRef.attach(new TemplatePortal(this.panel(), this.vcr));
		queueMicrotask(() => this.focusables()[0]?.focus());
	}

	private detach(): void {
		this.overlayRef?.dispose();
		this.overlayRef = undefined;
		this.previousFocus?.focus();
		this.previousFocus = null;
	}

	private focusables(): HTMLElement[] {
		const host = this.overlayRef?.overlayElement;
		return host ? Array.from(host.querySelectorAll<HTMLElement>(FOCUSABLE)) : [];
	}

	private trapTab(event: KeyboardEvent): void {
		const items = this.focusables();
		if (!items.length) return;
		const first = items[0];
		const last = items[items.length - 1];
		const active = document.activeElement;
		if (event.shiftKey && active === first) { event.preventDefault(); last.focus(); }
		else if (!event.shiftKey && active === last) { event.preventDefault(); first.focus(); }
	}

	/** Dismiss (X, Escape, backdrop). */
	close(): void { this.closed.emit(); this.open.set(false); }

	cancel(): void { this.cancelled.emit(); this.open.set(false); }

	confirm(): void { this.confirmed.emit(); this.open.set(false); }

	ngOnDestroy(): void { this.detach(); }
}
