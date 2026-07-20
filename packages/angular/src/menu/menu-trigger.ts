import {
	Directive,
	ElementRef,
	OnDestroy,
	TemplateRef,
	ViewContainerRef,
	inject,
	input,
} from '@angular/core';
import { ConnectedPosition, Overlay, OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import { Subscription, fromEvent } from 'rxjs';

const ANIM_MS = 120;

type MenuPosition = 'bottom-end' | 'bottom-start';

const POSITIONS: Record<MenuPosition, ConnectedPosition> = {
	'bottom-end':   { originX: 'end',   originY: 'bottom', overlayX: 'end',   overlayY: 'top', offsetY: 4 },
	'bottom-start': { originX: 'start', originY: 'bottom', overlayX: 'start', overlayY: 'top', offsetY: 4 },
};

/**
 * Opens a menu (a `TemplateRef`, usually a `lucent-menu`) in a CDK overlay anchored to the host.
 *
 * The overlay uses a **transparent, click-catching backdrop**: an outside click dismisses the menu,
 * and — since the backdrop also covers the trigger — a second click on the trigger closes it rather
 * than stacking a second menu. The backdrop blocks interaction with the rest of the view while open,
 * but does not dim it: a menu is not a modal. Escape and selecting an item also close it.
 */
@Directive({
	selector: '[lucentMenuTrigger]',
	standalone: true,
	host: {
		'(click)':         '_onClick($event)',
		'(keydown.enter)': '_onKeyActivate($event)',
		'(keydown.space)': '_onKeyActivate($event)',
		'style':           'cursor: pointer',
	},
})
export class LucentMenuTrigger implements OnDestroy {
	readonly template = input.required<TemplateRef<void>>({ alias: 'lucentMenuTrigger' });
	readonly lucentMenuPosition = input<MenuPosition>('bottom-end');

	private readonly _overlay = inject(Overlay);
	private readonly _el      = inject(ElementRef);
	private readonly _vcr     = inject(ViewContainerRef);

	private _overlayRef?: OverlayRef;
	private _subs: Subscription[] = [];
	private _closeTimer?: ReturnType<typeof setTimeout>;
	private _isOpen = false;

	_onClick(event: Event): void {
		event.stopPropagation();
		this._isOpen ? this.close() : this.open();
	}

	_onKeyActivate(event: Event): void {
		event.preventDefault();
		event.stopPropagation();
		this._isOpen ? this.close() : this.open();
	}

	open(): void {
		if (this._isOpen) return;
		this._isOpen = true;

		// Cancel and finish any in-flight close so its overlay can't outlive this open (leak guard
		// for a programmatic/keyboard reopen during the close animation; the backdrop covers the
		// pointer case).
		clearTimeout(this._closeTimer);
		this._disposeNow();

		const overlayRef = this._overlay.create({
			positionStrategy: this._overlay.position()
				.flexibleConnectedTo(this._el)
				.withPositions([POSITIONS[this.lucentMenuPosition()]]),
			scrollStrategy: this._overlay.scrollStrategies.reposition(),
			hasBackdrop: true,
			backdropClass: 'cdk-overlay-transparent-backdrop',
		});
		this._overlayRef = overlayRef;

		this._subs = [
			overlayRef.backdropClick().subscribe(() => this.close()),
			overlayRef.keydownEvents().subscribe(e => { if (e.key === 'Escape') this.close(); }),
			// Selecting an item bubbles a click to the panel → close.
			fromEvent(overlayRef.overlayElement, 'click').subscribe(() => this.close()),
		];

		overlayRef.attach(new TemplatePortal(this.template(), this._vcr));
	}

	close(): void {
		if (!this._isOpen) return;
		this._isOpen = false;
		clearTimeout(this._closeTimer);

		this._overlayRef?.overlayElement
			.querySelector('lucent-menu')
			?.classList.add('lucent-menu--closing');

		this._closeTimer = setTimeout(() => this._disposeNow(), ANIM_MS);
	}

	private _disposeNow(): void {
		for (const sub of this._subs) sub.unsubscribe();
		this._subs = [];
		this._overlayRef?.detach();
		this._overlayRef?.dispose();
		this._overlayRef = undefined;
	}

	ngOnDestroy(): void {
		clearTimeout(this._closeTimer);
		this._disposeNow();
	}
}
